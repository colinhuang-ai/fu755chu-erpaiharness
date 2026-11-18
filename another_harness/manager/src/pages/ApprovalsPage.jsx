// =============================================================
// ApprovalsPage — "Hàng đợi duyệt"
// Gom mọi yêu cầu cần quản lý quyết định vào một chỗ:
//   giải trình chấm công (F-04.2) · chi phí (F-05.6) · khiếu nại KPI (F-04.8) · nghỉ phép (F-04.5)
// Lọc theo loại ở trên; phần "Chờ duyệt" trước, "Đã xử lý" sau.
// =============================================================
import { useState } from 'react'
import ApprovalCard from '../components/approvals/ApprovalCard'
import { APPROVAL_TYPE } from '../lib/status'

export default function ApprovalsPage({ approvals, drivers, onDecide }) {
  // ---------- State: loại đang lọc ('all' hoặc 1 key của APPROVAL_TYPE) ----------
  const [type, setType] = useState('all')

  const driverName = (id) => drivers.find((d) => d.id === id)?.name ?? id
  const visible = approvals.filter((a) => type === 'all' || a.type === type)
  const pending = visible.filter((a) => a.status === 'pending')
  const done = visible.filter((a) => a.status !== 'pending')

  // Các nút lọc: "Tất cả" + từng loại, kèm số yêu cầu đang chờ
  const tabs = [
    { id: 'all', label: 'Tất cả' },
    ...Object.entries(APPROVAL_TYPE).map(([id, t]) => ({ id, label: t.label })),
  ]
  const pendingCount = (id) =>
    approvals.filter((a) => a.status === 'pending' && (id === 'all' || a.type === id)).length

  return (
    <div className="flex flex-col gap-5 max-w-3xl">
      {/* ===== Bộ lọc theo loại ===== */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Lọc loại yêu cầu">
        {tabs.map((t) => {
          const active = t.id === type
          const count = pendingCount(t.id)
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setType(t.id)}
              className={`h-9 px-3.5 rounded-full text-footnote font-semibold flex items-center gap-1.5 transition-colors ${
                active
                  ? 'bg-on-surface text-surface'
                  : 'bg-surface-container-lowest border border-surface-container text-on-surface-variant hover:border-outline-variant'
              }`}
            >
              {t.label}
              {count > 0 && (
                <span className="min-w-5 h-5 px-1.5 rounded-full bg-error text-on-error text-caption-2 flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ===== Chờ duyệt ===== */}
      <section className="flex flex-col gap-3">
        <h2 className="text-caption-2 uppercase tracking-wider text-on-surface-variant">
          Chờ duyệt ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="text-footnote text-on-surface-variant bg-surface-container-lowest rounded-xl border border-surface-container p-6 text-center">
            Không còn yêu cầu nào cần duyệt. 🎉
          </p>
        ) : (
          pending.map((a) => (
            <ApprovalCard key={a.id} item={a} driverName={driverName(a.driverId)} onDecide={onDecide} />
          ))
        )}
      </section>

      {/* ===== Đã xử lý trong phiên ===== */}
      {done.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-caption-2 uppercase tracking-wider text-on-surface-variant">
            Đã xử lý ({done.length})
          </h2>
          {done.map((a) => (
            <ApprovalCard key={a.id} item={a} driverName={driverName(a.driverId)} onDecide={onDecide} />
          ))}
        </section>
      )}
    </div>
  )
}
