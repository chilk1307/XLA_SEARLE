// Báo cáo bài tập lớn (C19), file Word.
//   npm install docx@9
//   python make_figs.py                                    # vẽ lại các biểu đồ của nhóm vào figures/
//   node build_report.js figures Bao_cao_XLA_SEARLE.docx   # mở bằng Word, cập nhật mục lục (F9) rồi lưu
// Hình trong figures/ do nhóm vẽ (đưa lên git). Hình trong figures_ext/ lấy từ kết quả trên Drive (có ảnh của
// CIRR, FashionIQ nên không đưa lên git): gói H14 của Hòa (results/Hoa_H14_20261113_155832_9ca132, thư mục figures/)
// và kết quả của Doanh (Doanh_SEARLE/results: E3.9-drift-cirr/drift_vs_metric.png; e37_example.png là 3 hàng đầu
// của E3.7-figures/01_35405.png). Mọi số trong báo cáo lấy từ plans/nhat_ky_thi_nghiem.md, plans/tien_do.md và các
// báo cáo trong hai thư mục đó.
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType,
  ShadingType, BorderStyle, ImageRun, PageBreak, Footer, PageNumber, TableOfContents, LevelFormat, VerticalAlign,
} = require('docx');

const FIG = process.argv[2];
const OUT = process.argv[3];
const FONT = 'Times New Roman';
const PAGE_W = 11906, MARGIN_L = 1701, MARGIN_R = 1134;
const CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R; // 9071 DXA
const MAX_IMG_PX = 590;

let figNo = 0, tabNo = 0, chapter = 0;

// --- inline markup: **bold**, *italic*, `code` ------------------------------------------------------------------
const STAR = '\u0001';  // "\*" in the content = a literal star (L*, a*b*), not italics
function runs(text, base = {}) {
  text = text.split('\\*').join(STAR);
  const lit = (s) => s.split(STAR).join('*');
  const out = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(new TextRun({ text: lit(text.slice(last, m.index)), font: FONT, ...base }));
    const t = m[0];
    if (t.startsWith('**')) out.push(new TextRun({ text: lit(t.slice(2, -2)), bold: true, font: FONT, ...base }));
    else if (t.startsWith('`')) out.push(new TextRun({ text: lit(t.slice(1, -1)), font: 'Consolas', size: 22, ...base }));
    else out.push(new TextRun({ text: lit(t.slice(1, -1)), italics: true, font: FONT, ...base }));
    last = m.index + t.length;
  }
  if (last < text.length) out.push(new TextRun({ text: lit(text.slice(last)), font: FONT, ...base }));
  return out;
}

const P = (text, opts = {}) => new Paragraph({
  children: runs(text), alignment: AlignmentType.JUSTIFIED, spacing: { after: 120 }, ...opts,
});
const H1 = (text) => { chapter += 1; return new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true,
  children: [new TextRun({ text: `Chương ${chapter}. ${text}`, font: FONT })] }); };
const H1plain = (text) => new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true,
  children: [new TextRun({ text, font: FONT })] });
const H2 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text, font: FONT })] });
const H3 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text, font: FONT })] });
const UL = (items) => items.map((t) => new Paragraph({ children: runs(t), numbering: { reference: 'bullets', level: 0 },
  alignment: AlignmentType.JUSTIFIED, spacing: { after: 60 } }));
const OL = (items, ref) => items.map((t) => new Paragraph({ children: runs(t), numbering: { reference: ref, level: 0 },
  alignment: AlignmentType.JUSTIFIED, spacing: { after: 60 } }));
const EQ = (text) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60, after: 120 },
  children: [new TextRun({ text, italics: true, font: 'Cambria Math', size: 24 })] });

function caption(kind, text) {
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60, after: 200 }, keepLines: true,
    children: runs(`**${kind} ${chapter}.${kind === 'Hình' ? figNo : tabNo}.** ${text}`, { size: 22 }) });
}

function pngSize(file) {
  const b = fs.readFileSync(file);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

function FIGURE(file, text, widthPx = MAX_IMG_PX) {
  figNo += 1;
  const own = path.join(FIG, file);
  const full = fs.existsSync(own) ? own : path.join(FIG + '_ext', file);
  const { w, h } = pngSize(full);
  const width = Math.min(widthPx, MAX_IMG_PX);
  const height = Math.round(width * h / w);
  return [
    new Paragraph({ alignment: AlignmentType.CENTER, keepNext: true, spacing: { before: 120 },
      children: [new ImageRun({ type: 'png', data: fs.readFileSync(full), transformation: { width, height },
        altText: { title: text.slice(0, 60), description: text, name: file } })] }),
    caption('Hình', text),
  ];
}

const BORDER = { style: BorderStyle.SINGLE, size: 4, color: '999999' };
function TABLE(head, rows, widthsPct, text, opts = {}) {
  tabNo += 1;
  const widths = widthsPct.map((p) => Math.round(CONTENT_W * p / 100));
  widths[widths.length - 1] += CONTENT_W - widths.reduce((a, b) => a + b, 0);
  const numeric = opts.numeric || [];
  const cell = (t, i, isHead) => new TableCell({
    width: { size: widths[i], type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER,
    margins: { top: 50, bottom: 50, left: 80, right: 80 },
    borders: { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER },
    shading: isHead ? { type: ShadingType.CLEAR, color: 'auto', fill: 'E8EEF6' } : undefined,
    children: [new Paragraph({ alignment: numeric.includes(i) && !isHead ? AlignmentType.RIGHT : AlignmentType.LEFT,
      children: runs(String(t), { size: 22, bold: isHead || undefined }) })],
  });
  return [
    new Paragraph({ alignment: AlignmentType.CENTER, keepNext: true, spacing: { before: 120, after: 60 },
      children: runs(`**Bảng ${chapter}.${tabNo}.** ${text}`, { size: 22 }) }),
    new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: widths,
      rows: [new TableRow({ tableHeader: true, children: head.map((t, i) => cell(t, i, true)) }),
        ...rows.map((r) => new TableRow({ cantSplit: true, children: r.map((t, i) => cell(t, i, false)) }))] }),
    new Paragraph({ spacing: { after: 120 }, children: [] }),
  ];
}
const startChapter = () => { figNo = 0; tabNo = 0; };

// ================================================================================================================
const body = [];
const add = (...xs) => xs.forEach((x) => (Array.isArray(x) ? body.push(...x) : body.push(x)));

