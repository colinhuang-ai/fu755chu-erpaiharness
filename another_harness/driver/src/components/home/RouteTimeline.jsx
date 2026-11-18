// =============================================================
// RouteTimeline — lộ trình dạng timeline dọc: Điểm xuất phát → Điểm đến
// Có một đường kẻ dọc nối 2 chấm tròn (xanh dương = đi, xanh lá = đến).
// =============================================================
export default function RouteTimeline({ route }) {
  return (
    <div className="relative flex flex-col gap-2.5 pl-6">
      {/* Đường kẻ dọc nối các điểm */}
      <div className="absolute left-2.5 top-2 bottom-3 w-0.5 bg-surface-variant" />

      {/* ---------- Điểm xuất phát ---------- */}
      <div className="relative flex flex-col">
        <span className="absolute -left-[18px] top-1 w-2.5 h-2.5 rounded-full bg-primary" />
        <span className="text-caption-2 text-on-surface-variant">{route.from.label}</span>
        <span className="text-subheadline font-semibold">{route.from.name}</span>
      </div>

      {/* ---------- Điểm đến (kèm địa chỉ chi tiết) ---------- */}
      <div className="relative flex flex-col pt-1">
        <span className="absolute -left-[18px] top-2 w-2.5 h-2.5 rounded-full bg-secondary" />
        <span className="text-caption-2 text-on-surface-variant">{route.to.label}</span>
        <span className="text-subheadline font-semibold">{route.to.name}</span>
        <span className="text-footnote text-on-surface-variant mt-0.5">{route.to.address}</span>
      </div>
    </div>
  )
}
