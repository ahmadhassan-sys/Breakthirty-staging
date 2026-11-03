const T = (window.B30_CONTENT.testimonials || {}).items || [];   // edit them in src/data/home.js
/* Testimonials slider (Figma 4580:5887): one testimonial per dashed frame, in a row that starts with the first one
   (Evan) and ends with the last one sitting flush against the right edge of the page — no empty space after it.
   Next (click, Enter, →) slides the row one frame to the left; after the last one it glides back to the first.
   Drag (mouse or touch) moves it with you and settles on the nearest stop. The frame in view carries a pixel on each
   corner. Hovering a portrait plays the case studies' hover (the grid bends with the cursor and splits into its
   colours, and a ragged patch of pixels under it shows the next testimonial's portrait), with the word "Next". */
(() => {
  const S = document.querySelector('.ts'), sl = S && S.querySelector('.ts__sl'); if (!sl) return;
  const trk = sl.querySelector('.ts__trk'), tpl = sl.querySelector('.ts__vtpl'), cntEl = S.querySelector('.ts__count'), cur = document.querySelector('.ts__cur');
  const RED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const N = T.length;
  const pad = (n) => String(n).padStart(2, '0');
  const esc = (t) => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  trk.innerHTML = T.map((t, i) => `
    <article class="ts__card" aria-roledescription="slide" aria-label="${i + 1} of ${N}">
      <i class="ts__pc t l" aria-hidden="true"></i><i class="ts__pc t r" aria-hidden="true"></i><i class="ts__pc b l" aria-hidden="true"></i><i class="ts__pc b r" aria-hidden="true"></i>
      <div class="ts__in">
        <div class="ts__txt">
          <blockquote class="ts__qt">${t.q.map((p) => `<p>${esc(p)}</p>`).join('')}</blockquote>
          <div class="ts__by2">
            <div class="ts__who2"><span class="ts__nm">${esc(t.who)}</span><span class="ts__og">${esc(t.org)}</span></div>
            <div class="ts__v2"></div>
          </div>
        </div>
        <div class="ts__ph" data-i="${i}"><img src="${t.img}" alt="${esc(t.who)}" draggable="false" loading="lazy"><span class="ts__word" aria-hidden="true">Next</span></div>
      </div>
    </article>`).join('');
  trk.querySelectorAll('.ts__v2').forEach((v) => v.appendChild(tpl.content.cloneNode(true)));
  const cards = [...trk.children];
  let idx = 0, x = 0, stops = [0];
  // where the row stops for each testimonial: one frame at a time, the last one flush with the right edge
  function measure() {
    const w = cards[0].getBoundingClientRect().width || 1, left = trk.offsetLeft, W = sl.clientWidth, gap = parseFloat(getComputedStyle(trk).columnGap) || 0, step = w + gap;
    const max = Math.max(0, N * step - gap + left - W);
    stops = cards.map((_, i) => -Math.min(i * step, max));
  }
  function set(px, anim) {
    trk.style.transition = anim && !RED ? 'transform 1.8s cubic-bezier(.22,1,.36,1)' : 'none';   // quick off the mark, a long soft settle
    trk.style.transform = `translate3d(${px.toFixed(2)}px,0,0)`; x = px;
  }
  function go(n, anim = true) {
    measure();                                                   // sizes follow the page width (--u), so measure every time
    idx = Math.max(0, Math.min(N - 1, n));
    set(stops[idx], anim);
    cards.forEach((c, i) => { c.classList.toggle('on', i === idx); c.setAttribute('aria-hidden', String(i !== idx)); });
    if (cntEl) cntEl.textContent = `${pad(idx + 1)}/${pad(N)}`;
  }
  const next = () => go(idx === N - 1 ? 0 : idx + 1), prev = () => go(idx - 1);
  measure(); go(0, false);
  addEventListener('resize', () => { measure(); go(idx, false); });

  // drag (mouse and touch); a press without moving is a click = next
  let down = null, moved = false;
  sl.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    measure(); const m = new DOMMatrix(getComputedStyle(trk).transform); set(m.m41, false);   // catch it where it is
    down = { x: e.clientX, y: e.clientY, x0: x, lastX: e.clientX, lastT: performance.now(), v: 0, id: e.pointerId, lock: null }; moved = false;
  });
  addEventListener('pointermove', (e) => {
    if (!down || e.pointerId !== down.id) return;
    const dx = e.clientX - down.x, dy = e.clientY - down.y;
    if (down.lock === null && Math.hypot(dx, dy) > 6) down.lock = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    if (down.lock !== 'x') return;
    moved = true; sl.classList.add('is-drag');
    try { sl.setPointerCapture(down.id); } catch (_) {}
    const now = performance.now(); down.v = (e.clientX - down.lastX) / Math.max(1, now - down.lastT); down.lastX = e.clientX; down.lastT = now;
    let nx = down.x0 + dx; const lo = stops[N - 1];
    if (nx > 0) nx *= .35; else if (nx < lo) nx = lo + (nx - lo) * .35;   // a little give past either end
    set(nx, false);
  });
  const up = (e) => {
    if (!down || (e && e.pointerId !== down.id)) return;
    const d = down; down = null; sl.classList.remove('is-drag');
    if (!moved) { go(idx); return; }
    let n = 0, best = Infinity; stops.forEach((st, i) => { const dd = Math.abs(st - x); if (dd < best) { best = dd; n = i; } });
    if (Math.abs(d.v) > .45 && n === idx) n = idx + (d.v < 0 ? 1 : -1);   // a flick moves on one
    go(n);
  };
  addEventListener('pointerup', up); addEventListener('pointercancel', up);
  const side = (e) => { const c = e.target.closest && e.target.closest('.ts__card'); const k = c ? cards.indexOf(c) : idx; return k < idx ? -1 : 1; };   // a frame to the left = back
  sl.addEventListener('click', (e) => { if (moved) { moved = false; return; } if (side(e) < 0) prev(); else next(); });
  sl.addEventListener('dragstart', (e) => e.preventDefault());
  sl.tabIndex = 0;
  sl.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next(); } if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); } });

  // the "Next" cursor (off over a portrait: there the word sits on the picture, as on the case studies)
  if (cur) {
    let cx = 0, cy = 0, tx = 0, ty = 0, raf = 0;
    const lbl = cur.querySelector('b');
    const loop = () => { cx += (tx - cx) * .22; cy += (ty - cy) * .22; cur.style.translate = `${cx.toFixed(1)}px ${cy.toFixed(1)}px`; raf = Math.abs(tx - cx) + Math.abs(ty - cy) > .5 ? requestAnimationFrame(loop) : 0; };
    sl.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'mouse') return; cx = tx = e.clientX; cy = ty = e.clientY; loop(); });
    sl.addEventListener('pointermove', (e) => { if (e.pointerType !== 'mouse') return; tx = e.clientX; ty = e.clientY;
      const drag = sl.classList.contains('is-drag'); if (lbl) lbl.textContent = drag ? 'Drag' : side(e) < 0 ? 'Previous' : 'Next';
      cur.classList.toggle('on', drag || !e.target.closest('.ts__ph')); if (!raf) raf = requestAnimationFrame(loop); });   // over a portrait the word sits in the picture instead
    sl.addEventListener('pointerleave', () => cur.classList.remove('on'));
  }

  /* ---- the portrait hover: one WebGL canvas, moved into whichever portrait is under the cursor ---- */
  if (RED || !matchMedia('(hover: hover)').matches) return;
  const cv = document.createElement('canvas'); cv.className = 'ts__gl'; cv.setAttribute('aria-hidden', 'true');
  const gl = cv.getContext('webgl2', { alpha: true, premultipliedAlpha: false, antialias: false }); if (!gl) return;
  const GW = 28, GH = Math.round(28 * 628 / 600);
  const VS = `#version 300 es
in vec2 p; out vec2 vUv; void main(){ vUv = p*.5+.5; gl_Position = vec4(p,0.,1.); }`;
  const FS = `#version 300 es
precision highp float; in vec2 vUv; out vec4 o;
uniform sampler2D uT, uD, uN; uniform vec2 uRes, uS, uSN, uM; uniform float uHv, uK;
vec2 cover(vec2 uv){ float ra = uRes.x/uRes.y, ri = uS.x/uS.y; vec2 sc = ra > ri ? vec2(1., ri/ra) : vec2(ra/ri, 1.); return (uv-.5)*sc + .5; }
vec2 coverN(vec2 uv){ float ra = uRes.x/uRes.y, ri = uSN.x/uSN.y; vec2 sc = ra > ri ? vec2(1., ri/ra) : vec2(ra/ri, 1.); return (uv-.5)*sc + .5; }
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main(){
  vec2 uv = vec2(vUv.x, 1.-vUv.y), uv0 = uv;
  vec2 d = texture(uD, uv).rg;
  vec2 c = cover(uv - d);
  o = vec4(texture(uT, c + d*.4).r, texture(uT, c).g, texture(uT, c - d*.4).b, 1.);
  if (uHv > .001) {
    // the peek: under the cursor, a ragged patch of pixels shows the next testimonial
    vec2 px = uv0 * uRes, cell = floor(px / uK), g = (cell + .5) * uK;
    float r = uHv * min(uRes.x, uRes.y) * .15, dd = length(g - uM * uRes) + (h(cell) - .5) * uK * 1.6;
    if (dd < r) { float l = dot(o.rgb, vec3(.299, .587, .114)); o = vec4(vec3(l), 1.); }   // the ragged pixel patch under the cursor: this same portrait, in black & white
  }
}`;
  const sh = (t, src) => { const x = gl.createShader(t); gl.shaderSource(x, src); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(x); return x; };
  let U = {};
  try {
    const prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog); gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    ['uT', 'uD', 'uN', 'uRes', 'uS', 'uSN', 'uM', 'uHv', 'uK'].forEach((k) => (U[k] = gl.getUniformLocation(prog, k)));
    gl.uniform1i(U.uT, 0); gl.uniform1i(U.uD, 1); gl.uniform1i(U.uN, 2);
  } catch (err) { console.warn('Testimonials: hover effect unavailable', err); return; }
  const params = (f) => [[gl.TEXTURE_MIN_FILTER, f], [gl.TEXTURE_MAG_FILTER, f], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]].forEach(([k, v]) => gl.texParameteri(gl.TEXTURE_2D, k, v));
  const disp = new Float32Array(GW * GH * 2), dTex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, dTex); params(gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG32F, GW, GH, 0, gl.RG, gl.FLOAT, disp);
  const tex = [], size = [];
  const load = (i) => new Promise((res) => { if (tex[i]) return res(); const im = new Image(); im.onload = () => { size[i] = [im.naturalWidth, im.naturalHeight]; tex[i] = gl.createTexture(); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex[i]); params(gl.LINEAR); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im); size[i] = [im.naturalWidth, im.naturalHeight]; res(); }; im.src = T[i].img; });
  const m = { x: .5, y: .5, sx: .5, sy: .5, vx: 0, vy: 0, px: null, py: null, inside: false };
  let host = null, word = null, hv = 0, raf = 0, last = 0;
  function frame(now) {
    raf = 0;
    if (!host) return;
    const i = +host.dataset.i, nI = i;   // the peek shows the same portrait (each testimonial stands alone)
    if (!tex[i] || !size[i]) { raf = requestAnimationFrame(frame); return; }
    const dt = Math.min(.05, (now - (last || now)) / 1000); last = now;
    const r = host.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2), cw = Math.round(r.width * dpr), ch = Math.round(r.height * dpr);
    if (cv.width !== cw || cv.height !== ch) { cv.width = cw; cv.height = ch; }
    gl.viewport(0, 0, cw, ch);
    const rad = .22 * GW; let active = m.inside;
    for (let j = 0; j < GH; j++) for (let k = 0; k < GW; k++) { const q = (j * GW + k) * 2;
      if (m.inside) { const dd = Math.hypot(k + .5 - m.x * GW, j + .5 - m.y * GH); if (dd < rad) { const pw = Math.pow(1 - dd / rad, 2) * .9; disp[q] += m.vx * pw; disp[q + 1] += m.vy * pw; } }
      disp[q] *= .925; disp[q + 1] *= .925; if (!active && (Math.abs(disp[q]) > 1e-5 || Math.abs(disp[q + 1]) > 1e-5)) active = true; }
    m.vx *= .85; m.vy *= .85; m.sx += (m.x - m.sx) * .22; m.sy += (m.y - m.sy) * .22;
    hv += ((m.inside ? 1 : 0) - hv) * Math.min(1, dt * 7);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, dTex); gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, GW, GH, gl.RG, gl.FLOAT, disp);
    gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, tex[nI]);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex[i]);
