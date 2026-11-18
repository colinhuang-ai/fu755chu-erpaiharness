// =============================================================
// FormSheet — sheet trượt từ dưới lên kiểu iOS, dùng cho form / màn chi tiết
// Khác với BottomSheet (hộp thoại xác nhận), sheet này có:
//   - Thanh kéo nhỏ ở trên cùng
//   - Header: nút trái (Hủy) · tiêu đề giữa · nút phải (Gửi / Xong)
//   - Nút phải tự MỜ khi form chưa hợp lệ (primaryDisabled = true)
//   - Phần thân cuộn được nếu nội dung dài
//
// Props:
//   open, onClose           — hiện/ẩn, hàm đóng
//   title                   — tiêu đề giữa header
//   cancelLabel             — chữ nút trái (mặc định "Hủy"); null = ẩn nút
//   primaryLabel, onPrimary — chữ & hành động nút phải
//   primaryDisabled         — true = nút phải mờ, không bấm được
//   children                — nội dung form
// =============================================================
import { useEffect } from 'react'

export default function FormSheet({
  open,
  onClose,
  title,
  cancelLabel = 'Hủy',
  primaryLabel,
  onPrimary,
  primaryDisabled = false,
  children,
}) {
  // ---------- Nhấn Esc để đóng ----------
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    // ---------- Lớp nền tối; bấm ra ngoài sheet = đóng ----------
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* ---------- Thân sheet: dính đáy màn hình, bo 2 góc trên ---------- */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-md max-h-[88dvh] flex flex-col bg-surface rounded-t-2xl shadow-xl animate-sheet-up"
      >
        {/* Thanh kéo trang trí */}
        <div className="pt-2 flex justify-center">
          <span className="w-9 h-1.5 rounded-full bg-outline-variant" />
        </div>

        {/* ---------- Header 3 cột: Hủy | Tiêu đề | Hành động ---------- */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-12 px-4">
          <div>
            {cancelLabel && (
              <button type="button" onClick={onClose} className="text-body text-primary">
                {cancelLabel}
              </button>
            )}
          </div>
          <h3 className="text-headline text-center truncate">{title}</h3>
          <div className="text-right">
            {primaryLabel && (
              <button
                type="button"
                onClick={onPrimary}
                disabled={primaryDisabled}
                className="text-headline text-primary disabled:opacity-35 transition-opacity"
              >
                {primaryLabel}
              </button>
            )}
          </div>
        </div>

        {/* ---------- Nội dung cuộn được; pb-safe chừa thanh home iPhone ---------- */}
        <div className="flex-1 overflow-y-auto px-margin pb-safe">{children}</div>
      </div>
    </div>
  )
}
