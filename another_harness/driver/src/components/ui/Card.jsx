// =============================================================
// Card — thẻ nền trắng bo góc (kiểu iOS "Inset Grouped")
// Mọi khối nội dung chính trên màn hình đều dùng chung thẻ này để đồng bộ giao diện.
// Có thể truyền thêm className để thay đổi padding/khoảng cách bên trong.
// =============================================================
export default function Card({ as: Tag = 'section', className = '', children, ...rest }) {
  return (
    <Tag
      className={`bg-surface-container-lowest rounded-xl shadow-sm ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
