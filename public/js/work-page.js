/* Work page data — written by the Astro page into <script id="b30-content"> (edit it in src/data/work.js). */
window.WK_IMG = (window.B30_CONTENT.workPage || {}).images || {};
window.WK_CASES = (window.B30_CONTENT.workPage || {}).cases || [];

/* =====================================================================
   WORK PAGE — CONFIG (every motion constant in one place)
   ===================================================================== */
window.WK_CFG = {
  spine: {
    pages: 12,              // pages around the centre, evenly spaced (two per case study)
    w: 320, h: 196,         // page size, design px
    gap: 34,                // empty core: every page starts this far from the centre, design px
    idleSpeed: 8,           // deg / s when nobody touches it
    drag: 0.32,             // deg per px dragged
    friction: 1.3,          // how fast a flick settles back to the idle speed (higher = sooner)
    tilt: { x: 9, y: 14 },  // mouse tilt, deg
    lift: 10,               // hovered page slides out a little…
    raise: 64,              // …and rises up above the others, design px
    openMs: 1900            // the fan opening on load
      },
  hoverFrameMs: 160,        // grid: how fast the hovered case study flicks through its images
  revealSpan: 0.7,          // media reveal: share of the screen height it takes to fully reveal
  index: { ms: 700, stagger: 70 },   // index rows: open/close time and the delay between each image
  hello: { lead: 100,       // pink pixels start forming this many px before the band reaches the screen
    push: { radius: 420, strength: 34, turn: 1.6, ease: 5 } }   // cursor near the hand: reach (design px), max push (px), max turn (deg), smoothing
};

