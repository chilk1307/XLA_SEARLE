"""
New demo features (plan 05, section 5.2; task C17), on top of the search engine of app.py:

    1. attribute re-ranking with explanations: constraints parsed from the caption, measured attributes of each result
       (dominant colour, L*, colourfulness, stripes), object mask, why a result moved up or down
    2. degraded query -> restoration: degrade the reference image, estimate the degradation, restore it and compare
       the results before / after restoration
    3. side-by-side comparison of methods: SEARLE, SEARLE + attributes, CLIP image, CLIP text, sum, classical CBIR
    4. "Why?": occlusion map of the reference image for one result

The image processing code is the one of the experiments (src/): degradations, restorations, degradation estimation,
attribute meters, CBIR features. Nothing here changes the search of app.py when the new options are off.
"""
import base64
import io
import sys
import threading
from pathlib import Path

import clip
import cv2
import numpy as np
import torch
import torch.nn.functional as F
from PIL import Image

SRC_DIR = Path(__file__).resolve().parents[1] / "src"
sys.path.insert(0, str(SRC_DIR))

from attributes import meters  # noqa: E402
from attributes.parser import parse_caption  # noqa: E402
from cbir import CBIR_FEATURES, CBIR_VERSION, CBIRFeatureExtractor, cbir_similarity  # noqa: E402
from degradation_estimation import estimate_features  # noqa: E402
from degradations import DEGRADATIONS  # noqa: E402
from encode_with_pseudo_tokens import encode_with_pseudo_tokens  # noqa: E402
from reference_processing import ReferenceProcessor  # noqa: E402
from restorations import RESTORATIONS, SPECIAL_RESTORATIONS  # noqa: E402

CLIP_MEAN = torch.tensor([0.48145466, 0.4578275, 0.40821073]).view(3, 1, 1)
CLIP_STD = torch.tensor([0.26862954, 0.26130258, 0.27577711]).view(3, 1, 1)
DEGRADE_CHOICES = ["none"] + [f"{d}:{lvl}" for d in DEGRADATIONS for lvl in (1, 2)]
RESTORE_CHOICES = ["none", "auto", "auto_iqa", "oracle"] + RESTORATIONS
RERANK_TOPK = 30  # candidates measured per query (measuring is the slow part on CPU)
DEFAULT_ATTR_WEIGHT = 2.0  # weight chosen on CIRR val in E2.3b (plans/nhiem_vu_Hoa.md, 14/11)
COMPARE_METHODS = [
    ("composed", "SEARLE (ảnh + mô tả)"),
    ("composed+attr", "SEARLE + xếp hạng lại thuộc tính"),
    ("clip_image", "Chỉ ảnh (đặc trưng CLIP)"),
    ("text", "Chỉ mô tả (CLIP text)"),
    ("sum", "Tổng ảnh + mô tả"),
    ("cbir", "CBIR cổ điển (màu, LBP, HOG, Gabor)"),
]
SHOWN_FEATURES = ["noise_sigma", "impulse_ratio", "laplacian_var", "hf_ratio", "blockiness", "l_mean", "cast"]


def to_rgb(image: Image.Image) -> np.ndarray:
    return np.asarray(image.convert("RGB"))


def data_url(rgb: np.ndarray, max_side: int = 480) -> str:
    im = Image.fromarray(rgb)
    im.thumbnail((max_side, max_side))
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=88)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()


def lab_to_hex(lab: np.ndarray) -> str:
    from skimage.color import lab2rgb
    rgb = np.clip(lab2rgb(np.asarray(lab, dtype=np.float64)[None, None])[0, 0], 0, 1)
    return "#" + "".join(f"{int(round(255 * v)):02x}" for v in rgb)


