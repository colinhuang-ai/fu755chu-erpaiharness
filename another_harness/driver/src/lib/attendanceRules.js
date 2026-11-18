// =============================================================
// attendanceRules.js — Quy tắc chấm công (theo specs/prompt-driveros.md mục 6)
//
//   Ca làm:     06:00 – 15:00, dung sai ±5 phút
//   Đến sớm:    vào TRƯỚC 05:55
//   Đúng giờ:   vào từ 05:55 đến 06:05
//   Đi muộn:    vào SAU 06:05
//   Về sớm:     ra TRƯỚC 14:55
//
// Trạng thái từng ngày được TÍNH từ giờ vào/ra, không gõ tay trong dữ liệu.
// Muốn đổi chính sách chỉ cần sửa object SHIFT bên dưới.
// =============================================================
import { toMinutes } from './format'

// ---------- Cấu hình ca làm ----------
export const SHIFT = {
  start: '06:00',
  end: '15:00',
  toleranceMinutes: 5,
}

// ---------- Thông tin hiển thị của từng trạng thái ----------
// dot: màu chấm dưới ngày trên lịch; text/bg: màu chữ / nền nhãn
export const STATUS_META = {
  early: { label: 'Đến sớm', dot: 'bg-secondary', text: 'text-secondary', bg: 'bg-secondary-container/30' },
  ontime: { label: 'Đúng giờ', dot: 'bg-primary', text: 'text-primary', bg: 'bg-primary-fixed' },
  late: { label: 'Đi muộn', dot: 'bg-error', text: 'text-error', bg: 'bg-error-container' },
  earlyLeave: { label: 'Về sớm', dot: 'bg-warning', text: 'text-tertiary', bg: 'bg-tertiary-fixed' },
}

// ---------- Trạng thái lúc VÀO ca ----------
// Trả về { type: 'early' | 'ontime' | 'late', diff: số phút lệch so với 06:00 }
export function getArrivalStatus(clockIn) {
  const start = toMinutes(SHIFT.start)
  const actual = toMinutes(clockIn)
  const diff = Math.abs(actual - start)

  if (actual < start - SHIFT.toleranceMinutes) return { type: 'early', diff }
  if (actual > start + SHIFT.toleranceMinutes) return { type: 'late', diff }
  return { type: 'ontime', diff }
}

// ---------- Trạng thái lúc RA ca ----------
// Chưa ra ca → null. Ra trước 14:55 → 'earlyLeave'. Còn lại → 'normal'.
export function getDepartureStatus(clockOut) {
  if (!clockOut) return null
  const end = toMinutes(SHIFT.end)
  const actual = toMinutes(clockOut)

  if (actual < end - SHIFT.toleranceMinutes) return { type: 'earlyLeave', diff: end - actual }
  return { type: 'normal', diff: 0 }
}

// ---------- Nhãn ngắn cho thẻ chấm công: "Sớm 6 phút" / "Đúng giờ" / "Muộn 12 phút" ----------
export function arrivalLabel(clockIn) {
  const { type, diff } = getArrivalStatus(clockIn)
  if (type === 'early') return `Đến sớm ${diff} phút`
  if (type === 'late') return `Muộn ${diff} phút`
  return 'Đúng giờ'
}

// ---------- Ngày này có cần giải trình không? (đi muộn hoặc về sớm) ----------
export function needsExplanation(record) {
  return (
    getArrivalStatus(record.clockIn).type === 'late' ||
    getDepartureStatus(record.clockOut)?.type === 'earlyLeave'
  )
}

// ---------- Tổng hợp cả tháng → 4 số liệu trên màn Bảng công ----------
export function summarizeMonth(records) {
  const summary = { workDays: 0, early: 0, late: 0, earlyLeave: 0 }

  records.forEach((r) => {
    summary.workDays += 1
    const arrival = getArrivalStatus(r.clockIn).type
    if (arrival === 'early') summary.early += 1
    if (arrival === 'late') summary.late += 1
    if (getDepartureStatus(r.clockOut)?.type === 'earlyLeave') summary.earlyLeave += 1
  })

  return summary
}

// ---------- Đếm số lần vi phạm CHƯA được duyệt giải trình (dùng cho KPI Chuyên cần) ----------
export function countUnexcusedViolations(records) {
  return records.filter((r) => needsExplanation(r) && r.explanation?.status !== 'approved')
    .length
}
