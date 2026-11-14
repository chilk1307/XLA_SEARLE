"""Figures for the report that do not exist yet (numbers from the team's runs, see the comments)."""
from pathlib import Path

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyArrowPatch, FancyBboxPatch

OUT = Path(__file__).parent / 'figures'
OUT.mkdir(exist_ok=True)
BLUE, ORANGE = '#2a78d6', '#eb6834'
INK, INK2, MUTED, GRID, AXIS, SURF = '#0b0b0b', '#52514e', '#898781', '#e1e0d9', '#c3c2b7', '#ffffff'
plt.rcParams.update({'font.family': 'DejaVu Sans', 'font.size': 10, 'axes.edgecolor': AXIS, 'axes.labelcolor': INK2,
                     'xtick.color': INK2, 'ytick.color': INK2, 'axes.spines.top': False, 'axes.spines.right': False,
                     'figure.facecolor': SURF, 'axes.facecolor': SURF, 'savefig.dpi': 200})

# -- E3.1, CIRR val R@1 change (D5, Doanh, 10/11; clean phi_B32 = 25.50) ---------------------------------------------
E31 = {'nhiễu Gauss': (-0.765, -1.005), 'nhiễu muối tiêu': (-0.789, -2.033), 'mờ Gauss': (-0.431, -0.359),
       'mờ chuyển động': (-1.005, -2.798), 'nén JPEG': (-0.861, -1.555), 'thiếu sáng': (-0.741, -2.248),
       'độ phân giải thấp': (-0.096, -0.383), 'lệch màu': (-0.622, -0.718)}
names = sorted(E31, key=lambda k: E31[k][1])
fig, ax = plt.subplots(figsize=(7.2, 4.0))
y = range(len(names))
h = 0.36
ax.barh([i - h / 2 - 0.01 for i in y], [E31[n][0] for n in names], height=h, color=BLUE, label='mức 1 (nhẹ)')
ax.barh([i + h / 2 + 0.01 for i in y], [E31[n][1] for n in names], height=h, color=ORANGE, label='mức 2 (nặng)')
for i, n in enumerate(names):
    ax.text(E31[n][1] - 0.05, i + h / 2, f"{E31[n][1]:+.2f}", va='center', ha='right', fontsize=8, color=INK)
ax.set_yticks(list(y))
ax.set_yticklabels(names)
ax.invert_yaxis()
ax.axvline(0, color=AXIS, lw=1)
ax.set_xlim(-3.4, 0.2)
ax.grid(axis='x', color=GRID, lw=0.6)
ax.set_axisbelow(True)
ax.set_xlabel('Thay đổi R@1 so với ảnh sạch (điểm %; ảnh sạch 25,50)')
ax.legend(frameon=False, loc='lower left', fontsize=9)
fig.tight_layout()
fig.savefig(OUT / 'e31_drop.png')
plt.close(fig)

# -- E3.2, R@1 gain of each restoration over "no restoration" and the PSNR gain (D8, Doanh, 13/11) --------------------
E32 = [('nhiễu Gauss · bilateral', 0.14, 5.4), ('nhiễu Gauss · Gaussian', -0.17, 6.3), ('nhiễu Gauss · NLM', -0.65, 5.8),
       ('muối tiêu · median', 1.72, 16.1), ('mờ Gauss · unsharp', 0.17, 1.0), ('mờ Gauss · Wiener', -0.19, 2.5),
       ('mờ Gauss · Richardson-Lucy', -0.22, 2.0), ('mờ chuyển động · Wiener', 1.87, 3.2),
       ('mờ chuyển động · Richardson-Lucy', 1.67, 2.8), ('JPEG · bilateral', 0.38, 0.6), ('JPEG · deblock', 0.24, 0.2),
       ('thiếu sáng · gamma', 0.79, 3.3), ('thiếu sáng · Retinex', 0.55, 0.8), ('thiếu sáng · CLAHE', 0.26, 1.9),
       ('thiếu sáng · cân bằng histogram', -0.17, 2.3), ('phân giải thấp · unsharp', 0.07, 0.3),
       ('lệch màu · white patch', 0.14, 3.8), ('lệch màu · gray world', 0.07, 7.4)]
fig, (ax, ax2) = plt.subplots(1, 2, figsize=(8.6, 5.6), sharey=True, gridspec_kw={'width_ratios': [3, 2]})
labels = [e[0] for e in E32]
yy = range(len(E32))
ax.barh(list(yy), [e[1] for e in E32], height=0.62, color=BLUE)
for i, e in enumerate(E32):
    ax.text(e[1] + (0.05 if e[1] >= 0 else -0.05), i, f"{e[1]:+.2f}", va='center',
            ha='left' if e[1] >= 0 else 'right', fontsize=7.5, color=INK)
