# Nhật ký thí nghiệm

## Cách ghi

- **Tự động:** mỗi lần chạy có `--output-dir` tự thêm một dòng vào `SEARLE/results/runs_<người chạy>.csv` trên Drive (thời điểm, mã thí nghiệm, lệnh, chỉ số chính, thời gian chạy, loại GPU, ghi chú `--note`). Không cần chép tay từng lần chạy.
- **Bảng dưới đây:** chỉ ghi các kết quả **dùng trong báo cáo**: baseline, điểm test, kết luận chính của từng phần. Chí cập nhật dựa trên báo cáo cuối ngày của Hòa và Doanh.
- Mã thí nghiệm theo quy ước trong [README](README.md): `E<số file>.<mục><biến thể>-<mô tả>-<tập>`. Mã `B…` dành cho các kết quả có từ trước kế hoạch 2 tuần và các file nộp test của baseline.

## Bảng kết quả dùng trong báo cáo

| Mã | Ngày | Mô tả | Mô hình / cấu hình | Tập | Chỉ số chính | So với | Nguồn | Ghi chú |
|---|---|---|---|---|---|---|---|---|
| B0 | 17/10 | Số của paper (đã đối chiếu) | SEARLE B/32 | CIRR val | R@1 25.09, R@10 68.79 | — | arXiv 2303.15247v2, Table 9 | Các bảng khác (FIQ val, CIRCO val, test) ở [01](01_nen_tang_danh_gia.md) mục 1.6 |
| B0c | 17/10 | Số của paper | SEARLE B/32 | CIRCO val | mAP@5 6.82, mAP@10 7.83 | — | arXiv 2303.15247v2, Table 10 | B4 của nhóm gần như trùng: gallery CIRCO nhiều khả năng đủ ảnh |
| B1 | trước 16/10 | SEARLE gốc | torch.hub B/32 | CIRR val | R@1 25.66, R@10 69.24 | — | `outputs/logs/eval_searle_cirr.log` | |
| B2 | trước 16/10 | Tái lập | phi_B32, `phi_last.pt` | CIRR val | R@1 25.47, R@10 69.24 | −0.19 / 0.00 so với B1 | `outputs/logs/eval_phi_cirr.log` | |
| B3 | trước 16/10 | Tái lập quy mô nhỏ | phi_b32 (OTI 6.824 ảnh) | CIRR val | R@1 22.60, R@10 66.23 | −3.06 / −3.01 so với B1 | `outputs/prev_results_oct5/cirr_val.txt` | |
| B4 | trước 16/10 | SEARLE gốc | torch.hub B/32 | CIRCO val | mAP@5 6.82, mAP@10 7.78 | — | `outputs/logs/eval3_searle_circo.log` | Chưa chắc gallery đủ ảnh |
| B5 | trước 16/10 | Tái lập | phi_B32, `phi_last.pt` | CIRCO val | mAP@5 6.42, mAP@10 7.15 | −0.40 / −0.63 so với B4 | `outputs/logs/eval_phi_circo.log` | Chưa chắc gallery đủ ảnh |
| B6 | trước 16/10 | SEARLE gốc | torch.hub B/32 | FIQ val (tập con) | TB R@10 36.99, R@50 56.82 | — | `outputs/logs/eval5_searle_fashioniq.log` | Thiếu khoảng 2.431 ảnh |
| B7 | trước 16/10 | Tái lập | phi_B32, `phi_last.pt` | FIQ val (tập con) | TB R@10 36.51, R@50 57.05 | −0.48 / +0.23 so với B6 | `outputs/logs/eval5_phi_fashioniq.log` | Thiếu khoảng 2.431 ảnh |
| B8 | 13/11 | Điểm test chính thức | phi_B32 (file lịch sử) | CIRR test1 rc2 | R@1/5/10/50 = 23.349 / 52.651 / 66.940 / 89.735; subset R@1/2/3 = 54.458 / 75.855 / 88.072 | — | CIRR server, H4 | 4.148 truy vấn; recall và recall_subset nộp riêng; tên file trong ghi chi tiết H4 |
| B9 | 13/11 | Điểm test chính thức | phi_B32 (file lịch sử) | CIRCO test | mAP@5/10/25/50 = 9.44 / 9.79 / 11.05 / 11.76 | — | Email CIRCO, H4 | 800 truy vấn; người dùng xác nhận nộp phi_B32 trước; xem đủ Recall và khía cạnh ngữ nghĩa bên dưới |
| B10 | 13/11 | Điểm test chính thức | SEARLE gốc, sinh trên T4 | CIRR test1 rc2 | R@1/5/10/50 = 23.301 / 52.916 / 66.916 / 89.831; subset R@1/2/3 = 54.000 / 76.265 / 87.783 | — | CIRR server, H4 | 4.148 truy vấn; recall và recall_subset nộp riêng; không trộn với baseline val T4 25.59 |
| B11 | 13/11 | Điểm test chính thức | SEARLE gốc, sinh trên T4 | CIRCO test | mAP@5/10/25/50 = 9.39 / 9.96 / 11.14 / 11.86 | — | Email CIRCO, H4 | 800 truy vấn; người dùng xác nhận nộp SEARLE sau phi_B32 |
| B12 | 15/11 | Điểm test chính thức | phi_B32_robust (`phi_last.pt`, D10), sinh trên A100 | CIRR test1 rc2 | R@1/2/5/10/50 = 23.470 / 34.699 / 53.133 / 66.940 / 89.807; subset R@1/2/3 = 54.482 / 75.976 / 87.928 | +0.12 / +0.48 / 0.00 R@1/5/10 so với B8 | CIRR server, D13 (Doanh) | 4.148 truy vấn; commit `bffac34`; ảnh chụp và SHA-256 trong `Doanh_SEARLE/outputs/submissions/`, `results/D13-robust-Doanh/` |
| B13 | 15/11 | Điểm test chính thức | phi_B32_robust, sinh trên A100 | CIRCO test | mAP@5/10/25/50 = 9.62 / 9.93 / 11.20 / 11.94; R@5/10/25/50 = 20.25 / 27.62 / 39.50 / 52.00 | +0.18 / +0.14 mAP@5/10 so với B9 | Email CIRCO, D13 (Doanh) | 800 truy vấn; không `--exclude-reference` như B9; ảnh chụp email bị cắt phần đầu, nhận theo tên file `Kq_robust_circo.jpg` |
| E1.14a (= E8.1a) | 14/11 | T1 quy mô một shard s0, 100 epoch | phi_scale_s0_Hoa_20261114_e0dbcd, seed 42 | CIRR val, 4.181 truy vấn | R@1 24,30; R@10 67,78 | phi_B32 cùng A100: 25,47; Δ R@1 −1,17, CI [−1,89; −0,45] | [Gói T1](https://drive.google.com/drive/folders/1Efh_KhmM6PldYHMM9VrSS2ovZv3KfokS) | Đủ checkpoint/audit/CI; một seed; T2 chưa chạy |
| E1.14b (= E8.1b) | 14/11 | T2 hai shard s0+s1, 100 epoch | phi_scale_s01_Hoa_20261114_c059b1, seed 42 | CIRR val, 4.181 truy vấn | R@1 24,68; R@10 68,72 | phi_B32: −0,79, CI [−1,32; −0,26]; T1: +0,38, CI [−0,29; +1,05] | [Gói T2](https://drive.google.com/drive/folders/1aYIIvTm-csZG0pfFfhA-fkmgab4vubG0) | 66.667 ảnh; đủ checkpoint/audit/CI; một seed |
| E2.0s | 18/10 | Tỉ lệ truy vấn có thuộc tính đo được (**sơ bộ**) | `attributes/parser.py` | CIRR val (4.181), FIQ val (6.016, đủ câu), CIRCO val (220) | 36,3% / 90,7% / 25,5% | Ngưỡng M3: 10% | file chú thích công khai trên GitHub của từng tập | Chưa phải lượt chính thức (H9, trên tập con FIQ có ảnh) |
| E2.1 | 18/10 | Kiểm thử bộ đo trên ảnh tổng hợp | `attributes/meters.py` | 46 sắc độ màu, 20 ảnh sọc/không sọc, 6 ảnh mẫu | Màu 100%; sọc 19/20 (đúng hướng 8/8); độ sáng, độ rực màu, diện tích đơn điệu; mặt nạ Otsu, GrabCut IoU 1,00, spectral residual 0,05–0,08 | — | `tools/test_meters.py` | Sai duy nhất: đốm thưa (ít cạnh) không được coi là có hoa văn |
| C11-chấm | 18/10 | Độ chính xác parser và bộ phân loại | `parser.py`, `taxonomy.py` | 100 câu thật ngẫu nhiên (50 CIRR + 50 FIQ, seed 1) | Ràng buộc đúng 97%; nhóm đúng 78% | — | `tools/grading/parser_grading_seed1.csv` | Chấm bởi trợ lý AI thay Chí: Chí nên rà lại phiếu |
| C11-CIRCO | 18/10 | Bộ phân loại so với nhãn người gán `semantic_aspects` | `taxonomy.py` | CIRCO val (220) | Phủ định P/R 1,00/1,00; góc nhìn 0,90/0,98; số lượng 0,71/0,97; vị trí–nền 0,85/0,77; thêm đối tượng 0,53/0,60 | — | `annotations/val.json` của CIRCO | |
| E6.1-P0 | 18/10 | Thống kê bộ câu GPT gốc | GPTNeo27B (P0) | 20.931 khái niệm × 256 câu | Câu trùng 0,06%; luật lọc cũ bỏ 2 khái niệm; khái niệm lặp trong câu 12,1%; nằm lẫn trong từ khác 0%; distinct-2 0,365; 33 token CLIP (trung vị), 0% quá 75 | — | `tools/phrases_stats.py` | Top-150 của phi phủ 20.785/20.931 khái niệm (đo trên `similar_concepts` 6.824 ảnh) |
| E6.1-P1 | 18/10 | Bộ câu đã làm sạch | GPTNeo27B_clean (P1) | như trên | Giữ 5.354.847/5.358.336 câu (bỏ 512 câu thiếu khái niệm, 2.977 câu trùng) | P0 | `tools/clean_phrases.py` | Bản tạo trên máy, chưa đưa lên Drive; tạo lại trên Colab theo D16 (đã sửa để cứu 2 khái niệm Grevillea) |
| E3.3c | 18/10 | Hiệu chỉnh luật `--restore auto` (**tạm**) | `degradation_estimation.py` | 17 ảnh mẫu × (sạch + 8 loại × 2 mức) | Nhận đúng loại 86,9%; sai số σ nhiễu trung bình 1,1; 9/17 ảnh sạch được giữ nguyên | — | `tools/calibrate_restore_rules.py` | Phải hiệu chỉnh lại trên 300 ảnh CIRR train trước E3.3 |
| E3.8c-sạch | 15/11 | φ bền so với phi_B32, ảnh sạch | `phi_B32_robust` (degaug, 100 epoch) | CIRR val 4.181; CIRCO val 220 (loại ảnh tham chiếu); FIQ val 6.016 | CIRR R@1 25,45; CIRCO mAP@5 8,82; FIQ R@10 22,79 | phi_B32 cùng phiên A100: 25,47 / 8,78 / 22,59; CIRR Δ −0,02 [−0,45; +0,43] | Drive `Doanh_SEARLE/results/D11-robust-Doanh`, `D14-Doanh-20261115/C18_decision.json` | Đạt điều kiện 1 của C18 (cận dưới ≥ −1,0) |
| E3.8c-xấu | 15/11 | φ bền, 8 suy giảm mức 2 | `phi_B32_robust` | CIRR val 4.181 | TB 8 suy giảm R@1 24,55; tăng có ý nghĩa: JPEG +0,74, thiếu sáng +0,74, mờ chuyển động +0,91, muối tiêu +0,67 | phi_B32 (E3.1) 24,11; Δ TB +0,44 [+0,16; +0,72] | Drive `Doanh_SEARLE/results/D11-robust-Doanh`, `D14-Doanh-20261115/C18_decision.json` | Đạt điều kiện 2 của C18 → nộp test phi bền (D13); CIRCO: thiếu sáng +1,40, muối tiêu +1,11 mAP@5 có ý nghĩa |

## Mẫu ghi chi tiết

Copy khối dưới đây cho mỗi kết quả dùng trong báo cáo:

````markdown
### <Mã thí nghiệm>: <tên ngắn>

- **Ngày:** DD/MM/2026   **Người chạy:** Hòa / Doanh / Chí
- **Phần kế hoạch:** (ví dụ 02 → mục 2.3)
- **Giả thuyết:**
- **Lệnh chạy:**
  ```sh
  $PY src/validate.py ...
  ```
- **Commit git:** `abc1234`   **GPU:** A100 / L4 / T4
- **Dữ liệu:** tập, split, số truy vấn, số ảnh gallery
- **Thời gian chạy:**
- **Kết quả:** (bảng chỉ số, kèm khoảng tin cậy 95%)
- **So với baseline:** (hiệu số + khoảng tin cậy 95% của hiệu số)
- **Kết luận:** giữ / bỏ / cần thêm thí nghiệm
- **Vấn đề gặp phải:**
````

## Ghi chi tiết

### H4 (B8–B11): điểm test chính thức 13/11/2026

- **Người nộp:** người dùng tự nộp sáu file; trợ lý đọc và lưu các điểm trả về. H4 hoàn tất, không đồng nghĩa H13 (test cấu hình cuối) đã xong.
- **Nguồn CIRR:** https://cirr.zheyuanliu.me/evaluate, phiên bản rc2; cả bốn lượt đều báo `Submission successful`.
- **Nguồn CIRCO:** hai email `CIRCO test set results`. Email không ghi tên file; người dùng xác nhận phi_B32 nộp trước và SEARLE gốc nộp sau. Giữ nguyên mốc UTC trong email theo server, không suy đoán tên mô hình từ điểm số.
- **Đầu vào:** phi_B32 giữ nguyên ba file lịch sử; ba file SEARLE sinh trên T4 ngày 12/11 sau gate CIRR val R@1 25,5919636451, đúng 25,59 ±0,05. Giao thức mặc định targetpad 1.25 + bicubic, không lật, fusion=0; CIRCO loại ảnh tham chiếu theo giao thức test. Đã kiểm tra 6 file, 4.148 truy vấn CIRR/file và 800 truy vấn CIRCO/file trước khi nộp.
- **Giới hạn:** các bảng dưới là điểm test (%), không phải val; không có CI trên test để khẳng định chênh lệch có ý nghĩa thống kê. Không dùng điểm test để chọn trọng số hay chỉnh tham số.

#### Sáu lượt nộp

| File | Server / metric | Mốc UTC trả về / ghi trong email |
|---|---|---|
| `phi_B32_cirr.json` | CIRR rc2 / recall | 2026-11-13T14:58:47.630Z |
| `subset_phi_B32_cirr.json` | CIRR rc2 / recall_subset | 2026-11-13T15:05:13.786Z |
| `searle_official_cirr.json` | CIRR rc2 / recall | 2026-11-13T15:08:06.423Z |
| `subset_searle_official_cirr.json` | CIRR rc2 / recall_subset | 2026-11-13T15:10:13.178Z |
| `phi_B32_circo.json` | CIRCO test / email đầu | 2026-11-13T14:42:00Z (theo nội dung email) |
| `searle_official_circo.json` | CIRCO test / email sau | 2026-11-13T14:42:33Z (theo nội dung email) |

#### CIRR test1 rc2

| Mô hình | R@1 | R@2 | R@5 | R@10 | R@50 | Subset R@1 | Subset R@2 | Subset R@3 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| phi_B32 | 23.349 | 34.964 | 52.651 | 66.940 | 89.735 | 54.458 | 75.855 | 88.072 |
| SEARLE gốc | 23.301 | 34.867 | 52.916 | 66.916 | 89.831 | 54.000 | 76.265 | 87.783 |

#### CIRCO test

| Mô hình | mAP@5 | mAP@10 | mAP@25 | mAP@50 | R@5 | R@10 | R@25 | R@50 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| phi_B32 | 9.44 | 9.79 | 11.05 | 11.76 | 20.12 | 27.88 | 40.38 | 51.88 |
| SEARLE gốc | 9.39 | 9.96 | 11.14 | 11.86 | 19.88 | 28.12 | 39.50 | 50.75 |

CIRCO mAP xét tất cả ảnh đúng của truy vấn; Recall chỉ xét ảnh target dùng để viết mô tả tương đối.

| Khía cạnh CIRCO (mAP@10) | phi_B32 | SEARLE gốc |
|---|---:|---:|
| Cardinality | 7.22 | 7.54 |
| Addition | 10.32 | 10.38 |
| Negation | 5.80 | 6.72 |
| Direct Addressing | 11.31 | 11.55 |
| Compare & Change | 8.10 | 8.12 |
| Comparative Statement | 8.87 | 8.42 |
| Statement with Conjunction | 9.05 | 9.30 |
| Spatial Relations & Background | 10.76 | 11.19 |
| Viewpoint | 7.62 | 7.48 |

_(Thêm các mục chi tiết bên dưới, mới nhất ở trên cùng.)_

### E1.14a (= E8.1a): nghiệm thu T1, 14/11/2026

- **Người chạy:** Hòa; hoàn tất 11:46:55 GMT+7. Experiment `phi_scale_s0_Hoa_20261114_e0dbcd`, mã `e64f1c50d5b2b008ff2cde0bb058c9cba6a363b6`; NVIDIA A100-SXM4-80GB, Python 3.8.20, torch 1.11.0+cu113. Không sửa mã mô hình.
- **Train:** 33.334 ảnh/token EMA s0; seed 42, batch 256, LR cố định 0,0001, 100 epoch, validation mỗi 5 epoch. Cache s0 lấy đúng hàng theo tên từ cache 100.000 ảnh, đã kiểm tra thứ tự/SHA-256. Đủ 100 dòng train và 20 validation; loss cuối 4,7289255, mọi giá trị hữu hạn. `phi_last.pt` và `resume.pt` cùng epoch 100, tham số hữu hạn.
- **Checkpoint:** `phi_last.pt` SHA-256 `9a0051731d598790f1b6efef883078caec1481dd92242ae352db1a8a6bbb1356`; `resume.pt` SHA-256 `987ac35d5e1bb276bf34c7e7b98ac72d7d2e0ca0baf31ae9671cb44a0cbbbdfa`; lưu tại `SEARLE/outputs/phi_models/phi_scale_s0_Hoa_20261114_e0dbcd/`.
- **Đánh giá:** T1 và đối chứng phi_B32 cùng A100, CIRR val 2.297 ảnh/4.181 truy vấn; reference bị loại theo benchmark. Không lỗi tải, không bỏ/trùng qid. Bootstrap ghép cặp 1.000 lần, seed 0, cùng truy vấn.

| Chỉ số (%) | phi_B32 | T1 | Δ (điểm) | CI 95% của Δ |
|---|---:|---:|---:|---|
| R@1 | 25,47 | 24,30 | −1,17 | [−1,89; −0,45] |
| R@5 | 55,23 | 54,08 | −1,15 | [−1,94; −0,29] |
| R@10 | 69,24 | 67,78 | −1,46 | [−2,22; −0,74] |
| R@50 | 90,43 | 89,79 | −0,65 | [−1,10; −0,19] |
| Subset R@1 | 55,20 | 54,63 | −0,57 | [−1,36; +0,24] |
| Subset R@2 | 76,11 | 75,63 | −0,48 | [−1,17; +0,26] |
| Subset R@3 | 87,83 | 87,63 | −0,19 | [−0,77; +0,41] |

- **Kết luận:** T1 giảm R@1 so với đối chứng, CI của Δ nằm dưới 0; không đổi số liệu để khớp kỳ vọng. Chỉ một seed train, query bootstrap không đo phương sai giữa seed; giữ 100 epoch làm số bước cập nhật khác theo lượng ảnh. Cache bỏ qua trích đặc trưng cũng thay đổi chuỗi RNG so với tự trích; T2 cần dùng cùng cách cache. B3 (6.824 ảnh) là mốc lịch sử, chọn mẫu có thể khác/không lồng nhau; chưa fit đường cong hoặc kết luận bão hòa. T2 (66.668 ảnh) chưa chạy.
- **Bàn giao:** [T1 báo cáo MD/HTML, bốn CSV, ba hình, audit, manifest/SHA-256 và nguồn](https://drive.google.com/drive/folders/1Efh_KhmM6PldYHMM9VrSS2ovZv3KfokS). [H14 đã bổ sung T1](https://drive.google.com/drive/folders/1AfGRsrFrKQliryolxddAvKZOS8p40Yfq): 22 CSV, 29 PNG; H14 vẫn một phần chờ H10–H13. Hòa 12/20 (60%).

### E1.14b (= E8.1b): nghiệm thu T2, 14/11/2026

- **Người chạy:** Hòa; hoàn tất **14:53:55 GMT+7** (`2026-11-14T07:53:55Z`). Một experiment `phi_scale_s01_Hoa_20261114_c059b1`, mã `e64f1c50d5b2b008ff2cde0bb058c9cba6a363b6`, NVIDIA A100-SXM4-80GB, torch 1.11.0+cu113. Không sửa mã mô hình.
- **Train:** s0 33.334 + s1 33.333 = **66.667 ảnh/token**, không trùng; raw/EMA bằng đúng phép nối hai shard, hữu hạn. Dùng token EMA, seed 42, batch 256, LR cố định 0,0001, 100 epoch, validation mỗi 5 epoch. Cache chọn đúng hàng từ cùng cache 100.000 ảnh như T1; hash cache s01 `3685c39fec94997e70a33d3f8910bc085da02f4252b1e101df6cffa582c294f0`.
- **Audit:** đủ 100 dòng train liên tiếp/20 validation, mọi số hữu hạn; loss cuối 4,7181194691. `phi_last.pt`/`resume.pt` tại epoch 100, tham số hữu hạn. SHA-256 lần lượt `2eb465a68de6f31b7fbd575c66463ce9e5fd78b8b86685b6aad4d2e768745e60` / `bfcae7d25256f0615ff39f601ef96f53702fff61a4dcefe8fae584ed2c43f27c`.
- **Đánh giá:** T2, T1 và phi_B32 chạy lại cùng A100/CIRR val 2.297 ảnh, 4.181 truy vấn/lượt. Không lỗi ảnh/bỏ/trùng qid; ba tập qid khớp; chỉ số khớp trung bình dump từng truy vấn. T1 và đối chứng khớp đủ bảy chỉ số của phiên nghiệm thu T1.

| Chỉ số (%) | phi_B32 | T1 s0 | T2 s0+s1 |
|---|---:|---:|---:|
| cirr_recall_at1 | 25.47 | 24.30 | 24.68 |
| cirr_recall_at5 | 55.23 | 54.08 | 54.65 |
| cirr_recall_at10 | 69.24 | 67.78 | 68.72 |
| cirr_recall_at50 | 90.43 | 89.79 | 90.60 |
| cirr_group_recall_at1 | 55.20 | 54.63 | 54.96 |
| cirr_group_recall_at2 | 76.11 | 75.63 | 75.94 |
| cirr_group_recall_at3 | 87.83 | 87.63 | 87.66 |

- **Hai CI ghép cặp:** 1.000 lần, seed 0, n_shared=4.181. R@1 T2 có CI [23,46; 25,95]. So T1: +0,38 điểm, CI [−0,29; +1,05] chứa 0, chưa chứng minh cải thiện rõ. So phi_B32: −0,79 điểm, CI [−1,32; −0,26] nằm dưới 0.
- **Giới hạn:** một seed train; CI theo truy vấn không đo biến thiên giữa seed, chưa điều chỉnh nhiều phép so sánh. Giữ 100 epoch làm số bước cập nhật khác theo lượng dữ liệu; T1/T2 cùng dùng cache. Mốc B3 6.824 ảnh là lịch sử, chọn mẫu có thể khác/không lồng nhau. Không kết luận bão hòa ở 100.000 ảnh hoặc quan hệ nhân quả chỉ do lượng dữ liệu.
- **Bàn giao:** [T2 — báo cáo MD/HTML, bốn CSV, ba hình, chỉ số/CI/audit và gói ZIP](https://drive.google.com/drive/folders/1aYIIvTm-csZG0pfFfhA-fkmgab4vubG0). [H14 cập nhật T1/T2](https://drive.google.com/drive/folders/1AfGRsrFrKQliryolxddAvKZOS8p40Yfq): 26 CSV, 32 PNG, Hòa 13/20 (65%). H14 cuối cùng vẫn chờ các phần H10–H13; Chí đã xác nhận màu w=2 để chạy 12 lượt H10 còn lại. Không gửi thông báo cho Chí trong phiên này.

## H10/H11/H12 — nghiệm thu 14/11/2026

**14/11/2026 — Hòa đã nghiệm thu H10, H11, H12 và H18-P2.** [Notebook](https://colab.research.google.com/drive/1fy8aH6k1unuvMVEdZdxleBn30Vr71oC0) · [Kết quả H10/H11/H12](https://drive.google.com/drive/folders/1S-Hd658_vouhe4w__4B-BGfw7bv9FiUh) · [Gói H14 cập nhật](https://drive.google.com/drive/folders/1AfGRsrFrKQliryolxddAvKZOS8p40Yfq). Phiên `results/Hoa_H10_L4_20261114_085609_3cdcbc`, code `e64f1c5`, NVIDIA L4. **Hòa 17/20 (85%); cả nhóm 45/61 (74%).**

- **H10:** đủ 12 lượt còn lại (K50, bốn mặt nạ none/otsu/grabcut/saliency, negation off trên CIRR/FIQ), màu w=2; tổng **76 cấu hình**. Mỗi lượt đủ 4.181/6.016 truy vấn, không lỗi ảnh/bỏ/trùng qid/thiếu phép đo, có CI ghép cặp 1.000 lần seed 0; FIQ phân tầng theo loại và bật `--exclude-reference`. So với chính `E2.3b-color-w2-<tập>` theo chỉ dẫn Chí. Bốn replay phục vụ kiểm tra, không cộng vào 76; cả hai lượt màu w=2 khớp hoàn toàn chỉ số từng truy vấn và top-100 E2.3b trên L4. Phiên A100 chẩn đoán lệch 4 truy vấn subset đã dừng trước ablation, không trộn vào kết quả chính.
- **H11:** E2.7 màu w=2, K100/auto/negation on trên CIRCO val đủ 220 truy vấn, gallery 123.403 ảnh, cùng giao thức loại ảnh tham chiếu ở cả hai lượt. mAP@5 phi **8.85 → 9.01**; Δ **+0.15 điểm, CI 95% [-0.04; +0.42]**. FIQ dùng lại lượt màu w=2, không chọn lại tham số trên CIRCO/FIQ. E2.6 bỏ theo Chí; E4.4/E4.5 đã xong từ trước.
- **H12:** thêm 20 ví dụ CIRR E1.12 phi so với màu w=2 và 20 ví dụ FIQ có giải thích E2.8, seed 0. Giữ 10 hình che khuất E1.13 đã nghiệm thu, tổng 50 hình. Chọn minh họa theo thành công/thất bại top-5 và taxonomy; không coi là mẫu ước lượng chất lượng chung.
- **H14:** đã hợp nhất **35 bảng CSV, 74 hình PNG** cùng báo cáo, nguồn/audit và SHA-256. H14 vẫn một phần: H1/C1, C18/H13 và bàn giao cuối còn chờ. Chưa gửi email/tin nhắn cho Chí. Cấu hình cuối hiện vẫn không dùng xếp hạng lại thuộc tính; không tự đóng C18 hoặc H13.

**H18-P2:** đã nhận và chép nguyên bộ P2 Qwen2.5-1.5B của D16 sang thư mục chung; OTI 220 ảnh, seed 42, 350 bước, L4, cùng tham số P0/P1. Giữ ảnh tham chiếu, gallery đủ 123.403 đặc trưng; ba đối chứng dùng token đã nghiệm thu, chỉ đánh giá lại cùng L4. P1 khớp mọi chỉ số từng truy vấn của lần L4 cũ. Đủ token EMA 220x512, không lỗi/bỏ/trùng truy vấn.

| Bộ câu | CIRCO mAP@5 | CI 95% |
|---|---:|---|
| P0 | 6.67 | [4.90; 8.87] |
| P1 | 5.85 | [4.10; 7.88] |
| Plambda0 | 2.16 | [1.34; 3.30] |
| P2 | 8.20 | [6.26; 10.60] |

| So sánh ghép cặp | Δ điểm | CI 95% Δ |
|---|---:|---|
| P2 minus P0 | +1.54 | [-0.19; +3.29] |
| P2 minus P1 | +2.35 | [+0.54; +4.30] |
| P2 minus Plambda0 | +6.04 | [+4.05; +8.35] |

H18 đủ P1 và một bộ mới P2 theo phân công; **P3 tùy chọn**, không chặn nghiệm thu. Ba CI ghép cặp 1.000 lần, seed 0. Một seed OTI; P0/lambda=0 tối ưu token lịch sử trên T4, P1/P2 trên L4; cùng GPU đánh giá vẫn chưa loại bỏ giới hạn này. P2 có quy mô câu/khái niệm nhỏ hơn nên không quy toàn bộ chênh lệch cho riêng mô hình ngôn ngữ. Nguồn `Hoa_H18_P2_20261114_handover.zip`, dump/CI/audit và token EMA tại `results/Hoa_H18_P2_20261114_152635_02fb44`. Không tự đóng C18/H13.

| Cấu hình màu w=2 | CIRR R@1 | Δ / CI 95% | FIQ R@10 | Δ / CI 95% |
|---|---:|---|---:|---|
| E2.3-color-w2-k50 | 25.78 | +0.00 [-0.17; +0.17] | 22.78 | -0.03 [-0.20; +0.16] |
| E2.4-mask-none | 26.07 | +0.29 [-0.12; +0.67] | 23.13 | +0.31 [-0.02; +0.68] |
| E2.4-mask-otsu | 25.81 | +0.02 [-0.34; +0.38] | 22.81 | +0.00 [-0.10; +0.10] |
| E2.4-mask-grabcut | 25.88 | +0.10 [-0.02; +0.24] | 23.01 | +0.20 [-0.08; +0.50] |
| E2.4-mask-saliency | 25.83 | +0.05 [-0.33; +0.43] | 22.83 | +0.02 [-0.32; +0.33] |
| E2.5-neg-off | 25.81 | +0.02 [-0.05; +0.10] | 22.78 | -0.03 [-0.08; +0.00] |

Cả 12 CI chênh lệch của chỉ số chính đều chứa 0: chưa có bằng chứng thay K/mask/negation tốt hơn đối chứng đã chọn.

Đối chứng K100/auto/negation on: CIRR R@1 25,78, FIQ R@10 22,81. CI chưa điều chỉnh nhiều phép so sánh; các lượt này dùng phân tích, không tự thay cấu hình cuối. Nguồn: `Hoa_H10_H12_20261114_handover.zip`, `Hoa_H11_E27_20261114_handover.zip` và các JSON audit/CI trong phiên.


## H1/H13/H14 — nghiệm thu cuối phần Hòa, 14/11/2026

**14/11/2026 — Hòa hoàn tất H1, H13 và H14; đủ 20/20 việc (100%) theo cấu hình mặc định phi_B32.** [Notebook](https://colab.research.google.com/drive/1fy8aH6k1unuvMVEdZdxleBn30Vr71oC0) · [Gói H14 cuối, báo cáo và bảng kết luận bàn giao](https://drive.google.com/drive/folders/1AfGRsrFrKQliryolxddAvKZOS8p40Yfq). Cả nhóm **51/61 (84%)**; hoàn tất phần Hòa không có nghĩa toàn bộ dự án đã xong.

- **H1:** thực hiện quyết định Chí `470a568`, checkout runner `158927b`: đổi `CIRR.tar` (6.449.920.000 byte) thành `.broken`, `FashionIQ.tar` (0 byte) thành `.empty`; chuyển đủ bốn `dryrun_2ep*` chỉ có hyperparameters.json sang `outputs/discarded/dryrun_2ep_D2/`, SHA-256 giữ nguyên. Không xoá ảnh/checkpoint, không đóng gói thêm dữ liệu. Chạy `prepare_data.sh cirr circo fiq`, cả ba đường dẫn sẵn sàng, exit 0. Lần đầu FIQ `ls` bị I/O và in nhầm 0 ảnh; đã giữ log lỗi, đối chiếu metadata đủ 6.016 truy vấn/15.536 vị trí gallery (15.415 tên ảnh), giải mã ảnh mẫu theo tên trực tiếp, rồi chạy lại script nguyên bản: cả ba `already in`, không lỗi. Không coi log lần đầu là nghiệm thu hay kiểm kê ảnh mới.
- **H13:** dùng lại ba file/điểm test phi_B32 đã nghiệm thu H4 và CI H7 theo cấu hình mặc định Chí cho phép; **không sinh/nộp test thêm, không chạy lại mô hình**. Bảng đủ 23 chỉ số val/CI và 16 chỉ số test. CIRR val R@1 **25,50 [24,23;26,74]** (4.181 truy vấn); FIQ R@10 **22,83 [21,80;23,88]** (6.016); CIRCO mAP@5 **8,85 [6,79;11,47]** (220). FIQ/CIRCO dùng exclude-reference; val T4, test phi lịch sử A100. Không gán CI val cho test. Test: CIRR R@1 **23,349**, subset R@1 **54,458**, CIRCO mAP@5 **9,44**. Nguồn `tables/H13_final_val_ci.csv`, `tables/H13_reused_official_test.csv`, audit và cấu hình trong `sources/closeout_20261114/` của H14.
- **H14:** đã chạy collector từ 212 bản ghi nguồn, gom **38 CSV, 74 PNG**, `summary.md`, báo cáo MD/HTML, `BAN_GIAO_CHO_CHI.md` (mã thí nghiệm → một câu kết luận), log/audit và SHA-256. Bàn giao bằng thư mục chung và plans; chưa gửi email/tin nhắn riêng. Tên ZIP/report H14 giữ nguyên, nội dung là bản cuối.
- **Nhánh phi bền/C18 vẫn mở:** chỉ bổ sung test nếu E3.8c có cận dưới CI ΔR@1 sạch ≥ −1,0 và CI ΔR@1 trung bình tám suy giảm nằm hẳn trên 0. Không ghi phi bền đạt điều kiện khi chưa có kết quả. P3 vẫn tùy chọn; H10/H11/H12/H18/T1/T2 không cần chạy lại.

