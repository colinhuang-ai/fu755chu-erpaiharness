// =============================================================
// SegmentedControl — nút chuyển đổi dạng "viên thuốc" kiểu iOS
// Ví dụ:  [ Bảng công | KPI ]
//   - options:  [{ id, label }]
//   - value:    id đang chọn
//   - onChange: gọi khi bấm một lựa chọn khác
// =============================================================
export default function SegmentedControl({ options, value, onChange, ariaLabel }) {
  return (
    // Nền xám bao ngoài, các nút nằm bên trong
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="flex p-0.5 rounded-lg bg-surface-container-high"
    >
      {options.map((opt) => {
        const selected = opt.id === value

        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(opt.id)}
            // Nút đang chọn: nền trắng nổi lên + bóng nhẹ, giống iOS
            className={`flex-1 h-8 rounded-md text-footnote transition-all ${
              selected
                ? 'bg-surface-container-lowest font-semibold shadow-sm'
                : 'text-on-surface-variant'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
