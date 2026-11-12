# Tiến độ dự án

**Cập nhật 12/11/2026 (Hòa — H5):** H5 đã chạy xong bốn lượt còn thiếu E1.7b/c/e/f trên L4, commit `8673464`: SEARLE/phi_B32 CIRCO mAP@5 **6,82 / 6,46** (220 truy vấn/lượt); FashionIQ trung bình R@10 **22,75 / 22,65** (6.016 truy vấn/lượt), giữ mặc định ảnh tham chiếu. Không trộn các số này với H6-ex hoặc B6/B7 tập con cũ. Đủ truy vấn, không lỗi ảnh, không bỏ/trùng truy vấn. Ghép với E1.7a/d và đối chiếu cùng T4 ngày 26/10, tiêu chí test được Chí chấp thuận ngày 12/11: **H5 hoàn tất, Hòa 10/20 (50%)**. [Kết quả và log](https://drive.google.com/drive/folders/1M7qbwy9GDN5IXqudIuNLkNvHVqHJQTj4) · [Notebook](https://colab.research.google.com/drive/1tQ3wGrxBWU8OeCfmvjmSndBx7UoEOZIs).

**H10 — E2.3 đã xong 40/40 lượt:** 5 họ × 4 trọng số × CIRR/FashionIQ, K=100, mask=auto, negation=on. Mỗi lượt đủ 4.181 truy vấn CIRR hoặc 6.016 truy vấn FIQ, không lỗi ảnh, không bỏ/trùng truy vấn, không ứng viên thiếu phép đo; top-100 và chỉ số của các truy vấn không có ràng buộc thuộc họ đang xét giữ nguyên so với đối chứng cùng L4. Đối chứng CIRR R@1 **25,47**, FIQ R@10 **22,81** (`--exclude-reference` trên FIQ). Có hai bảng CI ghép cặp 1.000 lần, seed 0, CSV 40 lượt và gói bàn giao `Hoa_H5_H10_20261112_handover.zip` trong phiên ở trên. Kiểm tra 10 cache ảnh đầy đủ, đặc trưng hữu hạn, đã ghi SHA-256 checkpoint và cache.

**Kết quả chọn theo CIRR (chỉ là đề xuất để Chí duyệt):** màu w=0,3 cho R@1 **25,57**, chênh **+0,10**, CI 95% **[−0,12; +0,29]** chứa 0 nên **chưa có bằng chứng cải thiện rõ**. Điểm cao nhất của các họ còn lại: brightness w=0,05 (25,47), colorfulness w=0,05 (25,47), pattern w=0,1 (25,50), zoom w=0,05 (25,50); CI chênh lệch R@1 đều chứa 0. FIQ chỉ báo cùng w, không dùng để chọn lại tham số. CI chưa điều chỉnh nhiều phép so sánh/thiên lệch chọn cấu hình. H10 vẫn một phần: chờ Chí chọn trọng số rồi chạy K=50, mặt nạ, phủ định. Xem `E2.3-cirr-selection-proposal.json`, `CI-E2.3-cirr/ci.md`, `CI-E2.3-fiq/ci.md`, `E2.3-all-40.csv`, `final-audit.json` và `Hoa_H5_H10_20261112_report.md`.

 **H4:** chưa sinh SEARLE chính thức hoặc nộp server; Colab chưa cấp được T4 ở hai lần yêu cầu. Lượt chẩn đoán SEARLE CIRR trên L4 dùng cache ảnh chung đạt R@1 **25,52**, không dùng để nghiệm thu so với mốc T4 **25,59** hay A100 **25,66**. Ba file phi_B32 lịch sử đã sao chép nguyên trạng và kiểm tra cấu trúc/SHA-256 trong `H4-historical-phi-files/`; không dùng file chẩn đoán tái sinh để nộp. Mã `src/` không đổi so với `4ca396e` đã nghiệm thu.

**Cập nhật 12/11/2026 (Chí):**
- **Quyết định gỡ chặn Hòa** (chi tiết ở đầu [nhiem_vu_Hoa.md](nhiem_vu_Hoa.md)):
  - **M3: giữ hướng thuộc tính (02)** theo đúng luật của 02. Hòa chạy H10 ngay.
  - **H5:** file test lịch sử sinh trên A100. Khi khác GPU, tiêu chí đạt là top-1 trùng ≥ 99% và tập hợp top-10 trùng ≥ 95%. Lượt 26/10 cho 99,59% và 96,31% nên đạt. Hòa chạy tiếp E1.7b/c/e/f và H4.
- **Doanh** (kết quả ở Drive riêng `Doanh_SEARLE`, [link](https://drive.google.com/drive/folders/1aIGshqcJNtr_QBon3mh_72pF-_S_xcec)):
  - D3, D4 xong 26/10. Cấu hình mặc định targetpad 1.25 + bicubic tốt nhất (R@1 25,50). Lật ảnh không giúp, nên Chí chốt giữ mặc định.
  - D5 (E3.1, 10/11): **CIRR dùng được**. Nặng nhất là `motion_blur:2` −2,80, `low_light:2` −2,25, `salt_pepper:2` −2,03; nhẹ nhất `low_res:1` −0,10.
  - **E3.1 trên CIRCO không dùng được** do lệnh mẫu trong kế hoạch thiếu `--exclude-reference`. Ảnh tham chiếu sạch đứng hạng 1 ở 116/220 truy vấn; khi ảnh bị làm xấu, nó tụt hạng làm mAP@5 tăng giả (`motion_blur:2` +1,81). Đã sửa lệnh, Doanh chạy lại 17 lượt CIRCO.
  - D6 (E3.5) xong: lọc thông thấp từ bán kính 0,1 trở lên gần như không mất điểm; lọc thông cao mất 4,6–7,7 điểm.
  - D7 một phần: đã có đặc trưng 9 phiên bản ảnh shard s0; `phi_s0_clean` 50 epoch cho R@1 24,32.
- **Hòa H18-P1** (11/11, [Drive](https://drive.google.com/drive/folders/1v0oeRA5u0r6NOEeTRMODYQGc8x4crAfg)): bộ câu P1 cho CIRCO mAP@5 5,85 so với 6,67 của P0. Chênh −0,81, CI [−2,13; +0,52] chứa 0, nên chưa kết luận. Phần P2/P3 chờ D16.

**Cập nhật 31/10/2026:** H14 đã hoàn thành phần tổng hợp kết quả hiện có: [bản bàn giao](https://drive.google.com/file/d/1Sgz4m2cfz_cRWWeWg8ceqXJqqgrgtOcH/view) và [gói bảng/CSV/6 hình/báo cáo nguồn](https://drive.google.com/file/d/1oiSszdML3RktHy71994U4yb5ADqLFU6C/view). Đã kiểm tra 71 dòng OTI (70 snapshot + đối chứng), sáu hình hợp lệ; không chạy lại các thí nghiệm đã nghiệm thu. H14 vẫn một phần vì còn thiếu cấu hình cuối và điểm test.

**H16 hoàn tất 31/10/2026 lúc 16:59 (giờ Việt Nam):** đã train đủ 100/100 epoch và đánh giá CIRR/CIRCO, experiment `phi_B32_cosine_Hoa_20261031_062447_bcb2c7`, code `7df558e`, A100 40 GB, seed 42, cosine LR/warm-up 5 epoch. CSV đủ 100 epoch và 20 mốc validation; checkpoint cuối epoch 100, tham số hữu hạn. Bốn lượt đối chứng/cosine đủ 4.181 truy vấn CIRR và 220 truy vấn CIRCO mỗi lượt, không lỗi ảnh, không bỏ hoặc trùng truy vấn. CIRR R@1: 25,47 → 24,61 (−0,86 điểm; CI 95% [−1,55; −0,17]); CIRCO mAP@5: 6,46 → 7,69 (+1,24 điểm; CI [+0,24; +2,31]). CI ghép cặp 1.000 lần, seed 0; một seed train, chưa điều chỉnh nhiều phép so sánh. CIRCO giữ mặc định ảnh tham chiếu, không so trực tiếp với H6-ex. Kết luận: tăng CIRCO nhưng giảm CIRR. [Báo cáo](https://drive.google.com/file/d/1zsgdbUUE3uzCAqg64RLKGpj1uSj8VXQ-/view) · [Toàn bộ phiên](https://drive.google.com/drive/folders/1oH1crt3x-9zLRfcVnpcMG6-iZnFiOfqx). Hòa hoàn tất **9/20 (45%)**. H14 đã bổ sung kết quả H16 vào gói tổng hợp, vẫn một phần vì thiếu cấu hình cuối và test chính thức.



**Bổ sung 26/10/2026, 22:06:** Đã xong **E4.4/E4.5 của H11 và E1.13 của H12**. [Báo cáo](https://drive.google.com/file/d/16TaOoHstW6zlG53JiFEHdRK8LJQhzQTS/view) · [Toàn bộ kết quả](https://drive.google.com/drive/folders/14iiUAXRMQoC6yjmJW6MhWXVRyryc_sCx). Hòa vẫn **8/20 việc (40%)** vì H11/H12 còn phần chờ cấu hình cuối.

**Nghiệm thu H11/H12:** Phiên `Hoa_independent_20261026_215746`, code `c5c67a4`, Python 3.8.20/PyTorch 1.11.0+cu113, Tesla T4. Khôi phục từ `CIRR_D2_val_20261021.zip`, giải mã đủ 2.297 ảnh. Năm mức fusion 0,05/0,1/0,2/0,3/0,5 đạt CIRR R@1 **24,09 / 22,89 / 20,57 / 18,25 / 15,02**, đều thấp hơn baseline phi_B32 **25,50**. Prompt ensemble 6 mẫu đạt **24,85**, chênh lệch **−0,65**, CI 95% **[−1,17; −0,10]**. Đủ 4.181 truy vấn/lượt, không lỗi ảnh, không bỏ truy vấn, không trùng qid. CI ghép cặp 1.000 lần, seed 0, trên cùng 4.181 truy vấn; CI chênh lệch R@1 ở cả 6 cấu hình đều âm (chưa điều chỉnh cho nhiều phép so sánh). E1.13 đủ **10 hình**, seed 0, chọn truy vấn baseline có target trong top-5, patch 32/stride 16; đây là ví dụ định tính trên truy vấn thành công. Có `audit.json`, `report.md`, `summary.md`, `E4-ci-cirr/ci.md`, `provenance.json`, `occlusion-selection.json`. Lỗi tổng hợp ban đầu do dòng baseline không có `n_shared` đã xử lý bằng `finalize.py`; không chạy lại thí nghiệm, giữ log gốc. Không tự chọn cấu hình cuối hoặc xác nhận M3.

**Các nhiệm vụ hoàn tất trước đó, 26/10/2026:** Đã hoàn tất các nhiệm vụ ưu tiên **H9 → H6 → H7 → H8 → H17 → H15**. Hòa xong **8/20 việc (40%)**. Xem [báo cáo đầy đủ](https://drive.google.com/file/d/11c41xyaQuQs4d539t14yvXBUh_2F2C5m/view), [đường cong warm-start](https://drive.google.com/file/d/1nd2LjgVgccAiC_MOQEJzKkMKZyKJbfWn/view) và [CSV snapshot](https://drive.google.com/file/d/16iV-_HNPj16iTxI2zaUDrOsaqopz4QjW/view). Kết quả ở [phiên H9/CIRR/FashionIQ](https://drive.google.com/drive/folders/1PcRJRBL0FmORSTBWWp6SjjmvmgJlK0QJ) và [phiên CIRCO/OTI](https://drive.google.com/drive/folders/13VXpfwTRmQoKvQjO1LfLno_V0s9Ezkty).

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
| Kế hoạch 2 tuần: Hòa (H1–H18, T1–T2) | 10 | 20 | 50% | H2, H3, H5, H6, H7, H8, H9, H15, H16, H17 xong; H10 xong quét E2.3 (40 lượt), chờ Chí chọn trọng số; H4 chờ T4; H18 P2/P3 chờ Doanh |
| Kế hoạch 2 tuần: Doanh (D1–D17) | 5 | 17 | 29% | D1–D4, D6 xong; D5 (CIRCO chạy lại), D7 một phần; D8 là việc kế tiếp |
| **Kế hoạch 2 tuần: cả nhóm** | 32 | 61 | **52%** | Phần chạy trên Colab xong 15/37 việc; H5 hoàn tất và H10 xong phần quét E2.3 (40 lượt) ngày 12/11 |
| Mốc kiểm tra M1–M5 | 1 | 5 | 20% | M3 đạt 12/11 (giữ hướng 02); M1, M2, M4, M5 quá hạn chưa đạt |

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
- [ ] **H4** (Ngày 2) Sinh file test của SEARLE gốc; nộp test SEARLE gốc và phi_B32 (B8–B11) (12/11: **đã gỡ chặn**, theo quyết định H5 của Chí; phi_B32 nộp bằng file lịch sử, SEARLE gốc sinh trên T4)
- [x] **H5** (Ngày 3) Kiểm tra không hồi quy; baseline E1.7a–f — 12/11: E1.7a/d và kiểm tra code gốc/main cùng T4 đã xong 26/10; tiêu chí test khác GPU đã được Chí chấp thuận. Đã chạy nốt E1.7b/c/e/f trên L4, đủ 220 truy vấn CIRCO và 6.016 truy vấn FIQ mỗi lượt, không lỗi ảnh/truy vấn bị bỏ/trùng. Xem cập nhật và link phiên 12/11 ở đầu trang. Lượt chẩn đoán SEARLE L4 R@1 25,52 được ghi riêng, không thay mốc T4/A100.
- [x] **H6** (Ngày 4) Baseline CLIP E1.8 và CBIR E1.9 — 26/10: đủ 26 lượt baseline CIRR/FashionIQ/CIRCO, không lỗi ảnh hoặc truy vấn bị bỏ. CBIR CIRCO là phần tùy chọn, chưa chạy; CBIR+text CIRR đã chạy. Xem summary-all.md trong phiên CIRCO/OTI.
- [x] **H7** (Ngày 5) Kiểm tra dữ liệu bằng công cụ E1.2; khoảng tin cậy E1.4; gom kết quả — 26/10: đủ ba bảng CI 95%, 1.000 lần bootstrap, seed 0, baseline phi_B32 cùng tập; kiểm tra bộ val local đủ ảnh/truy vấn và gom 26 lượt vào summary-all.md.
- [x] **H8** (Ngày 6) Taxonomy E1.10 cả ba tập; keep-edit E1.11, token E1.15a và modality gap E1.15b CIRR/CIRCO — 26/10. Keep-edit CIRCO dùng phi_B32 --exclude-reference của H6 thay cho lượt E1.7e chưa nghiệm thu ở H5. Có report.md và các hình tokens.png, gap.png; phần bổ sung token OTI sẽ chạy sau H15.
- [x] **H9** (Ngày 7) Thống kê thuộc tính E2.0 và đồng thuận bộ đo E2.2 — 26/10: đủ ba tập, không lỗi ảnh; CIRR 67,1%/ngẫu nhiên 45,8%; FashionIQ 75,8%/51,6% trên 9.778 ràng buộc; CIRCO 62,7%/49,3%. Đủ dữ liệu bàn giao M3; Chí chưa quyết định giữ/đổi hướng.
- [ ] **H10** (Ngày 8–9) Quét xếp hạng lại (E2.3); mặt nạ (E2.4); phủ định (E2.5) — 12/11: **xong quét E2.3, 40/40 lượt**, hai bảng CI ghép cặp, seed 0; mọi truy vấn/ứng viên được kiểm tra đủ, truy vấn không có ràng buộc giữ nguyên top-100. Màu w=0,3 tốt nhất CIRR: R@1 25,47 → 25,57; CI Δ [−0,12; +0,29] chứa 0. Còn K=50, E2.4/E2.5 chờ Chí chọn trọng số; chưa chốt cấu hình cuối.
- [ ] **H11** (Ngày 10) Kết hợp (E2.6), tổng quát hoá (E2.7), kết hợp điểm (E4.4), ensemble prompt (E4.5) — 26/10: **E4.4/E4.5 đã xong**, 5 trọng số fusion và 1 ensemble, đủ 4.181 truy vấn/lượt, có CI ghép cặp. Còn E2.6/E2.7 chờ cấu hình cuối của Chí. Xem báo cáo H11/H12 ở đầu trang.
- [ ] **H12** (Ngày 11) Ví dụ định tính (E1.12), bản đồ che khuất (E1.13), ví dụ có giải thích (E2.8) — 26/10: **E1.13 đã xong**, đủ 10 hình che khuất baseline phi CIRR, seed 0. Còn E1.12/E2.8 chờ kết quả cấu hình cuối.
- [ ] **H13** (Ngày 12) Nộp test cấu hình cuối (E2.9); khoảng tin cậy bảng chính
- [ ] **H14** (Ngày 13) Tổng hợp bảng, hình → bàn giao Chí (một phần: đã gom baseline/OTI/H11/H12 và bổ sung báo cáo, CSV, CI, đường cong H16 ngày 31/10; còn thiếu cấu hình cuối và điểm test chính thức; chưa gửi thông báo) 12/11: đã bổ sung bốn baseline H5, 40 lượt E2.3, CSV/CI/báo cáo và gói bàn giao phiên mới; vẫn thiếu cấu hình cuối/điểm test.
- [x] **H15** (Ngày 11) OTI warm-start CIRCO val E7.1a–d — 26/10: đủ 5 cấu hình (random 0,02; phi 0,02/0,005; SEARLE 0,02/0,005), 7 snapshot × token thường/EMA = 70 lượt đánh giá, seed 42. Mỗi lượt đủ 220 truy vấn, không lỗi ảnh hoặc truy vấn bị bỏ. Đã phân tích lại token OTI, lưu thời gian batch, đường cong và CI ghép cặp với P0. Xem H17_H15_attempt2/, oti-snapshot-metrics.csv, oti-inversion-timing.csv, oti-warmstart-curves.png, E7.1-ci-finals-circo/ trong phiên CIRCO/OTI. Chí chọn cấu hình cho D15; chưa tự chọn thay nhóm.
- [x] **H16** (Ngày 10) Train phi với lịch LR cosine (E8.2a) — 31/10: đủ 100 epoch, checkpoint cuối và đánh giá CIRR/CIRCO cùng đối chứng; có CI ghép cặp và báo cáo nghiệm thu ở đầu trang.
- [x] **H17** (Ngày 7) Liên kết khái niệm CIRCO val E7.0 và OTI E6.2-Pλ0 — 26/10: CSV đủ 220 ảnh tham chiếu, 250 khái niệm/ảnh; OTI 350 bước, seed 42, bộ câu gốc với lambda_gpt=0; mAP@5/10/25/50 = 2,16/3,03/3,89/4,32. Đánh giá đủ 220 truy vấn, không lỗi ảnh/truy vấn bị bỏ. Kết quả ở phiên CIRCO/OTI, thư mục H17_H15_attempt2. Giữ mặc định không --exclude-reference theo kế hoạch.
- [ ] **H18** (Ngày 13) OTI với bộ câu GPT mới trên CIRCO val (E6.2) (một phần: P1 xong 11/11, mAP@5 5,85 so với P0 6,67, CI chênh lệch [−2,13; +0,52]; P2/P3 chờ D16)
- [ ] **T1** (Ngày 6, tuỳ chọn) Train phi trên shard s0 (E1.14a = E8.1a)
- [ ] **T2** (Ngày 8, tuỳ chọn) Train phi trên shard s0 + s1 (E1.14b = E8.1b)

## Kế hoạch 2 tuần: Doanh (Colab)

Chi tiết: [nhiem_vu_Doanh.md](nhiem_vu_Doanh.md).

- [x] **D1** (Ngày 1) Dựng Colab, giải nén ImageNet, kiểm tra file trên Drive (ImageNet đủ 100.000 ảnh; CIRR val đủ 2.297 ảnh) — 21/10
- [x] **D2** (Ngày 2) Chạy thử train 2 epoch, đo thời gian (A100: epoch 1 R@1 22.24 so với mốc 22.05, epoch 2 22.79 so với 22.53; khoảng 2,4 phút mỗi epoch nên 100 epoch mất khoảng 4 giờ; kết quả ở `results/Doanh_D2_20261021_COMPLETED`) — 21/10
- [x] **D3** (Ngày 3) Đệm ảnh (E4.1), nội suy (E4.2) — 26/10: 9 lượt CIRR; targetpad 1.25 + bicubic tốt nhất (25,50); pad 1.0 −1,70, clipcrop −2,15, nearest −2,46
- [x] **D4** (Ngày 4) Lật ảnh (E4.3); cấu hình tốt nhất trên CIRCO, FIQ — 26/10: flip-gallery +0,05, flip-ref −0,29; Chí chốt giữ mặc định (12/11), lượt CIRCO/FIQ của cấu hình mặc định chính là baseline H6 của Hòa
- [ ] **D5** (Ngày 5) Mức sụt giảm với 8 loại suy giảm (E3.1) (một phần: 16 lượt CIRR 10/11 dùng được; 16 lượt CIRCO phải chạy lại với `--exclude-reference`, tên `-circo-ex`)
- [x] **D6** (Ngày 5) Phân tích miền tần số (E3.5) — 10/11: 10 lượt CIRR; lowpass ≥ 0,1 mất ≤ 0,24 điểm, highpass mất 4,6–7,7 điểm
- [ ] **D7** (Ngày 6) Đặc trưng ảnh xấu shard s0; bắt đầu sàng lọc phi bền (E3.8a) (một phần: đặc trưng 9/9 phiên bản, `phi_s0_clean` 50 epoch R@1 24,32 ngày 10/11)
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
- [x] **M3** (Ngày 7, 23/10) Có E2.0, E2.2 và quyết định giữ hay đổi đóng góp chính — 12/11: giữ hướng thuộc tính (02)
- [ ] **M4** (Ngày 11, 27/10) Đủ kết quả chính của 02, 03, 04; phi bền bản đầy đủ đã train; demo có 2 tab mới
- [ ] **M5** (Ngày 14, 30/10) Báo cáo, slide, video, README hoàn chỉnh; nộp bài

## Việc tiếp theo

1. **Hòa (12/11):** H5 đã hoàn tất, H10 đã xong quét E2.3 (40 lượt) và bàn giao bảng/CI. Chờ **Chí chọn trọng số** để chạy top-k, mask, negation. H4 chờ T4 và kiểm tra đúng mốc 25,59 ±0,05 trước khi sinh SEARLE chính thức; phi_B32 dùng ba file lịch sử đã kiểm tra trong phiên 12/11. Chưa nộp server.
2. **Doanh:**
   - chạy lại E3.1 trên CIRCO (16 lượt + 1 lượt ảnh sạch, biến `CIRCO` mới có `--exclude-reference`, tên thư mục `-circo-ex`);
   - tiếp D8: E3.2 phục hồi cố định trên CIRR, hai bản sàng lọc `phi_s0_degaug`, `phi_s0_noise`;
   - chép kết quả vào `SEARLE/results` chung hoặc ghi link vào file này.
3. **Chí:**
   - sau E3.2 thì điền `src/restore_oracle.json`;
   - trước E3.3, hiệu chỉnh ngưỡng `--restore auto` trên CIRR train:
     `$PY tools/calibrate_restore_rules.py --images-dir $DATA/CIRR/train --n 300 --out src/restore_rules.json --report-dir $DRIVE/results/E3.3-calibration`
   - chọn cấu hình warm-start cho D15: E7.1 chưa có cấu hình nào hơn khởi tạo ngẫu nhiên rõ ràng, nên D15 có thể bỏ;
   - chọn trọng số từ kết quả 40 lượt E2.3 của Hòa ngày 12/11 (`E2.3-cirr-selection-proposal.json` và hai bảng CI); sau E2.4/E2.5 mới gửi cấu hình cuối (C18);
   - C1: đóng gói lại `CIRR.tar`, `FashionIQ.tar` và dọn 4 thư mục `dryrun_2ep`;
   - C17–C20.
