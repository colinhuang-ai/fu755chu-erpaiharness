// =============================================================
// DriverDrawer — hồ sơ chi tiết 1 lái xe (specs F-10.3)
//   - Thông tin liên hệ (gọi bằng link tel:)
//   - Giấy tờ & hạn (màu theo mức: còn hạn / sắp hết / hết hạn)
//   - Khoá học bắt buộc
//   - KPI tháng theo từng chỉ tiêu
// =============================================================
import Drawer from '../ui/Drawer'
import Badge from '../ui/Badge'
import Icon from '../ui/Icon'
import { driverDocStatus } from '../../lib/eligibility'
import { LEVEL, DRIVER_STATUS } from '../../lib/status'
import { KPI_CRITERIA, totalScore, tierOf } from '../../lib/kpi'
import { daysBetween, formatDate, formatScore } from '../../lib/format'

// ---------- Tiêu đề nhóm nhỏ ----------
const SectionTitle = ({ children }) => (
  <h3 className="text-caption-2 uppercase tracking-wider text-on-surface-variant">{children}</h3>
)

export default function DriverDrawer({ driver, today, settings, onClose }) {
  const docs = driverDocStatus(driver, today, settings.docWarningDays)
  const total = totalScore(driver.kpi, settings.kpiWeights)
  const tier = tierOf(total)

  return (
    <Drawer
      open
      onClose={onClose}
      title={driver.name}
      subtitle={`${driver.id} · GPLX hạng ${driver.license} · vào làm ${formatDate(driver.joined)}`}
    >
      <div className="flex flex-col gap-6">
        {/* ===== Tóm tắt: trạng thái, xe, liên hệ ===== */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-surface-container-lowest border border-surface-container p-3">
            <div className="text-caption-1 text-on-surface-variant">Trạng thái</div>
            <div className="text-body font-semibold flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${DRIVER_STATUS[driver.status].dot}`} />
              {DRIVER_STATUS[driver.status].label}
            </div>
          </div>
          <div className="rounded-lg bg-surface-container-lowest border border-surface-container p-3">
            <div className="text-caption-1 text-on-surface-variant">Xe được gán</div>
            <div className="text-body font-semibold">{driver.vehicleId ?? '—'}</div>
          </div>
          {/* Gọi điện: dùng link tel: (không bịa dịch vụ thật) */}
          <a
            href={`tel:${driver.phone.replace(/\s/g, '')}`}
            className="col-span-2 rounded-lg bg-primary-fixed/50 text-primary p-3 flex items-center gap-2 font-semibold hover:bg-primary-fixed"
          >
            <Icon name="call" size={20} />
            Gọi {driver.phone}
          </a>
        </div>

        {/* ===== Giấy tờ ===== */}
        <section className="flex flex-col gap-2">
          <SectionTitle>Giấy tờ & chứng chỉ</SectionTitle>
          <ul className="rounded-lg border border-surface-container bg-surface-container-lowest divide-y divide-surface-container">
            {docs.items.map((doc) => (
              <li key={doc.name} className="flex items-center gap-2.5 px-3 py-2.5">
                <Icon name={LEVEL[doc.level].icon} size={18} className={LEVEL[doc.level].text} />
                <span className="flex-1 text-footnote">{doc.name}</span>
                <span className={`text-caption-1 font-semibold tabular-nums ${LEVEL[doc.level].text}`}>
                  {doc.level === 'block'
                    ? `Hết hạn ${formatDate(doc.expires)}`
                    : doc.level === 'warn'
                      ? `Còn ${doc.daysLeft} ngày`
                      : formatDate(doc.expires)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ===== Khoá học bắt buộc ===== */}
        <section className="flex flex-col gap-2">
          <SectionTitle>Khoá học bắt buộc</SectionTitle>
          <ul className="rounded-lg border border-surface-container bg-surface-container-lowest divide-y divide-surface-container">
            {driver.courses.map((c) => {
              // Mức: xong → ok; chưa xong & quá hạn → block; chưa xong còn hạn → warn
              const level = c.done ? 'ok' : daysBetween(today, c.due) < 0 ? 'block' : 'warn'
              return (
                <li key={c.name} className="flex items-center gap-2.5 px-3 py-2.5">
                  <Icon name={LEVEL[level].icon} size={18} className={LEVEL[level].text} />
                  <span className="flex-1 text-footnote">{c.name}</span>
                  <span className={`text-caption-1 font-semibold ${LEVEL[level].text}`}>
                    {c.done ? 'Đã xong' : level === 'block' ? `Quá hạn ${formatDate(c.due)}` : `Hạn ${formatDate(c.due)}`}
                  </span>
                </li>
              )
            })}
          </ul>
        </section>

        {/* ===== KPI tháng ===== */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <SectionTitle>KPI tháng 11</SectionTitle>
            <div className="flex items-center gap-2">
              <span className="text-headline tabular-nums">{formatScore(total)}</span>
              <Badge className={tier.className}>{tier.name}</Badge>
            </div>
          </div>
          <ul className="rounded-lg border border-surface-container bg-surface-container-lowest divide-y divide-surface-container">
            {KPI_CRITERIA.map((c) => (
              <li key={c.id} className="px-3 py-2.5 flex flex-col gap-1.5">
                <div className="flex justify-between text-footnote">
                  <span>
                    {c.name}{' '}
                    <span className="text-on-surface-variant">{settings.kpiWeights[c.id]}%</span>
                  </span>
                  <span className="font-semibold tabular-nums">{formatScore(driver.kpi[c.id])}</span>
                </div>
                {/* Thanh điểm: < 80 tô cam để quản lý dễ thấy điểm yếu */}
                <div className="h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                  <div
                    className={`h-full rounded-full ${driver.kpi[c.id] >= 80 ? 'bg-primary' : 'bg-warning'}`}
                    style={{ width: `${driver.kpi[c.id]}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Drawer>
  )
}
