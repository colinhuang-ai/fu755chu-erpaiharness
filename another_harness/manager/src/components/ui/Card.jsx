// =============================================================
// Card — khung trắng bo góc dùng cho mọi khối nội dung
//   - title / action: (tuỳ chọn) dòng tiêu đề trên cùng + nút/link bên phải
//   - padded: false khi bên trong là bảng (bảng tự lo khoảng cách)
// =============================================================
export default function Card({ title, action, padded = true, className = '', children }) {
  return (
    <section
      className={`bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container ${className}`}
    >
      {/* Dòng tiêu đề (chỉ hiện khi có title) */}
      {title && (
        <header className="flex items-center justify-between gap-3 px-5 pt-4 pb-3">
          <h2 className="text-headline">{title}</h2>
          {action}
        </header>
      )}

      {/* Nội dung */}
      <div className={padded ? `px-5 ${title ? 'pb-5' : 'py-5'}` : ''}>{children}</div>
    </section>
  )
}
