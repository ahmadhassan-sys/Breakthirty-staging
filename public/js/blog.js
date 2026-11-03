/* The blog page (/blog): pictures wipe in, the pictures' hover, the "Read" cursor, the tag filters, the hero's length.
   From the design (Figma B30 › Blog). */
/* blog: images wipe in as they come up; "Load more guides" shows the next nine (their copy rises in like the rest) */
(() => {
  const root = document.getElementById('blogs'); if (!root) return;
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
    { rootMargin: '0px 0px -8% 0px', threshold: 0 });
  const watch = () => document.querySelectorAll('.blg-img:not(.in)').forEach((el) => io.observe(el));
  watch();
})();

/* the blog's images (the "Must read" one and every guide's): the testimonials' portrait hover — the picture bends under
   the cursor, a ragged patch of pixels turns that same picture black & white (it never changes to another), and the
   word "Read" rides with the cursor. One WebGL canvas, moved into whichever image is under the cursor. */
(() => {
  const hosts = [...document.querySelectorAll('.blg-img')]; if (!hosts.length) return;
  hosts.forEach((h) => { const w = document.createElement('span'); w.className = 'blg-word'; w.setAttribute('aria-hidden', 'true'); w.textContent = 'Read'; h.appendChild(w); });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !matchMedia('(hover: hover)').matches) return;
  const srcOf = (h) => { const i = h.querySelector('.blg-img__in'); return (i && (i.currentSrc || i.src)) || (getComputedStyle(i).backgroundImage.match(/url\(["']?(.*?)["']?\)$/) || [])[1]; };   // the picture (an <img> here)
  let host = null, word = null;
  const cv = document.createElement('canvas'); cv.className = 'blg-gl'; cv.setAttribute('aria-hidden', 'true');
  const gl = cv.getContext('webgl2', { alpha: true, premultipliedAlpha: false, antialias: false }); if (!gl) return;
  const GW = 28, GH = Math.round(28 * 619 / 782);
  const VS = `#version 300 es
in vec2 p; out vec2 vUv; void main(){ vUv = p*.5+.5; gl_Position = vec4(p,0.,1.); }`;
  const FS = `#version 300 es
precision highp float; in vec2 vUv; out vec4 o;
uniform sampler2D uT, uD; uniform vec2 uRes, uS, uM; uniform float uHv, uK;
vec2 cover(vec2 uv){ float ra = uRes.x/uRes.y, ri = uS.x/uS.y; vec2 sc = ra > ri ? vec2(1., ri/ra) : vec2(ra/ri, 1.); return (uv-.5)*sc + .5; }
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main(){
  vec2 uv = vec2(vUv.x, 1.-vUv.y), uv0 = uv;
  vec2 d = texture(uD, uv).rg;
  vec2 c = cover(uv - d);
  o = vec4(texture(uT, c + d*.4).r, texture(uT, c).g, texture(uT, c - d*.4).b, 1.);
  if (uHv > .001) {
    vec2 px = uv0 * uRes, cell = floor(px / uK), g = (cell + .5) * uK;
    float r = uHv * min(uRes.x, uRes.y) * .15, dd = length(g - uM * uRes) + (h(cell) - .5) * uK * 1.6;
    if (dd < r) { float l = dot(o.rgb, vec3(.299, .587, .114)); o = vec4(vec3(l), 1.); }
  }
}`;
  const sh = (t, s) => { const x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(x); return x; };
  const U = {};
  try {
    const prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog); gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    ['uT', 'uD', 'uRes', 'uS', 'uM', 'uHv', 'uK'].forEach((k) => (U[k] = gl.getUniformLocation(prog, k)));
    gl.uniform1i(U.uT, 0); gl.uniform1i(U.uD, 1);
  } catch (err) { return; }
  const params = (f) => [[gl.TEXTURE_MIN_FILTER, f], [gl.TEXTURE_MAG_FILTER, f], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]].forEach(([k, v]) => gl.texParameteri(gl.TEXTURE_2D, k, v));
  const disp = new Float32Array(GW * GH * 2), dTex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, dTex); params(gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG32F, GW, GH, 0, gl.RG, gl.FLOAT, disp);
  const TX = new Map();   // src → { tex, size }
  const texFor = (src) => { if (TX.has(src)) return TX.get(src); const o = { tex: null, size: null }; TX.set(src, o);
    const im = new Image(); im.onload = () => { o.size = [im.naturalWidth, im.naturalHeight]; o.tex = gl.createTexture(); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, o.tex); params(gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im); }; im.src = src; return o; };
  let T = null;
  const m = { x: .5, y: .5, sx: .5, sy: .5, vx: 0, vy: 0, px: null, py: null, inside: false };
  let hv = 0, raf = 0, last = 0, on = false;
  function frame(now) {
    raf = 0;
    if (!host) return;
    if (!T || !T.tex) { raf = requestAnimationFrame(frame); return; }
    if (!on) { host.appendChild(cv); host.appendChild(word); host.classList.add('is-gl'); on = true; }
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
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, T.tex);
    gl.uniform2f(U.uRes, cw, ch); gl.uniform2f(U.uS, ...T.size); gl.uniform2f(U.uM, m.sx, m.sy); gl.uniform1f(U.uHv, 0); /* the hover patch is off everywhere: the picture never changes under the cursor (only the black label follows it) */ gl.uniform1f(U.uK, Math.round(12 * cw / 609));
    word.classList.toggle('on', m.inside); word.style.translate = `calc(${(m.sx * r.width).toFixed(1)}px - 50%) calc(${(m.sy * r.height).toFixed(1)}px - 50%)`;
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (active || hv > .01) raf = requestAnimationFrame(frame);
    else { cv.remove(); host.classList.remove('is-gl'); word.classList.remove('on'); on = false; last = 0; host = null; word = null; }
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
  const pos = (e, h) => { const r = h.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; };
  const take = (h) => { if (host === h) return; if (host) { host.classList.remove('is-gl'); word.classList.remove('on'); cv.remove(); }
    host = h; word = h.querySelector('.blg-word'); on = false; last = 0; hv = 0; disp.fill(0); T = texFor(srcOf(h)); };
  hosts.forEach((h) => {
    h.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'mouse') return; take(h); const [x, y] = pos(e, h); m.x = m.sx = x; m.y = m.sy = y; m.inside = true; m.px = null; kick(); });
    h.addEventListener('pointermove', (e) => { if (e.pointerType !== 'mouse' || host !== h) return; const [x, y] = pos(e, h);
      if (m.px !== null) { m.vx = x - m.px; m.vy = y - m.py; } m.px = x; m.py = y; m.x = x; m.y = y; m.inside = true; kick(); });
    h.addEventListener('pointerleave', () => { if (host !== h) return; m.inside = false; m.px = null; kick(); });
  });
})();

