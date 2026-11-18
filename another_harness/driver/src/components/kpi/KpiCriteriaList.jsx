// =============================================================
// KpiCriteriaList — danh sách 6 chỉ tiêu KPI (kiểu Inset Grouped)
// Mỗi dòng: icon · tên + trọng số · điểm · thanh tiến độ · mũi tên ">"
// Chạm vào một dòng → onSelect(criterion) để mở sheet "Cách tính điểm".
// =============================================================
import Card from '../ui/Card'
import Icon from '../ui/Icon'
import SectionHeader from '../ui/SectionHeader'
import { formatScore } from '../../lib/format'

// Màu thanh điểm theo mức: ≥90 xanh lá, ≥80 xanh dương, còn lại cam
const barColor = (score) =>
  score >= 90 ? 'bg-secondary' : score >= 80 ? 'bg-primary' : 'bg-warning'

export default function KpiCriteriaList({ criteria, onSelect }) {
  return (
    <section className="flex flex-col gap-2">
      <SectionHeader title="Chỉ tiêu & trọng số" />

      <Card as="ul" className="overflow-hidden divide-y divide-surface-container">
        {criteria.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => onSelect(c)}
              className="w-full flex items-center gap-3 px-space-md py-3 text-left active:bg-surface-container transition-colors"
            >
              {/* Icon vuông bo góc có màu (giống app Cài đặt iOS) */}
              <span className="w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                <Icon name={c.icon} size={18} />
              </span>

              {/* Tên + trọng số + thanh điểm */}
              <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-subheadline font-semibold truncate">
                    {c.name}{' '}
                    <span className="text-caption-1 font-normal text-on-surface-variant">
                      {c.weight}%
                    </span>
                  </span>
                  <span className="text-subheadline font-semibold tabular-nums shrink-0">
                    {formatScore(c.score)}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                  <div
                    className={`h-full rounded-full ${barColor(c.score)}`}
                    style={{ width: `${c.score}%` }}
                  />
                </div>
              </div>

              {/* Mũi tên báo có thể chạm xem chi tiết */}
              <Icon name="chevron_right" size={20} className="text-outline-variant" />
            </button>
          </li>
        ))}
      </Card>

      <p className="px-space-md text-footnote text-on-surface-variant">
        Chạm vào từng chỉ tiêu để xem cách tính điểm.
      </p>
    </section>
  )
}
