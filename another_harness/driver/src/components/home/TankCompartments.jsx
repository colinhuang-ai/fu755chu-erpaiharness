// =============================================================
// TankCompartments — thanh trực quan các khoang bồn của xe
// Mỗi ô = 1 khoang, màu theo loại nhiên liệu (RON95 cam, DO xanh).
// Bên dưới là chú thích tổng số lít theo từng loại (tự cộng từ dữ liệu).
// =============================================================
import { fuelTypes } from '../../data/mockData'

// Định dạng số kiểu Việt Nam: 10000 → "10.000"
const formatLiters = (n) => n.toLocaleString('vi-VN')

export default function TankCompartments({ compartments, seals }) {
  // ---------- Tính tổng lít theo từng loại nhiên liệu ----------
  // Kết quả ví dụ: { ron95: 10000, do: 8000 }
  const totals = compartments.reduce((acc, c) => {
    acc[c.fuel] = (acc[c.fuel] || 0) + c.liters
    return acc
  }, {})

  return (
    <div className="bg-surface-container-low rounded-lg p-3 flex flex-col gap-2">
      {/* ---------- Hàng tiêu đề: số khoang + tình trạng niêm phong ---------- */}
      <div className="flex justify-between items-start gap-2">
        <span className="text-caption-1 font-semibold text-on-surface-variant">
          Tải trọng khoang bồn ({compartments.length} khoang)
        </span>
        <span className="text-caption-2 font-medium text-secondary text-right">
          Niêm phong kẹp chì: {seals.done === seals.total ? 'Đầy đủ' : 'Thiếu'} (
          {seals.done}/{seals.total})
        </span>
      </div>

      {/* ---------- Các ô khoang: grid tự chia đều theo số khoang ---------- */}
      <div
        className="grid gap-1.5 h-6"
        style={{ gridTemplateColumns: `repeat(${compartments.length}, minmax(0, 1fr))` }}
      >
        {compartments.map((c) => (
          <div
            key={c.id}
            title={`${c.id}: ${formatLiters(c.liters)}L ${fuelTypes[c.fuel].label}`}
            className={`${fuelTypes[c.fuel].cell} rounded-sm flex items-center justify-center text-[10px] font-bold tabular-nums`}
          >
            {c.id} {c.liters / 1000}kL
          </div>
        ))}
      </div>

      {/* ---------- Chú thích màu + tổng lít mỗi loại ---------- */}
      <div className="flex justify-between text-[10px] text-on-surface-variant">
        {Object.entries(totals).map(([fuel, liters]) => (
          <span key={fuel} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${fuelTypes[fuel].dot}`} />
            {fuelTypes[fuel].label} ({formatLiters(liters)} L)
          </span>
        ))}
      </div>
    </div>
  )
}
