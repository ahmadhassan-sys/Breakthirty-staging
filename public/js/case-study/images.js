/* Case study · images: the dashed rules draw in, and each picture reveals with the WebGL pixel wipe (CSS wipe without WebGL) */
(() => {
  "use strict";
  const RED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = (t) => t * t * (3 - 2 * t);
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const U = () => document.documentElement.clientWidth / 1920;
<<<<<<< HEAD
  // opened from the homepage's case-study zoom: the hero's picture is already on screen, so it starts revealed
  const HANDOFF = document.documentElement.classList.contains("pt-cs") || document.documentElement.classList.contains("b30c-arrive");   // arriving through a case transition: the hero is already revealed
=======
>>>>>>> f0e7d935b7adba6199409368d09b447496a99313

  /* ---------- rules draw in; images fall back to a CSS wipe when WebGL isn't there ---------- */
  const once = (els, cls, th) => { const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add(cls); io.unobserve(e.target); } }), { threshold: th }); els.forEach((el) => io.observe(el)); };
  once(document.querySelectorAll(".cz-rule"), "in", 0.5);
  document.querySelectorAll(".cz-hero__img, .cz-next__img, .cz-part__img, .cz-ba__img, .cz-demo__media .ph").forEach((el) => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } }, { threshold: 0, rootMargin: "0px 0px -12% 0px" });
    io.observe(el.parentElement);
  });

  /* =====================================================================
     Images — the homepage's case-study reveal (WebGL): each picture wipes in from its top edge once 70% of it is
     in view, arriving as coarse pixels that sharpen and settling from a slight zoom; it drifts a touch as you scroll
     past.
     ===================================================================== */
  const CFG = { revealMs: 1300, revealSoft: .06, grid: 28, gridRadius: .22, gridStrength: .9, gridRelax: .925, drift: .028, pixelFrom: 22, resolveBy: .65 };
  const VS = `#version 300 es
in vec2 p; out vec2 vUv; void main(){ vUv = p*.5+.5; gl_Position = vec4(p,0.,1.); }`;
  const FS = `#version 300 es
precision highp float; in vec2 vUv; out vec4 o;
uniform sampler2D uT, uD; uniform vec2 uRes, uS; uniform float uR, uY, uB, uE;
vec2 cover(vec2 uv, float z){ float ra = uRes.x/uRes.y, ri = uS.x/uS.y; vec2 sc = (ra > ri ? vec2(1., ri/ra) : vec2(ra/ri, 1.)) / z; return (uv-.5)*sc + .5; }
void main(){
  vec2 uv = vec2(vUv.x, 1.-vUv.y);
  float a = 1. - smoothstep(uR - uE, uR, uv.y);
  if (a <= 0.) { o = vec4(0.); return; }
  if (uB > 1.) uv = (floor(uv * uRes / uB) + .5) * uB / uRes;
  vec2 d = texture(uD, uv).rg;
  vec2 c = cover(uv - d, (1.14 - .14*min(uR, 1.)) * 1.07) + vec2(0., uY);
  o = vec4(texture(uT, c + d*.4).r, texture(uT, c).g, texture(uT, c - d*.4).b, a);
}`;
  const GW = CFG.grid, GH = Math.round(CFG.grid * 480 / 784);
  const pics = [];
  if (!RED) document.querySelectorAll(".ph[data-gl]").forEach((el) => {
<<<<<<< HEAD
    if (el.closest("[data-still]")) return;   // still pages: no WebGL reveal, the picture just shows
    const src = (getComputedStyle(el).backgroundImage.match(/url\(["']?(.*?)["']?\)$/) || [])[1]; if (!src) return;
    const canvas = document.createElement("canvas"); canvas.setAttribute("aria-hidden", "true");
    const gl = canvas.getContext("webgl2", { alpha: true, antialias: true, premultipliedAlpha: false }); if (!gl) { if (el.dataset.gl === "hero") document.dispatchEvent(new Event("b30:hero-ready")); return; }
    const sh = (t, s) => { const x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(x); return x; };
    const S = { el, canvas, gl, hero: el.dataset.gl === "hero", ready: false, go: (el.dataset.gl === "hero" && HANDOFF) ? -1e9 : 0, r: 0, disp: new Float32Array(GW * GH * 2), m: { x: .5, y: .5, vx: 0, vy: 0, inside: false, px: null, py: null }, U: {} };
=======
    const src = (getComputedStyle(el).backgroundImage.match(/url\(["']?(.*?)["']?\)$/) || [])[1]; if (!src) return;
    const canvas = document.createElement("canvas"); canvas.setAttribute("aria-hidden", "true");
    const gl = canvas.getContext("webgl2", { alpha: true, antialias: true, premultipliedAlpha: false }); if (!gl) return;
    const sh = (t, s) => { const x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(x); return x; };
    const S = { el, canvas, gl, hero: el.dataset.gl === "hero", ready: false, go: 0, r: 0, disp: new Float32Array(GW * GH * 2), m: { x: .5, y: .5, vx: 0, vy: 0, inside: false, px: null, py: null }, U: {} };
>>>>>>> f0e7d935b7adba6199409368d09b447496a99313
    try {
      const prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog); gl.useProgram(prog);
      const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      ["uT", "uD", "uRes", "uS", "uR", "uY", "uB", "uE"].forEach((k) => (S.U[k] = gl.getUniformLocation(prog, k)));
      gl.uniform1i(S.U.uT, 0); gl.uniform1i(S.U.uD, 1);
      const params = (f) => [[gl.TEXTURE_MIN_FILTER, f], [gl.TEXTURE_MAG_FILTER, f], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]].forEach(([k, v]) => gl.texParameteri(gl.TEXTURE_2D, k, v));
      S.dTex = gl.createTexture(); gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, S.dTex); params(gl.NEAREST);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG32F, GW, GH, 0, gl.RG, gl.FLOAT, S.disp);
      const im = new Image();
      im.onload = () => { S.tex = gl.createTexture(); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, S.tex); params(gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im); S.size = [im.naturalWidth, im.naturalHeight];
        el.appendChild(canvas); el.classList.add("is-gl"); S.ready = true; };
      im.src = src;
<<<<<<< HEAD
    } catch (err) { if (S.hero) document.dispatchEvent(new Event("b30:hero-ready")); return; }
    pics.push(S);
  });
  // no WebGL picture for the hero (reduced motion, no WebGL, no picture): core.js hands over to its plain picture
  if (!pics.some((S) => S.hero)) document.dispatchEvent(new Event("b30:hero-ready"));
=======
    } catch (err) { return; }
    pics.push(S);
  });
