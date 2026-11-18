// =============================================================
// ExplanationSheet — form "Gửi giải trình" cho ngày đi muộn / về sớm
// Quy tắc hợp lệ (nút "Gửi" chỉ sáng khi đủ cả 2):
//   1. Đã chọn một lý do
//   2. Mô tả chi tiết dài tối thiểu MIN_DETAIL ký tự
// =============================================================
import { useState } from 'react'
import FormSheet from '../ui/FormSheet'
import { formatFullDate } from '../../lib/format'
import { explanationReasons } from '../../data/mockData'

const MIN_DETAIL = 10

export default function ExplanationSheet({ record, year, month, onClose, onSubmit }) {
  // ---------- State của form ----------
  const [reason, setReason] = useState(null) // lý do đã chọn
  const [detail, setDetail] = useState('') // mô tả chi tiết

  if (!record) return null

  // ---------- Kiểm tra hợp lệ ----------
  const trimmed = detail.trim()
  const isValid = reason !== null && trimmed.length >= MIN_DETAIL

  // ---------- Gửi: trả dữ liệu lên cho component cha lưu vào state ----------
  const handleSubmit = () => {
    if (!isValid) return
    onSubmit(record.day, { reason, detail: trimmed, status: 'pending' })
  }

  return (
    <FormSheet
      open
      onClose={onClose}
      title="Giải trình"
      primaryLabel="Gửi"
      onPrimary={handleSubmit}
      primaryDisabled={!isValid}
    >
      <div className="flex flex-col gap-space-lg pt-2 pb-4">
        {/* ---------- Ngày đang giải trình ---------- */}
        <p className="text-footnote text-on-surface-variant px-1">
          Ngày {formatFullDate(year, month, record.day)} · vào {record.clockIn}
          {record.clockOut && ` · ra ${record.clockOut}`}
        </p>

        {/* ---------- Chọn lý do: các viên thuốc, chọn 1 ---------- */}
        <section className="flex flex-col gap-2">
          <h4 className="px-1 text-caption-2 uppercase tracking-wider text-on-surface-variant">
            Lý do
          </h4>
          <div className="flex flex-wrap gap-2">
            {explanationReasons.map((r) => {
              const selected = r === reason
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  aria-pressed={selected}
                  className={`px-3 h-9 rounded-full text-footnote transition-colors ${
                    selected
                      ? 'bg-primary text-on-primary font-semibold'
                      : 'bg-surface-container-lowest text-on-surface shadow-sm'
                  }`}
                >
                  {r}
                </button>
              )
            })}
          </div>
        </section>

        {/* ---------- Mô tả chi tiết + bộ đếm ký tự ---------- */}
        <section className="flex flex-col gap-2">
          <label
            htmlFor="explain-detail"
            className="px-1 text-caption-2 uppercase tracking-wider text-on-surface-variant"
          >
            Mô tả chi tiết
          </label>
          <textarea
            id="explain-detail"
            rows={4}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="Ví dụ: Tai nạn trên cầu Phú Mỹ, kẹt xe 25 phút."
            className="w-full rounded-xl bg-surface-container-lowest px-space-md py-3 text-body resize-none outline-none focus:ring-2 focus:ring-primary/40"
          />
          {/* Gợi ý còn thiếu bao nhiêu ký tự */}
          <p className="px-1 text-footnote text-on-surface-variant">
            {trimmed.length < MIN_DETAIL
              ? `Cần thêm ${MIN_DETAIL - trimmed.length} ký tự nữa.`
              : 'Quản lý sẽ duyệt giải trình trong 1–2 ngày làm việc.'}
          </p>
        </section>
      </div>
    </FormSheet>
  )
}
