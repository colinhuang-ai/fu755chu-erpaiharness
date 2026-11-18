// =============================================================
// AssignDrawer — panel "Phân công chuyến" (specs F-10.1)
// Quy trình:
//   1. Chọn lái xe (danh sách có chấm màu tình trạng giấy tờ)
//   2. Chọn xe (mặc định = xe đang gán cho lái xe đó)
//   3. Hệ thống TỰ KIỂM TRA điều kiện (lib/eligibility.js) và hiện từng mục
//   4. Nút "Giao chuyến" chỉ bấm được khi không có mục nào bị CHẶN
// =============================================================
import { useState } from 'react'
import Drawer from '../ui/Drawer'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import { checkEligibility, driverDocStatus } from '../../lib/eligibility'
import { LEVEL, DRIVER_STATUS } from '../../lib/status'
import { formatQuantity, initials } from '../../lib/format'

export default function AssignDrawer({ trip, drivers, vehicles, trips, settings, today, onClose, onAssign }) {
  // ---------- State: lái xe & xe đang chọn ----------
  const [driverId, setDriverId] = useState(trip.driverId)
  const [vehicleId, setVehicleId] = useState(trip.vehicleId)

  const driver = drivers.find((d) => d.id === driverId) ?? null
  const vehicle = vehicles.find((v) => v.id === vehicleId) ?? null

  // Lái xe đang có chuyến dở dang (chưa hoàn tất, không tính chuyến đang phân công)
  const busyDriverIds = trips
    .filter((t) => t.code !== trip.code && t.driverId && t.status !== 'done' && t.status !== 'unassigned')
    .map((t) => t.driverId)

  // ---------- Chạy kiểm tra điều kiện mỗi lần đổi lựa chọn ----------
  const result = driver
    ? checkEligibility({ driver, vehicle, trip, today, warningDays: settings.docWarningDays, busyDriverIds })
    : null

  // Chọn lái xe → tự điền xe đang gán cho họ (nếu có)
  const pickDriver = (d) => {
    setDriverId(d.id)
    if (d.vehicleId) setVehicleId(d.vehicleId)
  }

  const blockedCount = result ? result.checks.filter((c) => c.level === 'block').length : 0

  return (
    <Drawer
      open
      onClose={onClose}
      title={`Phân công ${trip.code}`}
      subtitle={`${trip.from} → ${trip.to} · ${trip.cargo} · ${formatQuantity(trip)} · giao ${trip.due}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button
            icon="assignment_ind"
            disabled={!result?.canAssign}
            onClick={() => onAssign(trip.code, driverId, vehicleId)}
          >
            Giao chuyến
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        {/* ===== Bước 1: Chọn lái xe ===== */}
        <section className="flex flex-col gap-2">
          <h3 className="text-caption-2 uppercase tracking-wider text-on-surface-variant">1. Lái xe</h3>
          <ul className="flex flex-col gap-1.5">
            {drivers.map((d) => {
              const docs = driverDocStatus(d, today, settings.docWarningDays)
              const selected = d.id === driverId
              return (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => pickDriver(d)}
                    aria-pressed={selected}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg border text-left transition-colors ${
                      selected
                        ? 'border-primary bg-primary-fixed/40'
                        : 'border-surface-container bg-surface-container-lowest hover:border-outline-variant'
                    }`}
                  >
                    {/* Avatar chữ cái */}
                    <span className="w-9 h-9 rounded-full bg-surface-container-high text-footnote font-semibold flex items-center justify-center shrink-0">
                      {initials(d.name)}
                    </span>
                    {/* Tên + trạng thái + xe */}
                    <div className="flex-1 min-w-0">
                      <div className="text-body font-semibold truncate">{d.name}</div>
                      <div className="text-caption-1 text-on-surface-variant flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${DRIVER_STATUS[d.status].dot}`} />
                        {DRIVER_STATUS[d.status].label} · {d.vehicleId ?? 'Chưa gán xe'}
                      </div>
                    </div>
                    {/* Tình trạng giấy tờ (biểu tượng mức xấu nhất) */}
                    <Icon
                      name={LEVEL[docs.worst].icon}
                      size={20}
                      className={LEVEL[docs.worst].text}
                    />
                  </button>
                </li>
              )
            })}
          </ul>
        </section>

        {/* ===== Bước 2: Chọn xe ===== */}
        <section className="flex flex-col gap-2">
          <label htmlFor="assign-vehicle" className="text-caption-2 uppercase tracking-wider text-on-surface-variant">
            2. Xe
          </label>
          <select
            id="assign-vehicle"
            value={vehicleId ?? ''}
            onChange={(e) => setVehicleId(e.target.value || null)}
            className="h-10 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-body"
          >
            <option value="">— Chọn xe —</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.id} · {v.type === 'tanker' ? `Xe bồn ${v.capacity.toLocaleString('vi-VN')} L` : `Xe tải ${v.capacity} phuy`}
              </option>
            ))}
          </select>
        </section>

        {/* ===== Bước 3: Kết quả kiểm tra điều kiện ===== */}
        <section className="flex flex-col gap-2">
          <h3 className="text-caption-2 uppercase tracking-wider text-on-surface-variant">
            3. Kiểm tra điều kiện tự động
          </h3>

          {!result ? (
            <p className="text-footnote text-on-surface-variant">Chọn lái xe để bắt đầu kiểm tra.</p>
          ) : (
            <>
              {/* Kết luận chung */}
              <div
                className={`flex items-center gap-2 p-3 rounded-lg ${
                  result.canAssign ? LEVEL.ok.bg : LEVEL.block.bg
                }`}
              >
                <Icon
                  name={result.canAssign ? 'verified' : 'gpp_bad'}
                  className={result.canAssign ? LEVEL.ok.text : LEVEL.block.text}
                />
                <span className="text-footnote font-semibold">
                  {result.canAssign
                    ? 'Đủ điều kiện giao chuyến.'
                    : `Không thể giao: ${blockedCount} điều kiện bị chặn.`}
                </span>
              </div>

              {/* Từng mục kiểm tra */}
              <ul className="rounded-lg border border-surface-container bg-surface-container-lowest divide-y divide-surface-container">
                {result.checks.map((c) => (
                  <li key={c.label} className="flex items-start gap-2.5 px-3 py-2.5">
                    <Icon name={LEVEL[c.level].icon} size={18} className={`${LEVEL[c.level].text} mt-0.5`} />
                    <div className="min-w-0">
                      <div className="text-footnote font-semibold">{c.label}</div>
                      <div className="text-caption-1 text-on-surface-variant">{c.detail}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </Drawer>
  )
}
