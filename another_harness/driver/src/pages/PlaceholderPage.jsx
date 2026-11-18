// =============================================================
// PlaceholderPage — trang tạm cho các tab chưa làm
// (Công việc, Chấm công, Tài chính, Học tập)
// Khi làm thật, thay file này bằng trang riêng cho từng tab.
// =============================================================
import Card from '../components/ui/Card'
import Icon from '../components/ui/Icon'

export default function PlaceholderPage({ tab }) {
  return (
    <Card className="p-space-xl flex flex-col items-center text-center gap-3 mt-6">
      {/* Icon lớn của tab */}
      <div className="w-16 h-16 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
        <Icon name={tab.icon} size={32} />
      </div>

      {/* Tên tab + ghi chú */}
      <h2 className="font-display text-title-3">{tab.label}</h2>
      <p className="text-footnote text-on-surface-variant">
        Màn hình này đang được thiết kế. Quay lại tab “Hôm nay” để xem prototype.
      </p>
    </Card>
  )
}
