// =============================================================
// kpi.js — Tính điểm KPI tháng (theo specs/prompt-driveros.md mục 6)
//
// Trọng số: Chuyên cần 20% · Giao đúng hẹn 20% · Hao hụt 20%
//           An toàn 15% · Tiêu hao nhiên liệu 15% · Tuân thủ quy trình 10%
// Mức thưởng: ≥90 Xuất sắc 2.000.000 ₫ · ≥80 Tốt 1.200.000 ₫ · ≥70 Khá 600.000 ₫
//
// Chuyên cần TÍNH TỪ BẢNG CÔNG thật trong app → khi ra ca sớm hoặc giải trình
// được duyệt thì điểm tự thay đổi. Các chỉ tiêu còn lại lấy từ số liệu mock.
// =============================================================
import { countUnexcusedViolations } from './attendanceRules'

// ---------- Bậc xếp loại, sắp xếp từ cao xuống thấp ----------
export const KPI_TIERS = [
  { min: 90, name: 'Xuất sắc', bonus: 2_000_000 },
  { min: 80, name: 'Tốt', bonus: 1_200_000 },
  { min: 70, name: 'Khá', bonus: 600_000 },
  { min: 0, name: 'Cần cải thiện', bonus: 0 },
]

// Mỗi lần đi muộn / về sớm chưa được duyệt bị trừ bao nhiêu điểm Chuyên cần
const ATTENDANCE_PENALTY = 5

// Làm tròn 1 chữ số thập phân
const round1 = (n) => Math.round(n * 10) / 10

/**
 * Tính toàn bộ KPI.
 * @param records  danh sách chấm công trong tháng (từ state của App)
 * @param inputs   số liệu chuyến/an toàn/nhiên liệu (mockData.kpiInputs)
 * @returns { criteria, total, tier, nextTier, pointsToNext }
 */
export function computeKpi(records, inputs) {
  const violations = countUnexcusedViolations(records)
  const { trips, lateTrips, overLossTrips, safety, fuel, compliance } = inputs

  // ---------- Từng chỉ tiêu: điểm (0–100) + giải thích cách tính ----------
  const criteria = [
    {
      id: 'attendance',
      name: 'Chuyên cần',
      icon: 'event_available',
      weight: 20,
      score: Math.max(0, 100 - ATTENDANCE_PENALTY * violations),
      source: 'Tính từ bảng công',
      formula: `100 − ${ATTENDANCE_PENALTY} × số lần đi muộn / về sớm chưa được duyệt giải trình`,
      inputs: [{ label: 'Số lần vi phạm chưa duyệt', value: `${violations} lần` }],
    },
    {
      id: 'onTime',
      name: 'Giao đúng hẹn',
      icon: 'schedule',
      weight: 20,
      score: ((trips - lateTrips) / trips) * 100,
      source: 'Tính từ chuyến đã hoàn tất',
      formula: 'Số chuyến giao đúng hẹn ÷ tổng số chuyến × 100',
      inputs: [
        { label: 'Tổng chuyến hoàn tất', value: `${trips} chuyến` },
        { label: 'Giao trễ hẹn', value: `${lateTrips} chuyến` },
      ],
    },
    {
      id: 'loss',
      name: 'Hao hụt',
      icon: 'water_drop',
      weight: 20,
      score: ((trips - overLossTrips) / trips) * 100,
      source: 'Tính từ chuyến đã hoàn tất',
      formula: 'Số chuyến hao hụt ≤ 0,3% ÷ tổng số chuyến × 100',
      inputs: [
        { label: 'Tổng chuyến hoàn tất', value: `${trips} chuyến` },
        { label: 'Vượt ngưỡng 0,3%', value: `${overLossTrips} chuyến` },
      ],
    },
    {
      id: 'safety',
      name: 'An toàn',
      icon: 'health_and_safety',
      weight: 15,
      score: safety.score,
      source: 'Số liệu từ GPS giám sát (mock)',
      formula: '100 − 5 × cảnh báo tốc độ − 20 × sự cố',
      inputs: [
        { label: 'Cảnh báo tốc độ', value: `${safety.speedWarnings} lần` },
        { label: 'Sự cố', value: `${safety.incidents} vụ` },
      ],
    },
    {
      id: 'fuel',
      name: 'Tiêu hao nhiên liệu',
      icon: 'local_gas_station',
      weight: 15,
      score: fuel.score,
      source: 'Số liệu từ GPS giám sát (mock)',
      formula: 'So sánh mức tiêu hao thực tế với định mức của xe',
      inputs: [
        { label: 'Thực tế', value: `${fuel.actual.toLocaleString('vi-VN')} L/100km` },
        { label: 'Định mức', value: `${fuel.norm.toLocaleString('vi-VN')} L/100km` },
      ],
    },
    {
      id: 'compliance',
      name: 'Tuân thủ quy trình',
      icon: 'fact_check',
      weight: 10,
      score: (compliance.done / compliance.total) * 100,
      source: 'Tính từ checklist trong app',
      formula: 'Số checklist làm đủ ÷ tổng số checklist × 100',
      inputs: [
        { label: 'Checklist làm đủ', value: `${compliance.done}` },
        { label: 'Tổng checklist', value: `${compliance.total}` },
      ],
    },
  ].map((c) => ({
    ...c,
    score: round1(c.score),
    // Điểm đóng góp vào tổng = điểm × trọng số
    contribution: round1((c.score * c.weight) / 100),
  }))

  // ---------- Tổng điểm = cộng điểm đóng góp của các chỉ tiêu ----------
  const total = round1(criteria.reduce((sum, c) => sum + (c.score * c.weight) / 100, 0))

  // ---------- Xếp loại hiện tại và bậc kế tiếp ----------
  const tierIndex = KPI_TIERS.findIndex((t) => total >= t.min)
  const tier = KPI_TIERS[tierIndex]
  const nextTier = tierIndex > 0 ? KPI_TIERS[tierIndex - 1] : null
  const pointsToNext = nextTier ? round1(nextTier.min - total) : 0

  return { criteria, total, tier, nextTier, pointsToNext }
}
