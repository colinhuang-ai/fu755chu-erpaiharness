// =============================================================
// Icon — bọc icon Material Symbols thành component cho gọn
// Cách dùng:  <Icon name="wifi" size={16} className="text-primary" />
//   - name: tên icon (tra tại https://fonts.google.com/icons)
//   - size: kích thước px
//   - filled: true = icon tô đặc, false = icon viền
// =============================================================
export default function Icon({ name, size = 20, filled = false, className = '' }) {
  return (
    <span
      // aria-hidden: icon chỉ để trang trí, trình đọc màn hình sẽ bỏ qua
      aria-hidden="true"
      className={`material-symbols-outlined ${className}`}
      style={{
        fontSize: size,
        // FILL 1 = tô đặc; opsz = kích thước quang học, giúp icon nhỏ vẫn rõ nét
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${Math.min(48, Math.max(20, size))}`,
      }}
    >
      {name}
    </span>
  )
}