<<<<<<< HEAD
    gl.uniform2f(U.uRes, cw, ch); gl.uniform2f(U.uS, ...size[i]); gl.uniform2f(U.uSN, ...size[nI]); gl.uniform2f(U.uM, m.sx, m.sy); gl.uniform1f(U.uHv, 0); /* the hover patch is off everywhere: the picture never changes under the cursor (only the black label follows it) */ gl.uniform1f(U.uK, Math.round(12 * cw / 609));
=======
    gl.uniform2f(U.uRes, cw, ch); gl.uniform2f(U.uS, ...size[i]); gl.uniform2f(U.uSN, ...size[nI]); gl.uniform2f(U.uM, m.sx, m.sy); gl.uniform1f(U.uHv, hv); gl.uniform1f(U.uK, Math.round(12 * cw / 609));
>>>>>>> f0e7d935b7adba6199409368d09b447496a99313
    if (word) { word.classList.toggle('on', m.inside); word.style.translate = `calc(${(m.sx * r.width).toFixed(1)}px - 50%) calc(${(m.sy * r.height).toFixed(1)}px - 50%)`; }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (active || hv > .01) raf = requestAnimationFrame(frame);
    else { cv.remove(); host.classList.remove('is-gl'); if (word) word.classList.remove('on'); host = null; word = null; }   // settled: hand back to the plain photo
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
  trk.addEventListener('pointerover', (e) => {
    const ph = e.target.closest('.ts__ph'); if (!ph || e.pointerType !== 'mouse') return;
    if (host !== ph) { if (host) host.classList.remove('is-gl'); if (word) word.classList.remove('on'); disp.fill(0); hv = 0; host = ph; word = ph.querySelector('.ts__word'); word.textContent = cards.indexOf(ph.closest('.ts__card')) < idx ? 'Previous' : 'Next'; ph.insertBefore(cv, word); const ii = +ph.dataset.i; Promise.all([load(ii)]).then(() => { if (host === ph) ph.classList.add('is-gl'); }); }
    { const r = ph.getBoundingClientRect(); m.x = m.sx = (e.clientX - r.left) / r.width; m.y = m.sy = (e.clientY - r.top) / r.height; }
    m.inside = true; m.px = null; kick();
  });
  trk.addEventListener('pointermove', (e) => {
    if (!host || e.pointerType !== 'mouse') return;
    const r = host.getBoundingClientRect(), xx = (e.clientX - r.left) / r.width, yy = (e.clientY - r.top) / r.height;
    const inside = xx >= 0 && xx <= 1 && yy >= 0 && yy <= 1; m.inside = inside;
    if (!inside) { m.px = null; kick(); return; }
    if (m.px !== null) { m.vx = xx - m.px; m.vy = yy - m.py; }
    m.x = xx; m.y = yy; m.px = xx; m.py = yy; kick();
  });
  sl.addEventListener('pointerleave', () => { m.inside = false; m.px = null; kick(); });
})();

