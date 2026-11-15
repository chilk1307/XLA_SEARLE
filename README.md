# XLA_SEARLE: truy xuất ảnh kết hợp zero-shot và xử lý ảnh

Bài tập lớn môn Xử lý ảnh. Nhóm tái lập **SEARLE** (Baldrati et al., ICCV 2023), một phương pháp truy xuất ảnh kết hợp (Composed Image Retrieval, CIR) không cần dữ liệu huấn luyện có nhãn: người dùng đưa một **ảnh tham chiếu** và một **câu mô tả thay đổi** ("is red and has long sleeves"), hệ thống tìm ảnh phù hợp trong kho. Trên nền đó, nhóm thêm hai phần xử lý ảnh:

1. **Kiểm chứng thuộc tính bằng xử lý ảnh cổ điển** (kế hoạch [02](plans/02_kiem_chung_thuoc_tinh.md)): tách ràng buộc màu, độ sáng, độ rực, hoa văn, zoom từ câu mô tả, đo chúng trên ảnh (CIELAB, CIEDE2000, Otsu/GrabCut, phổ Fourier, LBP, Gabor) để xếp hạng lại kết quả.
2. **Độ bền với ảnh xấu và phục hồi ảnh** (kế hoạch [03](plans/03_do_ben_va_phuc_hoi_anh.md)): 8 loại suy giảm × 2 mức, 14 phép phục hồi cổ điển, ước lượng loại suy giảm để tự chọn phép phục hồi, và một mạng φ "bền" được huấn luyện thêm trên đặc trưng ảnh xấu.

**Thành viên:** Lê Khắc Chí (code, ý tưởng, báo cáo), Hòa và Doanh (chạy thí nghiệm, huấn luyện trên Colab). *(Bổ sung họ tên đầy đủ, mã sinh viên, lớp, giảng viên.)*

## Kết quả chính

Tái lập (ViT-B/32). Điểm **test** do server chính thức chấm (13/11/2026; φ bền 15/11/2026); số val đo bằng code của repo.

| | CIRR test R@1 | CIRR test R@5 | CIRR test Rsubset@1 | CIRCO test mAP@5 | CIRR val R@1 |
|---|---:|---:|---:|---:|---:|
| SEARLE, số trong bài báo (Table 2, 3, 9) | 24.00 | 53.42 | 54.89 | 9.35 | 25.09 |
| SEARLE, checkpoint của tác giả, chạy lại | 23.30 | 52.92 | 54.00 | 9.39 | 25.66 (A100) / 25.59 (T4) |
| **φ của nhóm** (`phi_B32`: OTI trên 100.000 ảnh ImageNet + huấn luyện 100 epoch) | **23.35** | **52.65** | **54.46** | **9.44** | **25.47** |
| φ bền với ảnh xấu (`phi_B32_robust`, xem bên dưới) | 23.47 | 53.13 | 54.48 | 9.62 | 25.45 |

Các phần mở rộng (val, có khoảng tin cậy bootstrap ghép cặp 95%; chi tiết ở [tien_do.md](plans/tien_do.md) và [nhat_ky_thi_nghiem.md](plans/nhat_ky_thi_nghiem.md)):

- **Xếp hạng lại theo thuộc tính** (76 cấu hình, chọn trọng số trên CIRR val theo luật ghi trước): màu với w = 2 cho CIRR R@1 25,47 → 25,78 (+0,31; CI [−0,19; +0,79]); cao nhất quan sát được là cùng cấu hình nhưng không dùng mặt nạ đối tượng (26,07). Không so sánh nào đã tính có khoảng tin cậy cải thiện nằm hẳn trên 0, nên cấu hình cuối không dùng xếp hạng lại. Bộ đo khớp với câu mô tả 63–76% (ngẫu nhiên 46–52%), nhưng phần lớn thông tin đó CLIP đã nắm; trọng số quá lớn còn làm giảm điểm (hoa văn, w = 4: FashionIQ −0,56, CI [−0,90; −0,24]).
- **Phục hồi ảnh** (CIRR val R@1, ảnh tham chiếu suy giảm mức 2): median trên nhiễu muối tiêu +1,72, Wiener trên mờ chuyển động +1,87, gamma trên thiếu sáng +0,79. **PSNR tăng không kéo theo truy xuất tăng**: NLM trên nhiễu Gauss tăng PSNR 5,8 dB mà R@1 giảm 0,65. Phục hồi tự động (`auto`) trên bộ suy giảm hỗn hợp: 24,49 → 25,16, nhưng làm giảm nhẹ trên ảnh sạch (25,50 → 25,21).
- **Miền tần số**: lọc thông thấp bán kính ≥ 0,1 gần như không mất điểm, lọc thông cao mất 4,6–7,7 điểm R@1, tức CLIP dựa chủ yếu vào tần số thấp.
- **Tiền xử lý**: targetpad 1.25 + bicubic (mặc định của SEARLE) tốt nhất; lật ảnh (tối đa +0,05), kết hợp điểm ảnh + chữ và ensemble prompt (đều làm giảm R@1) không giúp.
- **φ bền với ảnh xấu**: huấn luyện φ thêm trên đặc trưng ảnh xấu (`phi_B32_robust`) tăng CIRR R@1 trung bình 0,44 điểm trên 8 loại suy giảm (CI [+0,16; +0,72]) mà không mất gì trên ảnh sạch (−0,02, CI [−0,45; +0,43]); tăng có ý nghĩa cả trên suy giảm chưa thấy khi huấn luyện (mờ chuyển động +0,91, nhiễu muối tiêu +0,67).

