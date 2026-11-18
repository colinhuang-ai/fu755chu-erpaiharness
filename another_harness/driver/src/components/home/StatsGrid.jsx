// =============================================================
// StatsGrid — lưới 2x2 các thẻ chỉ số nhanh (kiểu "Bento" của app Sức khoẻ iOS)
// Gồm: Đã giao hôm nay, KPI tháng, Thu nhập tạm tính, Giờ học an toàn.
// Mỗi thẻ được vẽ bởi component con StatCard bên dưới.
// =============================================================
import Card from '../ui/Card'
import Icon from '../ui/Icon'
import SectionHeader from '../ui/SectionHeader'

// ---------- Thẻ chỉ số đơn lẻ ----------
function StatCard({ stat }) {
  return (
    <Card as="div" className="p-space-md flex flex-col justify-between h-32">
      {/* Hàng trên: tên chỉ số + icon */}
      <div className="flex items-center justify-between">
        <span className="text-caption-1 text-on-surface-variant">{stat.label}</span>
        <Icon name={stat.icon} size={20} className={stat.iconColor} />
      </div>

      {/* Giữa: giá trị lớn + đơn vị + ghi chú */}
      <div>
        <div className="font-display text-title-2 leading-tight tabular-nums">
          {stat.value}{' '}
          <span className="text-footnote font-normal text-on-surface-variant">{stat.unit}</span>
        </div>
        <span className={`text-caption-2 font-medium ${stat.noteColor}`}>{stat.note}</span>
      </div>

      {/* Dưới: thanh tiến độ (độ dài = stat.progress %) */}
      <div
        className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden"
        role="progressbar"
        aria-valuenow={stat.progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={stat.label}
      >
        <div
          className={`h-full rounded-full ${stat.barColor}`}
          style={{ width: `${stat.progress}%` }}
        />
      </div>
    </Card>
  )
}

// ---------- Cả khối: tiêu đề + lưới 2 cột ----------
export default function StatsGrid({ stats }) {
  return (
    <section className="flex flex-col gap-2">
      <SectionHeader
        title="Chỉ số hôm nay & Tháng 11"
        right={
          <button type="button" className="text-caption-2 font-medium text-primary">
            Chi tiết
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-space-sm">
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>
    </section>
  )
}
