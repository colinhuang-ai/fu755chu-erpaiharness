// =============================================================
// DashboardPage — "Tổng quan" trong ngày cho quản lý đội
//   1. 5 ô số liệu: chuyến hôm nay, đang thực hiện, trễ hẹn, chưa phân công, chờ duyệt
//      (bấm ô → nhảy tới màn liên quan)
//   2. Chuyến đang thực hiện (cái nào trễ lên đầu)
//   3. Cảnh báo tuân thủ: giấy tờ / khoá học / đăng kiểm hết hạn hoặc sắp hết
//   4. Tình trạng lái xe: đang chạy / sẵn sàng / nghỉ
// =============================================================
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import StatCard from '../components/ui/StatCard'
import { TRIP_STATUS, DRIVER_STATUS, LEVEL } from '../lib/status'
import { expiryLevel } from '../lib/eligibility'
import { daysBetween, formatDate, formatQuantity } from '../lib/format'

const IN_PROGRESS = ['waiting', 'accepted', 'loading', 'running', 'unloading']

// ---------- Gom mọi cảnh báo tuân thủ của lái xe + xe thành một danh sách ----------
function buildComplianceAlerts(drivers, vehicles, today, warningDays) {
  const alerts = []

  // Giấy tờ & khoá học của lái xe
  drivers.forEach((d) => {
    d.docs.forEach((doc) => {
      const { level, daysLeft } = expiryLevel(doc.expires, today, warningDays)
      if (level !== 'ok') alerts.push({ who: d.name, what: doc.name, level, daysLeft, date: doc.expires })
    })
    d.courses
      .filter((c) => !c.done)
      .forEach((c) => {
        const daysLeft = daysBetween(today, c.due)
        if (daysLeft <= warningDays) {
          alerts.push({ who: d.name, what: `Khoá ${c.name}`, level: daysLeft < 0 ? 'block' : 'warn', daysLeft, date: c.due })
        }
      })
  })

  // Đăng kiểm & kiểm định bồn của xe
  vehicles.forEach((v) => {
    ;[
      ['Đăng kiểm', v.registration],
      ['Kiểm định bồn', v.tankInspection],
    ].forEach(([what, date]) => {
      const { level, daysLeft } = expiryLevel(date, today, warningDays)
      if (level !== 'ok') alerts.push({ who: v.id, what, level, daysLeft, date })
    })
  })

  // Mục bị chặn lên trước, sau đó theo số ngày còn lại tăng dần
  return alerts.sort((a, b) => (a.level === b.level ? a.daysLeft - b.daysLeft : a.level === 'block' ? -1 : 1))
}

