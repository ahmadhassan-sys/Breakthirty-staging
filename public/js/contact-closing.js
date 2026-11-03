(() => {
  const sec = document.getElementById('contact'); if (!sec) return;
  const host = sec.querySelector('.wk-cta-stage') || sec;
  const CL_LABEL = ((window.B30_CONTENT.contact || {}).closing || []).flat().join(' ').replace(/\*/g, '');
  const wrap = document.createElement('div'); wrap.className = 'tm'; wrap.setAttribute('role', 'heading'); wrap.setAttribute('aria-level', '2'); wrap.setAttribute('aria-label', CL_LABEL);
  // the closing words come from src/data/home.js (contact.closing): two lines, a left and a right word each; *word* = the mono style
  const CL = (window.B30_CONTENT.contact || {}).closing || [];
  const word = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\*([^*]+)\*/g, '<span class="mono">$1</span>');
  wrap.innerHTML = CL.map((ln, i) => `<p class="tm__l ${i ? 'b' : 'a'}" aria-hidden="true"><span class="tw L">${word(ln[0])}</span><span class="tw R">${word(ln[1])}</span></p>`).join('');
  host.appendChild(wrap);
  const [a, b] = wrap.querySelectorAll('.tm__l'), words = [...wrap.querySelectorAll('.tw')], RED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // the words come in one by one — Think. from the left, then Make. from the right, then Break. from the left, then
  // Scale. from the right — 500ms apart, each gliding in and fading up, and meet in the middle. Leave the section and
  // they go back out, ready to come in again.
  words.forEach((w, n) => w.style.setProperty('--wd', n * 500 + 'ms'));
  const place = () => { const wr = wrap.getBoundingClientRect(), m = 164 * document.documentElement.clientWidth / 1920;
    wrap.classList.add('is-measure'); words.forEach((w) => { const r2 = w.getBoundingClientRect(), left = w.classList.contains('L');
      w.style.setProperty('--sx', ((left ? (wr.left + m) - r2.left : (wr.right - m) - r2.right)).toFixed(1) + 'px'); }); wrap.classList.remove('is-measure'); };
  const safePlace = () => place();
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(safePlace); addEventListener('resize', safePlace); place();
  // driven by the scroll: as you scroll down each word travels in from its edge, one after another (a short stagger in
  // the scroll), on an ease-in-out; a 200 ms ease smooths every step between scroll updates. No fade.
  const io = (x) => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  // played as you enter the section: Think. at once, Make. 200 ms later, then (400 ms on) Break., and Scale. 200 ms
  // after that — each on a gentle, long ease-out. Scroll back above the section and they reset for next time.
  words.forEach((w, n) => { w.style.removeProperty('--k'); w.style.setProperty('--wd', [0, 200, 600, 800][n] + 'ms'); });
  // (retired: the staggered entrance) — now each line travels as one piece, all the while you scroll: "Think.Make."
  // comes in from the left and keeps drifting right, "Break.Scale." comes in from the right and keeps drifting left;
  // nothing stops in the middle. Linear to the scroll, with a light catch-up so it glides.
  wrap.classList.add('is-drift');
  let cur = null, raf2 = 0;
  const target = () => { const r = sec.getBoundingClientRect(), vh = innerHeight, W = wrap.clientWidth, m = 164 * document.documentElement.clientWidth / 1920;
    const p = RED ? .5 : (vh - r.top) / (vh + r.height);                    // 0: the section's top at the bottom of the screen · 1: its bottom at the top
    const wa = a.offsetWidth, wb = b.offsetWidth;
    const xa = (m - wa * .35) + (W - m - wa * .65 - (m - wa * .35)) * p;    // line 1's left edge: from just past the left margin, across to the right
    const xb = (W - m - wb * .65) - (W - m - wb * .65 - (m - wb * .35)) * p; // line 2's left edge: from the right, across to the left
    return [xa - (W - wa) / 2, xb - (W - wb) / 2]; };                      // as offsets from centred
  const tick2 = () => { raf2 = 0; const t = target(); if (!cur) cur = t.slice();
    cur[0] += (t[0] - cur[0]) * .18; cur[1] += (t[1] - cur[1]) * .18;
    a.style.setProperty('transform', `translate3d(calc(-50% + ${cur[0].toFixed(2)}px),0,0)`, 'important');
    b.style.setProperty('transform', `translate3d(calc(-50% + ${cur[1].toFixed(2)}px),0,0)`, 'important');
    if (Math.abs(t[0] - cur[0]) > .3 || Math.abs(t[1] - cur[1]) > .3) raf2 = requestAnimationFrame(tick2); };
  const go2 = () => { if (!raf2) raf2 = requestAnimationFrame(tick2); };
  // (the drift is retired — the lines sit centred; see the pixel lift-off below)
  a.style.setProperty('transform', 'translate3d(-50%,0,0)', 'important'); b.style.setProperty('transform', 'translate3d(-50%,0,0)', 'important');
})();

