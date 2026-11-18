-- =============================================================
-- seed.sql — Dữ liệu mẫu tháng 11/2026 cho tài xế 'TX-0127'
--
-- CÁCH CHẠY: SQL Editor › dán file này › Run (sau khi đã chạy schema.sql).
-- CHẠY LẠI bất cứ lúc nào để "ĐẶT LẠI DỮ LIỆU DEMO": file sẽ xoá dữ liệu
-- của tài xế mẫu rồi chèn lại từ đầu (giống src/data/mockData.js).
--
-- Quy tắc ca 06:00–15:00 (app tự tính trạng thái, không lưu trong DB):
--   đến sớm < 05:55 · đúng giờ 05:55–06:05 · đi muộn > 06:05 · về sớm < 14:55
-- =============================================================

-- 1. Xoá dữ liệu cũ của tài xế mẫu
--    (xoá attendance sẽ tự xoá giải trình nhờ "on delete cascade")
delete from public.kpi_appeals where driver_code = 'TX-0127';
delete from public.attendance  where driver_code = 'TX-0127';

-- 2. Chấm công các ngày 2–12/11 (nghỉ Chủ Nhật 8/11)
insert into public.attendance (driver_code, work_date, clock_in, clock_out, note) values
  ('TX-0127', '2026-11-02', '05:50', '15:05', null),                      -- đến sớm
  ('TX-0127', '2026-11-03', '06:02', '15:10', null),                      -- đúng giờ
  ('TX-0127', '2026-11-04', '06:12', '15:20', 'Kẹt xe cầu Phú Mỹ'),       -- đi muộn (giải trình đã duyệt)
  ('TX-0127', '2026-11-05', '05:52', '15:02', null),                      -- đến sớm
  ('TX-0127', '2026-11-06', '06:00', '14:40', 'Về sớm đưa con đi khám'),  -- về sớm (giải trình chờ duyệt)
  ('TX-0127', '2026-11-07', '05:58', '15:15', null),                      -- đúng giờ
  ('TX-0127', '2026-11-09', '05:47', '15:08', null),                      -- đến sớm
  ('TX-0127', '2026-11-10', '06:18', '15:30', null),                      -- đi muộn (CHƯA giải trình)
  ('TX-0127', '2026-11-11', '05:56', '15:04', null),                      -- đúng giờ
  ('TX-0127', '2026-11-12', '05:54', null,    null);                      -- hôm nay: đã vào, chưa ra

-- 3. Giải trình mẫu: ngày 4 đã duyệt, ngày 6 chờ duyệt
insert into public.attendance_explanations (attendance_id, reason, detail, status)
select a.id, v.reason, v.detail, v.status
from (values
  ('2026-11-04'::date, 'Kẹt xe / tai nạn trên đường', 'Tai nạn trên cầu Phú Mỹ, kẹt 25 phút.',            'approved'),
  ('2026-11-06'::date, 'Việc gia đình',               'Đưa con đi khám bệnh, đã báo điều độ Lê Thu Hà.', 'pending')
) as v(work_date, reason, detail, status)
join public.attendance a
  on a.driver_code = 'TX-0127' and a.work_date = v.work_date;
