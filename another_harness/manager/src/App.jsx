// =============================================================
// App.jsx — Component gốc của app Quản lý
// Nhiệm vụ:
//   1. Giữ STATE dùng chung: trang đang mở, danh sách chuyến, hàng đợi duyệt, cấu hình, toast
//   2. Định nghĩa các HÀM XỬ LÝ (phân công, duyệt/từ chối, lưu cấu hình)
//   3. Dựng layout: Sidebar (trái) + Topbar (trên) + nội dung trang
// =============================================================
import { useCallback, useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import Toast from './components/ui/Toast'
import DashboardPage from './pages/DashboardPage'
import TripsPage from './pages/TripsPage'
import ApprovalsPage from './pages/ApprovalsPage'
import DriversPage from './pages/DriversPage'
import KpiPage from './pages/KpiPage'
import SettingsPage from './pages/SettingsPage'
import {
  TODAY,
  currentManager,
  drivers,
  vehicles,
  trips as initialTrips,
  approvals as initialApprovals,
  defaultSettings,
} from './data/mockData'

export default function App() {
  // ---------- STATE ----------
  const [page, setPage] = useState('dashboard') // trang đang mở
  const [pageOptions, setPageOptions] = useState({}) // tuỳ chọn khi mở trang (vd: bộ lọc)
  const [menuOpen, setMenuOpen] = useState(false) // menu trên màn hẹp
  const [trips, setTrips] = useState(initialTrips)
  // Mọi yêu cầu bắt đầu ở trạng thái 'pending' (chờ duyệt)
  const [approvals, setApprovals] = useState(() =>
    initialApprovals.map((a) => ({ ...a, status: 'pending', note: '' })),
  )
  const [settings, setSettings] = useState(defaultSettings)
  const [toast, setToast] = useState(null)

  const notify = useCallback((msg) => setToast(msg), [])
  const clearToast = useCallback(() => setToast(null), [])

  // ---------- Điều hướng (kèm tuỳ chọn, vd mở Chuyến với bộ lọc "Chưa phân công") ----------
  const navigate = (id, options = {}) => {
    setPage(id)
    setPageOptions(options)
    window.scrollTo({ top: 0 })
  }

  // ---------- Xử lý: giao chuyến cho lái xe + xe → trạng thái "Chờ nhận" ----------
  const handleAssign = (code, driverId, vehicleId) => {
    setTrips((prev) =>
      prev.map((t) => (t.code === code ? { ...t, driverId, vehicleId, status: 'waiting' } : t)),
    )
    const name = drivers.find((d) => d.id === driverId)?.name
    notify(`Đã giao ${code} cho ${name}. Chờ lái xe xác nhận.`)
  }

  // ---------- Xử lý: duyệt / từ chối một yêu cầu ----------
  const handleDecide = (id, status, note = '') => {
    setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status, note } : a)))
    notify(status === 'approved' ? `Đã duyệt ${id}.` : `Đã từ chối ${id}.`)
  }

  // ---------- Xử lý: lưu cấu hình ----------
  const handleSaveSettings = (next) => {
    setSettings(next)
    notify('Đã lưu cấu hình. KPI và cảnh báo được tính lại theo cấu hình mới.')
  }

  // ---------- Menu bên trái (badge = số việc cần xử lý) ----------
  const pendingCount = approvals.filter((a) => a.status === 'pending').length
  const unassignedCount = trips.filter((t) => t.status === 'unassigned').length
  const menu = [
    { id: 'dashboard', label: 'Tổng quan', icon: 'dashboard' },
    { id: 'trips', label: 'Chuyến & phân công', icon: 'local_shipping', badge: unassignedCount },
    { id: 'approvals', label: 'Duyệt yêu cầu', icon: 'inbox', badge: pendingCount },
    { id: 'drivers', label: 'Lái xe', icon: 'badge' },
    { id: 'kpi', label: 'KPI đội', icon: 'leaderboard' },
    { id: 'settings', label: 'Cấu hình', icon: 'tune' },
  ]
  const currentTitle = menu.find((m) => m.id === page).label

  // ---------- Chọn trang để hiển thị ----------
  const renderPage = () => {
    switch (page) {
      case 'trips':
        return (
          <TripsPage
            // key đổi theo bộ lọc → trang được tạo mới, nhận bộ lọc khởi tạo mới
            key={pageOptions.filter ?? 'all'}
            initialFilter={pageOptions.filter}
            trips={trips}
            drivers={drivers}
            vehicles={vehicles}
            settings={settings}
            today={TODAY}
            onAssign={handleAssign}
          />
        )
      case 'approvals':
        return <ApprovalsPage approvals={approvals} drivers={drivers} onDecide={handleDecide} />
      case 'drivers':
        return <DriversPage drivers={drivers} settings={settings} today={TODAY} />
      case 'kpi':
        return <KpiPage drivers={drivers} settings={settings} />
      case 'settings':
        return <SettingsPage settings={settings} defaults={defaultSettings} onSave={handleSaveSettings} />
      default:
        return (
          <DashboardPage
            trips={trips}
            drivers={drivers}
            vehicles={vehicles}
            approvals={approvals}
            settings={settings}
            today={TODAY}
            onNavigate={navigate}
          />
        )
    }
  }

  return (
    <div className="min-h-dvh">
      {/* ===== 1. Menu trái ===== */}
      <Sidebar
        items={menu}
        activeId={page}
        onNavigate={navigate}
        mobileOpen={menuOpen}
        onCloseMobile={() => setMenuOpen(false)}
        team={currentManager.team}
      />

      {/* ===== 2. Vùng nội dung (chừa 240px bên trái cho sidebar trên desktop) ===== */}
      <div className="lg:pl-60">
        <Topbar title={currentTitle} today={TODAY} manager={currentManager} onOpenMenu={() => setMenuOpen(true)} />
        <main className="px-4 lg:px-8 py-6 max-w-[1400px]">{renderPage()}</main>
      </div>

      {/* ===== 3. Thông báo nhanh ===== */}
      <Toast message={toast} onDone={clearToast} />
    </div>
  )
}