// ---------------- Bìa ----------------
const cover = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 600, after: 120 },
    children: [new TextRun({ text: '[TÊN TRƯỜNG / KHOA]', font: FONT, bold: true, size: 28 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 1600 },
    children: [new TextRun({ text: 'BÀI TẬP LỚN MÔN XỬ LÝ ẢNH', font: FONT, bold: true, size: 28 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 },
    children: [new TextRun({ text: 'TRUY XUẤT ẢNH KẾT HỢP ZERO-SHOT VỚI SEARLE', font: FONT, bold: true, size: 36 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 1600 },
    children: [new TextRun({ text: 'Tái lập, kiểm chứng thuộc tính bằng xử lý ảnh cổ điển, độ bền với ảnh xấu và phục hồi ảnh',
      font: FONT, italics: true, size: 28 })] }),
  ...['Nhóm thực hiện:', 'Lê Khắc Chí (MSSV: …): code, ý tưởng, báo cáo', 'Hòa (họ tên, MSSV: …): đánh giá, thí nghiệm thuộc tính, học máy',
    'Doanh (họ tên, MSSV: …): tiền xử lý, độ bền, phục hồi ảnh, φ bền', '', 'Giảng viên hướng dẫn: …', '',
    'Mã nguồn: https://github.com/chilk1307/XLA_SEARLE', 'Tháng 11/2026'].map((t, i) =>
    new Paragraph({ alignment: i === 0 ? AlignmentType.LEFT : AlignmentType.LEFT, indent: { left: 1700 },
      spacing: { after: 80 }, children: [new TextRun({ text: t, font: FONT, size: 26, bold: i === 0 })] })),
];

// ---------------- Tóm tắt, mục lục ----------------
add(H1plain('Tóm tắt'));
add(P('Truy xuất ảnh kết hợp (Composed Image Retrieval, CIR) nhận một **ảnh tham chiếu** và một **câu mô tả thay đổi**, rồi tìm trong kho ảnh bức ảnh khớp với cả hai. SEARLE (Baldrati et al., ICCV 2023) giải bài toán này mà không cần bộ ba (ảnh tham chiếu, câu, ảnh đích) có nhãn: ảnh được "đảo ngược" thành một từ giả (pseudo-token) trong không gian từ của CLIP, rồi ghép vào câu "a photo of $ that {mô tả}".'));
add(P('Nhóm tái lập toàn bộ quy trình SEARLE với CLIP ViT-B/32 (OTI trên 100.000 ảnh ImageNet, huấn luyện mạng φ 100 epoch). Mô hình của nhóm đạt **CIRR test R@1 23,35** và **CIRCO test mAP@5 9,44** trên server chấm chính thức, ngang checkpoint của tác giả chạy cùng quy trình (23,30 và 9,39). Trên nền đó, nhóm thêm hai hướng xử lý ảnh:'));
add(UL([
  '**Kiểm chứng thuộc tính bằng xử lý ảnh cổ điển:** tách ràng buộc màu, độ sáng, độ rực, hoa văn, zoom từ câu mô tả; đo chúng trên ảnh bằng CIELAB, CIEDE2000, phân vùng Otsu/GrabCut, phổ Fourier, LBP, Gabor; dùng để xếp hạng lại. Bộ đo đồng thuận với câu mô tả 63–76% (mức ngẫu nhiên 46–52%), nhưng qua 76 cấu hình, không cấu hình nào cải thiện truy xuất có ý nghĩa thống kê: thông tin bộ đo bắt được phần lớn CLIP đã có.',
  '**Độ bền với ảnh xấu và phục hồi ảnh:** 8 loại suy giảm × 2 mức, 14 phép phục hồi, bộ ước lượng loại suy giảm để tự chọn phép phục hồi, và mạng φ huấn luyện thêm trên đặc trưng ảnh xấu. Phục hồi đúng loại cứu được tới 1,9 điểm R@1 (Wiener với mờ chuyển động, median với nhiễu muối tiêu), nhưng **mức tăng PSNR không đi cùng mức tăng truy xuất** (Spearman ρ = −0,09 trên 18 cặp); độ lệch của vector CLIP so với ảnh sạch dự báo thiệt hại tốt hơn hẳn PSNR/SSIM (ρ = +0,80 so với −0,54/−0,64).',
]));
add(P('Ngoài ra nhóm phân tích lỗi (giữ – sửa, theo nhóm kiểu sửa đổi), phân tích pseudo-token so với từ thật, miền tần số, tiền xử lý, và một số hướng học máy (khởi tạo OTI, bộ câu GPT mới, lịch học, lượng dữ liệu). Mọi kết luận "cải thiện" đều kèm khoảng tin cậy bootstrap ghép cặp 95%.'));

add(H1plain('Mục lục'));
add(new TableOfContents('Mục lục', { hyperlink: true, headingStyleRange: '1-2' }));

// ---------------- Chương 1 ----------------
add(H1('Giới thiệu')); startChapter();
add(P('Tìm ảnh bằng một câu chữ hay bằng một ảnh mẫu đều đã quen thuộc. Nhưng nhu cầu thực tế thường là cả hai: "chiếc áo này nhưng màu đỏ và tay dài", "cảnh này nhưng vào ban đêm". Truy xuất ảnh kết hợp (CIR) mô hình hoá đúng nhu cầu đó: đầu vào là cặp (ảnh tham chiếu, câu mô tả thay đổi), đầu ra là danh sách ảnh trong kho xếp theo mức phù hợp.'));
add(P('Các phương pháp có giám sát cần bộ ba (ảnh tham chiếu, câu, ảnh đích) gán nhãn tay, vốn đắt và khó mở rộng sang miền mới. **CIR zero-shot** bỏ yêu cầu này: chỉ dùng mô hình thị giác – ngôn ngữ đã huấn luyện sẵn (CLIP) và dữ liệu không nhãn. SEARLE là một phương pháp zero-shot tiêu biểu, có mã nguồn công khai, và cũng là tác giả của bộ đánh giá CIRCO.'));
add(H2('1.1. Mục tiêu'));
add(OL([
  'Tái lập SEARLE với CLIP ViT-B/32 từ đầu (sinh pseudo-token bằng OTI, huấn luyện φ), đối chiếu số liệu với bài báo và với checkpoint của tác giả, kể cả trên server test chính thức.',
  'Dựng nền đánh giá chung, kiểm chứng không hồi quy, có khoảng tin cậy, để mọi thí nghiệm sau so sánh được với nhau.',
  'Đưa kỹ thuật **xử lý ảnh cổ điển** vào hai chỗ của bài toán: kiểm chứng thuộc tính của kết quả, và xử lý ảnh truy vấn bị xấu.',
  'Phân tích vì sao phương pháp đúng hoặc sai, và trình diễn bằng một demo web.',
], 'goals'));
add(H2('1.2. Đóng góp'));
add(UL([
  'Một bản tái lập đầy đủ, có điểm test chính thức (Chương 4).',
  'Một bộ đo thuộc tính bằng xử lý ảnh cổ điển, kiểm thử trên ảnh tổng hợp, đo độ đồng thuận với câu mô tả người viết, và đánh giá như một bước xếp hạng lại (Chương 6). Kết quả âm tính được báo cáo đầy đủ.',
  'Bộ suy giảm, phục hồi và ước lượng suy giảm; phân tích "phục hồi tốt cho mắt" khác "phục hồi tốt cho truy xuất", kèm phép đo độ lệch vector giải thích hiện tượng đó; phân tích miền tần số; mạng φ bền với ảnh xấu (Chương 7).',
  'Các phân tích: baseline CLIP và CBIR cổ điển, theo nhóm kiểu sửa đổi, giữ – sửa, pseudo-token so với từ thật, bản đồ che khuất (Chương 5); tiền xử lý (Chương 8); học máy (Chương 10); demo (Chương 9).',
]));
add(H2('1.3. Phân công'));
add(P('Lê Khắc Chí viết toàn bộ code (đánh giá, xử lý ảnh, công cụ phân tích, demo), thiết kế thí nghiệm, ra quyết định và viết báo cáo. Hòa chạy trên Google Colab các thí nghiệm đánh giá, thuộc tính, phân tích và một phần học máy; Doanh chạy tiền xử lý, độ bền, phục hồi ảnh, huấn luyện φ bền và sinh bộ câu mới. Kế hoạch, phân công, nhật ký thí nghiệm và tiến độ nằm trong thư mục `plans/` của repo.'));

// ---------------- Chương 2 ----------------
add(H1('Tổng quan')); startChapter();
add(H2('2.1. Mô hình thị giác – ngôn ngữ và CIR có giám sát'));
add(P('CLIP (Radford et al., ICML 2021) học hai bộ mã hoá ảnh và chữ bằng học tương phản trên khoảng 400 triệu cặp ảnh – chú thích, đưa ảnh và câu vào cùng một không gian vector. Đây là nền của hầu hết phương pháp CIR hiện nay. Với CIR có giám sát, CLIP4Cir (Baldrati et al., 2022) kết hợp đặc trưng CLIP của ảnh tham chiếu và câu bằng một mạng kết hợp huấn luyện trên bộ ba có nhãn của CIRR (Liu et al., ICCV 2021) và FashionIQ (Wu et al., CVPR 2021).'));
add(H2('2.2. CIR zero-shot'));
add(P('Pic2Word (Saito et al., CVPR 2023) học một mạng ánh xạ ảnh thành một token từ, chỉ dùng ảnh không nhãn. SEARLE (Baldrati et al., ICCV 2023) cũng dùng ý tưởng "đảo ngược ảnh thành từ" (textual inversion) nhưng theo hai bước: tối ưu trực tiếp một token cho từng ảnh (OTI), rồi chưng cất các token đó vào một mạng φ nhỏ; bài báo cũng giới thiệu bộ CIRCO với nhiều ảnh đích đúng cho mỗi truy vấn. iSEARLE (2024) là bản mở rộng của cùng nhóm tác giả. Các phương pháp sau đó vượt SEARLE: LinCIR (Gu et al., CVPR 2024) chỉ huấn luyện bằng chữ, Context-I2W (Tang et al., AAAI 2024) ánh xạ ảnh thành từ có điều kiện theo câu mô tả, CIReVL (Karthik et al., ICLR 2024) không huấn luyện mà dùng mô hình sinh chú thích và mô hình ngôn ngữ lớn. **SEARLE vì vậy không còn là phương pháp tốt nhất**; nhóm chọn nó vì mã nguồn đầy đủ, chi phí tái lập vừa sức và kiến trúc đủ rõ để phân tích.'));
add(H2('2.3. Giới hạn của mô hình thị giác – ngôn ngữ'));
add(P('ARO (Yuksekgonul et al., ICLR 2023) cho thấy CLIP xử lý câu gần như một "túi từ": kém với thứ tự, quan hệ, thuộc tính gắn với vật nào. Đây là động lực cho hướng kiểm chứng thuộc tính bằng phép đo trực tiếp trên ảnh ở Chương 6.'));
add(H2('2.4. Độ bền của CIR và phục hồi ảnh'));
add(P('Sun et al. (2023, "Benchmarking Robustness of Text-Image Composed Retrieval") xây CIRR-C, FashionIQ-C để đo độ bền của các phương pháp CIR, chủ yếu là có giám sát. Liu et al. (IJCAI 2018, "When Image Denoising Meets High-Level Vision Tasks") chỉ ra khử nhiễu tối ưu theo PSNR không nhất thiết tốt cho tác vụ cấp cao. Nhóm không lặp lại việc đo độ bền thuần tuý mà tập trung vào: (1) SEARLE zero-shot, (2) phục hồi thích ứng dựa trên ước lượng loại suy giảm bằng xử lý ảnh cổ điển, (3) so sánh trực tiếp chất lượng ảnh và chất lượng truy xuất, (4) φ bền.'));
add(H2('2.5. Xử lý ảnh cổ điển cho truy xuất'));
add(P('Trước học sâu, truy xuất ảnh theo nội dung (CBIR) dựa trên đặc trưng thủ công: histogram màu (Swain & Ballard, IJCV 1991), kết cấu LBP (Ojala et al., TPAMI 2002), HOG, bộ lọc Gabor. Độ rực màu đo theo Hasler & Süsstrunk (2003); bản đồ nổi bật spectral residual của Hou & Zhang (CVPR 2007). Nhóm dùng các kỹ thuật này vừa làm baseline (Chương 5) vừa làm bộ đo thuộc tính (Chương 6).'));

// ---------------- Chương 3 ----------------
add(H1('Cơ sở lý thuyết')); startChapter();
add(H2('3.1. CLIP'));
add(P('CLIP gồm bộ mã hoá ảnh ψ_I (ở đây ViT-B/32, ảnh 224 × 224) và bộ mã hoá chữ ψ_T (Transformer trên chuỗi tối đa 77 token BPE), cả hai cho vector 512 chiều. Độ phù hợp giữa ảnh và câu là cosine của hai vector đã chuẩn hoá. Mỗi token chữ trước khi vào Transformer được tra thành một vector 512 chiều trong bảng embedding gồm 49.408 dòng; SEARLE chèn pseudo-token vào đúng chỗ này.'));
add(H2('3.2. Textual inversion và OTI'));
add(P('Với mỗi ảnh I, OTI (Optimization-based Textual Inversion) tìm một vector v* đặt vào vị trí ký hiệu $ của câu "a photo of $" sao cho đặc trưng chữ gần đặc trưng ảnh, đồng thời có hành vi giống một từ thật:'));
add(EQ('L_OTI(v) = λ_cos · (1 − cos(ψ_T("a photo of $"; v), ψ_I(I))) + λ_gpt · L_gpt(v)'));
add(P('L_gpt lấy các khái niệm thị giác gần ảnh nhất (15 khái niệm, chọn bằng CLIP từ danh sách lớp của Open Images), mỗi khái niệm có sẵn các câu do GPT-Neo 2.7B sinh; câu chứa khái niệm và câu thay khái niệm bằng $ phải cho đặc trưng gần nhau. Cấu hình: 350 bước, tốc độ học 0,02, λ_cos = 1, λ_gpt = 0,5, lấy trung bình trượt (EMA, 0,99) của token.'));
add(H2('3.3. Mạng φ và chưng cất'));
add(P('OTI tốn khoảng 350 bước tối ưu cho mỗi ảnh nên không dùng được lúc truy vấn. SEARLE chưng cất token OTI của 100.000 ảnh ImageNet vào mạng φ: MLP 512 → 2048 → 2048 → 512 (GELU, dropout 0,5) nhận đặc trưng ảnh ψ_I(I) và cho pseudo-token φ(ψ_I(I)). Hàm mất mát:'));
add(EQ('L_φ = λ_distil · L_contrastive(φ(ψ_I(I)), v*_I ; τ) + λ_gpt · L_gpt'));
add(P('với L_contrastive là mất mát tương phản kiểu InfoNCE giữa token dự đoán và token OTI trong cùng batch (nhiệt độ τ = 0,25), λ_distil = 1, λ_gpt = 0,75; batch 256, tốc độ học 10⁻⁴, 100 epoch.'));
add(H2('3.4. Truy xuất'));
add(P('Với truy vấn (ảnh tham chiếu I_r, câu c), vector truy vấn là q = ψ_T("a photo of $ that c"; φ(ψ_I(I_r))). Mọi ảnh trong kho được mã hoá một lần bằng ψ_I; điểm của ảnh g là cos(q, ψ_I(g)). Ảnh được đưa về 224 × 224 bằng **targetpad**: đệm thêm viền để tỉ lệ cạnh không vượt 1,25 rồi mới co, tránh cắt mất nội dung như phép cắt giữa mặc định của CLIP.'));
add(Figure_pipeline());
add(H2('3.5. Chỉ số đánh giá và khoảng tin cậy'));
add(UL([
  '**Recall@K (R@K):** tỉ lệ truy vấn có ảnh đích trong K kết quả đầu (CIRR, FashionIQ). **Rsubset@K:** như R@K nhưng chỉ xếp hạng trong nhóm 6 ảnh gần giống nhau của CIRR, đo khả năng phân biệt chi tiết.',
  '**mAP@K:** trung bình độ chính xác trung bình trên top-K, dùng cho CIRCO vì mỗi truy vấn có nhiều ảnh đích đúng.',
  '**Khoảng tin cậy 95%:** bootstrap ghép cặp 1.000 lần (seed 0) trên các truy vấn: lấy mẫu lại cùng một tập truy vấn cho cả hai cấu hình rồi tính hiệu số. Một cải thiện chỉ được gọi là có ý nghĩa khi cả khoảng tin cậy của hiệu số nằm trên 0. CI chưa điều chỉnh cho nhiều phép so sánh và không phản ánh biến thiên giữa các seed huấn luyện.',
]));
add(H2('3.6. Kỹ thuật xử lý ảnh dùng trong đề tài'));
add(TABLE(['Nhóm', 'Kỹ thuật', 'Dùng ở'], [
  ['Không gian màu', 'RGB → CIELAB; khoảng cách màu CIEDE2000; HSV', 'Bộ đo màu, độ sáng; CBIR'],
  ['Phân vùng', 'Ngưỡng Otsu, hình thái học (mở/đóng), thành phần liên thông lớn nhất; GrabCut; spectral residual', 'Mặt nạ đối tượng'],
  ['Phân cụm', 'k-means trên điểm ảnh CIELAB (4 cụm)', 'Màu chủ đạo'],
  ['Miền tần số', 'FFT 2-D, đỉnh phổ/nền (log10), góc đỉnh; lọc Gauss thông thấp/thông cao', 'Đo sọc; E3.5'],
  ['Kết cấu, biên', 'LBP, entropy LBP; bộ lọc Gabor; Canny; HOG', 'Đo hoa văn; CBIR'],
  ['Suy giảm', 'Nhiễu Gauss, muối tiêu; mờ Gauss, mờ chuyển động (PSF); nén JPEG; gamma + nhiễu; co/giãn bicubic; lệch kênh màu', 'Chương 7'],
  ['Phục hồi', 'Median, Gaussian, bilateral, non-local means; Wiener, Richardson–Lucy (biết PSF); unsharp mask; cân bằng histogram, CLAHE, gamma, Retinex đơn thang; gray world, white patch; làm mượt biên khối 8 × 8', 'Chương 7'],
  ['Ước lượng suy giảm', 'σ nhiễu bằng MAD hệ số wavelet; tỉ lệ điểm cực trị; phương sai Laplacian; năng lượng tần số cao; độ khối 8 × 8; L\\*, a\\*, b\\* trung bình; BRISQUE', 'Phục hồi tự động'],
  ['Chất lượng ảnh', 'PSNR, SSIM', 'Chương 7'],
], [18, 57, 25], 'Kỹ thuật xử lý ảnh cổ điển được cài đặt và sử dụng.'));

// ---------------- Chương 4 ----------------
add(H1('Tái lập SEARLE')); startChapter();
add(H2('4.1. Dữ liệu'));
add(TABLE(['Tập', 'Vai trò', 'Quy mô dùng'], [
  ['ImageNet test (ILSVRC 2012)', 'Ảnh không nhãn để OTI và huấn luyện φ', '100.000 ảnh'],
  ['CIRR (Liu et al., 2021)', 'Đánh giá; ảnh đời thường (NLVR2)', 'val 4.181 truy vấn, kho 2.297 ảnh; test 4.148 truy vấn'],
  ['FashionIQ (Wu et al., 2021)', 'Đánh giá; quần áo (dress, shirt, toptee)', 'val 6.016 truy vấn, 15.415 ảnh'],
  ['CIRCO (Baldrati et al., 2023)', 'Đánh giá; nhiều ảnh đích đúng; kho COCO unlabeled', 'val 220 truy vấn, test 800; kho 123.403 ảnh'],
], [28, 42, 30], 'Dữ liệu sử dụng (đã kiểm kê đủ ảnh ở E1.2).'));
add(H2('4.2. Quy trình và chi phí'));
add(UL([
  'Liên kết khái niệm cho 100.000 ảnh ImageNet → OTI chia 3 phần (seed 42, 43, 44) rồi gộp thành bộ token `oti_B32` → huấn luyện φ 100 epoch (`phi_B32`) → đánh giá.',
  'Môi trường: Python 3.8, PyTorch 1.11 (CUDA 11.3), Google Colab với GPU A100 cho huấn luyện, T4/L4 cho đánh giá. Huấn luyện φ mất khoảng 2,4 phút mỗi epoch trên A100 (đo ở lượt chạy thử 2 epoch).',
  'Khác với bài báo: OTI chạy thành 3 phần với 3 seed thay vì một lượt; không dùng Comet để theo dõi.',
  'Toàn bộ thí nghiệm của nhóm chạy qua một module đánh giá chung (`retrieval_core.py`). Trên dữ liệu giả lập, module mới cho kết quả trùng từng bit với code gốc; trên dữ liệu thật, code gốc và code mới trên cùng GPU T4 cho cùng 7 chỉ số CIRR và trùng 100% top-10 của file test.',
]));
add(H2('4.3. Kết quả'));
add(TABLE(['Mô hình', 'CIRR R@1', 'CIRR R@5', 'CIRR R@10', 'CIRR R@50', 'Rsubset@1', 'CIRCO mAP@5', 'CIRCO mAP@10'], [
  ['SEARLE, số bài báo', '24,00', '53,42', '66,82', '89,78', '54,89', '9,35', '9,94'],
  ['SEARLE, checkpoint tác giả, nhóm chạy', '23,30', '52,92', '66,92', '89,83', '54,00', '9,39', '9,96'],
  ['**phi_B32 của nhóm**', '**23,35**', '52,65', '**66,94**', '89,74', '**54,46**', '**9,44**', '9,79'],
], [26, 9, 9, 10, 10, 11, 12, 13], 'Điểm **test** do server chấm (CIRR test1, CIRCO test; 13/11/2026). Số bài báo: arXiv 2303.15247v2, Table 2 và 3.', { numeric: [1, 2, 3, 4, 5, 6, 7] }));
add(TABLE(['Mô hình', 'CIRR R@1', 'CIRR R@10', 'FashionIQ R@10 (TB)', 'CIRCO mAP@5'], [
  ['SEARLE, số bài báo', '25,09', '68,79', '22,89', '6,82'],
  ['SEARLE, checkpoint tác giả', '25,66 (A100) / 25,59 (T4)', '69,24', '22,90 ¹', '6,82'],
  ['phi_B32 của nhóm', '25,47 (A100) / 25,50 (T4)', '69,24', '22,83 ¹', '6,46'],
], [30, 22, 14, 18, 16], 'Kết quả trên tập **val**. ¹ Có loại ảnh tham chiếu khỏi kho kết quả (`--exclude-reference`).', { numeric: [2, 3, 4] }));
add(P('Bản tái lập khớp checkpoint của tác giả: trên CIRR test, R@1 hơn 0,05 điểm, Rsubset@1 hơn 0,46; trên CIRCO test mAP@5 hơn 0,05. Cả hai đều thấp hơn số trong bài báo khoảng 0,7 điểm R@1 trên CIRR test; vì checkpoint của chính tác giả cũng thấp tương tự khi nhóm chạy, phần chênh này nhiều khả năng đến từ môi trường (phiên bản thư viện, GPU) chứ không phải từ bản tái lập.'));
add(P('**Ảnh hưởng của GPU.** SEARLE trên CIRR val cho 25,66 khi chạy trên A100 và 25,59 trên T4, cùng code. Lý do: PyTorch 1.11 mặc định tính phép nhân ma trận bằng TF32 trên A100, sai số làm tròn đủ để đảo thứ tự vài cặp ảnh có điểm sát nhau (0,07 điểm tương đương 3 trên 4.181 truy vấn). Nhóm vì vậy giữ mốc so sánh riêng cho từng loại GPU, và so file test khác GPU bằng tiêu chí top-1 trùng ≥ 99% và tập hợp top-10 trùng ≥ 95% (đạt 99,59% và 96,31%).'));
add(H2('4.4. Lượng dữ liệu cho OTI và φ'));
add(TABLE(['Số ảnh ImageNet', 'CIRR val R@1', 'So với 100.000 ảnh (CI 95%)'], [
  ['6.824 (lượt thử ban đầu)', '22,60', '—'],
  ['33.334 (1 phần)', '24,30', '−1,17 [−1,89; −0,45]'],
  ['66.667 (2 phần)', '24,68', '−0,79 [−1,32; −0,26]'],
  ['100.000 (đầy đủ)', '25,47', '—'],
], [36, 24, 40], 'Ảnh hưởng của lượng dữ liệu không nhãn (E1.14; mỗi mức một lần huấn luyện, 100 epoch, A100).', { numeric: [1] }));
add(P('Điểm tăng đều theo lượng ảnh và chưa bão hoà ở 100.000 ảnh. Do giữ cố định 100 epoch, lượng dữ liệu lớn hơn cũng đồng nghĩa với nhiều bước cập nhật hơn, nên không tách được hai yếu tố này.'));

// ---------------- Chương 5 ----------------
add(H1('Phân tích')); startChapter();
add(H2('5.1. Baseline CLIP và CBIR cổ điển'));
add(TABLE(['Phương pháp', 'CIRR R@1', 'FashionIQ R@10', 'CIRCO mAP@5'], [
  ['Chỉ ảnh tham chiếu (CLIP ảnh)', '7,01', '6,17', '3,00'],
  ['Chỉ câu mô tả (CLIP chữ)', '20,52', '18,61', '2,91'],
  ['Tổng ảnh + chữ (chuẩn hoá rồi cộng)', '11,93', '15,32', '5,07'],
  ['CBIR cổ điển (màu, LBP, HOG, Gabor)', '1,72', '2,99', '—'],
  ['CBIR + CLIP chữ', '11,55', '—', '—'],
  ['SEARLE (checkpoint tác giả)', '25,59', '22,90', '9,10'],
  ['phi_B32 của nhóm', '25,50', '22,83', '8,85'],
], [46, 18, 18, 18], 'Baseline trên tập val (FashionIQ và CIRCO loại ảnh tham chiếu khỏi kết quả).', { numeric: [1, 2, 3] }));
add(P('Câu mô tả một mình đã mạnh trên CIRR (20,52), còn ảnh tham chiếu một mình rất yếu: ảnh đích thường *khác* ảnh tham chiếu đúng ở chỗ câu yêu cầu, nên càng giống ảnh tham chiếu càng dễ sai. Cộng ảnh + chữ còn kém chữ một mình trên CIRR vì vector ảnh – ảnh có cosine lớn và phân tán rộng hơn hẳn vector chữ – ảnh (Mục 5.4), lấn át phần chữ. CBIR cổ điển gần như không giải được bài toán (R@1 1,72), vì đặc trưng thủ công chỉ mô tả màu và kết cấu toàn ảnh, không hiểu câu mô tả.'));
add(Figure(['01_baseline_26_runs.png', 'Chỉ số chính và CI 95% của 26 lượt baseline (Hòa, H6).', 560]));
add(H2('5.2. Theo nhóm kiểu sửa đổi'));
add(P('Một bộ luật từ khoá chia 4.181 truy vấn CIRR val thành các nhóm sửa đổi (một truy vấn có thể thuộc nhiều nhóm); chấm tay 100 truy vấn ngẫu nhiên cho độ chính xác 78%.'));
add(TABLE(['Nhóm', 'Số truy vấn', 'CLIP chữ', 'Tổng', 'SEARLE', 'phi_B32'], [
  ['Tất cả', '4.181', '20,5', '11,9', '25,6', '25,5'],
  ['Màu sắc', '1.385', '23,7', '14,5', '29,1', '30,0'],
  ['Độ sáng', '151', '20,5', '21,2', '31,1', '32,5'],
  ['Thêm đối tượng', '1.175', '27,0', '11,1', '30,5', '30,5'],
  ['Số lượng', '1.193', '22,1', '11,1', '27,2', '27,2'],
  ['Góc nhìn', '582', '14,8', '13,4', '25,1', '25,4'],
  ['Không gian (trái/phải…)', '723', '18,1', '11,8', '25,0', '25,0'],
  ['Phủ định', '449', '12,2', '8,7', '17,4', '16,3'],
], [34, 14, 13, 13, 13, 13], 'CIRR val R@1 theo nhóm kiểu sửa đổi (E1.10).', { numeric: [1, 2, 3, 4, 5] }));
add(P('Truy vấn **phủ định** ("không có…", "bỏ…") khó nhất với mọi phương pháp (16–17 so với 25,5 chung), khớp với nhận xét của ARO rằng CLIP xử lý câu như túi từ. Truy vấn về màu và độ sáng dễ hơn mức chung: đây là những thuộc tính CLIP đã nắm khá tốt, một dấu hiệu sớm cho kết quả ở Chương 6.'));
add(H2('5.3. Phân tích "giữ – sửa"'));
add(P('Với mỗi truy vấn sai ở top-1, so ảnh top-1 với ảnh đích theo hai độ tương đồng: với ảnh tham chiếu (giữ) và với câu mô tả (sửa).'));
add(TABLE(['Phương pháp', 'Truy vấn sai', 'Chép ảnh tham chiếu', 'Bỏ qua ảnh tham chiếu', 'Cả hai cao hơn', 'Cả hai thấp hơn'], [
  ['phi_B32 (CIRR)', '3.115', '25,4%', '25,8%', '45,1%', '3,7%'],
  ['Tổng ảnh + chữ (CIRR)', '3.682', '65,0%', '2,1%', '33,0%', '0,0%'],
  ['phi_B32 (CIRCO)', '194', '20,6%', '35,1%', '41,8%', '2,6%'],
], [24, 14, 16, 17, 15, 14], 'Phân loại lỗi top-1 (E1.11).', { numeric: [1, 2, 3, 4, 5] }));
add(P('Baseline tổng chủ yếu "chép" ảnh tham chiếu (65% lỗi), đúng như phân tích ở Mục 5.1. SEARLE cân bằng hai chiều. Gần một nửa lỗi của SEARLE là "cả hai cao hơn": ảnh top-1 vừa giống ảnh tham chiếu hơn vừa khớp câu hơn ảnh đích, tức thường là truy vấn mơ hồ hoặc chú thích có nhiều đáp án đúng.'));
add(H2('5.4. Vector ảnh và vector từ'));
add(P('Pseudo-token là một "từ giả" đặt giữa các vector từ của CLIP. Đo trên 2.165 ảnh tham chiếu của CIRR val:'));
add(UL([
  '**Độ lớn:** vector từ thật của CLIP có độ lớn trung vị 0,29; pseudo-token của SEARLE là 11,3 và của phi_B32 là 10,8, tức lớn gấp khoảng 38 lần. Mọi pseudo-token đều vượt phân vị 99% của từ thật.',
  '**Có giống một từ không:** cosine với từ thật gần nhất chỉ 0,19 (giữa hai từ thật là 0,29). Thay mỗi token bằng từ thật gần nhất làm R@1 rơi từ 25,5 xuống 17,4; giữ hướng nhưng đưa độ lớn về mức từ thật cũng rơi xuống 20,5. Thông tin của pseudo-token nằm ở cả hướng và độ lớn mà không từ nào diễn đạt được.',
  '**phi_B32 so với SEARLE:** trên cùng ảnh, hai token có cosine trung vị 0,967 (hai ảnh khác nhau: 0,09); bản tái lập học được gần như cùng một ánh xạ.',
  '**Khoảng cách phía ảnh – phía chữ:** tâm các vector truy vấn có pseudo-token cách tâm vector ảnh 0,86 (vector chữ thuần: 0,88). Điểm ảnh – ảnh phân tán rộng gấp 2,4 lần điểm truy vấn – ảnh, giải thích vì sao cộng thêm điểm ảnh tham chiếu với trọng số nhỏ (Mục 8.2) đã lấn át truy vấn.',
]));
add(Figure(['Hoa_priority_20261026_135308_b3b8c1dd__E1.15a-tokens-cirr__tokens.png', 'Phân bố độ lớn (trái) và cosine với từ thật gần nhất (phải): từ thật CLIP, SEARLE, phi_B32 (CIRR val, E1.15a).', 560]));
add(H2('5.5. Ví dụ và bản đồ che khuất'));
add(P('Bản đồ che khuất lần lượt che từng ô của ảnh tham chiếu bằng màu xám và đo điểm của ảnh đích giảm bao nhiêu, cho biết pseudo-token "nhìn" vào vùng nào. Các ví dụ được chọn ngẫu nhiên (seed 0) trong số truy vấn thành công và thất bại, trải đều theo nhóm sửa đổi.'));
add(Figure(['Hoa_independent_20261026_215746__E1.13-occlusion-cirr__01_30036.png', 'Bản đồ che khuất của một truy vấn CIRR thành công (E1.13): vùng đỏ là vùng làm điểm ảnh đích giảm nhiều nhất khi bị che.', 520]));
add(Figure(['04_success_color_27733.png', 'Ví dụ CIRR (E1.12): ảnh tham chiếu, câu mô tả và top kết quả của phi_B32 và của phi_B32 + xếp hạng lại theo màu (khung xanh: ảnh đích).', 590]));

// ---------------- Chương 6 ----------------
add(H1('Đóng góp chính: kiểm chứng thuộc tính bằng xử lý ảnh')); startChapter();
add(P('**Ý tưởng.** Khi câu mô tả nêu một thuộc tính đo được ("màu đỏ", "tối hơn", "có sọc", "chụp gần hơn"), thay vì tin hoàn toàn vào CLIP, ta đo thuộc tính đó trực tiếp trên ảnh ứng viên bằng xử lý ảnh cổ điển và dùng phép đo để xếp hạng lại top-K của SEARLE. Hướng này có hai câu hỏi tách biệt: bộ đo có đo đúng điều người viết câu muốn nói không, và nếu đúng thì có giúp truy xuất không.'));
add(H2('6.1. Tách ràng buộc từ câu mô tả'));
add(P('Một bộ luật từ khoá nhận 5 họ thuộc tính: màu (46 sắc độ, kể cả "đỏ nhạt", "xanh navy"…), độ sáng (tối hơn/sáng hơn), độ rực (rực hơn/nhạt hơn, đen trắng), hoa văn (sọc dọc/ngang, chấm, kẻ ô, hoa, trơn), zoom (gần hơn/xa hơn). Bộ luật xử lý phủ định trong phạm vi 2–3 từ ("not red", "remove the stripes"), câu dạng "đổi A thành B" và gộp hai câu mô tả của FashionIQ, bỏ ràng buộc mâu thuẫn. Chấm tay 100 truy vấn: đúng 97%.'));
add(H2('6.2. Bộ đo'));
add(TABLE(['Thuộc tính', 'Cách đo', 'Mức thoả c ∈ [0, 1]'], [
  ['Mặt nạ đối tượng', 'Ảnh nền trắng (FashionIQ): Otsu trên độ bão hoà và độ sáng + đóng hình thái + thành phần liên thông lớn nhất; ảnh cảnh: GrabCut khởi tạo bằng hình chữ nhật giữa ảnh; tuỳ chọn spectral residual', '—'],
  ['Màu', 'k-means 4 cụm trên CIELAB trong mặt nạ; khoảng cách CIEDE2000 tới các mẫu màu', 'Σ tỉ lệ cụm · exp(−ΔE/15)'],
  ['Độ sáng', 'Trung vị L\\* trong mặt nạ, so với ảnh tham chiếu', 'sigmoid của chênh lệch L\\*'],
  ['Độ rực', 'Colorfulness (Hasler & Süsstrunk)', 'sigmoid của chênh lệch'],
  ['Hoa văn, sọc', 'Mật độ biên Canny; tỉ số đỉnh/nền của phổ FFT (log10) và góc đỉnh; entropy LBP; Gabor', 'sigmoid; sọc nhân cos² theo hướng'],
  ['Zoom', 'Tỉ lệ diện tích mặt nạ, so với ảnh tham chiếu', 'sigmoid của chênh lệch diện tích'],
], [17, 55, 28], 'Bộ đo thuộc tính (`src/attributes/meters.py`). Phủ định: c → 1 − c.'));
add(P('**Kiểm thử trên ảnh tổng hợp (E2.1)** trước khi dùng ảnh thật: nhận đúng 46/46 sắc độ màu, 19/20 ảnh sọc (hướng đúng 8/8); độ sáng, độ rực, diện tích tăng đơn điệu theo đại lượng sinh ảnh; mặt nạ Otsu/GrabCut khớp hình sinh với IoU 1,00.'));
add(H2('6.3. Độ phủ và độ đồng thuận với người viết câu'));
add(TABLE(['Tập', 'Truy vấn có ràng buộc (E2.0)', 'Đồng thuận bộ đo – câu (E2.2)', 'Mức ngẫu nhiên'], [
  ['CIRR val', '36,3%', '67,1%', '45,8%'],
  ['FashionIQ val', '90,7%', '75,8%', '51,6%'],
  ['CIRCO val', '25,5%', '62,7%', '49,3%'],
], [22, 28, 28, 22], 'Độ phủ và độ đồng thuận. Đồng thuận: trên cặp (ảnh tham chiếu, ảnh đích) thật, ràng buộc tương đối (tối hơn, gần hơn…) được tính là đồng thuận khi c(đích so với tham chiếu) > 0,5; ràng buộc tuyệt đối (đỏ, có sọc…) khi c(đích) > c(tham chiếu), tức ảnh đích tiến về thuộc tính được yêu cầu. Ngẫu nhiên: cùng luật với một ảnh ngẫu nhiên thay cho ảnh đích.', { numeric: [1, 2, 3] }));
add(P('Bộ đo khớp với người viết câu rõ hơn ngẫu nhiên 13–24 điểm phần trăm; trên FashionIQ, 4/5 họ đạt ít nhất 65%. Theo luật quyết định ghi trước trong kế hoạch (dừng nếu độ phủ dưới 10% ở cả CIRR và FashionIQ, hoặc đa số họ đồng thuận dưới 65%), nhóm giữ hướng này làm đóng góp chính.'));
add(H2('6.4. Xếp hạng lại'));
add(P('Trong top-K = 100 của SEARLE, điểm CLIP được chuẩn hoá z-score để cùng thang với mức thoả, rồi:'));
add(EQ('điểm mới = z(cos(q, g)) + w · trung bình các c_j(g)'));
add(P('Truy vấn không có ràng buộc giữ nguyên thứ hạng. Trọng số w được chọn trên CIRR val theo một **luật ghi trước khi xem kết quả**: với mỗi họ lấy w có hiệu số R@1 lớn nhất, hoà thì lấy w nhỏ hơn; FashionIQ và CIRCO chỉ dùng để kiểm tra tổng quát hoá.'));
add(H2('6.5. Kết quả'));
add(P('Lượt quét đầu (E2.3, w = 0,05–0,3) gần như không đổi thứ hạng nào: z có độ lệch chuẩn 1 và ảnh hạng 1 thường hơn ảnh hạng 10 khoảng 1 đơn vị z, trong khi w · c ≤ 0,3. Nhóm quét tiếp w = 0,5–4 (E2.3b) cho ba họ có nhiều truy vấn nhất, tổng cộng 64 cấu hình.'));
add(TABLE(['Họ', 'w chọn', 'CIRR R@1', 'Δ (CI 95%)', 'FashionIQ R@10', 'Δ (CI 95%)'], [
  ['(không xếp hạng lại)', '—', '25,47', '—', '22,81', '—'],
  ['Màu', '2', '25,78', '+0,31 [−0,19; +0,79]', '22,81', '0,00 [−0,37; +0,36]'],
  ['Độ sáng', '1', '25,52', '+0,05 [−0,07; +0,17]', '22,90', '+0,08 [−0,07; +0,24]'],
  ['Hoa văn', '0,1', '25,50', '+0,02 [0,00; +0,07]', '22,81', '0,00 [−0,05; +0,05]'],
  ['Hoa văn (w lớn)', '4', '25,38', '−0,10 [−0,22; 0,00]', '22,25', '**−0,56 [−0,90; −0,24]**'],
], [20, 9, 12, 22, 14, 23], 'Xếp hạng lại theo từng họ thuộc tính (E2.3, E2.3b; CIRR R@1, FashionIQ R@10 trung bình 3 loại).', { numeric: [1, 2, 4] }));
add(Figure(['H10_weight_sweep.png', 'Hiệu số R@1 (CIRR) và R@10 (FashionIQ) theo trọng số w, kèm CI 95%, cho 5 họ thuộc tính (64 cấu hình).', 590]));
add(TABLE(['Biến thể (màu, w = 2)', 'CIRR R@1', 'Δ so với mặc định', 'FashionIQ R@10', 'Δ so với mặc định'], [
  ['Mặc định: K = 100, mặt nạ auto, xử lý phủ định', '25,78', '—', '22,81', '—'],
  ['K = 50', '25,78', '0,00 [−0,17; +0,17]', '22,78', '−0,03 [−0,20; +0,16]'],
  ['Không mặt nạ (đo cả ảnh)', '26,07', '+0,29 [−0,12; +0,67]', '23,13', '+0,31 [−0,02; +0,68]'],
  ['Mặt nạ Otsu', '25,81', '+0,02 [−0,34; +0,38]', '22,81', '0,00 [−0,10; +0,10]'],
  ['Mặt nạ GrabCut', '25,88', '+0,10 [−0,02; +0,24]', '23,01', '+0,20 [−0,08; +0,50]'],
  ['Mặt nạ spectral residual', '25,83', '+0,05 [−0,33; +0,43]', '22,83', '+0,02 [−0,32; +0,33]'],
  ['Không xử lý phủ định', '25,81', '+0,02 [−0,05; +0,10]', '22,78', '−0,03 [−0,08; 0,00]'],
], [34, 11, 19, 14, 22], 'Ablation: số ứng viên K, mặt nạ (E2.4), phủ định (E2.5).', { numeric: [1, 3] }));
add(P('Trên CIRCO (không chỉnh lại tham số, E2.7), màu w = 2 cho mAP@5 8,85 → 9,01, Δ +0,15, CI [−0,04; +0,42].'));
add(Figure(['04_success_color_toptee-1698.png', 'Ví dụ FashionIQ có giải thích (E2.8): mỗi kết quả kèm mức thoả c, thứ hạng CLIP cũ và lý do ("white: closest colour dE 1 on 48% of the pixels").', 590]));
add(H2('6.6. Thảo luận'));
add(P('**Không cấu hình nào cải thiện có ý nghĩa thống kê**, nên cấu hình cuối không dùng xếp hạng lại. Kết quả âm tính này có lời giải thích nhất quán với các phân tích khác:'));
add(UL([
  'CLIP đã nắm tốt chính những thuộc tính đo được: truy vấn về màu và độ sáng là nhóm *dễ nhất* của SEARLE (Bảng 5.2), và các ứng viên trong top-100 thường đã đúng màu, nên phép đo ít khi phân biệt được chúng.',
  'Bộ đo còn sai: đồng thuận 63–76% nghĩa là cứ 4–5 ràng buộc lại có 1 lần đánh giá sai. Khi tăng w, các lần sai bị khuếch đại: hoa văn với w = 4 làm FashionIQ giảm 0,56 điểm có ý nghĩa.',
  'Bỏ mặt nạ cho kết quả cao nhất trên cả hai tập (dù chưa có ý nghĩa): câu mô tả thường nói về cả ảnh hơn là đúng vùng đối tượng mà mặt nạ tách ra, và mặt nạ sai thêm một nguồn lỗi.',
]));
add(P('Phần giá trị còn lại của hướng này là **khả năng giải thích**: mỗi kết quả kèm lý do đo được bằng con số (Hình 6.2), điều CLIP không cho.'));

// ---------------- Chương 7 ----------------
add(H1('Đóng góp thứ hai: độ bền với ảnh xấu và phục hồi ảnh')); startChapter();
add(P('Ảnh truy vấn trong thực tế thường xấu: chụp tối, rung tay, nén mạnh, lệch màu. Chương này đo SEARLE giảm điểm bao nhiêu khi **ảnh tham chiếu** bị làm xấu (kho ảnh giữ nguyên, vì ảnh trong kho thường sạch), thử phục hồi bằng xử lý ảnh cổ điển, và giải thích vì sao phục hồi giúp hoặc không.'));
add(H2('7.1. Bộ suy giảm'));
add(TABLE(['Loại', 'Mức 1 / mức 2', 'Mô hình'], [
  ['Nhiễu Gauss', 'σ = 10 / 25 (thang 0–255)', 'Nhiễu cộng'],
  ['Nhiễu muối tiêu', '2% / 10% điểm ảnh', 'Nhiễu xung'],
  ['Mờ Gauss', 'σ = 1 / 2 px', 'Tích chập'],
  ['Mờ chuyển động', 'Nhân dài 9 / 21 px, góc ngẫu nhiên', 'Tích chập với PSF đã biết'],
  ['Nén JPEG', 'Chất lượng 30 / 10', 'Lượng tử hoá DCT'],
  ['Thiếu sáng', 'Gamma 2 + nhiễu σ 10 / gamma 3 + nhiễu σ 20', 'Biến đổi cường độ'],
  ['Độ phân giải thấp', 'Thu nhỏ ×2 / ×4 rồi phóng lại bicubic', 'Lấy mẫu lại'],
  ['Lệch màu', 'R × 1,2, B × 0,8 / R × 1,4, B × 0,6', 'Sai cân bằng trắng'],
], [22, 46, 32], 'Bộ suy giảm (`src/degradations.py`); seed cố định theo tên ảnh để lặp lại được.'));
add(H2('7.2. Mức sụt giảm'));
add(Figure(['e31_drop.png', 'Thay đổi CIRR val R@1 khi ảnh tham chiếu bị làm xấu (E3.1, phi_B32).', 540]));
add(P('Mờ chuyển động, thiếu sáng và nhiễu muối tiêu ở mức nặng gây thiệt hại lớn nhất (2–2,8 điểm). Mờ Gauss và độ phân giải thấp gần như vô hại, phù hợp với kết quả miền tần số ở Mục 7.6: CLIP dựa chủ yếu vào tần số thấp, thứ hai loại suy giảm này giữ lại.'));
add(P('**Một bài học về giao thức đánh giá.** Lượt E3.1 đầu tiên trên CIRCO cho kết quả ngược đời: làm xấu ảnh lại *tăng* mAP@5 (mờ chuyển động +1,81). Nguyên nhân: kho CIRCO chứa chính ảnh tham chiếu (bản sạch), và trên ảnh sạch nó đứng hạng 1 ở 116/220 truy vấn, chiếm chỗ của ảnh đích; khi ảnh truy vấn bị làm xấu, nó không còn tìm ra chính mình (34/220), ảnh đích được đẩy lên. Chạy lại có loại ảnh tham chiếu (`--exclude-reference`), các suy giảm nặng đều giảm điểm (thiếu sáng −2,01, muối tiêu −1,28 so với ảnh sạch 8,78); một số loại vẫn tăng nhẹ trong biên độ nhiễu của 220 truy vấn.'));
add(H2('7.3. Phục hồi cố định'));
add(Figure(['e32_restoration.png', 'Thay đổi R@1 do từng phép phục hồi so với không phục hồi (trái) và mức tăng PSNR tương ứng (phải); suy giảm mức 2, CIRR val (E3.2).', 590]));
add(P('Phục hồi đúng loại cứu được phần lớn thiệt hại: median trên nhiễu muối tiêu +1,72 (về 25,19, gần ảnh sạch 25,50), Wiener trên mờ chuyển động +1,87, gamma trên thiếu sáng +0,79. Nhưng **PSNR không phải là thước đo đúng**: NLM trên nhiễu Gauss tăng PSNR 5,8 dB, SSIM từ 0,36 lên 0,72, mà R@1 *giảm* 0,65, kém hơn cả không phục hồi; gray world tăng PSNR 7,4 dB trên ảnh lệch màu nhưng R@1 chỉ +0,07. Phép phục hồi tốt nhất cho truy xuất ở từng loại được ghi thành bảng `oracle`.'));
add(H2('7.4. Phục hồi tự động'));
add(P('Bộ ước lượng đo các đại lượng cổ điển trên ảnh (σ nhiễu từ hệ số wavelet, tỉ lệ điểm cực trị, năng lượng tần số cao, độ khối 8 × 8, L\\* và a\\*b\\* trung bình) và áp chuỗi luật if-then có ngưỡng chọn trên 300 ảnh CIRR **train**; nhận đúng loại suy giảm 81,3%. Biến thể `auto_iqa` thử vài phép phục hồi và chọn ảnh có điểm BRISQUE tốt nhất.'));
add(TABLE(['Phục hồi', 'Ảnh suy giảm hỗn hợp', 'Ảnh sạch'], [
  ['Không phục hồi', '24,49', '25,50'],
  ['auto (luật)', '**25,16**', '25,21'],
  ['auto_iqa (BRISQUE)', '25,04', '25,09'],
  ['oracle (biết loại suy giảm)', '24,97', '—'],
], [40, 30, 30], 'Phục hồi tự động, CIRR val R@1 (E3.3). Bộ hỗn hợp: mỗi ảnh một loại suy giảm ngẫu nhiên. CIRCO hỗn hợp + auto: mAP@5 9,77.', { numeric: [1, 2] }));
add(P('`auto` tốt nhất trên ảnh xấu, hơn cả `oracle`. Một giải thích khả dĩ: bảng `oracle` được chọn trên suy giảm mức 2, trong khi bộ hỗn hợp có cả mức 1, nơi phục hồi dễ có hại; luật `auto` bỏ qua những ảnh mà nó không phát hiện được suy giảm. Giá phải trả: trên ảnh sạch R@1 giảm 0,29, vì luật xử lý 63% ảnh sạch; riêng khử khối JPEG chạm 720 ảnh, do ảnh CIRR vốn đã là JPEG nén sẵn nên độ khối cao.'));
add(H2('7.5. Vì sao PSNR không dự báo được truy xuất'));
add(P('Trên 18 cặp (suy giảm, phục hồi), tương quan Spearman giữa mức tăng PSNR và mức tăng R@1 là −0,09, giữa mức tăng SSIM và mức tăng R@1 là +0,04 (E3.4): **chất lượng ảnh theo mắt người không liên quan đến chất lượng truy xuất**. Để tìm thước đo đúng, nhóm đo độ trôi của vector trong chuỗi SEARLE: 1 − cos giữa vector của ảnh đã xử lý và của ảnh sạch, ở ba chỗ (vector ảnh CLIP, pseudo-token, vector truy vấn).'));
add(TABLE(['Thước đo', 'Theo truy vấn: mất điểm ảnh đích', 'Theo cấu hình: mất R@1'], [
  ['Độ trôi vector ảnh', '+0,22', '**+0,80**'],
  ['Độ trôi pseudo-token', '+0,22', '+0,79'],
  ['Độ trôi vector truy vấn', '+0,19', '**+0,81**'],
  ['PSNR', '−0,10', '−0,54'],
  ['SSIM', '−0,10', '−0,64'],
], [36, 32, 32], 'Tương quan Spearman với mức thiệt hại (E3.9, CIRR val, mọi cấu hình suy giảm/phục hồi/lọc tần số). Dấu dương với độ trôi và dấu âm với PSNR/SSIM là đúng chiều.', { numeric: [1, 2] }));
add(P('Độ trôi vector dự báo thiệt hại tốt hơn hẳn PSNR/SSIM. Hệ quả thực tế: để chọn hoặc thiết kế phép phục hồi cho truy xuất, nên tối ưu "kéo vector CLIP về gần ảnh sạch" thay vì tối ưu PSNR.'));
add(Figure(['drift_vs_metric.png', 'Mức mất R@1 theo độ trôi vector ảnh, độ trôi vector truy vấn và PSNR; mỗi điểm là một cấu hình (E3.9).', 590]));
add(H2('7.6. Phân tích miền tần số'));
add(Figure(['e35_frequency.png', 'CIRR val R@1 khi ảnh tham chiếu qua bộ lọc Gauss thông thấp / thông cao (E3.5).', 470]));
add(P('Giữ tần số thấp với bán kính từ 0,1 tần số Nyquist trở lên gần như không mất điểm (≤ 0,24); chỉ giữ tần số cao mất 4,6–7,7 điểm. CLIP nhận diện ảnh chủ yếu qua cấu trúc và màu ở tần số thấp; chi tiết tinh ít đóng góp. Đây cũng là lý do mờ và độ phân giải thấp ít gây hại (Mục 7.2), và gợi ý rằng phục hồi chi tiết tần số cao (làm sắc nét) ít có lợi cho truy xuất.'));
add(H2('7.7. Bộ đo thuộc tính dưới suy giảm'));
add(P('Trên FashionIQ, độ đồng thuận chung là 75,8% so với ngẫu nhiên 51,6% trên ảnh sạch (khoảng cách 24,2 điểm). Khi ảnh tham chiếu bị làm xấu (E3.6), độ đồng thuận còn 72,5–78,8% nhưng khoảng cách với mức ngẫu nhiên thu hẹp còn 18,3–23,8 điểm. Rõ nhất là thiếu sáng: ràng buộc "tối hơn" chỉ còn đồng thuận 39%, vì ảnh tham chiếu đã tối nên ảnh đích bình thường bị đánh giá là "sáng hơn". Với ảnh lệch màu, họ màu đồng thuận 84,8% so với ngẫu nhiên 64,5% (khoảng cách 20,3 điểm); sau gray world là 80,4% so với 50,7% (29,7 điểm): cân bằng màu khôi phục khả năng phân biệt của bộ đo màu, dù không cải thiện được truy xuất (Hình 7.2).'));
add(H2('7.8. Mạng φ bền với ảnh xấu'));
add(P('Ý tưởng: khi huấn luyện φ, với xác suất 0,5 thay đặc trưng của ảnh sạch bằng đặc trưng của **chính ảnh đó đã bị làm xấu** (4 loại × 2 mức: nhiễu Gauss, mờ Gauss, JPEG, thiếu sáng), nhưng vẫn chưng cất về token OTI của ảnh sạch, để φ học "nhìn xuyên" qua suy giảm. Bốn loại còn lại chỉ dùng khi kiểm tra (chưa thấy khi huấn luyện). So với cách rẻ hơn là cộng nhiễu Gauss vào đặc trưng (σ = 0,1).'));
add(TABLE(['Điều kiện ảnh tham chiếu', 'φ thường', 'φ ảnh xấu (degaug)', 'φ nhiễu đặc trưng'], [
  ['Ảnh sạch', '**24,40**', '24,16', '24,35'],
  ['TB 4 suy giảm đã thấy khi huấn luyện', '22,98', '**23,40**', '23,16'],
  ['TB 4 suy giảm chưa thấy', '22,60', '**22,91**', '22,88'],
  ['TB cả 8 suy giảm', '22,79', '**23,16**', '23,02'],
], [40, 20, 20, 20], 'Sàng lọc φ bền (E3.8a): 50 epoch trên 33.334 ảnh, CIRR val R@1, một seed.', { numeric: [1, 2, 3] }));
add(P('Biến thể degaug bền nhất (+0,37 điểm trung bình trên 8 suy giảm, +0,31 trên suy giảm chưa thấy, rõ nhất mờ chuyển động +1,03), đổi lại −0,24 trên ảnh sạch. Bản đầy đủ (100.000 ảnh, 100 epoch) và đánh giá có khoảng tin cậy (E3.8b, E3.8c) **đang chạy khi viết báo cáo; kết quả sẽ bổ sung vào mục này**.'));
add(Figure(['e37_example.png', 'Một truy vấn CIRR (E3.7): ảnh gốc, nhiễu Gauss, nhiễu Gauss + NLM, kèm top-5 và thứ hạng ảnh đích. Riêng truy vấn này NLM kéo ảnh đích từ hạng 24 lên 4, dù trung bình NLM có hại (Hình 7.2).', 590]));

// ---------------- Chương 8 ----------------
add(H1('Tiền xử lý và truy vấn')); startChapter();
add(TABLE(['Thí nghiệm', 'Cấu hình', 'CIRR val R@1', 'Δ'], [
  ['E4.1 đệm ảnh', 'targetpad 1,25 (mặc định)', '**25,50**', '—'],
  ['', 'targetpad 1,0 / 1,5 / 2,0', '23,80 / 23,85 / 23,37', '−1,70 / −1,65 / −2,13'],
  ['', 'Cắt giữa (mặc định của CLIP)', '23,34', '−2,15'],
  ['E4.2 nội suy', 'bicubic (mặc định) / bilinear / lanczos / nearest', '25,50 / 25,28 / 25,19 / 23,03', '— / −0,22 / −0,31 / −2,46'],
  ['E4.3 lật ảnh (TTA)', 'Lật ảnh tham chiếu / lật kho / cả hai', '25,21 / 25,54 / 25,30', '−0,29 / +0,05 / −0,19'],
  ['E4.4 kết hợp điểm', 'q + α · ảnh tham chiếu, α = 0,05 / 0,1 / 0,2 / 0,3 / 0,5', '24,09 / 22,89 / 20,57 / 18,25 / 15,02', 'CI đều < 0 (α = 0,05: −1,41 [−2,01; −0,86])'],
  ['E4.5 ensemble prompt', '6 mẫu câu, lấy trung bình', '24,85', '−0,65 [−1,17; −0,10]'],
], [18, 34, 24, 24], 'Tiền xử lý và cách tạo truy vấn (CIRR val, phi_B32).'));
add(P('Cấu hình gốc của SEARLE đã là tốt nhất ở mọi trục: targetpad 1,25 giữ đủ nội dung ảnh mà không thu nhỏ đối tượng quá mức; nội suy nearest gây răng cưa làm hỏng đặc trưng. Kết hợp thêm điểm ảnh tham chiếu luôn có hại vì điểm ảnh – ảnh phân tán rộng gấp 2,4 lần điểm truy vấn – ảnh (Mục 5.4): ngay α = 0,05 đã kéo kết quả về phía "chép ảnh tham chiếu". Ensemble 6 mẫu câu cũng giảm, có lẽ vì φ được huấn luyện riêng cho mẫu câu "a photo of $".'));

// ---------------- Chương 9 ----------------
add(H1('Demo')); startChapter();
add(P('Demo web (Flask, `SEARLE-main/demo/`) chạy trên máy cá nhân, CPU đủ dùng. Người dùng thêm ảnh vào thư viện (tải lên hoặc lập chỉ mục một thư mục), chọn ảnh tham chiếu, nhập câu mô tả. Ngoài 3 chế độ cơ bản (SEARLE, chỉ ảnh, chỉ chữ) và hiển thị các từ CLIP gần pseudo-token nhất, demo có bốn tính năng gắn với hai đóng góp:'));
add(OL([
  '**Xếp hạng lại theo thuộc tính:** hiện các ràng buộc tách được từ câu; mỗi kết quả kèm ô màu chủ đạo, L\\*, độ rực, điểm sọc, thứ hạng CLIP cũ (mũi tên lên/xuống) và lý do.',
  '**Ảnh xấu → phục hồi:** chọn loại suy giảm và phép phục hồi (`auto`, `auto_iqa`, `oracle` hoặc một phép cụ thể); hiện ảnh gốc / xấu / phục hồi, PSNR, SSIM, các đại lượng ước lượng, phép phục hồi được chọn, và kết quả trước / sau phục hồi.',
  '**So sánh phương pháp:** cùng truy vấn với 6 phương pháp cạnh nhau (SEARLE, SEARLE + thuộc tính, CLIP ảnh, CLIP chữ, tổng, CBIR cổ điển).',
  '**"Vì sao?":** bản đồ che khuất của ảnh tham chiếu đối với một kết quả, kèm mặt nạ đối tượng của kết quả và lời giải thích thuộc tính.',
], 'demo'));
add(P('*[Chèn ảnh chụp màn hình các tính năng trên trước khi nộp.]*'));

// ---------------- Chương 10 ----------------
add(H1('Học máy')); startChapter();
add(P('Phần này thử cải tiến chính các thành phần học máy của SEARLE. Mọi lượt dưới đây là một seed; khoảng tin cậy chỉ phản ánh biến thiên theo truy vấn.'));
add(H2('10.1. Khởi tạo OTI (warm-start)'));
add(P('OTI mặc định khởi tạo token ngẫu nhiên. Ý tưởng: khởi tạo bằng token của φ (hoặc của SEARLE) để hội tụ nhanh hơn hoặc tốt hơn. Trên CIRCO val, token EMA ở bước 350 cho mAP@5: ngẫu nhiên 6,67; từ phi_B32 6,61 (lr 0,02) / 6,25 (lr 0,005); từ SEARLE 7,03 / 6,82. Mọi CI của hiệu số so với khởi tạo ngẫu nhiên đều chứa 0: chưa có bằng chứng warm-start giúp ở bước cuối.'));
add(Figure(['Hoa_resume_20261026_181527_b4966417__oti-warmstart-curves.png', 'mAP@5 trên CIRCO val theo số bước OTI cho 5 cách khởi tạo, token thường và EMA (E7.1).', 590]));
add(H2('10.2. Bộ câu GPT'));
add(TABLE(['Bộ câu', 'Mô tả', 'CIRCO mAP@5', 'Δ so với P0 (CI 95%)'], [
  ['P0', 'Bộ gốc của tác giả, GPT-Neo 2.7B, 20.931 khái niệm × 256 câu', '6,67', '—'],
  ['P1', 'P0 làm sạch: bỏ 2.977 câu trùng, chuẩn hoá 512 câu, ≤ 75 token', '5,85', '−0,81 [−2,13; +0,52]'],
  ['P2', 'Sinh mới bằng Qwen2.5-1.5B cho khái niệm của CIRCO val (2.292 khái niệm, 144.211 câu)', '8,20', '+1,54 [−0,19; +3,29]'],
  ['Pλ0', 'Không dùng câu GPT (λ_gpt = 0)', '2,16', '−4,51 [−6,56; −2,66]'],
], [10, 52, 15, 23], 'OTI với các bộ câu khác nhau trên CIRCO val (E6.2).', { numeric: [2] }));
add(P('Câu GPT là thành phần quan trọng của OTI: bỏ đi làm mAP@5 rơi từ 6,67 xuống 2,16. Bộ câu sinh mới bằng mô hình ngôn ngữ nhỏ nhưng mới hơn (P2) cao hơn P1 có ý nghĩa (+2,35 [+0,54; +4,30]) và cao hơn P0 1,54 điểm nhưng CI còn chứa 0; P2 chỉ phủ khái niệm của CIRCO val nên đây là kết quả sơ bộ.'));
add(H2('10.3. Lịch tốc độ học'));
add(P('Huấn luyện φ với warm-up 5 epoch rồi giảm cosine thay vì tốc độ học cố định (E8.2a): CIRR R@1 25,47 → 24,61 (−0,86 [−1,55; −0,17]) nhưng CIRCO mAP@5 6,46 → 7,69 (+1,24 [+0,24; +2,31]). Hai tập cho kết luận ngược nhau, nên không có cấu hình thắng chung.'));
add(H2('10.4. Lượng dữ liệu'));
add(P('Xem Mục 4.4: R@1 tăng đều từ 22,60 (6.824 ảnh) lên 25,47 (100.000 ảnh), chưa bão hoà.'));

// ---------------- Chương 11 ----------------
add(H1('Kết luận')); startChapter();
add(H2('11.1. Kết quả chính'));
add(UL([
  'Tái lập SEARLE ViT-B/32 đầy đủ, ngang checkpoint của tác giả trên server test chính thức (CIRR R@1 23,35 so với 23,30; CIRCO mAP@5 9,44 so với 9,39).',
  'Kiểm chứng thuộc tính bằng xử lý ảnh: bộ đo đúng hơn ngẫu nhiên rõ rệt nhưng không cải thiện truy xuất có ý nghĩa trong 76 cấu hình; trọng số lớn còn có hại. Giá trị còn lại là giải thích được kết quả bằng con số đo trên ảnh.',
  'Phục hồi ảnh: phục hồi đúng loại cứu tới 1,9 điểm R@1; phục hồi tự động bằng ước lượng cổ điển tăng 0,67 trên ảnh xấu nhưng giảm 0,29 trên ảnh sạch. PSNR/SSIM không dự báo được lợi ích cho truy xuất; độ trôi vector CLIP thì có (ρ ≈ 0,8).',
  'CLIP dựa chủ yếu vào tần số thấp; cấu hình tiền xử lý gốc của SEARLE đã tối ưu; pseudo-token không phải một từ: lớn gấp ~38 lần từ thật và mất 8 điểm R@1 khi bị ép về từ gần nhất.',
]));
add(H2('11.2. Hạn chế'));
add(UL([
  'Mỗi cấu hình huấn luyện chỉ chạy một seed; khoảng tin cậy không phản ánh biến thiên giữa các lần huấn luyện và chưa điều chỉnh cho nhiều phép so sánh.',
  'Bộ phân loại kiểu sửa đổi chỉ đúng 78% trên mẫu chấm tay; CIRCO val chỉ có 220 truy vấn nên các kết luận trên CIRCO có độ bất định lớn.',
  'Một số so sánh trải trên nhiều loại GPU (T4, L4, A100); nhóm giữ mốc riêng cho từng GPU nhưng sai khác nhỏ vẫn có thể còn.',
  'Phục hồi Wiener và Richardson–Lucy dùng PSF đã biết (không mù); trong thực tế phải ước lượng PSF.',
  'Phục hồi tự động làm giảm nhẹ trên ảnh sạch; luật nhận diện JPEG nhầm với ảnh vốn đã nén.',
]));
add(H2('11.3. Hướng phát triển'));
add(UL([
  'Thiết kế phép phục hồi (hoặc chọn phép phục hồi) tối ưu độ trôi vector CLIP thay vì PSNR; thêm lựa chọn "không phục hồi" khi độ trôi ước lượng nhỏ.',
  'Dùng bộ đo thuộc tính để phát hiện và giải thích lỗi thay vì xếp hạng lại; thử với backbone mạnh hơn (ViT-L/14) và phương pháp mới hơn (LinCIR, CIReVL).',
  'Sinh bộ câu GPT mới cho toàn bộ khái niệm rồi huấn luyện lại φ; nhiều seed cho các kết luận học máy.',
]));

// ---------------- Tài liệu tham khảo ----------------
add(H1plain('Tài liệu tham khảo'));
add(OL([
  'A. Baldrati, L. Agnolucci, M. Bertini, A. Del Bimbo. Zero-Shot Composed Image Retrieval with Textual Inversion. ICCV 2023 (arXiv 2303.15247). Mã nguồn: github.com/miccunifi/SEARLE.',
  'L. Agnolucci, A. Baldrati, M. Bertini, A. Del Bimbo. iSEARLE: Improving Textual Inversion for Zero-Shot Composed Image Retrieval. arXiv 2405.02951, 2024.',
  'A. Radford et al. Learning Transferable Visual Models From Natural Language Supervision (CLIP). ICML 2021.',
  'A. Baldrati, M. Bertini, T. Uricchio, A. Del Bimbo. Effective Conditioned and Composed Image Retrieval Combining CLIP-Based Features (CLIP4Cir). CVPR 2022.',
  'K. Saito et al. Pic2Word: Mapping Pictures to Words for Zero-Shot Composed Image Retrieval. CVPR 2023.',
  'G. Gu et al. Language-only Training of Zero-shot Composed Image Retrieval (LinCIR). CVPR 2024.',
  'Y. Tang et al. Context-I2W: Mapping Images to Context-dependent Words for Accurate Zero-Shot Composed Image Retrieval. AAAI 2024.',
  'S. Karthik et al. Vision-by-Language for Training-Free Compositional Image Retrieval (CIReVL). ICLR 2024.',
  'M. Yuksekgonul et al. When and Why Vision-Language Models Behave like Bags-of-Words, and What to Do About It? (ARO). ICLR 2023.',
  'S. Sun et al. Benchmarking Robustness of Text-Image Composed Retrieval. 2023.',
  'Z. Liu et al. Image Retrieval on Real-life Images with Pre-trained Vision-and-Language Models (CIRR). ICCV 2021.',
  'H. Wu et al. Fashion IQ: A New Dataset Towards Retrieving Images by Natural Language Feedback. CVPR 2021.',
  'M. J. Swain, D. H. Ballard. Color Indexing. IJCV 1991.',
  'T. Ojala, M. Pietikäinen, T. Mäenpää. Multiresolution Gray-Scale and Rotation Invariant Texture Classification with Local Binary Patterns. TPAMI 2002.',
  'D. Hasler, S. Süsstrunk. Measuring Colourfulness in Natural Images. SPIE Human Vision and Electronic Imaging, 2003.',
  'X. Hou, L. Zhang. Saliency Detection: A Spectral Residual Approach. CVPR 2007.',
  'D. Liu et al. When Image Denoising Meets High-Level Vision Tasks: A Deep Learning Approach. IJCAI 2018.',
  'R. C. Gonzalez, R. E. Woods. Digital Image Processing (bộ lọc miền tần số, phục hồi ảnh, cân bằng histogram).',
], 'refs'));
add(P('Giấy phép: mã nguồn SEARLE theo CC BY-NC 4.0; mọi thay đổi của nhóm liệt kê trong `SEARLE-main/CHANGES.md`. Ảnh minh hoạ lấy từ các bộ dữ liệu CIRR, FashionIQ, chỉ dùng cho mục đích học tập.'));

function Figure_pipeline() { return FIGURE('pipeline.png', 'Pipeline truy vấn của SEARLE (xanh) và hai phần xử lý ảnh nhóm thêm (cam).', 590); }
function Figure([file, text, w]) { return FIGURE(file, text, w); }

// ================================================================================================================
const numbering = { config: [
  { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 567, hanging: 283 } } } }] },
  ...['goals', 'demo', 'refs'].map((ref) => ({ reference: ref, levels: [{ level: 0, format: LevelFormat.DECIMAL,
    text: ref === 'refs' ? '[%1]' : '%1.', alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 567, hanging: 425 } } } }] })),
] };

