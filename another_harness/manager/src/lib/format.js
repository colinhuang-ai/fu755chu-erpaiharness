// =============================================================
// format.js — Định dạng hiển thị kiểu Việt Nam + tính ngày
// =============================================================

// '2026-11-30' → '30/11/2026'
export function formatDate(iso) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

// Số ngày từ `fromIso` đến `toIso` (âm = đã qua). Dùng UTC để không lệch múi giờ.
export function daysBetween(fromIso, toIso) {
  const toUtc = (iso) => {
    const [y, m, d] = iso.split('-').map(Number)
    return Date.UTC(y, m - 1, d)
  }
  return Math.round((toUtc(toIso) - toUtc(fromIso)) / 86_400_000)
}

// 1784000 → '1.784.000 ₫'
export const formatMoney = (n) => `${n.toLocaleString('vi-VN')} ₫`

// 18000 → '18.000'
export const formatNumber = (n) => n.toLocaleString('vi-VN')

// 89.46 → '89,5'
export const formatScore = (n) =>
  n.toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

// Khối lượng hàng theo loại chuyến: xe bồn tính lít, xe tải tính phuy
export const formatQuantity = (trip) =>
  trip.cargoType === 'drum'
    ? `${formatNumber(trip.quantity)} phuy`
    : `${formatNumber(trip.quantity)} L`

// 'Nguyễn Văn Hùng' → 'NH' (chữ cái đầu họ + tên, dùng cho avatar)
export function initials(name) {
  const parts = name.trim().split(/\s+/)
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
