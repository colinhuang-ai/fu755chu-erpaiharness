// =============================================================
// DayDetailSheet — xem chi tiết chấm công của 1 ngày (mở khi chạm ngày trên lịch)
// Hiển thị dạng danh sách Inset Grouped:
//   Giờ vào (+ trạng thái) · Giờ ra (+ trạng thái) · Thời gian làm · Ghi chú
//   Giải trình (nếu đã gửi) hoặc nút "Gửi giải trình" (nếu đi muộn / về sớm)
// =============================================================
import FormSheet from '../ui/FormSheet'
import Icon from '../ui/Icon'
import {
  STATUS_META,
  getArrivalStatus,
  getDepartureStatus,
  needsExplanation,
} from '../../lib/attendanceRules'
import { formatDuration, formatFullDate, toMinutes } from '../../lib/format'

// Nhãn trạng thái giải trình
const EXPLANATION_STATUS = {
  pending: { label: 'Chờ duyệt', className: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' },
  approved: { label: 'Đã duyệt', className: 'bg-secondary-container/40 text-on-secondary-container' },
}

// ---------- Một dòng thông tin: nhãn trái, giá trị phải ----------
function InfoRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-3 min-h-11 px-space-md py-2">
      <span className="text-body">{label}</span>
      <div className="text-body text-on-surface-variant text-right">{children}</div>
    </div>
  )
}

// ---------- Nhãn trạng thái nhỏ, ví dụ "Đi muộn 12 phút" ----------
function StatusPill({ type, diff }) {
  const meta = STATUS_META[type]
  return (
    <span className={`px-2 py-0.5 rounded-full text-caption-1 font-semibold ${meta.bg} ${meta.text}`}>
      {meta.label}
      {diff > 0 && ` ${diff} phút`}
    </span>
  )
}

export default function DayDetailSheet({ record, year, month, nowMinutes, onClose, onExplain }) {
  // Sheet đóng khi chưa chọn ngày
  if (!record) return null

  const arrival = getArrivalStatus(record.clockIn)
  const departure = getDepartureStatus(record.clockOut)

  // Thời gian làm: đã ra ca → (ra − vào); chưa ra ca → (bây giờ − vào)
  const endMinutes = record.clockOut ? toMinutes(record.clockOut) : nowMinutes
  const worked = Math.max(0, endMinutes - toMinutes(record.clockIn))

  const canExplain = needsExplanation(record) && !record.explanation

  return (
    <FormSheet
      open
      onClose={onClose}
      title={formatFullDate(year, month, record.day)}
      cancelLabel={null}
      primaryLabel="Xong"
      onPrimary={onClose}
    >
      <div className="flex flex-col gap-space-lg pt-2 pb-4">
        {/* ---------- Nhóm 1: Giờ vào / ra / thời gian làm ---------- */}
        <div className="bg-surface-container-lowest rounded-xl divide-y divide-surface-container">
          <InfoRow label="Giờ vào">
            <div className="flex items-center gap-2">
              <StatusPill type={arrival.type} diff={arrival.type === 'ontime' ? 0 : arrival.diff} />
              <span className="tabular-nums">{record.clockIn}</span>
            </div>
          </InfoRow>

          <InfoRow label="Giờ ra">
            {record.clockOut ? (
              <div className="flex items-center gap-2">
                {departure.type === 'earlyLeave' && (
                  <StatusPill type="earlyLeave" diff={departure.diff} />
                )}
                <span className="tabular-nums">{record.clockOut}</span>
              </div>
            ) : (
              <span className="text-secondary font-semibold">● Đang trong ca</span>
            )}
          </InfoRow>

          <InfoRow label="Thời gian làm">
            <span className="tabular-nums">{formatDuration(worked)}</span>
          </InfoRow>
        </div>

        {/* ---------- Nhóm 2: Ghi chú (nếu có) ---------- */}
        {record.note && (
          <section className="flex flex-col gap-1.5">
            <h4 className="px-space-md text-caption-2 uppercase tracking-wider text-on-surface-variant">
              Ghi chú
            </h4>
            <p className="bg-surface-container-lowest rounded-xl px-space-md py-3 text-body">
              {record.note}
            </p>
          </section>
        )}

        {/* ---------- Nhóm 3: Giải trình đã gửi ---------- */}
        {record.explanation && (
          <section className="flex flex-col gap-1.5">
            <h4 className="px-space-md text-caption-2 uppercase tracking-wider text-on-surface-variant">
              Giải trình
            </h4>
            <div className="bg-surface-container-lowest rounded-xl px-space-md py-3 flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-subheadline font-semibold">{record.explanation.reason}</span>
                <span
                  className={`shrink-0 px-2 py-0.5 rounded-full text-caption-1 font-semibold ${
                    EXPLANATION_STATUS[record.explanation.status].className
                  }`}
                >
                  {EXPLANATION_STATUS[record.explanation.status].label}
                </span>
              </div>
              <p className="text-footnote text-on-surface-variant">{record.explanation.detail}</p>
            </div>
          </section>
        )}

        {/* ---------- Nút Gửi giải trình: chỉ khi đi muộn / về sớm và chưa gửi ---------- */}
        {canExplain && (
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => onExplain(record)}
              className="h-12 rounded-xl bg-primary text-on-primary text-headline flex items-center justify-center gap-2 active:opacity-75 transition"
            >
              <Icon name="edit_note" size={22} />
              Gửi giải trình
            </button>
            <p className="px-space-md text-footnote text-on-surface-variant">
              Giải trình được duyệt sẽ không bị trừ điểm KPI Chuyên cần.
            </p>
          </div>
        )}
      </div>
    </FormSheet>
  )
}
