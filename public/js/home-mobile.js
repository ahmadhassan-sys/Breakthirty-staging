/* Homepage on phones (≤ 899px): from the mobile design (Homepage Final mobile 27). Nothing here runs on desktop.
   Its styles: src/styles/home-mobile.css */
/* ===== Mobile-only behaviour (≤899px). Nothing here runs on desktop. ===== */
(() => {
  const MQ = matchMedia('(max-width: 899px)');
  const RED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const io = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const oc = (t) => 1 - Math.pow(1 - t, 3);
  let built = false;
  function boot() { if (built || !MQ.matches) return; built = true; heroWheel(); stsScreen(); phonePics(); networkTap(); phoneBar(); servicesBand(); servicesScene(); globeLabels(); stone(); visionTaps(); }
  // the footer needs nothing but its own markup, so it is set up straight away (the rest waits for the page to finish loading)
  let footDone = false; const foot = () => { if (footDone || !MQ.matches) return; footDone = true; };
  foot(); MQ.addEventListener && MQ.addEventListener('change', foot);
  if (document.readyState === 'complete') boot(); else addEventListener('load', boot);
  MQ.addEventListener && MQ.addEventListener('change', boot);

  /* ---------- Services: the pixel band builds itself as you arrive (port of the desktop formation) ---------- */
  function servicesBand() {
    const mob = document.querySelector('#services .b30s__mobile'); if (!mob) return;
    const fr = Math.fround, fract = (x) => fr(x - Math.floor(x));
    const CELL = 80, TOP = -206, BOTTOM = 506;
    const FIG = { '-239': [8, 9, 10, 12, 14, 17, 18, 19, 20, 21], '-159': [1, 5, 6, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 20], '-79': [1, 3, 4, 6, 8, 9, 10, 12, 13, 14, 16, 17, 18, 21, 23] };
    const rr = (n) => { const v = Math.sin(n * 91.345 + 7.13) * 43758.5453; return v - Math.floor(v); };
    const cells = []; let n = 0;
    for (let y = -239; y < BOTTOM; y += CELL) { const row = FIG[String(y)], yn = (y - TOP) / (BOTTOM - TOP);
      for (let c = 0; c < 24; c++) { n++; if (row && !row.includes(c)) continue; cells.push({ x: c * CELL, y, t0: (1 - yn) * .62 + rr(n) * .2 }); } }
    const cv = document.createElement('canvas'); cv.className = 'b30s__pxm'; cv.setAttribute('aria-hidden', 'true'); mob.prepend(cv);
    mob.classList.add('has-pxm');
    const ctx = cv.getContext('2d'); let s = 1, dpr = 1, grad = null, cur = 0, last = -1, raf = 0;
    function size() { const W = document.documentElement.clientWidth; s = W / 1920; dpr = Math.min(devicePixelRatio || 1, 2);
      cv.style.top = TOP * s + 'px'; cv.style.height = (BOTTOM - TOP) * s + 'px';
      cv.width = Math.round(W * dpr); cv.height = Math.round((BOTTOM - TOP) * s * dpr);
      const rs = getComputedStyle(mob), bz = rs.getPropertyValue('--b30-breeze').trim() || '#B4E3F7', bm = rs.getPropertyValue('--b30s-mid').trim() || '#CBEBF9';
      grad = ctx.createLinearGradient(0, TOP, 0, BOTTOM); grad.addColorStop(0, bz); grad.addColorStop(.3, bz); grad.addColorStop(1, bm);
      last = -1; draw(); }
    const prog = () => RED ? 1 : clamp((innerHeight + 100 - (mob.getBoundingClientRect().top + TOP * s)) / (innerHeight * .8));
    function draw() { raf = 0; if (!MQ.matches) return;
      const goal = prog(); cur += (goal - cur) * (RED ? 1 : .13); if (Math.abs(goal - cur) < .0006) cur = goal; if (cur !== goal) raf = requestAnimationFrame(draw);
      if (Math.abs(cur - last) < .0002) return; last = cur;
      ctx.setTransform(s * dpr, 0, 0, s * dpr, 0, -TOP * s * dpr); ctx.clearRect(0, TOP, 1920, BOTTOM - TOP); ctx.fillStyle = grad;
      for (const c of cells) { const a = clamp((cur - c.t0) / .05); if (a <= 0) continue; const e = oc(a), sz = CELL * (.74 + .26 * e) + 1, o = (CELL - sz) / 2;
        ctx.globalAlpha = e; ctx.fillRect(c.x + o, c.y + o, sz, sz); }
      ctx.globalAlpha = 1; }
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(draw); }, { passive: true });
    addEventListener('resize', size); size();
  }

  /* ---------- Services: hands drift apart, the pixel between them becomes the cube; swipe or tap a dot to turn it ---------- */
  function servicesScene() {
    const sec = document.querySelector('#services'), mob = sec && sec.querySelector('.b30s__mobile'); if (!mob || RED) return;
    const faces = [...mob.querySelectorAll('.m-cards .b30s__face')]; if (faces.length !== 4) return;
    const robotSrc = sec.querySelector('.b30s__handimg.robot'), humanSrc = sec.querySelector('.b30s__handimg.human'); if (!robotSrc || !humanSrc) return;
    const wrap = document.createElement('div'); wrap.className = 'm3';
    wrap.innerHTML = `<div class="m3__st"><img class="m3__h r" alt="" aria-hidden="true"><img class="m3__h h" alt="" aria-hidden="true">
      <div class="m3__box"><div class="m3__cube"></div></div>
      <div class="m3__ticks" role="group" aria-label="Services">${faces.map((f, i) => `<button type="button" aria-label="${(f.querySelector('.svc__name') || {}).textContent || 'Service ' + (i + 1)}"><i></i></button>`).join('')}</div></div>`;
    mob.querySelector('.m-cards').after(wrap); mob.classList.add('has-m3');
    const st = wrap.querySelector('.m3__st'), R = wrap.querySelector('.m3__h.r'), H = wrap.querySelector('.m3__h.h'), box = wrap.querySelector('.m3__box'), cube = wrap.querySelector('.m3__cube'), ticks = [...wrap.querySelectorAll('.m3__ticks button')];
    R.src = robotSrc.getAttribute('src'); H.src = humanSrc.getAttribute('src');
    faces.forEach((f, i) => { f.classList.add('m3__f'); f.style.setProperty('--i', i); cube.appendChild(f); });
    let k = 0, ang = -120, landed = false, S = 260, Sh = 260, Wv = 390, Hv = 800;
    const RT = [.921, .59], HT = [.0645, .785];   // fingertips, as fractions of each picture
    const L = {};
    // each hand's outline, column by column (the robot's lowest pixel, the human's highest), so the box can push them
    const outline = (img, top) => { const w = 160, h = Math.max(1, Math.round(w * img.naturalHeight / img.naturalWidth)), c = document.createElement('canvas'); c.width = w; c.height = h;
      const x2 = c.getContext('2d'); x2.drawImage(img, 0, 0, w, h); let d; try { d = x2.getImageData(0, 0, w, h).data; } catch (e) { return null; }
      const out = []; for (let x = 0; x < w; x++) { let v = null; for (let y = 0; y < h; y++) if (d[(y * w + x) * 4 + 3] > 40) { v = top ? y / h : (y + 1) / h; if (top) break; } out.push(v); } return out; };
    let OR = null, OH = null;
    function layout() { Wv = st.clientWidth; Hv = st.clientHeight; S = Math.round(Math.min(Wv * .86, Hv * .46, 360));
      wrap.style.setProperty('--S', S + 'px'); wrap.style.setProperty('--Sh', S + 'px');
      // the box keeps its width but grows taller when a side's content needs more room than the square
      Sh = Math.max(S, ...faces.map((f) => Math.ceil(f.scrollHeight))); wrap.style.setProperty('--Sh', Sh + 'px');
      const RW = Wv * 1.04, HW = RW * 2093 / 1981; R.style.width = RW + 'px'; H.style.width = HW + 'px';
      L.RW = RW; L.RH = RW * 900 / 1981; L.HW = HW; L.HH = HW * 900 / 2093; tick(); }
    const face = () => ((k % 4) + 4) % 4;
    function setFace(instant) {
      if (instant) cube.style.transition = 'none';
      cube.style.transform = `translateZ(calc(var(--S) / -2)) rotateY(${ang}deg)`;
      if (instant) { void cube.offsetWidth; cube.style.transition = ''; }
      const f = landed ? face() : 0;
      faces.forEach((el, n) => el.classList.toggle('is-front', landed && n === f));
      ticks.forEach((t, n) => t.setAttribute('aria-pressed', n === f ? 'true' : 'false'));
    }
    // as on desktop: the next side comes round from the right
    const turn = (dir) => { if (!landed) return; k += dir; ang -= 90 * dir; setFace(); };
    const goTo = (i) => { if (!landed) return; let d = i - face(); if (d > 2) d -= 4; if (d < -2) d += 4; if (d) turn(d); };
    function tick() {
      const r = wrap.getBoundingClientRect(), span = Math.max(1, r.height - Hv);
      // the move starts as the scene comes up the screen (not only once it is pinned)
      const p = clamp((Hv * .3 - r.top) / (span + Hv * .3));
      const a = io(clamp(p / .5));                  // the hands part over the first half…
      const tipY = Hv * .36, gap = Wv * .035;
      const G = 26, cyF = Hv * .5;   // phones: up and down only; each hand ends the same distance from the box
      const rx = Wv * .5 - gap - RT[0] * L.RW, ry = lerp(tipY - RT[1] * L.RH, cyF - Sh / 2 - G - .971 * L.RH, a);
      const hx = Wv * .5 + gap - HT[0] * L.HW, hy = lerp(tipY - HT[1] * L.HH, cyF + Sh / 2 + G - .174 * L.HH, a);
      let ryC = ry, hyC = hy;
      // …while the pixel between the fingertips grows into the box and turns with the scroll, landing square on Design
      const g = oc(clamp((p - .04) / .46)), px0 = 14 / S;
      const cx = Wv * .5, cy = lerp(tipY + 2, cyF, g);
      box.style.transform = `translate3d(${cx - S / 2}px,${cy - Sh / 2}px,0) scale(${lerp(px0, 1, g)})`;
      // as the box grows (and turns), it never goes behind a hand: the upper hand keeps its own path (so it stays clear
      // of the text above) and the box drops just below it; the lower hand gives way under the box
      if (p <= .5) {
        if (!OR && R.complete && R.naturalWidth) OR = outline(R, false);
        if (!OH && H.complete && H.naturalWidth) OH = outline(H, true);
        const sr = st.getBoundingClientRect(); let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
        faces.forEach((f) => { const q = f.getBoundingClientRect(); x0 = Math.min(x0, q.left); x1 = Math.max(x1, q.right); y0 = Math.min(y0, q.top); y1 = Math.max(y1, q.bottom); });
        x0 -= sr.left; x1 -= sr.left; y0 -= sr.top; y1 -= sr.top;
        const m = G * g;
        if (OR) { const cw = L.RW / OR.length; let need = 0;
          OR.forEach((v, i) => { if (v == null) return; const xa = rx + i * cw; if (xa + cw < x0 - m || xa > x1 + m) return; need = Math.max(need, ry + v * L.RH + m - y0); });
          if (need > 0) { box.style.transform = `translate3d(${cx - S / 2}px,${cy + need - Sh / 2}px,0) scale(${lerp(px0, 1, g)})`; y0 += need; y1 += need; } }
        if (OH) { const cw = L.HW / OH.length; let need = 0;
          OH.forEach((v, i) => { if (v == null) return; const xa = hx + i * cw; if (xa + cw < x0 - m || xa > x1 + m) return; need = Math.max(need, y1 + m - (hy + v * L.HH)); }); hyC = hy + need; }
      }
      R.style.transform = `translate3d(${rx}px,${ryC}px,0) rotate(0deg)`;
      H.style.transform = `translate3d(${hx}px,${hyC}px,0) rotate(0deg)`;
      wrap.style.setProperty('--fc', clamp((p - .42) / .1).toFixed(3));   // the type comes in once it has landed
      const nowLanded = p > .5;
      if (!nowLanded) { if (landed) { landed = false; wrap.classList.remove('is-live'); } k = 0; ang = -120 * Math.pow(1 - clamp(p / .5), 1.1); setFace(true); }
      else if (!landed) { landed = true; k = 0; ang = 0; setFace(true); wrap.classList.add('is-live'); }
    }
    // tap: right half turns to the next side, left half to the previous (as a click does on desktop); swipe works too
    let t0 = null, swiped = false;
    st.addEventListener('touchstart', (e) => { const t = e.touches[0]; t0 = { x: t.clientX, y: t.clientY }; swiped = false; }, { passive: true });
    st.addEventListener('touchend', (e) => { if (!t0) return; const t = e.changedTouches[0], dx = t.clientX - t0.x, dy = t.clientY - t0.y; t0 = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) { swiped = true; turn(dx < 0 ? 1 : -1); } }, { passive: true });
    st.addEventListener('click', (e) => { if (swiped) { swiped = false; return; } if (!landed || e.target.closest('a, button')) return;
      const b = st.getBoundingClientRect(); turn(e.clientX - b.left > b.width / 2 ? 1 : -1); });
    ticks.forEach((t, n) => t.addEventListener('click', () => goTo(n)));
    layout();
    addEventListener('resize', layout);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
    (function loop() { requestAnimationFrame(loop); const q = wrap.getBoundingClientRect(); if (q.bottom > -50 && q.top < innerHeight + 50) tick(); })();
  }

  /* ---------- Vision: the rock, resampled once at its phone size (a pre-scaled copy: the dithered picture breaks into tiles when the browser scales it down on the fly) ---------- */
  function stone() {
    const img = document.querySelector('.vision .vs-stone'); if (!img) return;
    const SM = '/assets/images/vision/rock-phone.webp';
    const go = () => { if (img.dataset.m) return; img.dataset.m = img.src; img.src = SM; };
    go();
    MQ.addEventListener && MQ.addEventListener('change', () => { if (!MQ.matches && img.dataset.m) { img.src = img.dataset.m; delete img.dataset.m; } });
  }

  /* ---------- Vision: on a phone one tap opens a folder or picture (desktop: click selects, double-click opens) ---------- */
  function visionTaps() {
    const os = document.querySelector('.vision .vs-os'); if (!os) return;
    // the nav bar: back up the folder tree, home, and next (the next picture in BT, or forward after going back)
    const UP = { proc: 'home', bt: 'home', img: 'proc', view: 'bt', sts: 'home' }, PICS = ['before', 'after', 'about', 'breakdown'];
    const nav = document.createElement('div'); nav.className = 'vs-navm'; nav.setAttribute('role', 'group'); nav.setAttribute('aria-label', 'Phone');
    const ic = (d) => `<svg viewBox="0 0 14 14" fill="#000" shape-rendering="crispEdges" aria-hidden="true">${d}</svg>`;
    nav.innerHTML = `<button type="button" data-n="back" aria-label="Back">${ic('<rect x="8" y="2" width="2" height="2"/><rect x="6" y="4" width="2" height="2"/><rect x="4" y="6" width="2" height="2"/><rect x="6" y="8" width="2" height="2"/><rect x="8" y="10" width="2" height="2"/>')}</button>` +
      `<button type="button" data-n="home" aria-label="Home">${ic('<rect x="2" y="2" width="10" height="2"/><rect x="2" y="10" width="10" height="2"/><rect x="2" y="2" width="2" height="10"/><rect x="10" y="2" width="2" height="10"/>')}</button>` +
      `<button type="button" data-n="next" aria-label="Next">${ic('<rect x="4" y="2" width="2" height="2"/><rect x="6" y="4" width="2" height="2"/><rect x="8" y="6" width="2" height="2"/><rect x="6" y="8" width="2" height="2"/><rect x="4" y="10" width="2" height="2"/>')}</button>`;
    os.appendChild(nav);
    let fwd = [];
    const show = (sc, pic) => { if (pic) os.querySelectorAll('.vs-pic').forEach((f) => f.classList.toggle('on', f.dataset.pic === pic));
      os.dataset.screen = sc; os.querySelectorAll('.vs-ic.sel').forEach((e) => e.classList.remove('sel')); };
    const cur = () => os.dataset.screen || 'home', curPic = () => { const f = os.querySelector('.vs-pic.on'); return f ? f.dataset.pic : PICS[0]; };
    const sync = () => { const s = cur(); nav.querySelector('[data-n=back]').disabled = !UP[s]; nav.querySelector('[data-n=home]').disabled = s === 'home';
      nav.querySelector('[data-n=next]').disabled = !(s === 'view' || fwd.length); };
    new MutationObserver(sync).observe(os, { attributes: true, attributeFilter: ['data-screen'] }); sync();
    nav.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; e.stopPropagation(); const s = cur();
      if (b.dataset.n === 'back' && UP[s]) { fwd.push([s, curPic()]); show(UP[s]); }
      else if (b.dataset.n === 'home') { fwd = []; show('home'); }
      else if (b.dataset.n === 'next') { if (s === 'view') show('view', PICS[(PICS.indexOf(curPic()) + 1) % PICS.length]); else if (fwd.length) { const [sc, pic] = fwd.pop(); show(sc, sc === 'view' ? pic : null); } }
      sync(); });
    os.addEventListener('click', (e) => { if (e.target.closest('.vs-ic')) fwd = []; }, true);   // opening something new clears "forward"
    os.addEventListener('click', (e) => { if (!MQ.matches) return; const ic = e.target.closest('.vs-ic'); if (!ic) return;
      setTimeout(() => ic.dispatchEvent(new MouseEvent('dblclick', { bubbles: true })), 120); });   // the selection flashes, then it opens
  }

  /* ---------- Network: a tap anywhere in the section switches Partners ⇄ Global (not only the two buttons) ---------- */
  function networkTap() {
    const sec = document.querySelector('#partners-network'), sw = sec && sec.querySelector('.nx__switch'); if (!sw) return;
    let x0 = 0, y0 = 0, moved = false;
    sec.addEventListener('pointerdown', (e) => { x0 = e.clientX; y0 = e.clientY; moved = false; }, { passive: true });
    sec.addEventListener('pointermove', (e) => { if (Math.hypot(e.clientX - x0, e.clientY - y0) > 10) moved = true; }, { passive: true });
    sec.addEventListener('click', (e) => { if (!MQ.matches || moved || e.target.closest('a, button, .nx__switch')) return;
      const to = sw.dataset.on === 'global' ? 'partner' : 'global', b = sw.querySelector(`button[data-to="${to}"]`); if (b) b.click(); });
  }

  /* ---------- Vision phone: a status bar with the live time ---------- */
  function phoneBar() {
    const os = document.querySelector('.vision .vs-os'); if (!os) return;
    const bar = document.createElement('div'); bar.className = 'vs-sbar'; bar.setAttribute('aria-hidden', 'true');
    bar.innerHTML = '<span class="t"></span><span class="r">' +
      '<svg viewBox="0 0 13 9" fill="#000" shape-rendering="crispEdges"><rect x="0" y="6" width="2" height="3"/><rect x="3.5" y="4" width="2" height="5"/><rect x="7" y="2" width="2" height="7"/><rect x="10.5" y="0" width="2" height="9"/></svg>' +
      '<svg viewBox="0 0 12 9" fill="#000" shape-rendering="crispEdges"><rect x="0" y="1" width="2" height="2"/><rect x="2" y="0" width="8" height="1.6"/><rect x="10" y="1" width="2" height="2"/><rect x="2.5" y="3.6" width="2" height="1.6"/><rect x="4.5" y="2.6" width="3" height="1.6"/><rect x="7.5" y="3.6" width="2" height="1.6"/><rect x="5" y="6.4" width="2" height="2.6"/></svg>' +
      '<svg viewBox="0 0 22 9" fill="none" shape-rendering="crispEdges"><rect x=".5" y=".5" width="18" height="8" rx="2" stroke="#000" stroke-opacity=".45"/><rect x="2" y="2" width="12" height="5" rx="1" fill="#000"/><rect x="19.5" y="3" width="1.5" height="3" fill="#000" fill-opacity=".45"/></svg></span>';
    os.appendChild(bar);
    const t = bar.querySelector('.t'), tick = () => { const d = new Date(); t.textContent = d.getHours() % 12 + (d.getHours() % 12 ? 0 : 12) + ':' + String(d.getMinutes()).padStart(2, '0'); };
    tick(); setInterval(tick, 15000);
  }

  /* ---------- Vision phone: the BT pictures, redrawn at the phone's shape (no × baked in; desktop keeps its own) ---------- */
  function phonePics() {
    const P = {before:'/assets/images/vision/phone-before.png',after:'/assets/images/vision/phone-after.gif',about:'/assets/images/vision/phone-about.png',breakdown:'/assets/images/vision/phone-breakdown.jpg'};
    const swap = (on) => document.querySelectorAll('.vision .vs-pic').forEach((f) => { const im = f.querySelector('img'), k = f.dataset.pic; if (!im || !P[k]) return;
      if (on && !im.dataset.d) { im.dataset.d = im.getAttribute('src'); im.src = P[k]; } else if (!on && im.dataset.d) { im.src = im.dataset.d; delete im.dataset.d; } });
    swap(true); MQ.addEventListener && MQ.addEventListener('change', () => swap(MQ.matches));
  }

  /* ---------- Hero: on short screens, where the services wheel would run into "Say hello", the wheel is left out;
     on taller screens it shows. Nothing moves or scales — only the wheel comes and goes ---------- */
  function heroWheel() {
    const hero = document.querySelector('.b30h'), btn = hero && hero.querySelector('.b30h__intro .b30h__btn'), orbit = hero && hero.querySelector('.b30h__orbit'); if (!btn || !orbit) return;
    const check = () => { if (!MQ.matches) { hero.classList.remove('no-wheel'); return; } if (scrollY > 40) return;
      const tops = [...orbit.querySelectorAll('*')].map((e) => e.getBoundingClientRect()).filter((r) => r.width && r.height).map((r) => r.top);
      const top = tops.length ? Math.min(...tops) : orbit.getBoundingClientRect().top;
      hero.classList.toggle('no-wheel', btn.getBoundingClientRect().bottom + 16 > top); };
    check(); addEventListener('resize', check); setTimeout(check, 700);
  }

  /* ---------- Vision phone: "Sketch to Scale" opens a screen of its own — the four steps lighting up in turn ---------- */
  function stsScreen() {
    const os = document.querySelector('.vision .vs-os'), ic = os && os.querySelector('.vs-ic[data-open="clients"]'); if (!ic) return;
    const S = [['01', 'Sketch', 'Know the business, get the idea down fast.', '#F3EA08'], ['02', 'Make', 'Brand, design, build: the real thing.', '#B4E3F7'],
      ['03', 'Break', 'Test it hard before the world does.', '#D1E1D4'], ['04', 'Scale', 'Launch, then keep it growing.', '#F7D6FB']];
    const scr = document.createElement('div'); scr.className = 'vs-scr s-sts';
    scr.innerHTML = '<p class="sts__h">Sketch to Scale</p><p class="sts__s">Four steps · one team</p><ol class="sts__l">' +
      S.map(([n, t, d, c]) => `<li style="--c:${c}"><b>${n}</b><span><strong>${t}</strong><em>${d}</em></span><i><u></u></i></li>`).join('') + '</ol>';
    os.appendChild(scr);
    ic.addEventListener('dblclick', () => { if (MQ.matches) { os.dataset.screen = 'sts'; } });
    const items = [...scr.querySelectorAll('li')]; let k = 0, tm = 0;
    const run = () => { items.forEach((li, i) => li.classList.toggle('on', i === k)); k = (k + 1) % items.length; tm = setTimeout(run, 1600); };
    new MutationObserver(() => { clearTimeout(tm); if (os.dataset.screen === 'sts') { k = 0; run(); } else items.forEach((li) => li.classList.remove('on')); }).observe(os, { attributes: true, attributeFilter: ['data-screen'] });
  }

  /* ---------- Network globe: labels near the right edge open to the left so they stay on screen ---------- */
  function globeLabels() {
    const grid = document.querySelector('.nx__grid'); if (!grid) return;
    (function loop() { requestAnimationFrame(loop); const gr = grid.getBoundingClientRect(); if (gr.bottom < 0 || gr.top > innerHeight) return;
      grid.querySelectorAll('.nx__loc').forEach((e) => { const x = e.getBoundingClientRect().left - gr.left; e.classList.toggle('m-flip', x > gr.width * .55); }); })();
  }
})();
/* ---------- Vision (mobile): the same clouds as desktop, around the rock ---------- */

