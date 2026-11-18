// =============================================================
// App.jsx — Component gốc, "bộ não" của ứng dụng
// Nhiệm vụ:
//   1. Giữ các STATE dùng chung giữa nhiều tab
//      (tab đang mở, chuyến hiện tại, bảng chấm công, khiếu nại KPI, hộp thoại, toast)
//   2. Tính dữ liệu dẫn xuất dùng chung (KPI tính từ bảng chấm công)
//   3. Dựng khung layout: Header (trên) + Nội dung (giữa) + TabBar (dưới)
//   4. Định nghĩa các HÀM XỬ LÝ sự kiện rồi truyền xuống component con qua props
//   5. Tải / ghi dữ liệu chấm công qua services/attendanceService.js
//      (Supabase nếu đã cấu hình, nếu không thì dữ liệu mẫu)
// =============================================================
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AppHeader from './components/layout/AppHeader'
import BottomTabBar from './components/layout/BottomTabBar'
import BottomSheet from './components/ui/BottomSheet'
import Toast from './components/ui/Toast'
import HomePage from './pages/HomePage'
import AttendancePage from './pages/AttendancePage'
import PlaceholderPage from './pages/PlaceholderPage'
import { getSimNow, toClockString } from './hooks/useClock'
import { getDepartureStatus } from './lib/attendanceRules'
import { computeKpi } from './lib/kpi'
import * as attendanceService from './services/attendanceService'
import { driver, currentTrip, tabs, kpiInputs, TODAY } from './data/mockData'

