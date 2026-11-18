// =============================================================
// Topbar — thanh trên cùng của vùng nội dung
//   Trái:  nút ☰ (chỉ hiện trên màn hẹp) + tiêu đề trang + ngày hôm nay
//   Phải:  avatar + tên người quản lý
// =============================================================
import Icon from '../ui/Icon'
import { formatDate, initials } from '../../lib/format'

export default function Topbar({ title, today, manager, onOpenMenu }) {
  return (
    <header className="sticky top-0 z-30 h-16 px-4 lg:px-8 flex items-center gap-3 bg-surface/85 backdrop-blur-xl border-b border-surface-container">
      {/* Nút mở menu — ẩn trên desktop vì sidebar đã luôn hiện */}
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Mở menu"
        className="lg:hidden w-9 h-9 rounded-lg hover:bg-surface-container flex items-center justify-center"
      >
        <Icon name="menu" />
      </button>

      {/* Tiêu đề trang + ngày */}
      <div className="flex-1 min-w-0">
        <h1 className="text-title-3 truncate">{title}</h1>
        <p className="text-caption-1 text-on-surface-variant">Thứ Năm, {formatDate(today)}</p>
      </div>

      {/* Người đang đăng nhập */}
      <div className="flex items-center gap-2.5">
        <div className="hidden sm:block text-right leading-tight">
          <div className="text-footnote font-semibold">{manager.name}</div>
          <div className="text-caption-1 text-on-surface-variant">{manager.role}</div>
        </div>
        <span className="w-9 h-9 rounded-full bg-primary text-on-primary text-footnote font-semibold flex items-center justify-center">
          {initials(manager.name)}
        </span>
      </div>
    </header>
  )
}
