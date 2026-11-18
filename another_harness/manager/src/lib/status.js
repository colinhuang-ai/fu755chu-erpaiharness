// =============================================================
// status.js — Nhãn & màu hiển thị cho các loại trạng thái
// Gom vào một chỗ: muốn đổi chữ / màu thì sửa ở đây, mọi màn hình tự đổi theo.
// =============================================================

// ---------- Trạng thái chuyến (luồng: Chờ nhận → … → Hoàn tất) ----------
export const TRIP_STATUS = {
  unassigned: { label: 'Chưa phân công', className: 'bg-error-container text-on-error-container' },
  waiting: { label: 'Chờ nhận', className: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' },
  accepted: { label: 'Đã nhận', className: 'bg-primary-fixed text-on-primary-fixed' },
  loading: { label: 'Đang lấy hàng', className: 'bg-primary-fixed text-on-primary-fixed' },
  running: { label: 'Đang chạy', className: 'bg-primary text-on-primary' },
  unloading: { label: 'Đang xả hàng', className: 'bg-primary text-on-primary' },
  done: { label: 'Hoàn tất', className: 'bg-secondary-container/40 text-on-secondary-container' },
}

// ---------- Trạng thái lái xe ----------
export const DRIVER_STATUS = {
  on_trip: { label: 'Đang chạy', dot: 'bg-primary' },
  available: { label: 'Sẵn sàng', dot: 'bg-secondary' },
  off: { label: 'Nghỉ', dot: 'bg-outline' },
}

// ---------- Loại yêu cầu trong hàng đợi duyệt ----------
export const APPROVAL_TYPE = {
  attendance: { label: 'Giải trình chấm công', icon: 'schedule', className: 'bg-primary-fixed text-primary' },
  expense: { label: 'Chi phí', icon: 'receipt_long', className: 'bg-tertiary-fixed text-on-tertiary-fixed' },
  kpi: { label: 'Khiếu nại KPI', icon: 'insights', className: 'bg-secondary-container/40 text-on-secondary-container' },
  leave: { label: 'Nghỉ phép', icon: 'beach_access', className: 'bg-surface-container-high text-on-surface-variant' },
}

// ---------- Mức độ của một kết quả kiểm tra / giấy tờ ----------
// ok: đạt · warn: cảnh báo (vẫn cho làm) · block: chặn
export const LEVEL = {
  ok: { icon: 'check_circle', text: 'text-secondary', bg: 'bg-secondary-container/30' },
  warn: { icon: 'warning', text: 'text-tertiary', bg: 'bg-tertiary-fixed/60' },
  block: { icon: 'block', text: 'text-error', bg: 'bg-error-container/60' },
}
