// =============================================================
// Badge — nhãn trạng thái dạng viên thuốc
// <Badge className="bg-primary-fixed text-on-primary-fixed">Đang chạy</Badge>
// Màu truyền qua className (lấy từ lib/status.js) để mọi nơi dùng chung bảng màu.
// =============================================================
export default function Badge({ className = '', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-caption-1 font-semibold whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  )
}
