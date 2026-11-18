# DriverOS — App Quản lý (back-office)

Web app cho **quản lý đội xe**, theo nhóm EP-10 (Web back-office) trong `../specs/specs.md` và mục 6 của `../specs/driveros-technical-design.md`. Ưu tiên màn hình máy tính, có chỉnh lại cho điện thoại (menu thu vào nút ☰, bảng cuộn ngang). Dùng chung design system với app tài xế (`../prototype`).

## Chạy

```bash
npm install
npm run dev      # mặc định http://localhost:5175 (đặt PORT=xxxx để đổi cổng)
npm run build
```

## Các màn hình

| Màn | Specs | Làm được gì |
|---|---|---|
| **Tổng quan** | F-10.2 | 5 ô số liệu (bấm để nhảy tới màn liên quan), chuyến đang chạy (trễ lên đầu), cảnh báo tuân thủ, tình trạng lái xe |
| **Chuyến & phân công** | F-10.1 | Lọc chuyến; phân công lái xe + xe với **kiểm tra điều kiện tự động**; mục bị chặn thì không giao được |
| **Duyệt yêu cầu** | F-04.2, F-05.6, F-04.8, F-04.5 | Giải trình chấm công, chi phí, khiếu nại KPI, nghỉ phép; từ chối bắt buộc nhập lý do |
| **Lái xe** | F-10.3 | Tìm kiếm, tình trạng giấy tờ, KPI; mở hồ sơ chi tiết (giấy tờ, khoá học, KPI, gọi điện) |
| **KPI đội** | F-04.7 | Bảng xếp hạng, điểm từng chỉ tiêu, xếp loại & thưởng dự kiến |
| **Cấu hình** | F-10.4 | Ca làm, ngưỡng, định mức, trọng số KPI (tổng phải = 100%) |

## Kiểm tra điều kiện phân công (`src/lib/eligibility.js`)

| Điều kiện | Chặn khi | Cảnh báo khi |
|---|---|---|
| Lịch làm việc | Lái xe nghỉ | Đang có chuyến dở dang |
| Giấy tờ lái xe | Đã hết hạn | Còn ≤ N ngày (N ở Cấu hình) |
| Khoá học bắt buộc | Quá hạn chưa xong | Chưa xong, còn hạn |
| Đăng kiểm / kiểm định bồn | Đã hết hạn | Còn ≤ N ngày |
| Loại xe ↔ loại hàng | Xe bồn chở phuy hoặc ngược lại | — |
| Sức chứa | Xe nhỏ hơn lượng hàng | — |

Dữ liệu mẫu có sẵn các ca để thử: **Phạm Quốc Bảo** (khám sức khỏe hết hạn, xe hết đăng kiểm), **Đỗ Minh Khoa** (khoá PCCC quá hạn), **Huỳnh Gia Phúc** (đang nghỉ phép).

## Cấu trúc

```
src/
├── App.jsx                 # State dùng chung + layout + hàm xử lý
├── data/mockData.js        # Lái xe, xe, chuyến, yêu cầu duyệt, cấu hình mặc định
├── lib/
│   ├── format.js           # Ngày, tiền, điểm kiểu Việt Nam
│   ├── status.js           # Nhãn + màu cho mọi loại trạng thái
│   ├── eligibility.js      # Kiểm tra điều kiện phân công, hạn giấy tờ
│   └── kpi.js              # Tổng điểm KPI theo trọng số, xếp loại
├── pages/                  # Mỗi màn hình một file
└── components/
    ├── layout/             # Sidebar, Topbar
    ├── ui/                 # Icon, Card, Badge, Button, StatCard, Drawer, Toast
    ├── trips/AssignDrawer.jsx
    ├── approvals/ApprovalCard.jsx
    └── drivers/DriverDrawer.jsx
```

## Giả định & phần còn mock

- Toàn bộ dữ liệu là mock trong bộ nhớ; tải lại trang sẽ về ban đầu. Chưa nối Supabase (app tài xế đang được nối ở một nhánh việc riêng; khi xong, app này dùng chung các bảng đó).
- Chưa có đăng nhập / phân quyền theo vai trò (TDD yêu cầu MFA cho back-office).
- Điểm KPI từng chỉ tiêu của lái xe là số mock; tổng điểm tính thật theo trọng số ở Cấu hình.
- Cấu hình ca làm & ngưỡng hao hụt mới lưu trong app quản lý, chưa đẩy sang app tài xế.