/* Testimonials, in the Figma "After Testimonial" layout: the sky seen through a band of white pixels at the top (the
   white pixels always there, drifting with a gentle parallax), then the heading, then the quote and portrait inside a
   frame — two dashed rules, faded side lines, a pixel at each corner — that draws in as it comes into view */
(() => {
  const ts = document.querySelector(".ts"), main = ts && ts.querySelector(".ts__main"); if (!main || !matchMedia("(min-width: 900px)").matches) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fr = document.createElement("div"); fr.className = "ts__fr"; fr.setAttribute("aria-hidden", "true");
  fr.innerHTML = '<i class="fl h t"></i><i class="fl h b"></i><i class="fl v l"></i><i class="fl v r"></i><i class="sq t l"></i><i class="sq t r"></i><i class="sq b l"></i><i class="sq b r"></i>';
  ts.insertBefore(fr, ts.firstChild);
  const place = () => { const r = ts.getBoundingClientRect(), m = main.getBoundingClientRect(), W = document.documentElement.clientWidth, xl = Math.round(164 * W / 1920);
    // whole pixels, so the corner pixels sit exactly on the crossings of the 1px lines
    fr.style.setProperty("--ft", Math.round(m.top - r.top) + "px"); fr.style.setProperty("--fb", Math.round(m.bottom - r.top) + "px");
    fr.style.setProperty("--xl", xl + "px"); fr.style.setProperty("--xr", (W - xl - 1) + "px"); };
  place(); addEventListener("resize", place); new ResizeObserver(place).observe(main); document.fonts && document.fonts.ready.then(place);
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { ts.classList.add("ts-in"); o.disconnect(); } }, { threshold: 0.3 }).observe(main);
  // the sky, and the white pixels over it (Figma: 24 × 80px cells, three rows, the last one cut to 46px)
  const sky = document.createElement("div"); sky.className = "ts__sky"; sky.setAttribute("aria-hidden", "true");
  const curtain = document.createElement("div"); curtain.className = "ts__curtain"; curtain.setAttribute("aria-hidden", "true");
  const cv = document.createElement("canvas"); cv.className = "ts__skyband"; curtain.appendChild(cv); ts.insertBefore(sky, ts.firstChild); ts.insertBefore(curtain, sky.nextSibling);
  const ctx = cv.getContext("2d");
  const CELL = 80, H = 207, ROWS = { 0: [0, 2, 3, 6, 11, 12, 21, 22], 80: [0, 1, 2, 3, 4, 6, 7, 9, 11, 13, 17, 18, 21], 160: [0, 1, 2, 5, 7, 8, 9, 11, 12, 13, 16, 18, 19, 21] };   // every window connects down to the sky: nothing hangs in the air
  const rr = (n) => { const v = Math.sin(n * 91.345 + 7.13) * 43758.5453; return v - Math.floor(v); };
  const cells = []; let n = 0;
  Object.keys(ROWS).forEach((k, ri) => { const y = +k; ROWS[k].forEach((c) => cells.push({ x: c * CELL, y, h: ri < 2 ? CELL : H - y, t0: (1 - y / 160) * 0.62 + rr(++n) * 0.2 })); });
  let s = 1, dpr = 1, raf = 0, cur = reduce ? 1 : 0, lastPr = -1;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const progress = () => { if (reduce) return 1; const top = cv.getBoundingClientRect().top, vh = innerHeight; return Math.min(1, Math.max(0, (vh + 100 - top) / (vh * 0.8))); };
  function size() { s = document.documentElement.clientWidth / 1920; dpr = Math.min(devicePixelRatio || 1, 2); cv.width = Math.round(1920 * s * dpr); cv.height = Math.round(H * s * dpr); lastPr = -1; paint(); }
  function paint() {   // the white band, its windows onto the sky opening as you arrive (bottom rows first), as the footer's pixels do
    raf = 0;
    const goal = progress(); cur += (goal - cur) * (reduce ? 1 : 0.13); if (Math.abs(goal - cur) < 0.0006) cur = goal;
    if (cur !== goal) raf = requestAnimationFrame(paint);
    if (Math.abs(cur - lastPr) < 0.0002) return; lastPr = cur;
    ctx.setTransform(s * dpr, 0, 0, s * dpr, 0, 0); ctx.globalCompositeOperation = "source-over"; ctx.clearRect(0, 0, 1920, H);
    if (document.documentElement.classList.contains("dark")) return;
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, 1920, H);
    ctx.globalCompositeOperation = "destination-out";
    for (const c of cells) { const a = Math.min(1, Math.max(0, (cur - c.t0) / 0.05)); if (a <= 0) continue; const e = easeOut(a), k = 0.74 + 0.26 * e;
      const w = CELL * k + 1.5, h = c.h * k + 1.5; ctx.globalAlpha = e; ctx.fillRect(c.x + (CELL - w) / 2, c.y + (c.h - h) / 2, w, h); }
    // once open, neighbouring windows join with no hairline between them, and the last row runs on into the sky
    if (cur >= 0.999) { ctx.globalAlpha = 1; Object.keys(ROWS).forEach((k, ri) => { const y = +k, cols = ROWS[k].slice().sort((a, b) => a - b), h = ri < 2 ? CELL : H - y;
      for (let i = 0; i < cols.length; ) { let j = i; while (j + 1 < cols.length && cols[j + 1] === cols[j] + 1) j++;
        ctx.fillRect(cols[i] * CELL - 0.75, y - 0.75, (cols[j] - cols[i] + 1) * CELL + 1.5, ri < 2 ? h + 1.5 : H - y + 2); i = j + 1; } }); }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
  }
  addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(paint); }, { passive: true });
  addEventListener("resize", size); addEventListener("b30:theme", () => { lastPr = -1; paint(); });
  size();
})();

