// =============================================================
// Drawer — panel trượt từ phải vào (kiểu back-office), dùng cho:
//   phân công chuyến, xem hồ sơ lái xe...
// Props:
//   open, onClose — hiện/ẩn
//   title, subtitle — đầu panel
//   footer — vùng nút cố định ở đáy (vd: Hủy / Giao chuyến)
//   children — nội dung cuộn được
// =============================================================
import { useEffect } from 'react'
import Icon from './Icon'

export default function Drawer({ open, onClose, title, subtitle, footer, children }) {
  // ---------- Nhấn Esc để đóng ----------
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    // ---------- Nền tối; bấm ra ngoài để đóng ----------
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/30 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* ---------- Thân panel: rộng tối đa 480px, cao full màn hình ---------- */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-[480px] h-full bg-surface flex flex-col shadow-2xl animate-slide-in"
      >
        {/* Đầu panel: tiêu đề + nút đóng */}
        <header className="flex items-start justify-between gap-3 px-6 py-4 border-b border-surface-container bg-surface-container-lowest">
          <div className="min-w-0">
            <h2 className="text-title-3 truncate">{title}</h2>
            {subtitle && <p className="text-footnote text-on-surface-variant">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="w-9 h-9 rounded-full hover:bg-surface-container flex items-center justify-center shrink-0"
          >
            <Icon name="close" />
          </button>
        </header>

        {/* Nội dung cuộn được */}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {/* Vùng nút cố định ở đáy */}
        {footer && (
          <footer className="px-6 py-4 border-t border-surface-container bg-surface-container-lowest flex justify-end gap-2">
            {footer}
          </footer>
        )}
      </aside>
    </div>
  )
}
