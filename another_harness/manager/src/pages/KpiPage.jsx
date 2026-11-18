// =============================================================
// KpiPage — "KPI đội" (specs F-04.7: xếp hạng & thưởng)
//   - 3 ô tóm tắt: điểm trung bình đội, tổng thưởng dự kiến, số người dưới 80
//   - Bảng xếp hạng: từng chỉ tiêu, tổng điểm, xếp loại, thưởng
// Tổng điểm tính bằng trọng số ở màn Cấu hình → đổi trọng số là bảng tự xếp lại.
// =============================================================
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import StatCard from '../components/ui/StatCard'
import { KPI_CRITERIA, totalScore, tierOf } from '../lib/kpi'
import { formatMoney, formatScore } from '../lib/format'

export default function KpiPage({ drivers, settings }) {
  // ---------- Tính tổng điểm + xếp loại cho từng người, rồi sắp xếp giảm dần ----------
  const ranking = drivers
    .map((d) => {
      const total = totalScore(d.kpi, settings.kpiWeights)
      return { ...d, total, tier: tierOf(total) }
    })
    .sort((a, b) => b.total - a.total)

  // ---------- Số liệu tóm tắt ----------
  const average = ranking.reduce((s, d) => s + d.total, 0) / ranking.length
  const totalBonus = ranking.reduce((s, d) => s + d.tier.bonus, 0)
  const below80 = ranking.filter((d) => d.total < 80).length

  return (
    <div className="flex flex-col gap-5">
      {/* ===== Ô tóm tắt ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Điểm trung bình đội" value={formatScore(average)} hint="Tháng 11/2026 (tạm tính)" icon="insights" />
        <StatCard label="Tổng thưởng dự kiến" value={formatMoney(totalBonus)} hint={`${ranking.length} lái xe`} icon="payments" tone="secondary" />
        <StatCard label="Dưới mức Tốt (< 80)" value={below80} hint="Cần kèm cặp" icon="trending_down" tone={below80 ? 'error' : 'secondary'} />
      </div>

      {/* ===== Bảng xếp hạng ===== */}
      <Card title="Bảng xếp hạng tháng 11" padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="text-caption-1 text-on-surface-variant border-y border-surface-container">
                <th className="font-medium px-5 py-3 w-12">#</th>
                <th className="font-medium px-3 py-3">Lái xe</th>
                {/* Mỗi chỉ tiêu một cột, kèm trọng số hiện hành */}
                {KPI_CRITERIA.map((c) => (
                  <th key={c.id} className="font-medium px-3 py-3 text-right">
                    {c.name}
                    <div className="text-caption-2 text-outline">{settings.kpiWeights[c.id]}%</div>
                  </th>
                ))}
                <th className="font-medium px-3 py-3 text-right">Tổng</th>
                <th className="font-medium px-5 py-3">Xếp loại · Thưởng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {ranking.map((d, i) => (
                <tr key={d.id} className="hover:bg-surface-container-low/60">
                  {/* Thứ hạng: top 3 tô màu */}
                  <td className="px-5 py-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-footnote font-bold ${
                        i < 3 ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="text-body font-semibold">{d.name}</div>
                    <div className="text-caption-1 text-on-surface-variant">{d.id}</div>
                  </td>

                  {/* Điểm từng chỉ tiêu: < 80 tô cam để thấy điểm yếu */}
                  {KPI_CRITERIA.map((c) => (
                    <td
                      key={c.id}
                      className={`px-3 py-3 text-right tabular-nums text-footnote ${
                        d.kpi[c.id] < 80 ? 'text-tertiary font-semibold' : ''
                      }`}
                    >
                      {formatScore(d.kpi[c.id])}
                    </td>
                  ))}

                  {/* Tổng điểm */}
                  <td className="px-3 py-3 text-right text-headline tabular-nums">{formatScore(d.total)}</td>

                  {/* Xếp loại + thưởng */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Badge className={d.tier.className}>{d.tier.name}</Badge>
                      <span className="text-footnote tabular-nums text-on-surface-variant">
                        {d.tier.bonus ? formatMoney(d.tier.bonus) : '—'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
