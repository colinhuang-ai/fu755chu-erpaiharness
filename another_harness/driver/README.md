# DriverOS Fleet — Prototype (React + Vite)

Prototype màn hình **"Hôm Nay"** cho tài xế xe bồn, dựng lại từ `../code.html` theo design system trong `../DESIGN.md`.

## Chạy dự án

```bash
npm install      # cài thư viện (chỉ cần lần đầu)
npm run dev      # chạy dev server → mở http://localhost:5173
npm run build    # build bản production vào thư mục dist/
```

## Kết nối Supabase

Tab **Chấm công** (bảng công, giải trình, khiếu nại KPI) đọc/ghi dữ liệu trên Supabase.
Chưa cấu hình hoặc chưa tạo bảng thì app **tự dùng dữ liệu mẫu**; nhãn ở đầu tab Chấm công cho biết đang dùng nguồn nào.

1. **Cấu hình kết nối**: copy `.env.example` thành `.env.local`, điền URL và publishable key
   (Supabase Dashboard › Project Settings › API Keys). Khởi động lại `npm run dev` sau khi sửa file này.
2. **Tạo bảng**: Supabase Dashboard › **SQL Editor** › New query › dán nội dung
   [`supabase/schema.sql`](supabase/schema.sql) › **Run**.
3. **Nạp dữ liệu mẫu**: tạo query mới, dán [`supabase/seed.sql`](supabase/seed.sql) › **Run**.
4. Tải lại app → nhãn đổi thành "Dữ liệu: Supabase".

**Đặt lại dữ liệu demo**: chạy lại `seed.sql` (xoá dữ liệu của tài xế mẫu rồi chèn lại từ đầu).

> ⚠️ Policy trong `schema.sql` là bản **DEMO**: app chưa có đăng nhập nên trình duyệt dùng role `anon`
> và chỉ thao tác được trên tài xế mẫu `TX-0127` (xem, ra ca khi chưa ra, gửi giải trình / khiếu nại).
> Ai có publishable key cũng làm được những việc đó. Khi làm thật cần thêm Supabase Auth và viết lại policy theo `auth.uid()`.

| Bảng | Nội dung |
|---|---|
| `attendance` | Mỗi dòng = 1 ngày chấm công (giờ vào, giờ ra, ghi chú) |
| `attendance_explanations` | Giải trình đi muộn / về sớm (chỉ thêm mới; app lấy bản mới nhất) |
| `kpi_appeals` | Khiếu nại KPI theo kỳ (`period` = `2026-11`) |

## Công nghệ

- **React 19** — dựng giao diện theo component
- **Vite 7** — dev server + build nhanh
- **Tailwind CSS 4** — style bằng class; design token khai báo trong `src/index.css` (`@theme`)
- **Material Symbols** — bộ icon (nạp qua Google Fonts trong `index.html`)

## Cấu trúc thư mục

```
src/
├── main.jsx                  # Điểm khởi động, gắn <App/> vào #root
├── App.jsx                   # Component gốc: giữ state, layout, xử lý sự kiện
├── index.css                 # Tailwind + design tokens (màu, chữ, khoảng cách)
├── data/
│   └── mockData.js           # Dữ liệu giả lập (dùng khi chưa kết nối Supabase)
├── services/
│   └── attendanceService.js  # Đọc/ghi bảng công qua Supabase, tự rơi về mock
├── lib/                      # Logic nghiệp vụ thuần (không có giao diện)
│   ├── supabase.js           # Tạo client Supabase từ .env.local (thiếu env → null)
│   ├── format.js             # Định dạng giờ, tiền, điểm kiểu Việt Nam
│   ├── attendanceRules.js    # Quy tắc ca 06:00–15:00: sớm / đúng giờ / muộn / về sớm
│   └── kpi.js                # Tính điểm 6 chỉ tiêu KPI, xếp loại, thưởng
├── hooks/
│   └── useClock.js           # Đồng hồ giả lập: 12/11/2026, bắt đầu 09:12
├── pages/
│   ├── HomePage.jsx          # Màn "Hôm Nay": sắp xếp các khối
│   ├── AttendancePage.jsx    # Tab "Chấm công": Bảng công / KPI
│   └── PlaceholderPage.jsx   # Trang tạm cho các tab chưa làm
└── components/
    ├── layout/
    │   ├── AppHeader.jsx     # Header cố định (status bar, tiêu đề, SOS, avatar)
    │   └── BottomTabBar.jsx  # Thanh 5 tab dưới cùng
    ├── home/
    │   ├── ShiftCard.jsx         # Thẻ ca làm / chấm công
    │   ├── CurrentTripCard.jsx   # Thẻ chuyến đang chạy (ghép 3 khối dưới)
    │   ├── TankCompartments.jsx  #   ├─ Khoang bồn
    │   ├── RouteTimeline.jsx     #   ├─ Lộ trình đi → đến
    │   ├── ProgressSteps.jsx     #   └─ Tiến độ 5 bước
    │   ├── StatsGrid.jsx         # Lưới 4 chỉ số
    │   ├── AlertsList.jsx        # Danh sách cần chú ý & an toàn
    │   └── QuickActions.jsx      # Lối tắt tác vụ
    ├── attendance/
    │   ├── AttendanceStats.jsx   # 4 số: ngày công, đến sớm, đi muộn, về sớm
    │   ├── MonthCalendar.jsx     # Lịch tháng kiểu iOS, chấm màu theo trạng thái
    │   ├── DayDetailSheet.jsx    # Chi tiết 1 ngày + nút "Gửi giải trình"
    │   └── ExplanationSheet.jsx  # Form giải trình
    ├── kpi/
    │   ├── KpiSummaryCard.jsx    # Vòng điểm, xếp loại, thưởng, tiến độ bậc kế
    │   ├── KpiCriteriaList.jsx   # 6 chỉ tiêu có trọng số
    │   ├── KpiDetailSheet.jsx    # Cách tính điểm 1 chỉ tiêu
    │   ├── KpiHistoryChart.jsx   # Cột điểm 4 tháng
    │   └── KpiAppealSheet.jsx    # Form khiếu nại KPI
    └── ui/                   # Component dùng chung
        ├── Icon.jsx
        ├── Card.jsx
        ├── SectionHeader.jsx
        ├── SegmentedControl.jsx  # Nút chuyển kiểu iOS [ A | B ]
        ├── BottomSheet.jsx   # Hộp thoại xác nhận trượt từ dưới lên
        ├── FormSheet.jsx     # Sheet form: Hủy · Tiêu đề · Gửi (mờ khi chưa hợp lệ)
        └── Toast.jsx         # Thông báo nhanh tự ẩn
```

