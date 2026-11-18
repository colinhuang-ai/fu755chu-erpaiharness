/* DriverOS prototype — giao diện (Preact + htm, không cần build). */
(function () {
  'use strict';
  const { html, render, useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } = window.htmPreact;
  const { fmt, R, TODAY, MONTH, SIM_START, initialData } = window.DOS;

  /* ================= Icon (nét kiểu SF Symbols / Lucide) ================= */
  const I = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
    calendarCheck: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="m9 16 2 2 4-4"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>',
    wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    grad: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    chevronLeft: '<path d="m15 18-6-6 6-6"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    mapPin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    nav: '<polygon points="3 11 22 2 13 21 11 13 3 11"/>',
    droplet: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
    fuel: '<path d="M3 22h12M4 9h10"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0V9.83a2 2 0 0 0-.59-1.42L18 5"/>',
    utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
    ticket: '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2M13 17v2M13 11v2"/>',
    parking: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>',
    wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    more: '<circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/><circle cx="5" cy="12" r="1.2"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4M12 17h.01"/>',
    clipboard: '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
    plus: '<path d="M5 12h14M12 5v14"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/>',
    book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
    help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    user: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M16 13H8M16 17H8M10 9H8"/>',
    headset: '<path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/><path d="M21 16v2a4 4 0 0 1-4 4h-5"/>',
    trending: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
    camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    siren: '<path d="M7 18v-6a5 5 0 1 1 10 0v6"/><path d="M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z"/><path d="M21 12h1M18.5 4.5 18 5M2 12h1M12 2v1M4.93 4.93l.71.71"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    gauge: '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
    package: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12M3.3 7l8.7 5 8.7-5"/>',
    logIn: '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/>',
    logOut: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
    list: '<rect x="3" y="5" width="6" height="6" rx="1"/><path d="m3 17 2 2 4-4M13 6h8M13 12h8M13 18h8"/>',
    refresh: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    banknote: '<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    thermo: '<path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>',
    pen: '<path d="M12 20h9"/><path d="M16.38 3.62a1 1 0 0 1 3 3L7.37 18.64a2 2 0 0 1-.86.5l-2.87.84a.5.5 0 0 1-.62-.62l.84-2.87a2 2 0 0 1 .5-.86z"/>',
    phoneDev: '<rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    inbox: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    idcard: '<rect width="20" height="16" x="2" y="4" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M5 16a3 3 0 0 1 6 0M14 9h4M14 13h4"/>',
    wheel: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/><path d="M12 14v8M14 12h7.9M10 12H2.1"/>',
    flask: '<path d="M10 2v7.31M14 9.3V2M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0"/>',
    timer: '<path d="M10 2h4M12 14l3-3"/><circle cx="12" cy="14" r="8"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    seal: '<circle cx="12" cy="12" r="3"/><path d="M12 2v7M12 15v7"/>',
    tank: '<rect x="2" y="7" width="20" height="10" rx="5"/><path d="M8 7v10M12 7v10M16 7v10"/>',
    user2: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  };

  function Icon({ n, size = 20, sw = 2, color, style }) {
    return html`<svg class="ic" width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke=${color || 'currentColor'} stroke-width=${sw} stroke-linecap="round" stroke-linejoin="round" style=${style} aria-hidden="true" dangerouslySetInnerHTML=${{ __html: I[n] || '' }}></svg>`;
  }
  const cv = (c) => `var(--${c})`;

  /* ================= Store ================= */
  const KEY = 'driveros.proto.v4';
  const LAB_KEY = 'driveros.lab.v1';
  function loadData() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d && d.version === 4) {
          if (Date.now() - d.clockBase > 10 * 3600000 || Date.now() < d.clockBase) d.clockBase = Date.now();
          return d;
        }
      }
    } catch (e) { /* bị chặn */ }
    return initialData();
  }
  function persist(key, v) {
    try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* bỏ qua */ }
  }
  function loadLab() {
    try {
      const raw = localStorage.getItem(LAB_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* bỏ qua */ }
    return { participant: '', active: null, results: {} };
  }
  const simNow = (base) => new Date(SIM_START + (Date.now() - base));

  const Ctx = createContext(null);
  const useApp = () => useContext(Ctx);

  function useTick(ms) {
    const [, set] = useState(0);
    useEffect(() => {
      const id = setInterval(() => set((x) => x + 1), ms || 1000);
      return () => clearInterval(id);
    }, [ms]);
  }

  const STICKY = {};
  function useSticky(key, init) {
    const [v, setV] = useState(() => (key in STICKY ? STICKY[key] : init));
    const set = useCallback((x) => { STICKY[key] = x; setV(x); }, [key]);
    return [v, set];
  }

  const parseInt0 = (s) => {
    const d = String(s == null ? '' : s).replace(/\D/g, '');
    return d === '' ? NaN : Number(d);
  };
  const parseDec = (s) => {
    const t = String(s == null ? '' : s).trim().replace(',', '.');
    return t === '' ? NaN : Number(t);
  };

  /* ================= Component cơ bản (iOS UI Kit) ================= */
  function Section({ header, footer, plain, children, action }) {
    return html`<section class="section">
      ${header && html`<div class=${'section-header' + (plain ? ' plain' : '')}><span>${header}</span>${action}</div>`}
      <div class="group">${children}</div>
      ${footer && html`<div class="section-footer">${footer}</div>`}
    </section>`;
  }
  function IconTile({ n, c, size }) {
    const s = size || 29;
    return html`<span class="icon-tile" style=${{ background: cv(c || 'blue'), width: s + 'px', height: s + 'px' }}><${Icon} n=${n} size=${Math.round(s * 0.62)} sw=${2.2} color="#fff" /></span>`;
  }
  function Row({ icon, c, title, subtitle, value, chevron, onClick, destructive, accent, right, left, multiline }) {
    const cls = 'row' + (onClick ? ' tappable' : '') + (icon ? ' has-icon' : '') + (multiline ? ' multiline' : '');
    const inner = html`${left}${icon && html`<${IconTile} n=${icon} c=${c} />`}
      <div class="row-main">
        <div class=${'row-title' + (destructive ? ' destructive' : '') + (accent ? ' accent' : '')}>${title}</div>
        ${subtitle && html`<div class="row-subtitle">${subtitle}</div>`}
      </div>
      ${value !== undefined && value !== null && html`<div class="row-value">${value}</div>`}
      ${right}
      ${chevron && html`<span class="chevron"><${Icon} n="chevronRight" size=${17} sw=${2.6} /></span>`}`;
    return onClick ? html`<button class=${cls} onClick=${onClick}>${inner}</button>` : html`<div class=${cls}>${inner}</div>`;
  }
  function Seg({ options, value, onChange }) {
    const idx = Math.max(0, options.findIndex((o) => o[0] === value));
    return html`<div class="segmented" role="tablist" style=${{ '--n': options.length, '--i': idx }}>
      <span class="segmented-thumb"></span>
      ${options.map((o) => html`<button key=${o[0]} role="tab" aria-selected=${o[0] === value} class=${o[0] === value ? 'on' : ''} onClick=${() => onChange(o[0])}>${o[1]}</button>`)}
    </div>`;
  }
  function Switch({ on, onChange, label }) {
    return html`<button role="switch" aria-checked=${on} aria-label=${label} class=${'switch' + (on ? ' on' : '')} onClick=${() => onChange(!on)}><span></span></button>`;
  }
  function CheckCircle({ on, onClick, c, label, disabled }) {
    const act = (e) => { e.stopPropagation(); if (!disabled && onClick) onClick(); };
    return html`<span role="checkbox" tabindex=${disabled ? -1 : 0} aria-checked=${on} aria-label=${label} aria-disabled=${!!disabled} class=${'check-circle' + (on ? ' on' : '')} style=${{ '--c': cv(c || 'blue') }}
      onClick=${act} onKeyDown=${(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(e); } }}>${on && html`<${Icon} n="check" size=${14} sw=${3.4} color="#fff" />`}</span>`;
  }
  function Pill({ c, children, solid }) {
    return html`<span class=${'pill' + (solid ? ' solid' : '')} style=${{ '--c': cv(c) }}>${children}</span>`;
  }
  function Bar({ v, c, h }) {
    return html`<div class="progress" style=${{ height: (h || 6) + 'px' }}><span style=${{ width: Math.max(0, Math.min(1, v)) * 100 + '%', background: cv(c || 'blue') }}></span></div>`;
  }
  function Ring({ v, size, stroke, c, children }) {
    const s = size || 64, w = stroke || 8, r = (s - w) / 2, C = 2 * Math.PI * r, val = Math.max(0, Math.min(1, v));
    return html`<div class="ring" style=${{ width: s + 'px', height: s + 'px' }}>
      <svg width=${s} height=${s} viewBox=${`0 0 ${s} ${s}`}>
        <circle cx=${s / 2} cy=${s / 2} r=${r} fill="none" stroke="var(--fill)" stroke-width=${w} />
        <circle cx=${s / 2} cy=${s / 2} r=${r} fill="none" stroke=${cv(c || 'blue')} stroke-width=${w} stroke-linecap="round" stroke-dasharray=${`${C * val} ${C}`} transform=${`rotate(-90 ${s / 2} ${s / 2})`} />
      </svg>
      <div class="ring-center">${children}</div>
    </div>`;
  }
  function Btn({ children, onClick, v, c, disabled, icon, small }) {
    return html`<button class=${'btn ' + (v || 'filled') + (small ? ' small' : '')} style=${{ '--c': cv(c || 'blue') }} disabled=${disabled} onClick=${onClick}>
      ${icon && html`<${Icon} n=${icon} size=${small ? 16 : 19} sw=${2.3} />`}<span>${children}</span></button>`;
  }
  function HealthCard({ icon, c, title, value, unit, foot, onClick }) {
    const inner = html`<div class="hc-head" style=${{ color: cv(c) }}><${Icon} n=${icon} size=${16} sw=${2.6} /><span>${title}</span>${onClick && html`<span class="hc-chev"><${Icon} n="chevronRight" size=${15} sw=${2.6} /></span>`}</div>
      <div class="hc-value"><strong>${value}</strong>${unit && html`<span>${unit}</span>`}</div>
      ${foot && html`<div class="hc-foot">${foot}</div>`}`;
    return onClick ? html`<button class="health-card tappable" onClick=${onClick}>${inner}</button>` : html`<div class="health-card">${inner}</div>`;
  }
  function SheetHeader({ title, onCancel, cancel, action, onAction, disabled }) {
    return html`<div class="sheet-header">
      <button class="sheet-cancel" onClick=${onCancel}>${cancel || 'Hủy'}</button>
      <div class="sheet-title">${title}</div>
      ${action ? html`<button class="sheet-action" disabled=${disabled} onClick=${onAction}>${action}</button>` : html`<span></span>`}
    </div>`;
  }
  function Field({ label, children, err, stack, unit }) {
    return html`<label class=${'field-row' + (err ? ' err' : '') + (stack ? ' stack' : '')}><span class="fl">${label}</span>${children}${unit && html`<span class="unit">${unit}</span>`}</label>`;
  }
  function Note({ c, icon, children }) {
    return html`<div class="note" style=${{ '--c': cv(c || 'blue') }}><${Icon} n=${icon || 'info'} size=${18} sw=${2.2} /><div>${children}</div></div>`;
  }
  function MockPhoto({ taken, onTake, label }) {
    return html`<button class=${'mock-photo' + (taken ? ' taken' : '')} onClick=${onTake}>
      ${taken
        ? html`<span class="thumb"></span><span class="grow"><b>${label}</b><br /><span class="muted small">Đã chụp (ảnh mẫu). Chạm để chụp lại.</span></span><${Icon} n="check" size=${22} sw=${2.6} color="var(--green)" />`
        : html`<${Icon} n="camera" size=${22} /><span>Chụp ${label.toLowerCase()}</span>`}
    </button>`;
  }
  function StepBar({ status }) {
    const k = R.step(status);
    const done = status === 'completed';
    return html`<div class="steps">${R.STEPS.map((s, i) => {
      const cls = done || i < k - 1 ? ' done' : i === k - 1 ? ' cur' : '';
      return html`<div key=${s} class=${'st' + cls}><i></i><span>${s}</span></div>`;
    })}</div>`;
  }
  function StatusPill({ s }) {
    const [label, c] = R.STATUS[s];
    return html`<${Pill} c=${c}>${label}<//>`;
  }
  function Empty({ icon, title, text }) {
    return html`<div class="empty"><${Icon} n=${icon} size=${40} sw=${1.6} /><div class="empty-title">${title}</div>${text && html`<div>${text}</div>`}</div>`;
  }

  /* ================= Màn hình (Large Title) ================= */
  function Screen({ title, eyebrow, large, back, right, footer, children }) {
    const isLarge = large !== false;
    const ref = useRef(null);
    const [st, setSt] = useState({ shown: !isLarge, elev: false });
    useEffect(() => {
      const el = ref.current;
      const on = () => setSt({ shown: !isLarge || el.scrollTop > 40, elev: el.scrollTop > 2 });
      on();
      el.addEventListener('scroll', on, { passive: true });
      return () => el.removeEventListener('scroll', on);
    }, [isLarge]);
    return html`<div class="screen-wrap">
      <div class=${'screen' + (footer ? ' has-footer' : '')} ref=${ref}>
        <header class=${'navbar' + (st.elev ? ' elevated' : '')}>
          <div class="navbar-side left">${back && html`<button class="nav-back" onClick=${back.onClick}><${Icon} n="chevronLeft" size=${28} sw=${2.3} /><span>${back.label}</span></button>`}</div>
          <div class=${'navbar-title' + (st.shown ? ' shown' : '')}>${title}</div>
          <div class="navbar-side right">${right}</div>
        </header>
        ${isLarge && eyebrow && html`<div class="eyebrow">${eyebrow}</div>`}
        ${isLarge && html`<h1 class="large-title">${title}</h1>`}
        <div class="screen-body">${children}</div>
      </div>
      ${footer && html`<div class="action-bar">${footer}</div>`}
    </div>`;
  }
  function Avatar() {
    const app = useApp();
    return html`<button class="avatar-btn" aria-label="Trang cá nhân" onClick=${() => app.nav.push('me')}>H</button>`;
  }
  function TabRight({ extra }) {
    return html`${extra}<${Avatar} />`;
  }
  function useBack() {
    const app = useApp();
    return { label: app.nav.backLabel, onClick: app.nav.pop };
  }

  /* ================= Thẻ chuyến ================= */
  function dueText(t, now) {
    const due = new Date(`${t.date}T${t.deliverBy}:00`);
    const diff = Math.round((due - now) / 60000);
    if (diff >= 0) return { text: `Còn ${fmt.duration(diff)}`, c: diff < 30 ? 'orange' : 'green' };
    return { text: `Trễ ${fmt.duration(-diff)}`, c: 'red' };
  }
  function TripCard({ t, onClick, showSteps }) {
    const app = useApp();
    const now = app.now();
    const live = ['accepted', 'loading', 'in_transit', 'unloading'].includes(t.status) && t.date === TODAY;
    const due = live ? dueText(t, now) : null;
    const late = t.status === 'completed' && R.isLate(t);
    const loss = t.status === 'completed' ? R.tripLoss(t) : null;
    return html`<button class="trip-card" onClick=${onClick}>
      <div class="trip-top"><span class="code">${t.code}</span><span>·</span><span>${t.date === TODAY ? 'Hôm nay' : fmt.weekday(t.date) + ' ' + fmt.dm(t.date)}</span><span class="grow"></span>
        ${late && html`<${Pill} c="red">Giao trễ<//>`}${loss && loss.pct > R.LOSS_LIMIT_PCT && html`<${Pill} c="red">Hao hụt ${fmt.num2(loss.pct)}%<//>`}<${StatusPill} s=${t.status} /></div>
      <div class="route">
        <span class="dot" style=${{ background: 'var(--gray)' }}></span><div><div class="place">${t.depot.name}</div></div>
        <span class="line"></span><span></span>
        <span class="dot" style=${{ background: 'var(--red)' }}></span><div><div class="place">${t.dest.name}</div><div class="addr">${t.dest.address}</div></div>
      </div>
      <div class="trip-meta">
        <span><${Icon} n=${t.kind === 'drum' ? 'package' : 'droplet'} size=${14} />${R.cargo(t)}</span>
        <span><${Icon} n="clock" size=${14} />Giao trước ${t.deliverBy}</span>
        <span><${Icon} n="route" size=${14} />${t.km} km</span>
      </div>
      ${showSteps && live && html`<${StepBar} status=${t.status} />`}
      ${due && html`<div class="small" style=${{ color: cv(due.c), fontWeight: 600 }}>${due.text} tới giờ giao</div>`}
    </button>`;
  }

  /* ================= Thẻ chấm công ================= */
  function AttendanceCard() {
    const app = useApp();
    useTick(1000);
    const now = app.now();
    const rec = app.data.attendance.find((a) => a.date === TODAY);
    const st = rec && rec.in ? R.clockIn(rec.in) : null;
    const start = rec && rec.in ? new Date(`${TODAY}T${rec.in}:00`) : null;
    const end = rec && rec.out ? new Date(`${TODAY}T${rec.out}:00`) : now;
    const worked = start ? (end - start) / 1000 : 0;
    const left = rec && rec.out ? R.leftEarly(rec.out) : null;

    const clockIn = () => {
      app.mutate((d) => {
        const hm = fmt.hmOf(app.now());
        const r = d.attendance.find((a) => a.date === TODAY);
        if (r) r.in = hm; else d.attendance.push({ date: TODAY, in: hm });
      });
      app.ov.toast('Đã chấm công vào ca');
    };
    const clockOut = () => {
      const active = app.data.trips.find((t) => t.date === TODAY && ['loading', 'in_transit', 'unloading'].includes(t.status));
      if (active) {
        app.ov.alert({ title: 'Còn chuyến chưa hoàn tất', message: `Chuyến ${active.code} đang ở bước "${R.STATUS[active.status][0]}". Hoàn tất chuyến trước khi ra ca.`, actions: [{ label: 'Đã hiểu', style: 'cancel' }] });
        return;
      }
      const hm = fmt.hmOf(app.now());
      const le = R.leftEarly(hm);
      const doOut = () => {
        app.mutate((d) => { d.attendance.find((a) => a.date === TODAY).out = hm; });
        app.ov.toast(le.early ? `Đã ra ca, tính về sớm ${fmt.duration(le.minutes)}` : 'Đã chấm công ra ca', le.early ? 'warning' : 'success');
      };
      if (le.early) {
        app.ov.alert({
          title: 'Ra ca trước giờ?',
          message: `Ca kết thúc lúc ${R.SHIFT.end}. Ra ca lúc ${hm} sẽ bị tính về sớm ${fmt.duration(le.minutes)}.`,
          actions: [{ label: 'Ở lại', style: 'cancel' }, { label: 'Ra ca', style: 'destructive', onPress: doOut }],
        });
      } else doOut();
    };

    return html`<div class="card">
      <div class="card-head"><${Icon} n="clock" size=${17} sw=${2.4} color="var(--blue)" /><span style=${{ color: 'var(--blue)' }}>Chấm công</span><span class="spacer"></span>
        ${st && html`<${Pill} c=${st.mark === 'late' ? 'red' : st.mark === 'early' ? 'green' : 'blue'}>${st.label}<//>`}
        ${left && left.early && html`<${Pill} c="orange">Về sớm<//>`}</div>
      ${rec && rec.in
        ? html`<div class="flex" style=${{ alignItems: 'flex-end' }}>
            <div class="grow"><div class="muted small">Vào ca</div><div class="big-time">${rec.in}</div></div>
            <div style=${{ textAlign: 'right' }}><div class="muted small">${rec.out ? 'Ra ca ' + rec.out : 'Đã làm'}</div><div class="tnum" style=${{ fontSize: '22px', fontWeight: 600 }}>${fmt.hhmmss(worked)}</div></div>
          </div>`
        : html`<div class="muted footnote">Chưa vào ca. Ca hôm nay ${R.SHIFT.start} – ${R.SHIFT.end}.</div>`}
      <div class="inline-flex small" style=${{ color: 'var(--green)' }}><${Icon} n="mapPin" size=${14} sw=${2.4} />Trong vùng cho phép · Bãi xe Kho Nhà Bè</div>
      ${!rec || !rec.in
        ? html`<${Btn} icon="logIn" onClick=${clockIn}>Chấm công vào ca<//>`
        : !rec.out
          ? html`<${Btn} v="tinted" c="red" icon="logOut" onClick=${clockOut}>Chấm công ra ca<//>`
          : html`<${Btn} v="gray" c="gray" disabled=${true}>Đã ra ca lúc ${rec.out}<//>`}
    </div>`;
  }

  /* ================= Trang Hôm nay ================= */
  function TodayScreen() {
    const app = useApp();
    useTick(15000);
    const d = app.data;
    const now = app.now();
    const today = d.trips.filter((t) => t.date === TODAY).sort((a, b) => a.pickupTime.localeCompare(b.pickupTime));
    const active = today.find((t) => ['loading', 'in_transit', 'unloading'].includes(t.status));
    const next = active || today.find((t) => ['accepted', 'pending'].includes(t.status));
    const delivered = today.filter((t) => t.status === 'completed').reduce((s, t) => s + R.totals(t).delivered, 0);
    const kpi = R.kpi(d, MONTH);
    const inc = R.income(d, MONTH);
    const learn = R.learnMinutes(d, MONTH);

    const attention = [];
    const pend = d.trips.filter((t) => t.status === 'pending' && t.date >= TODAY);
    if (pend.length) attention.push({ icon: 'truck', c: 'orange', title: `${pend.length} chuyến chờ nhận`, sub: pend.map((t) => `${t.code} · ${fmt.dm(t.date)}`).join(', '), go: () => app.nav.tab('jobs') });
    const needCheck = today.find((t) => ['accepted', 'pending'].includes(t.status) && !R.preOk(t));
    if (needCheck) attention.push({ icon: 'clipboard', c: 'red', title: 'Chưa kiểm tra xe trước chuyến', sub: `Bắt buộc trước khi lấy hàng chuyến ${needCheck.code}`, go: () => openChecklist(app, needCheck.id) });
    d.certificates.forEach((c) => {
      const days = fmt.daysBetween(TODAY, c.expires);
      if (days <= 60) attention.push({ icon: 'idcard', c: R.tone(days), title: `${c.name} hết hạn sau ${days} ngày`, sub: c.renewalRequested ? 'Đã đăng ký gia hạn' : `Hết hạn ${fmt.dmy(c.expires)}. Đăng ký gia hạn sớm.`, go: () => app.nav.push('certs') });
    });
    d.courses.filter((c) => c.required && c.deadline).forEach((c) => {
      const p = R.courseProgress(c);
      const days = fmt.daysBetween(TODAY, c.deadline);
      if (p.done < p.total && days <= 30) attention.push({ icon: 'grad', c: 'purple', title: `Khóa bắt buộc: ${c.title}`, sub: `Còn ${p.total - p.done} bài · hạn ${fmt.dmy(c.deadline)} (${days} ngày)`, go: () => app.nav.push('course', { id: c.id }) });
    });
    const dueTasks = d.tasks.filter((k) => !k.done && fmt.daysBetween(TODAY, k.due) <= 2);
    if (dueTasks.length) attention.push({ icon: 'list', c: 'blue', title: `${dueTasks.length} nhiệm vụ sắp đến hạn`, sub: dueTasks[0].title, go: () => app.nav.push('me') });
    const v = d.vehicles[0];
    if (v.kmToService < 1500) attention.push({ icon: 'wrench', c: 'gray', title: 'Sắp tới kỳ bảo dưỡng', sub: `Xe ${v.plate} còn ${fmt.num(v.kmToService)} km`, go: () => app.nav.push('me') });

    const shortcuts = [
      ['plus', 'green', 'Thêm chi phí', () => openExpense(app)],
      ['clipboard', 'blue', 'Kiểm tra xe', () => {
        const t = today.find((x) => ['accepted', 'pending'].includes(x.status));
        if (t) openChecklist(app, t.id);
        else app.ov.toast('Không có chuyến nào cần kiểm tra xe', 'info');
      }],
      ['alert', 'orange', 'Báo sự cố', () => openIncident(app)],
      ['headset', 'teal', 'Gọi điều độ', () => openCallDispatcher(app)],
    ];

    return html`<${Screen} title="Hôm nay" eyebrow=${`${fmt.weekday(TODAY)}, ${fmt.dmy(TODAY)}`}
      right=${html`<${TabRight} extra=${html`<button class="sos-fab" onClick=${() => openSOS(app)}><${Icon} n="siren" size=${16} sw=${2.4} />SOS</button>`} />`}>
      <${AttendanceCard} />
      ${next
        ? html`<div><div class="section-header plain" style=${{ margin: '0 16px' }}><span>${active ? 'Chuyến đang chạy' : 'Chuyến tiếp theo'}</span></div>
            <${TripCard} t=${next} showSteps=${true} onClick=${() => app.nav.push('trip', { id: next.id })} /></div>`
        : html`<div class="card"><div class="muted footnote">Không còn chuyến nào hôm nay.</div></div>`}
      <div class="hc-grid">
        <${HealthCard} icon="droplet" c="indigo" title="Đã giao" value=${fmt.num(delivered)} unit="L" foot=${`Hôm nay · ${today.filter((t) => t.status === 'completed').length}/${today.length} chuyến`} onClick=${() => app.nav.tab('jobs')} />
        <${HealthCard} icon="gauge" c="orange" title="Điểm KPI" value=${fmt.num1(kpi.total)} unit="/100" foot=${kpi.grade} onClick=${() => { STICKY['att.seg'] = 'kpi'; app.nav.tab('attendance'); }} />
        <${HealthCard} icon="wallet" c="green" title="Thu nhập" value=${fmt.num1(inc.net / 1e6)} unit="triệu ₫" foot="Dự kiến tháng 11" onClick=${() => { STICKY['fin.seg'] = 'pay'; app.nav.tab('finance'); }} />
        <${HealthCard} icon="grad" c="purple" title="Giờ học" value=${fmt.num1(learn / 60)} unit="/ 8 giờ" foot=${learn >= R.LEARNING_TARGET_MIN ? 'Đạt mục tiêu' : `Còn ${fmt.duration(R.LEARNING_TARGET_MIN - learn)}`} onClick=${() => app.nav.tab('learning')} />
      </div>
      ${attention.length > 0 && html`<${Section} header="Cần chú ý" plain=${true}>
        ${attention.map((a, i) => html`<${Row} key=${i} icon=${a.icon} c=${a.c} title=${a.title} subtitle=${a.sub} chevron=${true} multiline=${true} onClick=${a.go} />`)}
      <//>`}
      <${Section} header="Lịch chạy hôm nay" plain=${true}>
        ${today.map((t) => html`<${Row} key=${t.id} left=${html`<div class="tnum" style=${{ width: '52px', fontSize: '15px', fontWeight: 600 }}>${t.pickupTime}<div class="muted small">${t.deliverBy}</div></div>`}
          title=${t.dest.name} subtitle=${`${t.code} · ${R.cargo(t)}`} right=${html`<${StatusPill} s=${t.status} />`} chevron=${true} multiline=${true} onClick=${() => app.nav.push('trip', { id: t.id })} />`)}
      <//>
      <div>
        <div class="section-header plain" style=${{ margin: '0 16px' }}><span>Lối tắt</span></div>
        <div class="hc-grid" style=${{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          ${shortcuts.map((s) => html`<button key=${s[2]} class="health-card tappable" style=${{ alignItems: 'center', gap: '8px', padding: '12px 4px', textAlign: 'center' }} onClick=${s[3]}>
            <${IconTile} n=${s[0]} c=${s[1]} size=${40} /><span class="small" style=${{ fontWeight: 500 }}>${s[2]}</span></button>`)}
        </div>
      </div>
    <//>`;
  }

  /* ================= Công việc ================= */
  function JobsScreen() {
    const app = useApp();
    const [seg, setSeg] = useSticky('jobs.seg', 'today');
    const all = app.data.trips;
    const list = (seg === 'today' ? all.filter((t) => t.date === TODAY).sort((a, b) => a.pickupTime.localeCompare(b.pickupTime))
      : seg === 'up' ? all.filter((t) => t.date > TODAY).sort((a, b) => a.date.localeCompare(b.date))
        : all.filter((t) => t.date < TODAY).sort((a, b) => (b.date + b.pickupTime).localeCompare(a.date + a.pickupTime)));
    const liters = list.reduce((s, t) => s + R.totals(t).ordered, 0);
    const km = list.reduce((s, t) => s + t.km, 0);
    return html`<${Screen} title="Công việc" right=${html`<${TabRight} />`}>
      <${Seg} options=${[['today', 'Hôm nay'], ['up', 'Sắp tới'], ['hist', 'Lịch sử']]} value=${seg} onChange=${setSeg} />
      <div class="summary-line" style=${{ marginTop: '-8px' }}>${list.length} chuyến · ${fmt.liters(liters)} · ${fmt.num(km)} km</div>
      ${list.length === 0 ? html`<${Empty} icon="truck" title="Chưa có chuyến" />` : list.map((t) => html`<${TripCard} key=${t.id} t=${t} showSteps=${seg === 'today'} onClick=${() => app.nav.push('trip', { id: t.id })} />`)}
    <//>`;
  }

  /* ================= Chi tiết chuyến ================= */
  const PRODUCT_COLOR = (p) => (p.includes('RON95') ? 'red' : p.includes('E5') ? 'green' : p.includes('DO') ? 'orange' : p.includes('thủy lực') ? 'teal' : 'brown');
  const mapsUrl = (addr) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`;

  function TripScreen({ id }) {
    const app = useApp();
    useTick(15000);
    const t = app.data.trips.find((x) => x.id === id);
    if (!t) return html`<${Screen} title="Chuyến" large=${false} back=${useBack()}><${Empty} icon="truck" title="Không tìm thấy chuyến" /><//>`;
    const tot = R.totals(t);
    const loss = t.status === 'completed' ? R.tripLoss(t) : null;
    const live = t.date === TODAY && ['accepted', 'loading', 'in_transit', 'unloading'].includes(t.status);
    const due = live ? dueText(t, app.now()) : null;
    const toDest = ['in_transit', 'unloading', 'completed'].includes(t.status);
    const veh = app.data.vehicles.find((v) => v.plate === t.vehiclePlate);
    const preDone = t.preCheck.filter((c) => c.required && c.done).length;
    const preReq = t.preCheck.filter((c) => c.required).length;

    const toggle = (list, cid) => app.mutate((d) => {
      const tr = d.trips.find((x) => x.id === id);
      const c = tr[list].find((x) => x.id === cid);
      c.done = !c.done;
    });

    const footer = tripFooter(app, t);

    return html`<${Screen} title=${t.code} large=${false} back=${useBack()} footer=${footer}>
      <div class="card" style=${{ marginTop: '4px' }}>
        <div class="flex"><${StatusPill} s=${t.status} /><span class="muted small grow">${t.date === TODAY ? 'Hôm nay' : fmt.weekday(t.date) + ', ' + fmt.dmy(t.date)} · Lấy hàng ${t.pickupTime}</span></div>
        ${t.status !== 'rejected' && html`<${StepBar} status=${t.status} />`}
        <div class="kv"><span>Giờ hẹn giao</span><span><b>${t.deliverBy}</b>${due && html` · <span style=${{ color: cv(due.c), fontWeight: 600 }}>${due.text}</span>`}${t.completedAt && html` · giao lúc ${fmt.hm(t.completedAt)}`}</span></div>
        ${t.status === 'completed' && R.isLate(t) && html`<${Note} c="red" icon="clock">Giao trễ so với giờ hẹn. Chuyến này tính vào chỉ tiêu Giao đúng hẹn.<//>`}
        ${t.status === 'rejected' && html`<${Note} c="gray" icon="x">Đã từ chối: ${t.rejectReason}<//>`}
      </div>

      <${Section} header="Lộ trình">
        <${Row} icon="tank" c="gray" title=${t.depot.name} subtitle=${t.depot.address} multiline=${true} right=${html`<${Pill} c="gray">Lấy hàng<//>`} />
        <${Row} icon="mapPin" c="red" title=${t.dest.name} subtitle=${t.dest.address} multiline=${true} right=${html`<${Pill} c="red">Giao<//>`} />
        <${Row} icon="user" c="teal" title=${t.receiver.name} subtitle=${html`Người nhận · <span class="tnum">${t.receiver.phone}</span>`} multiline=${true}
          right=${html`<a class="btn small tinted" style=${{ '--c': 'var(--green)' }} href=${'tel:' + t.receiver.phone.replace(/\s/g, '')}><${Icon} n="phone" size=${15} sw=${2.4} /><span>Gọi</span></a>`} />
        <a class="row tappable has-icon" href=${mapsUrl(toDest ? t.dest.address : t.depot.address)} target="_blank" rel="noopener">
          <${IconTile} n="nav" c="blue" /><div class="row-main"><div class="row-title accent">Chỉ đường tới ${toDest ? 'điểm giao' : 'kho'}</div></div>
          <span class="chevron"><${Icon} n="chevronRight" size=${17} sw=${2.6} /></span></a>
      <//>

      <${Section} header=${t.kind === 'drum' ? `Hàng hóa · ${tot.units} thùng/phuy` : `Hàng hóa theo khoang · ${fmt.liters(tot.ordered)}`}
        footer=${loss ? null : t.kind === 'tanker' ? 'Lệnh = lượng theo lệnh xuất. Thực nạp và thực xả do lái xe nhập ở kho và ở điểm giao.' : 'Hàng đóng phuy/thùng, đếm theo số lượng.'}>
        ${t.kind === 'tanker' && veh && html`<div style=${{ padding: '12px 0 4px' }}><div class="tank-bar">
          ${veh.compartments.map((cap, i) => {
            const lot = t.lots.find((l) => l.no === i + 1);
            return html`<span key=${i} style=${{ flex: cap, background: lot ? cv(PRODUCT_COLOR(lot.product)) : 'var(--fill)', color: lot ? '#fff' : 'var(--label2)' }}>K${i + 1}</span>`;
          })}</div></div>`}
        ${t.lots.map((l) => html`<div class="comp" key=${l.no}>
          <span class="comp-no" style=${{ background: cv(PRODUCT_COLOR(l.product)) }}>${t.kind === 'drum' ? l.no : 'K' + l.no}</span>
          <span class="comp-name">${l.product}</span>
          <span class="comp-cap">${l.capacity ? 'Khoang ' + fmt.num(l.capacity) + ' L' : l.unit + ' ' + l.unitSize + ' L'}</span>
          <div class="comp-nums">
            <span>Lệnh<b>${fmt.num(l.ordered)}</b></span>
            <span>Thực nạp<b>${l.loaded != null ? fmt.num(l.loaded) : '—'}</b></span>
            <span>Thực xả<b>${l.delivered != null ? fmt.num(l.delivered) : '—'}</b></span>
          </div></div>`)}
        ${loss && html`<${Row} title="Hao hụt" value=${html`<span style=${{ color: loss.pct > R.LOSS_LIMIT_PCT ? 'var(--red)' : 'var(--green)', fontWeight: 600 }}>${fmt.num(loss.liters)} L · ${fmt.num2(loss.pct)}%</span>`} />`}
      <//>

      <${Section} header="Kiểm tra xe trước chuyến">
        <${Row} icon="clipboard" c=${R.preOk(t) ? 'green' : 'red'} title=${R.preOk(t) ? 'Đã đạt các mục bắt buộc' : 'Chưa đạt các mục bắt buộc'}
          subtitle=${`${preDone}/${preReq} mục bắt buộc · ${t.preCheck.filter((c) => c.done).length}/${t.preCheck.length} tổng`} chevron=${true} multiline=${true} onClick=${() => openChecklist(app, t.id)} />
      <//>

      <${Section} header="Checklist tại kho" footer=${t.status === 'loading' ? 'Chạm vòng tròn để đánh dấu. Phải xong cả 4 mục mới ghi nhận nạp và xuất bến được.' : null}>
        ${t.depotCheck.map((c) => html`<${Row} key=${c.id} title=${c.label} left=${html`<${CheckCircle} on=${c.done} c="green" label=${c.label} disabled=${t.status !== 'loading'} onClick=${() => toggle('depotCheck', c.id)} />`}
          onClick=${t.status === 'loading' ? () => toggle('depotCheck', c.id) : null} />`)}
      <//>
      <${Section} header="Checklist tại điểm giao" footer=${t.status === 'unloading' ? 'Phải xong cả 4 mục mới xác nhận xả hàng được.' : null}>
        ${t.destCheck.map((c) => html`<${Row} key=${c.id} title=${c.label} left=${html`<${CheckCircle} on=${c.done} c="green" label=${c.label} disabled=${t.status !== 'unloading'} onClick=${() => toggle('destCheck', c.id)} />`}
          onClick=${t.status === 'unloading' ? () => toggle('destCheck', c.id) : null} />`)}
      <//>

      <${Section} header="Thông tin chuyến">
        <${Row} icon="truck" c="blue" title="Xe" value=${t.vehiclePlate} />
        <${Row} icon="seal" c="indigo" title="Số chì" value=${t.seal || 'Chưa có'} />
        ${t.temperature != null && html`<${Row} icon="thermo" c="orange" title="Nhiệt độ khi nạp" value=${fmt.num1(t.temperature) + ' °C'} />`}
        <${Row} icon="banknote" c="green" title="Phụ cấp chuyến" value=${fmt.money(R.allowance(t.km))} subtitle=${`150.000 ₫ + 5.000 ₫ × ${t.km} km`} />
        ${t.confirm && html`<${Row} icon="pen" c="teal" title="Người nhận xác nhận" value=${{ otp: 'Mã OTP', signature: 'Ký tay', photo: 'Ảnh phiếu' }[t.confirm.method] + ' · ' + fmt.hm(t.confirm.at)} />`}
        ${t.loadExplanation && html`<${Row} icon="message" c="orange" title="Giải trình lệch lượng nạp" subtitle=${t.loadExplanation} multiline=${true} />`}
        ${t.lossExplanation && html`<${Row} icon="message" c="red" title="Giải trình hao hụt" subtitle=${t.lossExplanation} multiline=${true} />`}
        ${t.note && html`<${Row} icon="info" c="gray" title="Ghi chú điều độ" subtitle=${t.note} multiline=${true} />`}
      <//>
    <//>`;
  }

  function tripFooter(app, t) {
    const active = app.data.trips.find((x) => x.id !== t.id && x.date === TODAY && ['loading', 'in_transit', 'unloading'].includes(x.status));
    const set = (status, extra) => app.mutate((d) => {
      const tr = d.trips.find((x) => x.id === t.id);
      tr.status = status;
      tr.events.push({ status, at: fmt.isoLocal(app.now()) });
      if (extra) extra(tr);
    });
    switch (t.status) {
      case 'pending':
        return html`<div class="btn-row">
          <${Btn} v="gray" c="red" onClick=${() => app.ov.sheet((close) => html`<${RejectSheet} trip=${t} close=${close} />`, { form: true })}>Từ chối<//>
          <${Btn} icon="check" onClick=${() => { set('accepted'); app.ov.toast(`Đã nhận chuyến ${t.code}`); }}>Nhận chuyến<//>
        </div>`;
      case 'accepted':
        return html`<${Btn} icon="tank" onClick=${() => {
          if (t.date !== TODAY) return app.ov.alert({ title: 'Chưa tới ngày chạy', message: `Chuyến này chạy ngày ${fmt.dmy(t.date)}. Anh chỉ bắt đầu lấy hàng được vào đúng ngày.`, actions: [{ label: 'Đã hiểu', style: 'cancel' }] });
          if (active) return app.ov.alert({ title: 'Đang có chuyến khác', message: `Chuyến ${active.code} chưa hoàn tất. Hoàn tất chuyến đó trước khi lấy hàng chuyến mới.`, actions: [{ label: 'Để sau', style: 'cancel' }, { label: 'Mở chuyến đó', onPress: () => app.nav.replace('trip', { id: active.id }) }] });
          if (!R.preOk(t)) {
            const miss = t.preCheck.filter((c) => c.required && !c.done);
            return app.ov.alert({ title: 'Chưa kiểm tra xe', message: `Còn ${miss.length} mục bắt buộc chưa đạt: ${miss.slice(0, 3).map((c) => c.label.toLowerCase()).join(', ')}${miss.length > 3 ? '…' : ''}. Xe chở hàng nguy hiểm phải đạt hết trước khi lấy hàng.`, actions: [{ label: 'Để sau', style: 'cancel' }, { label: 'Kiểm tra ngay', onPress: () => openChecklist(app, t.id) }] });
          }
          set('loading');
          app.ov.toast('Bắt đầu lấy hàng. Làm checklist tại kho.');
        }}>Bắt đầu lấy hàng<//>`;
      case 'loading':
        return html`<${Btn} icon="droplet" onClick=${() => {
          const miss = t.depotCheck.filter((c) => !c.done);
          if (miss.length) return app.ov.alert({ title: 'Chưa xong checklist tại kho', message: `Còn ${miss.length} mục: ${miss.map((c) => c.label.toLowerCase()).join('; ')}.`, actions: [{ label: 'Đã hiểu', style: 'cancel' }] });
          app.ov.sheet((close) => html`<${LoadingSheet} trip=${t} close=${close} />`, { form: true });
        }}>Ghi nhận nạp và xuất bến<//>`;
      case 'in_transit':
        return html`<${Btn} icon="mapPin" onClick=${() => { set('unloading'); app.ov.toast('Đã tới điểm giao. Làm checklist trước khi xả.'); }}>Đã tới điểm giao<//>
          <div class="hint">Bấm khi xe đã dừng hẳn tại ${t.dest.name}</div>`;
      case 'unloading':
        return html`<${Btn} c="green" icon="check" onClick=${() => {
          const miss = t.destCheck.filter((c) => !c.done);
          if (miss.length) return app.ov.alert({ title: 'Chưa xong checklist tại điểm giao', message: `Còn ${miss.length} mục: ${miss.map((c) => c.label.toLowerCase()).join('; ')}.`, actions: [{ label: 'Đã hiểu', style: 'cancel' }] });
          app.ov.sheet((close) => html`<${DeliverySheet} trip=${t} close=${close} />`, { form: true });
        }}>Xả hàng và xác nhận<//>`;
      default:
        return null;
    }
  }

  /* ================= Sheet: kiểm tra xe ================= */
  function openChecklist(app, tripId) {
    app.ov.sheet((close) => html`<${ChecklistSheet} tripId=${tripId} close=${close} />`, { form: true });
  }
  function ChecklistSheet({ tripId, close }) {
    const app = useApp();
    const t = app.data.trips.find((x) => x.id === tripId);
    const editable = ['pending', 'accepted'].includes(t.status);
    const [items, setItems] = useState(() => t.preCheck.map((c) => ({ ...c })));
    const toggle = (id) => editable && setItems(items.map((c) => (c.id === id ? { ...c, done: !c.done } : c)));
    const reqOk = items.filter((c) => c.required).every((c) => c.done);
    const save = () => {
      app.mutate((d) => { d.trips.find((x) => x.id === tripId).preCheck = items; });
      close();
      app.ov.toast(reqOk ? 'Xe đạt kiểm tra, có thể bắt đầu lấy hàng' : 'Đã lưu. Còn mục bắt buộc chưa đạt', reqOk ? 'success' : 'warning');
    };
    return html`<${SheetHeader} title="Kiểm tra xe trước chuyến" onCancel=${close} action=${editable ? 'Lưu' : null} onAction=${save} />
      <div class="sheet-body">
        <${Note} c=${reqOk ? 'green' : 'orange'} icon=${reqOk ? 'shield' : 'alert'}>${reqOk ? 'Đã đạt tất cả mục bắt buộc.' : 'Mục có nhãn "Bắt buộc" phải đạt thì mới được bắt đầu lấy hàng.'} Chuyến ${t.code} · xe ${t.vehiclePlate}.<//>
        <${Section} header=${`${items.filter((c) => c.done).length}/${items.length} mục đạt`} action=${editable && html`<button onClick=${() => setItems(items.map((c) => ({ ...c, done: true })))}>Đánh dấu tất cả đạt</button>`}>
          ${items.map((c) => html`<${Row} key=${c.id} title=${c.label} left=${html`<${CheckCircle} on=${c.done} c="green" label=${c.label} disabled=${!editable} onClick=${() => toggle(c.id)} />`}
            right=${c.required ? html`<${Pill} c="red">Bắt buộc<//>` : html`<${Pill} c="gray">Khuyến nghị<//>`} onClick=${editable ? () => toggle(c.id) : null} />`)}
        <//>
        ${!editable && html`<${Note} c="gray" icon="lock">Chuyến đã bắt đầu, kết quả kiểm tra xe đã khóa.<//>`}
      </div>`;
  }

  /* ================= Sheet: từ chối chuyến ================= */
  const REJECT_REASONS = ['Xe hỏng, chưa sửa xong', 'Sức khỏe không đảm bảo', 'Vượt giờ lái cho phép trong ngày', 'Trùng lịch với chuyến khác', 'Lý do khác'];
  function RejectSheet({ trip, close }) {
    const app = useApp();
    const [reason, setReason] = useState(null);
    const [note, setNote] = useState('');
    const other = reason === 'Lý do khác';
    const ok = reason && (!other || note.trim().length >= 5);
    const send = () => {
      app.mutate((d) => {
        const t = d.trips.find((x) => x.id === trip.id);
        t.status = 'rejected';
        t.rejectReason = other ? note.trim() : reason + (note.trim() ? ` – ${note.trim()}` : '');
        t.events.push({ status: 'rejected', at: fmt.isoLocal(app.now()) });
      });
      close();
      app.ov.toast('Đã từ chối. Điều độ sẽ sắp xếp lại chuyến.', 'info');
    };
    return html`<${SheetHeader} title="Từ chối chuyến" onCancel=${close} action="Gửi" disabled=${!ok} onAction=${send} />
      <div class="sheet-body">
        <${Section} header="Chọn lý do" footer=${`Lý do được gửi tới điều độ ${app.data.driver.dispatcher.name}.`}>
          ${REJECT_REASONS.map((r) => html`<${Row} key=${r} title=${r} onClick=${() => setReason(r)} right=${reason === r && html`<${Icon} n="check" size=${20} sw=${2.6} color="var(--blue)" />`} />`)}
        <//>
        <${Section} header=${other ? 'Mô tả lý do (bắt buộc)' : 'Ghi chú thêm'}>
          <textarea class="ta" id="reject-note" placeholder="Ví dụ: đèn phanh bên trái không sáng" value=${note} onInput=${(e) => setNote(e.currentTarget.value)}></textarea>
        <//>
      </div>`;
  }

  /* ================= Sheet: nạp hàng ================= */
  function LoadingSheet({ trip, close }) {
    const app = useApp();
    const t = trip;
    const tanker = t.kind === 'tanker';
    const [vals, setVals] = useState(() => t.lots.map(() => ''));
    const [seal, setSeal] = useState('');
    const [temp, setTemp] = useState('');
    const [photo, setPhoto] = useState(false);
    const [expl, setExpl] = useState('');
    const nums = vals.map(parseInt0);
    const errs = nums.map((n, i) => isNaN(n) || n <= 0 || (t.lots[i].capacity && n > t.lots[i].capacity));
    const allIn = nums.every((n) => !isNaN(n));
    const loadedL = nums.reduce((s, n, i) => s + (isNaN(n) ? 0 : n * t.lots[i].unitSize), 0);
    const orderedL = R.totals(t).ordered;
    const dev = allIn ? R.deviationPct(orderedL, loadedL) : 0;
    const needExpl = allIn && dev > R.LOAD_DEVIATION_PCT;
    const tempN = parseDec(temp);
    const ok = !errs.some(Boolean) && seal.trim() && (!tanker || (!isNaN(tempN) && tempN > -10 && tempN < 60)) && photo && (!needExpl || expl.trim().length >= 5);
    const save = () => {
      app.mutate((d) => {
        const tr = d.trips.find((x) => x.id === t.id);
        tr.lots.forEach((l, i) => { l.loaded = nums[i]; });
        tr.seal = seal.trim();
        if (tanker) tr.temperature = tempN;
        tr.loadPhoto = true;
        tr.loadExplanation = needExpl ? expl.trim() : undefined;
        tr.status = 'in_transit';
        tr.departedAt = fmt.isoLocal(app.now());
        tr.events.push({ status: 'in_transit', at: tr.departedAt });
      });
      close();
      app.ov.toast('Đã ghi nhận nạp hàng. Xe xuất bến.');
    };
    return html`<${SheetHeader} title="Nạp hàng và xuất bến" onCancel=${close} action="Xuất bến" disabled=${!ok} onAction=${save} />
      <div class="sheet-body">
        <${Section} header=${tanker ? 'Lượng thực nạp từng khoang (lít)' : 'Số lượng thực nhận'} action=${html`<button onClick=${() => setVals(t.lots.map((l) => String(l.ordered)))}>Điền theo lệnh</button>`}
          footer=${tanker ? 'Lấy số trên phiếu xuất kho. Không vượt dung tích khoang.' : 'Đếm đủ số phuy/thùng trước khi ký nhận.'}>
          ${t.lots.map((l, i) => html`<${Field} key=${l.no} label=${tanker ? `Khoang ${l.no}` : `Lô ${l.no}`} err=${vals[i] !== '' && errs[i]} unit=${tanker ? 'L' : l.unit}>
            <input id=${'load-' + l.no} inputmode="numeric" placeholder=${'Lệnh ' + fmt.num(l.ordered)} value=${vals[i]} onInput=${(e) => { const v = [...vals]; v[i] = e.currentTarget.value; setVals(v); }} />
          <//>`)}
        <//>
        ${allIn && html`<${Note} c=${needExpl ? 'orange' : 'green'} icon=${needExpl ? 'alert' : 'check'}>
          Tổng nạp ${fmt.liters(loadedL)} so với lệnh ${fmt.liters(orderedL)}: lệch ${fmt.num2(dev)}%. ${needExpl ? `Vượt ${fmt.num1(R.LOAD_DEVIATION_PCT)}%, cần giải trình.` : 'Trong ngưỡng cho phép.'}<//>`}
        ${needExpl && html`<${Section} header="Giải trình lệch lượng nạp (bắt buộc)"><textarea class="ta" id="load-expl" placeholder="Ví dụ: kho xuất thiếu do đồng hồ bệ 3 lỗi, đã ký biên bản" value=${expl} onInput=${(e) => setExpl(e.currentTarget.value)}></textarea><//>`}
        <${Section} header="Niêm phong và đo đạc">
          <${Field} label="Số chì"><input id="load-seal" placeholder="VD: NB-778301 → 778304" value=${seal} onInput=${(e) => setSeal(e.currentTarget.value)} /><//>
          ${tanker && html`<${Field} label="Nhiệt độ" unit="°C" err=${temp !== '' && (isNaN(tempN) || tempN <= -10 || tempN >= 60)}><input id="load-temp" inputmode="decimal" placeholder="30,5" value=${temp} onInput=${(e) => setTemp(e.currentTarget.value)} /><//>`}
        <//>
        <div><div class="section-header" style=${{ margin: '0 16px' }}><span>Phiếu xuất kho</span></div><${MockPhoto} taken=${photo} onTake=${() => setPhoto(true)} label="Ảnh phiếu xuất" /></div>
      </div>`;
  }

  /* ================= Sheet: xả hàng ================= */
  function SignaturePad({ onInk }) {
    const ref = useRef(null);
    const drawing = useRef(false);
    useEffect(() => {
      const c = ref.current;
      const r = c.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      c.width = r.width * dpr;
      c.height = r.height * dpr;
      const ctx = c.getContext('2d');
      ctx.scale(dpr, dpr);
      ctx.lineWidth = 2.4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#1c1c1e';
    }, []);
    const pos = (e) => {
      const r = ref.current.getBoundingClientRect();
      const sx = ref.current.width / (window.devicePixelRatio || 1) / r.width;
      return [(e.clientX - r.left) * sx, (e.clientY - r.top) * sx];
    };
    const down = (e) => {
      drawing.current = true;
      ref.current.setPointerCapture(e.pointerId);
      const ctx = ref.current.getContext('2d');
      const [x, y] = pos(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
    };
    const move = (e) => {
      if (!drawing.current) return;
      const ctx = ref.current.getContext('2d');
      const [x, y] = pos(e);
      ctx.lineTo(x, y);
      ctx.stroke();
      onInk(true);
    };
    const up = () => { drawing.current = false; };
    const clear = () => {
      const c = ref.current;
      c.getContext('2d').clearRect(0, 0, c.width, c.height);
      onInk(false);
    };
    return html`<div class="sig"><canvas ref=${ref} onPointerDown=${down} onPointerMove=${move} onPointerUp=${up} onPointerCancel=${up}></canvas>
      <span class="sig-line"></span><span class="sig-x">×</span><button class="sig-clear" onClick=${clear}>Ký lại</button></div>`;
  }

  function DeliverySheet({ trip, close }) {
    const app = useApp();
    const t = trip;
    const tanker = t.kind === 'tanker';
    const [vals, setVals] = useState(() => t.lots.map(() => ''));
    const [expl, setExpl] = useState('');
    const [method, setMethod] = useState('signature');
    const [otp, setOtp] = useState('');
    const [ink, setInk] = useState(false);
    const [photo, setPhoto] = useState(false);
    const OTP = '4827';
    const nums = vals.map(parseInt0);
    const errs = nums.map((n, i) => isNaN(n) || n < 0 || n > (t.lots[i].loaded || 0));
    const allIn = nums.every((n) => !isNaN(n));
    const loadedL = R.totals(t).loaded;
    const delivL = nums.reduce((s, n, i) => s + (isNaN(n) ? 0 : n * t.lots[i].unitSize), 0);
    const loss = R.loss(loadedL, delivL);
    const needExpl = allIn && loss.pct > R.LOSS_LIMIT_PCT;
    const confirmed = method === 'otp' ? otp === OTP : method === 'signature' ? ink : photo;
    const ok = allIn && !errs.some(Boolean) && (!needExpl || expl.trim().length >= 5) && confirmed;
    const save = () => {
      const at = fmt.isoLocal(app.now());
      app.mutate((d) => {
        const tr = d.trips.find((x) => x.id === t.id);
        tr.lots.forEach((l, i) => { l.delivered = nums[i]; });
        tr.lossExplanation = needExpl ? expl.trim() : undefined;
        tr.confirm = { method, at };
        tr.status = 'completed';
        tr.completedAt = at;
        tr.events.push({ status: 'completed', at });
      });
      close();
      const late = fmt.minutesOf(fmt.hm(at)) > fmt.minutesOf(t.deliverBy);
      app.ov.toast(late ? 'Đã hoàn tất chuyến (giao trễ hẹn)' : 'Đã hoàn tất chuyến, giao đúng hẹn', late ? 'warning' : 'success');
    };
    return html`<${SheetHeader} title="Xả hàng và xác nhận" onCancel=${close} action="Hoàn tất" disabled=${!ok} onAction=${save} />
      <div class="sheet-body">
        <${Section} header=${tanker ? 'Lượng thực xả từng khoang (lít)' : 'Số lượng thực giao'} action=${html`<button onClick=${() => setVals(t.lots.map((l) => String(l.loaded)))}>Điền theo lượng nạp</button>`}>
          ${t.lots.map((l, i) => html`<${Field} key=${l.no} label=${tanker ? `Khoang ${l.no}` : `Lô ${l.no}`} err=${vals[i] !== '' && errs[i]} unit=${tanker ? 'L' : l.unit}>
            <input id=${'deliv-' + l.no} inputmode="numeric" placeholder=${'Nạp ' + fmt.num(l.loaded || 0)} value=${vals[i]} onInput=${(e) => { const v = [...vals]; v[i] = e.currentTarget.value; setVals(v); }} />
          <//>`)}
        <//>
        <div class="loss-box">
          <div><div class="muted small">Hao hụt</div><div class="big" style=${{ color: !allIn ? 'var(--label3)' : needExpl ? 'var(--red)' : 'var(--green)' }}>${allIn ? fmt.num(loss.liters) + ' L' : '—'}</div></div>
          <div><div class="muted small">Tỷ lệ (cho phép ≤ 0,3%)</div><div class="big" style=${{ color: !allIn ? 'var(--label3)' : needExpl ? 'var(--red)' : 'var(--green)' }}>${allIn ? fmt.num2(loss.pct) + '%' : '—'}</div></div>
        </div>
        ${needExpl && html`<${Section} header="Giải trình hao hụt (bắt buộc)" footer="Hao hụt vượt 0,3% sẽ được điều độ và kế toán xem xét.">
          <textarea class="ta" id="loss-expl" placeholder="Ví dụ: đồng hồ lưu lượng cửa hàng sai số, đã lập biên bản" value=${expl} onInput=${(e) => setExpl(e.currentTarget.value)}></textarea><//>`}
        <div style=${{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div class="section-header" style=${{ margin: '0 16px', padding: '0 16px' }}><span>Người nhận xác nhận · ${t.receiver.name}</span></div>
          <${Seg} options=${[['otp', 'Mã OTP'], ['signature', 'Ký tay'], ['photo', 'Chụp phiếu']]} value=${method} onChange=${setMethod} />
          ${method === 'otp' && html`<${Note} c="blue" icon="phoneDev">Mã đã gửi tới số ${t.receiver.phone}. Bản thử: mã là <b>${OTP}</b>.<//>
            <div class="otp"><input id="otp" inputmode="numeric" maxlength="4" aria-label="Mã OTP" placeholder="••••" style=${{ width: '180px', letterSpacing: '0.4em' }} value=${otp} onInput=${(e) => setOtp(e.currentTarget.value.replace(/\D/g, '').slice(0, 4))} /></div>
            ${otp.length === 4 && otp !== OTP && html`<div class="small" style=${{ color: 'var(--red)', textAlign: 'center' }}>Mã không đúng. Hỏi lại người nhận.</div>`}`}
          ${method === 'signature' && html`<${SignaturePad} onInk=${setInk} /><div class="small muted" style=${{ textAlign: 'center' }}>Đưa máy cho người nhận ký vào khung trên</div>`}
          ${method === 'photo' && html`<${MockPhoto} taken=${photo} onTake=${() => setPhoto(true)} label="Ảnh phiếu giao có chữ ký" />`}
        </div>
      </div>`;
  }

  /* ================= SOS ================= */
  function openSOS(app) {
    app.ov.sheet((close) => html`<${SOSSheet} close=${close} />`);
  }
  const GUIDES = [
    ['droplet', 'Rò rỉ xăng dầu', ['Dừng xe nơi thoáng, xa khu dân cư, tắt máy', 'Cấm lửa, không dùng điện thoại sát chỗ rò', 'Đóng van đáy, chặn dòng chảy bằng cát hoặc vật liệu thấm hút', 'Đặt biển cảnh báo, gọi điều độ và 114 nếu rò lớn']],
    ['flame', 'Cháy xe bồn', ['Tắt máy, ngắt cầu dao điện, rời khỏi cabin', 'Dùng bình bột hoặc bình bọt khi đám cháy còn nhỏ, đứng đầu gió', 'Không dùng nước phun thẳng vào xăng dầu đang cháy', 'Sơ tán người trong bán kính 300 m, gọi 114']],
    ['alert', 'Tai nạn giao thông', ['Bật đèn khẩn cấp, đặt biển cảnh báo cách xe 50–100 m', 'Kiểm tra người bị thương, gọi 115', 'Kiểm tra bồn có rò rỉ không, nếu có làm theo hướng dẫn rò rỉ', 'Giữ nguyên hiện trường, chụp ảnh, báo điều độ và 113']],
  ];
  function SOSSheet({ close }) {
    const app = useApp();
    const [phase, setPhase] = useState('idle');
    const [left, setLeft] = useState(10);
    const [open, setOpen] = useState(-1);
    const d = app.data;
    const cur = d.trips.find((t) => t.date === TODAY && ['loading', 'in_transit', 'unloading'].includes(t.status));
    useEffect(() => {
      if (phase !== 'count') return;
      if (left <= 0) {
        setPhase('sent');
        app.mutate((x) => {
          x.flags.sosSent = true;
          x.requests.unshift({ id: fmt.uid('r'), kind: 'incident', subtype: 'sos', title: 'SOS khẩn cấp', detail: `Vị trí QL51, Long Bình Tân, Biên Hòa · ${cur ? cur.code : 'không trong chuyến'}`, createdAt: fmt.isoLocal(app.now()), status: 'pending' });
        });
        return;
      }
      const id = setTimeout(() => setLeft(left - 1), 1000);
      return () => clearTimeout(id);
    }, [phase, left]);
    const calls = [
      ['flame', 'red', 'Cứu hỏa', '114'], ['heart', 'pink', 'Cấp cứu', '115'], ['shield', 'blue', 'Công an', '113'],
      ['headset', 'teal', `Điều độ · ${d.driver.dispatcher.name}`, d.driver.dispatcher.phone], ['siren', 'orange', 'An toàn (HSE) trực 24/7', '1800 6868'],
    ];
    return html`<${SheetHeader} title="Khẩn cấp" onCancel=${close} cancel="Đóng" />
      <div class="sheet-body">
        <div class="sos-wrap">
          ${phase === 'idle' && html`<button class="sos-btn" onClick=${() => { setLeft(10); setPhase('count'); }}>SOS</button>
            <div class="footnote muted">Bấm để gửi vị trí và thông tin ${cur ? 'chuyến ' + cur.code : 'xe'} cho điều độ và an toàn. Có 10 giây để hủy nếu bấm nhầm.</div>`}
          ${phase === 'count' && html`<div class="countdown">${left}</div><div class="footnote">Sẽ gửi vị trí sau ${left} giây</div>
            <${Btn} v="gray" c="blue" onClick=${() => { setPhase('idle'); app.mutate((x) => { x.flags.sosCancelled = true; }); app.ov.toast('Đã hủy SOS', 'info'); }}>Hủy, tôi bấm nhầm<//>`}
          ${phase === 'sent' && html`<div class="sent"><${Icon} n="check" size=${52} sw=${3} /></div>
            <div style=${{ fontSize: '20px', fontWeight: 700 }}>Đã gửi tín hiệu SOS</div>
            <div class="footnote muted">Đã gửi vị trí QL51, Long Bình Tân, Biên Hòa${cur ? ` và thông tin chuyến ${cur.code} (${R.cargo(cur)})` : ''}. Điều độ sẽ gọi lại cho anh.</div>`}
        </div>
        <${Section} header="Gọi nhanh" footer="Bản thử: nút Gọi mở ứng dụng điện thoại nếu thiết bị cho phép.">
          ${calls.map((c) => html`<${Row} key=${c[3]} icon=${c[0]} c=${c[1]} title=${c[2]} subtitle=${html`<span class="tnum">${c[3]}</span>`} multiline=${true}
            right=${html`<a class="btn small tinted" style=${{ '--c': 'var(--green)' }} href=${'tel:' + c[3].replace(/\s/g, '')}><${Icon} n="phone" size=${15} sw=${2.4} /><span>Gọi</span></a>`} />`)}
        <//>
        <${Section} header="Hướng dẫn xử lý">
          ${GUIDES.map((g, i) => html`<div key=${g[1]}>
            <${Row} icon=${g[0]} c="red" title=${g[1]} onClick=${() => setOpen(open === i ? -1 : i)} right=${html`<span class="chevron"><${Icon} n=${open === i ? 'chevronDown' : 'chevronRight'} size=${17} sw=${2.6} /></span>`} />
            ${open === i && html`<div class="guide"><ol>${g[2].map((s) => html`<li key=${s}>${s}</li>`)}</ol></div>`}
          </div>`)}
        <//>
      </div>`;
  }

  /* ================= Báo sự cố ================= */
  const INCIDENTS = [['breakdown', 'Hỏng xe', 'wrench', 'gray'], ['leak', 'Rò rỉ', 'droplet', 'red'], ['loss', 'Hao hụt', 'tank', 'indigo'], ['seal', 'Sai số chì', 'seal', 'purple'], ['accident', 'Tai nạn', 'alert', 'orange'], ['other', 'Khác', 'more', 'blue']];
  function openIncident(app, preset) {
    app.ov.sheet((close) => html`<${IncidentSheet} close=${close} preset=${preset} />`, { form: true });
  }
  function IncidentSheet({ close, preset }) {
    const app = useApp();
    const [type, setType] = useState(preset || null);
    const [desc, setDesc] = useState('');
    const [photo, setPhoto] = useState(false);
    const cur = app.data.trips.find((t) => t.date === TODAY && ['accepted', 'loading', 'in_transit', 'unloading'].includes(t.status));
    const ok = type && desc.trim().length >= 10;
    const send = () => {
      const label = INCIDENTS.find((x) => x[0] === type)[1];
      app.mutate((d) => {
        d.requests.unshift({ id: fmt.uid('r'), kind: 'incident', subtype: type, title: `Báo sự cố: ${label}`, detail: desc.trim() + (cur ? ` · Chuyến ${cur.code}` : '') + (photo ? ' · có ảnh' : ''), createdAt: fmt.isoLocal(app.now()), status: 'pending' });
      });
      close();
      app.ov.toast('Đã gửi báo cáo tới điều độ và an toàn');
    };
    return html`<${SheetHeader} title="Báo sự cố" onCancel=${close} action="Gửi" disabled=${!ok} onAction=${send} />
      <div class="sheet-body">
        <div class="cat-grid">${INCIDENTS.map((x) => html`<button key=${x[0]} class=${'cat' + (type === x[0] ? ' on' : '')} onClick=${() => setType(x[0])}><${IconTile} n=${x[2]} c=${x[3]} size=${36} /><span>${x[1]}</span></button>`)}</div>
        <${Section} header="Mô tả (ít nhất 10 ký tự)" footer=${cur ? `Tự gắn với chuyến ${cur.code} và vị trí hiện tại.` : 'Tự gắn vị trí hiện tại.'}>
          <textarea class="ta" id="inc-desc" placeholder="Ví dụ: đèn xi nhan phải không sáng, phát hiện khi kiểm tra xe" value=${desc} onInput=${(e) => setDesc(e.currentTarget.value)}></textarea>
        <//>
        <${MockPhoto} taken=${photo} onTake=${() => setPhoto(true)} label="Ảnh hiện trường" />
        ${type === 'leak' && html`<${Note} c="red" icon="alert">Rò rỉ lớn hoặc có nguy cơ cháy: dùng nút SOS thay vì báo cáo này.<//>`}
      </div>`;
  }

  function openCallDispatcher(app) {
    const dsp = app.data.driver.dispatcher;
    app.ov.alert({ title: `Gọi điều độ ${dsp.name}`, message: `Số điện thoại: ${dsp.phone}. Chỉ gọi khi xe đã dừng.`, actions: [{ label: 'Hủy', style: 'cancel' }, { label: 'Gọi', onPress: () => { window.location.href = 'tel:' + dsp.phone.replace(/\s/g, ''); } }] });
  }

  /* ================= Chấm công & KPI ================= */
  function AttendanceScreen() {
    const app = useApp();
    const [seg, setSeg] = useSticky('att.seg', 'sheet');
    return html`<${Screen} title=${seg === 'kpi' ? 'KPI' : 'Chấm công'} right=${html`<${TabRight} />`}>
      <${Seg} options=${[['sheet', 'Bảng công'], ['kpi', 'KPI']]} value=${seg} onChange=${setSeg} />
      ${seg === 'sheet' ? html`<${Timesheet} />` : html`<${KpiView} />`}
    <//>`;
  }

  function Timesheet() {
    const app = useApp();
    const d = app.data;
    const [sel, setSel] = useState(TODAY);
    const stats = R.attendanceStats(d.attendance, MONTH);
    const first = new Date(2026, 10, 1);
    const offset = (first.getDay() + 6) % 7;
    const cells = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let day = 1; day <= 30; day++) cells.push(`2026-11-${String(day).padStart(2, '0')}`);
    const recOf = (date) => d.attendance.find((a) => a.date === date);
    const r = recOf(sel);
    const s = r && r.in ? R.clockIn(r.in) : null;
    const le = r && r.out ? R.leftEarly(r.out) : null;
    const workMin = r && r.in && r.out ? fmt.minutesOf(r.out) - fmt.minutesOf(r.in) : null;
    const canExplain = r && ((s && s.mark === 'late') || (le && le.early)) && !r.explanation;
    const isSunday = fmt.parseDate(sel).getDay() === 0;
    return html`<${AttendanceCard} />
      <div class="stat4">
        <div><b>${stats.workdays}</b><span>Ngày công</span></div>
        <div><b style=${{ color: 'var(--green)' }}>${stats.early}</b><span>Đến sớm</span></div>
        <div><b style=${{ color: 'var(--red)' }}>${stats.late}</b><span>Đi muộn</span></div>
        <div><b style=${{ color: 'var(--orange)' }}>${stats.leftEarly}</b><span>Về sớm</span></div>
      </div>
      <div class="cal">
        <div class="cal-head"><span>Tháng 11, 2026</span><span class="small muted">Ca ${R.SHIFT.start} – ${R.SHIFT.end} · ±${R.SHIFT.tolerance} phút</span></div>
        <div class="cal-grid">
          ${['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((x) => html`<div key=${x} class="cal-dow">${x}</div>`)}
          ${cells.map((date, i) => {
            if (!date) return html`<div key=${'b' + i}></div>`;
            const rec = recOf(date);
            const st = rec && rec.in ? R.clockIn(rec.in) : null;
            const lft = rec && rec.out ? R.leftEarly(rec.out) : null;
            const dots = [];
            if (st) dots.push(st.mark === 'early' ? 'green' : st.mark === 'late' ? 'red' : 'blue');
            if (lft && lft.early) dots.push('orange');
            const sun = fmt.parseDate(date).getDay() === 0;
            return html`<button key=${date} class=${'cal-day' + (date === TODAY ? ' today' : '') + (date === sel ? ' sel' : '') + (sun ? ' off' : '')} onClick=${() => setSel(date)}>
              <span class="num">${Number(date.slice(8))}</span><span class="dots">${dots.map((c, j) => html`<i key=${j} style=${{ background: cv(c) }}></i>`)}</span></button>`;
          })}
        </div>
        <div class="legend"><span><i style=${{ background: 'var(--green)' }}></i>Đến sớm</span><span><i style=${{ background: 'var(--blue)' }}></i>Đúng giờ</span><span><i style=${{ background: 'var(--red)' }}></i>Đi muộn</span><span><i style=${{ background: 'var(--orange)' }}></i>Về sớm</span></div>
      </div>
      <${Section} header=${`${fmt.weekday(sel)}, ${fmt.dmy(sel)}`}>
        ${r && r.in
          ? html`<${Row} icon="logIn" c="blue" title="Giờ vào" value=${r.in} right=${s && html`<${Pill} c=${s.mark === 'late' ? 'red' : s.mark === 'early' ? 'green' : 'blue'}>${s.label}<//>`} />
            <${Row} icon="logOut" c="indigo" title="Giờ ra" value=${r.out || (sel === TODAY ? 'Đang làm' : '—')} right=${le && le.early && html`<${Pill} c="orange">Về sớm ${le.minutes} phút<//>`} />
            ${workMin != null && html`<${Row} icon="timer" c="gray" title="Thời gian làm" value=${fmt.duration(workMin)} />`}
            ${r.explanation && html`<${Row} icon="message" c="teal" title="Giải trình đã gửi" subtitle=${r.explanation} multiline=${true} />`}
            ${canExplain && html`<${Row} icon="send" c="orange" title="Gửi giải trình" accent=${true} chevron=${true} onClick=${() => app.ov.sheet((close) => html`<${ExplainSheet} date=${sel} close=${close} />`, { form: true })} />`}`
          : html`<${Row} icon="calendar" c="gray" title=${isSunday ? 'Ngày nghỉ (Chủ Nhật)' : sel > TODAY ? 'Chưa tới ngày' : 'Không có dữ liệu chấm công'} />`}
      <//>`;
  }

  function ExplainSheet({ date, close }) {
    const app = useApp();
    const r = app.data.attendance.find((a) => a.date === date);
    const s = R.clockIn(r.in);
    const le = r.out ? R.leftEarly(r.out) : null;
    const [text, setText] = useState('');
    const what = s.mark === 'late' ? `Đi muộn ${fmt.minutesOf(r.in) - fmt.minutesOf(R.SHIFT.start)} phút (vào ${r.in})` : `Về sớm ${le.minutes} phút (ra ${r.out})`;
    const send = () => {
      app.mutate((d) => {
        d.attendance.find((a) => a.date === date).explanation = text.trim();
        d.requests.unshift({ id: fmt.uid('r'), kind: 'attendance', title: `Giải trình ${fmt.dm(date)}`, detail: `${what}. ${text.trim()}`, createdAt: fmt.isoLocal(app.now()), status: 'pending' });
      });
      close();
      app.ov.toast('Đã gửi giải trình, chờ quản lý duyệt');
    };
    return html`<${SheetHeader} title="Gửi giải trình" onCancel=${close} action="Gửi" disabled=${text.trim().length < 10} onAction=${send} />
      <div class="sheet-body">
        <${Note} c="orange" icon="clock">${fmt.weekday(date)}, ${fmt.dmy(date)}: ${what}.<//>
        <${Section} header="Lý do (ít nhất 10 ký tự)" footer="Quản lý đội sẽ xem và duyệt. Kết quả hiện trong mục Yêu cầu đã gửi.">
          <textarea class="ta" id="explain" placeholder="Ví dụ: kẹt xe do tai nạn trên cầu Phú Mỹ, đã báo điều độ lúc 05:40" value=${text} onInput=${(e) => setText(e.currentTarget.value)}></textarea>
        <//>
      </div>`;
  }

  function KpiView() {
    const app = useApp();
    const d = app.data;
    const k = R.kpi(d, MONTH);
    const inc = R.income(d, MONTH);
    const tierC = k.total >= 90 ? 'green' : k.total >= 80 ? 'blue' : k.total >= 70 ? 'orange' : 'red';
    const hist = [...d.kpiHistory, { month: MONTH, score: k.total }];
    return html`<div class="card">
        <div class="kpi-hero">
          <${Ring} v=${k.total / 100} size=${104} stroke=${11} c=${tierC}><div><div class="score">${fmt.num1(k.total)}</div><div class="of">/ 100 điểm</div></div><//>
          <div class="grow" style=${{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div><${Pill} c=${tierC} solid=${true}>${k.grade}<//></div>
            <div class="footnote">Thưởng dự kiến <b>${fmt.money(k.bonus)}</b></div>
            ${k.next ? html`<div class="small muted">Còn <b style=${{ color: 'var(--label)' }}>${fmt.num1(k.next.gap)} điểm</b> để lên ${k.next.grade} (${fmt.money(k.next.bonus)})</div>
              <${Bar} v=${k.total / k.next.min} c=${tierC} />` : html`<div class="small muted">Đã đạt mức thưởng cao nhất</div>`}
          </div>
        </div>
        <div class="small muted">Tạm tính tháng 11 đến ${fmt.dm(TODAY)}. Thu nhập dự kiến ${fmt.money(inc.net)}.</div>
      </div>
      <${Section} header="Chỉ tiêu · chạm để xem cách tính">
        ${k.items.map((it) => html`<${Row} key=${it.key} icon=${it.icon} c=${it.color} multiline=${true} chevron=${true}
          onClick=${() => app.ov.sheet((close) => html`<${KpiDetail} item=${it} close=${close} />`)}
          title=${html`<span class="flex" style=${{ justifyContent: 'space-between' }}><span>${it.name}</span><b class="tnum">${fmt.num1(it.score)}</b></span>`}
          subtitle=${html`<div style=${{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}><${Bar} v=${it.score / 100} c=${it.score >= 90 ? 'green' : it.score >= 80 ? 'blue' : 'orange'} />
            <span class="small">Trọng số ${it.weight}% · đóng góp ${fmt.num1((it.score * it.weight) / 100)} điểm${it.source === 'mock' ? ' · dữ liệu mẫu' : ''}</span></div>`} />`)}
      <//>
      <${Section} header="4 tháng gần nhất">
        <div style=${{ padding: '18px 12px 12px' }}>
          <div class="bars-wrap">
            <div class="goal" style=${{ bottom: 'calc(22px + 0.9 * 102px)' }}><b>Xuất sắc 90</b></div>
            <div class="bars">${hist.map((h) => html`<div key=${h.month} class=${'bar' + (h.month === MONTH ? ' cur' : '')}>
              <span class="v">${fmt.num1(h.score)}</span><span class="col" style=${{ height: `calc(${h.score / 100} * 102px)` }}></span><span class="m">${'T' + Number(h.month.slice(5))}</span></div>`)}</div>
          </div>
        </div>
      <//>
      <div style=${{ margin: '0 16px' }}><${Btn} v="gray" c="blue" icon="message" onClick=${() => app.ov.sheet((close) => html`<${KpiAppealSheet} close=${close} items=${k.items} />`, { form: true })}>Khiếu nại KPI<//></div>`;
  }

  function KpiDetail({ item, close }) {
    return html`<${SheetHeader} title=${item.name} onCancel=${close} cancel="Đóng" />
      <div class="sheet-body">
        <div class="result"><div class="big tnum">${fmt.num1(item.score)}</div><div class="muted">điểm · trọng số ${item.weight}% · đóng góp ${fmt.num1((item.score * item.weight) / 100)} điểm</div></div>
        <${Section} header="Cách tính"><div class="reading" style=${{ margin: 0, borderRadius: 0 }}>${item.formula}</div><//>
        <${Section} header="Số liệu tháng 11" footer=${item.source === 'app' ? 'Tính tự động từ dữ liệu chuyến và chấm công trong app. Cập nhật mỗi khi anh hoàn tất chuyến.' : 'Dữ liệu mẫu. Bản thật lấy từ thiết bị giám sát hành trình của xe.'}>
          ${item.lines.map((l) => html`<${Row} key=${l[0]} title=${l[0]} value=${String(l[1])} />`)}
        <//>
      </div>`;
  }

  function KpiAppealSheet({ close, items }) {
    const app = useApp();
    const [key, setKey] = useState(null);
    const [text, setText] = useState('');
    const [photo, setPhoto] = useState(false);
    const send = () => {
      const it = items.find((x) => x.key === key);
      app.mutate((d) => {
        d.requests.unshift({ id: fmt.uid('r'), kind: 'kpi', title: `Khiếu nại KPI: ${it.name}`, detail: text.trim() + (photo ? ' · có bằng chứng' : ''), createdAt: fmt.isoLocal(app.now()), status: 'pending' });
      });
      close();
      app.ov.toast('Đã gửi khiếu nại KPI');
    };
    return html`<${SheetHeader} title="Khiếu nại KPI" onCancel=${close} action="Gửi" disabled=${!key || text.trim().length < 10} onAction=${send} />
      <div class="sheet-body">
        <${Section} header="Chỉ tiêu cần xem lại">
          ${items.map((it) => html`<${Row} key=${it.key} icon=${it.icon} c=${it.color} title=${it.name} value=${fmt.num1(it.score)} onClick=${() => setKey(it.key)} right=${key === it.key && html`<${Icon} n="check" size=${20} sw=${2.6} color="var(--blue)" />`} />`)}
        <//>
        <${Section} header="Lý do (ít nhất 10 ký tự)" footer="Hạn khiếu nại: 3 ngày sau khi chốt KPI tháng.">
          <textarea class="ta" id="kpi-appeal" placeholder="Ví dụ: chuyến 04/11 giao trễ do cửa hàng chưa mở cổng" value=${text} onInput=${(e) => setText(e.currentTarget.value)}></textarea>
        <//>
        <${MockPhoto} taken=${photo} onTake=${() => setPhoto(true)} label="Ảnh bằng chứng" />
      </div>`;
  }

  /* ================= Tài chính ================= */
  function openExpense(app) {
    app.ov.sheet((close) => html`<${ExpenseSheet} close=${close} />`, { form: true });
  }
  const STATUS_EXP = { pending: ['Chờ duyệt', 'orange'], approved: ['Đã duyệt', 'green'], rejected: ['Từ chối', 'red'] };

  function FinanceScreen() {
    const app = useApp();
    const [seg, setSeg] = useSticky('fin.seg', 'exp');
    return html`<${Screen} title="Tài chính" right=${html`<${TabRight} extra=${seg === 'exp' && html`<button class="nav-btn" aria-label="Thêm khoản chi" onClick=${() => openExpense(app)}><${Icon} n="plus" size=${26} sw=${2.4} /></button>`} />`}>
      <${Seg} options=${[['exp', 'Chi phí'], ['pay', 'Lương và tạm ứng']]} value=${seg} onChange=${setSeg} />
      ${seg === 'exp' ? html`<${Expenses} />` : html`<${Payroll} />`}
    <//>`;
  }

  function Expenses() {
    const app = useApp();
    const [filter, setFilter] = useSticky('fin.filter', 'all');
    const all = app.data.expenses.filter((e) => e.date.startsWith(MONTH));
    const counted = all.filter((e) => e.status !== 'rejected');
    const total = counted.reduce((s, e) => s + e.amount, 0);
    const byCat = Object.keys(R.EXPENSE_CATS).map((k) => [k, counted.filter((e) => e.category === k).reduce((s, e) => s + e.amount, 0)]).filter((x) => x[1] > 0);
    const pend = all.filter((e) => e.status === 'pending').reduce((s, e) => s + e.amount, 0);
    const appr = all.filter((e) => e.status === 'approved').reduce((s, e) => s + e.amount, 0);
    const list = all.filter((e) => filter === 'all' || e.category === filter).sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
    const days = [...new Set(list.map((e) => e.date))];
    return html`<div class="card">
        <div><div class="muted small">Tổng chi tháng 11 (không tính khoản bị từ chối)</div><div class="big-time" style=${{ fontSize: '34px' }}>${fmt.money(total)}</div></div>
        <div class="cat-bar">${byCat.map(([k, v]) => html`<span key=${k} style=${{ flex: v, background: cv(R.EXPENSE_CATS[k][2]) }}></span>`)}</div>
        <div class="legend" style=${{ padding: 0 }}>${byCat.map(([k, v]) => html`<span key=${k}><i style=${{ background: cv(R.EXPENSE_CATS[k][2]) }}></i>${R.EXPENSE_CATS[k][0]} ${Math.round((v / total) * 100)}%</span>`)}</div>
        <div class="flex"><div class="grow"><div class="muted small">Chờ duyệt</div><b class="tnum" style=${{ color: 'var(--orange)' }}>${fmt.money(pend)}</b></div><div class="grow"><div class="muted small">Đã duyệt</div><b class="tnum" style=${{ color: 'var(--green)' }}>${fmt.money(appr)}</b></div></div>
      </div>
      <div class="chips">
        <button class=${'chip' + (filter === 'all' ? ' on' : '')} onClick=${() => setFilter('all')}>Tất cả</button>
        ${Object.entries(R.EXPENSE_CATS).map(([k, c]) => html`<button key=${k} class=${'chip' + (filter === k ? ' on' : '')} onClick=${() => setFilter(k)}>${c[0]}</button>`)}
      </div>
      ${days.length === 0 && html`<${Empty} icon="wallet" title="Chưa có khoản chi" text="Bấm dấu + để thêm khoản chi." />`}
      ${days.map((day) => html`<${Section} key=${day} header=${`${fmt.weekday(day)}, ${fmt.dm(day)}`}>
        ${list.filter((e) => e.date === day).map((e) => {
          const c = R.EXPENSE_CATS[e.category];
          const st = STATUS_EXP[e.status];
          return html`<${Row} key=${e.id} icon=${c[1]} c=${c[2]} title=${e.title} multiline=${true} chevron=${true}
            subtitle=${html`${e.place} · ${e.time}${e.status === 'rejected' && html`<br /><span style=${{ color: 'var(--red)' }}>${e.rejectReason}</span>`}`}
            right=${html`<div style=${{ textAlign: 'right' }}><div class="tnum" style=${{ fontWeight: 600 }}>${fmt.money(e.amount)}</div><div class="small" style=${{ color: cv(st[1]), fontWeight: 600 }}>${st[0]}</div></div>`}
            onClick=${() => app.ov.sheet((close) => html`<${ExpenseDetail} id=${e.id} close=${close} />`)} />`;
        })}
      <//>`)}`;
  }

  function ExpenseDetail({ id, close }) {
    const app = useApp();
    const e = app.data.expenses.find((x) => x.id === id);
    if (!e) return null;
    const c = R.EXPENSE_CATS[e.category];
    const st = STATUS_EXP[e.status];
    const trip = e.tripId && app.data.trips.find((t) => t.id === e.tripId);
    const withdraw = () => app.ov.alert({
      title: 'Thu hồi khoản chi?', message: `${e.title} · ${fmt.money(e.amount)} sẽ bị xóa khỏi danh sách chờ duyệt.`,
      actions: [{ label: 'Không', style: 'cancel' }, { label: 'Thu hồi', style: 'destructive', onPress: () => { close(); app.mutate((d) => { d.expenses = d.expenses.filter((x) => x.id !== id); }); app.ov.toast('Đã thu hồi khoản chi', 'info'); } }],
    });
    return html`<${SheetHeader} title="Chi tiết khoản chi" onCancel=${close} cancel="Đóng" />
      <div class="sheet-body">
        <div class="result"><${IconTile} n=${c[1]} c=${c[2]} size=${44} /><div class="big tnum">${fmt.money(e.amount)}</div><div>${e.title}</div><${Pill} c=${st[1]}>${st[0]}<//></div>
        <${Section}>
          <${Row} title="Loại" value=${c[0]} />
          <${Row} title="Thời gian" value=${`${e.time} · ${fmt.dmy(e.date)}`} />
          <${Row} title="Nơi chi" value=${e.place} />
          ${e.liters && html`<${Row} title="Số lít" value=${`${fmt.num1(e.liters)} L × ${fmt.money(e.unitPrice)}`} />`}
          ${e.odometer && html`<${Row} title="Số km đồng hồ" value=${fmt.num(e.odometer)} />`}
          ${trip && html`<${Row} title="Chuyến" value=${trip.code} />`}
          <${Row} title="Hóa đơn" value=${e.hasInvoice ? (e.vat ? 'Có, hóa đơn VAT' : 'Có') : 'Không có'} />
          ${e.explanation && html`<${Row} title="Giải trình" subtitle=${e.explanation} multiline=${true} />`}
          ${e.rejectReason && html`<${Row} title="Lý do từ chối" subtitle=${e.rejectReason} multiline=${true} />`}
        <//>
        ${e.status === 'pending' && html`<${Section} footer="Chỉ thu hồi được khi khoản chi còn chờ duyệt."><${Row} title="Thu hồi khoản chi" destructive=${true} onClick=${withdraw} /><//>`}
      </div>`;
  }

  function ExpenseSheet({ close }) {
    const app = useApp();
    const d = app.data;
    const [cat, setCat] = useState(null);
    const [amount, setAmount] = useState('');
    const [liters, setLiters] = useState('');
    const [price, setPrice] = useState('20850');
    const [odo, setOdo] = useState('');
    const [title, setTitle] = useState('');
    const [place, setPlace] = useState('');
    const [tripId, setTripId] = useState(() => {
      const cur = d.trips.find((t) => t.date === TODAY && ['loading', 'in_transit', 'unloading'].includes(t.status));
      return cur ? cur.id : '';
    });
    const [photo, setPhoto] = useState(false);
    const [vat, setVat] = useState(false);
    const [expl, setExpl] = useState('');
    const fuel = cat === 'fuel';
    const L = parseDec(liters), P = parseInt0(price), O = parseInt0(odo);
    const amt = fuel ? (isNaN(L) || isNaN(P) ? NaN : Math.round(L * P)) : parseInt0(amount);
    const mealToday = d.expenses.filter((e) => e.date === TODAY && e.category === 'meal' && e.status !== 'rejected').reduce((s, e) => s + e.amount, 0);
    const overMeal = cat === 'meal' && !isNaN(amt) && mealToday + amt > R.MEAL_LIMIT;
    const noInvoiceBlocked = !photo && !isNaN(amt) && amt >= R.NO_INVOICE_LIMIT;
    const recentTrips = d.trips.filter((t) => t.date <= TODAY && t.date >= '2026-11-10' && t.status !== 'rejected' && t.status !== 'pending').sort((a, b) => (b.date + b.pickupTime).localeCompare(a.date + a.pickupTime));
    const ok = cat && !isNaN(amt) && amt > 0 && (!fuel || (L > 0 && P > 0 && O > 0)) && !noInvoiceBlocked && (!overMeal || expl.trim().length >= 5);
    const save = () => {
      const now = app.now();
      app.mutate((x) => {
        x.expenses.unshift({
          id: fmt.uid('e'), date: TODAY, time: fmt.hmOf(now), category: cat, title: title.trim() || R.EXPENSE_CATS[cat][0], place: place.trim() || 'Chưa ghi nơi chi',
          amount: amt, status: 'pending', hasInvoice: photo, vat: photo && vat, tripId: tripId || undefined,
          liters: fuel ? L : undefined, unitPrice: fuel ? P : undefined, odometer: fuel ? O : undefined, explanation: overMeal ? expl.trim() : undefined,
        });
      });
      close();
      app.ov.toast(`Đã gửi ${fmt.money(amt)}, chờ duyệt`);
    };
    return html`<${SheetHeader} title="Thêm khoản chi" onCancel=${close} action="Gửi" disabled=${!ok} onAction=${save} />
      <div class="sheet-body">
        <div class="cat-grid">${Object.entries(R.EXPENSE_CATS).map(([k, c]) => html`<button key=${k} class=${'cat' + (cat === k ? ' on' : '')} onClick=${() => setCat(k)}><${IconTile} n=${c[1]} c=${c[2]} size=${36} /><span>${c[0]}</span></button>`)}</div>
        ${cat && html`
          ${fuel
            ? html`<${Section} header="Nhiên liệu" footer="Thành tiền = số lít × đơn giá, tự tính.">
                <${Field} label="Số lít" unit="L"><input id="exp-liters" inputmode="decimal" placeholder="120" value=${liters} onInput=${(e) => setLiters(e.currentTarget.value)} /><//>
                <${Field} label="Đơn giá" unit="₫/L"><input id="exp-price" inputmode="numeric" value=${price} onInput=${(e) => setPrice(e.currentTarget.value)} /><//>
                <${Field} label="Km đồng hồ" unit="km"><input id="exp-odo" inputmode="numeric" placeholder="184.950" value=${odo} onInput=${(e) => setOdo(e.currentTarget.value)} /><//>
                <${Row} title="Thành tiền" value=${html`<b style=${{ color: 'var(--label)' }}>${isNaN(amt) ? '—' : fmt.money(amt)}</b>`} />
              <//>`
            : html`<${Section} header="Số tiền">
                <${Field} label="Số tiền" unit="₫"><input id="exp-amount" inputmode="numeric" placeholder="60.000" value=${amount} onInput=${(e) => setAmount(e.currentTarget.value)} /><//>
              <//>`}
          <${Section} header="Thông tin">
            <${Field} label="Nội dung"><input id="exp-title" placeholder=${{ meal: 'Cơm trưa', toll: 'Phí BOT', parking: 'Phí đỗ xe', repair: 'Thay bóng đèn', other: 'Rửa xe', fuel: 'Đổ dầu DO' }[cat]} value=${title} onInput=${(e) => setTitle(e.currentTarget.value)} /><//>
            <${Field} label="Nơi chi"><input id="exp-place" placeholder="Tên quán, trạm" value=${place} onInput=${(e) => setPlace(e.currentTarget.value)} /><//>
            <${Field} label="Chuyến"><select id="exp-trip" value=${tripId} onChange=${(e) => setTripId(e.currentTarget.value)} style=${{ textAlignLast: 'right' }}>
              <option value="">Không gắn chuyến</option>
              ${recentTrips.map((t) => html`<option key=${t.id} value=${t.id}>${t.code} · ${t.dest.name}</option>`)}
            </select><//>
          <//>
          <div style=${{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div class="section-header" style=${{ margin: '0 16px' }}><span>Hóa đơn</span></div>
            <${MockPhoto} taken=${photo} onTake=${() => setPhoto(true)} label="Ảnh hóa đơn" />
          </div>
          <${Section}><${Row} title="Hóa đơn VAT" right=${html`<${Switch} on=${vat && photo} label="Hóa đơn VAT" onChange=${(v) => { if (photo) setVat(v); else app.ov.toast('Chụp hóa đơn trước khi đánh dấu VAT', 'info'); }} />`} /><//>
          ${noInvoiceBlocked && html`<${Note} c="red" icon="alert">Khoản chi từ ${fmt.money(R.NO_INVOICE_LIMIT)} trở lên bắt buộc có hóa đơn. Chụp hóa đơn để gửi.<//>`}
          ${!photo && !isNaN(amt) && amt > 0 && amt < R.NO_INVOICE_LIMIT && html`<${Note} c="gray" icon="info">Không có hóa đơn chỉ được chấp nhận với khoản dưới ${fmt.money(R.NO_INVOICE_LIMIT)}.<//>`}
          ${overMeal && html`<${Note} c="orange" icon="alert">Hôm nay đã chi ăn uống ${fmt.money(mealToday)}. Thêm khoản này sẽ vượt định mức ${fmt.money(R.MEAL_LIMIT)}/ngày, cần giải trình.<//>
            <${Section} header="Giải trình vượt định mức"><textarea class="ta" id="exp-expl" placeholder="Ví dụ: chạy 2 chuyến, ăn 2 bữa" value=${expl} onInput=${(e) => setExpl(e.currentTarget.value)}></textarea><//>`}
        `}
        ${!cat && html`<div class="small muted" style=${{ textAlign: 'center' }}>Chọn loại chi phí để bắt đầu</div>`}
      </div>`;
  }

  function Payroll() {
    const app = useApp();
    const d = app.data;
    const inc = R.income(d, MONTH);
    return html`<div class="wallet">
        <div class="w-top"><span>Thực nhận dự kiến</span><span>Tháng 11/2026</span></div>
        <div class="w-amt">${fmt.money(inc.net)}</div>
        <div class="w-foot"><span>${d.driver.name} · ${d.driver.code}</span><span>Tạm tính đến ${fmt.dm(TODAY)}</span></div>
      </div>
      <${Section} header=${`Thu nhập · ${fmt.money(inc.gross)}`}>
        ${inc.income.map((i) => html`<${Row} key=${i[0]} title=${i[0]} subtitle=${i[2] || null} value=${fmt.money(i[1])} multiline=${!!i[2]} />`)}
      <//>
      <${Section} header=${`Khấu trừ · ${fmt.money(inc.ded)}`}>
        ${inc.deductions.map((i) => html`<${Row} key=${i[0]} title=${i[0]} subtitle=${i[2]} multiline=${true} value=${html`<span style=${{ color: 'var(--red)' }}>−${fmt.money(i[1])}</span>`} />`)}
      <//>
      <${Section} header="Tạm ứng">
        ${d.advances.map((a) => html`<${Row} key=${a.id} icon="banknote" c="green" title=${fmt.money(a.amount)} subtitle=${`${fmt.dmy(a.date)} · ${a.reason}`} multiline=${true} right=${html`<${Pill} c=${STATUS_EXP[a.status][1]}>${STATUS_EXP[a.status][0]}<//>`} />`)}
        <${Row} icon="plus" c="blue" title="Xin tạm ứng" accent=${true} chevron=${true} onClick=${() => app.ov.sheet((close) => html`<${AdvanceSheet} close=${close} />`, { form: true })} />
      <//>`;
  }

  function AdvanceSheet({ close }) {
    const app = useApp();
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const a = parseInt0(amount);
    const err = !isNaN(a) && (a < 100000 || a > 5000000);
    const ok = !isNaN(a) && !err && reason.trim().length >= 5;
    const send = () => {
      app.mutate((d) => {
        d.advances.unshift({ id: fmt.uid('a'), date: TODAY, amount: a, reason: reason.trim(), status: 'pending' });
        d.requests.unshift({ id: fmt.uid('r'), kind: 'advance', title: `Xin tạm ứng ${fmt.money(a)}`, detail: reason.trim(), createdAt: fmt.isoLocal(app.now()), status: 'pending' });
      });
      close();
      app.ov.toast('Đã gửi đề nghị tạm ứng');
    };
    return html`<${SheetHeader} title="Xin tạm ứng" onCancel=${close} action="Gửi" disabled=${!ok} onAction=${send} />
      <div class="sheet-body">
        <${Section} footer="Từ 100.000 ₫ đến 5.000.000 ₫. Khoản tạm ứng được trừ khi quyết toán cuối tháng.">
          <${Field} label="Số tiền" unit="₫" err=${err}><input id="adv-amount" inputmode="numeric" placeholder="1.000.000" value=${amount} onInput=${(e) => setAmount(e.currentTarget.value)} /><//>
        <//>
        <${Section} header="Lý do"><textarea class="ta" id="adv-reason" placeholder="Ví dụ: chi phí cầu đường, ăn uống chuyến Long An" value=${reason} onInput=${(e) => setReason(e.currentTarget.value)}></textarea><//>
      </div>`;
  }

  /* ================= Học tập ================= */
  function LearningScreen() {
    const app = useApp();
    const [seg, setSeg] = useSticky('learn.seg', 'courses');
    return html`<${Screen} title="Học tập" right=${html`<${TabRight} />`}>
      <${Seg} options=${[['courses', 'Khóa học'], ['certs', 'Chứng chỉ']]} value=${seg} onChange=${setSeg} />
      ${seg === 'courses' ? html`<${Courses} />` : html`<${Certificates} />`}
    <//>`;
  }

  function CourseCard({ c }) {
    const app = useApp();
    const p = R.courseProgress(c);
    const days = c.deadline ? fmt.daysBetween(TODAY, c.deadline) : null;
    const done = p.done === p.total;
    return html`<button class="course-card" onClick=${() => app.nav.push('course', { id: c.id })}>
      <${IconTile} n=${c.icon} c=${c.color} size=${44} />
      <div class="grow">
        <div class="course-title">${c.title}</div>
        <${Bar} v=${p.pct} c=${done ? 'green' : c.color} />
        <div class="small muted">${p.done}/${p.total} bài${c.deadline ? html` · <span style=${{ color: done ? 'var(--label2)' : cv(R.tone(days)), fontWeight: 600 }}>Hạn ${fmt.dm(c.deadline)}${!done ? ` (còn ${days} ngày)` : ''}</span>` : ''}${done ? ' · Hoàn thành' : ''}</div>
      </div>
      <span class="chevron"><${Icon} n="chevronRight" size=${17} sw=${2.6} /></span>
    </button>`;
  }

  function Courses() {
    const app = useApp();
    const d = app.data;
    const m = R.learnMinutes(d, MONTH);
    return html`<div class="card"><div class="flex" style=${{ gap: '16px' }}>
        <${Ring} v=${m / R.LEARNING_TARGET_MIN} size=${84} stroke=${10} c="purple"><div><b style=${{ fontSize: '20px' }}>${fmt.num1(m / 60)}</b><div class="small muted">giờ</div></div><//>
        <div class="grow"><div style=${{ fontWeight: 600 }}>Giờ học tháng 11</div><div class="small muted">Mục tiêu 8 giờ/tháng. Gồm ${fmt.duration(d.offlineLearningMinutes)} lớp tập trung PCCC ngày 05/11.</div></div>
      </div></div>
      <div><div class="section-header plain" style=${{ margin: '0 16px' }}><span>Bắt buộc</span></div>
        <div style=${{ display: 'flex', flexDirection: 'column', gap: '10px' }}>${d.courses.filter((c) => c.required).map((c) => html`<${CourseCard} key=${c.id} c=${c} />`)}</div></div>
      <div><div class="section-header plain" style=${{ margin: '0 16px' }}><span>Tự chọn</span></div>
        <div style=${{ display: 'flex', flexDirection: 'column', gap: '10px' }}>${d.courses.filter((c) => !c.required).map((c) => html`<${CourseCard} key=${c.id} c=${c} />`)}</div></div>`;
  }

  function Certificates() {
    const app = useApp();
    const d = app.data;
    const renew = (c) => {
      app.mutate((x) => {
        x.certificates.find((y) => y.id === c.id).renewalRequested = true;
        x.requests.unshift({ id: fmt.uid('r'), kind: 'renewal', title: `Đăng ký gia hạn: ${c.name}`, detail: `Số ${c.number}, hết hạn ${fmt.dmy(c.expires)}`, createdAt: fmt.isoLocal(app.now()), status: 'pending' });
      });
      app.ov.toast('Đã đăng ký gia hạn. HR sẽ xếp lịch.');
    };
    return html`${d.certificates.map((c) => {
      const days = fmt.daysBetween(TODAY, c.expires);
      const tone = R.tone(days);
      return html`<${Section} key=${c.id}>
        <${Row} icon="idcard" c=${tone === 'green' ? 'blue' : tone} title=${c.name} subtitle=${html`Số <span class="tnum">${c.number}</span> · ${c.issuer}`} multiline=${true} />
        <${Row} title="Hết hạn" value=${fmt.dmy(c.expires)} right=${html`<${Pill} c=${tone}>Còn ${fmt.num(days)} ngày<//>`} />
        ${days <= 90 && (c.renewalRequested
          ? html`<${Row} icon="check" c="green" title="Đã đăng ký gia hạn" subtitle="HR sẽ báo lịch học/thi lại" multiline=${true} />`
          : html`<${Row} title="Đăng ký gia hạn" accent=${true} chevron=${true} onClick=${() => renew(c)} />`)}
      <//>`;
    })}`;
  }

  function CourseScreen({ id }) {
    const app = useApp();
    const c = app.data.courses.find((x) => x.id === id);
    const p = R.courseProgress(c);
    const open = (l) => {
      if (l.kind === 'quiz') app.ov.sheet((close) => html`<${QuizSheet} courseId=${c.id} lessonId=${l.id} close=${close} />`, { form: true });
      else app.ov.sheet((close) => html`<${LessonSheet} courseId=${c.id} lessonId=${l.id} close=${close} />`, { form: true });
    };
    const KIND = { video: ['play', 'Video'], reading: ['book', 'Bài đọc'], quiz: ['help', 'Kiểm tra'] };
    return html`<${Screen} title=${c.title} large=${false} back=${useBack()}>
      <div class="card" style=${{ marginTop: '4px' }}>
        <div class="flex"><${IconTile} n=${c.icon} c=${c.color} size=${48} /><div class="grow"><div class="course-title" style=${{ fontSize: '20px', lineHeight: '25px' }}>${c.title}</div>
          <div class="flex" style=${{ gap: '6px', marginTop: '4px' }}>${c.required ? html`<${Pill} c="red">Bắt buộc<//>` : html`<${Pill} c="gray">Tự chọn<//>`}${c.deadline && html`<${Pill} c=${R.tone(fmt.daysBetween(TODAY, c.deadline))}>Hạn ${fmt.dmy(c.deadline)}<//>`}</div></div></div>
        <div class="footnote muted">${c.description}</div>
        <${Bar} v=${p.pct} c=${p.done === p.total ? 'green' : c.color} h=${8} />
        <div class="small muted">${p.done}/${p.total} bài đã học</div>
      </div>
      <${Section} header="Bài học">
        ${c.lessons.map((l) => html`<${Row} key=${l.id} icon=${KIND[l.kind][0]} c=${l.doneAt ? 'green' : 'blue'} title=${l.title} multiline=${true}
          subtitle=${`${KIND[l.kind][1]} · ${l.minutes} phút${l.doneAt ? ' · đã học ' + fmt.dm(l.doneAt) : ''}${l.bestScore != null ? ` · ${l.bestScore}/3 câu đúng` : ''}`}
          right=${l.doneAt && html`<${Icon} n="check" size=${20} sw=${2.8} color="var(--green)" />`} chevron=${true} onClick=${() => open(l)} />`)}
      <//>
    <//>`;
  }

  const READING = {
    'adr-2': ['Xe chở xăng dầu phải có biển cảnh báo màu cam ở đầu và đuôi xe, ghi số nguy hiểm (33 với xăng, 30 với dầu DO) và số UN.', 'Nhãn hình thoi "chất lỏng dễ cháy" (loại 3) dán ở hai bên và phía sau bồn.', 'Giấy tờ luôn mang theo: giấy phép vận chuyển hàng nguy hiểm, lệnh xuất kho, phiếu an toàn hóa chất của sản phẩm.'],
    'fire-2': ['Rút chốt an toàn, hướng loa phun vào gốc lửa, bóp van và quét qua lại.', 'Đứng ở đầu gió, cách đám cháy 1,5–2 m.', 'Bình bọt (foam) phủ kín bề mặt xăng dầu, ngăn hơi xăng tiếp xúc với không khí. Bình bột dập nhanh nhưng dễ cháy lại.'],
    'eco-2': ['Lốp non 10% làm tăng tiêu hao nhiên liệu khoảng 1–2% và làm lốp mòn nhanh hơn.', 'Kiểm tra áp suất lốp khi lốp nguội, mỗi sáng trước chuyến.', 'Chở đúng tải trọng cho phép, không chở quá dung tích khoang.'],
    'load-2': ['Sau khi nạp, kẹp chì niêm phong tất cả van đáy và nắp khoang.', 'Ghi số chì vào phiếu xuất và vào app, đối chiếu từng khoang.', 'Tại điểm giao, cùng người nhận kiểm tra chì còn nguyên trước khi cắt chì và xả hàng.'],
    'aid-2': ['Xăng dầu bắn vào mắt: rửa bằng nước sạch liên tục ít nhất 15 phút, không dụi mắt.', 'Bỏng: làm mát vùng bỏng bằng nước sạch, mát trong 10–20 phút. Không bôi kem đánh răng, nước mắm.', 'Che vết bỏng bằng gạc sạch, đưa đến cơ sở y tế gần nhất.'],
  };
  function LessonSheet({ courseId, lessonId, close }) {
    const app = useApp();
    const c = app.data.courses.find((x) => x.id === courseId);
    const l = c.lessons.find((x) => x.id === lessonId);
    const [playing, setPlaying] = useState(false);
    const [prog, setProg] = useState(l.doneAt ? 1 : 0);
    useEffect(() => {
      if (!playing) return;
      const id = setInterval(() => setProg((p) => { const n = Math.min(1, p + 0.02); if (n >= 1) setPlaying(false); return n; }), 120);
      return () => clearInterval(id);
    }, [playing]);
    const done = () => {
      app.mutate((d) => { d.courses.find((x) => x.id === courseId).lessons.find((x) => x.id === lessonId).doneAt = TODAY; });
      close();
      app.ov.toast(`Đã học xong · +${l.minutes} phút`);
    };
    const secs = l.minutes * 60;
    return html`<${SheetHeader} title=${l.kind === 'video' ? 'Video' : 'Bài đọc'} onCancel=${close} cancel="Đóng" />
      <div class="sheet-body">
        <div style=${{ padding: '0 20px', fontSize: '20px', fontWeight: 700, lineHeight: '25px' }}>${l.title}</div>
        ${l.kind === 'video'
          ? html`<button class="player" onClick=${() => setPlaying(!playing)} aria-label=${playing ? 'Tạm dừng' : 'Phát'}>
              <span class="play"><${Icon} n=${playing ? 'pause' : 'play'} size=${28} sw=${2} color="#fff" /></span>
              <span class="ptime">${fmt.mmss(prog * secs)} / ${fmt.mmss(secs)}</span>
              <span class="pbar"><span style=${{ width: prog * 100 + '%' }}></span></span></button>
            <div class="small muted" style=${{ padding: '0 20px' }}>Trình phát mô phỏng. Bản thật dùng video tải sẵn để xem khi mất sóng.</div>`
          : html`<div class="reading">${(READING[l.id] || ['Nội dung bài đọc mẫu.']).map((p, i) => html`<p key=${i} style=${{ margin: 0 }}>${p}</p>`)}</div>`}
        <div style=${{ margin: '0 16px' }}>${l.doneAt
          ? html`<${Btn} v="gray" c="green" icon="check" disabled=${true}>Đã học xong ngày ${fmt.dm(l.doneAt)}<//>`
          : html`<${Btn} c="green" icon="check" disabled=${l.kind === 'video' && prog < 0.2} onClick=${done}>Đánh dấu đã học xong<//>`}</div>
        ${l.kind === 'video' && !l.doneAt && prog < 0.2 && html`<div class="small muted" style=${{ textAlign: 'center' }}>Xem video trước khi đánh dấu hoàn thành</div>`}
      </div>`;
  }

  function QuizSheet({ courseId, lessonId, close }) {
    const app = useApp();
    const c = app.data.courses.find((x) => x.id === courseId);
    const l = c.lessons.find((x) => x.id === lessonId);
    const [ans, setAns] = useState(l.quiz.map(() => -1));
    const [submitted, setSubmitted] = useState(false);
    const score = l.quiz.filter((q, i) => ans[i] === q.answer).length;
    const pass = score >= 2;
    const submit = () => {
      setSubmitted(true);
      if (score >= 2) {
        app.mutate((d) => {
          const ls = d.courses.find((x) => x.id === courseId).lessons.find((x) => x.id === lessonId);
          if (!ls.doneAt) ls.doneAt = TODAY;
          ls.bestScore = Math.max(ls.bestScore || 0, score);
        });
      }
    };
    return html`<${SheetHeader} title="Bài kiểm tra" onCancel=${close} cancel="Đóng" action=${submitted ? null : 'Nộp bài'} disabled=${ans.some((a) => a < 0)} onAction=${submit} />
      <div class="sheet-body">
        ${submitted && html`<div class="result">
          <div class=${'sent'} style=${{ width: '64px', height: '64px', background: pass ? 'var(--green)' : 'var(--red)' }}><${Icon} n=${pass ? 'check' : 'x'} size=${34} sw=${3} color="#fff" /></div>
          <div class="big">${score}/${l.quiz.length}</div>
          <div>${pass ? 'Đạt. Bài kiểm tra đã được ghi nhận.' : 'Chưa đạt. Cần đúng tối thiểu 2/3 câu.'}</div>
          <div class="btn-row" style=${{ width: '100%' }}>
            <${Btn} v="gray" c="blue" icon="refresh" onClick=${() => { setAns(l.quiz.map(() => -1)); setSubmitted(false); }}>Làm lại<//>
            ${pass && html`<${Btn} onClick=${close}>Xong<//>`}
          </div>
        </div>`}
        ${l.quiz.map((q, qi) => html`<div key=${qi}>
          <div class="quiz-q">Câu ${qi + 1}. ${q.q}</div>
          <${Section}>
            ${q.options.map((o, oi) => {
              const right = submitted && oi === q.answer;
              const wrong = submitted && ans[qi] === oi && oi !== q.answer;
              return html`<div key=${oi} class=${'opt' + (right ? ' right' : '') + (wrong ? ' wrong' : '')}>
                <${Row} title=${o} onClick=${submitted ? null : () => { const a = [...ans]; a[qi] = oi; setAns(a); }}
                  left=${html`<${CheckCircle} on=${ans[qi] === oi || right} c=${right ? 'green' : wrong ? 'red' : 'blue'} label=${o} disabled=${submitted} onClick=${() => { const a = [...ans]; a[qi] = oi; setAns(a); }} />`}
                  right=${right ? html`<${Pill} c="green">Đáp án đúng<//>` : wrong ? html`<${Pill} c="red">Anh chọn<//>` : null} />
              </div>`;
            })}
          <//>
        </div>`)}
      </div>`;
  }

  function CertsScreen() {
    return html`<${Screen} title="Giấy tờ và chứng chỉ" large=${false} back=${useBack()}><div style=${{ height: '4px' }}></div><${Certificates} /><//>`;
  }

  /* ================= Cá nhân ================= */
  const REQ_ICON = { leave: ['calendar', 'blue'], incident: ['alert', 'orange'], kpi: ['gauge', 'purple'], attendance: ['clock', 'teal'], renewal: ['idcard', 'indigo'], advance: ['banknote', 'green'] };
  function ProfileScreen() {
    const app = useApp();
    const d = app.data;
    const v = d.vehicles[0];
    const set = (k, val) => app.mutate((x) => { x.settings[k] = val; });
    const reset = () => app.ov.alert({ title: 'Đặt lại dữ liệu demo?', message: 'Mọi thay đổi (chuyến, chi phí, chấm công, bài học) sẽ quay về trạng thái ban đầu và đồng hồ về 09:12.', actions: [{ label: 'Hủy', style: 'cancel' }, { label: 'Đặt lại', style: 'destructive', onPress: () => { app.reset(); app.ov.toast('Đã đặt lại dữ liệu demo', 'info'); } }] });
    const jobs = [
      ['clipboard', 'blue', 'Kiểm tra xe trước chuyến', () => { const t = d.trips.find((x) => x.date === TODAY && ['accepted', 'pending'].includes(x.status)); if (t) openChecklist(app, t.id); else app.ov.toast('Không có chuyến nào cần kiểm tra xe', 'info'); }],
      ['wrench', 'orange', 'Báo sự cố hoặc hỏng xe', () => openIncident(app)],
      ['calendar', 'green', 'Xin nghỉ phép', () => app.ov.sheet((close) => html`<${LeaveSheet} close=${close} />`, { form: true })],
      ['idcard', 'indigo', 'Giấy tờ và chứng chỉ', () => app.nav.push('certs')],
      ['headset', 'teal', 'Gọi điều độ', () => openCallDispatcher(app)],
      ['siren', 'red', 'SOS khẩn cấp', () => openSOS(app)],
    ];
    return html`<${Screen} title="Cá nhân" large=${false} back=${useBack()}>
      <div class="profile-head">
        <div class="avatar-lg">H</div>
        <div class="profile-name">${d.driver.name}</div>
        <div class="muted footnote">${d.driver.code} · ${d.driver.team}</div>
        <div class="flex" style=${{ gap: '8px', justifyContent: 'center', marginTop: '4px' }}><span class="stars"><${Icon} n="star" size=${15} sw=${2.4} />${fmt.num1(d.driver.rating)}</span><${Pill} c="blue">GPLX hạng ${d.driver.license}<//><${Pill} c="gray">Từ ${d.driver.joined}<//></div>
      </div>
      <div class="stat4">
        <div><b>${d.driver.tripsThisYear}</b><span>Chuyến năm nay</span></div>
        <div><b>${fmt.num1(d.driver.safeKm / 1000)}k</b><span>Km an toàn</span></div>
        <div><b>${d.driver.incidents}</b><span>Sự cố</span></div>
        <div><b>${d.driver.leaveDays}</b><span>Ngày phép còn</span></div>
      </div>
      <${Section} header="Thông tin cá nhân">
        <${Row} title="Điện thoại" value=${d.driver.phone} />
        <${Row} title="CCCD" value=${d.driver.idNumber} />
        <${Row} title="Ngày sinh" value=${d.driver.birthday} />
        <${Row} title="Địa chỉ" subtitle=${d.driver.address} multiline=${true} />
        <${Row} title="Liên hệ khẩn cấp" subtitle=${d.driver.emergency} multiline=${true} />
        <${Row} title="Điều độ phụ trách" value=${d.driver.dispatcher.name} />
      <//>
      <${Section} header="Xe được giao">
        <${Row} icon="truck" c="blue" title=${v.plate} subtitle=${v.model} multiline=${true} />
        <div style=${{ padding: '10px 0' }}><div class="tank-bar">${v.compartments.map((cap, i) => html`<span key=${i} style=${{ flex: cap, background: 'var(--teal)' }}>${fmt.num1(cap / 1000)}k</span>`)}</div></div>
        <${Row} title="Bồn" value=${`${fmt.liters(v.capacity)} · ${v.compartments.length} khoang`} />
        <${Row} title="Hạn đăng kiểm" value=${fmt.dmy(v.inspectionExp)} />
        <${Row} title="Kiểm định bồn" value=${fmt.dmy(v.tankCertExp)} />
        <${Row} title="Tới kỳ bảo dưỡng" value=${html`<span style=${{ color: v.kmToService < 1500 ? 'var(--orange)' : 'inherit' }}>còn ${fmt.num(v.kmToService)} km</span>`} />
      <//>
      <${Section} header="Nhiệm vụ ngoài chuyến">
        ${d.tasks.map((k) => {
          const days = fmt.daysBetween(TODAY, k.due);
          return html`<${Row} key=${k.id} title=${html`<span style=${{ textDecoration: k.done ? 'line-through' : 'none', color: k.done ? 'var(--label2)' : 'inherit' }}>${k.title}</span>`} multiline=${true}
            subtitle=${html`<span style=${{ color: !k.done && days <= 1 ? 'var(--red)' : 'inherit' }}>Hạn ${fmt.dm(k.due)}${!k.done ? (days <= 0 ? ' · hôm nay' : days === 1 ? ' · ngày mai' : ` · còn ${days} ngày`) : ' · đã xong'}</span>`}
            left=${html`<${CheckCircle} on=${k.done} c="green" label=${k.title} onClick=${() => app.mutate((x) => { const t = x.tasks.find((y) => y.id === k.id); t.done = !t.done; })} />`} />`;
        })}
      <//>
      <${Section} header="Công việc khác">
        ${jobs.map((j) => html`<${Row} key=${j[2]} icon=${j[0]} c=${j[1]} title=${j[2]} chevron=${true} onClick=${j[3]} />`)}
      <//>
      <${Section} header="Yêu cầu đã gửi">
        ${d.requests.length === 0 && html`<${Row} title="Chưa có yêu cầu" />`}
        ${d.requests.slice(0, 8).map((r) => {
          const ic = REQ_ICON[r.kind] || ['inbox', 'gray'];
          return html`<${Row} key=${r.id} icon=${ic[0]} c=${ic[1]} title=${r.title} subtitle=${`${r.detail} · ${fmt.dm(r.createdAt)} ${fmt.hm(r.createdAt)}`} multiline=${true} right=${html`<${Pill} c=${STATUS_EXP[r.status][1]}>${STATUS_EXP[r.status][0]}<//>`} />`;
        })}
      <//>
      <${Section} header="Cài đặt" footer="Chế độ đang lái chặn mọi biểu mẫu nhập liệu. Nút SOS và gọi khẩn cấp vẫn dùng được.">
        <div class="row" style=${{ paddingTop: '8px', paddingBottom: '8px' }}><${IconTile} n="moon" c="indigo" /><div class="row-main" style=${{ padding: 0 }}>Giao diện</div>
          <div style=${{ width: '190px' }}><div style=${{ margin: '0 -16px' }}><${Seg} options=${[['auto', 'Tự động'], ['light', 'Sáng'], ['dark', 'Tối']]} value=${d.settings.appearance} onChange=${(x) => set('appearance', x)} /></div></div></div>
        <${Row} icon="bell" c="red" title="Thông báo đẩy" right=${html`<${Switch} on=${d.settings.push} label="Thông báo đẩy" onChange=${(x) => set('push', x)} />`} />
        <${Row} icon="wheel" c="orange" title="Chế độ đang lái" right=${html`<${Switch} on=${d.settings.driving} label="Chế độ đang lái" onChange=${(x) => { set('driving', x); app.ov.toast(x ? 'Đã bật chế độ đang lái' : 'Đã tắt chế độ đang lái', 'info'); }} />`} />
      <//>
      <${Section} footer="Dành cho người điều phối buổi thử nghiệm với lái xe.">
        <${Row} icon="flask" c="purple" title="Kịch bản thử nghiệm" chevron=${true} onClick=${() => app.ov.sheet((close) => html`<div data-lab="1" style=${{ display: 'contents' }}><${SheetHeader} title="Kịch bản thử nghiệm" onCancel=${close} cancel="Đóng" /><div class="sheet-body"><div style=${{ margin: '0 16px' }}><${LabPanel} compact=${true} onStart=${close} /></div></div></div>`)} />
        <${Row} title="Đặt lại dữ liệu demo" destructive=${true} onClick=${reset} />
      <//>
    <//>`;
  }

  function LeaveSheet({ close }) {
    const app = useApp();
    const d = app.data;
    const [from, setFrom] = useState('2026-11-16');
    const [to, setTo] = useState('2026-11-16');
    const [type, setType] = useState('annual');
    const [reason, setReason] = useState('');
    const TYPES = [['annual', 'Phép năm'], ['sick', 'Nghỉ ốm'], ['personal', 'Việc riêng'], ['unpaid', 'Không lương']];
    let days = 0;
    if (from && to && to >= from) {
      for (let x = fmt.parseDate(from); x <= fmt.parseDate(to); x.setDate(x.getDate() + 1)) if (x.getDay() !== 0) days++;
    }
    const over = type === 'annual' && days > d.driver.leaveDays;
    const ok = from && to && to >= from && from > TODAY && days > 0 && !over && reason.trim().length >= 3;
    const send = () => {
      const label = TYPES.find((t) => t[0] === type)[1];
      app.mutate((x) => {
        x.requests.unshift({ id: fmt.uid('r'), kind: 'leave', title: `${label} ${fmt.dm(from)}${to !== from ? ' – ' + fmt.dm(to) : ''}`, detail: `${days} ngày · ${reason.trim()}`, createdAt: fmt.isoLocal(app.now()), status: 'pending' });
      });
      close();
      app.ov.toast('Đã gửi đơn nghỉ phép');
    };
    return html`<${SheetHeader} title="Xin nghỉ phép" onCancel=${close} action="Gửi" disabled=${!ok} onAction=${send} />
      <div class="sheet-body">
        <${Section} footer=${`Số ngày tự tính, không tính Chủ Nhật. Phép năm còn ${d.driver.leaveDays} ngày.`}>
          <${Field} label="Từ ngày" err=${from && from <= TODAY}><input id="leave-from" type="date" min="2026-11-13" value=${from} onInput=${(e) => setFrom(e.currentTarget.value)} /><//>
          <${Field} label="Đến ngày" err=${to < from}><input id="leave-to" type="date" min=${from} value=${to} onInput=${(e) => setTo(e.currentTarget.value)} /><//>
          <${Row} title="Số ngày nghỉ" value=${html`<b style=${{ color: over ? 'var(--red)' : 'var(--label)' }}>${days} ngày</b>`} />
        <//>
        <${Section} header="Loại nghỉ">
          ${TYPES.map((t) => html`<${Row} key=${t[0]} title=${t[1]} onClick=${() => setType(t[0])} right=${type === t[0] && html`<${Icon} n="check" size=${20} sw=${2.6} color="var(--blue)" />`} />`)}
        <//>
        ${over && html`<${Note} c="red" icon="alert">Vượt số ngày phép năm còn lại (${d.driver.leaveDays} ngày).<//>`}
        <${Section} header="Lý do"><textarea class="ta" id="leave-reason" placeholder="Ví dụ: đám cưới em trai ở quê" value=${reason} onInput=${(e) => setReason(e.currentTarget.value)}></textarea><//>
      </div>`;
  }

  /* ================= Kịch bản thử nghiệm (usability test) ================= */
  const TASKS = [
    { id: 'accept', title: 'Nhận chuyến chiều nay đi KCN Long Thành', say: 'Điều độ vừa giao cho anh một chuyến chiều nay. Anh nhận chuyến đó giúp tôi.', check: (d) => ['accepted', 'loading', 'in_transit', 'unloading', 'completed'].includes(d.trips.find((t) => t.id === 't-today-3').status) },
    { id: 'deliver', title: 'Hoàn tất chuyến đang chạy tới Biên Hòa', say: 'Anh vừa tới cửa hàng ở Biên Hòa. Anh làm các bước xả hàng và cho người nhận ký xác nhận.', check: (d) => d.trips.find((t) => t.id === 't-today-2').status === 'completed' },
    { id: 'start', title: 'Bắt đầu lấy hàng cho chuyến Long Thành', say: 'Anh đã tới kho Hiệp Phước. Anh bắt đầu lấy hàng cho chuyến chiều.', check: (d) => ['loading', 'in_transit', 'unloading', 'completed'].includes(d.trips.find((t) => t.id === 't-today-3').status) },
    { id: 'expense', title: 'Khai hóa đơn ăn trưa 60.000 ₫', say: 'Anh vừa ăn trưa hết 60.000 đồng và có hóa đơn. Anh khai khoản này.', check: (d) => d.expenses.some((e) => e.category === 'meal' && e.amount === 60000 && e.date === TODAY && e.hasInvoice) },
    { id: 'kpi', title: 'Tìm số điểm KPI còn thiếu để lên mức thưởng cao hơn', say: 'Tháng này anh được bao nhiêu điểm KPI? Còn thiếu bao nhiêu điểm để lên mức thưởng tiếp theo?', check: null },
    { id: 'explain', title: 'Gửi giải trình cho ngày đi muộn 09/11', say: 'Hôm thứ Hai 09/11 anh đi muộn vì kẹt xe. Anh gửi giải trình cho ngày đó.', check: (d) => !!(d.attendance.find((a) => a.date === '2026-11-09') || {}).explanation },
    { id: 'defect', title: 'Báo xe hỏng đèn xi nhan', say: 'Anh phát hiện đèn xi nhan bên phải không sáng. Anh báo cho công ty biết.', check: (d) => d.requests.some((r) => r.kind === 'incident' && r.subtype === 'breakdown') },
    { id: 'quiz', title: 'Làm bài kiểm tra khóa hàng nguy hiểm (ADR) và đạt', say: 'Anh làm bài kiểm tra cuối khóa vận chuyển hàng nguy hiểm.', check: (d) => !!d.courses.find((c) => c.id === 'c-adr').lessons.find((l) => l.id === 'adr-4').doneAt },
    { id: 'sos', title: 'Bấm SOS rồi hủy vì bấm nhầm', say: 'Giả sử anh lỡ tay bấm nút khẩn cấp. Anh bấm thử rồi hủy.', check: (d) => !!d.flags.sosCancelled },
  ];

  function LabPanel({ compact, onStart }) {
    const app = useApp();
    useTick(1000);
    const lab = app.lab;
    const res = lab.results;
    const doneN = TASKS.filter((t) => res[t.id] && res[t.id].status === 'done').length;
    const finished = TASKS.filter((t) => res[t.id] && ['done', 'fail'].includes(res[t.id].status));
    const totalSec = finished.reduce((s, t) => s + (res[t.id].end - res[t.id].start) / 1000, 0);
    const avgTaps = finished.length ? Math.round(finished.reduce((s, t) => s + res[t.id].taps, 0) / finished.length) : 0;
    const copy = () => {
      const lines = [`DriverOS – kết quả thử nghiệm${lab.participant ? ' – ' + lab.participant : ''}`, `Thời điểm: ${new Date().toLocaleString('vi-VN')}`, ''];
      TASKS.forEach((t, i) => {
        const r = res[t.id];
        const st = !r ? 'Chưa làm' : r.status === 'done' ? 'Hoàn thành' : r.status === 'fail' ? 'Không hoàn thành' : r.status === 'skip' ? 'Bỏ qua' : 'Đang làm';
        lines.push(`${i + 1}. ${t.title}: ${st}${r && r.end ? ` · ${Math.round((r.end - r.start) / 1000)} giây · ${r.taps} lần chạm${r.auto ? ' · tự ghi nhận' : ''}` : ''}`);
      });
      const text = lines.join('\n');
      const ta = document.getElementById('lab-copy');
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => app.ov.toast('Đã chép kết quả', 'info'), () => { ta.value = text; ta.hidden = false; ta.select(); });
      else { ta.value = text; ta.hidden = false; ta.select(); }
    };
    return html`<div class="lab-inner" data-lab="1" style=${{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      ${!compact && html`<div><h2>Kịch bản thử với lái xe</h2><p>Bấm Bắt đầu, đọc câu gợi ý cho lái xe, rồi im lặng quan sát. App tự ghi nhận khi lái xe làm xong (nhiệm vụ có nhãn "Tự động").</p></div>`}
      <label class="field-row" style=${{ background: 'var(--fill2)', borderRadius: '10px' }}><span class="fl" style=${{ fontSize: '14px', minWidth: 'auto' }}>Người thử</span><input id="lab-name" style=${{ fontSize: '14px' }} placeholder="Tên hoặc mã lái xe" value=${lab.participant} onInput=${(e) => app.setLab({ ...lab, participant: e.currentTarget.value })} /></label>
      <div class="lab-sum"><div><b>${doneN}/${TASKS.length}</b><span>Hoàn thành</span></div><div><b>${fmt.mmss(totalSec)}</b><span>Tổng thời gian</span></div><div><b>${avgTaps}</b><span>Chạm trung bình</span></div></div>
      <div class="lab-tasks">${TASKS.map((t, i) => {
        const r = res[t.id];
        const running = lab.active === t.id;
        const el = r ? ((r.end || Date.now()) - r.start) / 1000 : 0;
        return html`<div key=${t.id} class=${'lab-task' + (running ? ' active' : '')}>
          <div class="lt-top"><span class="lt-n">${i + 1}</span><span class="lt-title">${t.title}</span>${t.check ? html`<${Pill} c="purple">Tự động<//>` : html`<${Pill} c="gray">Quan sát<//>`}</div>
          <div class="lt-say">“${t.say}”</div>
          ${r && html`<div class="lt-res">
            ${r.status === 'running' && html`<${Pill} c="blue" solid=${true}>Đang làm<//>`}
            ${r.status === 'done' && html`<${Pill} c="green" solid=${true}>Hoàn thành${r.auto ? ' (tự động)' : ''}<//>`}
            ${r.status === 'fail' && html`<${Pill} c="red" solid=${true}>Không hoàn thành<//>`}
            ${r.status === 'skip' && html`<${Pill} c="gray" solid=${true}>Bỏ qua<//>`}
            <span class="tnum">${fmt.mmss(el)}</span><span>· ${r.taps} lần chạm</span>${r.pre && html`<span style=${{ color: 'var(--orange)' }}>· đã đạt từ trước khi bắt đầu</span>`}</div>`}
          <div class="lab-btns">
            ${!running && html`<button class="lab-btn primary" onClick=${() => { app.startTask(t); if (onStart) onStart(); }}>${r ? 'Làm lại' : 'Bắt đầu'}</button>`}
            ${running && html`<button class="lab-btn" onClick=${() => app.endTask(t.id, 'done')}>Đạt</button><button class="lab-btn danger" onClick=${() => app.endTask(t.id, 'fail')}>Không đạt</button><button class="lab-btn" onClick=${() => app.endTask(t.id, 'skip')}>Bỏ qua</button>`}
          </div>
        </div>`;
      })}</div>
      <div class="lab-btns">
        <button class="lab-btn primary" onClick=${copy}><span class="inline-flex"><${Icon} n="copy" size=${14} />Chép kết quả</span></button>
        <button class="lab-btn danger" onClick=${() => app.ov.alert({ title: 'Bắt đầu với người thử mới?', message: 'Dữ liệu app và kết quả hiện tại sẽ được đặt lại.', actions: [{ label: 'Hủy', style: 'cancel' }, { label: 'Đặt lại', style: 'destructive', onPress: () => { app.reset(); app.setLab({ participant: '', active: null, results: {} }); } }] })}>Người thử mới</button>
      </div>
      <textarea id="lab-copy" hidden=${true} readonly=${true} style=${{ width: '100%', minHeight: '120px', fontSize: '12px' }}></textarea>
    </div>`;
  }

  /* ================= Overlay (sheet, alert, banner) ================= */
  function useOverlays(driving) {
    const [sheets, setSheets] = useState([]);
    const [alertSpec, setAlert] = useState(null);
    const [toast, setToast] = useState(null);
    const seq = useRef(0);
    const drivingRef = useRef(driving);
    drivingRef.current = driving;
    const closeSheet = useCallback((id) => {
      setSheets((s) => s.map((x) => (x.id === id ? { ...x, closing: true } : x)));
      setTimeout(() => setSheets((s) => s.filter((x) => x.id !== id)), 260);
    }, []);
    const api = useMemo(() => ({
      sheet(renderFn, opts) {
        if (opts && opts.form && drivingRef.current) {
          setAlert({ title: 'Dừng xe trước khi nhập liệu', message: 'Chế độ đang lái đang bật. Dừng xe ở nơi an toàn rồi tắt chế độ này trong trang Cá nhân.', actions: [{ label: 'Đã hiểu', style: 'cancel' }] });
          return;
        }
        const id = ++seq.current;
        setSheets((s) => [...s, { id, render: renderFn, closing: false }]);
      },
      alert: (spec) => setAlert(spec),
      toast: (text, tone) => setToast({ text, tone: tone || 'success', id: ++seq.current }),
    }), []);
    useEffect(() => {
      if (!toast) return;
      const id = setTimeout(() => setToast(null), 2800);
      return () => clearTimeout(id);
    }, [toast]);
    const view = html`
      ${sheets.map((s, i) => html`<div key=${s.id} class=${'sheet-layer' + (s.closing ? ' closing' : '')} style=${{ zIndex: 50 + i }}>
        <div class="sheet-backdrop" onClick=${() => closeSheet(s.id)}></div>
        <div class="sheet" role="dialog" aria-modal="true" style=${{ top: `calc(var(--sat) + ${12 + i * 10}px)` }}>
          <div class="sheet-grabber"></div>${s.render(() => closeSheet(s.id))}
        </div></div>`)}
      ${alertSpec && html`<div class="alert-layer" role="alertdialog" aria-modal="true"><div class="alert">
        <div class="alert-body"><div class="alert-title">${alertSpec.title}</div>${alertSpec.message && html`<div class="alert-message">${alertSpec.message}</div>`}</div>
        <div class=${'alert-actions' + ((alertSpec.actions || []).length > 2 ? ' stacked' : (alertSpec.actions || []).length <= 1 ? ' single' : '')}>
          ${(alertSpec.actions || [{ label: 'OK', style: 'cancel' }]).map((a) => html`<button key=${a.label} class=${'alert-btn ' + (a.style || 'default')} onClick=${() => { setAlert(null); if (a.onPress) a.onPress(); }}>${a.label}</button>`)}
        </div></div></div>`}
      ${toast && html`<div key=${toast.id} class=${'banner ' + toast.tone} role="status"><${Icon} n=${toast.tone === 'success' ? 'check' : toast.tone === 'warning' ? 'alert' : 'info'} size=${18} sw=${2.6} /><span>${toast.text}</span></div>`}`;
    return [api, view];
  }

  /* ================= Khung máy & app ================= */
  const TABS = [['today', 'Hôm nay', 'sun'], ['jobs', 'Công việc', 'truck'], ['attendance', 'Chấm công', 'calendarCheck'], ['finance', 'Tài chính', 'wallet'], ['learning', 'Học tập', 'grad']];
  const SCREEN_TITLE = { today: 'Hôm nay', jobs: 'Công việc', attendance: 'Chấm công', finance: 'Tài chính', learning: 'Học tập', trip: 'Chuyến', course: 'Khóa học', me: 'Cá nhân', certs: 'Giấy tờ' };

  function layout() {
    const w = window.innerWidth, h = window.innerHeight;
    const full = w < 560 || h < 560;
    const lab = !full && w >= 880;
    let scale = Math.min(1, (h - 40) / 852);
    if (!lab) scale = Math.min(scale, (w - 40) / 393);
    return { full, lab, scale: Math.max(0.5, scale) };
  }

  function StatusBar({ base }) {
    useTick(10000);
    const now = simNow(base);
    return html`<div class="statusbar"><span class="tnum">${fmt.hmOf(now)}</span><span class="island"></span>
      <span class="sb-icons">
        <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true"><rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor"/><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="currentColor"/><rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor"/><rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor" opacity="0.35"/></svg>
        <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true"><path d="M8 11.5 5.6 9a3.4 3.4 0 0 1 4.8 0z" fill="currentColor"/><path d="M3.4 6.8a6.5 6.5 0 0 1 9.2 0l-1.1 1.1a5 5 0 0 0-7 0z" fill="currentColor"/><path d="M1.2 4.6a9.6 9.6 0 0 1 13.6 0l-1.1 1.1a8 8 0 0 0-11.4 0z" fill="currentColor"/></svg>
        <svg width="27" height="13" viewBox="0 0 27 13" aria-hidden="true"><rect x="0.5" y="0.5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" opacity="0.4"/><rect x="2" y="2" width="16" height="9" rx="2" fill="currentColor"/><path d="M25 4.5v4a2 2 0 0 0 0-4z" fill="currentColor" opacity="0.4"/></svg>
      </span></div>`;
  }

  function App() {
    const [data, setData] = useState(loadData);
    const [lab, setLabState] = useState(loadLab);
    const [lay, setLay] = useState(layout);
    const [nav, setNav] = useState({ tab: 'today', stacks: { today: [], jobs: [], attendance: [], finance: [], learning: [] } });
    const [ov, overlayView] = useOverlays(data.settings.driving);
    const dataRef = useRef(data);
    dataRef.current = data;

    useEffect(() => persist(KEY, data), [data]);
    useEffect(() => persist(LAB_KEY, lab), [lab]);
    useEffect(() => {
      const on = () => setLay(layout());
      window.addEventListener('resize', on);
      return () => window.removeEventListener('resize', on);
    }, []);

    // Giao diện Sáng/Tối/Tự động: "Tự động" trả lại thuộc tính gốc của trang.
    const hostTheme = useRef(undefined);
    useEffect(() => {
      const root = document.documentElement;
      if (hostTheme.current === undefined) hostTheme.current = root.getAttribute('data-theme');
      const a = data.settings.appearance;
      if (a === 'auto') { if (hostTheme.current) root.setAttribute('data-theme', hostTheme.current); else root.removeAttribute('data-theme'); }
      else root.setAttribute('data-theme', a);
    }, [data.settings.appearance]);

    const mutate = useCallback((fn) => setData((prev) => { const next = JSON.parse(JSON.stringify(prev)); fn(next); return next; }), []);
    const reset = useCallback(() => {
      setData(initialData());
      setNav({ tab: 'today', stacks: { today: [], jobs: [], attendance: [], finance: [], learning: [] } });
      Object.keys(STICKY).forEach((k) => delete STICKY[k]);
    }, []);

    const setLab = useCallback((l) => setLabState(l), []);
    const startTask = useCallback((t) => {
      setLabState((l) => ({ ...l, active: t.id, results: { ...l.results, [t.id]: { status: 'running', start: Date.now(), end: null, taps: 0, auto: false, pre: t.check ? !!t.check(dataRef.current) : false } } }));
    }, []);
    const endTask = useCallback((id, status, auto) => {
      setLabState((l) => {
        const r = l.results[id];
        if (!r || r.status !== 'running') return l;
        return { ...l, active: l.active === id ? null : l.active, results: { ...l.results, [id]: { ...r, status, end: Date.now(), auto: !!auto } } };
      });
    }, []);
    // Tự ghi nhận hoàn thành khi dữ liệu đạt điều kiện.
    useEffect(() => {
      if (!lab.active) return;
      const t = TASKS.find((x) => x.id === lab.active);
      const r = lab.results[lab.active];
      // Không báo gì trên màn hình điện thoại để không gợi ý cho người thử.
      if (t && t.check && r && !r.pre && t.check(data)) endTask(t.id, 'done', true);
    }, [data, lab.active]);

    const navApi = useMemo(() => {
      const stack = nav.stacks[nav.tab];
      const prev = stack.length >= 2 ? stack[stack.length - 2].name : nav.tab;
      return {
        push: (name, params) => setNav((n) => ({ ...n, stacks: { ...n.stacks, [n.tab]: [...n.stacks[n.tab], { name, params: params || {}, key: Date.now() }] } })),
        replace: (name, params) => setNav((n) => ({ ...n, stacks: { ...n.stacks, [n.tab]: [...n.stacks[n.tab].slice(0, -1), { name, params: params || {}, key: Date.now() }] } })),
        pop: () => setNav((n) => ({ ...n, stacks: { ...n.stacks, [n.tab]: n.stacks[n.tab].slice(0, -1) } })),
        tab: (t) => setNav((n) => ({ tab: t, stacks: n.tab === t ? { ...n.stacks, [t]: [] } : n.stacks })),
        backLabel: SCREEN_TITLE[prev] || 'Quay lại',
      };
    }, [nav]);

    const app = useMemo(() => ({
      data, mutate, reset, now: () => simNow(data.clockBase), nav: navApi, ov, lab, setLab, startTask, endTask,
    }), [data, mutate, reset, navApi, ov, lab, setLab, startTask, endTask]);

    const stack = nav.stacks[nav.tab];
    const top = stack[stack.length - 1];
    const route = top || { name: nav.tab, params: {}, key: nav.tab };
    const SCREENS = { today: TodayScreen, jobs: JobsScreen, attendance: AttendanceScreen, finance: FinanceScreen, learning: LearningScreen, trip: TripScreen, course: CourseScreen, me: ProfileScreen, certs: CertsScreen };
    const Cmp = SCREENS[route.name];
    const pendingN = data.trips.filter((t) => t.status === 'pending' && t.date >= TODAY).length;

    const onTap = (e) => {
      if (!lab.active) return;
      if (e.target.closest && e.target.closest('[data-lab]')) return;
      setLabState((l) => {
        const r = l.results[l.active];
        if (!r || r.status !== 'running') return l;
        return { ...l, results: { ...l.results, [l.active]: { ...r, taps: r.taps + 1 } } };
      });
    };

    const activeTask = lab.active && TASKS.find((t) => t.id === lab.active);
    const activeIdx = activeTask ? TASKS.indexOf(activeTask) + 1 : 0;

    const phone = html`<div class="device" style=${{ transform: lay.full ? 'none' : `scale(${lay.scale})` }} onPointerDown=${onTap}>
      <${StatusBar} base=${data.clockBase} />
      <div class="app">
        <${Cmp} key=${route.key} ...${route.params} />
        <nav class="tabbar">
          ${TABS.map(([id, label, icon]) => html`<button key=${id} class=${'tab' + (nav.tab === id ? ' on' : '')} aria-label=${label} onClick=${() => navApi.tab(id)}>
            <${Icon} n=${icon} size=${25} sw=${nav.tab === id ? 2.3 : 1.9} /><span>${label}</span>
            ${id === 'jobs' && pendingN > 0 && html`<span class="badge">${pendingN}</span>`}</button>`)}
        </nav>
        ${overlayView}
        ${activeTask && !lay.lab && html`<${LabPill} n=${activeIdx} start=${lab.results[lab.active].start} onOpen=${() => ov.sheet((close) => html`<div data-lab="1" style=${{ display: 'contents' }}><${SheetHeader} title="Kịch bản thử nghiệm" onCancel=${close} cancel="Đóng" /><div class="sheet-body"><div style=${{ margin: '0 16px' }}><${LabPanel} compact=${true} onStart=${close} /></div></div></div>`)} />`}
      </div>
      <div class="home-ind"></div>
    </div>`;

    return html`<${Ctx.Provider} value=${app}>
      <div class=${'stage' + (lay.full ? ' full' : '')}>
        <div class="device-box" style=${lay.full ? null : { width: 393 * lay.scale + 'px', height: 852 * lay.scale + 'px' }}>${phone}</div>
        ${lay.lab && html`<aside class="lab"><${LabPanel} /></aside>`}
      </div>
    <//>`;
  }

  function LabPill({ n, start, onOpen }) {
    useTick(1000);
    return html`<button class="test-pill" data-lab="1" onClick=${onOpen}><${Icon} n="timer" size=${14} sw=${2.4} />Nhiệm vụ ${n} · ${fmt.mmss((Date.now() - start) / 1000)}</button>`;
  }

  render(html`<${App} />`, document.getElementById('root'));
})();