/* the testimonials' Next / Previous cursor is position:fixed — keep it a child of <body> so no transformed parent can
   throw it off the pointer */
(() => { const c = document.querySelector('.ts__cur'); if (c && c.parentNode !== document.body) document.body.appendChild(c); })();

/* testimonials: the card copy uses the page's own body-copy reveal ([data-reveal], watched by B30.observe) */
(() => {
  const S = document.getElementById('testimonials'); if (!S) return;
  const prep = () => { if (!window.B30 || !B30.observe) return false;
    S.querySelectorAll('.ts__card').forEach((card) => {
      if (card._rv) return; card._rv = 1;
      const parts = [...card.querySelectorAll('.ts__qt > p, .ts__who2, .ts__v2')];
      parts.forEach((el, i) => { el.setAttribute('data-reveal', ''); el.style.setProperty('--rd', (120 + i * 90) + 'ms'); B30.observe(el); });
    }); return true; };
  const go = () => { if (!prep()) setTimeout(go, 200); };
  go(); new MutationObserver(() => prep()).observe(S, { childList: true, subtree: true });
})();
<<<<<<< HEAD

/* =====================================================================
   Phones (≤ 899px): the testimonials deck (swipe cards with dots, each review cut at 120 words) — one version for every page (from the Our Work
   mobile design). Its styles: the phone section at the end of this component's stylesheet. Nothing here runs on desktop.
   ===================================================================== */
