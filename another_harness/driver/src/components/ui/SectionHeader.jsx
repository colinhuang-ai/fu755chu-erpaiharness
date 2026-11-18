// =============================================================
// SectionHeader — tiêu đề nhỏ viết HOA phía trên mỗi nhóm nội dung
// Ví dụ: "CHỈ SỐ HÔM NAY & THÁNG 11 ............ Chi tiết"
//   - title: chữ bên trái
//   - right: nội dung bên phải (link, số đếm...), không bắt buộc
//   - dot:   true = hiện chấm đỏ cạnh tiêu đề (báo có việc gấp)
// =============================================================
export default function SectionHeader({ title, right, dot = false }) {
  return (
    <div className="flex items-center justify-between px-1">
      {/* Bên trái: tiêu đề + chấm đỏ (nếu có) */}
      <div className="flex items-center gap-1.5">
        <h2 className="text-caption-2 uppercase tracking-wider text-on-surface-variant">
          {title}
        </h2>
        {dot && <span className="w-2 h-2 rounded-full bg-error" />}
      </div>

      {/* Bên phải: tuỳ chọn */}
      {right}
    </div>
  )
}
