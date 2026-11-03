/* Case studies on phones: the pixel rows under the hero, the band over "How we worked", the Part tabs (block csmjs).
   Phones only (≤ 899px); nothing here runs on desktop. */
/* ===== CASE STUDY — phones: the pixel rows under the hero, the homepage band (in the section's green) over "How we worked", "Part n" tabs ===== */
(() => {
  const mq = matchMedia('(max-width: 899px)'); if (!mq.matches) return;
  const RED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), oc = (t) => 1 - Math.pow(1 - t, 3);
  // Figma "Group 138": five rows of 5 px pixels, 16 apart (x in the 390 frame); colours from the homepage strip
  const ROWS = [[21, 71, 158, 183, 308, 358], [46, 108, 208, 245, 333], [84, 109, 134, 159, 234, 259, 284, 370], [34, 58, 171, 233, 258, 295], [15, 96, 121, 146, 221, 270, 320, 345]];
  const COL = ['#0b5238', '#0e1633', '#f3ea08', '#f05252', '#f1d7e8', '#6a7782', '#f1678e', '#d1e1d4', '#3d5aa9'];
  function pixels() { const hero = document.querySelector('section.cz-hero'); if (!hero || document.querySelector('.csm-px')) return;
    const box = document.createElement('div'); box.className = 'csm-px'; box.setAttribute('aria-hidden', 'true'); let n = 0;
    ROWS.forEach((r, y) => r.forEach((x) => { const i = document.createElement('i'); i.style.left = `calc(${(x / 390 * 100).toFixed(3)}% - 2px)`; i.style.top = y * 16 + 'px'; i.style.background = COL[(n++ * 5 + y) % COL.length]; box.appendChild(i); }));
    hero.after(box);
    const snap = () => { const w = box.clientWidth, r = box.getBoundingClientRect(), fy = ((r.top + scrollY) % 1 + 1) % 1; let k = 0;
      ROWS.forEach((row, y) => row.forEach((x) => { const i = box.children[k++]; i.style.left = Math.round(x / 390 * w - 2) + 'px'; i.style.top = (y * 16 - fy) + 'px'; })); };
    snap(); addEventListener('resize', snap); addEventListener('load', snap); }
  function band() { const sec = document.querySelector('section.cz-how'); if (!sec || sec.querySelector('.csm-band')) return;
    const CELL = 80, TOP = -206, BOTTOM = 506, s = 50 / CELL;
    const FIG = { '-239': [8, 9, 10, 12, 14, 17, 18, 19, 20, 21], '-159': [1, 5, 6, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 20], '-79': [1, 3, 4, 6, 8, 9, 10, 12, 13, 14, 16, 17, 18, 21, 23] };
    const rr = (n) => { const v = Math.sin(n * 91.345 + 7.13) * 43758.5453; return v - Math.floor(v); };
    const cells = []; let n = 0;
    for (let y = -239; y < 0; y += CELL) { const row = FIG[String(y)], yn = (y - TOP) / (BOTTOM - TOP);
      for (let c = 0; c < 24; c++) { n++; if (row && !row.includes(c)) continue; cells.push({ x: c * CELL, y, t0: (1 - yn) * 0.62 + rr(n) * 0.2 }); } }
    const cv = document.createElement('canvas'); cv.className = 'csm-band'; cv.setAttribute('aria-hidden', 'true'); sec.prepend(cv);
    const ctx = cv.getContext('2d'); let dpr = 1, ox = 0, cur = 0, last = -1, raf = 0;
    const size = () => { const W = document.documentElement.clientWidth; ox = (W - 1920 * s) / 2; dpr = Math.min(devicePixelRatio || 1, 2);
      cv.style.top = TOP * s + 'px'; cv.style.height = -TOP * s + 'px'; cv.width = Math.round(W * dpr); cv.height = Math.round(-TOP * s * dpr); last = -1; draw(); };
    const prog = () => RED ? 1 : clamp((innerHeight + 100 - (sec.getBoundingClientRect().top + TOP * s)) / (innerHeight * 0.8));
    function draw() { raf = 0; const goal = prog(); cur += (goal - cur) * (RED ? 1 : 0.13); if (Math.abs(goal - cur) < 0.0006) cur = goal; if (cur !== goal) raf = requestAnimationFrame(draw);
      if (Math.abs(cur - last) < 0.0002) return; last = cur;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.setTransform(s * dpr, 0, 0, s * dpr, ox * dpr, -TOP * s * dpr); ctx.fillStyle = '#D1E0D3';
      for (const c of cells) { const a = clamp((cur - c.t0) / 0.05); if (a <= 0) continue; const e = oc(a), sz = CELL * (0.74 + 0.26 * e) + 1, o = (CELL - sz) / 2; ctx.globalAlpha = e; ctx.fillRect(c.x + o, c.y + o, sz, sz); }
      ctx.globalAlpha = 1; }
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(draw); }, { passive: true }); addEventListener('resize', size); size(); }
  // phones only: the tabs read "Part 1–4"; desktop keeps its own labels (put back if the window widens)
  function tabs() { const sp = [...document.querySelectorAll('.cz-tabs .cz-tab span')], orig = sp.map((x) => x.innerHTML);
    const set = () => sp.forEach((x, i) => { x.innerHTML = mq.matches ? 'Part ' + (i + 1) : orig[i]; }); set(); mq.addEventListener('change', set); }
  /* how we worked: a copy of the hand that only this script moves (the desktop one stays put and hidden, so nothing fights over it);
     it eases toward the step in the middle of the screen, measured in the section's own layout (no jitter from the scroll); only
     the step it points at is black */
  function hand() { const sec = document.querySelector('section.cz-how'), src = sec && sec.querySelector('.cz-hand'), steps = sec ? [...sec.querySelectorAll('.cz-st')] : []; if (!src || !steps.length) return;
    const h = document.createElement('img'); h.className = 'csm-hand'; h.alt = ''; h.setAttribute('aria-hidden', 'true'); h.draggable = false; h.decoding = 'async'; h.src = src.getAttribute('src'); sec.appendChild(h);
    const offs = (el) => { let y = 0; while (el && el !== sec) { y += el.offsetTop; el = el.offsetParent; } return y; };
    let cur = -1, y = null, raf = 0, ty = 0;
    const goal = () => { const line = innerHeight * 0.55, top = sec.getBoundingClientRect().top; let k = 0; steps.forEach((st, i) => { if (top + offs(st) < line) k = i; }); return k; };
    const frame = () => { raf = 0; y = (y === null || RED) ? ty : y + (ty - y) * 0.12; if (Math.abs(ty - y) < 0.2) y = ty; else raf = requestAnimationFrame(frame);
      h.style.transform = `translate3d(0,${Math.round(y)}px,0) scaleX(-1)`; };
    const tick = () => { const k = goal(); if (k !== cur) { cur = k; steps.forEach((st, i) => st.classList.toggle('csm-on', i === k)); }
      ty = offs(steps[cur]) + steps[cur].offsetHeight / 2 - (h.offsetHeight || 100) / 2; if (!raf) raf = requestAnimationFrame(frame); };
    addEventListener('scroll', tick, { passive: true }); addEventListener('resize', () => { y = null; tick(); }); h.addEventListener('load', () => { y = null; tick(); }); tick(); }
  /* the tabs: the part on screen is the one in black */
  function tabOn() { const tb = [...document.querySelectorAll('.cz-tabs .cz-tab')], parts = [...document.querySelectorAll('.cz-parts .cz-part')]; if (!tb.length || !parts.length) return;
    let raf = 0; const tick = () => { raf = 0; const top = (document.querySelector('.cz-tabs').getBoundingClientRect().bottom || 0) + 40; let k = 0; parts.forEach((p, i) => { if (p.getBoundingClientRect().top < top + 120) k = i; }); tb.forEach((t, i) => t.classList.toggle('is-on', i === k)); };
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(tick); }, { passive: true }); tick(); }
  const boot = () => { pixels(); band(); tabs(); hand(); tabOn(); };
  if (document.readyState === 'complete') boot(); else addEventListener('load', boot);
})();