export default function App() {
  // ---------- STATE ----------
  const [activeTab, setActiveTab] = useState('hom-nay') // tab đang chọn ở thanh dưới
  const [trip, setTrip] = useState(currentTrip) // chuyến đang chạy (bước tiến độ có thể thay đổi)
  const [records, setRecords] = useState(null) // bảng chấm công tháng (null = đang tải)
  const [dataSource, setDataSource] = useState(null) // nguồn dữ liệu: 'supabase' | 'mock'
  const [appeal, setAppeal] = useState(null) // khiếu nại KPI đã gửi (null = chưa gửi)
  const [sheet, setSheet] = useState(null) // hộp thoại đang mở: null | 'clockout' | 'sos'
  const [clockOutPreview, setClockOutPreview] = useState(null) // giờ ra ca dự kiến khi mở hộp xác nhận
  const [toast, setToast] = useState(null) // nội dung toast đang hiện (null = không hiện)

  // ---------- Hàm tiện ích ----------
  const notify = useCallback((msg) => setToast(msg), []) // hiện toast
  const closeSheet = useCallback(() => setSheet(null), []) // đóng hộp thoại
  const clearToast = useCallback(() => setToast(null), []) // xoá toast khi hết giờ

  // Cờ "đang lưu": chặn bấm 2 lần liên tiếp gây ghi trùng lên Supabase.
  // Dùng useRef (không phải useState) vì chỉ cần nhớ giá trị, không cần vẽ lại giao diện.
  const savingRef = useRef(false)

  // ---------- Tải dữ liệu chấm công MỘT LẦN khi mở app ----------
  useEffect(() => {
    let cancelled = false // tránh setState nếu component đã bị gỡ trước khi tải xong

    attendanceService
      .loadInitialData()
      .then((data) => {
        if (cancelled) return
        setRecords(data.records)
        setAppeal(data.appeal)
        setDataSource(data.source)
      })
      .catch((err) => {
        // Lỗi mạng ngoài dự kiến: vẫn không để app trắng màn hình
        console.error('[App] Không tải được dữ liệu chấm công', err)
        if (!cancelled) setToast('Không tải được dữ liệu chấm công.')
      })

    return () => {
      cancelled = true
    }
  }, [])

  // ---------- Dữ liệu dẫn xuất ----------
  // KPI được TÍNH LẠI mỗi khi bảng chấm công thay đổi (useMemo: chỉ tính khi records đổi)
  const kpi = useMemo(() => (records ? computeKpi(records, kpiInputs) : null), [records])
  const todayRecord = records?.find((r) => r.day === TODAY.day)

  // ---------- Hàm bọc cho mọi thao tác GHI dữ liệu ----------
  // 1. Chặn bấm trùng  2. Gọi service (Supabase)  3. Thành công → cập nhật state + toast
  // 4. Thất bại → toast báo lỗi, KHÔNG đổi state. Trả về true/false cho nơi gọi.
  const runSave = async (saveFn, onSuccess) => {
    if (savingRef.current) return false
    savingRef.current = true
    try {
      await saveFn()
      onSuccess()
      return true
    } catch (err) {
      console.error('[App] Lưu dữ liệu thất bại', err)
      notify(`Lỗi lưu dữ liệu: ${err.message ?? 'không rõ nguyên nhân'}`)
      return false
    } finally {
      savingRef.current = false
    }
  }

  // Chuyến đã tới bước cuối ("Ký nhận") chưa?
  const lastStep = trip.steps.length - 1
  const tripFinished = trip.currentStep >= lastStep

  // ---------- Xử lý: bấm "Cập nhật đến trạm" → tiến thêm 1 bước ----------
  const handleArrive = () => {
    if (tripFinished) {
      notify('Chuyến đã hoàn tất, không còn bước nào.')
      return
    }
    const next = trip.currentStep + 1
    setTrip({ ...trip, currentStep: next })
    notify(`Đã cập nhật: ${trip.steps[next]}`)
  }

  // ---------- Xử lý: bấm "Ra ca" → chốt giờ hiện tại để hiện trong hộp xác nhận ----------
  const openClockOut = () => {
    setClockOutPreview(toClockString(getSimNow()))
    setSheet('clockout')
  }

  // ---------- Xử lý: xác nhận ra ca → ghi giờ ra vào bản ghi hôm nay ----------
  // Bảng công + KPI Chuyên cần sẽ tự cập nhật vì cả hai đều đọc từ `records`.
  const confirmClockOut = async () => {
    closeSheet()
    await runSave(
      () => attendanceService.clockOut(todayRecord, clockOutPreview),
      () => {
        setRecords((prev) =>
          prev.map((r) => (r.day === TODAY.day ? { ...r, clockOut: clockOutPreview } : r)),
        )
        notify(`Đã ra ca lúc ${clockOutPreview}. Hẹn gặp lại!`)
      },
    )
  }

  // ---------- Xử lý: gửi giải trình cho một ngày ----------
  // Trả về true/false để form biết nên đóng (thành công) hay giữ lại (lỗi)
  const handleSubmitExplanation = (day, explanation) => {
    const record = records.find((r) => r.day === day)
    return runSave(
      () => attendanceService.submitExplanation(record, explanation),
      () => {
        setRecords((prev) => prev.map((r) => (r.day === day ? { ...r, explanation } : r)))
        notify('Đã gửi giải trình, chờ quản lý duyệt.')
      },
    )
  }

  // ---------- Xử lý: gửi khiếu nại KPI ----------
  const handleSubmitAppeal = (data) =>
    runSave(
      () => attendanceService.submitAppeal(data),
      () => {
        setAppeal(data)
        notify('Đã gửi khiếu nại KPI.')
      },
    )

  // ---------- Xử lý: bấm một nút ở "Lối tắt tác vụ" ----------
  const handleQuickAction = (id) => {
    if (id === 'sos') setSheet('sos') // nút đỏ → mở xác nhận khẩn cấp
    else if (id === 'expense') notify('Mở form thêm chi phí…')
    else if (id === 'repair') notify('Mở form báo hỏng hóc…')
  }

  // ---------- Xử lý: xác nhận gửi SOS ----------
  const confirmSos = () => {
    closeSheet()
    notify('Đã gửi tín hiệu cứu hộ tới Phòng An toàn Vận tải!')
  }

  // Ra ca lúc này có bị tính "về sớm" không? (để cảnh báo trong hộp xác nhận)
  const earlyLeave = clockOutPreview ? getDepartureStatus(clockOutPreview) : null
  const isEarlyLeave = earlyLeave?.type === 'earlyLeave'

  // Tìm thông tin tab đang mở để hiển thị tiêu đề / trang tạm
  const currentTab = tabs.find((t) => t.id === activeTab)

  // ---------- Chọn trang theo tab ----------
  const renderPage = () => {
    // Hôm nay & Chấm công cần bảng công (ShiftCard cần bản ghi hôm nay)
    // → hiện màn chờ cho tới khi tải xong
    if (!records && (activeTab === 'hom-nay' || activeTab === 'cham-cong')) {
      return (
        <div className="flex flex-col items-center gap-3 pt-16 text-on-surface-variant">
          <span className="w-8 h-8 rounded-full border-[3px] border-primary/25 border-t-primary animate-spin" />
          <span className="text-footnote">Đang tải dữ liệu…</span>
        </div>
      )
    }

    switch (activeTab) {
      case 'hom-nay':
        return (
          <HomePage
            trip={trip}
            todayRecord={todayRecord}
            kpi={kpi}
            onClockOut={openClockOut}
            onArrive={handleArrive}
            onQuickAction={handleQuickAction}
            notify={notify}
          />
        )
      case 'cham-cong':
        return (
          <AttendancePage
            records={records}
            dataSource={dataSource}
            kpi={kpi}
            appeal={appeal}
            onClockOut={openClockOut}
            onSubmitExplanation={handleSubmitExplanation}
            onSubmitAppeal={handleSubmitAppeal}
          />
        )
      default:
        return <PlaceholderPage tab={currentTab} />
    }
  }

  return (
    // ---------- Khung app: giới hạn rộng như điện thoại, căn giữa trên màn hình lớn ----------
    <div className="min-h-dvh mx-auto max-w-md bg-surface relative">
      {/* ===== 1. HEADER cố định trên cùng ===== */}
      <AppHeader
        driver={driver}
        title={activeTab === 'hom-nay' ? 'Hôm Nay' : currentTab.label}
        onSos={() => setSheet('sos')}
      />

      {/* ===== 2. NỘI DUNG CHÍNH — chừa khoảng trên/dưới cho header & tab bar ===== */}
      <main className="pt-28 pb-28 px-margin">{renderPage()}</main>

      {/* ===== 3. TAB BAR cố định dưới cùng ===== */}
      <BottomTabBar tabs={tabs} activeId={activeTab} onChange={setActiveTab} />

      {/* ===== 4. HỘP THOẠI: Ra ca =====
          - Chuyến chưa xong  → chặn, cảnh báo không được ra ca
          - Chuyến đã xong    → cho xác nhận; nếu trước 14:55 thì báo sẽ tính "về sớm" */}
      <BottomSheet
        open={sheet === 'clockout'}
        onClose={closeSheet}
        icon={tripFinished ? 'logout' : 'warning'}
        tone={tripFinished && !isEarlyLeave ? 'primary' : 'error'}
        title={tripFinished ? `Ra ca lúc ${clockOutPreview}?` : 'Cảnh báo chuyến đang chạy'}
        subtitle={
          tripFinished
            ? `Chuyến ${trip.code} đã hoàn tất.`
            : `Chuyến xe ${trip.code} chưa xả hàng.`
        }
        actions={
          tripFinished
            ? [
                {
                  label: isEarlyLeave ? 'Vẫn ra ca (tính về sớm)' : 'Ra ca & Bàn giao xe',
                  variant: isEarlyLeave ? 'danger' : 'primary',
                  onClick: confirmClockOut,
                },
                { label: 'Huỷ', onClick: closeSheet },
              ]
            : [
                { label: 'Tiếp tục lái xe', variant: 'primary', onClick: closeSheet },
                {
                  label: 'Liên hệ Điều hành kho',
                  onClick: () => {
                    closeSheet()
                    notify('Đang gọi Điều hành kho…')
                  },
                },
              ]
        }
      >
        {!tripFinished &&
          'Bạn không thể Ra Ca khi xe bồn đang vận chuyển hàng xăng dầu nguy hiểm. Hãy hoàn tất giao nhận hoặc bàn giao cho tài xế hỗ trợ.'}
        {tripFinished && isEarlyLeave &&
          `Ca kết thúc lúc 15:00. Ra ca bây giờ sẽ bị tính VỀ SỚM ${earlyLeave.diff} phút và trừ điểm KPI Chuyên cần nếu không được duyệt giải trình.`}
        {tripFinished && !isEarlyLeave &&
          'Hãy chắc chắn bạn đã bàn giao chìa khoá và biên bản xe cho kho trước khi ra ca.'}
      </BottomSheet>

      {/* ===== 5. HỘP THOẠI: SOS khẩn cấp ===== */}
      <BottomSheet
        open={sheet === 'sos'}
        onClose={closeSheet}
        icon="fmd_bad"
        tone="error"
        title="Kích hoạt khẩn cấp?"
        subtitle="Sự cố xe bồn / tràn nhiên liệu"
        actions={[
          { label: 'Gửi SOS & Cắt van khẩn', variant: 'danger', onClick: confirmSos },
          { label: 'Huỷ', onClick: closeSheet },
        ]}
      >
        Hệ thống sẽ đóng van ngắt khẩn cấp và gửi toạ độ GPS hiện tại tới điều phối trung tâm.
      </BottomSheet>

      {/* ===== 6. TOAST thông báo nhanh ===== */}
      <Toast message={toast} onDone={clearToast} />
    </div>
  )
}