(() => {
  "use strict";
  const CFG = window.WK_CFG, B30 = window.B30 || {};
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const small = matchMedia("(max-width: 899px)");
  const u = () => document.documentElement.clientWidth / 1920;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const IMG = window.WK_IMG || {};
  const CASES = window.WK_CASES || [];

  /* images are stored once and dropped into every place that shows them */
  document.querySelectorAll("img[data-src]").forEach((im) => { const s = IMG[im.dataset.src]; if (s) im.src = s; });

  /* =====================================================================
     Cursor circle — homepage "View" circle, also saying "Drag" on the spine
     ===================================================================== */
  const cursor = (() => {
    if (!FINE) return { set() {} };
    const el = document.createElement("div");
    el.className = "b30-vcur"; el.setAttribute("aria-hidden", "true"); el.innerHTML = "<span>View</span>";
    document.body.appendChild(el);
    const lbl = el.firstChild;
    let cx = -200, cy = -200, tx = -200, ty = -200, show = 0, want = 0, raf = 0, last = 0, down = false, word = "";
    const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } };
    function tick(now) {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const k = 1 - Math.exp(-dt * 16);
      cx += (tx - cx) * k; cy += (ty - cy) * k;
      show += (want - show) * (1 - Math.exp(-dt * 12));
      el.style.transform = `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0) scale(${(show * (down ? 0.86 : 1)).toFixed(3)})`;
      if (Math.abs(want - show) > 0.004 || Math.abs(tx - cx) + Math.abs(ty - cy) > 0.3) raf = requestAnimationFrame(tick);
    }
    addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; if (want || show > 0.01) kick(); }, { passive: true });
    addEventListener("pointerdown", () => { down = true; kick(); });
    addEventListener("pointerup", () => { down = false; kick(); });
    addEventListener("scroll", () => {
      if (!want) return;
      const r = document.elementFromPoint(tx, ty);
      if (!r || !r.closest("[data-cur]")) { want = 0; kick(); }
    }, { passive: true });
    document.addEventListener("pointerover", (e) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      const t = e.target.closest && e.target.closest("[data-cur]");
      if (!t) { if (want) { want = 0; kick(); } return; }
      if (show < 0.02) { cx = tx = e.clientX; cy = ty = e.clientY; }
      want = 1;
      if (t.dataset.cur !== word) { word = t.dataset.cur; lbl.textContent = word; B30.scramble && B30.scramble(lbl, { duration: 380 }); }
      kick();
    });
    document.addEventListener("pointerleave", () => { want = 0; kick(); });
    return { set(w) { word = w; lbl.textContent = w; } };
  })();

  /* =====================================================================
     HERO — the spine. Case-study pages hinge on one vertical line and fan
     around it. The front of each page is the finished work, the back is its
     pixel sketch, so as it turns every project flips from sketch to scale.
     Drag to spin (with inertia), mouse tilts it, hover pulls a page out.
     ===================================================================== */
  (function spine() {
    const rig = document.querySelector(".wk-rig"); if (!rig) return;
    const S = CFG.spine, spin = rig.querySelector(".wk-rig__spin");
    const nameBox = document.querySelector(".wk-hero__name");
    const n = S.pages, pages = [];

    /* a soft cast shadow on the floor: the fan floats above it, the shadow tightens and fades as it rises */
    const shadow = document.createElement("div");
    shadow.className = "wk-shadow"; shadow.setAttribute("aria-hidden", "true");
    shadow.innerHTML = "<i></i><i></i><i></i>";
    rig.insertBefore(shadow, spin);

    for (let k = 0; k < n; k++) {
      const c = CASES[k % CASES.length], round = Math.floor(k / CASES.length);
      const fi = [0, 2][round] || 0, bi = (fi + 1) % c.imgs.length;
      const el = document.createElement("a");
      el.className = "wk-pg"; el.href = c.href; el.dataset.pt = ""; el.dataset.ptLabel = "Case study";
      el.setAttribute("aria-label", c.name); el.tabIndex = -1; el.draggable = false;
      el.innerHTML = `<span class="wk-pg__f"><img alt="" draggable="false"></span><span class="wk-pg__b"><img alt="" draggable="false"></span>`;
      const [fImg, bImg] = el.querySelectorAll("img");
      fImg.src = IMG[c.imgs[fi]] || ""; bImg.src = IMG[c.imgs[bi]] || "";   // both sides are real shots from the project
      const base = k * (360 / n);                              // equal gaps all the way round
      const p = { el, k, c, base, lift: 0, liftT: 0 };
      el.addEventListener("pointerenter", () => hover(p, true));
      el.addEventListener("pointerleave", () => hover(p, false));
      spin.appendChild(el); pages.push(p);
    }

    /* top-right project name: words rise in like the headings; the old name rises out */
    let shownCase = null, leaveT = 0;
    function words(text, cls) {
      const d = document.createElement("span"); d.className = cls;
      d.innerHTML = text.split(" ").map((w, i) => `<span class="hw"><span class="hw-i" style="--i:${i}">${w}</span></span>`).join(" ");
      return d;
    }
    function showName(c) {
      clearTimeout(leaveT);
      if (!nameBox || c === shownCase) return;
      shownCase = c;
      nameBox.querySelectorAll(".wk-nm:not(.is-out)").forEach((o) => { o.classList.add("is-out"); o.classList.remove("is-in"); setTimeout(() => o.remove(), 900); });
      if (!c) return;
      const blk = document.createElement("span"); blk.className = "wk-nm";
      blk.appendChild(words(c.name, "wk-nm__t"));
      nameBox.appendChild(blk);
      void blk.offsetWidth;
      requestAnimationFrame(() => blk.classList.add("is-in"));
    }
    let hov = null;
    function hover(p, on) {
      if (dragging) return;
      if (on) { hov = p; p.liftT = 1; showName(p.c); }
      else {
        p.liftT = 0;
        if (hov === p) { hov = null; clearTimeout(leaveT); leaveT = setTimeout(() => { if (!hov) showName(null); }, 260); }
      }
    }

    let U = u(), angle = -18, vel = S.idleSpeed, dragging = false, moved = 0, lastX = 0, lastT = 0;
    let mx = 0, my = 0, smx = 0, smy = 0, open = REDUCED ? 1 : 0, t0 = 0, visible = true;
    const layout = () => {
      U = small.matches ? Math.min(innerWidth / 1920 * 2.1, 0.5) : u();
      const w = S.w * U, h = S.h * U;
      pages.forEach((p) => { p.el.style.width = w + "px"; p.el.style.height = h + "px"; p.el.style.marginTop = -h / 2 + "px"; });
    };
    layout(); addEventListener("resize", layout);

    let downPage = null;
    rig.addEventListener("pointerdown", (e) => {
      if (e.button) return;
      dragging = true; moved = 0; lastX = e.clientX; lastT = performance.now();
      downPage = e.target.closest(".wk-pg");
      rig.setPointerCapture(e.pointerId);
    });
    rig.addEventListener("pointermove", (e) => {
      const r = rig.getBoundingClientRect();
      mx = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1); my = clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1);
      if (!dragging) return;
      const now = performance.now(), dx = e.clientX - lastX, dt = Math.max(8, now - lastT);
      moved += Math.abs(dx); angle += dx * S.drag;
      vel = vel * 0.6 + ((dx * S.drag) / dt) * 1000 * 0.4;
      lastX = e.clientX; lastT = now;
    });
    const end = (e) => {
      if (!dragging) return;
      dragging = false;
      try { rig.releasePointerCapture(e.pointerId); } catch (_) {}
      if (moved < 6 && downPage) downPage.click();
      downPage = null;
      if (performance.now() - lastT > 90) vel = S.idleSpeed;
    };
    rig.addEventListener("pointerup", end); rig.addEventListener("pointercancel", end);
    rig.addEventListener("click", (e) => { if (e.isTrusted && e.target.closest(".wk-pg")) { e.preventDefault(); e.stopPropagation(); } }, true);
    rig.addEventListener("pointerleave", () => { if (!dragging) { mx = my = 0; } });
    rig.addEventListener("dragstart", (e) => e.preventDefault());
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) req(); }).observe(rig);

    let raf = 0, last = performance.now();
    const req = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };
    function frame(now) {
      raf = 0;
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      if (!t0) t0 = now;
      if (!REDUCED) {
        open = easeIO(clamp((now - t0 - 250) / S.openMs));
        if (!dragging) { vel += (S.idleSpeed - vel) * (1 - Math.exp(-dt * S.friction)); angle += vel * dt; }
      }
      const kk = 1 - Math.exp(-dt * 4);
      smx += (mx - smx) * kk; smy += (my - smy) * kk;
      const tiltX = -13 - smy * S.tilt.x, yaw = angle + smx * S.tilt.y + (1 - open) * -70;
      const fl = REDUCED ? 0 : Math.sin(now * 0.0011);                  // slow float: the fan breathes above its shadow
      spin.style.transform = `translate3d(0,${(fl * 9 * U).toFixed(2)}px,0) rotateX(${tiltX.toFixed(3)}deg) rotateY(${yaw.toFixed(3)}deg)`;
      shadow.style.opacity = (open * (0.92 + fl * 0.08)).toFixed(3);
      shadow.style.transform = `translateX(-50%) scale(${(0.6 + 0.4 * open + fl * 0.035).toFixed(4)},${(0.6 + 0.4 * open + fl * 0.02).toFixed(4)})`;
      for (const p of pages) {
        p.lift += (p.liftT - p.lift) * (1 - Math.exp(-dt * 9));
        const a = p.base * open;
        p.el.style.transform = `translate3d(0,${(-p.lift * S.raise * U).toFixed(2)}px,0) rotateY(${a.toFixed(3)}deg) translate3d(${((S.gap * open + p.lift * S.lift) * U).toFixed(2)}px,0,0)`;
        // depth: pages turning away soften and sink into the light, pages facing you stay crisp
        const w = ((a + yaw) * Math.PI) / 180, back = Math.sin(w), far = clamp(back);
        p.el.style.setProperty("--veil", (far * 0.5 + (1 - Math.abs(Math.cos(w))) * 0.06).toFixed(3));
        p.el.style.setProperty("--bl", (far * far * 2.6 * U * 1.6).toFixed(2) + "px");
        p.el.style.zIndex = Math.round(100 - back * 50);
      }
      if (visible) raf = requestAnimationFrame(frame);
    }
    req();
  })();

  /* =====================================================================
     Pixel steps under the hero: rows settle at different speeds as the
     strip rises, pixels blink when the cursor passes (homepage strip)
     ===================================================================== */
  (function band() {
    const sec = document.querySelector(".wk-band"); if (!sec) return;
    const rows = [...sec.querySelectorAll(".b30p__row")], px = sec.querySelector(".b30p__px");
    const squares = [...px.querySelectorAll("i")].map((el) => ({ el, b: el.firstElementChild, last: -1e9 }));
    const blink = (sq, delay, strong) => {
      const now = performance.now(); if (now - sq.last < 900) return; sq.last = now + delay;
      sq.b.animate(strong
        ? [{ opacity: 1, transform: "scale(1)" }, { opacity: 0.06, transform: "scale(.72)", offset: 0.42 }, { opacity: 1, transform: "scale(1)" }]
        : [{ opacity: 1, transform: "scale(1)" }, { opacity: 0.38, transform: "scale(.88)", offset: 0.45 }, { opacity: 1, transform: "scale(1)" }],
        { duration: strong ? 780 : 680, delay, easing: "cubic-bezier(.45,0,.2,1)" });
    };
    if (!REDUCED) px.addEventListener("pointermove", (e) => {
      const k = u(), hit = Math.max(26, 56 * k), wave = 240 * k;
      let src = null, best = 1e9;
      for (const s of squares) { const r = s.el.getBoundingClientRect(), d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)); if (d < best) { best = d; src = s; } }
      if (!src || best > hit || performance.now() - src.last < 900) return;
      const sr = src.el.getBoundingClientRect(); blink(src, 0, true);
      for (const s of squares) { if (s === src) continue; const r = s.el.getBoundingClientRect(), d = Math.hypot(r.left - sr.left, r.top - sr.top); if (d < wave) blink(s, 70 + d * 1.4, false); }
    }, { passive: true });
    if (REDUCED) return;
    let qs = 0, last = performance.now();
    (function f(now) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const r = sec.getBoundingClientRect(), vh = innerHeight;
      if (r.top < vh * 1.4 && r.bottom > -50) {
        const goal = easeOut(clamp(1 - (r.top - vh * 0.35) / (vh * 0.65)));
        qs += (goal - qs) * (1 - Math.exp(-dt * 7));
        rows.forEach((row, i) => { row.style.transform = `translate3d(0,${((1 - qs) * (70 + i * 52) * u()).toFixed(2)}px,0)`; });
      }
      requestAnimationFrame(f);
    })(last);
  })();

  /* =====================================================================
     Media — the homepage work images: each reveals from its top edge as it
     scrolls in, settling from a slight zoom, and the grid under the cursor
     bends the picture with a small RGB split (WebGL, homepage shader).
     Hover also flicks through the project's shots, on the same canvas.
     ===================================================================== */
  const GL_GRID = 28;
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
  if (uHv > .001) {   // the View peek: a ragged patch of pixels under the cursor shows the next shot
    vec2 px = uv * uRes, cell = floor(px / uK), g = (cell + .5) * uK;
    float r = uHv * min(uRes.x, uRes.y) * .15, dd = length(g - uM * uRes) + (h(cell) - .5) * uK * 1.6;
    if (dd < r) { vec2 cn = coverN(uv - d); o = vec4(texture(uN, cn + d*.4).r, texture(uN, cn).g, texture(uN, cn - d*.4).b, 1.); }
  }
}`;
  const medias = [];
  const makeMedia = (el) => {
    const m = { el, imgs: [...el.querySelectorAll("img")], r: REDUCED ? 1 : 0, last: -1, k: 0, gl: null };
    const GW = GL_GRID, GH = Math.round(GL_GRID * 480 / 784);
    m.GW = GW; m.GH = GH; m.disp = new Float32Array(GW * GH * 2);
    m.mouse = { x: 0.5, y: 0.5, sx: 0.5, sy: 0.5, vx: 0, vy: 0, inside: false, px: null, py: null }; m.hv = 0;
    m.word = document.createElement("span"); m.word.className = "wk-media__word"; m.word.setAttribute("aria-hidden", "true"); m.word.textContent = "View"; el.appendChild(m.word);
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
      m.tex = m.imgs.map(() => null); m.size = m.imgs.map(() => [784, 480]);
      const load = (im, i) => {
        const go = () => {
          gl.activeTexture(gl.TEXTURE0); const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t); params(gl.LINEAR);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
          m.tex[i] = t; m.size[i] = [im.naturalWidth, im.naturalHeight];
          if (i === 0) { m.gl = gl; m.cv = cv; el.appendChild(cv); el.classList.add("is-gl"); m.last = -1; }
        };
        im.complete && im.naturalWidth ? go() : im.addEventListener("load", go, { once: true });
      };
      m.imgs.forEach(load);
    } catch (err) { if (err) console.warn("Work media: WebGL unavailable, showing plain images.", err); }
    // hover input
    el.addEventListener("pointermove", (e) => {
<<<<<<< HEAD
      return;   // the picture stays still under the cursor: only the black View button follows it (data-cur on the link)
=======
>>>>>>> f0e7d935b7adba6199409368d09b447496a99313
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect(), M = m.mouse, x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      if (M.px !== null) { M.vx = x - M.px; M.vy = y - M.py; }
      M.x = x; M.y = y; M.px = x; M.py = y; M.inside = true;
    });
    el.addEventListener("pointerleave", () => { m.mouse.inside = false; m.mouse.px = null; });
    // hover flick through the project's shots (same timing as before)
    if (m.imgs.length > 1) {
      let t = 0;
      const show = (i) => { m.imgs[m.k].classList.remove("is-on"); m.k = i; m.imgs[m.k].classList.add("is-on"); m.last = -1; };
      el.addEventListener("pointerenter", (e) => {
<<<<<<< HEAD
        return;   // no flipping through the shots on hover: the picture stays the same
=======
>>>>>>> f0e7d935b7adba6199409368d09b447496a99313
        if (REDUCED || (e.pointerType && e.pointerType !== "mouse")) return;
        clearInterval(t); show(1 % m.imgs.length);
        t = setInterval(() => show((m.k + 1) % m.imgs.length), CFG.hoverFrameMs);
      });
      el.addEventListener("pointerleave", () => { clearInterval(t); show(0); });
    }
    return m;
  };
  { const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); medias.push(makeMedia(e.target)); } }), { rootMargin: "900px 0px" });
    document.querySelectorAll(".wk-media").forEach((el) => io.observe(el)); }
  function stepDisp(m) {
    const { disp, mouse, GW, GH } = m, rad = 0.22 * GW;
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
  (function loop() {
    let lastT = performance.now();
    (function f(now) {
      const dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
      const vh = innerHeight;
      for (const m of medias) {
        const rect = m.el.getBoundingClientRect();
        if (!rect.height) continue;
        const goal = REDUCED ? 1 : clamp((vh - rect.top) / (vh * CFG.revealSpan));
        m.r += (goal - m.r) * (1 - Math.pow(1 - 0.08, dt * 60));
        if (Math.abs(goal - m.r) < 0.0005) m.r = goal;
        if (rect.bottom < -60 || rect.top > vh + 60) continue;
        const e = easeIO(m.r);
        if (m.gl) {
          const M = m.mouse; M.sx += (M.x - M.sx) * .22; M.sy += (M.y - M.sy) * .22;
          m.hv += (((M.inside && m.r > .98) ? 1 : 0) - m.hv) * Math.min(1, dt * 7); if (m.hv < .002) m.hv = 0;
          m.word.classList.toggle("on", M.inside && FINE);
          m.word.style.translate = `calc(${(M.sx * rect.width).toFixed(1)}px - 50%) calc(${(M.sy * rect.height).toFixed(1)}px - 50%)`;
          const moving = stepDisp(m) || m.hv > 0;
          if (!moving && Math.abs(m.r - m.last) < 0.0005) continue;
          m.last = m.r;
          const gl = m.gl, cv = m.cv, dpr = Math.min(devicePixelRatio || 1, 2);
          const cw = Math.round(rect.width * dpr), ch = Math.round(rect.height * dpr);
          if (cv.width !== cw || cv.height !== ch) { cv.width = cw; cv.height = ch; }
          gl.viewport(0, 0, cw, ch);
          gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, m.dispTex);
          gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, m.GW, m.GH, gl.RG, gl.FLOAT, m.disp);
          const k = m.tex[m.k] ? m.k : 0;
          gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, m.tex[k]);
          gl.uniform2f(m.U.uRes, cw, ch); gl.uniform2f(m.U.uS, ...m.size[k]); gl.uniform1f(m.U.uR, e);
          const n = m.tex.length, nk = m.tex[(k + 1) % n] ? (k + 1) % n : k;   // the peek shows the shot after the one on screen
          gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, m.tex[nk]); gl.uniform2f(m.U.uSN, ...m.size[nk]); gl.activeTexture(gl.TEXTURE0);
<<<<<<< HEAD
          gl.uniform2f(m.U.uM, M.sx, M.sy); gl.uniform1f(m.U.uHv, 0); /* the hover patch is off everywhere: the picture never changes under the cursor (only the black label follows it) */ gl.uniform1f(m.U.uK, Math.round(12 * cw / 609));
=======
          gl.uniform2f(m.U.uM, M.sx, M.sy); gl.uniform1f(m.U.uHv, m.hv); gl.uniform1f(m.U.uK, Math.round(12 * cw / 609));
>>>>>>> f0e7d935b7adba6199409368d09b447496a99313
          gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        } else {
          if (Math.abs(m.r - m.last) < 0.0005) continue;
          m.last = m.r;
          m.el.style.setProperty("--hide", ((1 - e) * 100).toFixed(2) + "%");
          m.el.style.setProperty("--z", (1.14 - 0.14 * e).toFixed(4));
        }
      }
      requestAnimationFrame(f);
    })(lastT);
  })();

  /* =====================================================================
     Filters + Grid / Index
     ===================================================================== */
  (function lists() {
    const box = document.querySelector(".wk-views-box"); if (!box) return;
    const tabs = [...document.querySelectorAll(".wk-tab")], views = [...document.querySelectorAll(".wk-view")];
    const cards = [...box.querySelectorAll(".wk-card")], rows = [...box.querySelectorAll(".wk-row")];
    const fbar = document.querySelector(".wk-fbar");
    box.style.setProperty("--ix-ms", CFG.index.ms + "ms");
    box.style.setProperty("--ix-st", CFG.index.stagger + "ms");
    let filter = "all", view = /index/i.test(location.hash + location.search) ? "index" : "grid", busy = 0;

    const enter = (els) => {
      let k = 0;
      els.forEach((el) => {
        if (el.hidden) return;
        const r = el.getBoundingClientRect();
        el.classList.remove("is-enter"); void el.offsetWidth;
        if (r.top < innerHeight * 1.1) { el.style.setProperty("--k", k++); el.classList.add("is-enter"); }
      });
    };
    const apply = () => {
      const ok = (el) => filter === "all" || el.dataset.tags.split(" ").includes(filter);
      cards.forEach((c) => (c.hidden = !ok(c)));
      rows.forEach((r) => (r.hidden = !ok(r)));
      box.dataset.view = view;
      views.forEach((v) => v.setAttribute("aria-pressed", v.dataset.view === view ? "true" : "false"));
      tabs.forEach((t) => t.setAttribute("aria-pressed", t.dataset.f === filter ? "true" : "false"));
    };
    function change(fn) {
      clearTimeout(busy);
      const top = box.getBoundingClientRect().top, bar = fbar ? fbar.offsetHeight : 0;
      if (REDUCED) { fn(); apply(); return; }
      box.classList.add("is-swapping");
      busy = setTimeout(() => {
        fn(); apply();
        if (top < bar) {                                    // we were deep in the list: start from its top
          const y = scrollY + box.getBoundingClientRect().top - bar - 40 * u();
          B30.scrollTo ? B30.scrollTo(y, { immediate: true }) : scrollTo(0, y);
        }
        box.classList.remove("is-swapping");
        enter(view === "grid" ? cards : rows);
        medias.forEach((m) => (m.last = -1));
      }, 300);
    }
    tabs.forEach((t) => t.addEventListener("click", () => { if (t.dataset.f !== filter) change(() => (filter = t.dataset.f)); }));
    views.forEach((v) => v.addEventListener("click", () => {
      if (v.dataset.view === view) return;
      change(() => (view = v.dataset.view));
      try { history.replaceState(null, "", view === "index" ? "#index" : location.pathname + location.search); } catch (_) {}
    }));
    apply();

    // filter bar: a hairline of white behind it once it's stuck (it covers the list as you scroll)
    if (fbar) {
      // stuck = pinned at the top of the screen while the list is still under it
      let fr = 0;
      const stuck = () => { fr = 0; const r = fbar.getBoundingClientRect(), box = fbar.parentElement.getBoundingClientRect();
        fbar.classList.toggle("is-stuck", r.top <= 0.5 && box.bottom > r.bottom + 1); };
      addEventListener("scroll", () => { if (!fr) fr = requestAnimationFrame(stuck); }, { passive: true });
      addEventListener("resize", stuck); stuck();
    }

    // index rows: open on hover (images rise in one after another), close the same way
    rows.forEach((row) => {
      const open = (on) => row.classList.toggle("is-open", on);
      row.addEventListener("pointerenter", (e) => { if (!e.pointerType || e.pointerType === "mouse") open(true); });
      row.addEventListener("pointerleave", () => open(false));
      const a = row.querySelector("a");
      a.addEventListener("focus", () => open(true)); a.addEventListener("blur", () => open(false));
    });
  })();

  /* =====================================================================
     One team — pink pixels build bottom-up as you arrive (homepage services
     band, Figma Pixelate on #FAD7FF), then the hand comes in from the right
     ===================================================================== */
  (function hello() {
    const sec = document.querySelector(".wk-hello"); if (!sec) return;
    const frame = sec.querySelector(".wk-hello__f"), hand = sec.querySelector(".wk-hello__hand"), img = hand && hand.querySelector("img");
    const cv = sec.querySelector(".wk-hello__px"), ctx = cv.getContext("2d");
    const CELL = 80, TOP = -193, BOTTOM = 241;
    const FIG = { "-239": [8, 9, 10, 12, 14, 17, 18, 19, 20, 21], "-159": [1, 5, 6, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 20], "-79": [1, 3, 4, 6, 8, 9, 10, 12, 13, 14, 16, 17, 18, 21, 23] };
    const LIGHT = ["#FAD7FF", "#F9D4FE", "#FBDBFF", "#F9D6FE"], DARK = ["#FAD7FF", "#F9D4FE", "#FBDBFF", "#F9D6FE"];   // the same pink by night
    const rr = (n) => { const v = Math.sin(n * 91.345 + 7.13) * 43758.5453; return v - Math.floor(v); };
    const cells = []; let n = 0;
    for (let y = -239; y < BOTTOM; y += CELL) {
      const row = FIG[String(y)], yn = (y - TOP) / (BOTTOM - TOP);
      for (let c = 0; c < 24; c++) {
        n++;
        if (row && !row.includes(c)) continue;
        cells.push({ x: c * CELL, y, t0: clamp(1 - yn) * 0.62 + rr(n) * 0.2, ti: row ? 0 : (rr(n * 3) * LIGHT.length) | 0 });
      }
    }
    let s = 1, dpr = 1, cur = 0, raf = 0, lastPr = -1, handIn = false;
    function size() {
      s = document.documentElement.clientWidth / 1920; dpr = Math.min(devicePixelRatio || 1, 2);
      const fTop = frame.offsetTop;
      cv.style.top = fTop + TOP * s + "px"; cv.style.height = (BOTTOM - TOP) * s + "px";
      cv.width = Math.round(document.documentElement.clientWidth * dpr); cv.height = Math.round((BOTTOM - TOP) * s * dpr);
      lastPr = -1; cur = progress(); draw();
    }
    function progress() {
      const top = frame.getBoundingClientRect().top + TOP * s, vh = innerHeight;
      return REDUCED ? 1 : clamp((vh + CFG.hello.lead - top) / (vh * 0.8));
    }
    function draw() {
      raf = 0;
      const goal = progress();
      cur += (goal - cur) * (REDUCED ? 1 : 0.13);
      if (Math.abs(goal - cur) < 0.0006) cur = goal;
      if (cur !== goal) raf = requestAnimationFrame(draw);
      if (hand) {                                            // the pixels are in: the hand reaches in from the right
        if (!handIn && cur > 0.86) { handIn = true; hand.classList.add("is-in"); }
        else if (handIn && cur < 0.3) { handIn = false; hand.classList.remove("is-in"); }
      }
      if (Math.abs(cur - lastPr) < 0.0002) return;
      const pr = (lastPr = cur);
      ctx.setTransform(s * dpr, 0, 0, s * dpr, 0, -TOP * s * dpr);
      ctx.clearRect(0, TOP, 1920, BOTTOM - TOP);
      for (const c of cells) {
        const a = clamp((pr - c.t0) / 0.05);
        if (a <= 0) continue;
        const e = easeOut(a), sz = CELL * (0.74 + 0.26 * e) + 1, o = (CELL - sz) / 2;
        ctx.globalAlpha = e; ctx.fillStyle = (document.documentElement.classList.contains("dark") ? DARK : LIGHT)[c.ti];
        ctx.fillRect(c.x + o, c.y + o, sz, sz);
      }
      ctx.globalAlpha = 1;
    }
    addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(draw); }, { passive: true });
    addEventListener("resize", size);
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(size);
    size();
    // once it's in, the hand keeps a slow, small drift (Services page) plus a touch of scroll parallax
    if (img && !REDUCED) {
      let vis = false, px = -1e4, py = -1e4, ox = 0, oy = 0, orot = 0, lastB = performance.now();
      addEventListener("pointermove", (e) => { if (e.pointerType === "mouse") { px = e.clientX; py = e.clientY; } }, { passive: true });
      document.addEventListener("pointerleave", () => { px = py = -1e4; });
      new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis) { lastB = performance.now(); requestAnimationFrame(bob); } }).observe(sec);
      function bob(now) {
        if (!vis) return;
        const U = u(), dtb = Math.min(0.05, (now - lastB) / 1000); lastB = now;
        // the cursor nudges the hand away, along the line from the cursor to the hand (CFG.hello.push)
        const P = CFG.hello.push, hr = hand.getBoundingClientRect();
        const cx = hr.left + hr.width * 0.3, cy = hr.top + hr.height * 0.48;   // around the grip and the mark
        const dx = cx - px, dy = cy - py, d = Math.hypot(dx, dy), R = P.radius * U;
        let gx = 0, gy = 0, gr = 0;
        if (handIn && d < R && d > 1) { const f = Math.pow(1 - d / R, 2) * P.strength * U; gx = (dx / d) * f; gy = (dy / d) * f; gr = (gy / (P.strength * U)) * P.turn; }
        const k = 1 - Math.exp(-dtb * P.ease);
        ox += (gx - ox) * k; oy += (gy - oy) * k; orot += (gr - orot) * k;
        const rr = sec.getBoundingClientRect(), par = (rr.top + rr.height / 2 - innerHeight / 2) * -0.04;
        img.style.transform = `translate3d(${(Math.sin(now * 0.00052) * 10 * U + ox).toFixed(2)}px,${(Math.sin(now * 0.0007) * 12 * U + par + oy).toFixed(2)}px,0) rotate(${(Math.sin(now * 0.00045) * 0.8 - orot).toFixed(3)}deg)`;
        requestAnimationFrame(bob);
      }
    }
  })();

  B30.bindHover && B30.bindHover(document);
})();
