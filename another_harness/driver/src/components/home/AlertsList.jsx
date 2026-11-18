// =============================================================
// AlertsList — danh sách "Cần chú ý & An toàn"
// Mỗi mục có 3 mức độ (level) với giao diện khác nhau:
//   critical → nền đỏ nhạt, tiêu đề đỏ, có nút hành động (ví dụ: chứng chỉ ADR sắp hết hạn)
//   warning  → icon cam, có mũi tên ">" để mở chi tiết (ví dụ: khoá học PCCC)
//   ok       → icon xanh, dấu tích ✓ (ví dụ: đã kiểm tra xe)
// =============================================================
import Card from '../ui/Card'
import Icon from '../ui/Icon'
import SectionHeader from '../ui/SectionHeader'

// ---------- Bảng style theo mức độ — chỉnh màu ở đây là đổi cho toàn bộ ----------
const LEVEL_STYLE = {
  critical: {
    row: 'bg-error-container/20',
    iconWrap: 'bg-error-container text-error',
    title: 'text-error font-bold',
    badge: 'px-2 py-0.5 rounded-full bg-error text-on-error text-[10px] font-bold',
  },
  warning: {
    row: 'bg-surface-container-low/40',
    iconWrap: 'bg-tertiary-fixed text-on-tertiary-fixed',
    title: 'font-semibold',
    badge:
      'px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-bold',
  },
  ok: {
    row: '',
    iconWrap: 'bg-secondary-container/40 text-on-secondary-container',
    title: 'font-semibold',
    badge: 'text-caption-2 text-secondary',
  },
}

// ---------- Một dòng cảnh báo ----------
function AlertItem({ alert, onAction }) {
  const s = LEVEL_STYLE[alert.level]

  return (
    <li className={`p-space-md flex items-start gap-3 ${s.row}`}>
      {/* Icon tròn bên trái */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${s.iconWrap}`}
      >
        <Icon name={alert.icon} size={22} />
      </div>

      {/* Nội dung chính */}
      <div className="flex-1 min-w-0">
        {/* Tiêu đề + badge (hạn / trạng thái) */}
        <div className="flex items-center justify-between gap-1">
          <span className={`text-subheadline truncate ${s.title}`}>{alert.title}</span>
          <span className={`shrink-0 ${s.badge}`}>{alert.badge}</span>
        </div>

        {/* Mô tả */}
        <p className="text-footnote text-on-surface-variant mt-0.5">{alert.description}</p>

        {/* Các nút hành động (chỉ mục nào có actions mới hiện) */}
        {alert.actions && (
          <div className="mt-2 flex items-center gap-2">
            {alert.actions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => onAction?.(alert, action)}
                className={`px-3 py-1.5 rounded-md text-caption-1 active:opacity-80 transition ${
                  action.primary
                    ? 'bg-error text-on-error font-semibold shadow-sm'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Biểu tượng cuối dòng: ">" cho warning, "✓" cho ok */}
      {alert.level === 'warning' && (
        <Icon name="chevron_right" size={20} className="text-outline-variant self-center" />
      )}
      {alert.level === 'ok' && (
        <Icon name="check_circle" size={20} className="text-secondary self-center" />
      )}
    </li>
  )
}

// ---------- Cả khối danh sách ----------
export default function AlertsList({ alerts, onAction }) {
  // Đếm số việc cấp bách (critical + warning) để hiển thị ở góc phải
  const urgentCount = alerts.filter((a) => a.level !== 'ok').length

  return (
    <section className="flex flex-col gap-2">
      <SectionHeader
        title="Cần chú ý & An toàn"
        dot={urgentCount > 0}
        right={
          <span className="text-caption-1 font-semibold text-error">
            {urgentCount} việc cấp bách
          </span>
        }
      />

      {/* divide-y: kẻ đường mảnh giữa các dòng, giống bảng iOS */}
      <Card as="ul" className="overflow-hidden divide-y divide-surface-container">
        {alerts.map((alert) => (
          <AlertItem key={alert.id} alert={alert} onAction={onAction} />
        ))}
      </Card>
    </section>
  )
}
