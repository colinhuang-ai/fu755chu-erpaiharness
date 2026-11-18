// =============================================================
// mockData.js — Dữ liệu giả lập cho màn hình "Hôm Nay"
// Tách dữ liệu ra khỏi giao diện để sau này dễ thay bằng dữ liệu thật từ API.
// Component chỉ việc đọc dữ liệu ở đây và hiển thị.
// =============================================================

// ---------- Thông tin tài xế (dùng ở Header) ----------
export const driver = {
  name: 'Nguyễn Văn Hùng',
  online: true, // chấm xanh trên avatar
}

// ---------- Ca làm việc hôm nay (dùng ở ShiftCard) ----------
// Giờ vào/ra của hôm nay KHÔNG nằm ở đây mà lấy từ attendanceRecords (ngày 12)
// để Hôm nay và Chấm công dùng chung một nguồn dữ liệu.
export const shift = {
  date: 'Hôm nay, 12/11/2026',
  standardHours: 8, // giờ tiêu chuẩn của ca
  location: 'Kho Nhà Bè - Trong vùng GPS cho phép',
  gpsValid: true,
}

// ---------- Tháng đang xem trên Bảng công ----------
export const TODAY = { year: 2026, month: 11, day: 12 }

// ---------- Chấm công tháng 11/2026 (dùng ở tab Chấm công) ----------
// Ngày 2–12, nghỉ Chủ Nhật (ngày 8). Chỉ lưu GIỜ VÀO / GIỜ RA;
// trạng thái đến sớm / đúng giờ / đi muộn / về sớm do lib/attendanceRules.js tự tính.
// explanation: giải trình đã gửi, status 'pending' (chờ duyệt) | 'approved' (đã duyệt)
export const attendanceRecords = [
  { day: 2, clockIn: '05:50', clockOut: '15:05' }, // đến sớm
  { day: 3, clockIn: '06:02', clockOut: '15:10' }, // đúng giờ
  {
    day: 4,
    clockIn: '06:12',
    clockOut: '15:20',
    note: 'Kẹt xe cầu Phú Mỹ',
    explanation: { reason: 'Kẹt xe / tai nạn trên đường', detail: 'Tai nạn trên cầu Phú Mỹ, kẹt 25 phút.', status: 'approved' },
  }, // đi muộn — đã được duyệt
  { day: 5, clockIn: '05:52', clockOut: '15:02' }, // đến sớm
  {
    day: 6,
    clockIn: '06:00',
    clockOut: '14:40',
    note: 'Về sớm đưa con đi khám',
    explanation: { reason: 'Việc gia đình', detail: 'Đưa con đi khám bệnh, đã báo điều độ Lê Thu Hà.', status: 'pending' },
  }, // về sớm — chờ duyệt
  { day: 7, clockIn: '05:58', clockOut: '15:15' }, // đúng giờ
  { day: 9, clockIn: '05:47', clockOut: '15:08' }, // đến sớm
  { day: 10, clockIn: '06:18', clockOut: '15:30' }, // đi muộn — CHƯA giải trình
  { day: 11, clockIn: '05:56', clockOut: '15:04' }, // đúng giờ
  { day: 12, clockIn: '05:54', clockOut: null }, // hôm nay: đã vào ca, chưa ra
]

// ---------- Lý do giải trình chấm công (chọn dạng viên thuốc) ----------
export const explanationReasons = [
  'Kẹt xe / tai nạn trên đường',
  'Xe hỏng / chờ sửa',
  'Điều độ yêu cầu',
  'Ốm đau',
  'Việc gia đình',
  'Khác',
]

// ---------- Số liệu đầu vào để tính KPI tháng 11 (xem lib/kpi.js) ----------
export const kpiInputs = {
  trips: 11, // số chuyến đã hoàn tất trong tháng
  lateTrips: 1, // số chuyến giao trễ hẹn
  overLossTrips: 1, // số chuyến hao hụt vượt 0,3%
  safety: { score: 95, speedWarnings: 1, incidents: 0 },
  fuel: { score: 79, actual: 32.4, norm: 31 }, // L/100km
  compliance: { done: 18, total: 20 }, // checklist làm đủ / tổng
}

// ---------- Điểm KPI 3 tháng trước (tháng hiện tại do app tự tính) ----------
export const kpiHistory = [
  { label: 'T8', score: 84.2 },
  { label: 'T9', score: 86.0 },
  { label: 'T10', score: 82.7 },
]

// ---------- Chuyến đang chạy (dùng ở CurrentTripCard) ----------
export const currentTrip = {
  code: 'CH-20261112-02',
  status: 'Đang vận chuyển',
  plate: '51D-345.67', // biển số xe bồn
  capacity: '18.000 L',
  eta: '10:30', // giờ hẹn giao
  remaining: 'Còn 1h 18m',
  seals: { done: 10, total: 10 }, // niêm phong kẹp chì

  // Các khoang bồn: fuel quyết định màu ('ron95' = cam, 'do' = xanh)
  compartments: [
    { id: 'K1', liters: 4000, fuel: 'ron95' },
    { id: 'K2', liters: 3000, fuel: 'ron95' },
    { id: 'K3', liters: 4000, fuel: 'do' },
    { id: 'K4', liters: 4000, fuel: 'do' },
    { id: 'K5', liters: 3000, fuel: 'ron95' },
  ],

  // Lộ trình: điểm đi → điểm đến
  route: {
    from: { label: 'Điểm xuất phát', name: 'Kho Xăng dầu Tổng hợp Nhà Bè' },
    to: {
      label: 'Điểm đến',
      name: 'CHXD Petrolimex Số 14 - Đồng Nai',
      address: 'Xa Lộ Hà Nội, P. Tân Hiệp, Biên Hòa',
    },
  },

  // Quy trình 5 bước; currentStep tính từ 0 (2 = bước thứ 3 "Đang chạy")
  steps: ['Nhận lệnh', 'Nạp bồn', 'Đang chạy', 'Xả bồn', 'Ký nhận'],
  currentStep: 2,
}

