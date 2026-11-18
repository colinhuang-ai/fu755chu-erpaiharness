// =============================================================
// KpiAppealSheet — form "Khiếu nại KPI" (specs F-04.8)
// Hợp lệ khi: đã chọn chỉ tiêu + nội dung ≥ MIN_CONTENT ký tự.
// =============================================================
import { useState } from 'react'
import FormSheet from '../ui/FormSheet'
import { formatScore } from '../../lib/format'

const MIN_CONTENT = 20

export default function KpiAppealSheet({ open, criteria, onClose, onSubmit }) {
  // ---------- State của form ----------
  const [criterionId, setCriterionId] = useState(null)
  const [content, setContent] = useState('')

  const trimmed = content.trim()
  const isValid = criterionId !== null && trimmed.length >= MIN_CONTENT

  const handleSubmit = () => {
    if (!isValid) return
    const criterion = criteria.find((c) => c.id === criterionId)
    onSubmit({ criterionId, criterionName: criterion.name, content: trimmed })
  }

  return (
    <FormSheet
      open={open}
      onClose={onClose}
      title="Khiếu nại KPI"
      primaryLabel="Gửi"
      onPrimary={handleSubmit}
      primaryDisabled={!isValid}
    >
      <div className="flex flex-col gap-space-lg pt-2 pb-4">
        {/* ---------- Chọn chỉ tiêu muốn khiếu nại (kiểu vòng tròn đánh dấu iOS) ---------- */}
        <section className="flex flex-col gap-1.5">
          <h4 className="px-space-md text-caption-2 uppercase tracking-wider text-on-surface-variant">
            Chỉ tiêu khiếu nại
          </h4>
          <ul className="bg-surface-container-lowest rounded-xl divide-y divide-surface-container overflow-hidden">
            {criteria.map((c) => {
              const selected = c.id === criterionId
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setCriterionId(c.id)}
                    aria-pressed={selected}
                    className="w-full min-h-11 flex items-center gap-3 px-space-md py-2 text-left active:bg-surface-container"
                  >
                    {/* Vòng tròn: rỗng khi chưa chọn, tô xanh + dấu tích khi chọn */}
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        selected ? 'border-primary bg-primary' : 'border-outline-variant'
                      }`}
                    >
                      {selected && <span className="w-2 h-2 rounded-full bg-on-primary" />}
                    </span>
                    <span className="flex-1 text-body">{c.name}</span>
                    <span className="text-body text-on-surface-variant tabular-nums">
                      {formatScore(c.score)}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>

        {/* ---------- Nội dung khiếu nại ---------- */}
        <section className="flex flex-col gap-1.5">
          <label
            htmlFor="appeal-content"
            className="px-space-md text-caption-2 uppercase tracking-wider text-on-surface-variant"
          >
            Nội dung & bằng chứng
          </label>
          <textarea
            id="appeal-content"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ví dụ: Chuyến CH-20261105-01 giao trễ do kho xuất hàng chậm 40 phút, có xác nhận của thủ kho."
            className="w-full rounded-xl bg-surface-container-lowest px-space-md py-3 text-body resize-none outline-none focus:ring-2 focus:ring-primary/40"
          />
          <p className="px-space-md text-footnote text-on-surface-variant">
            {trimmed.length < MIN_CONTENT
              ? `Cần thêm ${MIN_CONTENT - trimmed.length} ký tự nữa.`
              : 'Khiếu nại được gửi tới quản lý đội và phản hồi trong 3 ngày làm việc.'}
          </p>
        </section>
      </div>
    </FormSheet>
  )
}
