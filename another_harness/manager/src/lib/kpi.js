// =============================================================
// kpi.js — Tính điểm KPI tổng của lái xe theo trọng số trong Cấu hình
// Đổi trọng số ở màn Cấu hình → bảng xếp hạng KPI đội tự tính lại.
// =============================================================

// ---------- Danh sách chỉ tiêu (thứ tự hiển thị) ----------
export const KPI_CRITERIA = [
  { id: 'attendance', name: 'Chuyên cần' },
  { id: 'onTime', name: 'Giao đúng hẹn' },
  { id: 'loss', name: 'Hao hụt' },
  { id: 'safety', name: 'An toàn' },
  { id: 'fuel', name: 'Tiêu hao nhiên liệu' },
  { id: 'compliance', name: 'Tuân thủ quy trình' },
]

// ---------- Bậc xếp loại & thưởng (specs mục 6) ----------
export const KPI_TIERS = [
  { min: 90, name: 'Xuất sắc', bonus: 2_000_000, className: 'bg-secondary-container/40 text-on-secondary-container' },
  { min: 80, name: 'Tốt', bonus: 1_200_000, className: 'bg-primary-fixed text-on-primary-fixed' },
  { min: 70, name: 'Khá', bonus: 600_000, className: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' },
  { min: 0, name: 'Cần cải thiện', bonus: 0, className: 'bg-error-container text-on-error-container' },
]

// ---------- Tổng điểm = Σ (điểm chỉ tiêu × trọng số %) ----------
export function totalScore(kpi, weights) {
  const sum = KPI_CRITERIA.reduce((acc, c) => acc + (kpi[c.id] * weights[c.id]) / 100, 0)
  return Math.round(sum * 10) / 10
}

// ---------- Tìm bậc xếp loại theo tổng điểm ----------
export const tierOf = (score) => KPI_TIERS.find((t) => score >= t.min)