// ---------- Bảng màu & tên hiển thị của từng loại nhiên liệu ----------
export const fuelTypes = {
  ron95: {
    label: 'Xăng RON 95',
    cell: 'bg-tertiary-fixed text-on-tertiary-fixed', // màu ô khoang
    dot: 'bg-tertiary-fixed', // màu chấm chú thích
  },
  do: {
    label: 'Dầu DO 0.05S',
    cell: 'bg-primary-fixed text-on-primary-fixed',
    dot: 'bg-primary-fixed',
  },
}

// ---------- 4 thẻ chỉ số nhanh (dùng ở StatsGrid) ----------
export const stats = [
  {
    id: 'delivered',
    label: 'Đã giao hôm nay',
    icon: 'local_gas_station',
    iconColor: 'text-primary',
    value: '18.000',
    unit: 'L',
    note: '1 chuyến hoàn tất',
    noteColor: 'text-secondary',
    progress: 50, // % thanh tiến độ
    barColor: 'bg-primary',
  },
  {
    id: 'kpi',
    label: 'Điểm KPI tháng',
    icon: 'stars',
    iconColor: 'text-secondary',
    value: '88.5',
    unit: '/100',
    note: 'Hạng Tốt (Top 12%)',
    noteColor: 'text-secondary',
    progress: 88.5,
    barColor: 'bg-secondary',
  },
  {
    id: 'income',
    label: 'Thu nhập tạm tính',
    icon: 'payments',
    iconColor: 'text-tertiary',
    value: '12.450',
    unit: 'k',
    note: '+420k chuyến hiện tại',
    noteColor: 'text-on-surface-variant',
    progress: 65,
    barColor: 'bg-tertiary',
  },
  {
    id: 'safety',
    label: 'Học an toàn Q4',
    icon: 'shield_with_heart',
    iconColor: 'text-primary-container',
    value: '6.5',
    unit: '/ 8.0h',
    note: 'Cần thêm 1.5h nữa',
    noteColor: 'text-tertiary',
    progress: 81,
    barColor: 'bg-primary-container',
  },
]

// ---------- Danh sách "Cần chú ý & An toàn" (dùng ở AlertsList) ----------
// level quyết định kiểu hiển thị: 'critical' (đỏ) | 'warning' (cam) | 'ok' (xanh)
export const alerts = [
  {
    id: 'adr',
    level: 'critical',
    icon: 'warning',
    title: 'Chứng chỉ Hàng nguy hiểm (ADR)',
    badge: 'Còn 18 ngày',
    description:
      'Hết hạn vào 30/11/2026. Bắt buộc nộp hồ sơ gia hạn để không bị chặn nhận lệnh bồn.',
    actions: [
      { label: 'Gia hạn ngay', primary: true },
      { label: 'Xem tài liệu' },
    ],
  },
  {
    id: 'pccc',
    level: 'warning',
    icon: 'local_fire_department',
    title: 'Khóa PCCC & Ứng phó tràn dầu',
    badge: 'Hạn: 30/11',
    description: 'Hoàn thành bài kiểm tra lý thuyết trực tuyến (còn 2/5 bài học).',
  },
  {
    id: 'precheck',
    level: 'ok',
    icon: 'checklist',
    title: 'Kiểm tra xe & Van bồn trước chuyến',
    badge: 'Đạt chuẩn',
    description: 'Đã ký biên bản điện tử lúc 06:15 sáng nay',
  },
]

// ---------- Lối tắt tác vụ (dùng ở QuickActions) ----------
// variant 'danger' = nút SOS đỏ nổi bật
export const quickActions = [
  {
    id: 'expense',
    label: 'Thêm chi phí',
    icon: 'receipt_long',
    iconBg: 'bg-primary-fixed text-on-primary-fixed',
  },
  {
    id: 'repair',
    label: 'Báo hỏng hóc',
    icon: 'build',
    iconBg: 'bg-tertiary-fixed text-on-tertiary-fixed',
  },
  { id: 'sos', label: 'Báo tràn / Cắt khẩn', icon: 'fmd_bad', variant: 'danger' },
]

// ---------- Thanh tab dưới cùng (dùng ở BottomTabBar) ----------
export const tabs = [
  { id: 'hom-nay', label: 'Hôm nay', icon: 'today' },
  { id: 'cong-viec', label: 'Công việc', icon: 'local_shipping', badge: 1 },
  { id: 'cham-cong', label: 'Chấm công', icon: 'schedule' },
  { id: 'tai-chinh', label: 'Tài chính', icon: 'account_balance_wallet' },
  { id: 'hoc-tap', label: 'Học tập', icon: 'school' },
]
