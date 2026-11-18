// =============================================================
// attendanceService.js — Lớp dữ liệu của tab Chấm công
//
// Giao diện (App, các page) KHÔNG gọi Supabase trực tiếp mà gọi các hàm ở đây.
// Nhờ vậy:
//   - Đổi nguồn dữ liệu (mock ↔ Supabase ↔ API khác) chỉ phải sửa file này.
//   - Khi chưa cấu hình / chưa tạo bảng, app tự rơi về DỮ LIỆU MẪU và vẫn chạy.
//
// Các hàm:
//   loadInitialData()                 → { source, records, appeal }
//   clockOut(record, 'HH:MM')         → ghi giờ ra ca
//   submitExplanation(record, data)   → gửi giải trình
//   submitAppeal(data)                → gửi khiếu nại KPI
// Hàm ghi sẽ THROW lỗi nếu Supabase từ chối → App bắt lỗi và hiện toast.
// =============================================================
import { supabase } from '../lib/supabase'
import { attendanceRecords, TODAY } from '../data/mockData'

// ---------- Hằng số của bản demo (chưa có đăng nhập) ----------
export const DRIVER_CODE = 'TX-0127'
const pad = (n) => String(n).padStart(2, '0')
const PERIOD = `${TODAY.year}-${pad(TODAY.month)}` // '2026-11'
const MONTH_START = `${PERIOD}-01`
const MONTH_END = `${PERIOD}-${pad(new Date(TODAY.year, TODAY.month, 0).getDate())}`

// Nguồn đang dùng: 'supabase' | 'mock'. Được quyết định trong loadInitialData().
let source = 'mock'

// ---------- Chuyển 1 dòng Supabase → object mà giao diện đang dùng ----------
// Row:    { id, work_date: '2026-11-04', clock_in: '06:12:00', clock_out, note,
//           attendance_explanations: [{ reason, detail, status, created_at }] }
// Record: { id, day: 4, clockIn: '06:12', clockOut, note, explanation }
function toRecord(row) {
  // Lấy giải trình MỚI NHẤT (bảng giải trình chỉ thêm mới, không sửa)
  const latest = [...(row.attendance_explanations ?? [])].sort((a, b) =>
    b.created_at.localeCompare(a.created_at),
  )[0]

  return {
    id: row.id,
    day: Number(row.work_date.slice(8, 10)),
    clockIn: row.clock_in.slice(0, 5), // '06:12:00' → '06:12'
    clockOut: row.clock_out ? row.clock_out.slice(0, 5) : null,
    note: row.note ?? undefined,
    explanation: latest
      ? { reason: latest.reason, detail: latest.detail, status: latest.status }
      : undefined,
  }
}

// ---------- Dữ liệu mẫu (khi không dùng được Supabase) ----------
function mockData(reason) {
  console.warn(`[attendanceService] Dùng dữ liệu mẫu: ${reason}`)
  source = 'mock'
  return { source, records: attendanceRecords, appeal: null }
}

// =============================================================
// ĐỌC: tải bảng công tháng + khiếu nại KPI của kỳ hiện tại
// =============================================================
export async function loadInitialData() {
  if (!supabase) return mockData('chưa cấu hình .env.local')

  // Hai truy vấn chạy song song cho nhanh
  const [attendanceRes, appealRes] = await Promise.all([
    supabase
      .from('attendance')
      // select kèm bảng con giải trình (Supabase tự nối qua khoá ngoại attendance_id)
      .select('id, work_date, clock_in, clock_out, note, attendance_explanations(reason, detail, status, created_at)')
      .eq('driver_code', DRIVER_CODE)
      .gte('work_date', MONTH_START)
      .lte('work_date', MONTH_END)
      .order('work_date'),
    supabase
      .from('kpi_appeals')
      .select('criterion_id, criterion_name, content, status')
      .eq('driver_code', DRIVER_CODE)
      .eq('period', PERIOD)
      .order('created_at', { ascending: false })
      .limit(1),
  ])

  // Lỗi (thường là chưa chạy schema.sql → bảng không tồn tại) → rơi về mock
  const error = attendanceRes.error || appealRes.error
  if (error) return mockData(`${error.code ?? ''} ${error.message}`.trim())

  // Có bảng nhưng chưa có dữ liệu ngày hôm nay → app không có thẻ chấm công để hiện
  const records = attendanceRes.data.map(toRecord)
  if (!records.some((r) => r.day === TODAY.day)) {
    return mockData('bảng attendance chưa có dữ liệu hôm nay (hãy chạy seed.sql)')
  }

  const appealRow = appealRes.data[0]
  source = 'supabase'
  return {
    source,
    records,
    appeal: appealRow
      ? {
          criterionId: appealRow.criterion_id,
          criterionName: appealRow.criterion_name,
          content: appealRow.content,
        }
      : null,
  }
}

// =============================================================
// GHI: ra ca — chỉ cập nhật được khi clock_out đang trống (xem policy trong schema.sql)
// =============================================================
export async function clockOut(record, time) {
  if (source !== 'supabase') return // chế độ mock: chỉ đổi state ở App

  const { data, error } = await supabase
    .from('attendance')
    .update({ clock_out: time })
    .eq('id', record.id)
    .is('clock_out', null)
    .select('id')

  if (error) throw error
  // RLS chặn thì Supabase không báo lỗi mà trả về 0 dòng → tự báo lỗi
  if (data.length === 0) throw new Error('Không ghi được giờ ra ca (ngày này đã ra ca rồi?)')
}

// =============================================================
// GHI: gửi giải trình cho 1 ngày (luôn ở trạng thái chờ duyệt)
// =============================================================
export async function submitExplanation(record, { reason, detail }) {
  if (source !== 'supabase') return

  const { error } = await supabase
    .from('attendance_explanations')
    .insert({ attendance_id: record.id, reason, detail, status: 'pending' })

  if (error) throw error
}

// =============================================================
// GHI: gửi khiếu nại KPI cho kỳ hiện tại
// =============================================================
export async function submitAppeal({ criterionId, criterionName, content }) {
  if (source !== 'supabase') return

  const { error } = await supabase.from('kpi_appeals').insert({
    driver_code: DRIVER_CODE,
    period: PERIOD,
    criterion_id: criterionId,
    criterion_name: criterionName,
    content,
    status: 'pending',
  })

  if (error) throw error
}
