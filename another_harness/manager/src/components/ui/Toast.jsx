// =============================================================
// Toast — thông báo nhanh ở góc dưới phải, tự ẩn sau vài giây
//   message: nội dung (null = ẩn) · onDone: gọi khi hết giờ để xoá message
// =============================================================
import { useEffect } from 'react'
import Icon from './Icon'

export default function Toast({ message, onDone, duration = 2800 }) {
  // Hẹn giờ tự ẩn mỗi khi có message mới
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onDone, duration)
    return () => clearTimeout(t)
  }, [message, onDone, duration])

  if (!message) return null

  return (
    <div
      role="status"
      className="fixed bottom-6 right-6 z-[60] max-w-sm px-4 py-3 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-lg flex items-center gap-2 animate-pop-in"
    >
      <Icon name="check_circle" size={20} />
      <span className="text-footnote font-medium">{message}</span>
    </div>
  )
}
