/* =====================================================================
   HERO picture — the Our Work case-study media, on the hero's top-right
   frame: it reveals from its top edge, the grid under the cursor bends the
   picture with a small RGB split, a ragged patch of pixels under the cursor
   shows the next shot, and hovering flicks through the shots (160ms).
   Hover the picture: every discipline's shots. Hover a discipline in the
   list: just that discipline's. Leave: back to the cover picture.
   ===================================================================== */
window.SVH_MEDIA = { hoverFrameMs: 160, revealSpan: 0.7, word: (window.B30_CONTENT.servicesPage || {}).hoverWord || "Explore" };
(() => {
  "use strict";
  const el = document.querySelector(".svh__media"), nav = document.querySelector(".svh__idx"), IM = window.SV_HERO_IMGS;
  if (!el || !IM) return;
  const CFG = window.SVH_MEDIA, B30 = window.B30 || {};
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches, FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const keys = ["design", "engineering", "marketing", "ai"];
  const srcs = [IM.default[0]], sets = {}, all = [];
  keys.forEach((k) => { sets[k] = (IM[k] || []).map((s) => { srcs.push(s); return srcs.length - 1; }); all.push(...sets[k]); });
  const box = el.querySelector(".wk-media__in");
  const imgs = srcs.map((s, i) => { const im = new Image(); im.alt = ""; im.decoding = "async"; im.src = s; if (!i) im.className = "is-on"; box.appendChild(im); return im; });
  const m = { imgs, r: REDUCED ? 1 : 0, last: -1, k: 0, gl: null, hv: 0 };
  const GW = 28, GH = Math.round(28 * 338 / 487);
  m.disp = new Float32Array(GW * GH * 2);
  m.mouse = { x: 0.5, y: 0.5, sx: 0.5, sy: 0.5, vx: 0, vy: 0, inside: false, px: null, py: null };
  m.word = document.createElement("span"); m.word.className = "wk-media__word"; m.word.setAttribute("aria-hidden", "true"); m.word.textContent = CFG.word; el.appendChild(m.word);
  const VS = `#version 300 es
in vec2 p; out vec2 vUv;
void main(){ vUv = p*.5+.5; gl_Position = vec4(p,0.,1.); }`;
  const FS = `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uT, uD, uN;
uniform vec2 uRes, uS, uSN, uM;
uniform float uR, uHv, uK;
vec2 coverN(vec2 uv){ float ra = uRes.x/uRes.y, ri = uSN.x/uSN.y; vec2 sc = ra > ri ? vec2(1., ri/ra) : vec2(ra/ri, 1.); return (uv-.5)*sc + .5; }
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec2 cover(vec2 uv, float z){
  float ra = uRes.x/uRes.y, ri = uS.x/uS.y;
  vec2 sc = (ra > ri ? vec2(1., ri/ra) : vec2(ra/ri, 1.)) / z;
  return (uv-.5)*sc + .5;
}
void main(){
  vec2 uv = vec2(vUv.x, 1.-vUv.y);
  if (uv.y > uR) { o = vec4(0.); return; }
  vec2 d = texture(uD, uv).rg;
  vec2 c = cover(uv - d, 1.14 - .14*uR);
  o = vec4(texture(uT, c + d*.4).r, texture(uT, c).g, texture(uT, c - d*.4).b, 1.);
  if (uHv > .001) {
    vec2 px = uv * uRes, cell = floor(px / uK), g = (cell + .5) * uK;
    float r = uHv * min(uRes.x, uRes.y) * .15, dd = length(g - uM * uRes) + (h(cell) - .5) * uK * 1.6;
    if (dd < r) { vec2 cn = coverN(uv - d); o = vec4(texture(uN, cn + d*.4).r, texture(uN, cn).g, texture(uN, cn - d*.4).b, 1.); }
  }
}`;
  try {
    const cv = document.createElement("canvas"); cv.setAttribute("aria-hidden", "true"); cv.className = "wk-media__gl";
    const gl = cv.getContext("webgl2", { alpha: true, antialias: true, premultipliedAlpha: false });
    if (!gl || REDUCED) throw 0;
    const sh = (t, s) => { const x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(x); return x; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog); gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    m.U = {}; ["uT", "uD", "uN", "uRes", "uS", "uSN", "uM", "uR", "uHv", "uK"].forEach((k) => (m.U[k] = gl.getUniformLocation(prog, k)));
    gl.uniform1i(m.U.uT, 0); gl.uniform1i(m.U.uD, 1); gl.uniform1i(m.U.uN, 2);
    const params = (f) => [[gl.TEXTURE_MIN_FILTER, f], [gl.TEXTURE_MAG_FILTER, f], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]].forEach(([k, v]) => gl.texParameteri(gl.TEXTURE_2D, k, v));
    m.dispTex = gl.createTexture(); gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, m.dispTex); params(gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG32F, GW, GH, 0, gl.RG, gl.FLOAT, m.disp);
    m.tex = imgs.map(() => null); m.size = imgs.map(() => [487, 338]);
    imgs.forEach((im, i) => {
      const go = () => {
        gl.activeTexture(gl.TEXTURE0); const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t); params(gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
        m.tex[i] = t; m.size[i] = [im.naturalWidth, im.naturalHeight];
        if (i === 0) { m.gl = gl; m.cv = cv; el.appendChild(cv); el.classList.add("is-gl"); m.last = -1; }
      };
      im.complete && im.naturalWidth ? go() : im.addEventListener("load", go, { once: true });
    });
  } catch (err) { if (err) console.warn("Hero media: WebGL unavailable, showing plain images.", err); }

  /* input */
  el.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect(), M = m.mouse, x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    if (M.px !== null) { M.vx = x - M.px; M.vy = y - M.py; }
    M.x = x; M.y = y; M.px = x; M.py = y; M.inside = true;
  });
  el.addEventListener("pointerleave", () => { m.mouse.inside = false; m.mouse.px = null; });
  el.addEventListener("click", (e) => { e.preventDefault(); const t = document.getElementById("design"); if (B30.scrollTo) B30.scrollTo(t); else t.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth" }); });

  /* the flick: a list of shots plays every hoverFrameMs */
  let timer = 0, seq = [0], si = 0;
  const show = (i) => { imgs[m.k].classList.remove("is-on"); m.k = i; imgs[m.k].classList.add("is-on"); m.last = -1; };
  const play = (list) => {
    clearInterval(timer); seq = list; si = 0;
    if (list.length === 1 || REDUCED) { show(list[0]); return; }
    show(list[0]);
    timer = setInterval(() => { si = (si + 1) % seq.length; show(seq[si]); }, CFG.hoverFrameMs);
  };
  m.next = () => (seq.length > 1 ? seq[(si + 1) % seq.length] : all[0]);   // the peek shows the shot after the one on screen
  el.addEventListener("pointerenter", (e) => { if (e.pointerType && e.pointerType !== "mouse") return; play(all); });
  el.addEventListener("pointerleave", () => play([0]));
  if (nav) {
    const links = [...nav.querySelectorAll("a")];
    const hov = (i) => { links.forEach((a, j) => a.classList.toggle("is-on", j === i)); nav.classList.toggle("is-hov", i >= 0); play(i < 0 ? [0] : sets[keys[i]]); };
    links.forEach((a, i) => { a.addEventListener("pointerenter", () => hov(i)); a.addEventListener("focus", () => hov(i)); a.addEventListener("blur", () => hov(-1)); });
    nav.addEventListener("pointerleave", () => hov(-1));
  }

  function stepDisp() {
    const { disp, mouse } = m, rad = 0.22 * GW;
    let active = mouse.inside;
    for (let j = 0; j < GH; j++) for (let i = 0; i < GW; i++) {
      const k = (j * GW + i) * 2;
      if (mouse.inside) {
        const d = Math.hypot(i + 0.5 - mouse.x * GW, j + 0.5 - mouse.y * GH);
        if (d < rad) { const p = Math.pow(1 - d / rad, 2) * 0.9; disp[k] += mouse.vx * p; disp[k + 1] += mouse.vy * p; }
      }
      disp[k] *= 0.925; disp[k + 1] *= 0.925;
      if (!active && (Math.abs(disp[k]) > 1e-5 || Math.abs(disp[k + 1]) > 1e-5)) active = true;
    }
    mouse.vx *= 0.85; mouse.vy *= 0.85;
    return active;
  }
  let lastT = performance.now();
  (function f(now) {
    const dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
    const vh = innerHeight, rect = el.getBoundingClientRect();
    if (rect.height && rect.bottom > -60 && rect.top < vh + 60) {
      const goal = REDUCED ? 1 : clamp((vh - rect.top) / (vh * CFG.revealSpan));
      m.r += (goal - m.r) * (1 - Math.pow(1 - 0.08, dt * 60));
      if (Math.abs(goal - m.r) < 0.0005) m.r = goal;
      const e = easeIO(m.r);
      if (m.gl) {
        const M = m.mouse; M.sx += (M.x - M.sx) * .22; M.sy += (M.y - M.sy) * .22;
        m.hv += (((M.inside && m.r > .98) ? 1 : 0) - m.hv) * Math.min(1, dt * 7); if (m.hv < .002) m.hv = 0;
        m.word.classList.toggle("on", M.inside && FINE);
        m.word.style.translate = `calc(${(M.sx * rect.width).toFixed(1)}px - 50%) calc(${(M.sy * rect.height).toFixed(1)}px - 50%)`;
        const moving = stepDisp() || m.hv > 0;
        if (moving || Math.abs(m.r - m.last) >= 0.0005) {
          m.last = m.r;
          const gl = m.gl, cv = m.cv, dpr = Math.min(devicePixelRatio || 1, 2);
          const cw = Math.round(rect.width * dpr), ch = Math.round(rect.height * dpr);
          if (cv.width !== cw || cv.height !== ch) { cv.width = cw; cv.height = ch; }
          gl.viewport(0, 0, cw, ch);
          gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, m.dispTex);
          gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, GW, GH, gl.RG, gl.FLOAT, m.disp);
          const k = m.tex[m.k] ? m.k : 0, nx = m.next(), nk = m.tex[nx] ? nx : k;
          gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, m.tex[k]);
          gl.uniform2f(m.U.uRes, cw, ch); gl.uniform2f(m.U.uS, ...m.size[k]); gl.uniform1f(m.U.uR, e);
          gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, m.tex[nk]); gl.uniform2f(m.U.uSN, ...m.size[nk]); gl.activeTexture(gl.TEXTURE0);
<<<<<<< HEAD
          gl.uniform2f(m.U.uM, M.sx, M.sy); gl.uniform1f(m.U.uHv, 0); /* the hover patch is off everywhere: the picture never changes under the cursor (only the black label follows it) */ gl.uniform1f(m.U.uK, Math.round(12 * cw / 609));
=======
          gl.uniform2f(m.U.uM, M.sx, M.sy); gl.uniform1f(m.U.uHv, m.hv); gl.uniform1f(m.U.uK, Math.round(12 * cw / 609));
>>>>>>> f0e7d935b7adba6199409368d09b447496a99313
          gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
      } else if (Math.abs(m.r - m.last) >= 0.0005) {
        m.last = m.r;
        el.style.setProperty("--hide", ((1 - e) * 100).toFixed(2) + "%");
        el.style.setProperty("--z", (1.14 - 0.14 * e).toFixed(4));
      }
    }
    requestAnimationFrame(f);
  })(lastT);
})();

