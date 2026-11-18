// =============================================================
// eligibility.js — Kiểm tra điều kiện phân công (specs F-10.1, TDD mục 6)
// "Đúng người – đúng xe – đúng hàng": trước khi giao chuyến, hệ thống tự kiểm tra
//   1. Lái xe có rảnh không
//   2. Giấy tờ lái xe còn hạn không
//   3. Khoá học bắt buộc có quá hạn chưa hoàn thành không
//   4. Xe còn hạn đăng kiểm / kiểm định bồn không
//   5. Loại xe có hợp loại hàng không (xe bồn ↔ xăng dầu rời, xe tải ↔ phuy)
//   6. Sức chứa xe có đủ lượng hàng không
//
// Mỗi mục trả về level: 'ok' | 'warn' (cảnh báo, vẫn giao được) | 'block' (chặn)
// =============================================================
import { daysBetween, formatDate, formatNumber } from './format'

// ---------- Đánh giá 1 ngày hết hạn so với hôm nay ----------
// Trả về { level, daysLeft }: đã hết hạn → block; còn ≤ warningDays → warn; còn lại → ok
export function expiryLevel(expires, today, warningDays) {
  if (!expires) return { level: 'ok', daysLeft: null }
  const daysLeft = daysBetween(today, expires)
  if (daysLeft < 0) return { level: 'block', daysLeft }
  if (daysLeft <= warningDays) return { level: 'warn', daysLeft }
  return { level: 'ok', daysLeft }
}

// ---------- Kiểm tra giấy tờ của 1 lái xe → mức xấu nhất + danh sách ----------
export function driverDocStatus(driver, today, warningDays) {
  const items = driver.docs.map((doc) => ({ ...doc, ...expiryLevel(doc.expires, today, warningDays) }))
  return { items, worst: worstLevel(items.map((i) => i.level)) }
}

// Mức "xấu nhất" trong một danh sách: block > warn > ok
export function worstLevel(levels) {
  if (levels.includes('block')) return 'block'
  if (levels.includes('warn')) return 'warn'
  return 'ok'
}

/**
 * Kiểm tra toàn bộ điều kiện giao `trip` cho `driver` lái `vehicle`.
 * @returns { checks: [{ label, level, detail }], canAssign: boolean }
 */
export function checkEligibility({ driver, vehicle, trip, today, warningDays, busyDriverIds }) {
  const checks = []

  // ----- 1. Lái xe rảnh? -----
  if (driver.status === 'off') {
    checks.push({ label: 'Lịch làm việc', level: 'block', detail: 'Lái xe đang nghỉ phép hôm nay.' })
  } else if (busyDriverIds.includes(driver.id)) {
    checks.push({ label: 'Lịch làm việc', level: 'warn', detail: 'Đang có chuyến chưa hoàn tất; chuyến mới sẽ xếp sau.' })
  } else {
    checks.push({ label: 'Lịch làm việc', level: 'ok', detail: 'Sẵn sàng nhận chuyến.' })
  }

  // ----- 2. Giấy tờ lái xe -----
  driver.docs.forEach((doc) => {
    const { level, daysLeft } = expiryLevel(doc.expires, today, warningDays)
    const detail =
      level === 'block'
        ? `Đã hết hạn ${formatDate(doc.expires)}.`
        : level === 'warn'
          ? `Còn ${daysLeft} ngày (hết hạn ${formatDate(doc.expires)}).`
          : `Còn hạn đến ${formatDate(doc.expires)}.`
    checks.push({ label: doc.name, level, detail })
  })

  // ----- 3. Khoá học bắt buộc (chỉ áp dụng khi chở hàng nguy hiểm — mọi chuyến xăng dầu) -----
  driver.courses.forEach((course) => {
    if (course.done) {
      checks.push({ label: `Khoá: ${course.name}`, level: 'ok', detail: 'Đã hoàn thành.' })
      return
    }
    const daysLeft = daysBetween(today, course.due)
    checks.push({
      label: `Khoá: ${course.name}`,
      level: daysLeft < 0 ? 'block' : 'warn',
      detail:
        daysLeft < 0
          ? `Quá hạn từ ${formatDate(course.due)}, chưa hoàn thành.`
          : `Chưa hoàn thành, hạn ${formatDate(course.due)} (còn ${daysLeft} ngày).`,
    })
  })

  // ----- 4–6. Xe (chỉ kiểm khi đã chọn xe) -----
  if (!vehicle) {
    checks.push({ label: 'Xe', level: 'block', detail: 'Chưa chọn xe.' })
  } else {
    // 4. Đăng kiểm & kiểm định bồn
    const reg = expiryLevel(vehicle.registration, today, warningDays)
    checks.push({
      label: 'Đăng kiểm xe',
      level: reg.level,
      detail: reg.level === 'block' ? `Hết hạn ${formatDate(vehicle.registration)}.` : `Hạn ${formatDate(vehicle.registration)}.`,
    })
    if (vehicle.tankInspection) {
      const tank = expiryLevel(vehicle.tankInspection, today, warningDays)
      checks.push({
        label: 'Kiểm định bồn',
        level: tank.level,
        detail:
          tank.level === 'block'
            ? `Hết hạn ${formatDate(vehicle.tankInspection)}.`
            : tank.level === 'warn'
              ? `Còn ${tank.daysLeft} ngày (${formatDate(vehicle.tankInspection)}).`
              : `Hạn ${formatDate(vehicle.tankInspection)}.`,
      })
    }

    // 5. Loại xe ↔ loại hàng
    const needType = trip.cargoType === 'drum' ? 'truck' : 'tanker'
    checks.push({
      label: 'Loại xe phù hợp hàng',
      level: vehicle.type === needType ? 'ok' : 'block',
      detail:
        vehicle.type === needType
          ? needType === 'tanker' ? 'Xe bồn chở xăng dầu rời.' : 'Xe tải thùng chở phuy.'
          : `Hàng "${trip.cargo}" cần ${needType === 'tanker' ? 'xe bồn' : 'xe tải thùng'}.`,
    })

    // 6. Sức chứa
    const unit = vehicle.type === 'tanker' ? 'L' : 'phuy'
    checks.push({
      label: 'Sức chứa',
      level: vehicle.capacity >= trip.quantity ? 'ok' : 'block',
      detail: `Xe ${formatNumber(vehicle.capacity)} ${unit} / cần ${formatNumber(trip.quantity)} ${unit}.`,
    })
  }

  // Được giao khi không có mục nào bị chặn
  return { checks, canAssign: !checks.some((c) => c.level === 'block') }
}