## Dữ liệu chảy thế nào ở tab Chấm công

```
Supabase (hoặc mockData) ──► attendanceService.loadInitialData()
                               └─► App (state `records`)
                                     ├─► attendanceRules.summarizeMonth() → 4 số liệu
                                     ├─► MonthCalendar → chấm màu từng ngày
                                     └─► kpi.computeKpi() → điểm KPI (tab KPI + thẻ trên Hôm nay)
```
Khi ra ca / gửi giải trình / khiếu nại: App gọi service ghi lên Supabase trước;
thành công mới cập nhật `records` (bảng công và KPI tự tính lại), lỗi thì hiện toast và giữ nguyên.

## Luồng dữ liệu (đọc code theo thứ tự này)

1. `data/mockData.js` — xem dữ liệu có gì
2. `App.jsx` — state và hàm xử lý được tạo ở đây
3. `pages/HomePage.jsx` — App truyền state/hàm xuống qua **props**
4. `components/home/*` — từng khối nhận props và hiển thị

## Tương tác đã có

| Thao tác | Kết quả |
|---|---|
| Bấm **Ra ca & Bàn giao xe** | Chuyến chưa xong → cảnh báo chặn; đã xong → xác nhận ra ca |
| Bấm **Cập nhật đến trạm** | Tiến độ chuyển sang bước tiếp theo (3 → 4 → 5) |
| Bấm **SOS** (header) hoặc **Báo tràn / Cắt khẩn** | Mở hộp xác nhận khẩn cấp |
| Bấm các tab dưới | Chuyển tab (Công việc, Tài chính, Học tập vẫn là trang tạm) |
| Thời gian thực tế / đồng hồ status bar | Chạy theo đồng hồ giả lập |
| Ra ca trước 14:55 (sau khi chuyến hoàn tất) | Cảnh báo "về sớm X phút"; xác nhận → bảng công + KPI cập nhật |
| **Chấm công › Bảng công**: chạm ngày có chấm | Xem giờ vào/ra, thời gian làm, ghi chú, giải trình |
| Ngày đi muộn / về sớm chưa giải trình | Nút "Gửi giải trình" → form (chọn lý do + mô tả ≥ 10 ký tự) |
| **Chấm công › KPI**: chạm chỉ tiêu | Sheet cách tính điểm |
| Nút "Khiếu nại KPI" | Form (chọn chỉ tiêu + nội dung ≥ 20 ký tự) |

## Giả định & phần còn mock

- Chuyên cần = 100 − 5 × số lần đi muộn / về sớm **chưa được duyệt** giải trình (specs chưa chốt công thức, xem Open #5).
- An toàn và Tiêu hao nhiên liệu là số mock; các chỉ tiêu còn lại tính từ dữ liệu.
- Chỉ dữ liệu tab Chấm công được lưu trên Supabase. Tiến độ chuyến và các tab khác vẫn là mock trong bộ nhớ (tải lại trang là mất).
- Ở chế độ dữ liệu mẫu, các thao tác ghi chỉ đổi state trong trình duyệt.
- Prototype dùng JavaScript + Tailwind + Material Symbols (nối tiếp phần Hôm nay), khác với specs (TypeScript + CSS thuần + lucide-react).