const doc = new Document({
  creator: 'Nhóm XLA_SEARLE', title: 'Truy xuất ảnh kết hợp zero-shot với SEARLE',
  description: 'Báo cáo bài tập lớn môn Xử lý ảnh', features: { updateFields: true },
  styles: {
    default: { document: { run: { font: FONT, size: 26 }, paragraph: { spacing: { line: 300 } } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: FONT, size: 32, bold: true, color: '1F3864' },
        paragraph: { spacing: { before: 240, after: 240 }, keepNext: true, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: FONT, size: 28, bold: true, color: '1F3864' },
        paragraph: { spacing: { before: 240, after: 120 }, keepNext: true, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: FONT, size: 26, bold: true, italics: true },
        paragraph: { spacing: { before: 180, after: 80 }, keepNext: true, outlineLevel: 2 } },
    ],
  },
  numbering,
  sections: [
    { properties: { page: { size: { width: PAGE_W, height: 16838 },
      margin: { top: 1134, bottom: 1134, left: MARGIN_L, right: MARGIN_R } } }, children: cover },
    { properties: { page: { size: { width: PAGE_W, height: 16838 },
      margin: { top: 1134, bottom: 1134, left: MARGIN_L, right: MARGIN_R }, pageNumbers: { start: 1 } } },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
        children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 22 })] })] }) },
      children: body },
  ],
});

Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(OUT, buf); console.log('wrote', OUT, buf.length, 'bytes'); });
