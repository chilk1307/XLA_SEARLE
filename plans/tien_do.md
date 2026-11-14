# Tiến độ dự án

**14/11/2026 — Hòa hoàn tất H1, H13 và H14; đủ 20/20 việc (100%) theo cấu hình mặc định phi_B32.** [Notebook](https://colab.research.google.com/drive/1fy8aH6k1unuvMVEdZdxleBn30Vr71oC0) · [Gói H14 cuối, báo cáo và bảng kết luận bàn giao](https://drive.google.com/drive/folders/1AfGRsrFrKQliryolxddAvKZOS8p40Yfq). Cả nhóm **51/61 (84%)**; hoàn tất phần Hòa không có nghĩa toàn bộ dự án đã xong.

- **H1:** thực hiện quyết định Chí `470a568`, checkout runner `158927b`: đổi `CIRR.tar` (6.449.920.000 byte) thành `.broken`, `FashionIQ.tar` (0 byte) thành `.empty`; chuyển đủ bốn `dryrun_2ep*` chỉ có hyperparameters.json sang `outputs/discarded/dryrun_2ep_D2/`, SHA-256 giữ nguyên. Không xoá ảnh/checkpoint, không đóng gói thêm dữ liệu. Chạy `prepare_data.sh cirr circo fiq`, cả ba đường dẫn sẵn sàng, exit 0. Lần đầu FIQ `ls` bị I/O và in nhầm 0 ảnh; đã giữ log lỗi, đối chiếu metadata đủ 6.016 truy vấn/15.536 vị trí gallery (15.415 tên ảnh), giải mã ảnh mẫu theo tên trực tiếp, rồi chạy lại script nguyên bản: cả ba `already in`, không lỗi. Không coi log lần đầu là nghiệm thu hay kiểm kê ảnh mới.
- **H13:** dùng lại ba file/điểm test phi_B32 đã nghiệm thu H4 và CI H7 theo cấu hình mặc định Chí cho phép; **không sinh/nộp test thêm, không chạy lại mô hình**. Bảng đủ 23 chỉ số val/CI và 16 chỉ số test. CIRR val R@1 **25,50 [24,23;26,74]** (4.181 truy vấn); FIQ R@10 **22,83 [21,80;23,88]** (6.016); CIRCO mAP@5 **8,85 [6,79;11,47]** (220). FIQ/CIRCO dùng exclude-reference; val T4, test phi lịch sử A100. Không gán CI val cho test. Test: CIRR R@1 **23,349**, subset R@1 **54,458**, CIRCO mAP@5 **9,44**. Nguồn `tables/H13_final_val_ci.csv`, `tables/H13_reused_official_test.csv`, audit và cấu hình trong `sources/closeout_20261114/` của H14.
- **H14:** đã chạy collector từ 212 bản ghi nguồn, gom **38 CSV, 74 PNG**, `summary.md`, báo cáo MD/HTML, `BAN_GIAO_CHO_CHI.md` (mã thí nghiệm → một câu kết luận), log/audit và SHA-256. Bàn giao bằng thư mục chung và plans; chưa gửi email/tin nhắn riêng. Tên ZIP/report H14 giữ nguyên, nội dung là bản cuối.
- **Nhánh phi bền/C18 vẫn mở:** chỉ bổ sung test nếu E3.8c có cận dưới CI ΔR@1 sạch ≥ −1,0 và CI ΔR@1 trung bình tám suy giảm nằm hẳn trên 0. Không ghi phi bền đạt điều kiện khi chưa có kết quả. P3 vẫn tùy chọn; H10/H11/H12/H18/T1/T2 không cần chạy lại.

**14/11/2026 khuya (Chí): gỡ chặn H1, H13, H14** (chi tiết ở đầu [nhiem_vu_Hoa.md](nhiem_vu_Hoa.md)).
- **C1 xong: không đóng gói lại dữ liệu.** Các thư mục đã giải nén trên Drive là nguồn chính thức (H2 đã kiểm tra đủ). `colab/prepare_data.sh` giờ bỏ qua `.tar` rỗng hoặc bị cụt và dùng thư mục, đã thử với ba trường hợp. Hòa đổi tên `CIRR.tar` → `.broken` và `FashionIQ.tar` → `.empty`, chuyển 4 thư mục `dryrun_2ep` vào `outputs/discarded/`, chạy lại ô 4 là H1 xong.
- **C18: luật cấu hình cuối ghi trước.** Mặc định giữ phi_B32: H13 dùng lại điểm test của H4 và CI của H7. Chỉ nộp thêm `phi_B32_robust` khi E3.8c cho thấy cả hai: trên ảnh sạch CIRR cận dưới CI của Δ R@1 ≥ −1,0, và Δ trung bình 8 suy giảm có CI > 0. Doanh báo đúng hai con số này (cách tính ở [nhiem_vu_Doanh.md](nhiem_vu_Doanh.md)).

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

**14/11/2026 tối (Chí): chốt D10.** Doanh đã chạy xong trong ngày: D9, E3.3, E3.4, E3.6, E3.7, E3.9, D16 (thư mục `Doanh_SEARLE`).
- **D9 → phi bền dùng `degaug`:** trung bình 8 suy giảm R@1 23,16 so với `clean` 22,79 (+0,37) và `noise` 23,02; suy giảm chưa thấy khi train vẫn +0,31; ảnh sạch −0,24 (24,16 so với 24,40). Doanh train ngay `phi_B32_robust` 100 epoch (D10, khoảng 4 giờ A100), sau đó chạy E3.8c. Bảng và lý do ở đầu [nhiem_vu_Doanh.md](nhiem_vu_Doanh.md).
- **E3.3 (CIRR, `mixed`):** không phục hồi 24,49; `auto` **25,16** (+0,67); `auto_iqa` 25,04; `oracle` 24,97. Trên **ảnh sạch**, `auto` còn 25,21 và `auto_iqa` 25,09, so với 25,50: phục hồi tự động làm hỏng nhẹ ảnh tốt, vì `auto` xử lý 63% ảnh sạch (riêng `deblock` 720 ảnh do ảnh CIRR vốn là JPEG). CIRCO `mixed` + `auto`: mAP@5 9,77.
- **Ngưỡng `--restore auto`** hiệu chỉnh trên 300 ảnh CIRR train (nhận đúng loại suy giảm 81,3%). Chí đã commit `src/restore_rules.json` (đúng file Doanh dùng cho E3.3).
- **D16:** bộ câu P2 (Qwen2.5-1.5B, CIRCO val) đã sinh. Doanh chép sang `SEARLE/outputs/GPT_phrases/` để Hòa chạy H18-P2.

**14/11/2026 (Chí): quyết định sau E2.3b và D5–D8.**
- **Hòa, H10:** xác nhận màu w = 2 cho phân tích (K = 50, E2.4, E2.5; 12 lượt, lệnh ở đầu [nhiem_vu_Hoa.md](nhiem_vu_Hoa.md)). Cả ba họ đều có CI chứa 0, nên **cấu hình cuối không dùng xếp hạng lại thuộc tính** (phi_B32 mặc định, chính là cấu hình đã nộp test ở H4). Riêng hoa văn với w = 4 làm FIQ R@10 giảm 0,56 điểm (CI [−0,90; −0,24]): trọng số lớn khuếch đại sai số của bộ đo.
- **Doanh** (thư mục `Doanh_SEARLE`, 13–14/11):
  - **D5 xong:** đã chạy lại E3.1 CIRCO có `--exclude-reference`. Ảnh sạch mAP@5 8,78. Giảm mạnh nhất là `low_light:2` −2,01 và `salt_pepper:2` −1,28; một số loại vẫn tăng nhẹ (`color_cast:2` +1,21) trong mức nhiễu của 220 truy vấn.
  - **D8 xong:** E3.2 đủ 18 lượt, E4.3b, hai bản sàng lọc `phi_s0_degaug` và `phi_s0_noise` 50 epoch (R@1 sạch 24,20 và 24,16, so với clean 24,32).
  - **D7 xong.**
  - **E3.2:** phục hồi đúng loại cứu được nhiều điểm: median trên `salt_pepper:2` +1,72, Wiener trên `motion_blur:2` +1,87, gamma trên `low_light:2` +0,79. Nhưng **PSNR tăng không kéo theo truy xuất tăng**: NLM trên `gauss_noise:2` tăng PSNR 5,8 dB, SSIM từ 0,36 lên 0,72, mà R@1 giảm 0,65.
  - Chí đã điền `src/restore_oracle.json` từ E3.2. Doanh tự hiệu chỉnh ngưỡng `--restore auto` trên CIRR train rồi chạy E3.3 song song với D9. **D15 bỏ** (E7.1 không có cấu hình warm-start nào hơn rõ ràng).

**14/11/2026 — T2 đã hoàn tất và nghiệm thu:** [Notebook T1/T2](https://colab.research.google.com/drive/1fy8aH6k1unuvMVEdZdxleBn30Vr71oC0) · [Báo cáo, ZIP, CSV/CI và hình T2](https://drive.google.com/drive/folders/1aYIIvTm-csZG0pfFfhA-fkmgab4vubG0). **E1.14b = E8.1b**, experiment `phi_scale_s01_Hoa_20261114_c059b1`, source `e64f1c5` như T1, A100-SXM4-80GB. Đã train **66.667 ảnh/token s0+s1**, seed 42, batch 256, LR cố định 0,0001; đủ **100 epoch, 20 mốc validation, checkpoint epoch 100**, loss/tham số hữu hạn. Hoàn tất **14:53:55 (GMT+7)**. Ba lượt CIRR T2/T1/phi_B32 cùng A100 đều đủ 4.181 truy vấn, không lỗi ảnh/bỏ/trùng qid; chỉ số khớp trung bình dump từng truy vấn. **R@1 T2 24,68%; T1 24,30%; phi_B32 25,47%.** T2 − T1: **+0,38 điểm, CI 95% [−0,29; +1,05]** chứa 0; T2 − phi_B32: **−0,79 điểm, CI [−1,32; −0,26]**. Hai CI ghép cặp 1.000 lần, seed 0. Một seed train, số bước cập nhật khác theo lượng ảnh khi giữ 100 epoch; chưa kết luận bão hòa hoặc nhân quả chỉ do dữ liệu. Đã kiểm tra hash checkpoint/gói, lưu báo cáo và bổ sung H14. **Hòa 13/20 (65%)**; T1/T2 đã xong, không train lại.

**14/11/2026 — T1 đã hoàn tất và nghiệm thu:** [Notebook T1](https://colab.research.google.com/drive/1fy8aH6k1unuvMVEdZdxleBn30Vr71oC0) · [Báo cáo, gói bàn giao và nguồn](https://drive.google.com/drive/folders/1Efh_KhmM6PldYHMM9VrSS2ovZv3KfokS). **E1.14a = E8.1a**, một thí nghiệm `phi_scale_s0_Hoa_20261114_e0dbcd`, code `e64f1c5`, không sửa `src/`; NVIDIA A100-SXM4-80GB. Đủ **33.334 ảnh/token EMA s0, 100/100 epoch, 20 mốc validation, checkpoint epoch 100**, tham số/loss hữu hạn; hoàn tất **11:46:55 (GMT+7)**. Seed 42, batch 256, LR cố định 0,0001; cache s0 chọn đúng hàng theo tên từ cache 100.000 ảnh, có SHA-256/provenance. T1 và phi_B32 đối chứng cùng A100/CIRR val đều đủ **4.181 truy vấn**, không lỗi ảnh/bỏ/trùng qid. R@1: **25,47 → 24,30**, Δ **−1,17 điểm**, CI 95% **[−1,89; −0,45]** (bootstrap ghép cặp 1.000 lần, seed 0). Một seed train; số bước cập nhật khác nhau khi giữ 100 epoch, nên không kết luận nhân quả chỉ do lượng dữ liệu. Đã lưu báo cáo MD/HTML, bốn CSV, ba hình, audit, manifest/SHA-256 và bổ sung H14. **Tại mốc nghiệm thu T1: Hòa 12/20 (60%); T2 được khởi chạy sau đó (xem cập nhật đầu trang).**

**H14 — bàn giao cuối 14/11/2026:** [ZIP, báo cáo, bảng/CI, hình và kết luận bàn giao](https://drive.google.com/drive/folders/1AfGRsrFrKQliryolxddAvKZOS8p40Yfq). Có **38 CSV, 74 PNG**, đủ H1/H13 và toàn bộ kết quả trước đó; **Hòa 20/20 (100%)** theo phi_B32 mặc định. Nhánh phi bền thuộc D10/E3.8c/C18 vẫn mở; chưa gửi email/tin nhắn riêng.

**H4 hoàn tất 13/11/2026:** người dùng đã nộp đủ **6/6 file** và đã lưu điểm test chính thức của phi_B32 và SEARLE gốc: bốn kết quả CIRR rc2 (recall và recall_subset) cùng hai email CIRCO. Người dùng xác nhận thứ tự CIRCO: `phi_B32_circo.json` trước, `searle_official_circo.json` sau. Tại mốc H4: Hòa **11/20 việc (55%)**; cả nhóm **33/61 (54%)**; giai đoạn 0 **15/15 (100%)**. H13 là lượt test cấu hình cuối riêng, chưa hoàn tất.

| Mô hình | CIRR test R@1 | CIRR test R@5 | CIRR test R@10 | CIRR test R@50 | CIRR subset R@1 | CIRCO test mAP@5 | CIRCO test mAP@10 |
|---|---:|---:|---:|---:|---:|---:|---:|
| phi_B32 | 23.349 | 52.651 | 66.940 | 89.735 | 54.458 | 9.44 | 9.79 |
| SEARLE gốc | 23.301 | 52.916 | 66.916 | 89.831 | 54.000 | 9.39 | 9.96 |

Các số đều là phần trăm; đây là **test**, không thay thế số val. [Đủ chỉ số, tên file và mốc trả kết quả B8–B11](nhat_ky_thi_nghiem.md). Không kết luận khác biệt có ý nghĩa thống kê từ các điểm đơn lẻ này. H10/H11/H12/H18 đã nghiệm thu 14/11; H13 chờ C18; P3 tùy chọn.

**Cập nhật 13/11/2026 (Hòa — E2.3b): đã hoàn thành 24/24 lượt mới**, gộp với 40 lượt E2.3 thành **64 cấu hình**. Màu/độ sáng/hoa văn × w = 0,5 / 1 / 2 / 4 × CIRR/FashionIQ; K=100, mask=auto, negation=on, FashionIQ có `--exclude-reference`. NVIDIA L4, cùng checkpoint, sáu cache CLIP và hai cache thuộc tính cuối E2.3; SHA-256 khớp, không sửa `src/`. Hai đối chứng chạy lại khớp toàn bộ chỉ số và thứ hạng top-100 của đợt E2.3. Mỗi lượt đủ 4.181 truy vấn CIRR hoặc 6.016 truy vấn FashionIQ; không lỗi ảnh, không bỏ/trùng truy vấn, không thiếu phép đo. Có hai bảng CI ghép cặp 1.000 lần, seed 0, bảng gộp 64 lượt và hình đường cong.

**Đề xuất trọng số theo luật 13/11 (chờ Chí xác nhận):** chọn bằng R@1 CIRR trong tám mức, hòa điểm lấy w nhỏ hơn; FashionIQ chỉ báo cùng w.

| Họ | w | CIRR R@1 | Δ | CI 95% của Δ | FIQ R@10 cùng w | Δ FIQ | CI 95% Δ FIQ |
|---|---:|---:|---:|---|---:|---:|---|
| color | 2 | 25.78 | +0.31 | [-0.19; +0.79] | 22.81 | +0.00 | [-0.37; +0.36] |
| brightness | 1 | 25.52 | +0.05 | [-0.07; +0.17] | 22.90 | +0.08 | [-0.07; +0.24] |
| pattern | 0.1 | 25.50 | +0.02 | [+0.00; +0.07] | 22.81 | +0.00 | [-0.05; +0.05] |

Cả ba họ đều không có CI cải thiện nằm trên 0; theo luật đã ghi trước, cấu hình cuối sẽ không dùng xếp hạng lại thuộc tính. E2.4/E2.5 vẫn cần làm để phân tích. CI chưa điều chỉnh nhiều phép so sánh/thiên lệch chọn cấu hình. **H10 vẫn một phần (tại thời điểm bàn giao E2.3b, Hòa 10/20)**: chờ Chí xác nhận trọng số màu rồi chạy K=50, E2.4, E2.5. H4 được hoàn tất sau đó trong tối 13/11 (xem đầu trang). H14 đã bổ sung bảng, CI, hình và báo cáo phiên này.

[Kết quả, log, CSV/CI và gói bàn giao](https://drive.google.com/drive/folders/1I-Oipj7zGYGknrmTmdpn1r0uQw9ZyqWZ) · [Notebook E2.3b](https://colab.research.google.com/drive/1ggEMwP8H6py3XT_g7ERROVSk9Xox2rga). Tệp chính: `E2.3-and-E2.3b-all-64.csv`, `E2.3b-selection-proposal.json`, `Hoa_H10_E23b_20261113_report.md`, `Hoa_H10_E23b_20261113_handover.zip`. Audit đối chiếu tập ứng viên với lượt xếp hạng lại cùng họ của E2.3 (w=0,3): ranh giới top-100 có ảnh đồng điểm nên không bắt buộc trùng pool của đối chứng `argsort`. Mọi truy vấn không có ràng buộc vẫn khớp đối chứng; đây là sửa kiểm tra phụ trợ, không sửa mã thí nghiệm.

**Nơi lưu kết quả train/chạy Colab** (xem trước khi cập nhật tiến độ):
- **Hòa:** thư mục chung `SEARLE`, mục `results/Hoa_*`: https://drive.google.com/drive/folders/1EZZBD4lZxgVf65RhwHEM8eHAFYPSiZti
- **Doanh:** thư mục riêng `Doanh_SEARLE`, mục `results/` và `outputs/phi_models/`: https://drive.google.com/drive/folders/1aIGshqcJNtr_QBon3mh_72pF-_S_xcec

**Đối chiếu 13/11/2026 (Chí, trước phiên E2.3b của Hòa):** không có kết quả mới sau lần cập nhật 12/11.
- **Hòa:** lượt mới nhất là H4 và H10/H5 ngày 12/11, đã ghi bên dưới. H4 có đủ 6 file trong `results/Hoa_H4_20261112_143910_08904b/H4_ready_to_submit.zip` nhưng **chưa nộp server**; trang CIRR cần người làm hCaptcha nên phải nộp tay. Lúc đối chiếu này E2.3b chưa chạy; xem cập nhật Hòa mới hơn ở đầu trang.
- **Doanh:** không có gì mới kể từ 10/11. Chưa chạy lại E3.1 trên CIRCO (`-circo-ex`), chưa bắt đầu D8 (E3.2 phục hồi cố định, hai bản sàng lọc phi bền); `outputs/phi_models/` vẫn chỉ có `phi_s0_clean`.
- Số việc không đổi: Chí 17/24 (71%), Hòa 10/20 (50%), Doanh 5/17 (29%), cả nhóm 32/61 (52%).

**Cập nhật 13/11/2026 (Chí): trọng số xếp hạng lại thuộc tính.** Chưa chọn trọng số từ 40 lượt E2.3 của Hòa. Với w = 0,05–0,3, mọi họ đều gần như không đổi chỉ số: CIRR R@1 lệch tối đa +0,10 (màu, w = 0,3; CI [−0,12; +0,29]), FIQ R@10 lệch tối đa ±0,05. Lý do: điểm mới = z(CLIP) + w · c với c ∈ [0, 1], nên w ≤ 0,3 hiếm khi đổi được thứ hạng; lượt quét mới nằm ở vùng chưa có tác dụng. Hòa chạy **E2.3b**: w = 0,5 / 1 / 2 / 4 cho màu, độ sáng, hoa văn (24 lượt). Luật chọn trọng số ghi trước ở đầu [nhiem_vu_Hoa.md](nhiem_vu_Hoa.md): chọn trên CIRR; nếu không họ nào có CI > 0 thì cấu hình cuối không dùng xếp hạng lại thuộc tính.

**Cập nhật 12/11/2026 (Hòa — H5):** H5 đã chạy xong bốn lượt còn thiếu E1.7b/c/e/f trên L4, commit `8673464`: SEARLE/phi_B32 CIRCO mAP@5 **6,82 / 6,46** (220 truy vấn/lượt); FashionIQ trung bình R@10 **22,75 / 22,65** (6.016 truy vấn/lượt), giữ mặc định ảnh tham chiếu. Không trộn các số này với H6-ex hoặc B6/B7 tập con cũ. Đủ truy vấn, không lỗi ảnh, không bỏ/trùng truy vấn. Ghép với E1.7a/d và đối chiếu cùng T4 ngày 26/10, tiêu chí test được Chí chấp thuận ngày 12/11: **H5 hoàn tất, Hòa 10/20 (50%)**. [Kết quả và log](https://drive.google.com/drive/folders/1M7qbwy9GDN5IXqudIuNLkNvHVqHJQTj4) · [Notebook](https://colab.research.google.com/drive/1tQ3wGrxBWU8OeCfmvjmSndBx7UoEOZIs).

**H10 — E2.3 đã xong 40/40 lượt:** 5 họ × 4 trọng số × CIRR/FashionIQ, K=100, mask=auto, negation=on. Mỗi lượt đủ 4.181 truy vấn CIRR hoặc 6.016 truy vấn FIQ, không lỗi ảnh, không bỏ/trùng truy vấn, không ứng viên thiếu phép đo; top-100 và chỉ số của các truy vấn không có ràng buộc thuộc họ đang xét giữ nguyên so với đối chứng cùng L4. Đối chứng CIRR R@1 **25,47**, FIQ R@10 **22,81** (`--exclude-reference` trên FIQ). Có hai bảng CI ghép cặp 1.000 lần, seed 0, CSV 40 lượt và gói bàn giao `Hoa_H5_H10_20261112_handover.zip` trong phiên ở trên. Kiểm tra 10 cache ảnh đầy đủ, đặc trưng hữu hạn, đã ghi SHA-256 checkpoint và cache.

**Kết quả chọn theo CIRR (chỉ là đề xuất để Chí duyệt):** màu w=0,3 cho R@1 **25,57**, chênh **+0,10**, CI 95% **[−0,12; +0,29]** chứa 0 nên **chưa có bằng chứng cải thiện rõ**. Điểm cao nhất của các họ còn lại: brightness w=0,05 (25,47), colorfulness w=0,05 (25,47), pattern w=0,1 (25,50), zoom w=0,05 (25,50); CI chênh lệch R@1 đều chứa 0. FIQ chỉ báo cùng w, không dùng để chọn lại tham số. CI chưa điều chỉnh nhiều phép so sánh/thiên lệch chọn cấu hình. H10 vẫn một phần: chờ Chí chọn trọng số rồi chạy K=50, mặt nạ, phủ định. Xem `E2.3-cirr-selection-proposal.json`, `CI-E2.3-cirr/ci.md`, `CI-E2.3-fiq/ci.md`, `E2.3-all-40.csv`, `final-audit.json` và `Hoa_H5_H10_20261112_report.md`.

**H4 — cập nhật sau phiên T4 ngày 12/11:** đã sinh và kiểm tra đủ **6/6 file nộp**. Baseline SEARLE CIRR val trên **Tesla T4 đạt R@1 25,5919636451**, đúng mốc 25,59 ±0,05. Hai file SEARLE CIRR đủ 4.148 truy vấn/file; file SEARLE CIRCO đủ 800 truy vấn; không lỗi ảnh hoặc bỏ/trùng truy vấn. Ba file phi_B32 dùng nguyên bản lịch sử. Đã kiểm tra query ID, số dự đoán, thành viên gallery/subset, tính duy nhất và SHA-256; đã gói `H4_ready_to_submit.zip`. **Trạng thái lúc sinh file (12/11):** còn chờ nộp server, quyền tải file và hCaptcha. **Đã hoàn tất nộp và lưu đủ điểm ngày 13/11**, xem cập nhật H4 đầu trang. [Toàn bộ phiên H4](https://drive.google.com/drive/folders/1vjmMR31sqibMUO_pWooKCRTSBtk5Xxl6) · [Notebook H4](https://colab.research.google.com/drive/1EGHZJ0bUhxkESVC-BQOFtKa5Fe7azyqu). CIRCO dùng cache gallery đầy đủ 123.403 ảnh; 798 vector tham chiếu được lấy nguyên từ đúng hàng gallery cùng backbone/tiền xử lý, đã kiểm tra torch.equal và ghi provenance; không sửa src/.

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
| **Giai đoạn 0: tái lập SEARLE** (trước kế hoạch) | 15 | 15 | **100%** | Đã đủ điểm test chính thức CIRR/CIRCO cho SEARLE gốc và phi_B32 ngày 13/11; FashionIQ val đầy đủ đã đánh giá với `--exclude-reference` ngày 26/10 |
| Kế hoạch 2 tuần: Chí (C1–C24) | 20 | 24 | 83% | 15/11: C2, C4 nghiệm thu; C17 demo xong phần code (còn kiểm tra trên trình duyệt); còn C18 (chờ E3.8c), C19, C20 |
| Kế hoạch 2 tuần: Hòa (H1–H18, T1–T2) | 20 | 20 | 100% | H1–H18 và T1/T2 hoàn tất theo cấu hình mặc định phi_B32; H1/H13/H14 nghiệm thu 14/11; P3 tùy chọn, phi bền bổ sung theo C18 |
| Kế hoạch 2 tuần: Doanh (D1–D17) | 11 | 17 | 65% | D1–D9, D12, D16 xong; D10 còn train `phi_B32_robust` (E3.3 xong); D11 còn E3.8c (E3.4, E3.9 xong); D15 bỏ |
| **Kế hoạch 2 tuần: cả nhóm** | 51 | 61 | **84%** | Hòa 20/20, Chí 20/24, Doanh 11/17; phần Chí/Doanh và các mốc chung còn theo phân công |
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
- [x] Điểm test từ server CIRR và CIRCO — 13/11: đủ sáu kết quả SEARLE gốc/phi_B32, xem B8–B11 trong nhật ký
- [x] Demo web Flask (gallery, 3 chế độ truy vấn, trang tự đánh giá, tự nhận diện file nộp test)
- [x] Repo GitHub `chilk1307/XLA_SEARLE`, loại file lớn khỏi git
- [x] `SETUP_MISSING_FILES.md` và link Google Drive cho file lớn
- [x] Ghi chép tái lập: `outputs/REPORT.md`, `outputs/REPORT_results.md`
- [x] Kế hoạch 2 tuần trong `plans/` (đã commit `70328e1`)
- [x] Phân công Chí, Hòa, Doanh, mỗi người một file nhiệm vụ

## Kế hoạch 2 tuần: Chí (code, ý tưởng)

Chi tiết: [nhiem_vu_Chi.md](nhiem_vu_Chi.md).

- [x] **C1** (Ngày 1) Chia sẻ Drive cho Hòa, Doanh; xác nhận vị trí dữ liệu và dung lượng Drive — 14/11: không đóng gói lại; thư mục giải nén sẵn trên Drive là nguồn chính thức; `prepare_data.sh` bỏ qua `.tar` rỗng/cụt; hai gói hỏng đổi tên và dọn `dryrun_2ep` giao cho Hòa ở H1
- [x] **C2** (Ngày 1) Bộ chạy Colab: `setup_env.sh`, `prepare_data.sh`, `requirements-xla.txt`, `SEARLE_runner.ipynb` — 15/11: Hòa, Doanh chạy được trên runtime mới (T4, L4, A100); SEARLE gốc CIRR R@1 25,59 trên T4 đúng mốc T4 (quyết định 12/11), 25,66 là mốc A100; `prepare_data.sh` chịu được gói `.tar` hỏng (14/11)
- [x] **C3** (Ngày 1) Gộp `datasets.py`, sửa nuốt lỗi, xử lý batch rỗng, đưa file nhỏ của `outputs/` vào git — 17/10
  - [x] Gộp bản `datasets.py` của repo và bản vá Colab
  - [x] Thay `except: pass` bằng cảnh báo + đếm mẫu lỗi
  - [x] Xử lý batch `None` trong các vòng lặp
  - [x] `outputs/submissions/` vào git
  - [x] `REPORT*.md`, `pip_freeze.txt`, `merge_oti.py`, csv/json của `phi_B32`, log `eval*.log` vào git
- [x] **C4** (Ngày 2) Module truy xuất chung; `--output-dir`, `--cache-dir`, `--note`; CIRR luôn sinh cả file subset — 15/11: H5 nghiệm thu đủ E1.7a–f; code gốc và `main` trùng 7 chỉ số CIRR trên cùng T4 và trùng 100% top-10 file test; H4 nộp test thành công bằng file do module chung sinh
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
- [ ] **C17** (Ngày 10–11) Demo: tab thuộc tính, tab ảnh xấu → phục hồi, so sánh phương pháp, nút "Vì sao?" (một phần, 15/11: đủ 4 tính năng trong `demo/features.py`, thử mọi endpoint bằng Flask test client trên 18 ảnh mẫu; còn kiểm tra giao diện trên trình duyệt và chụp ảnh màn hình cho báo cáo; nhập tiếng Việt chưa làm)
- [ ] **C18** (Ngày 11) Chọn cấu hình cuối, gửi lệnh nộp test
- [ ] **C19** (Ngày 12–13) README gốc repo, `CHANGES.md`, báo cáo, slide (một phần, 15/11: README gốc repo và CHANGES.md xong; còn báo cáo, slide)
- [ ] **C20** (Ngày 14) Video demo, kiểm tra trước khi nộp, nộp bài
- [x] **C21** (Ngày 9) Code OTI warm-start (`--init`, `--snapshot-steps`, `--token-file`) (`--init random` trùng từng bit code gốc; thêm `timing.json`, `--gpt-exp-name none`, nội suy token khi đánh giá) — 18/10
- [x] **C22** (Ngày 9) Công cụ bộ câu GPT: thống kê, làm sạch (P1), `--phrase-match`, `--concept-filter`, sửa lỗi `saved_exp_name` (đọc/ghi file câu dạng luồng, không cần nạp cả 700 MB) — 18/10
- [x] **C23** (Ngày 11) Notebook sinh câu `colab/gen_phrases.ipynb`, chế độ quy mô nhỏ (`tools/generate_phrases_llm.py` chế độ P2 và P3; chạy thử với mô hình nhỏ trên CPU; chạy thật trên Colab ở D16) — 18/10
- [x] **C24** (thêm) Phân tích vector ảnh và vector từ: `tools/vector_analysis.py` `tokens`, `gap`, `drift` (thử trên CIRR, CIRCO, FIQ giả lập; `drift` cho đúng số của lượt `validate.py` cùng cấu hình) — 19/10

## Kế hoạch 2 tuần: Hòa (Colab)

Chi tiết: [nhiem_vu_Hoa.md](nhiem_vu_Hoa.md).

- [x] **H1** (Ngày 1) 14/11 nghiệm thu: dùng thư mục Drive chính thức theo C1; cách ly hai tar hỏng, dọn đủ bốn dryrun_2ep, chạy lại runner ba tập sẵn sàng; có log và xác minh trực tiếp FIQ sau lỗi liệt kê thư mục.
- [x] **H2** (Ngày 1) Kiểm tra dữ liệu nhanh CIRR, CIRCO, FashionIQ (E1.2) — 26/10. Báo cáo ở `Hoa_continue_20261026_100802_0ab7841f/E1.2-inventory-parallel/`: CIRR val/test1 2.297/2.315 ảnh đủ; CIRCO gallery 123.403/123.403; FashionIQ val đủ 6.016 truy vấn và 15.536 ảnh gallery theo danh sách tệp, nhưng train/test thiếu ảnh. Không kiểm tra CIRR train trong lượt nhanh; chưa kiểm tra giải mã mọi ảnh.
- [x] **H3** File subset CIRR (`subset_phi_B32_cirr.json` đã có, hợp lệ) — 16/10
- [x] **H4** (Ngày 2) Sinh file test SEARLE gốc; nộp test SEARLE gốc và phi_B32 (B8–B11) — **13/11 hoàn tất 6/6 lượt và đã lưu điểm chính thức**. Phi_B32 dùng ba file lịch sử; SEARLE sinh trên T4, baseline R@1 25,5919636451 đã đạt mốc. CIRR R@1: phi 23,349 / SEARLE 23,301; subset R@1: 54,458 / 54,000. CIRCO mAP@5: phi 9,44 / SEARLE 9,39. Người dùng xác nhận thứ tự hai email CIRCO. Xem bảng đầu trang và nhật ký B8–B11.
- [x] **H5** (Ngày 3) Kiểm tra không hồi quy; baseline E1.7a–f — 12/11: E1.7a/d và kiểm tra code gốc/main cùng T4 đã xong 26/10; tiêu chí test khác GPU đã được Chí chấp thuận. Đã chạy nốt E1.7b/c/e/f trên L4, đủ 220 truy vấn CIRCO và 6.016 truy vấn FIQ mỗi lượt, không lỗi ảnh/truy vấn bị bỏ/trùng. Xem cập nhật và link phiên 12/11 ở đầu trang. Lượt chẩn đoán SEARLE L4 R@1 25,52 được ghi riêng, không thay mốc T4/A100.
- [x] **H6** (Ngày 4) Baseline CLIP E1.8 và CBIR E1.9 — 26/10: đủ 26 lượt baseline CIRR/FashionIQ/CIRCO, không lỗi ảnh hoặc truy vấn bị bỏ. CBIR CIRCO là phần tùy chọn, chưa chạy; CBIR+text CIRR đã chạy. Xem summary-all.md trong phiên CIRCO/OTI.
- [x] **H7** (Ngày 5) Kiểm tra dữ liệu bằng công cụ E1.2; khoảng tin cậy E1.4; gom kết quả — 26/10: đủ ba bảng CI 95%, 1.000 lần bootstrap, seed 0, baseline phi_B32 cùng tập; kiểm tra bộ val local đủ ảnh/truy vấn và gom 26 lượt vào summary-all.md.
- [x] **H8** (Ngày 6) Taxonomy E1.10 cả ba tập; keep-edit E1.11, token E1.15a và modality gap E1.15b CIRR/CIRCO — 26/10. Keep-edit CIRCO dùng phi_B32 --exclude-reference của H6 thay cho lượt E1.7e chưa nghiệm thu ở H5. Có report.md và các hình tokens.png, gap.png; phần bổ sung token OTI sẽ chạy sau H15.
- [x] **H9** (Ngày 7) Thống kê thuộc tính E2.0 và đồng thuận bộ đo E2.2 — 26/10: đủ ba tập, không lỗi ảnh; CIRR 67,1%/ngẫu nhiên 45,8%; FashionIQ 75,8%/51,6% trên 9.778 ràng buộc; CIRCO 62,7%/49,3%. Đủ dữ liệu bàn giao M3; Chí chưa quyết định giữ/đổi hướng.
- [x] **H10** (Ngày 8–9) Quét xếp hạng lại, K50, mặt nạ, phủ định — 14/11: hoàn tất 40 E2.3 + 24 E2.3b + 12 K50/E2.4/E2.5 = 76 cấu hình và CI; màu w=2 theo Chí. Đủ truy vấn/ứng viên, replay E2.3b khớp trên L4. Không tự thay cấu hình cuối.
- [x] **H11** (Ngày 10) E4.4/E4.5 đã xong; E2.7 màu w=2 CIRCO đủ 220 truy vấn, có CI và đối chứng cùng giao thức exclude-reference ngày 14/11; FIQ dùng lại E2.3b. E2.6 bỏ theo Chí.
- [x] **H12** (Ngày 11) Đủ E1.12/E1.13/E2.8: 20 ví dụ CIRR, 10 hình che khuất đã có, 20 ví dụ giải thích FIQ; seed 0, cấu hình màu w=2 theo Chí. Nghiệm thu 14/11.
- [x] **H13** (Ngày 12) 14/11 nghiệm thu theo luật Chí: cấu hình mặc định phi_B32 dùng lại điểm H4 và 23 chỉ số/CI H7 trên ba tập val; không nộp thêm. Phi bền bổ sung chỉ khi E3.8c đạt cả hai điều kiện C18.
- [x] **H14** (Ngày 13) 14/11 bàn giao cuối qua [thư mục chung](https://drive.google.com/drive/folders/1AfGRsrFrKQliryolxddAvKZOS8p40Yfq) và plans: 38 CSV, 74 PNG, summary.md, báo cáo MD/HTML, BAN_GIAO_CHO_CHI.md, nguồn/audit/SHA-256; H1/H13 đã nghiệm thu. Chưa gửi email/tin nhắn riêng.
- [x] **H15** (Ngày 11) OTI warm-start CIRCO val E7.1a–d — 26/10: đủ 5 cấu hình (random 0,02; phi 0,02/0,005; SEARLE 0,02/0,005), 7 snapshot × token thường/EMA = 70 lượt đánh giá, seed 42. Mỗi lượt đủ 220 truy vấn, không lỗi ảnh hoặc truy vấn bị bỏ. Đã phân tích lại token OTI, lưu thời gian batch, đường cong và CI ghép cặp với P0. Xem H17_H15_attempt2/, oti-snapshot-metrics.csv, oti-inversion-timing.csv, oti-warmstart-curves.png, E7.1-ci-finals-circo/ trong phiên CIRCO/OTI. Chí chọn cấu hình cho D15; chưa tự chọn thay nhóm.
- [x] **H16** (Ngày 10) Train phi với lịch LR cosine (E8.2a) — 31/10: đủ 100 epoch, checkpoint cuối và đánh giá CIRR/CIRCO cùng đối chứng; có CI ghép cặp và báo cáo nghiệm thu ở đầu trang.
- [x] **H17** (Ngày 7) Liên kết khái niệm CIRCO val E7.0 và OTI E6.2-Pλ0 — 26/10: CSV đủ 220 ảnh tham chiếu, 250 khái niệm/ảnh; OTI 350 bước, seed 42, bộ câu gốc với lambda_gpt=0; mAP@5/10/25/50 = 2,16/3,03/3,89/4,32. Đánh giá đủ 220 truy vấn, không lỗi ảnh/truy vấn bị bỏ. Kết quả ở phiên CIRCO/OTI, thư mục H17_H15_attempt2. Giữ mặc định không --exclude-reference theo kế hoạch.
- [x] **H18** (Ngày 13) OTI với P1 và bộ mới P2 của D16 trên CIRCO val đã hoàn tất 14/11, đủ 220 truy vấn, token EMA bước 350 và CI so P0/P1/lambda=0; P3 tùy chọn, không chặn nghiệm thu.
- [x] **T1** (Ngày 6, tuỳ chọn) Train phi trên shard s0 (E1.14a = E8.1a) — **14/11 hoàn tất**: 33.334 ảnh/token, A100 80 GB, 100 epoch/20 mốc validation, checkpoint epoch 100; đủ đánh giá/CI và báo cáo. CIRR R@1 24,30 so với phi_B32 25,47; Δ −1,17, CI 95% [−1,89; −0,45]. [Notebook](https://colab.research.google.com/drive/1fy8aH6k1unuvMVEdZdxleBn30Vr71oC0) · [Gói kết quả](https://drive.google.com/drive/folders/1Efh_KhmM6PldYHMM9VrSS2ovZv3KfokS).
- [x] **T2** (Ngày 8, tuỳ chọn) Train phi trên shard s0 + s1 (E1.14b = E8.1b) — 14/11 nghiệm thu: 66.667 ảnh/token, A100 80 GB, 100 epoch/20 validation, checkpoint epoch 100; đủ ba đánh giá CIRR, hai CI, báo cáo và hình. R@1 24,68%, Δ so T1 +0,38 (CI [−0,29; +1,05]), so phi_B32 −0,79 (CI [−1,32; −0,26]); xem gói T2 ở đầu trang.

## Kế hoạch 2 tuần: Doanh (Colab)

Chi tiết: [nhiem_vu_Doanh.md](nhiem_vu_Doanh.md).

- [x] **D1** (Ngày 1) Dựng Colab, giải nén ImageNet, kiểm tra file trên Drive (ImageNet đủ 100.000 ảnh; CIRR val đủ 2.297 ảnh) — 21/10
- [x] **D2** (Ngày 2) Chạy thử train 2 epoch, đo thời gian (A100: epoch 1 R@1 22.24 so với mốc 22.05, epoch 2 22.79 so với 22.53; khoảng 2,4 phút mỗi epoch nên 100 epoch mất khoảng 4 giờ; kết quả ở `results/Doanh_D2_20261021_COMPLETED`) — 21/10
- [x] **D3** (Ngày 3) Đệm ảnh (E4.1), nội suy (E4.2) — 26/10: 9 lượt CIRR; targetpad 1.25 + bicubic tốt nhất (25,50); pad 1.0 −1,70, clipcrop −2,15, nearest −2,46
- [x] **D4** (Ngày 4) Lật ảnh (E4.3); cấu hình tốt nhất trên CIRCO, FIQ — 26/10: flip-gallery +0,05, flip-ref −0,29; Chí chốt giữ mặc định (12/11), lượt CIRCO/FIQ của cấu hình mặc định chính là baseline H6 của Hòa
- [x] **D5** (Ngày 5) Mức sụt giảm với 8 loại suy giảm (E3.1) — 10/11 CIRR (16 lượt); 14/11 chạy lại CIRCO có `--exclude-reference` (16 lượt + ảnh sạch 8,78 mAP@5), các lượt CIRCO cũ không dùng
- [x] **D6** (Ngày 5) Phân tích miền tần số (E3.5) — 10/11: 10 lượt CIRR; lowpass ≥ 0,1 mất ≤ 0,24 điểm, highpass mất 4,6–7,7 điểm
- [x] **D7** (Ngày 6) Đặc trưng ảnh xấu shard s0; bắt đầu sàng lọc phi bền (E3.8a) — 10/11: đặc trưng 9/9 phiên bản, `phi_s0_clean` 50 epoch R@1 24,32
- [x] **D8** (Ngày 7) Phục hồi cố định (E3.2); sàng lọc tiếp; nhóm left/right (E4.3b) — 14/11: E3.2 18/18 lượt CIRR; `phi_s0_degaug` 24,20 và `phi_s0_noise` 24,16 (50 epoch); E4.3b xong
- [x] **D9** (Ngày 8) Đánh giá 3 bản sàng lọc, chọn biến thể; đặc trưng ảnh xấu 100k — 14/11: 27 lượt; chọn `degaug` (TB 8 suy giảm 23,16 so với clean 22,79); đặc trưng 9 phiên bản × 100.000 ảnh đã xác minh
- [ ] **D10** (Ngày 9) Train phi bền bản đầy đủ (E3.8b); phục hồi tự động (E3.3) (một phần: E3.3 xong 14/11, `auto` tốt nhất trên `mixed` 25,16; còn train `phi_B32_robust`)
- [ ] **D11** (Ngày 10) PSNR/SSIM so với điểm truy xuất (E3.4); đánh giá phi bền (E3.8c); độ trôi vector (E3.9) (một phần: E3.4, E3.9 CIRR/CIRCO xong 14/11; còn E3.8c sau D10)
- [x] **D12** (Ngày 11) Độ bền bộ đo thuộc tính (E3.6); hình minh hoạ (E3.7) — 14/11
- [ ] **D13** (Ngày 12) Chạy bổ sung; nộp test phi bền (nếu được chọn)
- [ ] **D14** (Ngày 13) Tổng hợp bảng, hình → bàn giao Chí
- [ ] **D15** (Ngày 12) OTI warm-start trên CIRR val (E7.2) — **bỏ** (Chí, 14/11): E7.1 trên CIRCO không có cấu hình warm-start nào hơn khởi tạo ngẫu nhiên rõ ràng
- [x] **D16** (Ngày 12) Thống kê bộ câu (E6.1); sinh bộ câu mới quy mô nhỏ — 14/11: E6.1 P0/P1/P2; P2 = Qwen2.5-1.5B cho CIRCO val (`Doanh_SEARLE/outputs/GPT_phrases/P2_qwen25_15b_circo_val`)
- [ ] **D17** (Ngày 13) Train phi trên shard s0 với bộ câu mới (E6.4)

## Mốc kiểm tra

- [ ] **M1** (Ngày 2, 18/10) Colab chạy được cho Hòa và Doanh; dữ liệu đã kiểm tra; code cũ ra đúng số; đã nộp test SEARLE gốc và phi_B32
- [ ] **M2** (Ngày 5, 21/10) Quy trình mới ra đúng số cũ; bảng baseline có khoảng tin cậy; code suy giảm, phục hồi, train mới chạy được
- [x] **M3** (Ngày 7, 23/10) Có E2.0, E2.2 và quyết định giữ hay đổi đóng góp chính — 12/11: giữ hướng thuộc tính (02)
- [ ] **M4** (Ngày 11, 27/10) Đủ kết quả chính của 02, 03, 04; phi bền bản đầy đủ đã train; demo có 2 tab mới
- [ ] **M5** (Ngày 14, 30/10) Báo cáo, slide, video, README hoàn chỉnh; nộp bài

## Việc tiếp theo

1. **Doanh:**
   - **D10:** train `phi_B32_robust` (degaug, 100 epoch);
   - sau đó **E3.8c** (CI ghép cặp với phi_B32) và E3.9 cho phi bền;
   - bộ câu P2 đã được chép sang `SEARLE/outputs/GPT_phrases/` và H18-P2 đã nghiệm thu;
   - D17 (train phi trên shard s0 với bộ câu mới) nếu còn A100.
2. **Hòa:**
   - Đã hoàn tất 20/20 việc; gói H14 cuối có đủ H1/H13 và nguồn kết quả, không có lượt GPU bắt buộc mới.
   - Khi có E3.8c, chỉ bổ sung nhánh test phi bền nếu đạt cả hai điều kiện C18 đã ghi trước; chưa coi là phần đã chạy.
   - P3 tùy chọn, không chặn nghiệm thu. Không chạy lại H10/H11/H12/H18 hoặc T1/T2.
3. **Chí:**
   - chốt C18 khi có E3.8c: nếu phi bền không kém phi_B32 rõ rệt trên ảnh sạch thì cân nhắc nộp test, nếu không thì giữ phi_B32 mặc định (đã có điểm test từ H4);
   - C1/H1 đã xong theo quyết định không đóng gói lại; hai tar hỏng đã cách ly, bốn dryrun đã chuyển vào discarded;
   - C17–C20: demo, báo cáo, slide, video.
