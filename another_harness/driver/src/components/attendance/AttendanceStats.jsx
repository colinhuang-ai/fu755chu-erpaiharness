// =============================================================
// AttendanceStats — 4 ô số liệu tháng: Ngày công · Đến sớm · Đi muộn · Về sớm
// Nhận `summary` đã tính sẵn từ summarizeMonth() trong lib/attendanceRules.js
// =============================================================
import Card from '../ui/Card'

export default function AttendanceStats({ summary }) {
  // ---------- Cấu hình 4 ô: nhãn, giá trị, màu số ----------
  const items = [
    { label: 'Ngày công', value: summary.workDays, color: 'text-on-surface' },
    { label: 'Đến sớm', value: summary.early, color: 'text-secondary' },
    { label: 'Đi muộn', value: summary.late, color: 'text-error' },
    { label: 'Về sớm', value: summary.earlyLeave, color: 'text-tertiary' },
  ]

  return (
    // 4 cột bằng nhau, ngăn cách bằng đường kẻ mảnh (divide-x)
    <Card className="grid grid-cols-4 divide-x divide-surface-container py-3">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-0.5">
          <span className={`font-display text-title-2 tabular-nums ${item.color}`}>
            {item.value}
          </span>
          <span className="text-caption-1 text-on-surface-variant">{item.label}</span>
        </div>
      ))}
    </Card>
  )
}