(() => {
  const MQ = matchMedia('(max-width: 899px)'), RED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  let built = false;
  const boot = () => { if (built || !MQ.matches) return; built = true; tsDeck(); };
  if (document.readyState === 'complete') boot(); else addEventListener('load', boot);
  MQ.addEventListener && MQ.addEventListener('change', boot);

  /* ---------- Testimonials: the homepage's phone deck — swipe cards with dots, the review cut at 120 words ---------- */
  function tsDeck() {
    const S = document.querySelector('section.ts'), top = S && S.querySelector('.ts__top'); if (!top || typeof T === 'undefined' || !T.length || S.querySelector('.tsm')) return;
    if (!top.querySelector('.ts__lede')) { const p = document.createElement('p'); p.className = 'ts__lede'; p.style.display = 'none';
      p.textContent = "Most projects need two or three of these. Handy that we all sit together. Pick one to see what's inside."; top.insertBefore(p, top.querySelector(':scope > .b30btn') || null); }
    const ver = S.querySelector('.ts__ver'), V = ver ? ver.outerHTML : '';
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const pad = (n) => String(n).padStart(2, '0');
    const quote = (ps) => { const words = ps.join(' ').split(' ');
      if (words.length <= 120) return ps.map((p) => `<p>${esc(p)}</p>`).join('');
      let left = 120; const short = []; for (const p of ps) { if (left <= 0) break; const w = p.split(' '); short.push(w.slice(0, left).join(' ')); left -= w.length; }
      short[short.length - 1] = short[short.length - 1].replace(/[,.;:\s]+$/, '') + '…';
      return `<div class="w-s">${short.map((p, i) => `<p>${esc(p)}${i === short.length - 1 ? ' <button type="button" class="tsm__more" aria-expanded="false">Read more</button>' : ''}</p>`).join('')}</div>` +
        `<div class="w-f">${ps.map((p, i) => `<p>${esc(p)}${i === ps.length - 1 ? ' <button type="button" class="tsm__more" aria-expanded="true">Read less</button>' : ''}</p>`).join('')}</div>`; };
    const MARK = '<svg class="tsm__mk" viewBox="0 0 11 9" fill="#0D1432" fill-opacity=".28" shape-rendering="crispEdges" aria-hidden="true"><rect x="0" y="2" width="2" height="5"/><rect x="2" y="0" width="2" height="3"/><rect x="2" y="5" width="2" height="2"/><rect x="6" y="2" width="2" height="5"/><rect x="8" y="0" width="2" height="3"/><rect x="8" y="5" width="2" height="2"/></svg>';
    const box = document.createElement('div'); box.className = 'tsm';
    box.innerHTML = `<div class="tsm__deck" role="region" aria-roledescription="carousel" aria-label="Testimonials" tabindex="0">${T.map((t, i) => `<article class="tsm__c" aria-label="${i + 1} of ${T.length}">${MARK}
        <blockquote class="tsm__q" data-w120="1">${quote(t.q)}</blockquote>
        <footer class="tsm__a"><div class="tsm__ph"><img src="${t.img}" alt="${esc(t.who)}" loading="lazy" draggable="false"></div>
          <div class="tsm__who"><span class="tsm__n">${esc(t.who)}</span><span class="tsm__o">${esc(t.org)}</span>${V}</div></footer></article>`).join('')}</div>
      <div class="tsm__ctl"><span class="tsm__k sr" aria-live="polite">01 / ${pad(T.length)}</span><span class="tsm__dots">${T.map((t, i) => `<button type="button" aria-label="Review ${i + 1}"></button>`).join('')}</span></div>`;
    top.after(box);
    const deck = box.querySelector('.tsm__deck'), k = box.querySelector('.tsm__k'), dots = [...box.querySelectorAll('.tsm__dots button')], cards = [...deck.children];
    const step = () => cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : deck.clientWidth;
    const idx = () => Math.max(0, Math.min(T.length - 1, Math.round(deck.scrollLeft / step())));
    const upd = () => { const i = idx(); k.textContent = pad(i + 1) + ' / ' + pad(T.length); dots.forEach((d, n) => d.setAttribute('aria-current', n === i ? 'true' : 'false')); };
    deck.addEventListener('scroll', () => requestAnimationFrame(upd), { passive: true });
    dots.forEach((d, n) => d.addEventListener('click', () => deck.scrollTo({ left: n * step(), behavior: 'smooth' })));
    deck.addEventListener('click', (e) => { const b = e.target.closest('.tsm__more'); if (b) b.closest('.tsm__c').classList.toggle('is-more'); });
    upd();
    // the frame: two dashed horizontals round the deck, two dashed verticals running past them
    ['h t', 'h b', 'v l', 'v r'].forEach((c) => { const e = document.createElement('i'); e.className = 'tsm__fr ' + c; e.setAttribute('aria-hidden', 'true'); box.appendChild(e); });
    const place = () => { box.style.setProperty('--fb', (box.offsetHeight - deck.offsetHeight) + 'px'); };
    let fr = 0; const fit = () => { fr = 0; const c = cards[idx()]; if (c) deck.style.setProperty('height', c.offsetHeight + 'px', 'important'); place(); };
    deck.addEventListener('scroll', () => { if (!fr) fr = requestAnimationFrame(fit); }, { passive: true });
    deck.addEventListener('click', () => setTimeout(fit, 0));
    fit(); addEventListener('resize', fit); setTimeout(fit, 800);
  }
})();
=======
>>>>>>> f0e7d935b7adba6199409368d09b447496a99313
