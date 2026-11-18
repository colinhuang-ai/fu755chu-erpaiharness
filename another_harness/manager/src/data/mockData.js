// =============================================================
// mockData.js — Dữ liệu giả lập cho app Quản lý
// Bám theo specs/prompt-driveros.md mục 7 (lái xe Nguyễn Văn Hùng TX-0127,
// xe 51D-345.67, chuyến CH-20261112-02 giao 10:30...) để KHỚP với app tài xế.
// Ngày tháng lưu dạng 'YYYY-MM-DD' để so sánh dễ; hiển thị thì đổi sang dd/mm/yyyy.
// =============================================================

// ---------- Hôm nay (đồng hồ giả lập giống app tài xế) ----------
export const TODAY = '2026-11-12'

// ---------- Người đang đăng nhập ----------
export const currentManager = {
  name: 'Trần Minh Quân',
  role: 'Quản lý Đội 3',
  team: 'Đội 3 – Kho Nhà Bè',
}

// ---------- Lái xe trong đội ----------
// status: 'on_trip' (đang chạy) | 'available' (sẵn sàng) | 'off' (nghỉ)
// docs:   giấy tờ bắt buộc, expires = ngày hết hạn
// courses: khoá bắt buộc; quá hạn mà chưa xong → chặn nhận chuyến hàng nguy hiểm
// kpi:    điểm từng chỉ tiêu tháng 11 (tổng do lib/kpi.js tính theo trọng số Cấu hình)
export const drivers = [
  {
    id: 'TX-0127',
    name: 'Nguyễn Văn Hùng',
    phone: '0901 234 127',
    license: 'FC',
    joined: '2019-03-01',
    status: 'on_trip',
    vehicleId: '51D-345.67',
    docs: [
      { name: 'Giấy phép lái xe hạng FC', expires: '2029-03-15' },
      { name: 'Chứng chỉ hàng nguy hiểm (ADR)', expires: '2026-11-30' },
      { name: 'Chứng chỉ PCCC', expires: '2027-06-01' },
      { name: 'Khám sức khỏe định kỳ', expires: '2027-02-10' },
    ],
    courses: [
      { name: 'Vận chuyển hàng nguy hiểm (ADR)', due: '2026-11-30', done: false },
      { name: 'PCCC & xử lý tràn dầu', due: '2026-11-30', done: false },
    ],
    kpi: { attendance: 90, onTime: 90.9, loss: 90.9, safety: 95, fuel: 79, compliance: 90 },
  },
  {
    id: 'TX-0098',
    name: 'Lê Văn Tâm',
    phone: '0903 118 098',
    license: 'FC',
    joined: '2017-08-15',
    status: 'on_trip',
    vehicleId: '51D-221.08',
    docs: [
      { name: 'Giấy phép lái xe hạng FC', expires: '2028-05-20' },
      { name: 'Chứng chỉ hàng nguy hiểm (ADR)', expires: '2027-09-01' },
      { name: 'Chứng chỉ PCCC', expires: '2027-04-12' },
      { name: 'Khám sức khỏe định kỳ', expires: '2027-01-18' },
    ],
    courses: [
      { name: 'Vận chuyển hàng nguy hiểm (ADR)', due: '2026-11-30', done: true },
      { name: 'PCCC & xử lý tràn dầu', due: '2026-11-30', done: true },
    ],
    kpi: { attendance: 100, onTime: 92, loss: 100, safety: 90, fuel: 85, compliance: 95 },
  },
  {
    id: 'TX-0142',
    name: 'Phạm Quốc Bảo',
    phone: '0938 442 142',
    license: 'FC',
    joined: '2021-02-10',
    status: 'available',
    vehicleId: '51D-610.45',
    docs: [
      { name: 'Giấy phép lái xe hạng FC', expires: '2030-01-09' },
      { name: 'Chứng chỉ hàng nguy hiểm (ADR)', expires: '2027-03-22' },
      { name: 'Chứng chỉ PCCC', expires: '2027-03-22' },
      { name: 'Khám sức khỏe định kỳ', expires: '2026-11-05' }, // ĐÃ HẾT HẠN
    ],
    courses: [
      { name: 'Vận chuyển hàng nguy hiểm (ADR)', due: '2026-11-30', done: true },
      { name: 'PCCC & xử lý tràn dầu', due: '2026-11-30', done: false },
    ],
    kpi: { attendance: 85, onTime: 80, loss: 90, safety: 85, fuel: 80, compliance: 85 },
  },
  {
    id: 'TX-0115',
    name: 'Võ Thành Nhân',
    phone: '0977 515 115',
    license: 'FC',
    joined: '2020-06-01',
    status: 'on_trip',
    vehicleId: '51C-778.12',
    docs: [
      { name: 'Giấy phép lái xe hạng FC', expires: '2027-12-30' },
      { name: 'Chứng chỉ hàng nguy hiểm (ADR)', expires: '2027-01-05' },
      { name: 'Chứng chỉ PCCC', expires: '2026-12-28' }, // sắp hết hạn
      { name: 'Khám sức khỏe định kỳ', expires: '2027-05-02' },
    ],
    courses: [
      { name: 'Vận chuyển hàng nguy hiểm (ADR)', due: '2026-11-30', done: true },
      { name: 'PCCC & xử lý tràn dầu', due: '2026-11-30', done: true },
    ],
    kpi: { attendance: 85, onTime: 72.7, loss: 81.8, safety: 80, fuel: 75, compliance: 70 },
  },
  {
    id: 'TX-0151',
    name: 'Đỗ Minh Khoa',
    phone: '0909 651 151',
    license: 'FC',
    joined: '2023-04-17',
    status: 'available',
    vehicleId: null,
    docs: [
      { name: 'Giấy phép lái xe hạng FC', expires: '2031-04-01' },
      { name: 'Chứng chỉ hàng nguy hiểm (ADR)', expires: '2027-10-10' },
      { name: 'Chứng chỉ PCCC', expires: '2027-10-10' },
      { name: 'Khám sức khỏe định kỳ', expires: '2027-04-20' },
    ],
    courses: [
      { name: 'Vận chuyển hàng nguy hiểm (ADR)', due: '2026-11-30', done: true },
      { name: 'PCCC & xử lý tràn dầu', due: '2026-11-10', done: false }, // QUÁ HẠN
    ],
    kpi: { attendance: 95, onTime: 85, loss: 80, safety: 90, fuel: 70, compliance: 80 },
  },
  {
    id: 'TX-0163',
    name: 'Huỳnh Gia Phúc',
    phone: '0918 263 163',
    license: 'FC',
    joined: '2022-09-05',
    status: 'off',
    vehicleId: '51D-509.33',
    docs: [
      { name: 'Giấy phép lái xe hạng FC', expires: '2029-09-01' },
      { name: 'Chứng chỉ hàng nguy hiểm (ADR)', expires: '2027-06-15' },
      { name: 'Chứng chỉ PCCC', expires: '2027-06-15' },
      { name: 'Khám sức khỏe định kỳ', expires: '2027-03-03' },
    ],
    courses: [
      { name: 'Vận chuyển hàng nguy hiểm (ADR)', due: '2026-11-30', done: true },
      { name: 'PCCC & xử lý tràn dầu', due: '2026-11-30', done: true },
    ],
    kpi: { attendance: 90, onTime: 90, loss: 90, safety: 85, fuel: 80, compliance: 90 },
  },
]

