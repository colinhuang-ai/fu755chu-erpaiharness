// =============================================================
// QuickActions — "Lối tắt tác vụ": 3 nút vuông thao tác nhanh
//   - Thêm chi phí, Báo hỏng hóc: nút trắng thường
//   - Báo tràn / Cắt khẩn: nút đỏ nổi bật (variant 'danger')
// Bấm nút nào thì gọi onAction(id) để App xử lý.
// =============================================================
import Icon from '../ui/Icon'
import SectionHeader from '../ui/SectionHeader'

export default function QuickActions({ actions, onAction }) {
  return (
    <section className="flex flex-col gap-2">
      <SectionHeader title="Lối tắt tác vụ" />

      <div className="grid grid-cols-3 gap-2">
        {actions.map((action) => {
          const isDanger = action.variant === 'danger'

          return (
            <button
              key={action.id}
              type="button"
              onClick={() => onAction(action.id)}
              className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition ${
                isDanger
                  ? 'bg-error text-on-error shadow-md active:scale-95'
                  : 'bg-surface-container-lowest shadow-sm active:bg-surface-container'
              }`}
            >
              {/* Vòng tròn chứa icon */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isDanger ? 'bg-on-error/20' : action.iconBg
                }`}
              >
                <Icon name={action.icon} size={isDanger ? 22 : 20} />
              </div>

              {/* Nhãn nút */}
              <span
                className={`text-caption-1 text-center ${isDanger ? 'font-bold' : 'font-semibold'}`}
              >
                {action.label}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
