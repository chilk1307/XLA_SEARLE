# Tiến độ dự án

**Cập nhật cuối 26/10/2026:** Đã hoàn tất các nhiệm vụ ưu tiên **H9 → H6 → H7 → H8 → H17 → H15**. Hòa xong **8/20 việc (40%)**. Xem [báo cáo đầy đủ](https://drive.google.com/file/d/11c41xyaQuQs4d539t14yvXBUh_2F2C5m/view), [đường cong warm-start](https://drive.google.com/file/d/1nd2LjgVgccAiC_MOQEJzKkMKZyKJbfWn/view) và [CSV snapshot](https://drive.google.com/file/d/16iV-_HNPj16iTxI2zaUDrOsaqopz4QjW/view). Kết quả ở [phiên H9/CIRR/FashionIQ](https://drive.google.com/drive/folders/1PcRJRBL0FmORSTBWWp6SjjmvmgJlK0QJ) và [phiên CIRCO/OTI](https://drive.google.com/drive/folders/13VXpfwTRmQoKvQjO1LfLno_V0s9Ezkty).

**Nghiệm thu:** 26 lượt baseline và 71 lượt đánh giá OTI, đủ truy vấn, không lỗi ảnh, không bỏ truy vấn, không trùng qid, mọi chỉ số hữu hạn. Có 3 bảng CI baseline và 1 bảng CI OTI (bootstrap ghép cặp 1.000 lần, seed 0), taxonomy 3 tập, keep-edit/token/gap CIRR–CIRCO và phân tích token OTI sau H15. `final-audit.json` xác nhận hoàn tất sáu nhiệm vụ; các kết quả cũ được giữ nguyên. Code thí nghiệm `4ca396e`, GPU Tesla T4.

**H17/H15:** E7.0 phủ đủ 220 ảnh tham chiếu, 250 khái niệm/ảnh. OTI λGPT=0 đạt mAP@5 **2,16**. Năm cấu hình H15 đã chạy đủ 350 bước, seed 42, lưu và đánh giá cả token thường/EMA ở 0, 10, 25, 50, 100, 200, 350 (**70 lượt**). EMA bước 350, mAP@5: ngẫu nhiên lr 0,02 **6,67**; phi lr 0,02 **6,61**; phi lr 0,005 **6,25**; SEARLE lr 0,02 **7,03**; SEARLE lr 0,005 **6,82**. CI 95% của chênh lệch warm-start so với P0 đều chứa 0; chưa kết luận warm-start cải thiện rõ ở bước 350. Đã lưu đường cong và thời gian từng batch để Chí chọn 1–2 cấu hình cho D15. Các lượt OTI giữ mặc định không `--exclude-reference`, không so trực tiếp với H6-ex. H4/H5 và quyết định M3 vẫn chờ Chí.

**Số mới trên val đầy đủ:** phi_B32 CIRR R@1 **25,50** (CI 95% **[24,23; 26,74]**), FashionIQ R@10 **22,83** (**[21,80; 23,88]**), R@50 **41,56**. CIRCO mAP@5 phi_B32 **8,85** (CI **[6,79; 11,47]**), SEARLE **9,10** (**[6,97; 11,72]**), đều `--exclude-reference`; không so trực tiếp với B4/B5 mặc định cũ. SEARLE FashionIQ R@10 **22,90**, R@50 **42,12**; cả hai dùng `--exclude-reference`. FashionIQ có 15.536 vị trí gallery theo ba nhóm nhưng chỉ **15.415 tệp ảnh duy nhất**, không thiếu ảnh val. Không đối chiếu trực tiếp với B6/B7 vốn chạy tập con. `text` cao hơn `sum` trên cả CIRR (20,52 so với 11,93 R@1) và FashionIQ (18,61 so với 15,32 R@10); giữ nguyên số đo, không chỉnh để khớp kỳ vọng.

**M3:** đủ E2.0/E2.2 để Chí quyết định. FashionIQ: màu 78,9%, độ sáng 80,1%, độ rực màu 72,3%, hoa văn 65,3%; zoom 50% nhưng chỉ 2 ràng buộc. CIRR có 3/5 họ và FashionIQ có 4/5 họ đạt 65%; đây là bằng chứng để bàn giao, chưa phải quyết định M3 hay cấu hình cuối. H4/H5 vẫn giữ nguyên vướng mắc file test lịch sử.

**Lịch sử phiên trước — cập nhật:** 26/10/2026 (Ngày 10), đối chiếu GitHub `main` (`d6500de`) và chạy tiếp trên Colab T4. Kết quả mới: [`Hoa_continue_20261026_100802_0ab7841f`](https://drive.google.com/drive/folders/1BeP6LJptgxAdt4C8o6_BlOxMX5D7V_S8). **H2 đã xong kiểm kê nhanh**: CIRR val/test1 đủ 2.297/2.315 ảnh; CIRCO đủ 123.403 ảnh gallery, không thiếu ảnh tham chiếu/ground truth val/test. FashionIQ val có đủ 6.016 truy vấn và 15.536 ảnh gallery theo danh sách tệp; train/test vẫn thiếu nhiều ảnh. Kiểm kê xác nhận sự hiện diện, chưa thay thế kiểm tra giải mã từng ảnh.

**Đã gỡ chênh lệch E1.7a trên T4:** code gốc `70328e1` và code `main` cùng ra R@1 **25,59**; cả 7 chỉ số CIRR khớp đến sai số làm tròn (sai lệch lớn nhất <0,004 điểm). Đây là bằng chứng không hồi quy trên cùng GPU, không phải kết luận chắc chắn TF32 là nguyên nhân. Giữ mốc A100 25,66 và ngưỡng ±0,05; dùng mốc gốc T4 25,59 khi đối chiếu T4. Xem `H5-same-GPU-comparison.json`. E1.7d `phi_B32` trên CIRR val đạt R@1 **25,50** (mốc 25,47, lệch 0,03 ≤0,05), đủ 4.181 truy vấn, không lỗi ảnh/truy vấn bị bỏ. **H5 bị chặn ở test**: đã sinh đủ 4.148 truy vấn nhưng top-10 chỉ trùng **82,43%** với `outputs/submissions/phi_B32_cirr.json`, dưới ngưỡng 99%. Dừng H4; không sinh file SEARLE chính thức hay nộp server. Lưu `H5-top10-comparison.json` và file test mới trong thư mục riêng; Đã đối chiếu bộ sinh test gốc trên cùng T4: **code gốc và main trùng top-10 100%** trên toàn bộ 4.148 truy vấn. Cả hai trùng file lịch sử cùng 82,43% (top-1 99,59%; tập hợp top-10 96,31%). Chưa xác định nguyên nhân khác file lịch sử; không quy kết chắc chắn cho GPU. Xem `H5-test-diagnosis.json`/`.md`. E1.7b/c/e/f chưa chạy.

**Lịch sử H9 ở phiên trước (đã bổ sung FashionIQ ở trên):** E2.0 đủ ba tập (CIRR 36,3%; CIRCO 25,5%; FashionIQ 90,7% truy vấn có ràng buộc). FashionIQ dùng đúng parser và `frequency_stats` của repo, lọc tập truy vấn bằng danh sách tệp từ H2 để tránh lỗi `stat` trên Drive; danh sách val được lưu trong `fiq_val_subset.json`. E2.2 CIRR đã xong, không lỗi ảnh: đồng thuận 67,1% so với ngẫu nhiên 45,8%; màu 69,0%, độ sáng 76,2%, độ rực màu 67,4%, hoa văn 51,5% (ngẫu nhiên 57,4%), zoom 54,1%. E2.2 CIRCO cũng đã xong, không lỗi ảnh: đồng thuận chung 62,7% so với ngẫu nhiên 49,3% (67 ràng buộc); chỉ tải 168 ảnh cần đo theo đúng URL COCO trong metadata về local, xem `CIRCO-attribute-local-provenance.json` và `E2.2-agree-circo-metadata-url/`. Không dùng thư mục local này để đánh giá toàn gallery. Chưa tự chọn trọng số hay xác nhận M3 trước khi đủ E2.2 FashionIQ và quyết định của Chí.

**Bản 24/10:** 24/10/2026 (Ngày 8): đối chiếu lại Drive, **không có kết quả mới kể từ 21/10**. `results/` vẫn chỉ có `Hoa_H4_H5_20261019_…` và `Doanh_D2_20261021_COMPLETED`, `cache/` chỉ có cache CIRR val mặc định. Lỗi dữ liệu (C1) chưa sửa: hai file `.tar` và 4 thư mục `dryrun_2ep` trùng tên vẫn còn. Theo lịch hôm nay Hòa phải ở H10, Doanh ở D9, nên **phần Colab trễ khoảng 5–6 ngày**; M1, M3 đã quá hạn mà chưa đạt.

**Bản trước:** 22/10/2026 (Ngày 6), đối chiếu với `results/` trên Drive và GitHub: Chí đã xong toàn bộ code cho Colab (C3, C5–C16, C21–C24). Doanh xong D1, D2 (21/10). Hòa dừng H5 ở E1.7a (19/10): SEARLE gốc trên CIRR ra R@1 25.59, mốc là 25.66, ngưỡng ±0,05. Từ đó H4–H18 và D3 trở đi chưa chạy. Dữ liệu trên Drive có lỗi: `FashionIQ.tar` 0 byte, `CIRR.tar` (6,0 GB) bị cụt. **Phần chạy Colab trễ 3–4 ngày so với lịch gốc** (theo lịch hôm nay Hòa ở H8, Doanh ở D7); mốc M1 (18/10) chưa đạt.
**Cách dùng:** làm xong việc nào thì đổi `- [ ]` thành `- [x]`, ghi ngày xong ở cuối dòng, rồi cập nhật bảng tóm tắt bên dưới. Việc làm được một phần thì giữ `- [ ]` và ghi "(một phần: …)".

## Tóm tắt

| Phần | Xong | Tổng | Tiến độ | Ghi chú |
|---|---|---|---|---|
| **Giai đoạn 0: tái lập SEARLE** (trước kế hoạch) | 14 | 15 | **93%** | Còn điểm test từ server; FashionIQ val đầy đủ đã được đánh giá với `--exclude-reference` ngày 26/10 |
| Kế hoạch 2 tuần: Chí (C1–C24) | 17 | 24 | 71% | Xong toàn bộ code cần cho Colab (C3, C5–C16, C21–C24); C2, C4 chờ nghiệm thu trên Colab; C1 cần làm tay; còn C17–C20 (demo, cấu hình cuối, báo cáo, video) |
| Kế hoạch 2 tuần: Hòa (H1–H18, T1–T2) | 8 | 20 | 40% | H2, H3, H6, H7, H8, H9, H15, H17 xong; H4/H5 còn vướng file test lịch sử; các việc tiếp theo phụ thuộc Chí, dữ liệu/GPU hoặc bộ câu GPT mới |
| Kế hoạch 2 tuần: Doanh (D1–D17) | 2 | 17 | 12% | D1, D2 xong 21/10; D3 là việc kế tiếp |
| **Kế hoạch 2 tuần: cả nhóm** | 27 | 61 | **44%** | Phần chạy trên Colab xong 10/37 việc; H6–H9, H15, H17 hoàn tất; H4/H5 và các mốc còn chờ |
| Mốc kiểm tra M1–M5 | 0 | 5 | 0% | M1 (hạn 18/10), M2 (21/10), M3 (23/10) quá hạn chưa đạt; M4 hạn 27/10 |

Trang tự đánh giá của demo (`/api/assessment`, chỉ tính phần tái lập): lõi **93%**, tính cả phần mở rộng (SEARLE-XL, SEARLE-OTI) **75%**.

## Giai đoạn 0: tái lập SEARLE (đã làm trước kế hoạch)

- [x] Cụm từ GPT (`concept_to_phrases.pkl`, bản tác giả phát hành)
- [x] Liên kết khái niệm cho 100.000 ảnh ImageNet test
- [x] OTI trên 100.000 ảnh (3 shard, gộp thành `oti_B32`)
- [x] Train phi 100 epoch (`phi_B32`)
- [x] Đánh giá CIRR val: R@1 25.47 (SEARLE gốc 25.66)
- [x] Đánh giá CIRCO val: mAP@5 6.42 (SEARLE gốc 6.82, trùng số paper Table 10 nên gallery nhiều khả năng đủ ảnh; H2 kiểm tra lại)
- [x] Đánh giá FashionIQ val đầy đủ — 26/10: 6.016 truy vấn; SEARLE R@10/R@50 22,90/42,12; phi_B32 22,83/41,56, đều `--exclude-reference`, không lỗi ảnh/truy vấn bị bỏ. B6/B7 cũ là tập con nên không so trực tiếp.
- [x] File nộp test của phi_B32: CIRR (`phi_B32_cirr.json` + `subset_phi_B32_cirr.json`) và CIRCO (`phi_B32_circo.json`)
- [ ] Điểm test từ server CIRR và CIRCO
- [x] Demo web Flask (gallery, 3 chế độ truy vấn, trang tự đánh giá, tự nhận diện file nộp test)
- [x] Repo GitHub `chilk1307/XLA_SEARLE`, loại file lớn khỏi git
- [x] `SETUP_MISSING_FILES.md` và link Google Drive cho file lớn
- [x] Ghi chép tái lập: `outputs/REPORT.md`, `outputs/REPORT_results.md`
- [x] Kế hoạch 2 tuần trong `plans/` (đã commit `70328e1`)
- [x] Phân công Chí, Hòa, Doanh, mỗi người một file nhiệm vụ

## Kế hoạch 2 tuần: Chí (code, ý tưởng)

Chi tiết: [nhiem_vu_Chi.md](nhiem_vu_Chi.md).

- [ ] **C1** (Ngày 1) Chia sẻ Drive cho Hòa, Doanh; xác nhận vị trí dữ liệu và dung lượng Drive (một phần: Hòa và Doanh đã đọc/ghi được thư mục `SEARLE` trên Colab; còn lại: `datasets/FashionIQ.tar` 0 byte và `datasets/CIRR.tar` bị cụt phải đóng gói lại. Hòa phải dùng thư mục giải nén sẵn trên Drive, Doanh tự tạo `CIRR_D2_val_20261021.zip` (chỉ val). Doanh đọc `outputs` từ một bản sao tên `SEARLE (1)`; `outputs/phi_models/` có 4 thư mục `dryrun_2ep` trùng tên cần dọn)
- [ ] **C2** (Ngày 1) Bộ chạy Colab: `setup_env.sh`, `prepare_data.sh`, `requirements-xla.txt`, `SEARLE_runner.ipynb` (một phần: notebook đã chạy được trên runtime mới (Hòa 19/10 trên T4, Doanh 21/10 trên A100); tiêu chí "R@1 = 25.66" chưa đạt: ra 25.59 trên T4, xem H5)
- [x] **C3** (Ngày 1) Gộp `datasets.py`, sửa nuốt lỗi, xử lý batch rỗng, đưa file nhỏ của `outputs/` vào git — 17/10
  - [x] Gộp bản `datasets.py` của repo và bản vá Colab
  - [x] Thay `except: pass` bằng cảnh báo + đếm mẫu lỗi
  - [x] Xử lý batch `None` trong các vòng lặp
  - [x] `outputs/submissions/` vào git
  - [x] `REPORT*.md`, `pip_freeze.txt`, `merge_oti.py`, csv/json của `phi_B32`, log `eval*.log` vào git
- [ ] **C4** (Ngày 2) Module truy xuất chung; `--output-dir`, `--cache-dir`, `--note`; CIRR luôn sinh cả file subset (một phần: code xong, trên dữ liệu giả lập mọi chỉ số và file nộp trùng code cũ; 26/10 đã kiểm tra code gốc/main trên cùng T4: 7 chỉ số CIRR khớp tới làm tròn, R@1 cùng 25,59; còn chờ đối chiếu file test và baseline các tập khác ở H5)
- [x] **C5** (Ngày 2) Baseline CLIP `image`, `text`, `sum`; `--exclude-reference` — 17/10
- [x] **C6** (Ngày 3) Cờ tiền xử lý `--targetpad-ratio`, `--interp`, `--tta` (cache phân biệt theo cấu hình) — 17/10
- [x] **C7** (Ngày 3) `check_datasets.py`, `bootstrap_ci.py`, `collect_results.py`; đối chiếu số "Paper" (khớp arXiv v2) — 17/10
- [x] **C8** (Ngày 3) CBIR cổ điển (histogram màu, LBP, HOG, Gabor), `--cbir-features`, `--cbir-text-weight` — 17/10
- [x] **C9** (Ngày 4) Suy giảm, phục hồi, lọc tần số; `--save-quality` (thử trên ảnh thật: phục hồi đúng loại đều tăng PSNR/SSIM) — 18/10
- [x] **C10** (Ngày 5) Code train: tra token bằng dict, train tập con, `--resume`, ảnh xấu, nhiễu đặc trưng, lịch LR, loại token (trên dữ liệu giả lập: trùng từng bit code gốc `70328e1`; `--resume` trùng từng bit chạy liền; mọi cờ mới chạy được; Doanh kiểm lại trên dữ liệu thật ở D2) — 18/10
- [x] **C11** (Ngày 5) Bộ tách ràng buộc, phân loại truy vấn, phân tích giữ – sửa; chấm tay 100 câu (parser đúng 97%, phân loại đúng 78%; phiếu chấm ở `tools/grading/`) — 18/10
- [x] **C12** (Ngày 6) Bộ đo thuộc tính; kiểm thử trên ảnh tổng hợp (E2.1 đã chạy: màu 100%, sọc 19/20, mặt nạ Otsu/GrabCut IoU 1,00); `attribute_stats.py` — 18/10
- [x] **C13** (Ngày 7) Xếp hạng lại theo thuộc tính (code xong, thử trên dữ liệu giả lập; họp mốc M3 theo lịch 23/10, theo dõi ở mục Mốc) — 18/10
- [x] **C14** (Ngày 8) Ước lượng suy giảm; `--restore auto`, `auto_iqa`, `oracle`; `--degrade mixed` (cả 4 chạy được; `tools/calibrate_restore_rules.py` nhận đúng loại suy giảm 86,9%; ngưỡng hiện tại là bản tạm từ 17 ảnh mẫu, phải hiệu chỉnh lại trên 300 ảnh CIRR train trước E3.3) — 18/10
- [x] **C15** (Ngày 8) Kết hợp điểm ảnh + văn bản; ensemble prompt (sửa lỗi mẫu `"$,"` làm mất token `$`) — 18/10
- [x] **C16** (Ngày 9) Công cụ hình ảnh: ví dụ, bản đồ che khuất, hình suy giảm, PSNR so với điểm truy xuất (`visualize_queries.py`, `occlusion_map.py`, `visualize_degradations.py`, `quality_vs_retrieval.py`; thử trên dữ liệu giả lập) — 18/10
- [ ] **C17** (Ngày 10–11) Demo: tab thuộc tính, tab ảnh xấu → phục hồi, so sánh phương pháp, nút "Vì sao?"
- [ ] **C18** (Ngày 11) Chọn cấu hình cuối, gửi lệnh nộp test
- [ ] **C19** (Ngày 12–13) README gốc repo, `CHANGES.md`, báo cáo, slide
- [ ] **C20** (Ngày 14) Video demo, kiểm tra trước khi nộp, nộp bài
- [x] **C21** (Ngày 9) Code OTI warm-start (`--init`, `--snapshot-steps`, `--token-file`) (`--init random` trùng từng bit code gốc; thêm `timing.json`, `--gpt-exp-name none`, nội suy token khi đánh giá) — 18/10
- [x] **C22** (Ngày 9) Công cụ bộ câu GPT: thống kê, làm sạch (P1), `--phrase-match`, `--concept-filter`, sửa lỗi `saved_exp_name` (đọc/ghi file câu dạng luồng, không cần nạp cả 700 MB) — 18/10
- [x] **C23** (Ngày 11) Notebook sinh câu `colab/gen_phrases.ipynb`, chế độ quy mô nhỏ (`tools/generate_phrases_llm.py` chế độ P2 và P3; chạy thử với mô hình nhỏ trên CPU; chạy thật trên Colab ở D16) — 18/10
- [x] **C24** (thêm) Phân tích vector ảnh và vector từ: `tools/vector_analysis.py` `tokens`, `gap`, `drift` (thử trên CIRR, CIRCO, FIQ giả lập; `drift` cho đúng số của lượt `validate.py` cùng cấu hình) — 19/10

## Kế hoạch 2 tuần: Hòa (Colab)

Chi tiết: [nhiem_vu_Hoa.md](nhiem_vu_Hoa.md).

- [ ] **H1** (Ngày 1) Dựng Colab, đóng gói dữ liệu, chạy thử SEARLE gốc trên CIRR val (một phần: Colab chạy được, cache CIRR val đã có trên Drive; đóng gói `.tar` hỏng nên dùng thư mục giải nén sẵn)
- [x] **H2** (Ngày 1) Kiểm tra dữ liệu nhanh CIRR, CIRCO, FashionIQ (E1.2) — 26/10. Báo cáo ở `Hoa_continue_20261026_100802_0ab7841f/E1.2-inventory-parallel/`: CIRR val/test1 2.297/2.315 ảnh đủ; CIRCO gallery 123.403/123.403; FashionIQ val đủ 6.016 truy vấn và 15.536 ảnh gallery theo danh sách tệp, nhưng train/test thiếu ảnh. Không kiểm tra CIRR train trong lượt nhanh; chưa kiểm tra giải mã mọi ảnh.
- [x] **H3** File subset CIRR (`subset_phi_B32_cirr.json` đã có, hợp lệ) — 16/10
- [ ] **H4** (Ngày 2) Sinh file test của SEARLE gốc; nộp test SEARLE gốc và phi_B32 (B8–B11) (26/10: vẫn dừng trước H4 do H5 top-10 test chỉ trùng 82,43% <99%; file test phi mới chỉ dùng chẩn đoán, không phải nộp server)
- [ ] **H5** (Ngày 3) Kiểm tra không hồi quy; chạy lại baseline E1.7a–f (26/10: đã so code gốc `70328e1` với `main` trên cùng T4, cả hai R@1 25,59, 7 chỉ số khớp trong sai số làm tròn; xem `H5-same-GPU-comparison.json`. E1.7d xong: R@1 25,50, đủ 4.181 truy vấn, không lỗi tải ảnh/truy vấn bị bỏ. Top-10 test trên 4.148 truy vấn chỉ trùng 82,43% <99% với file lịch sử: DỪNG H4, giữ ngưỡng 99%, bộ sinh test gốc và main trên cùng T4 đã trùng top-10 100% (4.148 truy vấn), xem `H5-test-diagnosis.json`; khác biệt với file lịch sử chưa rõ nguyên nhân. Còn E1.7b/c/e/f. Lịch sử 19/10: E1.7a chạy 19/10 trên T4 ra R@1 25.59 / R@5 55.49 / R@10 69.17 / R@50 90.58, mốc A100 là 25.66 / 55.47 / 69.24 / 90.58; lệch 0,07 điểm, khoảng 3 truy vấn, vượt ngưỡng 0,05 nên dừng; E1.7b–f chưa chạy)
- [x] **H6** (Ngày 4) Baseline CLIP E1.8 và CBIR E1.9 — 26/10: đủ 26 lượt baseline CIRR/FashionIQ/CIRCO, không lỗi ảnh hoặc truy vấn bị bỏ. CBIR CIRCO là phần tùy chọn, chưa chạy; CBIR+text CIRR đã chạy. Xem summary-all.md trong phiên CIRCO/OTI.
- [x] **H7** (Ngày 5) Kiểm tra dữ liệu bằng công cụ E1.2; khoảng tin cậy E1.4; gom kết quả — 26/10: đủ ba bảng CI 95%, 1.000 lần bootstrap, seed 0, baseline phi_B32 cùng tập; kiểm tra bộ val local đủ ảnh/truy vấn và gom 26 lượt vào summary-all.md.
- [x] **H8** (Ngày 6) Taxonomy E1.10 cả ba tập; keep-edit E1.11, token E1.15a và modality gap E1.15b CIRR/CIRCO — 26/10. Keep-edit CIRCO dùng phi_B32 --exclude-reference của H6 thay cho lượt E1.7e chưa nghiệm thu ở H5. Có report.md và các hình tokens.png, gap.png; phần bổ sung token OTI sẽ chạy sau H15.
- [x] **H9** (Ngày 7) Thống kê thuộc tính E2.0 và đồng thuận bộ đo E2.2 — 26/10: đủ ba tập, không lỗi ảnh; CIRR 67,1%/ngẫu nhiên 45,8%; FashionIQ 75,8%/51,6% trên 9.778 ràng buộc; CIRCO 62,7%/49,3%. Đủ dữ liệu bàn giao M3; Chí chưa quyết định giữ/đổi hướng.
- [ ] **H10** (Ngày 8–9) Quét xếp hạng lại (E2.3); mặt nạ (E2.4); phủ định (E2.5)
- [ ] **H11** (Ngày 10) Kết hợp (E2.6), tổng quát hoá (E2.7), kết hợp điểm (E4.4), ensemble prompt (E4.5)
- [ ] **H12** (Ngày 11) Ví dụ định tính (E1.12), bản đồ che khuất (E1.13), ví dụ có giải thích (E2.8)
- [ ] **H13** (Ngày 12) Nộp test cấu hình cuối (E2.9); khoảng tin cậy bảng chính
- [ ] **H14** (Ngày 13) Tổng hợp bảng, hình → bàn giao Chí
- [x] **H15** (Ngày 11) OTI warm-start CIRCO val E7.1a–d — 26/10: đủ 5 cấu hình (random 0,02; phi 0,02/0,005; SEARLE 0,02/0,005), 7 snapshot × token thường/EMA = 70 lượt đánh giá, seed 42. Mỗi lượt đủ 220 truy vấn, không lỗi ảnh hoặc truy vấn bị bỏ. Đã phân tích lại token OTI, lưu thời gian batch, đường cong và CI ghép cặp với P0. Xem H17_H15_attempt2/, oti-snapshot-metrics.csv, oti-inversion-timing.csv, oti-warmstart-curves.png, E7.1-ci-finals-circo/ trong phiên CIRCO/OTI. Chí chọn cấu hình cho D15; chưa tự chọn thay nhóm.
- [ ] **H16** (Ngày 10) Train phi với lịch LR cosine (E8.2a)
- [x] **H17** (Ngày 7) Liên kết khái niệm CIRCO val E7.0 và OTI E6.2-Pλ0 — 26/10: CSV đủ 220 ảnh tham chiếu, 250 khái niệm/ảnh; OTI 350 bước, seed 42, bộ câu gốc với lambda_gpt=0; mAP@5/10/25/50 = 2,16/3,03/3,89/4,32. Đánh giá đủ 220 truy vấn, không lỗi ảnh/truy vấn bị bỏ. Kết quả ở phiên CIRCO/OTI, thư mục H17_H15_attempt2. Giữ mặc định không --exclude-reference theo kế hoạch.
- [ ] **H18** (Ngày 13) OTI với bộ câu GPT mới trên CIRCO val (E6.2)
- [ ] **T1** (Ngày 6, tuỳ chọn) Train phi trên shard s0 (E1.14a = E8.1a)
- [ ] **T2** (Ngày 8, tuỳ chọn) Train phi trên shard s0 + s1 (E1.14b = E8.1b)

## Kế hoạch 2 tuần: Doanh (Colab)

Chi tiết: [nhiem_vu_Doanh.md](nhiem_vu_Doanh.md).

- [x] **D1** (Ngày 1) Dựng Colab, giải nén ImageNet, kiểm tra file trên Drive (ImageNet đủ 100.000 ảnh; CIRR val đủ 2.297 ảnh) — 21/10
- [x] **D2** (Ngày 2) Chạy thử train 2 epoch, đo thời gian (A100: epoch 1 R@1 22.24 so với mốc 22.05, epoch 2 22.79 so với 22.53; khoảng 2,4 phút mỗi epoch nên 100 epoch mất khoảng 4 giờ; kết quả ở `results/Doanh_D2_20261021_COMPLETED`) — 21/10
- [ ] **D3** (Ngày 3) Đệm ảnh (E4.1), nội suy (E4.2)
- [ ] **D4** (Ngày 4) Lật ảnh (E4.3); cấu hình tốt nhất trên CIRCO, FIQ
- [ ] **D5** (Ngày 5) Mức sụt giảm với 8 loại suy giảm (E3.1)
- [ ] **D6** (Ngày 5) Phân tích miền tần số (E3.5)
- [ ] **D7** (Ngày 6) Đặc trưng ảnh xấu shard s0; bắt đầu sàng lọc phi bền (E3.8a)
- [ ] **D8** (Ngày 7) Phục hồi cố định (E3.2); sàng lọc tiếp; nhóm left/right (E4.3b)
- [ ] **D9** (Ngày 8) Đánh giá 3 bản sàng lọc, chọn biến thể; đặc trưng ảnh xấu 100k
- [ ] **D10** (Ngày 9) Train phi bền bản đầy đủ (E3.8b); phục hồi tự động (E3.3)
- [ ] **D11** (Ngày 10) PSNR/SSIM so với điểm truy xuất (E3.4); đánh giá phi bền (E3.8c); độ trôi vector (E3.9)
- [ ] **D12** (Ngày 11) Độ bền bộ đo thuộc tính (E3.6); hình minh hoạ (E3.7)
- [ ] **D13** (Ngày 12) Chạy bổ sung; nộp test phi bền (nếu được chọn)
- [ ] **D14** (Ngày 13) Tổng hợp bảng, hình → bàn giao Chí
- [ ] **D15** (Ngày 12) OTI warm-start trên CIRR val (E7.2)
- [ ] **D16** (Ngày 12) Thống kê bộ câu (E6.1); sinh bộ câu mới quy mô nhỏ
- [ ] **D17** (Ngày 13) Train phi trên shard s0 với bộ câu mới (E6.4)

## Mốc kiểm tra

- [ ] **M1** (Ngày 2, 18/10) Colab chạy được cho Hòa và Doanh; dữ liệu đã kiểm tra; code cũ ra đúng số; đã nộp test SEARLE gốc và phi_B32
- [ ] **M2** (Ngày 5, 21/10) Quy trình mới ra đúng số cũ; bảng baseline có khoảng tin cậy; code suy giảm, phục hồi, train mới chạy được
- [ ] **M3** (Ngày 7, 23/10) Có E2.0, E2.2 và quyết định giữ hay đổi đóng góp chính
- [ ] **M4** (Ngày 11, 27/10) Đủ kết quả chính của 02, 03, 04; phi bền bản đầy đủ đã train; demo có 2 tab mới
- [ ] **M5** (Ngày 14, 30/10) Báo cáo, slide, video, README hoàn chỉnh; nộp bài

## Việc tiếp theo

1. **Chí: nghiệm thu M3, chọn cấu hình warm-start cho D15 và xử lý file test lịch sử của H5.** Hòa đã xong H6–H9, H15 và H17 ngày 26/10; H10/H11 còn phần cần cấu hình của Chí. H4/H5 vẫn bị chặn. Về H5: Code gốc `70328e1` và `main` trên T4 cùng ra 25,59, cả 7 chỉ số CIRR trùng đến làm tròn; không cần chạy lại phép thử này. E1.7d đã đạt R@1 25,50 (mốc 25,47 ±0,05). Top-10 test đã kiểm tra nhưng chỉ trùng 82,43% <99% với file lịch sử; H4 vẫn dừng. Đã xác nhận bộ sinh test gốc/main trên cùng T4 trùng top-10 100%. Chí cần nghiệm thu nguồn gốc checkpoint/file nộp cũ và môi trường tạo file lịch sử, dùng `H5-test-diagnosis.json`/`.md`; không hạ ngưỡng hay tự chạy H4. Sau khi được xử lý mới hoàn tất E1.7b/c/e/f và H4. Giữ riêng mốc A100 25,66 và T4 25,59, không nới ngưỡng ±0,05. Kết quả mới phải dùng tên/thư mục riêng, giữ nguyên kết quả cũ.
2. **Chí: sửa dữ liệu trên Drive (C1).** Đóng gói lại `CIRR.tar` (đủ train, dev, test1) và `FashionIQ.tar`, hoặc sửa `colab/prepare_data.sh` để đọc thẳng các thư mục giải nén sẵn. Dọn các thư mục `dryrun_2ep` trùng tên trong `outputs/phi_models/`. Nhắc Doanh dùng lối tắt `SEARLE` thay cho bản sao `SEARLE (1)`.
3. **Doanh: D3 (E4.1, E4.2), D5, D6 làm được ngay.** Cache CIRR val của Hòa đã có trên Drive, nhưng chỉ dùng lại được với cấu hình mặc định (targetpad 1.25, bicubic). Các cấu hình khác của E4.1, E4.2 phải trích đặc trưng lại.
4. Trước E3.3 (Ngày 9), Chí hiệu chỉnh lại ngưỡng phục hồi tự động trên ảnh CIRR train ở Colab rồi commit `src/restore_rules.json`:
   `$PY tools/calibrate_restore_rules.py --images-dir $DATA/CIRR/train --n 300 --out src/restore_rules.json --report-dir $DRIVE/results/E3.3-calibration`
5. Mốc M3 (23/10) đã quá hạn; ngày 26/10 đã đủ E2.0/E2.2 cả ba tập để Chí quyết định hướng chính. E2.0 đã được Hòa chạy đủ ba tập ngày 26/10 (FashionIQ 90,7%, CIRR 36,3%, CIRCO 25,5%), vượt ngưỡng 10%. E2.2 CIRR (67,1% so với ngẫu nhiên 45,8%) và CIRCO (62,7% so với 49,3%) đã có, không lỗi ảnh; E2.2 FashionIQ cũng đã xong: 75,8% so với 51,6%, không lỗi ảnh. Chí quyết định giữ/đổi hướng trước khi chọn trọng số H10/H11.
