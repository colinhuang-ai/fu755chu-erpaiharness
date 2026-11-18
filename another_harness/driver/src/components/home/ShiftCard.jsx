// =============================================================
// ShiftCard — thẻ "Trạng thái ca làm" (chấm công hôm nay)
// Dùng ở cả trang Hôm nay và tab Chấm công.
// Hiển thị: giờ vào ca + nhãn sớm/đúng giờ/muộn, thời gian làm (tự tăng theo
// đồng hồ giả lập), vị trí GPS, và nút "Ra ca & Bàn giao xe".
//
// Props:
//   shift      — thông tin ca (ngày, giờ tiêu chuẩn, vị trí GPS)
//   record     — bản ghi chấm công hôm nay { clockIn, clockOut }
//   onClockOut — gọi khi bấm nút Ra ca
// =============================================================
import Card from '../ui/Card'
import Icon from '../ui/Icon'
import useClock from '../../hooks/useClock'
import { arrivalLabel, getArrivalStatus, STATUS_META } from '../../lib/attendanceRules'
import { formatDuration, toMinutes } from '../../lib/format'

export default function ShiftCard({ shift, record, onClockOut }) {
  // ---------- Đồng hồ giả lập (tự cập nhật mỗi giây) ----------
  const now = useClock()
  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  // ---------- Tính thời gian làm ----------
  // Đã ra ca → (giờ ra − giờ vào). Chưa ra ca → (bây giờ − giờ vào), tự tăng.
  const clockedOut = Boolean(record.clockOut)
  const endMinutes = clockedOut ? toMinutes(record.clockOut) : nowMinutes
  const workedMinutes = Math.max(0, endMinutes - toMinutes(record.clockIn))

  // Màu nhãn "Đến sớm / Đúng giờ / Muộn" lấy theo quy tắc chấm công
  const arrivalMeta = STATUS_META[getArrivalStatus(record.clockIn).type]

  return (
    <Card className="p-space-md flex flex-col gap-space-md">
      {/* ---------- Hàng tiêu đề: chấm trạng thái + nhãn đến sớm/muộn ---------- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Chấm xanh nhấp nháy khi đang trong ca, xám khi đã ra ca */}
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              clockedOut ? 'bg-outline' : 'bg-secondary animate-pulse'
            }`}
          />
          <span className="text-caption-2 uppercase tracking-wider text-on-surface-variant">
            Trạng thái ca làm
          </span>
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${arrivalMeta.bg} ${arrivalMeta.text}`}
        >
          <Icon name="timer" size={14} />
          <span className="text-caption-1 font-semibold">{arrivalLabel(record.clockIn)}</span>
        </div>
      </div>

      {/* ---------- Khối 2 cột: Giờ vào ca | Thời gian thực tế ---------- */}
      <div className="grid grid-cols-2 gap-space-sm items-center bg-surface-container-low p-space-md rounded-lg">
        {/* Cột trái: giờ vào ca */}
        <div className="flex flex-col">
          <span className="text-caption-1 text-on-surface-variant">Giờ vào ca</span>
          <span className="font-display text-title-2 tabular-nums">{record.clockIn}</span>
          <span className="text-caption-2 text-on-surface-variant mt-0.5">{shift.date}</span>
        </div>

        {/* Cột phải: thời gian làm (đang đếm hoặc đã chốt) */}
        <div className="flex flex-col pl-2">
          <span className="text-caption-1 text-on-surface-variant">Thời gian thực tế</span>
          <div className="flex items-baseline gap-1 flex-wrap">
            <span className="font-display text-title-2 text-primary tabular-nums">
              {formatDuration(workedMinutes)}
            </span>
            {clockedOut ? (
              <span className="text-caption-2 text-on-surface-variant">Ra lúc {record.clockOut}</span>
            ) : (
              <span className="text-caption-2 text-secondary font-bold">● Đang tính</span>
            )}
          </div>
          <span className="text-caption-2 text-on-surface-variant mt-0.5">
            Tiêu chuẩn: {String(shift.standardHours).padStart(2, '0')}h00m
          </span>
        </div>
      </div>

      {/* ---------- Dòng xác thực vị trí GPS ---------- */}
      <div className="flex items-center justify-between bg-surface-container/50 px-3 py-2 rounded-lg">
        <div className="flex items-center gap-2 min-w-0">
          <Icon name="verified_user" size={18} className="text-secondary" />
          <span className="text-footnote font-medium truncate">{shift.location}</span>
        </div>
        {shift.gpsValid && (
          <span className="text-caption-2 text-secondary shrink-0">Hợp lệ</span>
        )}
      </div>

      {/* ---------- Nút Ra ca: bấm sẽ mở hộp xác nhận (do App quản lý) ---------- */}
      <button
        type="button"
        onClick={onClockOut}
        disabled={clockedOut}
        className="w-full h-11 rounded-lg bg-surface-container-high text-error text-headline flex items-center justify-center gap-2 active:opacity-75 transition disabled:text-on-surface-variant disabled:opacity-60"
      >
        <Icon name={clockedOut ? 'check_circle' : 'logout'} size={20} />
        <span>{clockedOut ? 'Đã ra ca hôm nay' : 'Ra ca & Bàn giao xe'}</span>
      </button>
    </Card>
  )
}
