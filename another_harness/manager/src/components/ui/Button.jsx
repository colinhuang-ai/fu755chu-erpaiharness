// =============================================================
// Button — nút dùng chung với 4 kiểu:
//   primary (xanh, hành động chính) · secondary (xám) · danger (đỏ) · ghost (chỉ chữ)
// Mọi props khác (onClick, disabled, type...) truyền thẳng xuống thẻ <button>.
// =============================================================
import Icon from './Icon'

const VARIANT = {
  primary: 'bg-primary text-on-primary hover:brightness-110',
  secondary: 'bg-surface-container-high text-on-surface hover:bg-surface-container',
  danger: 'bg-error text-on-error hover:brightness-110',
  ghost: 'text-primary hover:bg-primary-fixed/50',
}

export default function Button({ variant = 'primary', icon, className = '', children, ...rest }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-lg text-footnote font-semibold transition disabled:opacity-40 disabled:pointer-events-none ${VARIANT[variant]} ${className}`}
      {...rest}
    >
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  )
}
