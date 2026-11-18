/* DriverOS prototype — dữ liệu mock, định dạng và quy tắc nghiệp vụ (mục 6 prompt-driveros.md).
   Không phụ thuộc UI. Gắn vào window.DOS. */
(function () {
  'use strict';

  /* ================= Định dạng ================= */
  const nf = new Intl.NumberFormat('vi-VN');
  const nf1 = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 });
  const nf2 = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 });
  const pad = (n) => String(n).padStart(2, '0');
  const fmt = {
    money: (n) => `${nf.format(Math.round(n))} ₫`,
    num: (n) => nf.format(Math.round(n)),
    num1: (n) => nf1.format(n),
    num2: (n) => nf2.format(n),
    liters: (n) => `${nf.format(Math.round(n))} L`,
    isoDate: (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    isoLocal: (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
    parseDate: (s) => {
      const [y, m, d] = s.slice(0, 10).split('-').map(Number);
      return new Date(y, m - 1, d);
    },
    dmy: (s) => {
      const [y, m, d] = s.slice(0, 10).split('-');
      return `${d}/${m}/${y}`;
    },
    dm: (s) => {
      const [, m, d] = s.slice(0, 10).split('-');
      return `${d}/${m}`;
    },
    hm: (iso) => {
      const d = new Date(iso);
      return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    },
    hmOf: (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`,
    minutesOf: (hhmm) => {
      const [h, m] = hhmm.split(':').map(Number);
      return h * 60 + m;
    },
    daysBetween: (a, b) => Math.round((fmt.parseDate(b) - fmt.parseDate(a)) / 86400000),
    weekday: (s) => ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][fmt.parseDate(s).getDay()],
    duration: (min) => {
      const m = Math.max(0, Math.round(min));
      const h = Math.floor(m / 60);
      const r = m % 60;
      if (h === 0) return `${r} phút`;
      if (r === 0) return `${h} giờ`;
      return `${h} giờ ${r} phút`;
    },
    hhmmss: (sec) => {
      const s = Math.max(0, Math.floor(sec));
      return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
    },
    mmss: (sec) => {
      const s = Math.max(0, Math.floor(sec));
      return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
    },
    uid: (p) => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
  };

  /* ================= Quy tắc nghiệp vụ ================= */
  const R = {
    SHIFT: { start: '06:00', end: '15:00', tolerance: 5 },
    LOSS_LIMIT_PCT: 0.3,
    LOAD_DEVIATION_PCT: 0.5,
    MEAL_LIMIT: 150000,
    NO_INVOICE_LIMIT: 200000,
    BASE_SALARY: 8500000,
    HAZARD: 500000,
    INSURANCE_RATE: 0.105,
    LEARNING_TARGET_MIN: 8 * 60,
    WEIGHTS: { attendance: 20, ontime: 20, loss: 20, safety: 15, fuel: 15, process: 10 },
    TIERS: [
      { min: 90, grade: 'Xuất sắc', bonus: 2000000 },
      { min: 80, grade: 'Tốt', bonus: 1200000 },
      { min: 70, grade: 'Khá', bonus: 600000 },
    ],
  };

  R.clockIn = (hhmm) => {
    const m = fmt.minutesOf(hhmm);
    const s = fmt.minutesOf(R.SHIFT.start);
    if (m < s - R.SHIFT.tolerance) return { mark: 'early', label: `Sớm ${s - m} phút` };
    if (m > s + R.SHIFT.tolerance) return { mark: 'late', label: `Muộn ${m - s} phút` };
    return { mark: 'ontime', label: 'Đúng giờ' };
  };
  R.leftEarly = (hhmm) => {
    const m = fmt.minutesOf(hhmm);
    const e = fmt.minutesOf(R.SHIFT.end);
    return { early: m < e - R.SHIFT.tolerance, minutes: e - m };
  };
  R.attendanceStats = (days, month) => {
    const d = days.filter((x) => x.date.startsWith(month) && x.in);
    let early = 0, late = 0, leftEarly = 0;
    d.forEach((x) => {
      const s = R.clockIn(x.in);
      if (s.mark === 'early') early++;
      if (s.mark === 'late') late++;
      if (x.out && R.leftEarly(x.out).early) leftEarly++;
    });
    return { workdays: d.length, early, late, leftEarly };
  };

  R.totals = (t) => {
    let ordered = 0, loaded = 0, delivered = 0, units = 0;
    t.lots.forEach((l) => {
      ordered += l.ordered * l.unitSize;
      loaded += (l.loaded || 0) * l.unitSize;
      delivered += (l.delivered || 0) * l.unitSize;
      units += l.ordered;
    });
    return { ordered, loaded, delivered, units };
  };
  R.deviationPct = (ordered, loaded) => (ordered > 0 ? (Math.abs(loaded - ordered) / ordered) * 100 : 0);
  R.loss = (loaded, delivered) => ({ liters: loaded - delivered, pct: loaded > 0 ? ((loaded - delivered) / loaded) * 100 : 0 });
  R.tripLoss = (t) => {
    const x = R.totals(t);
    return R.loss(x.loaded, x.delivered);
  };
  R.allowance = (km) => Math.round((150000 + 5000 * km) / 10000) * 10000;
  R.isLate = (t) => {
    if (!t.completedAt) return false;
    const d = new Date(t.completedAt);
    return d.getHours() * 60 + d.getMinutes() > fmt.minutesOf(t.deliverBy);
  };
  R.preOk = (t) => t.preCheck.filter((c) => c.required).every((c) => c.done);
  R.processOk = (t) => R.preOk(t) && t.depotCheck.every((c) => c.done) && t.destCheck.every((c) => c.done);
  R.cargo = (t) => {
    const x = R.totals(t);
    if (t.kind === 'drum') return `${x.units} thùng/phuy · ${nf.format(x.ordered)} L`;
    return `${nf.format(x.ordered)} L · ${t.lots.length} khoang`;
  };
  R.STATUS = {
    pending: ['Chờ nhận', 'orange'],
    accepted: ['Đã nhận', 'blue'],
    loading: ['Đang lấy hàng', 'indigo'],
    in_transit: ['Đang chạy', 'teal'],
    unloading: ['Đang xả hàng', 'purple'],
    completed: ['Hoàn tất', 'green'],
    rejected: ['Đã từ chối', 'gray'],
  };
  R.step = (s) => ({ pending: 0, rejected: 0, accepted: 1, loading: 2, in_transit: 3, unloading: 4, completed: 5 })[s];
  R.STEPS = ['Đã nhận', 'Lấy hàng', 'Đang chạy', 'Xả hàng', 'Hoàn tất'];

  const pct = (a, b) => (b === 0 ? 100 : (a / b) * 100);
  const r1 = (n) => Math.round(n * 10) / 10;
  R.doneInMonth = (data, month) => data.trips.filter((t) => t.status === 'completed' && t.date.startsWith(month));

  R.kpi = (data, month) => {
    const a = R.attendanceStats(data.attendance, month);
    const done = R.doneInMonth(data, month);
    const ontime = done.filter((t) => !R.isLate(t)).length;
    const lossOk = done.filter((t) => R.tripLoss(t).pct <= R.LOSS_LIMIT_PCT).length;
    const procOk = done.filter(R.processOk).length;
    const W = R.WEIGHTS;
    const items = [
      { key: 'attendance', name: 'Chuyên cần', icon: 'calendarCheck', color: 'blue', weight: W.attendance, score: r1(pct(a.workdays - a.late, a.workdays)), source: 'app',
        formula: '(Ngày công − Ngày đi muộn) ÷ Ngày công × 100',
        lines: [['Ngày công', a.workdays], ['Ngày đi muộn (vào sau 06:05)', a.late]] },
      { key: 'ontime', name: 'Giao đúng hẹn', icon: 'clock', color: 'teal', weight: W.ontime, score: r1(pct(ontime, done.length)), source: 'app',
        formula: 'Chuyến giao trước giờ hẹn ÷ Chuyến hoàn tất × 100',
        lines: [['Chuyến hoàn tất', done.length], ['Giao đúng hẹn', ontime], ['Giao trễ', done.length - ontime]] },
      { key: 'loss', name: 'Hao hụt', icon: 'droplet', color: 'indigo', weight: W.loss, score: r1(pct(lossOk, done.length)), source: 'app',
        formula: 'Chuyến có hao hụt ≤ 0,3% ÷ Chuyến hoàn tất × 100',
        lines: [['Chuyến hoàn tất', done.length], ['Trong ngưỡng 0,3%', lossOk], ['Vượt ngưỡng', done.length - lossOk]] },
      { key: 'safety', name: 'An toàn', icon: 'shield', color: 'green', weight: W.safety, score: 95, source: 'mock',
        formula: '100 − 5 điểm mỗi cảnh báo tốc độ − 20 điểm mỗi sự cố',
        lines: [['Sự cố', 0], ['Cảnh báo quá tốc độ (GPS)', 1]] },
      { key: 'fuel', name: 'Tiêu hao nhiên liệu', icon: 'fuel', color: 'orange', weight: W.fuel, score: 88, source: 'mock',
        formula: '100 − 3 điểm cho mỗi 1% vượt định mức',
        lines: [['Thực tế', '31,2 L/100 km'], ['Định mức', '30,0 L/100 km'], ['Vượt định mức', '4%']] },
      { key: 'process', name: 'Tuân thủ quy trình', icon: 'clipboard', color: 'purple', weight: W.process, score: r1(pct(procOk, done.length)), source: 'app',
        formula: 'Chuyến làm đủ checklist xe, tại kho và tại điểm giao ÷ Chuyến hoàn tất × 100',
        lines: [['Chuyến hoàn tất', done.length], ['Đủ checklist', procOk], ['Thiếu hạng mục', done.length - procOk]] },
    ];
    const total = r1(items.reduce((s, i) => s + (i.score * i.weight) / 100, 0));
    const tier = R.TIERS.find((t) => total >= t.min);
    const next = [...R.TIERS].reverse().find((t) => t.min > total);
    return {
      items, total,
      grade: tier ? tier.grade : 'Cần cố gắng',
      bonus: tier ? tier.bonus : 0,
      next: next ? { grade: next.grade, min: next.min, bonus: next.bonus, gap: r1(next.min - total) } : null,
    };
  };

  R.income = (data, month) => {
    const done = R.doneInMonth(data, month);
    const allowance = done.reduce((s, t) => s + R.allowance(t.km), 0);
    const k = R.kpi(data, month);
    const reimburse = data.expenses.filter((e) => e.date.startsWith(month) && e.status === 'approved').reduce((s, e) => s + e.amount, 0);
    const insurance = Math.round(R.BASE_SALARY * R.INSURANCE_RATE);
    const adv = data.advances.filter((a) => a.date.startsWith(month) && a.status === 'approved').reduce((s, a) => s + a.amount, 0);
    const income = [
      ['Lương cơ bản', R.BASE_SALARY, ''],
      ['Phụ cấp chuyến', allowance, `${done.length} chuyến hoàn tất`],
      ['Phụ cấp độc hại', R.HAZARD, ''],
      ['Thưởng KPI', k.bonus, `${k.grade} · ${nf1.format(k.total)} điểm`],
      ['Hoàn chi phí đã duyệt', reimburse, ''],
    ];
    const deductions = [
      ['Bảo hiểm (10,5%)', insurance, 'BHXH, BHYT, BHTN trên lương cơ bản'],
      ['Tạm ứng', adv, 'Trừ khi quyết toán cuối tháng'],
    ];
    const gross = income.reduce((s, i) => s + i[1], 0);
    const ded = deductions.reduce((s, i) => s + i[1], 0);
    return { income, deductions, gross, ded, net: gross - ded };
  };

  R.learnMinutes = (data, month) => {
    let m = data.offlineLearningMinutes;
    data.courses.forEach((c) => c.lessons.forEach((l) => { if (l.doneAt && l.doneAt.startsWith(month)) m += l.minutes; }));
    return m;
  };
  R.courseProgress = (c) => {
    const done = c.lessons.filter((l) => l.doneAt).length;
    return { done, total: c.lessons.length, pct: done / c.lessons.length };
  };
  R.tone = (days) => (days <= 30 ? 'red' : days <= 60 ? 'orange' : 'green');

  R.EXPENSE_CATS = {
    fuel: ['Nhiên liệu', 'fuel', 'orange'],
    meal: ['Ăn uống', 'utensils', 'green'],
    toll: ['Cầu đường', 'ticket', 'blue'],
    parking: ['Bến bãi', 'parking', 'indigo'],
    repair: ['Sửa chữa', 'wrench', 'gray'],
    other: ['Khác', 'more', 'purple'],
  };

  /* ================= Dữ liệu mock ================= */
  const TODAY = '2026-11-12';
  const MONTH = '2026-11';
  const SIM_START = new Date(2026, 10, 12, 9, 12, 0).getTime();

  const NHA_BE = { name: 'Kho xăng dầu Nhà Bè', address: 'Kho xăng dầu Nhà Bè, Huỳnh Tấn Phát, Nhà Bè, TP.HCM' };
  const HIEP_PHUOC = { name: 'Kho Hiệp Phước', address: 'KCN Hiệp Phước, Nhà Bè, TP.HCM' };
  const place = (name, address) => ({ name, address });

  const PRE = [
    ['tyre', 'Lốp xe, áp suất lốp', false],
    ['brake', 'Phanh và hệ thống đèn', true],
    ['leak', 'Không rò rỉ dưới gầm, bồn', true],
    ['valve', 'Van đáy và nắp khoang đóng kín', true],
    ['ground', 'Dây tiếp địa', true],
    ['fire', 'Bình chữa cháy còn hạn, đủ áp', true],
    ['sign', 'Biển báo hàng nguy hiểm', true],
    ['ppe', 'Bảo hộ lao động', false],
    ['health', 'Sức khỏe tốt, không dùng rượu bia', true],
  ];
  const DEPOT = [['d1', 'Tắt máy, kéo phanh tay tại bệ xuất'], ['d2', 'Nối dây tiếp địa trước khi nạp'], ['d3', 'Đối chiếu lệnh xuất với hàng từng khoang'], ['d4', 'Đóng van, kẹp chì niêm phong các khoang']];
  const DEST = [['x1', 'Kiểm tra số chì trước khi xả'], ['x2', 'Nối dây tiếp địa, đặt biển cảnh báo'], ['x3', 'Xác nhận bể chứa đủ dung tích'], ['x4', 'Đóng van, thu dây sau khi xả']];
  const preCheck = (done) => PRE.map(([id, label, required]) => ({ id, label, required, done }));
  const depotCheck = (done) => DEPOT.map(([id, label]) => ({ id, label, required: true, done }));
  const destCheck = (done, skip) => DEST.map(([id, label]) => ({ id, label, required: true, done: done && id !== skip }));

  const COMP = [4000, 4000, 4000, 3000, 3000];
  const tank = (spec) => spec.map(([no, product, ordered]) => ({ no, product, unit: 'L', unitSize: 1, capacity: COMP[no - 1], ordered }));
  function fill(lots, delta, lossPct) {
    const w = lots.map((l, i) => ({ ...l, loaded: l.ordered + (delta[i] || 0) }));
    const tot = w.reduce((s, l) => s + l.loaded, 0);
    const lossTotal = Math.round((tot * lossPct) / 100);
    let left = lossTotal;
    return w.map((l, i) => {
      const share = i === w.length - 1 ? left : Math.floor((l.loaded / tot) * lossTotal);
      left -= share;
      return { ...l, delivered: l.loaded - share };
    });
  }
  const iso = (date, hhmm) => `${date}T${hhmm}:00`;

  const RON95 = 'Xăng RON95-III', E5 = 'Xăng E5 RON92-II', DO = 'Dầu DO 0,05S-II';
  const HIST = [
    [1, '2026-11-02', NHA_BE, place('CHXD số 8 – Phạm Thế Hiển', 'Phạm Thế Hiển, Quận 8, TP.HCM'), [[1, RON95, 4000], [2, RON95, 4000], [3, RON95, 4000]], 14, '06:30', '09:00', '07:12', '08:32', 0.12, null, null, ['Trần Văn Lộc', '0903 112 233']],
    [1, '2026-11-03', HIEP_PHUOC, place('CHXD Nhơn Trạch', 'QL51, Nhơn Trạch, Đồng Nai'), [[1, DO, 4000], [2, DO, 4000], [3, DO, 4000], [4, DO, 3000], [5, DO, 3000]], 35, '06:40', '10:00', '07:30', '09:41', 0.15, null, null, ['Lê Thị Mai', '0918 223 344']],
    [1, '2026-11-04', NHA_BE, place('CHXD Biên Hòa – Phạm Văn Thuận', 'Phạm Văn Thuận, Biên Hòa, Đồng Nai'), [[1, E5, 4000], [2, E5, 4000], [4, E5, 3000]], 42, '06:50', '11:00', '08:05', '11:26', 0.2, null, null, ['Phạm Quốc Huy', '0909 334 455']],
    [1, '2026-11-05', NHA_BE, place('CHXD Bến Lức', 'QL1A, Bến Lức, Long An'), [[1, DO, 4000], [2, DO, 4000], [4, DO, 3000], [5, DO, 3000]], 38, '06:30', '10:30', '07:20', '09:58', 0.18, null, null, ['Võ Thanh Tâm', '0937 445 566']],
    [1, '2026-11-06', HIEP_PHUOC, place('CHXD KCN Long Thành', 'KCN Long Thành, Đồng Nai'), [[1, RON95, 4000], [2, RON95, 4000], [4, DO, 3000], [5, DO, 3000]], 56, '06:20', '10:30', '07:10', '10:05', 0.42, 'Đồng hồ lưu lượng tại cửa hàng sai số, đã lập biên bản với cửa hàng trưởng.', null, ['Nguyễn Hữu Phước', '0976 556 677']],
    [1, '2026-11-07', NHA_BE, place('CHXD Quận 7 – Nguyễn Văn Linh', 'Nguyễn Văn Linh, Quận 7, TP.HCM'), [[1, RON95, 4000], [2, RON95, 4000], [5, RON95, 2000]], 18, '06:15', '08:30', '06:55', '07:58', 0.1, null, null, ['Đặng Minh Khoa', '0912 667 788']],
    [1, '2026-11-09', NHA_BE, place('CHXD Thủ Đức – Võ Văn Ngân', 'Võ Văn Ngân, TP. Thủ Đức, TP.HCM'), [[1, DO, 4000], [2, DO, 4000], [3, DO, 4000], [4, DO, 3000], [5, DO, 3000]], 27, '06:40', '09:30', '07:25', '09:02', 0.14, null, 'x3', ['Bùi Thị Hạnh', '0908 778 899']],
    [2, '2026-11-09', HIEP_PHUOC, place('CHXD Cần Giuộc', 'QL50, Cần Giuộc, Long An'), [[1, E5, 4000], [4, E5, 3000]], 22, '10:30', '13:00', '11:10', '12:21', 0.2, null, null, ['Huỳnh Văn Sang', '0938 889 900']],
    [1, '2026-11-10', NHA_BE, place('CHXD Biên Hòa – Phạm Văn Thuận', 'Phạm Văn Thuận, Biên Hòa, Đồng Nai'), [[1, RON95, 4000], [2, RON95, 4000], [3, RON95, 4000], [4, RON95, 3000], [5, RON95, 3000]], 42, '06:30', '10:30', '07:18', '09:47', 0.16, null, null, ['Phạm Quốc Huy', '0909 334 455']],
    [1, '2026-11-11', HIEP_PHUOC, place('CHXD Quận 2 – Mai Chí Thọ', 'Mai Chí Thọ, TP. Thủ Đức, TP.HCM'), [[1, DO, 4000], [2, DO, 4000], [3, DO, 4000]], 24, '06:20', '09:00', '07:00', '08:24', 0.11, null, null, ['Lý Thanh Bình', '0906 990 011']],
    [2, '2026-11-11', NHA_BE, place('CHXD Tân An', 'QL1A, TP. Tân An, Long An'), [[1, RON95, 4000], [2, RON95, 4000], [4, RON95, 3000]], 52, '10:00', '13:30', '10:45', '12:55', 0.19, null, null, ['Trương Văn Đức', '0917 001 122']],
  ];

  function histTrip(h) {
    const [n, date, depot, dest, spec, km, pickup, by, departed, done, lossPct, lossNote, skip, rc] = h;
    const lots = fill(tank(spec), [2, -1, 3, 0, -2], lossPct);
    return {
      id: `h-${date}-${n}`, code: `DH-${date.slice(2, 4)}${date.slice(5, 7)}${date.slice(8, 10)}-0${n}`, date, kind: 'tanker', status: 'completed',
      vehiclePlate: '51D-345.67', depot, dest, receiver: { name: rc[0], phone: rc[1] }, pickupTime: pickup, deliverBy: by, km, lots,
      preCheck: preCheck(true), depotCheck: depotCheck(true), destCheck: destCheck(true, skip),
      seal: `NB-77${date.slice(8, 10)}${n}1 → 77${date.slice(8, 10)}${n}${spec.length}`, temperature: 30.5, loadPhoto: true,
      lossExplanation: lossNote || undefined, confirm: { method: 'signature', at: iso(date, done) },
      departedAt: iso(date, departed), completedAt: iso(date, done),
      events: [{ status: 'accepted', at: iso(date, '05:58') }, { status: 'loading', at: iso(date, pickup) }, { status: 'in_transit', at: iso(date, departed) }, { status: 'completed', at: iso(date, done) }],
    };
  }

  function todayTrips() {
    const t2 = tank([[1, DO, 4000], [2, DO, 4000], [3, DO, 4000], [4, DO, 3000], [5, DO, 3000]]).map((l, i) => ({ ...l, loaded: l.ordered + [3, -2, 1, 2, -1][i] }));
    return [
      {
        id: 't-today-1', code: 'DH-261112-01', date: TODAY, kind: 'tanker', status: 'completed', vehiclePlate: '51D-345.67',
        depot: NHA_BE, dest: place('CHXD Quận 7 – Nguyễn Văn Linh', 'Nguyễn Văn Linh, Quận 7, TP.HCM'), receiver: { name: 'Đặng Minh Khoa', phone: '0912 667 788' },
        pickupTime: '06:20', deliverBy: '08:00', km: 18, lots: fill(tank([[1, RON95, 4000], [2, RON95, 4000], [4, E5, 3000]]), [-2, 1, -1], 0.19),
        preCheck: preCheck(true), depotCheck: depotCheck(true), destCheck: destCheck(true), seal: 'NB-778101 → 778103', temperature: 29.8, loadPhoto: true,
        confirm: { method: 'otp', at: iso(TODAY, '07:41') }, departedAt: iso(TODAY, '06:58'), completedAt: iso(TODAY, '07:41'),
        events: [{ status: 'accepted', at: iso(TODAY, '05:56') }, { status: 'loading', at: iso(TODAY, '06:20') }, { status: 'in_transit', at: iso(TODAY, '06:58') }, { status: 'unloading', at: iso(TODAY, '07:24') }, { status: 'completed', at: iso(TODAY, '07:41') }],
      },
      {
        id: 't-today-2', code: 'DH-261112-02', date: TODAY, kind: 'tanker', status: 'in_transit', vehiclePlate: '51D-345.67',
        depot: NHA_BE, dest: place('CHXD Biên Hòa – Phạm Văn Thuận', 'Phạm Văn Thuận, Biên Hòa, Đồng Nai'), receiver: { name: 'Phạm Quốc Huy', phone: '0909 334 455' },
        pickupTime: '08:00', deliverBy: '10:30', km: 42, lots: t2,
        preCheck: preCheck(true), depotCheck: depotCheck(true), destCheck: destCheck(false), seal: 'NB-778201 → 778205', temperature: 30.2, loadPhoto: true,
        departedAt: iso(TODAY, '08:35'),
        events: [{ status: 'accepted', at: iso(TODAY, '07:50') }, { status: 'loading', at: iso(TODAY, '08:02') }, { status: 'in_transit', at: iso(TODAY, '08:35') }],
        note: 'Cửa hàng nhận hàng từ 09:30. Vào cổng sau, đường Phạm Văn Thuận.',
      },
      {
        id: 't-today-3', code: 'DH-261112-03', date: TODAY, kind: 'tanker', status: 'pending', vehiclePlate: '51D-345.67',
        depot: HIEP_PHUOC, dest: place('CHXD KCN Long Thành', 'KCN Long Thành, Đồng Nai'), receiver: { name: 'Nguyễn Hữu Phước', phone: '0976 556 677' },
        pickupTime: '12:00', deliverBy: '14:30', km: 56, lots: tank([[1, RON95, 4000], [2, RON95, 4000], [4, DO, 3000], [5, DO, 3000]]),
        preCheck: preCheck(false), depotCheck: depotCheck(false), destCheck: destCheck(false), events: [],
        note: 'Hai loại hàng: khoang 1–2 xăng, khoang 4–5 dầu DO. Kiểm tra kỹ van trước khi xả.',
      },
      {
        id: 't-up-1', code: 'DH-261113-01', date: '2026-11-13', kind: 'tanker', status: 'accepted', vehiclePlate: '51D-345.67',
        depot: NHA_BE, dest: place('CHXD Bến Lức', 'QL1A, Bến Lức, Long An'), receiver: { name: 'Võ Thanh Tâm', phone: '0937 445 566' },
        pickupTime: '06:30', deliverBy: '10:00', km: 38, lots: tank([[1, E5, 4000], [2, E5, 4000], [3, E5, 4000], [4, E5, 3000]]),
        preCheck: preCheck(false), depotCheck: depotCheck(false), destCheck: destCheck(false), events: [{ status: 'accepted', at: iso('2026-11-11', '16:20') }],
      },
      {
        id: 't-up-2', code: 'DH-261114-01', date: '2026-11-14', kind: 'drum', status: 'pending', vehiclePlate: '51C-678.90',
        depot: HIEP_PHUOC, dest: place('Đại lý dầu nhớt Minh Phát', 'Xa lộ Hà Nội, TP. Thủ Đức, TP.HCM'), receiver: { name: 'Châu Minh Phát', phone: '0985 123 987' },
        pickupTime: '07:00', deliverBy: '10:00', km: 31,
        lots: [
          { no: 1, product: 'Dầu nhớt động cơ 15W-40', unit: 'phuy', unitSize: 209, ordered: 120 },
          { no: 2, product: 'Dầu thủy lực AW68', unit: 'thùng', unitSize: 18, ordered: 60 },
        ],
        preCheck: preCheck(false), depotCheck: depotCheck(false), destCheck: destCheck(false), events: [],
        note: 'Hàng đóng phuy/thùng, dùng xe tải thùng 51C-678.90. Chằng buộc kỹ, kê chèn phuy.',
      },
    ];
  }

  const quiz = (q, options, answer) => ({ q, options, answer });
  const COURSES = [
    { id: 'c-adr', title: 'Vận chuyển hàng nguy hiểm (ADR)', required: true, deadline: '2026-11-30', color: 'red', icon: 'flame',
      description: 'Bắt buộc với lái xe bồn. Hoàn thành trước khi gia hạn chứng chỉ hàng nguy hiểm.',
      lessons: [
        { id: 'adr-1', title: 'Phân loại hàng nguy hiểm loại 3', kind: 'video', minutes: 12, doneAt: '2026-11-04' },
        { id: 'adr-2', title: 'Biển báo, nhãn và giấy tờ đi kèm', kind: 'reading', minutes: 8, doneAt: '2026-11-06' },
        { id: 'adr-3', title: 'Ứng phó sự cố rò rỉ trên đường', kind: 'video', minutes: 15 },
        { id: 'adr-4', title: 'Bài kiểm tra cuối khóa', kind: 'quiz', minutes: 5, quiz: [
          quiz('Xăng và dầu DO thuộc loại hàng nguy hiểm nào theo phân loại của Liên Hợp Quốc?', ['Loại 2 – Khí', 'Loại 3 – Chất lỏng dễ cháy', 'Loại 8 – Chất ăn mòn', 'Loại 9 – Chất nguy hiểm khác'], 1),
          quiz('Số UN của xăng (gasoline) là bao nhiêu?', ['UN 1202', 'UN 1203', 'UN 1863', 'UN 1993'], 1),
          quiz('Phát hiện rò rỉ trên đường, việc đầu tiên lái xe cần làm là gì?', ['Chạy nhanh về kho gần nhất', 'Mở nắp khoang cho hơi thoát ra', 'Dừng xe nơi an toàn, tắt máy, cách ly nguồn lửa', 'Dùng nước xịt rửa chỗ rò rỉ'], 2),
        ] },
      ] },
    { id: 'c-fire', title: 'PCCC và xử lý tràn dầu', required: true, deadline: '2026-12-15', color: 'orange', icon: 'flame',
      description: 'Phòng cháy chữa cháy tại bệ nạp/xả và xử lý sự cố tràn dầu.',
      lessons: [
        { id: 'fire-1', title: 'Tam giác cháy và chất chữa cháy', kind: 'video', minutes: 10 },
        { id: 'fire-2', title: 'Sử dụng bình bột và bình bọt', kind: 'reading', minutes: 8 },
        { id: 'fire-3', title: 'Quây chặn và thu gom dầu tràn', kind: 'video', minutes: 14 },
        { id: 'fire-4', title: 'Bài kiểm tra', kind: 'quiz', minutes: 5, quiz: [
          quiz('Loại chất chữa cháy phù hợp với đám cháy xăng dầu?', ['Nước phun thẳng', 'Bột khô hoặc bọt (foam)', 'Cát ướt trộn nước', 'Không có loại nào'], 1),
          quiz('Mục đích của việc nối dây tiếp địa khi nạp/xả là gì?', ['Giữ xe đứng yên', 'Đo lượng dầu trong khoang', 'Triệt tiêu tĩnh điện, tránh phát tia lửa', 'Chống sét khi trời mưa'], 2),
          quiz('Dầu tràn ra mặt đất, cần làm gì để ngăn lan rộng?', ['Xịt nước cho loãng', 'Dùng cát hoặc vật liệu thấm hút, đắp bờ ngăn', 'Đốt bỏ lượng dầu tràn', 'Để tự bay hơi'], 1),
        ] },
      ] },
    { id: 'c-eco', title: 'Lái xe tiết kiệm nhiên liệu', required: false, color: 'green', icon: 'fuel',
      description: 'Giữ vòng tua kinh tế, giảm tiêu hao và mài mòn.',
      lessons: [
        { id: 'eco-1', title: 'Vòng tua kinh tế của động cơ diesel', kind: 'video', minutes: 10, doneAt: '2026-11-03' },
        { id: 'eco-2', title: 'Áp suất lốp và tải trọng', kind: 'reading', minutes: 12, doneAt: '2026-11-03' },
        { id: 'eco-3', title: 'Bài kiểm tra', kind: 'quiz', minutes: 5, doneAt: '2026-11-03', bestScore: 3, quiz: [
          quiz('Xe tải diesel chạy tiết kiệm nhất ở vùng vòng tua nào?', ['Sát vạch đỏ', 'Vùng mô-men xoắn cực đại (vạch xanh)', 'Vòng tua thấp nhất có thể', 'Vòng tua không ảnh hưởng'], 1),
          quiz('Lốp non hơi so với tiêu chuẩn sẽ gây ra điều gì?', ['Tăng tiêu hao nhiên liệu và mòn lốp nhanh', 'Xe êm hơn, tiết kiệm hơn', 'Không ảnh hưởng', 'Phanh ăn hơn'], 0),
          quiz('Khi phải chờ nhận hàng lâu, nên làm gì với động cơ?', ['Để nổ máy cho mát cabin', 'Tắt máy nếu chờ lâu', 'Rồ ga định kỳ', 'Không quan trọng'], 1),
        ] },
      ] },
    { id: 'c-load', title: 'Quy trình nạp và xả hàng tại kho', required: false, color: 'blue', icon: 'truck',
      description: 'Các bước an toàn tại bệ xuất và tại cửa hàng xăng dầu.',
      lessons: [
        { id: 'load-1', title: 'Trình tự tại bệ xuất', kind: 'video', minutes: 15, doneAt: '2026-11-09' },
        { id: 'load-2', title: 'Niêm phong chì và đối chiếu chứng từ', kind: 'reading', minutes: 10, doneAt: '2026-11-10' },
        { id: 'load-3', title: 'Bài kiểm tra', kind: 'quiz', minutes: 5, quiz: [
          quiz('Trước khi nạp hàng tại bệ xuất, lái xe phải làm gì?', ['Để máy nổ cho nhanh', 'Tắt máy, kéo phanh tay, nối tiếp địa', 'Mở hết nắp khoang', 'Gọi điện cho điều độ'], 1),
          quiz('Kiểm tra số chì niêm phong trước khi xả nhằm mục đích gì?', ['Xác nhận hàng không bị can thiệp trên đường', 'Để tính phụ cấp chuyến', 'Để đo nhiệt độ', 'Không cần thiết'], 0),
          quiz('Hao hụt vượt mức cho phép thì xử lý thế nào?', ['Bỏ qua', 'Tự bù tiền cho cửa hàng', 'Ghi nhận, lập biên bản, giải trình và báo điều độ', 'Sửa số liệu cho khớp'], 2),
        ] },
      ] },
    { id: 'c-aid', title: 'Sơ cấp cứu cơ bản', required: false, color: 'pink', icon: 'heart',
      description: 'Xử lý ban đầu khi bị bỏng, hóa chất bắn vào mắt, tai nạn giao thông.',
      lessons: [
        { id: 'aid-1', title: 'Đánh giá hiện trường và gọi cấp cứu', kind: 'video', minutes: 12, doneAt: '2026-11-11' },
        { id: 'aid-2', title: 'Xử lý bỏng và hóa chất bắn vào mắt', kind: 'reading', minutes: 9 },
        { id: 'aid-3', title: 'Bài kiểm tra', kind: 'quiz', minutes: 5, quiz: [
          quiz('Xăng dầu bắn vào mắt, cần xử lý thế nào?', ['Dụi mắt cho sạch', 'Rửa bằng nước sạch liên tục ít nhất 15 phút', 'Nhỏ thuốc nhỏ mắt rồi chạy tiếp', 'Băng kín mắt lại'], 1),
          quiz('Xử lý ban đầu với vết bỏng do cháy?', ['Bôi kem đánh răng', 'Làm mát vùng bỏng bằng nước sạch, mát', 'Chọc vỡ bọng nước', 'Đắp đá lạnh trực tiếp'], 1),
          quiz('Số điện thoại cấp cứu y tế tại Việt Nam là?', ['113', '114', '115', '112'], 2),
        ] },
      ] },
  ];

  function initialData() {
    return {
      version: 4,
      clockBase: Date.now(),
      driver: {
        name: 'Nguyễn Văn Hùng', code: 'TX-0127', team: 'Đội 3 – Kho Nhà Bè', license: 'FC', joined: '03/2019', rating: 4.8,
        phone: '0908 127 127', idNumber: '079 086 ••• 412', birthday: '14/07/1986', address: 'Phường Phú Thuận, Quận 7, TP.HCM',
        emergency: 'Nguyễn Thị Lan (vợ) · 0909 586 586', dispatcher: { name: 'Lê Thu Hà', phone: '0903 456 789' },
        tripsThisYear: 412, safeKm: 48230, incidents: 0, leaveDays: 9,
      },
      vehicles: [
        { plate: '51D-345.67', model: 'Hino 500 – xe bồn xăng dầu', kind: 'tanker', capacity: 18000, compartments: COMP, inspectionExp: '2027-05-20', tankCertExp: '2027-02-15', kmToService: 1250 },
        { plate: '51C-678.90', model: 'Isuzu FVR – xe tải thùng 8 tấn', kind: 'drum', capacity: 8000, compartments: [], inspectionExp: '2027-08-10', kmToService: 6400 },
      ],
      trips: [...todayTrips(), ...HIST.map(histTrip)],
      attendance: [
        { date: '2026-11-02', in: '05:58', out: '15:04' },
        { date: '2026-11-03', in: '05:50', out: '15:10' },
        { date: '2026-11-04', in: '06:12', out: '15:05', explanation: 'Tai nạn trên cầu Phú Mỹ, kẹt xe 25 phút. Đã báo điều độ lúc 05:40.' },
        { date: '2026-11-05', in: '05:52', out: '15:02' },
        { date: '2026-11-06', in: '05:57', out: '14:40' },
        { date: '2026-11-07', in: '05:49', out: '15:00' },
        { date: '2026-11-09', in: '06:18', out: '15:20' },
        { date: '2026-11-10', in: '05:56', out: '15:03' },
        { date: '2026-11-11', in: '05:53', out: '15:08' },
        { date: TODAY, in: '05:54' },
      ],
      expenses: [
        { id: 'e1', date: '2026-11-02', time: '12:10', category: 'fuel', title: 'Đổ dầu DO', place: 'Petrolimex – CHXD số 15', amount: 2502000, liters: 120, unitPrice: 20850, odometer: 184220, status: 'approved', hasInvoice: true, vat: true, tripId: 'h-2026-11-02-1' },
        { id: 'e2', date: '2026-11-02', time: '11:45', category: 'meal', title: 'Cơm trưa', place: 'Quán cơm Bà Ba, Quận 8', amount: 65000, status: 'approved', hasInvoice: true, vat: false },
        { id: 'e3', date: '2026-11-03', time: '08:20', category: 'toll', title: 'Phí BOT', place: 'Trạm BOT QL51', amount: 52000, status: 'approved', hasInvoice: true, vat: true, tripId: 'h-2026-11-03-1' },
        { id: 'e4', date: '2026-11-04', time: '12:30', category: 'meal', title: 'Cơm trưa', place: 'Quán ăn Phương Nam, Biên Hòa', amount: 70000, status: 'approved', hasInvoice: true, vat: false },
        { id: 'e5', date: '2026-11-05', time: '10:15', category: 'parking', title: 'Phí đỗ xe chờ xả', place: 'Bãi xe Bến Lức', amount: 50000, status: 'approved', hasInvoice: true, vat: false, tripId: 'h-2026-11-05-1' },
        { id: 'e6', date: '2026-11-06', time: '13:05', category: 'fuel', title: 'Đổ dầu DO', place: 'Petrolimex – CHXD Long Thành', amount: 3127500, liters: 150, unitPrice: 20850, odometer: 184610, status: 'approved', hasInvoice: true, vat: true, tripId: 'h-2026-11-06-1' },
        { id: 'e7', date: '2026-11-07', time: '14:20', category: 'repair', title: 'Thay bóng đèn xi nhan', place: 'Gara Tấn Phát, Nhà Bè', amount: 350000, status: 'approved', hasInvoice: true, vat: true },
        { id: 'e8', date: '2026-11-09', time: '19:10', category: 'meal', title: 'Ăn trưa và tối', place: 'Quán ăn Cần Giuộc', amount: 180000, status: 'rejected', rejectReason: 'Vượt định mức 150.000 ₫/ngày, chưa có hóa đơn bữa tối.', hasInvoice: false, vat: false, explanation: 'Chạy 2 chuyến, ăn 2 bữa.' },
        { id: 'e9', date: '2026-11-10', time: '08:05', category: 'toll', title: 'Phí BOT', place: 'BOT Xa lộ Hà Nội', amount: 40000, status: 'pending', hasInvoice: true, vat: true, tripId: 'h-2026-11-10-1' },
        { id: 'e10', date: '2026-11-11', time: '15:30', category: 'other', title: 'Rửa xe', place: 'Trạm rửa xe Nhà Bè', amount: 30000, status: 'pending', hasInvoice: false, vat: false },
        { id: 'e11', date: TODAY, time: '05:35', category: 'meal', title: 'Ăn sáng', place: 'Quán hủ tiếu cổng kho Nhà Bè', amount: 45000, status: 'pending', hasInvoice: false, vat: false },
      ],
      advances: [{ id: 'a1', date: '2026-11-01', amount: 2000000, reason: 'Tạm ứng chi phí chuyến tháng 11', status: 'approved' }],
      courses: COURSES,
      certificates: [
        { id: 'cert-1', name: 'Giấy phép lái xe hạng FC', number: '790123456789', issuer: 'Sở GTVT TP.HCM', expires: '2029-03-15' },
        { id: 'cert-2', name: 'Chứng chỉ vận chuyển hàng nguy hiểm', number: 'HH-2023-0417', issuer: 'Trung tâm huấn luyện an toàn', expires: '2026-11-30' },
        { id: 'cert-3', name: 'Chứng nhận huấn luyện PCCC', number: 'PC-2025-1182', issuer: 'Phòng Cảnh sát PCCC', expires: '2027-01-05' },
        { id: 'cert-4', name: 'Giấy khám sức khỏe lái xe', number: 'SK-26-03318', issuer: 'BV Giao thông vận tải', expires: '2027-06-10' },
        { id: 'cert-5', name: 'Thẻ an toàn ra vào kho', number: 'KNB-0127', issuer: 'Kho xăng dầu Nhà Bè', expires: '2027-12-31' },
      ],
      tasks: [
        { id: 'k1', title: 'Nộp bản gốc giấy khám sức khỏe cho phòng HCNS', due: '2026-11-13', done: false },
        { id: 'k2', title: 'Đưa xe 51D-345.67 đi súc rửa bồn', due: '2026-11-14', done: false },
        { id: 'k3', title: 'Ký biên bản nhận xe tải thùng 51C-678.90', due: '2026-11-13', done: false },
        { id: 'k4', title: 'Đưa xe đi đăng kiểm định kỳ (đã đặt lịch)', due: '2026-11-20', done: false },
      ],
      requests: [
        { id: 'r1', kind: 'attendance', title: 'Giải trình đi muộn 04/11', detail: 'Tai nạn trên cầu Phú Mỹ, kẹt xe 25 phút.', createdAt: '2026-11-04T09:30:00', status: 'approved' },
        { id: 'r2', kind: 'leave', title: 'Nghỉ phép năm 24/10 – 25/10', detail: '2 ngày · Việc gia đình', createdAt: '2026-10-18T20:15:00', status: 'approved' },
      ],
      kpiHistory: [{ month: '2026-08', score: 86 }, { month: '2026-09', score: 91 }, { month: '2026-10', score: 84 }],
      offlineLearningMinutes: 180,
      settings: { appearance: 'auto', push: true, driving: false },
      flags: {},
    };
  }

  window.DOS = { fmt, R, TODAY, MONTH, SIM_START, initialData, preCheck };
})();