>>>>>>> f0e7d935b7adba6199409368d09b447496a99313
  const stepDisp = (S) => {
    const { disp, m, gl } = S, rad = CFG.gridRadius * GW; let active = m.inside;
    for (let j = 0; j < GH; j++) for (let i = 0; i < GW; i++) { const k = (j * GW + i) * 2;
      if (m.inside) { const d = Math.hypot(i + .5 - m.x * GW, j + .5 - m.y * GH); if (d < rad) { const p = Math.pow(1 - d / rad, 2) * CFG.gridStrength; disp[k] += m.vx * p; disp[k + 1] += m.vy * p; } }
      disp[k] *= CFG.gridRelax; disp[k + 1] *= CFG.gridRelax; if (!active && (Math.abs(disp[k]) > 1e-5 || Math.abs(disp[k + 1]) > 1e-5)) active = true; }
    m.vx *= .85; m.vy *= .85;
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, S.dTex); gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, GW, GH, gl.RG, gl.FLOAT, disp);
  };
  if (pics.length) (function frame(now) {
    const vh = innerHeight;
    for (const S of pics) {
      if (!S.ready) continue;
      const rect = S.el.getBoundingClientRect();
      if (!S.go && rect.bottom > 0 && (S.hero || (vh - rect.top) / Math.max(1, rect.height) >= 0.7 || rect.top < vh * 0.25)) S.go = now;
      S.r = S.go ? clamp((now - S.go) / CFG.revealMs) : 0;
      if (rect.bottom < -50 || rect.top > vh + 50 || !rect.width) continue;
      const { gl, canvas } = S, dpr = Math.min(devicePixelRatio || 1, 2), cw = Math.round(rect.width * dpr), ch = Math.round(rect.height * dpr);
      if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
      gl.viewport(0, 0, cw, ch); stepDisp(S);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, S.tex);
      gl.uniform2f(S.U.uRes, cw, ch); gl.uniform2f(S.U.uS, S.size[0], S.size[1]);
      const er = easeOut(S.r);
      gl.uniform1f(S.U.uE, 0.0001);
      gl.uniform1f(S.U.uR, S.r >= 1 ? 1.01 : (1 + CFG.revealSoft) * er);
      gl.uniform1f(S.U.uY, clamp((rect.top + rect.height / 2 - vh / 2) / vh, -1, 1) * CFG.drift);
      const sharp = easeOut(clamp(S.r / CFG.resolveBy));
      gl.uniform1f(S.U.uB, Math.max(1, CFG.pixelFrom * dpr * (1 - sharp)));
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
<<<<<<< HEAD
      if (S.hero && !S.told) { S.told = true; document.dispatchEvent(new Event("b30:hero-ready")); }   // core.js hands over to it
=======
>>>>>>> f0e7d935b7adba6199409368d09b447496a99313
    }
    requestAnimationFrame(frame);
  })(performance.now());
})();
