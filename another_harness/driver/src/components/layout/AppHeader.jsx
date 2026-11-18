// =============================================================
// AppHeader — thanh trên cùng, cố định khi cuộn
// Gồm 2 tầng:
//   1. Thanh trạng thái giả lập điện thoại (giờ, sóng, wifi, pin)
//   2. Tiêu đề lớn "Hôm Nay" + nút SOS + avatar tài xế
// Nền mờ kính (backdrop-blur) theo phong cách iOS.
// =============================================================
import Icon from '../ui/Icon'
import useClock, { toClockString } from '../../hooks/useClock'

export default function AppHeader({ driver, title, onSos }) {
  // Giờ trên status bar chạy theo đồng hồ giả lập (bắt đầu 09:12)
  const now = useClock()

  return (
    <header className="fixed top-0 inset-x-0 z-40 mx-auto max-w-md bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* ---------- Tầng 1: Status bar giả lập ---------- */}
      <div className="pt-safe px-5 flex items-center justify-between">
        <span className="text-footnote font-semibold tabular-nums">{toClockString(now)}</span>
        <div className="flex items-center gap-1.5">
          <Icon name="signal_cellular_alt" size={16} />
          <Icon name="wifi" size={16} />
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-semibold leading-none">85%</span>
            <Icon name="battery_charging_full" size={18} className="rotate-90" />
          </div>
        </div>
      </div>

      {/* ---------- Tầng 2: Tiêu đề + nút hành động ---------- */}
      <div className="h-16 px-margin flex items-center justify-between">
        {/* Bên trái: tên app + tiêu đề trang */}
        <div className="flex flex-col">
          <span className="text-caption-2 uppercase tracking-wider text-on-surface-variant">
            DriverOS Fleet
          </span>
          <h1 className="font-display text-large-title-mobile leading-none tracking-tight">
            {title}
          </h1>
        </div>

        {/* Bên phải: nút SOS khẩn cấp + avatar */}
        <div className="flex items-center gap-2">
          {/* Nút SOS: nền đỏ nhạt, bấm sẽ gọi onSos (mở hộp xác nhận khẩn cấp) */}
          <button
            type="button"
            onClick={onSos}
            aria-label="Báo động khẩn cấp SOS"
            className="w-11 h-11 rounded-full bg-error-container text-error flex items-center justify-center hover:opacity-85 active:scale-95 transition"
          >
            <Icon name="emergency" size={20} />
          </button>

          {/* Avatar tài xế + chấm xanh báo đang online */}
          <button
            type="button"
            aria-label={`Hồ sơ tài xế ${driver.name}`}
            className="relative w-11 h-11 flex items-center justify-center"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Icon name="person" size={18} className="text-on-primary" />
            </div>
            {driver.online && (
              <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-secondary-fixed ring-2 ring-surface" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
