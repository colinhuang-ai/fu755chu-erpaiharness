// =============================================================
// ApprovalCard — một yêu cầu trong hàng đợi duyệt
//   - Đầu thẻ: icon loại, tên lái xe, thời điểm gửi
//   - Thân: tiêu đề, nội dung, số tiền (nếu là chi phí), cờ cảnh báo
//   - Chân: Duyệt / Từ chối. Từ chối BẮT BUỘC nhập lý do (≥ MIN_REASON ký tự)
//   - Đã xử lý: hiện kết quả thay cho các nút
// =============================================================
import { useState } from 'react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import { APPROVAL_TYPE } from '../../lib/status'
import { formatMoney } from '../../lib/format'

const MIN_REASON = 5

export default function ApprovalCard({ item, driverName, onDecide }) {
  // ---------- State: đang mở ô nhập lý do từ chối không ----------
  const [rejecting, setRejecting] = useState(false)
  const [reason, setReason] = useState('')

  const type = APPROVAL_TYPE[item.type]
  const reasonOk = reason.trim().length >= MIN_REASON
  const decided = item.status !== 'pending'

  return (
    <article className="bg-surface-container-lowest rounded-xl border border-surface-container shadow-sm p-4 flex flex-col gap-3">
      {/* ---------- Đầu thẻ ---------- */}
      <header className="flex items-start gap-3">
        <span className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${type.className}`}>
          <Icon name={type.icon} size={20} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-caption-1 text-on-surface-variant">
            {type.label} · {item.id}
          </div>
          <div className="text-body font-semibold">{item.title}</div>
          <div className="text-caption-1 text-on-surface-variant">
            {driverName} ({item.driverId}) · gửi {item.submitted}
          </div>
        </div>
        {/* Số tiền (chỉ với chi phí) */}
        {item.amount != null && (
          <div className="text-headline tabular-nums shrink-0">{formatMoney(item.amount)}</div>
        )}
      </header>

      {/* ---------- Nội dung ---------- */}
      <p className="text-footnote text-on-surface-variant bg-surface-container-low rounded-lg px-3 py-2">
        {item.detail}
      </p>

      {/* ---------- Cờ cảnh báo do hệ thống gắn ---------- */}
      {item.flags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {item.flags.map((f) => (
            <Badge key={f} className="bg-tertiary-fixed text-on-tertiary-fixed-variant">
              <Icon name="flag" size={14} />
              {f}
            </Badge>
          ))}
        </div>
      )}

      {/* ---------- Chân thẻ: kết quả hoặc nút hành động ---------- */}
      {decided ? (
        <div
          className={`flex items-center gap-2 text-footnote font-semibold ${
            item.status === 'approved' ? 'text-secondary' : 'text-error'
          }`}
        >
          <Icon name={item.status === 'approved' ? 'check_circle' : 'cancel'} size={18} />
          {item.status === 'approved' ? 'Đã duyệt' : `Đã từ chối: ${item.note}`}
        </div>
      ) : rejecting ? (
        // Ô nhập lý do từ chối
        <div className="flex flex-col gap-2">
          <label htmlFor={`reason-${item.id}`} className="text-caption-1 text-on-surface-variant">
            Lý do từ chối (lái xe sẽ thấy lý do này)
          </label>
          <textarea
            id={`reason-${item.id}`}
            rows={2}
            autoFocus
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body resize-none outline-none focus:ring-2 focus:ring-error/30"
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setRejecting(false)}>
              Hủy
            </Button>
            <Button
              variant="danger"
              disabled={!reasonOk}
              onClick={() => onDecide(item.id, 'rejected', reason.trim())}
            >
              Xác nhận từ chối
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-end gap-2">
          <Button variant="secondary" icon="close" onClick={() => setRejecting(true)}>
            Từ chối
          </Button>
          <Button icon="check" onClick={() => onDecide(item.id, 'approved')}>
            Duyệt
          </Button>
        </div>
      )}
    </article>
  )
}
