// =============================================================
// MonthCalendar — lịch tháng kiểu ứng dụng Lịch iOS
//   - Tuần bắt đầu từ Thứ Hai (T2 … CN)
//   - Mỗi ngày có chấm màu bên dưới theo trạng thái chấm công:
//       xanh lá = đến sớm · xanh dương = đúng giờ · đỏ = đi muộn · cam = về sớm
//     (một ngày có thể có 2 chấm: ví dụ vừa đúng giờ vừa về sớm)
//   - Ngày hôm nay: số màu đỏ
//   - Chạm vào ngày có dữ liệu → gọi onSelectDay(record)
// =============================================================
import { STATUS_META, getArrivalStatus, getDepartureStatus } from '../../lib/attendanceRules'
import Card from '../ui/Card'

const WEEKDAY_HEADERS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

export default function MonthCalendar({ year, month, today, records, selectedDay, onSelectDay }) {
  // ---------- Bước 1: tính số ngày và vị trí ngày mùng 1 ----------
  // new Date(year, month, 0) = ngày cuối của tháng `month` → lấy được số ngày
  const daysInMonth = new Date(year, month, 0).getDate()
  // getDay(): 0 = CN … 6 = T7. Đổi sang lịch bắt đầu từ T2: T2 = 0 … CN = 6
  const firstWeekday = (new Date(year, month - 1, 1).getDay() + 6) % 7

  // ---------- Bước 2: tạo mảng ô lịch (null = ô trống đầu tháng) ----------
  const cells = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  // ---------- Bước 3: tra nhanh bản ghi chấm công theo ngày ----------
  const recordByDay = Object.fromEntries(records.map((r) => [r.day, r]))

  // Trả về danh sách màu chấm cho 1 ngày
  const dotsFor = (record) => {
    if (!record) return []
    const dots = [STATUS_META[getArrivalStatus(record.clockIn).type].dot]
    if (getDepartureStatus(record.clockOut)?.type === 'earlyLeave') {
      dots.push(STATUS_META.earlyLeave.dot)
    }
    return dots
  }

  return (
    <Card className="p-space-md flex flex-col gap-2">
      {/* ---------- Tiêu đề tháng ---------- */}
      <h3 className="text-headline">
        Tháng {month} <span className="text-error">{year}</span>
      </h3>

      {/* ---------- Hàng tên thứ ---------- */}
      <div className="grid grid-cols-7 text-center">
        {WEEKDAY_HEADERS.map((w) => (
          <span key={w} className="text-caption-2 text-on-surface-variant">
            {w}
          </span>
        ))}
      </div>

      {/* ---------- Lưới ngày ---------- */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          // Ô trống đầu tháng
          if (day === null) return <span key={`empty-${i}`} />

          const record = recordByDay[day]
          const isToday = day === today
          const isSelected = day === selectedDay
          const isFuture = day > today
          const isSunday = (firstWeekday + day - 1) % 7 === 6

          // Màu số ngày: đang chọn > hôm nay (đỏ) > ngày tương lai / CN (xám) > thường
          let numberClass = 'text-on-surface'
          if (isSelected) numberClass = isToday ? 'bg-error text-on-error' : 'bg-on-surface text-surface'
          else if (isToday) numberClass = 'text-error font-semibold'
          else if (isFuture || isSunday) numberClass = 'text-outline'

          return (
            <button
              key={day}
              type="button"
              disabled={!record}
              onClick={() => onSelectDay(record)}
              aria-label={`Ngày ${day}${record ? '' : ', không có dữ liệu'}`}
              className="h-11 flex flex-col items-center justify-start gap-0.5 disabled:cursor-default"
            >
              {/* Số ngày trong vòng tròn (vòng tròn chỉ hiện khi được chọn) */}
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-callout tabular-nums transition-colors ${numberClass}`}
              >
                {day}
              </span>

              {/* Chấm trạng thái */}
              <span className="flex gap-0.5 h-1.5">
                {dotsFor(record).map((dot, j) => (
                  <span key={j} className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                ))}
              </span>
            </button>
          )
        })}
      </div>

      {/* ---------- Chú thích màu ---------- */}
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 pt-2 border-t border-surface-container">
        {Object.values(STATUS_META).map((meta) => (
          <span
            key={meta.label}
            className="flex items-center gap-1 text-caption-1 text-on-surface-variant"
          >
            <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
            {meta.label}
          </span>
        ))}
      </div>
    </Card>
  )
}
