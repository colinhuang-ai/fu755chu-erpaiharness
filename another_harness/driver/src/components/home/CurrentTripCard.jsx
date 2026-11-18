// =============================================================
// CurrentTripCard — thẻ "Chuyến đang chạy"
// Ghép từ các khối con:
//   1. Header chuyến (trạng thái, mã chuyến, biển số, giờ hẹn giao)
//   2. TankCompartments  — tải trọng từng khoang bồn
//   3. RouteTimeline     — lộ trình đi → đến
//   4. ProgressSteps     — tiến độ 5 bước
//   5. 2 nút hành động   — Bản đồ / Cập nhật đến trạm
// =============================================================
import Card from '../ui/Card'
import Icon from '../ui/Icon'
import TankCompartments from './TankCompartments'
import RouteTimeline from './RouteTimeline'
import ProgressSteps from './ProgressSteps'

export default function CurrentTripCard({ trip, onNavigate, onArrive }) {
  return (
    <Card className="p-space-md flex flex-col gap-space-md overflow-hidden">
      {/* ---------- 1. Header chuyến ---------- */}
      <div className="flex items-start justify-between gap-2">
        {/* Bên trái: badge trạng thái + mã chuyến + biển số */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-caption-2 uppercase font-bold tracking-wide">
              {trip.status}
            </span>
            <span className="text-footnote text-on-surface-variant font-mono">
              #{trip.code}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-display text-title-3 font-bold tabular-nums">{trip.plate}</span>
            <span className="text-footnote text-on-surface-variant">• {trip.capacity}</span>
          </div>
        </div>

        {/* Bên phải: giờ hẹn giao + thời gian còn lại */}
        <div className="flex flex-col items-end shrink-0">
          <span className="text-caption-2 text-on-surface-variant">Hẹn giao</span>
          <span className="text-headline text-primary font-bold tabular-nums">{trip.eta}</span>
          <span className="text-caption-1 text-tertiary">{trip.remaining}</span>
        </div>
      </div>

      {/* ---------- 2. Khoang bồn ---------- */}
      <TankCompartments compartments={trip.compartments} seals={trip.seals} />

      {/* ---------- 3. Lộ trình ---------- */}
      <RouteTimeline route={trip.route} />

      {/* ---------- 4. Tiến độ quy trình ---------- */}
      <ProgressSteps steps={trip.steps} current={trip.currentStep} />

      {/* ---------- 5. Nút hành động ---------- */}
      <div className="grid grid-cols-2 gap-2 mt-1">
        {/* Nút phụ: mở bản đồ dẫn đường */}
        <button
          type="button"
          onClick={onNavigate}
          className="h-11 rounded-lg bg-surface-container-high text-footnote font-semibold flex items-center justify-center gap-1.5 active:opacity-75 transition"
        >
          <Icon name="navigation" size={18} />
          <span>Bản đồ dẫn đường</span>
        </button>

        {/* Nút chính: báo đã đến trạm → chuyển sang bước tiếp theo */}
        <button
          type="button"
          onClick={onArrive}
          className="h-11 rounded-lg bg-primary text-on-primary text-footnote font-semibold flex items-center justify-center gap-1.5 shadow-sm active:opacity-75 transition"
        >
          <Icon name="assignment_turned_in" size={18} />
          <span>Cập nhật đến trạm</span>
        </button>
      </div>
    </Card>
  )
}