// ---------- Xe trong đội ----------
// type: 'tanker' (xe bồn, chở theo lít) | 'truck' (xe tải thùng, chở phuy)
// capacity: lít với xe bồn, số phuy với xe tải
export const vehicles = [
  { id: '51D-345.67', type: 'tanker', capacity: 18000, compartments: 5, registration: '2027-04-20', tankInspection: '2027-01-15' },
  { id: '51D-221.08', type: 'tanker', capacity: 16000, compartments: 4, registration: '2027-08-01', tankInspection: '2026-12-05' },
  { id: '51D-610.45', type: 'tanker', capacity: 20000, compartments: 5, registration: '2026-11-08', tankInspection: '2027-02-20' }, // đăng kiểm HẾT HẠN
  { id: '51D-509.33', type: 'tanker', capacity: 12000, compartments: 3, registration: '2027-05-30', tankInspection: '2027-03-01' },
  { id: '51C-778.12', type: 'truck', capacity: 200, compartments: 0, registration: '2027-02-14', tankInspection: null },
]

// ---------- Chuyến hôm nay ----------
// status: unassigned → waiting (chờ nhận) → accepted → loading → running → unloading → done
// cargoType phải khớp loại xe: 'tanker' cần xe bồn, 'drum' cần xe tải thùng
// delayMinutes > 0 = đang trễ so với giờ hẹn giao
export const trips = [
  { code: 'CH-20261112-01', driverId: 'TX-0127', vehicleId: '51D-345.67', from: 'Kho Xăng dầu Nhà Bè', to: 'CHXD Petrolimex Số 7 – Quận 7', cargo: 'Xăng RON95-III', cargoType: 'tanker', quantity: 18000, due: '07:30', km: 14, status: 'done', delayMinutes: 0 },
  { code: 'CH-20261112-02', driverId: 'TX-0127', vehicleId: '51D-345.67', from: 'Kho Xăng dầu Nhà Bè', to: 'CHXD Petrolimex Số 14 – Biên Hòa', cargo: 'RON95-III + DO 0,05S-II', cargoType: 'tanker', quantity: 18000, due: '10:30', km: 42, status: 'running', delayMinutes: 0 },
  { code: 'CH-20261112-03', driverId: 'TX-0127', vehicleId: '51D-345.67', from: 'Kho Hiệp Phước', to: 'CHXD Bến Lức – Long An', cargo: 'Dầu DO 0,05S-II', cargoType: 'tanker', quantity: 16000, due: '14:00', km: 35, status: 'waiting', delayMinutes: 0 },
  { code: 'CH-20261112-04', driverId: 'TX-0115', vehicleId: '51C-778.12', from: 'Kho Hiệp Phước', to: 'KCN Long Thành – Đồng Nai', cargo: 'Dầu nhớt đóng phuy', cargoType: 'drum', quantity: 180, due: '09:00', km: 48, status: 'unloading', delayMinutes: 25 },
  { code: 'CH-20261112-05', driverId: 'TX-0098', vehicleId: '51D-221.08', from: 'Kho Xăng dầu Nhà Bè', to: 'CHXD Thủ Đức – TP. Thủ Đức', cargo: 'Xăng E5 RON92-II', cargoType: 'tanker', quantity: 16000, due: '11:00', km: 28, status: 'loading', delayMinutes: 0 },
  { code: 'CH-20261112-06', driverId: null, vehicleId: null, from: 'Kho Xăng dầu Nhà Bè', to: 'CHXD Dĩ An – Bình Dương', cargo: 'Xăng E5 RON92-II', cargoType: 'tanker', quantity: 12000, due: '15:30', km: 33, status: 'unassigned', delayMinutes: 0 },
  { code: 'CH-20261112-07', driverId: null, vehicleId: null, from: 'Kho Hiệp Phước', to: 'KCN Nhơn Trạch – Đồng Nai', cargo: 'Dầu nhớt đóng phuy', cargoType: 'drum', quantity: 120, due: '16:00', km: 39, status: 'unassigned', delayMinutes: 0 },
]

