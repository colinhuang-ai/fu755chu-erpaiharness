// =============================================================
// ProgressSteps — thanh tiến độ quy trình nhiều bước
//   - steps:   mảng tên bước, ví dụ ['Nhận lệnh', 'Nạp bồn', ...]
//   - current: chỉ số bước hiện tại (tính từ 0)
// Quy tắc màu:
//   bước đã xong  (< current) → xanh lá
//   bước hiện tại (= current) → xanh dương + nhấp nháy
//   bước chưa tới (> current) → xám
// =============================================================

// Hàm phụ: trả về trạng thái của 1 bước
const getStatus = (index, current) =>
  index < current ? 'done' : index === current ? 'active' : 'todo'

// Bảng màu theo trạng thái — tách riêng để dễ chỉnh
const BAR_STYLE = {
  done: 'bg-secondary',
  active: 'bg-primary animate-pulse',
  todo: 'bg-surface-container-high',
}
const LABEL_STYLE = {
  done: 'text-secondary font-medium',
  active: 'text-primary font-bold',
  todo: '',
}

export default function ProgressSteps({ steps, current }) {
  return (
    <div className="pt-2 flex flex-col gap-2">
      {/* ---------- Tiêu đề + "Bước x / y" ---------- */}
      <div className="flex items-center justify-between">
        <span className="text-caption-2 uppercase tracking-wider text-on-surface-variant">
          Tiến độ quy trình
        </span>
        <span className="text-caption-2 text-primary font-bold">
          Bước {current + 1} / {steps.length}
        </span>
      </div>

      {/* ---------- Các đoạn thanh màu ---------- */}
      <div className="flex items-center gap-1">
        {steps.map((step, i) => (
          <div
            key={step}
            className={`flex-1 h-2 rounded-full ${BAR_STYLE[getStatus(i, current)]}`}
          />
        ))}
      </div>

      {/* ---------- Nhãn tên bước bên dưới mỗi đoạn ---------- */}
      <div className="flex justify-between text-[10px] text-on-surface-variant">
        {steps.map((step, i) => (
          <span key={step} className={LABEL_STYLE[getStatus(i, current)]}>
            {step}
          </span>
        ))}
      </div>
    </div>
  )
}
