// =============================================================
// BottomTabBar — thanh điều hướng 5 tab cố định ở đáy màn hình
//   - tabs:     danh sách tab (id, label, icon, badge)
//   - activeId: tab đang được chọn → tô màu primary + icon đặc
//   - onChange: hàm gọi khi bấm vào một tab
// =============================================================
import Icon from '../ui/Icon'

export default function BottomTabBar({ tabs, activeId, onChange }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 mx-auto max-w-md pb-safe bg-surface/85 backdrop-blur-xl shadow-[0_-1px_12px_rgba(0,0,0,0.04)]">
      <ul className="flex justify-around items-center h-16 px-1">
        {/* Lặp qua từng tab và vẽ ra nút tương ứng */}
        {tabs.map((tab) => {
          const isActive = tab.id === activeId

          return (
            <li key={tab.id} className="flex-1 h-full">
              <button
                type="button"
                onClick={() => onChange(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full h-full flex flex-col items-center justify-center gap-0.5 transition-colors ${
                  isActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {/* Icon + badge số đỏ (ví dụ: 1 công việc mới) */}
                <div className="relative flex items-center justify-center">
                  <Icon name={tab.icon} size={24} filled={isActive} />
                  {tab.badge > 0 && (
                    <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 rounded-full bg-error text-on-error text-[10px] font-semibold flex items-center justify-center leading-none shadow-sm">
                      {tab.badge}
                    </span>
                  )}
                </div>

                {/* Nhãn tab */}
                <span className="text-caption-2 tracking-tight">{tab.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
