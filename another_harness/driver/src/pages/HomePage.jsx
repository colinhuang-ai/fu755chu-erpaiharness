// =============================================================
// HomePage — màn hình "Hôm Nay" của tài xế
// Trang này chỉ SẮP XẾP các khối theo thứ tự từ trên xuống,
// còn chi tiết từng khối nằm trong thư mục components/home/.
//
// Thứ tự hiển thị:
//   1. ShiftCard        — chấm công / ca làm
//   2. CurrentTripCard  — chuyến đang chạy
//   3. StatsGrid        — 4 chỉ số nhanh
//   4. AlertsList       — việc cần chú ý & an toàn
//   5. QuickActions     — lối tắt tác vụ
// =============================================================
import ShiftCard from '../components/home/ShiftCard'
import CurrentTripCard from '../components/home/CurrentTripCard'
import StatsGrid from '../components/home/StatsGrid'
import AlertsList from '../components/home/AlertsList'
import QuickActions from '../components/home/QuickActions'
import { formatScore } from '../lib/format'
import { shift, stats, alerts, quickActions } from '../data/mockData'

export default function HomePage({
  trip,
  todayRecord,
  kpi,
  onClockOut,
  onArrive,
  onQuickAction,
  notify,
}) {
  // Thẻ "Điểm KPI tháng" lấy số THẬT từ computeKpi() thay vì số cố định trong mock,
  // để Hôm nay và tab Chấm công luôn hiển thị cùng một điểm.
  const liveStats = stats.map((s) =>
    s.id === 'kpi'
      ? { ...s, value: formatScore(kpi.total), progress: kpi.total, note: `Hạng ${kpi.tier.name}` }
      : s,
  )

  return (
    <div className="flex flex-col gap-space-lg">
      {/* 1. Thẻ ca làm — bấm "Ra ca" sẽ mở cảnh báo */}
      <ShiftCard shift={shift} record={todayRecord} onClockOut={onClockOut} />

      {/* 2. Thẻ chuyến hiện tại */}
      <CurrentTripCard
        trip={trip}
        onNavigate={() => notify('Đang mở bản đồ dẫn đường…')}
        onArrive={onArrive}
      />

      {/* 3. Lưới chỉ số */}
      <StatsGrid stats={liveStats} />

      {/* 4. Danh sách cảnh báo */}
      <AlertsList
        alerts={alerts}
        onAction={(alert, action) => notify(`${action.label}: ${alert.title}`)}
      />

      {/* 5. Lối tắt */}
      <QuickActions actions={quickActions} onAction={onQuickAction} />
    </div>
  )
}