/* the guides' images: the black "Read" cursor (the testimonials' "Next" cursor) eases after the pointer */
(() => {
  if (!matchMedia('(hover: hover)').matches) return;
  const imgs = [...document.querySelectorAll('#blogs .blg-card__img')]; if (!imgs.length) return;
  const cur = document.createElement('div'); cur.className = 'blg-cur'; cur.setAttribute('aria-hidden', 'true'); cur.innerHTML = '<b>Read</b>'; document.body.appendChild(cur);
  let cx = 0, cy = 0, tx = 0, ty = 0, raf = 0;
  const loop = () => { cx += (tx - cx) * .22; cy += (ty - cy) * .22; cur.style.translate = `${cx.toFixed(1)}px ${cy.toFixed(1)}px`;
    raf = Math.abs(tx - cx) + Math.abs(ty - cy) > .5 ? requestAnimationFrame(loop) : 0; };
  imgs.forEach((im) => {
    im.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'mouse') return; if (!cur.classList.contains('on')) { cx = tx = e.clientX; cy = ty = e.clientY; cur.style.translate = `${cx}px ${cy}px`; } cur.classList.add('on'); });
    im.addEventListener('pointermove', (e) => { if (e.pointerType !== 'mouse') return; tx = e.clientX; ty = e.clientY; cur.classList.add('on'); if (!raf) raf = requestAnimationFrame(loop); });
    im.addEventListener('pointerleave', () => cur.classList.remove('on'));
  });
  addEventListener('scroll', () => cur.classList.remove('on'), { passive: true });
})();

