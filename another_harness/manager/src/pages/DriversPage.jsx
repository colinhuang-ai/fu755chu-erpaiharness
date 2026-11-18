// =============================================================
// DriversPage — "Lái xe" (specs F-10.3)
// Bảng lái xe trong đội: trạng thái, xe, tình trạng giấy tờ, điểm KPI.
// Có ô tìm kiếm theo tên / mã. Bấm một dòng → mở DriverDrawer xem hồ sơ.
// =============================================================
import { useState } from 'react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Icon from '../components/ui/Icon'
import DriverDrawer from '../components/drivers/DriverDrawer'
import { driverDocStatus } from '../lib/eligibility'
import { DRIVER_STATUS, LEVEL } from '../lib/status'
import { totalScore, tierOf } from '../lib/kpi'
import { formatScore, initials } from '../lib/format'

// Chữ hiển thị cho tình trạng giấy tờ theo mức xấu nhất
const DOC_LABEL = { ok: 'Đầy đủ', warn: 'Sắp hết hạn', block: 'Có giấy tờ hết hạn' }

export default function DriversPage({ drivers, settings, today }) {
  // ---------- State giao diện ----------
  const [query, setQuery] = useState('') // ô tìm kiếm
  const [openId, setOpenId] = useState(null) // lái xe đang xem hồ sơ

  // Lọc theo tên hoặc mã (không phân biệt hoa thường)
  const q = query.trim().toLowerCase()
  const rows = drivers.filter((d) => !q || d.name.toLowerCase().includes(q) || d.id.toLowerCase().includes(q))
  const openDriver = drivers.find((d) => d.id === openId)

  return (
    <div className="flex flex-col gap-4">
      {/* ===== Ô tìm kiếm ===== */}
      <label className="relative max-w-sm">
        <span className="sr-only">Tìm lái xe</span>
        <Icon name="search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm theo tên hoặc mã TX-…"
          className="w-full h-10 pl-10 pr-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-body outline-none focus:ring-2 focus:ring-primary/30"
        />
      </label>

      {/* ===== Bảng lái xe ===== */}
      <Card padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="text-caption-1 text-on-surface-variant border-b border-surface-container">
                <th className="font-medium px-5 py-3">Lái xe</th>
                <th className="font-medium px-3 py-3">Trạng thái</th>
                <th className="font-medium px-3 py-3">Xe</th>
                <th className="font-medium px-3 py-3">Giấy tờ</th>
                <th className="font-medium px-3 py-3 text-right">KPI tháng</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {rows.map((d) => {
                const docs = driverDocStatus(d, today, settings.docWarningDays)
                const score = totalScore(d.kpi, settings.kpiWeights)
                const tier = tierOf(score)
                return (
                  <tr
                    key={d.id}
                    onClick={() => setOpenId(d.id)}
                    className="cursor-pointer hover:bg-surface-container-low/60"
                  >
                    {/* Avatar + tên + mã */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-full bg-surface-container-high text-footnote font-semibold flex items-center justify-center">
                          {initials(d.name)}
                        </span>
                        <div>
                          <div className="text-body font-semibold">{d.name}</div>
                          <div className="text-caption-1 text-on-surface-variant">{d.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Trạng thái */}
                    <td className="px-3 py-3">
                      <span className="flex items-center gap-1.5 text-footnote">
                        <span className={`w-2 h-2 rounded-full ${DRIVER_STATUS[d.status].dot}`} />
                        {DRIVER_STATUS[d.status].label}
                      </span>
                    </td>

                    {/* Xe */}
                    <td className="px-3 py-3 text-footnote">{d.vehicleId ?? '—'}</td>

                    {/* Giấy tờ: biểu tượng + chữ theo mức xấu nhất */}
                    <td className="px-3 py-3">
                      <span className={`flex items-center gap-1.5 text-footnote font-semibold ${LEVEL[docs.worst].text}`}>
                        <Icon name={LEVEL[docs.worst].icon} size={18} />
                        {DOC_LABEL[docs.worst]}
                      </span>
                    </td>

                    {/* KPI + xếp loại */}
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-body font-semibold tabular-nums">{formatScore(score)}</span>
                        <Badge className={tier.className}>{tier.name}</Badge>
                      </div>
                    </td>

                    <td className="px-5 py-3 text-right">
                      <Icon name="chevron_right" className="text-outline" />
                    </td>
                  </tr>
                )
              })}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-footnote text-on-surface-variant">
                    Không tìm thấy lái xe phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ===== Hồ sơ chi tiết ===== */}
      {openDriver && (
        <DriverDrawer driver={openDriver} today={today} settings={settings} onClose={() => setOpenId(null)} />
      )}
    </div>
  )
}
