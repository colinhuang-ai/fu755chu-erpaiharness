// =============================================================
// TripsPage — "Chuyến & phân công" (specs F-10.1)
//   - Bộ lọc nhanh dạng viên thuốc: Tất cả / Chưa phân công / Đang thực hiện / Hoàn tất
//   - Bảng chuyến hôm nay: mã, tuyến, hàng, lái xe – xe, giờ giao, trạng thái
//   - Chuyến chưa phân công / chờ nhận có nút mở AssignDrawer
// =============================================================
import { useState } from 'react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import AssignDrawer from '../components/trips/AssignDrawer'
import { TRIP_STATUS } from '../lib/status'
import { formatQuantity } from '../lib/format'

// Trạng thái thuộc nhóm "đang thực hiện"
const IN_PROGRESS = ['waiting', 'accepted', 'loading', 'running', 'unloading']

// ---------- Định nghĩa các bộ lọc ----------
const FILTERS = [
  { id: 'all', label: 'Tất cả', match: () => true },
  { id: 'unassigned', label: 'Chưa phân công', match: (t) => t.status === 'unassigned' },
  { id: 'active', label: 'Đang thực hiện', match: (t) => IN_PROGRESS.includes(t.status) },
  { id: 'done', label: 'Hoàn tất', match: (t) => t.status === 'done' },
]

export default function TripsPage({ trips, drivers, vehicles, settings, today, onAssign, initialFilter = 'all' }) {
  // ---------- State giao diện ----------
  const [filter, setFilter] = useState(initialFilter)
  const [assigning, setAssigning] = useState(null) // mã chuyến đang phân công

  const activeFilter = FILTERS.find((f) => f.id === filter)
  const rows = trips.filter(activeFilter.match)
  const driverName = (id) => drivers.find((d) => d.id === id)?.name ?? '—'
  const assigningTrip = trips.find((t) => t.code === assigning)

  return (
    <div className="flex flex-col gap-4">
      {/* ===== Bộ lọc ===== */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Lọc chuyến">
        {FILTERS.map((f) => {
          const count = trips.filter(f.match).length
          const active = f.id === filter
          return (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f.id)}
              className={`h-9 px-3.5 rounded-full text-footnote font-semibold flex items-center gap-1.5 transition-colors ${
                active
                  ? 'bg-on-surface text-surface'
                  : 'bg-surface-container-lowest border border-surface-container text-on-surface-variant hover:border-outline-variant'
              }`}
            >
              {f.label}
              <span className={`tabular-nums ${active ? 'opacity-70' : 'text-outline'}`}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* ===== Bảng chuyến ===== */}
      <Card padded={false}>
        {/* overflow-x-auto: màn hẹp thì bảng cuộn ngang thay vì vỡ layout */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left">
            <thead>
              <tr className="text-caption-1 text-on-surface-variant border-b border-surface-container">
                <th className="font-medium px-5 py-3">Mã chuyến</th>
                <th className="font-medium px-3 py-3">Tuyến</th>
                <th className="font-medium px-3 py-3">Hàng</th>
                <th className="font-medium px-3 py-3">Lái xe · Xe</th>
                <th className="font-medium px-3 py-3">Giờ giao</th>
                <th className="font-medium px-3 py-3">Trạng thái</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {rows.map((t) => (
                <tr key={t.code} className="hover:bg-surface-container-low/60">
                  {/* Mã chuyến */}
                  <td className="px-5 py-3 font-mono text-footnote">{t.code}</td>

                  {/* Tuyến: điểm lấy → điểm giao */}
                  <td className="px-3 py-3">
                    <div className="text-footnote text-on-surface-variant">{t.from}</div>
                    <div className="text-body font-semibold">{t.to}</div>
                  </td>

                  {/* Hàng hoá + khối lượng + km */}
                  <td className="px-3 py-3">
                    <div className="text-body">{t.cargo}</div>
                    <div className="text-caption-1 text-on-surface-variant tabular-nums">
                      {formatQuantity(t)} · {t.km} km
                    </div>
                  </td>

                  {/* Lái xe + biển số */}
                  <td className="px-3 py-3">
                    {t.driverId ? (
                      <>
                        <div className="text-body">{driverName(t.driverId)}</div>
                        <div className="text-caption-1 text-on-surface-variant">{t.vehicleId}</div>
                      </>
                    ) : (
                      <span className="text-footnote text-outline">Chưa có</span>
                    )}
                  </td>

                  {/* Giờ giao + cờ trễ */}
                  <td className="px-3 py-3">
                    <div className="text-body tabular-nums font-semibold">{t.due}</div>
                    {t.delayMinutes > 0 && (
                      <div className="text-caption-1 text-error font-semibold">Trễ {t.delayMinutes} phút</div>
                    )}
                  </td>

                  {/* Trạng thái */}
                  <td className="px-3 py-3">
                    <Badge className={TRIP_STATUS[t.status].className}>{TRIP_STATUS[t.status].label}</Badge>
                  </td>

                  {/* Hành động: phân công (chưa giao) hoặc đổi người (chờ nhận) */}
                  <td className="px-5 py-3 text-right">
                    {t.status === 'unassigned' && (
                      <Button icon="assignment_ind" onClick={() => setAssigning(t.code)}>
                        Phân công
                      </Button>
                    )}
                    {t.status === 'waiting' && (
                      <Button variant="ghost" onClick={() => setAssigning(t.code)}>
                        Đổi người
                      </Button>
                    )}
                  </td>
                </tr>
              ))}

              {/* Không có dòng nào khớp bộ lọc */}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-footnote text-on-surface-variant">
                    Không có chuyến nào ở mục này.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ===== Panel phân công (key = mã chuyến để form trống lại khi đổi chuyến) ===== */}
      {assigningTrip && (
        <AssignDrawer
          key={assigningTrip.code}
          trip={assigningTrip}
          drivers={drivers}
          vehicles={vehicles}
          trips={trips}
          settings={settings}
          today={today}
          onClose={() => setAssigning(null)}
          onAssign={(code, driverId, vehicleId) => {
            onAssign(code, driverId, vehicleId)
            setAssigning(null)
          }}
        />
      )}
    </div>
  )
}
