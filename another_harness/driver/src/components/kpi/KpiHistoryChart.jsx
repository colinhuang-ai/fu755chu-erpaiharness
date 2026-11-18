// =============================================================
// KpiHistoryChart — biểu đồ cột điểm KPI 4 tháng gần nhất
// Vẽ bằng div thuần (không cần thư viện chart): chiều cao cột = % điểm.
// Tháng hiện tại tô màu primary, các tháng trước tô xám nhạt.
// =============================================================
import Card from '../ui/Card'
import SectionHeader from '../ui/SectionHeader'
import { formatScore } from '../../lib/format'

// Trục dọc bắt đầu từ 60 điểm (thay vì 0) để thấy rõ chênh lệch giữa các tháng
const AXIS_MIN = 60
const AXIS_MAX = 100

export default function KpiHistoryChart({ history }) {
  return (
    <section className="flex flex-col gap-2">
      <SectionHeader title="Điểm KPI 4 tháng" />

      <Card className="p-space-md">
        {/* Khung cột: các cột đứng cạnh nhau, căn đáy */}
        <div className="flex items-end justify-around gap-3 h-40">
          {history.map((m) => {
            // Quy đổi điểm → % chiều cao trong khoảng [AXIS_MIN, AXIS_MAX]
            const height = ((m.score - AXIS_MIN) / (AXIS_MAX - AXIS_MIN)) * 100

            return (
              <div key={m.label} className="flex-1 h-full flex flex-col items-center justify-end gap-1">
                {/* Số điểm trên đầu cột */}
                <span
                  className={`text-caption-1 tabular-nums ${
                    m.current ? 'text-primary font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  {formatScore(m.score)}
                </span>

                {/* Cột */}
                <div
                  className={`w-full max-w-10 rounded-t-md transition-all duration-500 ${
                    m.current ? 'bg-primary' : 'bg-primary-fixed'
                  }`}
                  style={{ height: `${Math.max(4, height)}%` }}
                  role="img"
                  aria-label={`${m.label}: ${formatScore(m.score)} điểm`}
                />

                {/* Nhãn tháng dưới cột */}
                <span
                  className={`text-caption-1 ${m.current ? 'font-semibold' : 'text-on-surface-variant'}`}
                >
                  {m.label}
                </span>
              </div>
            )
          })}
        </div>
      </Card>
    </section>
  )
}