/* hero: once the partners strip under it is half in view, the hero's content moves down with the scroll (at half
   speed), so the page slides up over it (as on Our Work). */
window.WK_HERO_DRIFT = { rate: 0.6, dim: 0.16, dimDark: 0.55, dimOver: 0.75 };
(() => {
  const hero = document.querySelector('.wk-hero'), stage = hero && hero.querySelector('.b30h__stage');
  const strip = document.querySelector('.wk-hero + .b30-main > .b30p');
  if (!stage || !strip) return;
  const C = window.WK_HERO_DRIFT, RED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let top = 0, hgt = 0, raf = 0;
  const measure = () => { let y = 0, n = strip; while (n) { y += n.offsetTop; n = n.offsetParent; } top = y; hgt = strip.offsetHeight; };
  const frame = () => { raf = 0;
    if (RED || innerWidth < 900) { stage.style.transform = ''; hero.style.removeProperty('--wk-dim'); return; }
    const d = Math.max(0, Math.min(hero.offsetHeight, scrollY));   // the content sinks from the first pixel of scroll
    stage.style.transform = d > 0 ? `translate3d(0,${(d * C.rate).toFixed(1)}px,0)` : '';
    hero.style.setProperty('--wk-dim', (Math.min(1, d / (innerHeight * C.dimOver)) * (document.documentElement.classList.contains('dark') ? C.dimDark : C.dim)).toFixed(4));
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
  measure(); frame();
  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', () => { measure(); kick(); });
  addEventListener('load', () => { measure(); kick(); });
  addEventListener('b30:theme', kick);
})();
/* the hero waits (hidden) for its layout; without the homepage's hero script, end the wait once the fonts are in */
(() => {
  const html = document.documentElement; if (!html.classList.contains('b30h-pre')) return;
  const go = () => requestAnimationFrame(() => requestAnimationFrame(() => html.classList.remove('b30h-pre')));
  Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise((r) => setTimeout(r, 700))]).then(go);
})();
