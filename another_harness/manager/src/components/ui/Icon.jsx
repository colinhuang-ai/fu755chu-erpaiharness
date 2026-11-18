// =============================================================
// Icon — bọc icon Material Symbols
// <Icon name="local_shipping" size={20} filled className="text-primary" />
// Tra tên icon tại https://fonts.google.com/icons
// =============================================================
export default function Icon({ name, size = 20, filled = false, className = '' }) {
  return (
    <span
      aria-hidden="true" // icon trang trí → trình đọc màn hình bỏ qua
      className={`material-symbols-outlined ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${Math.min(48, Math.max(20, size))}`,
      }}
    >
      {name}
    </span>
  )
}
