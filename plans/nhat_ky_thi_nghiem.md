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
| E2.0s | 18/10 | Tỉ lệ truy vấn có thuộc tính đo được (**sơ bộ**) | `attributes/parser.py` | CIRR val (4.181), FIQ val (6.016, đủ câu), CIRCO val (220) | 36,3% / 90,7% / 25,5% | Ngưỡng M3: 10% | file chú thích công khai trên GitHub của từng tập | Chưa phải lượt chính thức (H9, trên tập con FIQ có ảnh) |
| E2.1 | 18/10 | Kiểm thử bộ đo trên ảnh tổng hợp | `attributes/meters.py` | 46 sắc độ màu, 20 ảnh sọc/không sọc, 6 ảnh mẫu | Màu 100%; sọc 19/20 (đúng hướng 8/8); độ sáng, độ rực màu, diện tích đơn điệu; mặt nạ Otsu, GrabCut IoU 1,00, spectral residual 0,05–0,08 | — | `tools/test_meters.py` | Sai duy nhất: đốm thưa (ít cạnh) không được coi là có hoa văn |
| C11-chấm | 18/10 | Độ chính xác parser và bộ phân loại | `parser.py`, `taxonomy.py` | 100 câu thật ngẫu nhiên (50 CIRR + 50 FIQ, seed 1) | Ràng buộc đúng 97%; nhóm đúng 78% | — | `tools/grading/parser_grading_seed1.csv` | Chấm bởi trợ lý AI thay Chí: Chí nên rà lại phiếu |
| C11-CIRCO | 18/10 | Bộ phân loại so với nhãn người gán `semantic_aspects` | `taxonomy.py` | CIRCO val (220) | Phủ định P/R 1,00/1,00; góc nhìn 0,90/0,98; số lượng 0,71/0,97; vị trí–nền 0,85/0,77; thêm đối tượng 0,53/0,60 | — | `annotations/val.json` của CIRCO | |
| E6.1-P0 | 18/10 | Thống kê bộ câu GPT gốc | GPTNeo27B (P0) | 20.931 khái niệm × 256 câu | Câu trùng 0,06%; luật lọc cũ bỏ 2 khái niệm; khái niệm lặp trong câu 12,1%; nằm lẫn trong từ khác 0%; distinct-2 0,365; 33 token CLIP (trung vị), 0% quá 75 | — | `tools/phrases_stats.py` | Top-150 của phi phủ 20.785/20.931 khái niệm (đo trên `similar_concepts` 6.824 ảnh) |
| E6.1-P1 | 18/10 | Bộ câu đã làm sạch | GPTNeo27B_clean (P1) | như trên | Giữ 5.354.847/5.358.336 câu (bỏ 512 câu thiếu khái niệm, 2.977 câu trùng) | P0 | `tools/clean_phrases.py` | Bản tạo trên máy, chưa đưa lên Drive; tạo lại trên Colab theo D16 (đã sửa để cứu 2 khái niệm Grevillea) |
| E3.3c | 18/10 | Hiệu chỉnh luật `--restore auto` (**tạm**) | `degradation_estimation.py` | 17 ảnh mẫu × (sạch + 8 loại × 2 mức) | Nhận đúng loại 86,9%; sai số σ nhiễu trung bình 1,1; 9/17 ảnh sạch được giữ nguyên | — | `tools/calibrate_restore_rules.py` | Phải hiệu chỉnh lại trên 300 ảnh CIRR train trước E3.3 |

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