## Cấu trúc repo

| Thư mục | Nội dung |
|---|---|
| [SEARLE-main/](SEARLE-main/) | Code gốc của SEARLE và mọi phần nhóm thêm. Danh sách thay đổi: [CHANGES.md](SEARLE-main/CHANGES.md) |
| [SEARLE-main/src/](SEARLE-main/src/) | Đánh giá (`validate.py`, `generate_test_submission.py`, `retrieval_core.py`), OTI, huấn luyện φ, và các module xử lý ảnh: `degradations.py`, `restorations.py`, `degradation_estimation.py`, `freq_filters.py`, `cbir.py`, `attributes/` |
| [SEARLE-main/tools/](SEARLE-main/tools/) | Khoảng tin cậy, kiểm tra dữ liệu, phân tích (giữ – sửa, vector ảnh – vector từ, PSNR so với truy xuất), hình minh hoạ |
| [SEARLE-main/demo/](SEARLE-main/demo/) | Demo web Flask |
| [SEARLE-main/colab/](SEARLE-main/colab/) | Notebook và script chạy trên Google Colab |
| [plans/](plans/) | Kế hoạch, phân công, tiến độ, nhật ký thí nghiệm |
| [outputs/](outputs/) | File nhỏ của lần tái lập: báo cáo, log đánh giá, chỉ số huấn luyện, file nộp test |

## Cách chạy

**Môi trường.** Python 3.8, PyTorch 1.11 (bản đầy đủ: [outputs/pip_freeze.txt](outputs/pip_freeze.txt)), cộng thư viện xử lý ảnh trong [colab/requirements-xla.txt](SEARLE-main/colab/requirements-xla.txt). Trên Colab: mở [colab/SEARLE_runner.ipynb](SEARLE-main/colab/SEARLE_runner.ipynb), chạy ô 1–5 (cài môi trường bằng `setup_env.sh`, chuẩn bị dữ liệu bằng `prepare_data.sh`).

**Dữ liệu và file lớn** (dataset, token OTI, checkpoint φ): xem [SETUP_MISSING_FILES.md](SEARLE-main/SETUP_MISSING_FILES.md).

**Đánh giá** (chạy trong `SEARLE-main/`):
```bash
python src/validate.py --eval-type phi --exp-name phi_B32 --phi-checkpoint-name phi_last.pt \
  --dataset cirr --dataset-path <CIRR> --output-dir results/phiB32-cirr
# ảnh tham chiếu bị làm xấu rồi phục hồi tự động
python src/validate.py --eval-type phi --exp-name phi_B32 --phi-checkpoint-name phi_last.pt \
  --dataset cirr --dataset-path <CIRR> --degrade mixed --restore auto --save-quality --output-dir results/mixed-auto
# xếp hạng lại theo thuộc tính
python src/validate.py --eval-type phi --exp-name phi_B32 --phi-checkpoint-name phi_last.pt \
  --dataset cirr --dataset-path <CIRR> --attr-rerank --attr-families color --attr-weight 2 --output-dir results/attr
```
Toàn bộ tham số: [plans/01_nen_tang_danh_gia.md](plans/01_nen_tang_danh_gia.md) mục 1.3.

**Demo** (máy cá nhân, CPU chạy được):
```bash
cd SEARLE-main
pip install -r demo/requirements.txt
python demo/app.py        # mở http://127.0.0.1:5050
```
Thêm ảnh vào thư viện, chọn ảnh tham chiếu, nhập mô tả. Các tuỳ chọn: xếp hạng lại thuộc tính (kèm giải thích), làm xấu → phục hồi ảnh tham chiếu, so sánh 6 phương pháp, "Vì sao?" (bản đồ che khuất). Demo chỉ nên chạy ở 127.0.0.1 (xem [05](plans/05_demo_va_bao_cao.md) mục 5.3).

## Ghi nguồn và giấy phép

Dự án dựa trên **SEARLE**: A. Baldrati, L. Agnolucci, M. Bertini, A. Del Bimbo, "Zero-Shot Composed Image Retrieval with Textual Inversion", ICCV 2023, repo gốc [miccunifi/SEARLE](https://github.com/miccunifi/SEARLE) (commit `a9c314b`). Code gốc và phần sửa đổi theo giấy phép **CC BY-NC 4.0** ([LICENSE](SEARLE-main/LICENSE)): chỉ dùng phi thương mại, phải ghi nguồn và ghi rõ thay đổi. Mọi file nhóm sửa hoặc thêm được liệt kê trong [CHANGES.md](SEARLE-main/CHANGES.md).

Dataset (CIRR, CIRCO, FashionIQ, ImageNet) và mô hình CLIP thuộc tác giả của chúng; repo không chứa ảnh của các dataset này.