/* categories: show the guides with that tag (All shows every one); the ones that stay rise back in */
(() => {
  const bar = document.querySelector('.blg-cats'); if (!bar) return;
  const cards = [...document.querySelectorAll('#blogs .blg-card')];
  bar.addEventListener('click', (e) => {
    const b = e.target.closest('.blg-cat'); if (!b || b.classList.contains('on')) return;
    bar.querySelectorAll('.blg-cat').forEach((x) => { const on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    const cat = b.dataset.cat;
    let k = 0;
    cards.forEach((c) => { const show = !cat || (c.dataset.cats || '').split('|').includes(cat);
      c.classList.toggle('is-out', !show); c.classList.remove('is-in-f');
      if (show) { void c.offsetWidth; c.style.animationDelay = Math.min(k, 8) * 60 + 'ms'; c.classList.add('is-in-f'); k++;
        c.querySelectorAll('[data-reveal]').forEach((r) => r.classList.add('is-in')); c.querySelectorAll('.blg-img').forEach((i) => i.classList.add('in')); } });
    const L = (window.B30 && B30.lenis) || window.lenis; L && L.resize && L.resize();
  });
})();

/* phones: the Filter button opens a sheet of categories (with how many guides each shows). Picking one runs the same
   filter as the tag row above (still on the page, hidden on phones), closes the sheet and brings the list into view. */
(() => {
  const btn = document.querySelector('.blg-fbtn'), sheet = document.getElementById('blg-sheet'), bar = document.querySelector('.blg-cats');
  if (!btn || !sheet || !bar) return;
  document.body.appendChild(sheet);   // out of the section, so nothing around it can clip or shift it
  const L = () => (window.B30 && B30.lenis) || window.__b30lenis;
  const opts = [...sheet.querySelectorAll('.blg-sheet__o')], x = sheet.querySelector('.blg-sheet__x');
  let open = false, closeT = 0;
  const set = (on) => {
    if (on === open) return; open = on; clearTimeout(closeT);
    btn.setAttribute('aria-expanded', on ? 'true' : 'false');
    if (on) { sheet.hidden = false; requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add('is-open')));
      document.documentElement.classList.add('blg-sheet-on'); L() && L().stop();
      setTimeout(() => (sheet.querySelector('.blg-sheet__o.on') || x).focus({ preventScroll: true }), 60); }
    else { sheet.classList.remove('is-open'); closeT = setTimeout(() => { sheet.hidden = true; }, 420);
      document.documentElement.classList.remove('blg-sheet-on'); L() && L().start(); btn.focus({ preventScroll: true }); }
  };
  btn.addEventListener('click', () => set(true));
  sheet.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) { set(false); return; }
    const o = e.target.closest('.blg-sheet__o'); if (!o) return;
    const cat = o.dataset.cat;
    opts.forEach((b) => { const on = b === o; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    btn.classList.toggle('is-active', !!cat);
    const chip = [...bar.querySelectorAll('.blg-cat')].find((c) => c.dataset.cat === cat); chip && chip.click();
    set(false);
    const top = document.querySelector('#blogs .blg-all');
    setTimeout(() => { if (!top) return; const l = L(); if (l) l.scrollTo(top, { offset: -20, duration: 0.9 }); else top.scrollIntoView({ behavior: 'smooth' }); }, 120);
  });
  addEventListener('keydown', (e) => {
    if (!open) return;
    if (e.key === 'Escape') { set(false); return; }
    if (e.key === 'Tab') {   // keep the focus inside the sheet while it's open
      const f = [x, ...opts], i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });
  matchMedia('(min-width: 900px)').addEventListener('change', (m) => { if (m.matches) set(false); });   // turned to a wide screen: the tag row is back
})();

/* blog hero: the partners strip (same steps, pattern and animation) comes into view after 1000 px of scroll; the hero's
   dark overlay only starts once the strip is 100 px up from the bottom of the screen, then rises to the usual 16 %. */
(() => {
  const hero = document.querySelector('.blg-hero'); if (!hero) return;
  const AFTER = 1000, DIM = 0.16;
  const fit = () => {
    if (innerWidth < 900) { hero.style.removeProperty('--wh'); return; }
    hero.style.setProperty('--wh', Math.ceil(innerHeight + AFTER + 163 * innerWidth / 1920) + 'px');
  };
  let raf = 0;
  const dim = () => { raf = 0;
    const strip = document.getElementById('partners'); if (!strip) return;
    const top = strip.getBoundingClientRect().top, H = innerHeight;
    const q = Math.min(1, Math.max(0, (H - 100 - top) / (H * 0.75)));   // 0 until the strip has risen 100 px above the bottom of the screen
    hero.style.setProperty('--blg-dim', (q * DIM).toFixed(4)); };
  fit(); dim();
  addEventListener('resize', () => { fit(); dim(); }); addEventListener('load', () => { fit(); dim(); });
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(dim); }, { passive: true });
})();
