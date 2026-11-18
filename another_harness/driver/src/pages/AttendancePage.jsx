// =============================================================
// AttendancePage — tab "Chấm công" (specs/prompt-driveros.md mục 5.3)
// Có 2 phần, chuyển qua lại bằng Segmented control:
//
//   ┌ Bảng công ─────────────────────────────┐
//   │ ShiftCard        — thẻ chấm công hôm nay│
//   │ AttendanceStats  — 4 số liệu tháng      │
//   │ MonthCalendar    — lịch có chấm màu     │
//   │  └ chạm ngày → DayDetailSheet           │
//   │      └ "Gửi giải trình" → ExplanationSheet
//   └────────────────────────────────────────┘
//   ┌ KPI ───────────────────────────────────┐
//   │ KpiSummaryCard   — vòng điểm, thưởng    │
//   │ KpiCriteriaList  — 6 chỉ tiêu           │
//   │  └ chạm chỉ tiêu → KpiDetailSheet       │
//   │ KpiHistoryChart  — cột 4 tháng          │
//   │ Nút Khiếu nại    → KpiAppealSheet       │
//   └────────────────────────────────────────┘
//
// Dữ liệu (records, kpi, appeal) do App giữ và truyền xuống;
// trang này chỉ giữ state GIAO DIỆN: đang xem phần nào, sheet nào đang mở.
// =============================================================
import { useState } from 'react'
import SegmentedControl from '../components/ui/SegmentedControl'
import Card from '../components/ui/Card'
import Icon from '../components/ui/Icon'
import ShiftCard from '../components/home/ShiftCard'
import AttendanceStats from '../components/attendance/AttendanceStats'
import MonthCalendar from '../components/attendance/MonthCalendar'
import DayDetailSheet from '../components/attendance/DayDetailSheet'
import ExplanationSheet from '../components/attendance/ExplanationSheet'
import KpiSummaryCard from '../components/kpi/KpiSummaryCard'
import KpiCriteriaList from '../components/kpi/KpiCriteriaList'
import KpiDetailSheet from '../components/kpi/KpiDetailSheet'
import KpiHistoryChart from '../components/kpi/KpiHistoryChart'
import KpiAppealSheet from '../components/kpi/KpiAppealSheet'
import useClock from '../hooks/useClock'
import { summarizeMonth } from '../lib/attendanceRules'
import { shift, TODAY, kpiHistory } from '../data/mockData'

const SEGMENTS = [
  { id: 'timesheet', label: 'Bảng công' },
  { id: 'kpi', label: 'KPI' },
]

// Nhãn nhỏ cho biết dữ liệu đang lấy từ đâu
const SOURCE_BADGE = {
  supabase: { label: 'Dữ liệu: Supabase', icon: 'cloud_done', className: 'bg-secondary-container/30 text-on-secondary-container' },
  // Rơi về mock khi: thiếu .env.local, chưa chạy schema.sql/seed.sql, hoặc lỗi kết nối
  mock: { label: 'Dữ liệu mẫu (Supabase chưa sẵn sàng)', icon: 'cloud_off', className: 'bg-surface-container-high text-on-surface-variant' },
}

