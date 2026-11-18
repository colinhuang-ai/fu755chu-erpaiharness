// =============================================================
// KpiSummaryCard — thẻ tổng quan KPI tháng
//   - Bên trái: vòng tròn tiến độ (SVG) với điểm tổng ở giữa
//   - Bên phải: xếp loại, thưởng dự kiến
//   - Dưới cùng: thanh tiến độ tới mức thưởng kế tiếp
// Nhận `kpi` đã tính sẵn từ computeKpi() trong lib/kpi.js
// =============================================================
import Card from '../ui/Card'
import Icon from '../ui/Icon'
import { formatMoney, formatScore } from '../../lib/format'

// ---------- Vòng tròn tiến độ vẽ bằng SVG ----------
// Mẹo: vẽ 2 hình tròn chồng nhau. Hình trên có viền nét đứt (strokeDasharray)
// dài đúng bằng % điểm → trông như vòng tiến độ.
function ScoreRing({ score, size = 112, stroke = 10 }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const filled = (Math.min(score, 100) / 100) * circumference

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {/* -rotate-90: cho vòng bắt đầu từ đỉnh (12 giờ) thay vì bên phải */}
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        {/* Vòng nền xám */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-surface-container-high"
        />
        {/* Vòng điểm màu xanh */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
          className="stroke-secondary transition-[stroke-dasharray] duration-500"
        />
      </svg>

      {/* Điểm số ở giữa vòng */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-title-1 font-bold tabular-nums leading-none">
          {formatScore(score)}
        </span>
        <span className="text-caption-1 text-on-surface-variant">/ 100</span>
      </div>
    </div>
  )
}

export default function KpiSummaryCard({ kpi }) {
  const { total, tier, nextTier, pointsToNext } = kpi

  // % tiến độ trong khoảng giữa bậc hiện tại và bậc kế tiếp (vd: 80 → 90)
  const progressToNext = nextTier
    ? ((total - tier.min) / (nextTier.min - tier.min)) * 100
    : 100

  return (
    <Card className="p-space-md flex flex-col gap-space-md">
      {/* ---------- Hàng trên: vòng điểm + xếp loại / thưởng ---------- */}
      <div className="flex items-center gap-space-lg">
        <ScoreRing score={total} />

        <div className="flex flex-col gap-2 min-w-0">
          {/* Xếp loại */}
          <div>
            <span className="text-caption-1 text-on-surface-variant">Xếp loại tạm tính</span>
            <div className="flex items-center gap-1.5">
              <Icon name="stars" size={20} filled className="text-secondary" />
              <span className="font-display text-title-3">{tier.name}</span>
            </div>
          </div>

          {/* Thưởng dự kiến */}
          <div>
            <span className="text-caption-1 text-on-surface-variant">Thưởng dự kiến</span>
            <div className="text-headline text-secondary tabular-nums">
              {formatMoney(tier.bonus)}
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Tiến độ tới mức thưởng kế tiếp ---------- */}
      {nextTier ? (
        <div className="bg-surface-container-low rounded-lg p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-footnote">
              Còn <b className="tabular-nums">{formatScore(pointsToNext)}</b> điểm để đạt{' '}
              <b>{nextTier.name}</b>
            </span>
            <span className="text-caption-1 font-semibold text-secondary shrink-0">
              {formatMoney(nextTier.bonus)}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
            <div
              className="h-full rounded-full bg-secondary transition-all duration-500"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
        </div>
      ) : (
        <p className="text-footnote text-secondary font-semibold">
          Bạn đang ở mức thưởng cao nhất. Giữ vững nhé!
        </p>
      )}
    </Card>
  )
}
