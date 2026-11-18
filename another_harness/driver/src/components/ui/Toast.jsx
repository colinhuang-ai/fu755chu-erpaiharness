// =============================================================
// Toast — thông báo nhỏ hiện ở phía trên thanh tab, tự ẩn sau vài giây
// Dùng để phản hồi nhanh khi người dùng bấm nút (ví dụ: "Đã gửi tín hiệu SOS").
//   - message: nội dung; null = không hiện
//   - onDone:  gọi khi hết thời gian hiển thị để App xoá message
// =============================================================
import { useEffect } from 'react'
import Icon from './Icon'

export default function Toast({ message, onDone, duration = 2600 }) {
  // ---------- Hẹn giờ tự ẩn mỗi khi có message mới ----------
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onDone, duration)
    return () => clearTimeout(t)
  }, [message, onDone, duration])

  if (!message) return null

  return (
    <div
      role="status"
      className="fixed bottom-24 inset-x-0 z-50 mx-auto w-fit max-w-[calc(100%-2rem)] px-4 py-2.5 rounded-full bg-inverse-surface text-inverse-on-surface shadow-lg flex items-center gap-2 animate-sheet-up"
    >
      <Icon name="check_circle" size={18} />
      <span className="text-footnote font-medium">{message}</span>
    </div>
  )
}
