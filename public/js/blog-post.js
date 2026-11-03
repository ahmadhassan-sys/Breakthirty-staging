/* A blog post: pictures wipe in, the pictures' hover, "You will read" follows the reading, smooth FAQs, the hero's length.
   From the design (Figma B30 › Blog). */
/* blog: images wipe in as they come up; "Load more guides" shows the next nine (their copy rises in like the rest) */
(() => {
  const root = document.getElementById('blogs'); if (!root) return;
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
    { rootMargin: '0px 0px -8% 0px', threshold: 0 });
  const watch = () => root.querySelectorAll('.blg-img:not(.in)').forEach((el) => io.observe(el));
  watch();
})();

/* the blog's images (the "Must read" one and every guide's): the testimonials' portrait hover — the picture bends under
   the cursor, a ragged patch of pixels turns that same picture black & white (it never changes to another), and the
   word "Read" rides with the cursor. One WebGL canvas, moved into whichever image is under the cursor. */
(() => {
  const hosts = [...document.querySelectorAll('#blogs .blg-img')]; if (!hosts.length) return;
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

/* blog post: hero cover + figures wipe in; the contents list follows the reading position and jumps to a section;
   the FAQs open and close smoothly */
(() => {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
    { rootMargin: '0px 0px -8% 0px', threshold: 0 });
  document.querySelectorAll('.bp-hero__img, .bp-art .blg-img').forEach((el) => io.observe(el));

  const links = [...document.querySelectorAll('.bp-toc__l a')]; if (!links.length) return;
  const secs = links.map((a) => document.getElementById(a.dataset.sec));
  let raf = 0;
  const spy = () => { raf = 0; const line = innerHeight * 0.35; let k = 0;
    secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top <= line) k = i; });
    links.forEach((a, i) => a.parentElement.classList.toggle('on', i === k)); };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(spy); }, { passive: true }); spy();
  links.forEach((a) => a.addEventListener('click', (e) => {
    const s = document.getElementById(a.dataset.sec); if (!s) return; e.preventDefault();
    const L = (window.B30 && B30.lenis) || window.lenis, off = -Math.round(innerWidth / 1920 * 48);
    if (L && L.scrollTo) L.scrollTo(s, { offset: off, duration: 1.1 }); else s.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, '', '#' + s.id);
  }));

  // FAQs: animate the answer's height when opening / closing
  document.querySelectorAll('.bp-faq').forEach((d) => {
    const sum = d.querySelector('summary'), body = d.querySelector('.bp-faq__a');
    sum.addEventListener('click', (e) => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      e.preventDefault(); d.classList.add('is-anim');
      const opening = !d.open;
      if (opening) d.open = true;
      const h = body.scrollHeight;
      const a = body.animate(opening ? [{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }] : [{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }],
        { duration: 450, easing: 'cubic-bezier(.16,1,.3,1)' });
      a.onfinish = () => { if (!opening) d.open = false; d.classList.remove('is-anim'); };
    });
  });
})();

/* hero length: the hero drifts down at 0.6 of the scroll (the services hero's drift) while the page slides over it, so the
   cover's bottom edge climbs the screen at 0.4 of the scroll. The partners strip is placed where it will just be
   reaching the bottom of the screen at the moment the whole cover is in view — so it comes up only after that. */
(() => {
  const hero = document.querySelector('.bp-hero'), img = hero && hero.querySelector('.bp-hero__img'); if (!img) return;
  const RATE = 0.6;
  const fit = () => {
    if (innerWidth < 900 || matchMedia('(prefers-reduced-motion: reduce)').matches) { hero.style.removeProperty('--wh'); return; }
    const u = innerWidth / 1920, imgB = img.offsetTop + img.offsetHeight, lap = 163 * u;
    const d = Math.max(0, (imgB + 24 * u - innerHeight) / (1 - RATE));        // scroll at which the cover's bottom (plus a hair) is on screen
    const stripTop = Math.max(imgB + u, imgB + 24 * u + RATE * d);             // where the strip should sit on the page
    hero.style.setProperty('--wh', Math.ceil(stripTop + lap) + 'px');
  };
  fit(); addEventListener('resize', fit); addEventListener('load', fit);
})();

/* the posts' GIFs are short videos: they load and play only while on screen (and stay still for reduced motion) */
(() => {
  const vids = [...document.querySelectorAll('.bp-art video')]; if (!vids.length) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    const v = e.target;
    if (e.isIntersecting) { v.muted = true; const p = v.play(); if (p && p.catch) p.catch(() => {}); } else v.pause();
  }), { rootMargin: '200px 0px' });
  vids.forEach((v) => io.observe(v));
})();
