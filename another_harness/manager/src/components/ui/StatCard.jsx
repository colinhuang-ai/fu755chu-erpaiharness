// =============================================================
// StatCard — ô số liệu nhanh trên trang Tổng quan
//   label: tên chỉ số · value: số lớn · hint: dòng phụ bên dưới
//   icon + tone: icon tròn có màu ('primary' | 'secondary' | 'tertiary' | 'error')
//   onClick: (tuỳ chọn) bấm để chuyển tới màn liên quan
// =============================================================
import Icon from './Icon'

const TONE = {
  primary: 'bg-primary-fixed text-primary',
  secondary: 'bg-secondary-container/40 text-on-secondary-container',
  tertiary: 'bg-tertiary-fixed text-on-tertiary-fixed',
  error: 'bg-error-container text-error',
}

export default function StatCard({ label, value, hint, icon, tone = 'primary', onClick }) {
  // Có onClick thì vẽ thành <button> để bấm được bằng bàn phím
  const Tag = onClick ? 'button' : 'div'

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className="text-left bg-surface-container-lowest rounded-xl border border-surface-container shadow-sm p-4 flex items-start gap-3 hover:border-outline-variant transition-colors"
    >
      {/* Icon tròn bên trái */}
      <span className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${TONE[tone]}`}>
        <Icon name={icon} size={22} />
      </span>

      {/* Số liệu */}
      <div className="min-w-0">
        <div className="text-footnote text-on-surface-variant">{label}</div>
        <div className="font-display text-title-2 tabular-nums">{value}</div>
        {hint && <div className="text-caption-1 text-on-surface-variant">{hint}</div>}
      </div>
    </Tag>
  )
}