def attribute_summary(vector: np.ndarray) -> dict:
    """
    What the meters see in one image: dominant colours of the object, brightness, colourfulness, stripes
    """
    m = meters.unpack(vector)
    order = np.argsort(-m["obj_weights"])
    cand = vector[None].astype(np.float64)
    return {
        "colors": [{"hex": lab_to_hex(m["obj_centers"][i]), "share": round(float(m["obj_weights"][i]), 2)}
                   for i in order if m["obj_weights"][i] >= 0.08],
        "l_star": round(float(m["l_obj"][0]), 1),
        "colorfulness": round(float(m["m_obj"][0]), 1),
        "striped": round(float(meters.striped_scores(cand)[0]), 2),
        "patterned": round(float(meters.patterned_scores(cand)[0]), 2),
        "object_area": round(float(m["area"][0]), 2),
    }


class DemoFeatures:
    def __init__(self, engine, cache_dir: Path):
        self.e = engine
        self.cache_dir = cache_dir
        self.attr_file = cache_dir / "attributes.pt"
        self.cbir_file = cache_dir / "cbir.pt"
        self.attr: dict = {}
        self.cbir: dict = {}
        self.cache_lock = threading.Lock()
        self._load_caches()

    # -- caches ---------------------------------------------------------------------------------------------------------
    def _load_caches(self):
        try:
            data = torch.load(self.attr_file, map_location="cpu", weights_only=False)
            if data.get("version") == meters.METERS_VERSION:
                self.attr = data["vectors"]
        except Exception:  # noqa: BLE001  (no cache yet, or an old one)
            pass
        try:
            data = torch.load(self.cbir_file, map_location="cpu", weights_only=False)
            if data.get("version") == CBIR_VERSION:
                self.cbir = data["features"]
        except Exception:  # noqa: BLE001
            pass

    def _save(self, path: Path, payload: dict):
        path.parent.mkdir(parents=True, exist_ok=True)
        torch.save(payload, path)

    def gallery_rgb(self, img_id: str) -> np.ndarray:
        with Image.open(self.e.items[self.e.id2idx[img_id]]["path"]) as im:
            return to_rgb(im)

    def attributes(self, ids: list) -> dict:
        missing = [i for i in ids if i not in self.attr]
        for img_id in missing:
            try:
                vector = meters.measure(self.gallery_rgb(img_id), "auto")
            except Exception:  # noqa: BLE001  (unreadable image: neutral satisfaction below)
                vector = None
            with self.cache_lock:
                self.attr[img_id] = vector
        if missing:
            with self.cache_lock:
                self._save(self.attr_file, {"version": meters.METERS_VERSION, "vectors": dict(self.attr)})
        return {i: self.attr.get(i) for i in ids}

    def cbir_gallery(self) -> torch.Tensor:
        extractor = CBIRFeatureExtractor()
        ids = [it["id"] for it in self.e.items]
        missing = [i for i in ids if i not in self.cbir]
        for img_id in missing:
            try:
                with Image.open(self.e.items[self.e.id2idx[img_id]]["path"]) as im:
                    self.cbir[img_id] = extractor(im)
            except Exception:  # noqa: BLE001
                self.cbir[img_id] = None
        if missing:
            with self.cache_lock:
                self._save(self.cbir_file, {"version": CBIR_VERSION, "features": dict(self.cbir)})
        dim = next(v.shape[0] for v in self.cbir.values() if v is not None)
        return torch.stack([self.cbir[i] if self.cbir[i] is not None else torch.zeros(dim) for i in ids])

    # -- reference image processing ---------------------------------------------------------------------------------------
    @staticmethod
    def process_reference(rgb: np.ndarray, degrade: str, restore: str) -> dict:
        """
        Degrade then restore the reference image (same code and seeds as the experiments). Returns the images and what
        the estimator measured / chose.
        """
        out = {"original": rgb, "degraded": rgb, "restored": rgb, "info": {}}
        if degrade == "none" and restore == "none":
            return out
        if degrade != "none":
            out["degraded"], info = ReferenceProcessor(degrade, "none", "none", True).process_array(rgb, "demo")
            out["info"]["degraded"] = info
        out["restored"] = out["degraded"]
        if restore != "none":
            out["restored"], info = ReferenceProcessor(degrade, restore, "none", True).process_array(rgb, "demo")
            out["info"]["restored"] = info
            estimated = estimate_features(out["degraded"])
            out["info"]["estimated"] = {k: round(float(estimated[k]), 4) for k in SHOWN_FEATURES if k in estimated}
        return out

    # -- query features -------------------------------------------------------------------------------------------------
    @torch.no_grad()
    def encode(self, images: torch.Tensor, caption: str, mode: str):
        """
        Normalized query features of a batch of preprocessed reference images (and the pseudo tokens)
        """
        e = self.e
        with e.lock:
            x = images.to(e.device)
            img_f = e.clip.encode_image(x).float()
            token = None
            if mode in ("composed", "image"):
                token = e.phi(img_f)
                prompt = "a photo of $" if mode == "image" else f"a photo of $ that {caption}"
                tokens = clip.tokenize([prompt] * len(x), context_length=77, truncate=True).to(e.device)
                query = encode_with_pseudo_tokens(e.clip, tokens, token).float()
            elif mode == "clip_image":
                query = img_f
            else:
                text_f = e.clip.encode_text(clip.tokenize([caption], truncate=True).to(e.device)).float()
                text_f = text_f.expand(len(x), -1)
                query = text_f if mode == "text" else F.normalize(img_f, dim=-1) + F.normalize(text_f, dim=-1)
        return F.normalize(query, dim=-1).cpu(), None if token is None else token.cpu()

    def preprocess(self, rgb: np.ndarray) -> torch.Tensor:
        return self.e.preprocess(Image.fromarray(rgb))

    def scores(self, rgb: np.ndarray, caption: str, mode: str):
        if mode == "cbir":
            q = CBIRFeatureExtractor()(Image.fromarray(rgb))[None]
            return cbir_similarity(q, self.cbir_gallery(), CBIR_FEATURES)[0], None
        q, token = self.encode(self.preprocess(rgb)[None], caption, mode)
        return (q @ self.e.feats.T)[0], token

    # -- attribute re-ranking ---------------------------------------------------------------------------------------------
    def rerank(self, sims: torch.Tensor, caption: str, ref_rgb: np.ndarray, weight: float, excluded: set):
        """
        z(CLIP score) + w * mean satisfaction over the top-K, as src/attributes/rerank.py. Returns the new order of the
        top-K, the details of each candidate and the parsed constraints.
        """
        constraints = parse_caption(caption)
        order = [i for i in torch.argsort(sims, descending=True).tolist() if self.e.items[i]["id"] not in excluded]
        top = order[:RERANK_TOPK]
        if not constraints:
            return order, {}, []
        ids = [self.e.items[i]["id"] for i in top]
        measured = self.attributes(ids)
        ref_vector = meters.measure(ref_rgb, "auto") if any(c.relative for c in constraints) else None
        size = meters.VECTOR_SIZE
        vectors = np.stack([measured[i] if measured[i] is not None else np.zeros(size, np.float32) for i in ids])
        known = np.array([measured[i] is not None for i in ids])
        per_constraint = []
        for c in constraints:
            values = meters.satisfaction_batch(c, vectors, ref_vector)
            if values is not None:
                per_constraint.append((c, np.where(known, values, 0.5)))
        if not per_constraint:
            return order, {}, [c.describe() for c in constraints]
        satisfaction = np.mean([v for _, v in per_constraint], axis=0)
        clip_scores = sims[top].double().numpy()
        z = (clip_scores - clip_scores.mean()) / (clip_scores.std() + 1e-6)
        new_scores = z + weight * satisfaction
        new_top = [top[j] for j in np.argsort(-new_scores)]
        ref_dict = None if ref_vector is None else meters.unpack(ref_vector)
        details = {}
        for j, gi in enumerate(top):
            img_id = ids[j]
            details[gi] = {
                "clip_rank": j + 1, "clip_z": round(float(z[j]), 3), "satisfaction": round(float(satisfaction[j]), 3),
                "new_score": round(float(new_scores[j]), 3),
                "why": [meters.explain(c, meters.unpack(vectors[j]), ref_dict) for c, _ in per_constraint]
                if known[j] else ["không đọc được ảnh, coi như trung tính"],
                "attributes": attribute_summary(vectors[j]) if known[j] else None,
            }
        return new_top + order[RERANK_TOPK:], details, [c.describe() for c, _ in per_constraint]

    # -- endpoints --------------------------------------------------------------------------------------------------------
    def _result(self, i: int, score: float, rank: int, extra: dict = None) -> dict:
        item = self.e.items[i]
        out = {"id": item["id"], "name": item["name"], "score": round(float(score), 4), "rank": rank}
        if extra:
            out.update(extra)
        return out

    def search(self, ref: Image.Image, caption: str, mode: str, topk: int, exclude_id, degrade: str, restore: str,
               rerank: bool, weight: float) -> dict:
        caption = caption.replace("$", " ").strip()
        processed = self.process_reference(to_rgb(ref), degrade, restore)
        query_rgb = processed["restored"]
        excluded = {exclude_id} if exclude_id else set()
        sims, token = self.scores(query_rgb, caption, mode)
        k = min(topk, len(self.e.items) - len(excluded))

        details, constraints = {}, []
        if rerank and mode != "text" and caption:
            order, details, constraints = self.rerank(sims, caption, query_rgb, weight, excluded)
        else:
            order = [i for i in torch.argsort(sims, descending=True).tolist() if self.e.items[i]["id"] not in excluded]
        results = [self._result(i, sims[i], r + 1, details.get(i)) for r, i in enumerate(order[:k])]

        response = {
            "results": results, "mode": mode, "gallery_size": len(self.e.items), "constraints": constraints,
            "rerank": bool(details), "weight": weight,
            "neighbors": self.e.pseudo_word_neighbors(token[:1]) if token is not None else [],
            "prompt": {"composed": f"a photo of $ that {caption}", "image": "a photo of $", "text": caption,
                       "sum": f"ảnh + \"{caption}\"", "cbir": "đặc trưng màu, LBP, HOG, Gabor"}.get(mode, caption),
        }
        if degrade != "none" or restore != "none":
            response["processing"] = {
                "degrade": degrade, "restore": restore,
                "images": {k2: data_url(processed[k2]) for k2 in ("original", "degraded", "restored")},
                "info": processed["info"],
            }
            if restore != "none" and mode != "text":
                before, _ = self.scores(processed["degraded"], caption, mode)
                before_order = [i for i in torch.argsort(before, descending=True).tolist()
                                if self.e.items[i]["id"] not in excluded]
                response["before_restoration"] = [self._result(i, before[i], r + 1)
                                                  for r, i in enumerate(before_order[:k])]
        return response

    def compare(self, ref: Image.Image, caption: str, topk: int, exclude_id, degrade: str, restore: str) -> dict:
        caption = caption.replace("$", " ").strip()
        rgb = self.process_reference(to_rgb(ref), degrade, restore)["restored"]
        excluded = {exclude_id} if exclude_id else set()
        columns = []
        for key, label in COMPARE_METHODS:
            mode = "composed" if key == "composed+attr" else key
            if mode in ("text", "sum") and not caption:
                continue
            sims, _ = self.scores(rgb, caption, mode)
            if key == "composed+attr":
                order, details, constraints = self.rerank(sims, caption, rgb, DEFAULT_ATTR_WEIGHT, excluded)
                if not details:
                    continue
                label += f" (w = {DEFAULT_ATTR_WEIGHT:g}; {', '.join(constraints)})"
            else:
                order = [i for i in torch.argsort(sims, descending=True).tolist()
                         if self.e.items[i]["id"] not in excluded]
            columns.append({"key": key, "label": label,
                            "results": [self._result(i, sims[i], r + 1) for r, i in enumerate(order[:topk])]})
        return {"columns": columns, "gallery_size": len(self.e.items)}

    @torch.no_grad()
    def why(self, ref: Image.Image, caption: str, mode: str, target_id: str, degrade: str, restore: str,
            patch: int = 56, stride: int = 28) -> dict:
        """
        Occlusion map: grey out one patch of the reference image at a time and measure how much the score of the
        target image drops. Red = the target depends on that region.
        """
        if mode in ("text", "cbir"):
            raise ValueError("Bản đồ che khuất chỉ có cho các chế độ dùng ảnh tham chiếu qua CLIP")
        if target_id not in self.e.id2idx:
            raise ValueError("Ảnh kết quả không còn trong thư viện")
        caption = caption.replace("$", " ").strip()
        rgb = self.process_reference(to_rgb(ref), degrade, restore)["restored"]
        image = self.preprocess(rgb)
        _, h, w = image.shape
        grey = (0.5 - CLIP_MEAN) / CLIP_STD
        ys, xs = list(range(0, h - patch + 1, stride)), list(range(0, w - patch + 1, stride))
        batch = [image]
        for y in ys:
            for x in xs:
                occluded = image.clone()
                occluded[:, y:y + patch, x:x + patch] = grey
                batch.append(occluded)
        target = self.e.feats[self.e.id2idx[target_id]]
        scores = []
        for i in range(0, len(batch), 32):
            q, _ = self.encode(torch.stack(batch[i:i + 32]), caption, mode)
            scores.append(q @ target)
        scores = torch.cat(scores).numpy()
        base, drops = float(scores[0]), np.zeros((h, w), np.float64)
        counts = np.zeros((h, w), np.float64)
        for n, (y, x) in enumerate([(y, x) for y in ys for x in xs], start=1):
            drops[y:y + patch, x:x + patch] += base - scores[n]
            counts[y:y + patch, x:x + patch] += 1
        heat = drops / np.maximum(counts, 1)
        shown = ((image * CLIP_STD + CLIP_MEAN).clamp(0, 1).permute(1, 2, 0).numpy() * 255).astype(np.uint8)
        scale = max(float(np.abs(heat).max()), 1e-6)
        colored = cv2.applyColorMap(np.uint8(255 * np.clip(heat / scale, 0, 1)), cv2.COLORMAP_JET)[..., ::-1]
        overlay = (0.55 * shown + 0.45 * colored).astype(np.uint8)

        out = {"base_score": round(base, 4), "max_drop": round(float(heat.max()), 4),
               "overlay": data_url(overlay, 448), "reference": data_url(shown, 448),
               "patch": patch, "stride": stride, "n_occlusions": len(batch) - 1}
        target_rgb = self.gallery_rgb(target_id)
        small = meters.resize_long_side(target_rgb)
        mask, used = meters.object_mask(small, "auto")
        tinted = small.copy()
        tinted[~mask] = (0.35 * tinted[~mask]).astype(np.uint8)
        out["target_mask"] = data_url(tinted, 448)
        out["mask_kind"] = used
        constraints = parse_caption(caption) if caption else []
        if constraints:
            vector = self.attributes([target_id])[target_id]
            if vector is not None:
                ref_vector = meters.measure(rgb, "auto") if any(c.relative for c in constraints) else None
                ref_dict = None if ref_vector is None else meters.unpack(ref_vector)
                out["attributes"] = attribute_summary(vector)
                out["explanations"] = []
                for c in constraints:
                    value = meters.satisfaction_batch(c, vector[None], ref_vector)
                    out["explanations"].append({
                        "constraint": c.describe(),
                        "satisfaction": None if value is None else round(float(value[0]), 3),
                        "why": meters.explain(c, meters.unpack(vector), ref_dict)})
        return out