ax.axvline(0, color=AXIS, lw=1)
ax.set_xlim(-1.1, 2.4)
ax.set_yticks(list(yy))
ax.set_yticklabels(labels, fontsize=8.5)
ax.invert_yaxis()
ax.grid(axis='x', color=GRID, lw=0.6)
ax.set_axisbelow(True)
ax.set_xlabel('Thay đổi R@1 do phục hồi (điểm %)')
ax2.barh(list(yy), [e[2] for e in E32], height=0.62, color=ORANGE)
for i, e in enumerate(E32):
    ax2.text(e[2] + 0.3, i, f"+{e[2]:.1f}", va='center', fontsize=7.5, color=INK)
ax2.set_xlim(0, 19)
ax2.grid(axis='x', color=GRID, lw=0.6)
ax2.set_axisbelow(True)
ax2.set_xlabel('Tăng PSNR (dB)')
ax2.tick_params(axis='y', length=0)
fig.tight_layout()
fig.savefig(OUT / 'e32_restoration.png')
plt.close(fig)

# -- E3.5, frequency filters on clean images (D6, Doanh, 10/11) ---------------------------------------------------------
radii = [0.05, 0.1, 0.2, 0.3, 0.5]
low = [23.535, 25.401, 25.281, 25.257, 25.305]
high = [20.928, 19.804, 18.847, 18.010, 17.819]
fig, ax = plt.subplots(figsize=(6.2, 3.6))
ax.axhline(25.50, color=MUTED, lw=1, ls=(0, (4, 3)))
ax.text(0.505, 25.62, 'ảnh sạch 25,50', ha='right', fontsize=8, color=INK2)
ax.plot(radii, low, color=BLUE, lw=2, marker='o', ms=6, label='thông thấp (giữ tần số thấp)')
ax.plot(radii, high, color=ORANGE, lw=2, marker='s', ms=6, label='thông cao (giữ tần số cao)')
ax.text(0.5, low[-1] - 0.55, 'thông thấp', color=INK, fontsize=8.5, ha='right')
ax.text(0.5, high[-1] + 0.35, 'thông cao', color=INK, fontsize=8.5, ha='right')
ax.set_xlabel('Bán kính cắt (tỉ lệ tần số Nyquist)')
ax.set_ylabel('CIRR val R@1 (%)')
ax.set_xticks(radii)
ax.set_ylim(16.5, 26.5)
ax.grid(axis='y', color=GRID, lw=0.6)
ax.set_axisbelow(True)
ax.legend(frameon=False, fontsize=8.5, loc='center right')
fig.tight_layout()
fig.savefig(OUT / 'e35_frequency.png')
plt.close(fig)

# -- Pipeline diagram ---------------------------------------------------------------------------------------------------
fig, ax = plt.subplots(figsize=(9.2, 3.4))
ax.set_xlim(0, 100)
ax.set_ylim(0, 36)
ax.axis('off')


def box(x, y, w, h, text, fill='#e8f0fb', edge=BLUE, size=8.5):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle='round,pad=0.4,rounding_size=1.2', fc=fill, ec=edge, lw=1.2))
    ax.text(x + w / 2, y + h / 2, text, ha='center', va='center', fontsize=size, color=INK, wrap=True)


def arrow(x1, y1, x2, y2):
    ax.add_patch(FancyArrowPatch((x1, y1), (x2, y2), arrowstyle='-|>', mutation_scale=11, color=INK2, lw=1.1))


ORANGE_SOFT = '#fde9e0'
box(1, 24, 13, 8, 'Ảnh tham chiếu', fill='#f4f4f1', edge=AXIS)
box(18, 24, 15, 8, 'Làm xấu → ước lượng\n→ phục hồi (03)', fill=ORANGE_SOFT, edge=ORANGE)
box(37, 24, 13, 8, 'CLIP\nmã hoá ảnh')
box(54, 24, 12, 8, 'φ (MLP)\n→ pseudo-token $')
box(70, 24, 16, 8, '"a photo of $ that\n{mô tả}" → CLIP chữ')
box(89, 24, 10, 8, 'Vector\ntruy vấn')
for (a, b) in [(14.5, 18), (33.5, 37), (50.5, 54), (66.5, 70), (86.5, 89)]:
    arrow(a, 28, b, 28)
box(1, 4, 13, 8, 'Mô tả thay đổi', fill='#f4f4f1', edge=AXIS)
arrow(7.5, 12.5, 76, 23.5)
box(37, 4, 22, 8, 'Gallery: CLIP mã hoá ảnh\n(tính trước, lưu cache)')
box(64, 4, 16, 8, 'Cosine → xếp hạng\ntop-K')
box(84, 4, 15, 8, 'Xếp hạng lại theo\nthuộc tính đo (02)', fill=ORANGE_SOFT, edge=ORANGE)
arrow(59.5, 8, 64, 8)
arrow(94, 23.5, 72, 12.5)
arrow(80.5, 8, 84, 8)
ax.text(1, 34.5, 'Xanh: SEARLE gốc (OTI chưng cất vào φ).  Cam: phần xử lý ảnh nhóm thêm.', fontsize=8, color=INK2)
fig.tight_layout()
fig.savefig(OUT / 'pipeline.png')
plt.close(fig)
print(sorted(p.name for p in OUT.iterdir()))
