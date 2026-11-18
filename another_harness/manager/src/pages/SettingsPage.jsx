// =============================================================
// SettingsPage — "Cấu hình" (specs F-10.4)
// Quy tắc nghiệp vụ là CẤU HÌNH, không viết cứng trong code (TDD mục 5.4):
//   - Ca làm & dung sai
//   - Ngưỡng hao hụt, lệch nạp, định mức chi phí
//   - Trọng số KPI (tổng bắt buộc = 100%)
//   - Số ngày nhắc trước khi giấy tờ hết hạn
// Sửa trên bản nháp (draft); chỉ khi bấm "Lưu" mới áp dụng cho toàn app.
// =============================================================
import { useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { KPI_CRITERIA } from '../lib/kpi'

// ---------- Một ô nhập số có nhãn + đơn vị ----------
function NumberField({ id, label, value, onChange, unit, step = 1, min = 0 }) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1">
      <span className="text-footnote text-on-surface-variant">{label}</span>
      <div className="flex items-center rounded-lg border border-outline-variant bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary/30">
        <input
          id={id}
          type="number"
          step={step}
          min={min}
          value={value}
          // Ô trống → giữ chuỗi rỗng để người dùng gõ lại; còn lại đổi sang số
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          className="flex-1 min-w-0 h-10 px-3 bg-transparent text-body tabular-nums outline-none"
        />
        {unit && <span className="pr-3 text-footnote text-on-surface-variant">{unit}</span>}
      </div>
    </label>
  )
}

// ---------- Ô nhập giờ (HH:MM) ----------
function TimeField({ id, label, value, onChange }) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1">
      <span className="text-footnote text-on-surface-variant">{label}</span>
      <input
        id={id}
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-body tabular-nums outline-none focus:ring-2 focus:ring-primary/30"
      />
    </label>
  )
}

export default function SettingsPage({ settings, defaults, onSave }) {
  // ---------- Bản nháp: copy cấu hình hiện tại để sửa ----------
  const [draft, setDraft] = useState(settings)

  // Hàm cập nhật một trường lồng nhau, vd: update('shift', 'start', '06:30')
  const update = (group, key, value) =>
    setDraft((d) => ({ ...d, [group]: { ...d[group], [key]: value } }))

  // ---------- Kiểm tra hợp lệ ----------
  const weightSum = KPI_CRITERIA.reduce((s, c) => s + (Number(draft.kpiWeights[c.id]) || 0), 0)
  const errors = []
  if (weightSum !== 100) errors.push(`Tổng trọng số KPI phải bằng 100% (hiện ${weightSum}%).`)
  if (draft.shift.start >= draft.shift.end) errors.push('Giờ kết thúc ca phải sau giờ bắt đầu.')
  const allNumbers = [
    draft.shift.tolerance,
    draft.docWarningDays,
    ...Object.values(draft.thresholds),
    ...Object.values(draft.kpiWeights),
  ]
  if (allNumbers.some((n) => n === '' || n < 0)) errors.push('Các ô số không được để trống hoặc âm.')

  const changed = JSON.stringify(draft) !== JSON.stringify(settings)
  const canSave = changed && errors.length === 0

  return (
    <div className="flex flex-col gap-5 max-w-3xl">
      {/* ===== Ca làm việc ===== */}
      <Card title="Ca làm việc">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TimeField id="shift-start" label="Bắt đầu ca" value={draft.shift.start} onChange={(v) => update('shift', 'start', v)} />
          <TimeField id="shift-end" label="Kết thúc ca" value={draft.shift.end} onChange={(v) => update('shift', 'end', v)} />
          <NumberField id="shift-tol" label="Dung sai đúng giờ" unit="phút" value={draft.shift.tolerance} onChange={(v) => update('shift', 'tolerance', v)} />
        </div>
        <p className="mt-3 text-caption-1 text-on-surface-variant">
          Đến sớm: vào trước {draft.shift.start} − dung sai · Đi muộn: vào sau {draft.shift.start} + dung sai · Về sớm: ra trước {draft.shift.end} − dung sai.
        </p>
      </Card>

      {/* ===== Ngưỡng vận hành & chi phí ===== */}
      <Card title="Ngưỡng vận hành & chi phí">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberField id="th-loss" label="Hao hụt cho phép (nạp – xả)" unit="%" step={0.1} value={draft.thresholds.loss} onChange={(v) => update('thresholds', 'loss', v)} />
          <NumberField id="th-load" label="Lệch lượng nạp so với lệnh" unit="%" step={0.1} value={draft.thresholds.loadDeviation} onChange={(v) => update('thresholds', 'loadDeviation', v)} />
          <NumberField id="th-meal" label="Định mức ăn uống / ngày" unit="₫" step={10000} value={draft.thresholds.mealLimit} onChange={(v) => update('thresholds', 'mealLimit', v)} />
          <NumberField id="th-noinv" label="Khoản không hoá đơn tối đa" unit="₫" step={10000} value={draft.thresholds.noInvoiceLimit} onChange={(v) => update('thresholds', 'noInvoiceLimit', v)} />
          <NumberField
            id="doc-warn"
            label="Nhắc giấy tờ sắp hết hạn trước"
            unit="ngày"
            value={draft.docWarningDays}
            onChange={(v) => setDraft((d) => ({ ...d, docWarningDays: v }))}
          />
        </div>
      </Card>

      {/* ===== Trọng số KPI ===== */}
      <Card
        title="Trọng số KPI"
        action={
          // Tổng trọng số: xanh khi đúng 100, đỏ khi sai
          <span className={`text-footnote font-semibold tabular-nums ${weightSum === 100 ? 'text-secondary' : 'text-error'}`}>
            Tổng: {weightSum}%
          </span>
        }
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {KPI_CRITERIA.map((c) => (
            <NumberField
              key={c.id}
              id={`w-${c.id}`}
              label={c.name}
              unit="%"
              value={draft.kpiWeights[c.id]}
              onChange={(v) => update('kpiWeights', c.id, v)}
            />
          ))}
        </div>
      </Card>

      {/* ===== Lỗi + nút lưu ===== */}
      {errors.length > 0 && (
        <ul className="rounded-lg bg-error-container/60 text-on-error-container px-4 py-3 text-footnote list-disc list-inside">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="ghost" onClick={() => setDraft(defaults)}>
          Khôi phục mặc định
        </Button>
        <Button variant="secondary" disabled={!changed} onClick={() => setDraft(settings)}>
          Hoàn tác
        </Button>
        <Button icon="save" disabled={!canSave} onClick={() => onSave(draft)}>
          Lưu cấu hình
        </Button>
      </div>
    </div>
  )
}
