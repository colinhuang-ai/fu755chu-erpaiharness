// =============================================================
// useClock — "Đồng hồ giả lập" của app (theo specs: hôm nay là Thứ Năm 12/11/2026,
// bắt đầu lúc 09:12 và chạy theo thời gian thực).
// Nhờ vậy dữ liệu mock (đã vào ca 05:54, hẹn giao 10:30...) luôn khớp nhau
// dù bạn mở app vào lúc nào.
//
// Cách dùng:  const now = useClock()   // now là một Date, tự cập nhật mỗi giây
// =============================================================
import { useEffect, useState } from 'react'

// Thời điểm giả lập lúc mở app (tháng trong JS tính từ 0 → 10 = tháng 11)
const SIM_START = new Date(2026, 10, 12, 9, 12, 0).getTime()

// Thời điểm thật lúc file này được nạp. Đặt ở ngoài hook để MỌI component
// dùng chung một mốc → đồng hồ ở header và thẻ chấm công luôn giống nhau.
const REAL_START = Date.now()

// Giờ giả lập hiện tại = mốc giả lập + thời gian thật đã trôi qua.
// Export để dùng một lần (vd: lúc bấm Ra ca) mà không cần re-render mỗi giây.
export const getSimNow = () => new Date(SIM_START + (Date.now() - REAL_START))

export default function useClock() {
  const [now, setNow] = useState(getSimNow)

  useEffect(() => {
    // Cập nhật mỗi giây; dọn dẹp khi component bị gỡ
    const id = setInterval(() => setNow(getSimNow()), 1000)
    return () => clearInterval(id)
  }, [])

  return now
}

// Tiện ích: lấy "HH:MM" từ một Date
export const toClockString = (date) =>
  `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
