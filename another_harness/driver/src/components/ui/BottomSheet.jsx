// =============================================================
// BottomSheet — hộp thoại trượt từ dưới lên (thay cho confirm()/alert() của trình duyệt)
// Dùng chung cho: cảnh báo Ra ca, xác nhận SOS khẩn cấp.
// Props:
//   - open:        true = hiện, false = ẩn
//   - onClose:     gọi khi bấm ra ngoài vùng tối hoặc nhấn phím Esc
//   - icon, tone:  icon đầu hộp và tông màu ('error' | 'primary')
//   - title, subtitle, children: nội dung
//   - actions:     danh sách nút [{ label, onClick, variant: 'primary' | 'danger' | 'plain' }]
// =============================================================
import { useEffect } from 'react'
import Icon from './Icon'

// Kiểu dáng cho từng loại nút trong sheet
const BUTTON_STYLE = {
  primary: 'h-12 bg-primary text-on-primary text-headline',
  danger: 'h-12 bg-error text-on-error text-headline',
  plain: 'h-11 bg-surface-container text-on-surface-variant text-footnote font-semibold',
}

const TONE_STYLE = {
  error: 'bg-error-container text-error',
  primary: 'bg-primary-fixed text-primary',
}

export default function BottomSheet({
  open,
  onClose,
  icon = 'warning',
  tone = 'error',
  title,
  subtitle,
  children,
  actions = [],
}) {
  // ---------- Đóng sheet khi nhấn phím Esc ----------
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Không mở thì không vẽ gì cả
  if (!open) return null

  return (
    // ---------- Lớp nền tối phủ toàn màn hình; bấm vào đây = đóng ----------
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* ---------- Hộp nội dung ---------- */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-space-lg shadow-xl flex flex-col gap-4 animate-sheet-up"
      >
        {/* Đầu hộp: icon + tiêu đề + phụ đề */}
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${TONE_STYLE[tone]}`}
          >
            <Icon name={icon} size={26} />
          </div>
          <div>
            <h3 id="sheet-title" className="font-display text-title-3 font-bold">
              {title}
            </h3>
            {subtitle && <p className="text-footnote text-on-surface-variant">{subtitle}</p>}
          </div>
        </div>

        {/* Thân hộp: nội dung tuỳ ý truyền vào */}
        {children && <div className="text-body text-on-surface-variant">{children}</div>}

        {/* Các nút hành động xếp dọc */}
        <div className="flex flex-col gap-2 mt-2">
          {actions.map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={a.onClick}
              className={`w-full rounded-xl flex items-center justify-center active:opacity-75 transition ${
                BUTTON_STYLE[a.variant || 'plain']
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