/* closing lines: a minimal ASCII flicker on the two mono words (Make, Break) while you scroll — now and then a single
   letter turns into a glyph for a blink and comes back. Departure Mono is fixed-width, so nothing ever shifts. */
(() => { const monos = [...document.querySelectorAll('.tm .mono')]; if (!monos.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const GLY = '/\\|_-+=*#<>:;01';
  const words = monos.map((el) => ({ el, txt: el.textContent, cur: el.textContent.split(''), until: [] }));
  let lastY = scrollY, lastT = performance.now(), energy = 0, raf = 0;
  const draw = () => words.forEach((w) => { const s2 = w.cur.join(''); if (w.el.textContent !== s2) w.el.textContent = s2; });
  const tick = (now) => { raf = 0; energy *= .9;
    words.forEach((w) => { for (let i = 0; i < w.txt.length; i++) if (w.until[i] && now > w.until[i]) { w.cur[i] = w.txt[i]; w.until[i] = 0; } });
    // at most one letter per word flickers at a time, and only while there's scroll
    if (energy > .05) words.forEach((w) => { if (w.until.some(Boolean)) return; if (Math.random() < Math.min(.35, energy * .5)) {
      const i = (Math.random() * w.txt.length) | 0; w.cur[i] = GLY[(Math.random() * GLY.length) | 0]; w.until[i] = now + 70 + Math.random() * 60; } });
    draw();
    if (energy > .02 || words.some((w) => w.until.some(Boolean))) raf = requestAnimationFrame(tick);
    else words.forEach((w) => { w.cur = w.txt.split(''); w.until = []; draw(); }); };
  addEventListener('scroll', () => { const r = monos[0].getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
    const now = performance.now(), v = Math.abs(scrollY - lastY) / Math.max(8, now - lastT); lastY = scrollY; lastT = now;
    energy = Math.min(1, energy + v * .25); if (!raf) raf = requestAnimationFrame(tick); }, { passive: true });
})();

/* =====================================================================
   Closing — one word at a time. A single line in the centre: Sketch. → Make. → Break. → Scale. As you scroll through
   the section each word hands over to the next with the ASCII scramble (the letters tumble through glyphs and settle,
   left to right); it ends on "Scale." before the footer, and steps back as you scroll up. Make and Break in Departure
   Mono, as before.
   ===================================================================== */
(() => {
  const sec = document.getElementById('contact'), tm = sec && sec.querySelector('.tm'); if (!tm) return;
  tm.querySelectorAll('.tm__l, .tm__px').forEach((e) => (e.style.display = 'none'));   // (the two-line version is retired)
  const W = [{ t: 'Sketch', m: false }, { t: 'Make', m: true }, { t: 'Break', m: true }, { t: 'Scale', m: false }];
  const el = document.createElement('p'); el.className = 'tw1'; el.setAttribute('aria-live', 'off');
  el.innerHTML = '<span class="tw1__w"></span><span class="tw1__d">.</span>'; tm.appendChild(el);
  tm.setAttribute('aria-label', 'Sketch. Make. Break. Scale.');
  const wEl = el.querySelector('.tw1__w'), RED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const GLY = '/\\|_-+=*#<>:;01';
  let cur = -1, anim = 0;
  const show = (i) => { if (i === cur) return; const prev = cur; cur = i; const w = W[i];
    wEl.className = 'tw1__w' + (w.m ? ' mono' : ''); cancelAnimationFrame(anim);
    if (RED || prev < 0) { wEl.textContent = w.t; return; }
    const t0 = performance.now(), dur = 420 + w.t.length * 40, txt = w.t;
    const tick = (now) => { const q = (now - t0) / dur; let out = '';
      for (let c = 0; c < txt.length; c++) { const at = c / txt.length * .6; out += q > at + .35 ? txt[c] : GLY[(Math.random() * GLY.length) | 0]; }
      wEl.textContent = out; if (q < 1) anim = requestAnimationFrame(tick); else wEl.textContent = txt; };
    anim = requestAnimationFrame(tick); };
  let raf = 0;
  const set = () => { raf = 0; const r = sec.getBoundingClientRect(), vh = innerHeight;
    const p = Math.max(0, Math.min(.999, (vh * .8 - r.top) / (vh * .8 + r.height * .15)));   // from the section arriving to just before the footer
    show(Math.min(3, Math.floor(p * 4))); };
  const req = () => { if (!raf) raf = requestAnimationFrame(set); };
  addEventListener('scroll', req, { passive: true }); addEventListener('resize', req);
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(set); set();
})();