/* =====================================================================
   Sketch to scale — the footer's clouds, around the rock. The same cloud formulas as the footer's sky (its back cloud
   bank and its front clouds, same noise, same colours, same drift speed), drawn on their own with a clear background:
   one canvas behind the tablet and rock (the bank), one in front of the rock (the wisps).
   ===================================================================== */
(() => {
  const v = document.querySelector('section.vision'); if (!v) return;
  const __mq = matchMedia('(max-width: 899px)'), __want = () => __mq.matches;
  const __start = () => {
  const dev = v.querySelector('.vs-dev'), host = dev ? dev.parentNode : v;
  const VS = `#version 300 es
  in vec2 aPos; void main(){ gl_Position = vec4(aPos,0.0,1.0); }`;
  const FS = `#version 300 es
  precision highp float;
  out vec4 outColor;
  uniform vec2 uRes; uniform float uTime, uKind, uNight;
  uniform vec4 uBand;   // back: x = horizon (uv, y up) · front: x = baseline, y = band height
  float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx)*.1031); p3 += dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
  float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*f*(f*(f*6.0-15.0)+10.0);
    float a = hash12(i), b = hash12(i+vec2(1,0)), c = hash12(i+vec2(0,1)), d = hash12(i+vec2(1,1)); return mix(mix(a,b,u.x), mix(c,d,u.x), u.y); }
  const mat2 ROT = mat2(0.8,-0.6,0.6,0.8);
  float fbm(vec2 p, int oct){ float s = 0.0, a = 0.5, n = 0.0; for (int i = 0; i < 6; i++){ if (i >= oct) break; s += a*vnoise(p); n += a; p = ROT*p*2.03 + vec2(17.1, 9.2); a *= 0.5; } return s/n; }
  void main(){
    vec2 uv = gl_FragCoord.xy/uRes; float asp = uRes.x/uRes.y, t = uTime;
    float warm = smoothstep(0.62, 0.08, uv.x);
    vec3 col; float A;
    if (uKind < 0.5) {   /* ---------- the back cloud bank (as in the footer) ---------- */
      float hBase = uBand.x + 0.10*smoothstep(0.35,1.0,uv.x);
      float dB = 0.0, nb = 0.5, bodyB = 0.0;
      if (uv.y < hBase + 0.22){
        vec2 bp = vec2(uv.x*asp, uv.y);
        float hB = hBase + 0.16*(fbm(vec2(bp.x*0.8 + t*0.006, 3.7),3)-0.5);
        vec2 wb = vec2(fbm(bp*1.1 + vec2(t*0.020,0.0),2), fbm(bp*1.1 + vec2(4.3,2.1) - t*0.015,2));
        nb = fbm(bp*2.3 + wb*1.2 + vec2(t*0.035,0.0), 5);
        bodyB = (hB - uv.y)/0.20;
        float vB = bodyB*0.75 + (nb-0.5)*2.2;
        dB = smoothstep(0.0, 0.62, vB) * smoothstep(hBase + 0.22, hBase + 0.12, uv.y);
      }
      float tone = smoothstep(0.35,0.75,nb);
      vec3 bShadow = vec3(0.86,0.90,0.95);   // white clouds: a cool grey in the shadows, pure white on top
      vec3 bBase   = vec3(0.95,0.97,0.99);
      vec3 bHi     = vec3(1.0);
      float depthB = smoothstep(0.0,1.8,bodyB);
      col = mix(bBase, bShadow, depthB*0.75*(1.0-tone)); col = mix(col, bHi, tone*tone*(1.0-depthB*0.6)*0.75);
      A = dB*0.95 * smoothstep(0.0, 0.26, uv.y) * smoothstep(0.12, 0.44, nb);   // fewer: only the fuller parts of the bank     // (softened to nothing at the very bottom edge)
    } else {             /* ---------- the front clouds (as in the footer) ---------- */
      float y0 = uBand.x, lh = uBand.y, dF = 0.0, nf = 0.5;
      vec2 fp = vec2(uv.x*asp, uv.y); float tf = t*1.6;
      if (uv.y < y0 + lh*1.1){
        float ridge  = fbm(vec2(fp.x*0.9 + tf*0.010, 7.3), 3);
        float ridge2 = fbm(vec2(fp.x*1.3 - tf*0.008, 2.1), 2);
        float hF   = y0 + lh*(-0.35 + 1.05*smoothstep(0.38,0.70,ridge));
        float lowF = y0 - lh*(0.25 + 0.9*ridge2);
        vec2 wf = vec2(fbm(fp*1.6 + vec2(tf*0.020,1.7),2), fbm(fp*1.6 + vec2(8.1,-tf*0.018),2));
        nf = fbm(fp*3.2 + wf*1.25 + vec2(tf*0.04,0.0), 5);
        float patchN = fbm(fp*vec2(1.1,1.7) + vec2(-tf*0.012,12.0), 3);
        float body = min((hF - uv.y)/(lh*0.55), (uv.y - lowF)/(lh*0.45));
        float vF = body*0.6 + (nf-0.5)*2.6 + (patchN-0.56)*1.2 - 0.12;   // (a few more wisps than before, still fewer than the footer)
        dF = smoothstep(0.02, 0.55, vF) * smoothstep(y0 + lh*1.1, y0 + lh*0.5, uv.y);
      }
      float ft = smoothstep(0.30,0.80,nf);
      vec3 fShadow = vec3(0.88,0.91,0.95);
      vec3 fBase   = vec3(0.96,0.97,0.99);
      vec3 fHi     = vec3(1.0);
      col = mix(fShadow, fBase, ft); col = mix(col, fHi, ft*ft*0.7);
      A = dF*0.92 * smoothstep(0.0, 0.16, uv.y);
    }
    col += (hash12(gl_FragCoord.xy + fract(t*0.37)*113.0) - 0.5)*0.014;   // the same fine grain
    if (uNight > 0.0) { float L = dot(col, vec3(0.299,0.587,0.114)); vec3 night = mix(col*vec3(0.22,0.26,0.45), col*vec3(0.60,0.62,0.84), smoothstep(0.82,0.98,L)); col = mix(col, night, uNight); }
    outColor = vec4(col*A, A);   // premultiplied
  }`;
  const make = (kind) => {
    const c = document.createElement('canvas'); c.className = 'vs-cloudm ' + (kind ? 'front' : 'back'); c.setAttribute('aria-hidden', 'true');
    if (kind) host.appendChild(c); else host.insertBefore(c, host.firstChild);
    const gl = c.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false }); if (!gl) { c.remove(); return null; }
    const sh = (t, src) => { const s2 = gl.createShader(t); gl.shaderSource(s2, src); gl.compileShader(s2); return s2; };
    const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { c.remove(); return null; }
    const vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'aPos'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.useProgram(pr);
    return { c, gl, U: { res: gl.getUniformLocation(pr, 'uRes'), time: gl.getUniformLocation(pr, 'uTime'), kind: gl.getUniformLocation(pr, 'uKind'), night: gl.getUniformLocation(pr, 'uNight'), band: gl.getUniformLocation(pr, 'uBand') }, kind };
  };
  const place = () => { return; const vr = v.getBoundingClientRect(), hr = host.getBoundingClientRect(); host.style.setProperty('--sx', (hr.left - vr.left) + 'px'); host.style.setProperty('--sy', (hr.top - vr.top) + 'px'); };
  place(); addEventListener('resize', place);
  const L = [make(0), make(1)].filter(Boolean); if (!L.length) return;
  // the bank's horizon sits just above the rock's top (behind the tablet's foot); the wisps ride across the rock's lower half
  const BAND = [[0.78, 0, 0, 0], [0.5, 0.44, 0, 0]];   // the wisps reach up across the rock, nearly to its top
  // on the phone the bank's horizon is pinned to the rock's top surface (as on desktop), wherever the layout puts it
  const stoneEl = v.querySelector('.vs-stone');
  const bandOf = (o) => { if (o.kind || !stoneEl) return BAND[o.kind];
    const cr = o.c.getBoundingClientRect(), sr = stoneEl.getBoundingClientRect(); if (!cr.height || !sr.height) return BAND[0];
    return [Math.min(.95, Math.max(.2, (cr.bottom - (sr.top + sr.height * .1)) / cr.height)), 0, 0, 0]; };
  let t = 0, last = 0, on = false, raf = 0, skip = false;
  const RED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const draw = (now) => { raf = on ? requestAnimationFrame(draw) : 0;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016); last = now; t += dt * (RED ? 0.35 : 1);   // the footer's pace
    if ((skip = !skip)) return;   // 30 fps, as the footer's clouds idle
    const night = document.documentElement.classList.contains('dark') ? 1 : 0, dpr = Math.min(1.5, devicePixelRatio || 1);
    L.forEach((o) => { const w = Math.round(o.c.clientWidth * dpr), h = Math.round(o.c.clientHeight * dpr); if (!w) return;
      if (o.c.width !== w || o.c.height !== h) { o.c.width = w; o.c.height = h; }
      const gl = o.gl; gl.viewport(0, 0, w, h); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(o.U.res, w, h); gl.uniform1f(o.U.time, t + 40); gl.uniform1f(o.U.kind, o.kind); gl.uniform1f(o.U.night, night); gl.uniform4f(o.U.band, ...bandOf(o));
      gl.drawArrays(gl.TRIANGLES, 0, 3); }); };
  new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on && !raf) { last = 0; raf = requestAnimationFrame(draw); } }).observe(L[0].c);

  };
  // built now if this width wants it, else the first time the window crosses to it (a resize, a rotated tablet)
  if (__want()) __start(); else { const __h = () => { if (__want()) { __mq.removeEventListener('change', __h); __start(); } }; __mq.addEventListener('change', __h); }
})();
