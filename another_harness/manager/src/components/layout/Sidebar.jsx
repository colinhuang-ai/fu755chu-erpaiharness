// =============================================================
// Sidebar — menu điều hướng bên trái
//   - Màn hình rộng (≥ 1024px): luôn hiện, cố định bên trái
//   - Màn hình hẹp: ẩn, bấm nút ☰ trên Topbar mới trượt ra (mobileOpen)
// Props:
//   items:      [{ id, label, icon, badge }]
//   activeId:   trang đang mở
//   onNavigate: gọi khi chọn trang
//   mobileOpen, onCloseMobile: điều khiển bản mobile
// =============================================================
import Icon from '../ui/Icon'

export default function Sidebar({ items, activeId, onNavigate, mobileOpen, onCloseMobile, team }) {
  // ---------- Nội dung menu (dùng chung cho bản desktop và mobile) ----------
  const nav = (
    <nav className="flex flex-col h-full">
      {/* Logo + tên đội */}
      <div className="px-5 h-16 flex items-center gap-2.5 border-b border-surface-container">
        <span className="w-9 h-9 rounded-lg bg-primary text-on-primary flex items-center justify-center">
          <Icon name="local_shipping" size={20} filled />
        </span>
        <div className="leading-tight">
          <div className="text-headline">DriverOS</div>
          <div className="text-caption-1 text-on-surface-variant">{team}</div>
        </div>
      </div>

      {/* Danh sách trang */}
      <ul className="flex-1 p-3 flex flex-col gap-0.5">
        {items.map((item) => {
          const active = item.id === activeId
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  onNavigate(item.id)
                  onCloseMobile() // chọn xong thì đóng menu mobile
                }}
                aria-current={active ? 'page' : undefined}
                className={`w-full h-10 px-3 rounded-lg flex items-center gap-3 text-body transition-colors ${
                  active
                    ? 'bg-primary-fixed text-on-primary-fixed font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <Icon name={item.icon} size={20} filled={active} />
                <span className="flex-1 text-left">{item.label}</span>
                {/* Số việc cần xử lý (vd: số yêu cầu chờ duyệt) */}
                {item.badge > 0 && (
                  <span className="min-w-5 h-5 px-1.5 rounded-full bg-error text-on-error text-caption-2 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>

      {/* Chân menu: ghi chú môi trường demo */}
      <p className="px-5 py-4 text-caption-1 text-on-surface-variant border-t border-surface-container">
        Bản prototype · dữ liệu mẫu
      </p>
    </nav>
  )

  return (
    <>
      {/* ---------- Bản desktop: cột cố định ---------- */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-60 bg-surface-container-lowest border-r border-surface-container">
        {nav}
      </aside>

      {/* ---------- Bản mobile: phủ lên trang khi mở ---------- */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/30 animate-fade-in"
          onClick={(e) => e.target === e.currentTarget && onCloseMobile()}
        >
          <aside className="w-64 h-full bg-surface-container-lowest shadow-xl">{nav}</aside>
        </div>
      )}
    </>
  )
}
