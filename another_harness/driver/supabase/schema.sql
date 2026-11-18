-- =============================================================
-- schema.sql — Tạo bảng cho tab Chấm công của DriverOS (prototype)
--
-- CÁCH CHẠY: Supabase Dashboard › SQL Editor › New query
--            → dán toàn bộ file này → Run. Sau đó chạy tiếp seed.sql.
-- Chạy lại nhiều lần cũng được (dùng "if not exists" / "drop policy if exists").
--
-- ⚠️  CẢNH BÁO: các POLICY bên dưới là bản DEMO.
--     App chưa có đăng nhập, nên trình duyệt truy cập bằng role "anon"
--     (publishable key) và chỉ được thao tác trên tài xế mẫu 'TX-0127'.
--     Bất kỳ ai có publishable key đều đọc/ghi được dữ liệu của tài xế này.
--     Khi làm thật: thêm Supabase Auth, liên kết auth.uid() với tài xế,
--     và viết lại policy theo auth.uid() (xem TDD mục 5.6).
-- =============================================================


-- -------------------------------------------------------------
-- 1. Bảng ATTENDANCE — mỗi dòng = 1 ngày chấm công của 1 tài xế
--    (Prototype lưu giờ dạng time theo giờ Việt Nam cho dễ đọc;
--     TDD dùng clock_in_at / clock_out_at kiểu timestamptz.)
-- -------------------------------------------------------------
create table if not exists public.attendance (
  id          bigint generated always as identity primary key,
  driver_code text not null,                 -- mã tài xế, vd 'TX-0127'
  work_date   date not null,                 -- ngày làm việc
  clock_in    time not null,                 -- giờ vào ca
  clock_out   time,                          -- giờ ra ca (null = đang trong ca)
  note        text,                          -- ghi chú của ngày
  created_at  timestamptz not null default now(),
  unique (driver_code, work_date)            -- mỗi tài xế chỉ 1 dòng / ngày
);


-- -------------------------------------------------------------
-- 2. Bảng ATTENDANCE_EXPLANATIONS — giải trình đi muộn / về sớm
--    Chỉ thêm mới (append-only); app lấy bản mới nhất theo created_at.
-- -------------------------------------------------------------
create table if not exists public.attendance_explanations (
  id            bigint generated always as identity primary key,
  attendance_id bigint not null references public.attendance (id) on delete cascade,
  reason        text not null,               -- lý do (chọn từ danh sách)
  detail        text not null,               -- mô tả chi tiết
  status        text not null default 'pending'
                check (status in ('pending', 'approved', 'rejected')),
  created_at    timestamptz not null default now()
);

create index if not exists attendance_explanations_attendance_id_idx
  on public.attendance_explanations (attendance_id);


-- -------------------------------------------------------------
-- 3. Bảng KPI_APPEALS — khiếu nại điểm KPI theo kỳ (tháng)
-- -------------------------------------------------------------
create table if not exists public.kpi_appeals (
  id             bigint generated always as identity primary key,
  driver_code    text not null,
  period         text not null,              -- kỳ KPI, vd '2026-11'
  criterion_id   text not null,              -- id chỉ tiêu, vd 'attendance'
  criterion_name text not null,              -- tên hiển thị, vd 'Chuyên cần'
  content        text not null,              -- nội dung & bằng chứng
  status         text not null default 'pending'
                 check (status in ('pending', 'accepted', 'rejected')),
  created_at     timestamptz not null default now()
);


-- -------------------------------------------------------------
-- 4. Bật Row Level Security (RLS) — không có policy thì không ai đọc/ghi được
-- -------------------------------------------------------------
alter table public.attendance              enable row level security;
alter table public.attendance_explanations enable row level security;
alter table public.kpi_appeals             enable row level security;


-- -------------------------------------------------------------
-- 5. Quyền ở mức BẢNG / CỘT cho role anon (DEMO)
--    - attendance: chỉ đọc, và chỉ được sửa đúng cột clock_out
--    - explanations / appeals: đọc + thêm mới (không sửa, không xoá)
-- -------------------------------------------------------------
revoke all on public.attendance, public.attendance_explanations, public.kpi_appeals from anon;

grant select                   on public.attendance              to anon;
grant update (clock_out)       on public.attendance              to anon;
grant select, insert           on public.attendance_explanations to anon;
grant select, insert           on public.kpi_appeals             to anon;


-- -------------------------------------------------------------
-- 6. Policy (luật theo DÒNG) cho role anon — DEMO, chỉ tài xế 'TX-0127'
-- -------------------------------------------------------------

-- 6.1 attendance: xem các ngày của tài xế mẫu
drop policy if exists "demo_anon_select_attendance" on public.attendance;
create policy "demo_anon_select_attendance"
  on public.attendance for select to anon
  using (driver_code = 'TX-0127');

-- 6.2 attendance: chỉ được RA CA cho ngày chưa ra ca (clock_out đang null)
drop policy if exists "demo_anon_clock_out" on public.attendance;
create policy "demo_anon_clock_out"
  on public.attendance for update to anon
  using (driver_code = 'TX-0127' and clock_out is null)   -- dòng được phép sửa
  with check (driver_code = 'TX-0127');                   -- dữ liệu sau khi sửa

-- 6.3 explanations: xem giải trình thuộc các ngày của tài xế mẫu
drop policy if exists "demo_anon_select_explanations" on public.attendance_explanations;
create policy "demo_anon_select_explanations"
  on public.attendance_explanations for select to anon
  using (exists (
    select 1 from public.attendance a
    where a.id = attendance_id and a.driver_code = 'TX-0127'
  ));

-- 6.4 explanations: chỉ được gửi giải trình mới ở trạng thái 'pending'
drop policy if exists "demo_anon_insert_explanations" on public.attendance_explanations;
create policy "demo_anon_insert_explanations"
  on public.attendance_explanations for insert to anon
  with check (
    status = 'pending'
    and exists (
      select 1 from public.attendance a
      where a.id = attendance_id and a.driver_code = 'TX-0127'
    )
  );

-- 6.5 kpi_appeals: xem khiếu nại của tài xế mẫu
drop policy if exists "demo_anon_select_appeals" on public.kpi_appeals;
create policy "demo_anon_select_appeals"
  on public.kpi_appeals for select to anon
  using (driver_code = 'TX-0127');

-- 6.6 kpi_appeals: chỉ được gửi khiếu nại mới ở trạng thái 'pending'
drop policy if exists "demo_anon_insert_appeals" on public.kpi_appeals;
create policy "demo_anon_insert_appeals"
  on public.kpi_appeals for insert to anon
  with check (driver_code = 'TX-0127' and status = 'pending');
