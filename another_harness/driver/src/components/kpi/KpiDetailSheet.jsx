// =============================================================
// KpiDetailSheet — sheet "Cách tính điểm" của 1 chỉ tiêu KPI
// Cho lái xe thấy rõ: công thức, số liệu đầu vào, điểm, và điểm đóng góp vào tổng.
// (specs F-04.6: "xem được cách tính từng điểm")
// =============================================================
import FormSheet from '../ui/FormSheet'
import { formatScore } from '../../lib/format'

// ---------- Một dòng nhãn – giá trị ----------
function Row({ label, value, strong = false }) {
  return (
    <div className="flex items-center justify-between gap-3 min-h-11 px-space-md py-2">
      <span className="text-body">{label}</span>
      <span
        className={`text-body tabular-nums text-right ${
          strong ? 'font-semibold text-on-surface' : 'text-on-surface-variant'
        }`}
      >
        {value}
      </span>
    </div>
  )
}

export default function KpiDetailSheet({ criterion, onClose }) {
  if (!criterion) return null

  return (
    <FormSheet
      open
      onClose={onClose}
      title={criterion.name}
      cancelLabel={null}
      primaryLabel="Xong"
      onPrimary={onClose}
    >
      <div className="flex flex-col gap-space-lg pt-2 pb-4">
        {/* ---------- Công thức ---------- */}
        <section className="flex flex-col gap-1.5">
          <h4 className="px-space-md text-caption-2 uppercase tracking-wider text-on-surface-variant">
            Công thức
          </h4>
          <p className="bg-surface-container-lowest rounded-xl px-space-md py-3 text-body">
            {criterion.formula}
          </p>
          <p className="px-space-md text-footnote text-on-surface-variant">{criterion.source}</p>
        </section>

        {/* ---------- Số liệu đầu vào ---------- */}
        <section className="flex flex-col gap-1.5">
          <h4 className="px-space-md text-caption-2 uppercase tracking-wider text-on-surface-variant">
            Số liệu tháng này
          </h4>
          <div className="bg-surface-container-lowest rounded-xl divide-y divide-surface-container">
            {criterion.inputs.map((input) => (
              <Row key={input.label} label={input.label} value={input.value} />
            ))}
          </div>
        </section>

        {/* ---------- Kết quả: điểm × trọng số = đóng góp ---------- */}
        <section className="flex flex-col gap-1.5">
          <h4 className="px-space-md text-caption-2 uppercase tracking-wider text-on-surface-variant">
            Kết quả
          </h4>
          <div className="bg-surface-container-lowest rounded-xl divide-y divide-surface-container">
            <Row label="Điểm chỉ tiêu" value={`${formatScore(criterion.score)} / 100`} />
            <Row label="Trọng số" value={`${criterion.weight}%`} />
            <Row
              label="Đóng góp vào tổng"
              value={`${formatScore(criterion.contribution)} điểm`}
              strong
            />
          </div>
        </section>
      </div>
    </FormSheet>
  )
}