export default function AttendancePage({
  records,
  dataSource,
  kpi,
  appeal,
  onClockOut,
  onSubmitExplanation,
  onSubmitAppeal,
}) {
  // ---------- State giao diện ----------
  const [segment, setSegment] = useState('timesheet') // phần đang xem
  const [selectedDay, setSelectedDay] = useState(null) // ngày đang xem chi tiết (số ngày)
  const [explainDay, setExplainDay] = useState(null) // ngày đang viết giải trình
  const [criterion, setCriterion] = useState(null) // chỉ tiêu KPI đang xem cách tính
  const [appealOpen, setAppealOpen] = useState(false) // sheet khiếu nại có mở không

  // Đồng hồ giả lập → dùng để tính thời gian làm của hôm nay (chưa ra ca)
  const now = useClock()
  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  // ---------- Dữ liệu dẫn xuất ----------
  const summary = summarizeMonth(records)
  const todayRecord = records.find((r) => r.day === TODAY.day)
  // Luôn lấy bản ghi MỚI NHẤT từ records (để sheet cập nhật ngay sau khi gửi giải trình)
  const selectedRecord = records.find((r) => r.day === selectedDay) ?? null
  const explainRecord = records.find((r) => r.day === explainDay) ?? null
  // Lịch sử KPI: 3 tháng trước (mock) + tháng này (tính thật)
  const history = [...kpiHistory, { label: 'T11', score: kpi.total, current: true }]

  // ---------- Xử lý gửi giải trình ----------
  // Chờ App lưu xong: thành công → đóng form, quay về chi tiết ngày; lỗi → giữ form để gửi lại
  const handleExplanation = async (day, explanation) => {
    const ok = await onSubmitExplanation(day, explanation)
    if (!ok) return
    setExplainDay(null)
    setSelectedDay(day)
  }

  const badge = SOURCE_BADGE[dataSource] ?? SOURCE_BADGE.mock

  return (
    <div className="flex flex-col gap-space-lg">
      {/* ===== Nhãn nguồn dữ liệu (Supabase / Dữ liệu mẫu) ===== */}
      <span
        className={`self-start -mb-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-caption-1 font-semibold ${badge.className}`}
      >
        <Icon name={badge.icon} size={14} />
        {badge.label}
      </span>

      {/* ===== Segmented: Bảng công / KPI ===== */}
      <SegmentedControl
        options={SEGMENTS}
        value={segment}
        onChange={setSegment}
        ariaLabel="Chọn nội dung chấm công"
      />

      {segment === 'timesheet' ? (
        /* ================= PHẦN 1: BẢNG CÔNG ================= */
        <>
          {/* Thẻ chấm công hôm nay (dùng lại component của trang Hôm nay) */}
          <ShiftCard shift={shift} record={todayRecord} onClockOut={onClockOut} />

          {/* 4 số liệu tháng */}
          <AttendanceStats summary={summary} />

          {/* Lịch tháng — chạm ngày để mở chi tiết */}
          <MonthCalendar
            year={TODAY.year}
            month={TODAY.month}
            today={TODAY.day}
            records={records}
            selectedDay={selectedDay}
            onSelectDay={(record) => setSelectedDay(record.day)}
          />
        </>
      ) : (
        /* ================= PHẦN 2: KPI ================= */
        <>
          <KpiSummaryCard kpi={kpi} />
          <KpiCriteriaList criteria={kpi.criteria} onSelect={setCriterion} />
          <KpiHistoryChart history={history} />

          {/* Khiếu nại: đã gửi → hiện trạng thái; chưa gửi → hiện nút */}
          {appeal ? (
            <Card className="p-space-md flex items-start gap-3">
              <span className="w-10 h-10 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0">
                <Icon name="hourglass_top" size={22} />
              </span>
              <div className="min-w-0">
                <p className="text-subheadline font-semibold">
                  Đã gửi khiếu nại: {appeal.criterionName}
                </p>
                <p className="text-footnote text-on-surface-variant">
                  Đang chờ quản lý đội phản hồi.
                </p>
              </div>
            </Card>
          ) : (
            <button
              type="button"
              onClick={() => setAppealOpen(true)}
              className="h-12 rounded-xl bg-surface-container-lowest text-error text-headline shadow-sm flex items-center justify-center gap-2 active:opacity-75 transition"
            >
              <Icon name="report" size={20} />
              Khiếu nại KPI
            </button>
          )}
        </>
      )}

      {/* ===== Các sheet (chỉ một cái hiện tại một thời điểm) ===== */}

      {/* Chi tiết một ngày */}
      <DayDetailSheet
        record={selectedRecord}
        year={TODAY.year}
        month={TODAY.month}
        nowMinutes={nowMinutes}
        onClose={() => setSelectedDay(null)}
        onExplain={(record) => {
          setSelectedDay(null) // đóng chi tiết
          setExplainDay(record.day) // mở form giải trình
        }}
      />

      {/* Form giải trình — key theo ngày để form trống lại khi đổi ngày */}
      {explainRecord && (
        <ExplanationSheet
          key={explainRecord.day}
          record={explainRecord}
          year={TODAY.year}
          month={TODAY.month}
          onClose={() => setExplainDay(null)}
          onSubmit={handleExplanation}
        />
      )}

      {/* Cách tính điểm một chỉ tiêu */}
      <KpiDetailSheet criterion={criterion} onClose={() => setCriterion(null)} />

      {/* Form khiếu nại — chỉ gắn vào khi mở để mỗi lần mở là form mới */}
      {appealOpen && (
        <KpiAppealSheet
          open
          criteria={kpi.criteria}
          onClose={() => setAppealOpen(false)}
          onSubmit={async (data) => {
            // Chỉ đóng form khi lưu thành công
            if (await onSubmitAppeal(data)) setAppealOpen(false)
          }}
        />
      )}
    </div>
  )
}