export default function DashboardPage({ trips, drivers, vehicles, approvals, settings, today, onNavigate }) {
  // ---------- Số liệu tổng hợp ----------
  const active = trips.filter((t) => IN_PROGRESS.includes(t.status))
  const late = trips.filter((t) => t.delayMinutes > 0 && t.status !== 'done')
  const unassigned = trips.filter((t) => t.status === 'unassigned')
  const doneCount = trips.filter((t) => t.status === 'done').length
  const pending = approvals.filter((a) => a.status === 'pending')
  const alerts = buildComplianceAlerts(drivers, vehicles, today, settings.docWarningDays)

  // Chuyến đang thực hiện: chuyến trễ lên đầu, rồi theo giờ giao
  const activeSorted = [...active].sort((a, b) => b.delayMinutes - a.delayMinutes || a.due.localeCompare(b.due))
  const driverName = (id) => drivers.find((d) => d.id === id)?.name ?? '—'

  return (
    <div className="flex flex-col gap-5">
      {/* ===== 1. Ô số liệu ===== */}
      {/* 2 cột trên điện thoại, 5 cột trên màn rộng */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
        <StatCard label="Chuyến hôm nay" value={trips.length} hint={`${doneCount} đã hoàn tất`} icon="local_shipping" onClick={() => onNavigate('trips')} />
        <StatCard label="Đang thực hiện" value={active.length} hint="Chờ nhận → đang xả" icon="route" onClick={() => onNavigate('trips', { filter: 'active' })} />
        <StatCard label="Trễ hẹn" value={late.length} hint={late.length ? 'Cần liên hệ' : 'Không có'} icon="schedule" tone={late.length ? 'error' : 'secondary'} onClick={() => onNavigate('trips', { filter: 'active' })} />
        <StatCard label="Chưa phân công" value={unassigned.length} hint="Lệnh chờ giao người" icon="assignment_late" tone={unassigned.length ? 'tertiary' : 'secondary'} onClick={() => onNavigate('trips', { filter: 'unassigned' })} />
        <StatCard label="Chờ duyệt" value={pending.length} hint="Giải trình, chi phí…" icon="inbox" tone={pending.length ? 'tertiary' : 'secondary'} onClick={() => onNavigate('approvals')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* ===== 2. Chuyến đang thực hiện (rộng 3/5) ===== */}
        <Card
          title="Chuyến đang thực hiện"
          className="lg:col-span-3"
          padded={false}
          action={<Button variant="ghost" onClick={() => onNavigate('trips')}>Xem tất cả</Button>}
        >
          <ul className="divide-y divide-surface-container border-t border-surface-container">
            {activeSorted.map((t) => (
              <li key={t.code} className="px-5 py-3 flex items-center gap-3">
                {/* Giờ giao hẹn */}
                <div className="w-14 shrink-0 text-center">
                  <div className="text-headline tabular-nums">{t.due}</div>
                  <div className="text-caption-2 text-on-surface-variant">giao</div>
                </div>
                {/* Tuyến + lái xe */}
                <div className="flex-1 min-w-0">
                  <div className="text-body font-semibold truncate">{t.to}</div>
                  <div className="text-caption-1 text-on-surface-variant truncate">
                    {t.code} · {driverName(t.driverId)} · {t.vehicleId} · {formatQuantity(t)}
                  </div>
                </div>
                {/* Trạng thái + cờ trễ */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Badge className={TRIP_STATUS[t.status].className}>{TRIP_STATUS[t.status].label}</Badge>
                  {t.delayMinutes > 0 && (
                    <span className="text-caption-1 font-semibold text-error">Trễ {t.delayMinutes} phút</span>
                  )}
                </div>
              </li>
            ))}
            {activeSorted.length === 0 && (
              <li className="px-5 py-8 text-center text-footnote text-on-surface-variant">Không có chuyến nào đang chạy.</li>
            )}
          </ul>
        </Card>

        {/* ===== 3. Cảnh báo tuân thủ (rộng 2/5) ===== */}
        <Card
          title="Cảnh báo tuân thủ"
          className="lg:col-span-2"
          padded={false}
          action={<Badge className="bg-error-container text-on-error-container">{alerts.length}</Badge>}
        >
          <ul className="divide-y divide-surface-container border-t border-surface-container max-h-[360px] overflow-y-auto">
            {alerts.map((a) => (
              <li key={`${a.who}-${a.what}`} className="px-5 py-3 flex items-start gap-2.5">
                <Icon name={LEVEL[a.level].icon} size={18} className={`${LEVEL[a.level].text} mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <div className="text-footnote font-semibold">{a.what}</div>
                  <div className="text-caption-1 text-on-surface-variant">{a.who}</div>
                </div>
                <span className={`text-caption-1 font-semibold text-right shrink-0 ${LEVEL[a.level].text}`}>
                  {a.daysLeft < 0 ? `Quá hạn ${-a.daysLeft} ngày` : `Còn ${a.daysLeft} ngày`}
                  <div className="font-normal text-on-surface-variant">{formatDate(a.date)}</div>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* ===== 4. Tình trạng lái xe ===== */}
      <Card title="Lái xe hôm nay" action={<Button variant="ghost" onClick={() => onNavigate('drivers')}>Danh sách</Button>}>
        <div className="flex flex-wrap gap-2">
          {drivers.map((d) => (
            <span
              key={d.id}
              className="inline-flex items-center gap-2 h-9 px-3 rounded-full bg-surface-container-low text-footnote"
            >
              <span className={`w-2 h-2 rounded-full ${DRIVER_STATUS[d.status].dot}`} />
              <span className="font-semibold">{d.name}</span>
              <span className="text-on-surface-variant">{DRIVER_STATUS[d.status].label}</span>
            </span>
          ))}
        </div>
      </Card>
    </div>
  )
}
