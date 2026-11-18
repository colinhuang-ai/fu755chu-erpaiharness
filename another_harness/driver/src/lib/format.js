// =============================================================
// format.js — Các hàm định dạng dùng chung (giờ, tiền, điểm)
// Gom vào một chỗ để mọi màn hình hiển thị thống nhất kiểu Việt Nam.
// =============================================================

// "05:54" → 354 (số phút tính từ 00:00). Dùng để so sánh / tính toán giờ.
export function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

// 354 → "05:54"
export function toHHMM(totalMinutes) {
  const h = String(Math.floor(totalMinutes / 60)).padStart(2, '0')
  const m = String(totalMinutes % 60).padStart(2, '0')
  return `${h}:${m}`
}

// 198 → "03h 18m" (thời lượng làm việc)
export function formatDuration(totalMinutes) {
  const h = String(Math.floor(totalMinutes / 60)).padStart(2, '0')
  const m = String(totalMinutes % 60).padStart(2, '0')
  return `${h}h ${m}m`
}

// 1200000 → "1.200.000 ₫"
export function formatMoney(amount) {
  return `${amount.toLocaleString('vi-VN')} ₫`
}

// 89.46 → "89,5" (điểm KPI, 1 chữ số thập phân, dấu phẩy kiểu Việt Nam)
export function formatScore(score) {
  return score.toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

// Ngày trong tuần bằng tiếng Việt, theo Date.getDay() (0 = Chủ Nhật)
const WEEKDAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']

// (2026, 11, 2) → "Thứ Hai, 02/11/2026"
export function formatFullDate(year, month, day) {
  const d = new Date(year, month - 1, day)
  const dd = String(day).padStart(2, '0')
  const mm = String(month).padStart(2, '0')
  return `${WEEKDAYS[d.getDay()]}, ${dd}/${mm}/${year}`
}