// ---------- Hàng đợi duyệt ----------
// type: 'attendance' (giải trình chấm công) | 'expense' (chi phí) | 'kpi' (khiếu nại KPI) | 'leave' (nghỉ phép)
// flags: cảnh báo hệ thống tự gắn để quản lý chú ý
export const approvals = [
  { id: 'AP-101', type: 'attendance', driverId: 'TX-0127', title: 'Về sớm 20 phút – 06/11', detail: 'Việc gia đình: Đưa con đi khám bệnh, đã báo điều độ Lê Thu Hà.', submitted: '06/11 14:42', flags: [] },
  { id: 'AP-102', type: 'attendance', driverId: 'TX-0142', title: 'Đi muộn 12 phút – 11/11', detail: 'Kẹt xe / tai nạn trên đường: Va chạm trên Xa lộ Hà Nội, kẹt 30 phút.', submitted: '11/11 06:30', flags: [] },
  { id: 'AP-103', type: 'expense', driverId: 'TX-0127', title: 'Ăn uống – 11/11', amount: 185000, detail: 'Cơm trưa + nước, Quán 79 Biên Hòa. Có hóa đơn.', submitted: '11/11 12:15', flags: ['Vượt định mức 150.000 ₫/ngày'] },
  { id: 'AP-104', type: 'expense', driverId: 'TX-0098', title: 'Cầu đường – BOT Long Thành', amount: 180000, detail: 'Vé qua trạm BOT cao tốc TP.HCM – Long Thành. Không có hóa đơn.', submitted: '11/11 16:02', flags: [] },
  { id: 'AP-105', type: 'expense', driverId: 'TX-0115', title: 'Nhiên liệu – 85 L DO', amount: 1784000, detail: '85 L × 20.990 ₫, trạm Petrolimex Nhơn Trạch, odo 128.440 km. Có hóa đơn VAT.', submitted: '12/11 07:48', flags: [] },
  { id: 'AP-106', type: 'kpi', driverId: 'TX-0115', title: 'Khiếu nại KPI – Giao đúng hẹn', detail: 'Chuyến CH-20261105-01 giao trễ do kho xuất hàng chậm 40 phút, có xác nhận của thủ kho Hiệp Phước.', submitted: '12/11 08:10', flags: [] },
  { id: 'AP-107', type: 'leave', driverId: 'TX-0163', title: 'Nghỉ phép năm 12/11 – 14/11 (3 ngày)', detail: 'Về quê dự đám cưới em trai. Còn 9 ngày phép.', submitted: '08/11 19:20', flags: [] },
]

// ---------- Cấu hình mặc định (specs mục 6) ----------
export const defaultSettings = {
  shift: { start: '06:00', end: '15:00', tolerance: 5 },
  thresholds: { loss: 0.3, loadDeviation: 0.5, mealLimit: 150000, noInvoiceLimit: 200000 },
  kpiWeights: { attendance: 20, onTime: 20, loss: 20, safety: 15, fuel: 15, compliance: 10 },
  docWarningDays: 30, // nhắc trước bao nhiêu ngày khi giấy tờ sắp hết hạn
}
