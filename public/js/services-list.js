/* Services page data — written by the Astro page into <script id="b30-content"> (edit it in src/data/services.js). */
window.SV_ICONS = (window.B30_CONTENT.servicesPage || {}).icons || {};
window.SV_HERO_IMGS = (window.B30_CONTENT.servicesPage || {}).heroImages || {};

/* =====================================================================
   SERVICES PAGE — CONFIG
   ===================================================================== */
window.SV_CFG = {
  icon: {
    // the "Our vision" pixels: small brand-colour squares on three depth layers, drifting in space
    mask: 96,               // icon outline is rasterised at this size …
    pitch: 4,               // … and sampled every n mask px (one pixel per sample)
    stroke: 2.1,            // outline weight on the 24-unit icon grid
    fit: 0.94,              // icon width inside its 396px square (stays clear of the button)
    thick: 0.06,            // extrusion: the icon is a solid with this much depth (× icon size)
    px: 0.0155,             // base pixel size (× icon size) ≈ 5px at 396px, as in "Our vision"
    layers: [{ size: 0.8, alpha: 1 }, { size: 1, alpha: 1 }, { size: 1.22, alpha: 1 }],   // same depth layers, full brand colour
    colors: [["#3457BA", 3], ["#F95050", 2], ["#0C5238", 2], ["#0D1432", 2], ["#F4EB02", 1], ["#B0E9FD", 1], ["#FAD7FF", 1]],
    yaw: 0.62, pitch3d: 0.2, pitchBase: 0.12, yawSpeed: 0.00034, pitchSpeed: 0.00026,
    float: 0.016, drift: 0.006,
    morphMs: 560, morphSpread: 160, arc: 0.14,
    repel: { radius: 0.2, strength: 0.09, ease: 80 }   // cursor pushes pixels apart (globe-style)
  },
  neg: {                    // pixel-field icons (values in design px at a 784px-wide box)
    // "positive": the pixels form the icon, the rest of the field thins to a light dust
    // "negative": the pixels fill the box and the icon is the white space they leave
    // (try either with ?icons=negative or ?icons=positive in the address bar)
    mode: (new URLSearchParams(location.search).get("icons") || "positive"),
    strokePos: 2.6,         // positive mode: a bolder outline so the icon reads at a glance
    iconSize: 1.1,          // positive mode: icon pixels a little bigger than the field's
    iconCalm: 0.3,          // positive mode: icon pixels move this much of the scene's drift and swell, so the shape holds
    dust: 0.045,            // positive mode: share of background pixels that stay as loose dust
    gather: 0.55,           // positive mode: background pixels drift this far toward the icon as they fade
    pitch: 9,               // spacing of the pixel field
    keep: 0.92,             // share of grid spots that hold a pixel (the rest is the "space" look)
    px: 5,                  // pixel size, as in "Our vision" …
    layers: [0.7, 1, 1.35], // … on three depth layers
    fit: 0.82,              // icon height inside the box
    stroke: 2.5,            // outline weight on the 24-unit icon grid (wider = bolder negative space)
    edge: 0.45,             // pushed pixels settle this far past the edge (× pitch)
    tau: 70, spread: 140,   // how fast pixels move to the new icon (ms) and how much they stagger
    drift: 2.2, parallax: 9,   // each pixel's own float, and how far the scene leans with the mouse
    wave: 3.2, waveSpeed: 0.7, // a slow swell that rolls through the whole field
    bob: 4,                 // the icon gently rises and falls (design px)
    repel: { radius: 70, strength: 26, ease: 80 }   // the cursor makes its own space, like the globe
  },
  holo: {                   // one calm hologram: a clean pixel sphere with the service icon inside
    mask: 168,              // icon outline is rasterised at this size …
    step: 2,                // … and sampled every n px
    stroke: 2.2,            // stroke weight on the 24-unit icon grid: the thickness of the 3D tube
    fit: 0.56,              // icon size (× box height), inside the sphere
    depth: 1.1,             // how round the tube is front to back
    px: 0.0062,             // pixel size (× box height)
    floor: 0.72,            // a light, even texture along the strokes
    back: 0.4,              // share of the strokes that also show their far side
    backAlpha: 0.3,         // the far side shows through, dimmer
    stray: 0.015, fray: 0.03,  // just a few pixels lift off the surface
    sweep: 0.00022,         // speed of the light travelling along the icon
    sparkle: 0,             // no random glints
    yaw: 0.4, pitch: 0.14,  // how far the icon turns in space
    morphMs: 620, morphSpread: 150,   // an unhurried change from one icon to the next
    deep: [["#0D1432", 5], ["#3457BA", 5]],   // the faces turned to you (the discipline's colour is added per icon)
    pale: ["#B0E9FD", "#FAD7FF"],            // edges and the light sweep
    shell: {                // the holographic sphere: dense, banded, iridescent, with a round silhouette
      radius: 0.47,         // × box height
      count: 3600,          // pixels in the shell
      thick: 0.04,          // shell thickness (× radius)
      px: 0.0054,           // shell pixel size (× box height)
      bands: 6, bandWidth: 0.1, clumps: 7, floor: 0.2,   // pixels gather along bands and patches, as in the reference
      stray: 0.02,          // a few drift just past the edge
      breathe: 0.004,       // the shell barely swells
      spin: 0.0001,         // a slow turn (rad/ms)
      tilt: 0.32,           // tilt toward you (rad)
      nearAlpha: 0.55, farAlpha: 0.24,  // the near side stays light enough for the icon to read through
      iri: ["#3457BA", "#B0E9FD", "#FAD7FF", "#F95050", "#B0E9FD", "#3457BA", "#FAD7FF", "#0D1432"],   // the colours that run around its rim
      ring: { count: 0 }
    },
    dust: { count: 0, px: 0.0085, drift: 0.008, parallax: 0.02 }   // no loose dust: the circle stands on its own
  },
  heroFrameMs: 420,         // hero image: the next image every n ms while a discipline is hovered (GIF-style, fast)
  heroSwapMs: 100,          // …each change is a rigid 100ms wipe, no fade
  heroRevealMs: 760,        // each image appears like the case-study images: from the top edge, settling from 1.14× zoom
  hello: { lead: 100 }      // as on the homepage: pixels start forming 100px before the band reaches the screen
};

(() => {
  "use strict";
  const B30 = window.B30 || {};
  const CFG = window.SV_CFG;
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = matchMedia("(max-width: 899px)");
  const u = () => document.documentElement.clientWidth / 1920;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const hash = (s) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const hexRgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const C = { mid: "#0D1432", blue: "#3457BA", fresh: "#0C5238", flash: "#F4EB02" };

  const FIELDS = [];
  class PixelField {
    constructor(host, opts = {}) {
      this.host = host; this.cv = host.querySelector("canvas"); this.g = this.cv.getContext("2d");
      this.o = Object.assign({ pad: 0.3, aspect: 1, persp: 2.6, tilt: 1 }, CFG.icon, opts);
      this.n = 0; this.cap = 0; this.visible = false; this.px = -1e4; this.py = -1e4; this.mx = 0; this.my = 0; this.smx = 0; this.smy = 0;
      this.seed = Math.random() * 1000;
      host.addEventListener("pointermove", (e) => { const r = this.cv.getBoundingClientRect(); this.px = e.clientX - r.left; this.py = e.clientY - r.top;
        const hr = host.getBoundingClientRect(); this.mx = clamp(((e.clientX - hr.left) / hr.width) * 2 - 1, -1, 1); this.my = clamp(((e.clientY - hr.top) / hr.height) * 2 - 1, -1, 1); });
      host.addEventListener("pointerleave", () => { this.px = this.py = -1e4; this.mx = this.my = 0; });
      new ResizeObserver(() => this.size()).observe(host);
      new IntersectionObserver(([e]) => { this.visible = e.isIntersecting; if (this.visible) loop(); }, { rootMargin: "120px 0px" }).observe(host);
      this.size();
      FIELDS.push(this);
    }
    size() {
      const w = this.host.clientWidth, h = this.host.clientHeight; if (!w) return;
      const pad = Math.round((this.o.wide ? h : w) * this.o.pad), dpr = Math.min(2, devicePixelRatio || 1);
      this.B = this.o.wide ? h : w; this.H = h; this.W = w; this.pad = pad;
      if (this.o.dust) this.makeDust();
      this.cw = w + pad * 2; this.ch = h + pad * 2;
      Object.assign(this.cv.style, { left: -pad + "px", top: -pad + "px", width: this.cw + "px", height: this.ch + "px" });
      this.cv.width = Math.round(this.cw * dpr); this.cv.height = Math.round(this.ch * dpr); this.dpr = dpr;
    }
    /* ambient pixels: the same brand-colour pixels, loose in the space around the icon, so the whole box reads as one scene */
    makeDust() {
      const O = this.o.dust, B = this.B, r = rng(hash(this.host.closest("section").id || "x"));
      const right = this.W / B - 0.5, out = [];
      let tries = 0;
      while (out.length < O.count && tries++ < O.count * 20) {
        const x = -0.55 + r() * (right + 0.6), y = -0.5 + r() * 1.0;
        const dIcon = Math.hypot(x, y);
        if (dIcon < 0.5) continue;                                 // keep the icon itself clean
        if (r() > Math.min(1, 0.35 + (x / Math.max(0.5, right)) * 0.9)) continue;   // a little denser toward the open right side
        const k = r();
        out.push({ x, y, z: (r() - 0.5) * 0.6, s: O.px * (k < 0.4 ? 0.7 : k < 0.8 ? 1 : 1.3), c: `rgb(${hexRgb(pickW(r, CFG.icon.colors)).join(",")})`,
          ph: r() * 6.283, f: 0.1 + r() * 0.16, par: k < 0.4 ? 0.4 : k < 0.8 ? 1 : 1.6, ox: 0, oy: 0 });
      }
      this.dust = out;
    }
    alloc(cap) {
      if (cap <= this.cap) return;
      const F = (k) => { const a = new Float32Array(cap); if (this[k]) a.set(this[k]); this[k] = a; };
      ["fx", "fy", "fz", "fs", "fr", "fg", "fb", "tx", "ty", "tz", "ts", "tr", "tg", "tb", "t0", "du", "ar", "ox", "oy", "ph", "al", "fq", "nx", "ny", "nz", "pi"].forEach(F);
      for (let i = this.cap; i < cap; i++) { this.ph[i] = Math.random() * 6.283; this.fq[i] = 0.16 + Math.random() * 0.22; this.al[i] = 1; this.du[i] = 1; this.t0[i] = -1e9; }
      this.cap = cap;
    }
    /* current interpolated state of particle i → out */
    state(i, now, out) {
      const e = easeIO(clamp((now - this.t0[i]) / this.du[i]));
      out[0] = this.fx[i] + (this.tx[i] - this.fx[i]) * e;
      out[1] = this.fy[i] + (this.ty[i] - this.fy[i]) * e;
      out[2] = this.fz[i] + (this.tz[i] - this.fz[i]) * e + this.ar[i] * Math.sin(Math.PI * e);
      out[3] = this.fs[i] + (this.ts[i] - this.fs[i]) * e;
      out[4] = this.fr[i] + (this.tr[i] - this.fr[i]) * e;
      out[5] = this.fg[i] + (this.tg[i] - this.fg[i]) * e;
      out[6] = this.fb[i] + (this.tb[i] - this.fb[i]) * e;
      return e;
    }
    /* T: [{x,y,z,s,c:[r,g,b]}] in units of the box width, centred */
    setTargets(T, { assemble = false } = {}) {
      const now = performance.now(), st = new Float32Array(7), O = this.o;
      this.alloc(Math.max(this.cap, (this.n || 0) + T.length + 8));
      const N = this.cap, act = [], free = [];
      for (let i = 0; i < N; i++) {                        // freeze where everything is right now
        this.state(i, now, st);
        this.fx[i] = st[0]; this.fy[i] = st[1]; this.fz[i] = st[2]; this.fs[i] = st[3]; this.fr[i] = st[4]; this.fg[i] = st[5]; this.fb[i] = st[6];
        this.ar[i] = 0;
        (this.ts[i] > 0 ? act : free).push(i);
      }
      const ang = (x, y) => Math.atan2(y, x) + Math.hypot(x, y) * 0.35;
      act.sort((a, b) => ang(this.fx[a], this.fy[a]) - ang(this.fx[b], this.fy[b]));
      const tg = T.map((t, j) => ({ t, j, a: ang(t.x, t.y) })).sort((a, b) => a.a - b.a);
      const nA = act.length, nT = tg.length, used = new Uint8Array(N);
      const go = (i, t, delay) => {
        if (t.nx !== undefined) { this.nx[i] = t.nx; this.ny[i] = t.ny; this.nz[i] = t.nz; this.pi[i] = t.pi; this.al[i] = t.a; }   // holographic icons
        this.tx[i] = t.x; this.ty[i] = t.y; this.tz[i] = t.z; if (t.a) this.al[i] = t.a; this.ts[i] = t.s; this.tr[i] = t.c[0]; this.tg[i] = t.c[1]; this.tb[i] = t.c[2];
        this.t0[i] = now + delay; this.du[i] = REDUCED ? 1 : O.morphMs * (0.85 + Math.random() * 0.3);
        this.ar[i] = REDUCED ? 0 : (Math.random() - 0.35) * O.arc;
      };
      let fi = 0;
      for (let k = 0; k < nT; k++) {
        const t = tg[k].t, delay = REDUCED ? 0 : (Math.hypot(t.x, t.y) * 1.4) * O.morphSpread + Math.random() * 90;
        let i;
        if (nA && !assemble) {
          const src = act[Math.floor((k * nA) / nT)];
          if (!used[src]) i = src;
          else {                                           // more pixels needed: a spare one grows out of its neighbour
            while (fi < free.length && used[free[fi]]) fi++;
            i = free[fi++]; if (i === undefined) continue;
            if (this.fs[i] < 0.0004) { this.fx[i] = this.fx[src]; this.fy[i] = this.fy[src]; this.fz[i] = this.fz[src]; this.fr[i] = this.fr[src]; this.fg[i] = this.fg[src]; this.fb[i] = this.fb[src]; this.fs[i] = 0; }
          }
        } else {                                           // first build: pixels gather in from the space around
          while (fi < free.length && used[free[fi]]) fi++;
          i = free[fi++]; if (i === undefined) continue;
          const r = 0.05 + Math.random() * 0.18, a = Math.random() * 6.283;      // warp in from deep in the field, like "Our vision"
          this.fx[i] = t.x * 0.4 + Math.cos(a) * r; this.fy[i] = t.y * 0.4 + Math.sin(a) * r; this.fz[i] = 1.6 + Math.random() * 1.2;
          this.fs[i] = 0; this.fr[i] = t.c[0]; this.fg[i] = t.c[1]; this.fb[i] = t.c[2];
        }
        used[i] = 1;
        go(i, t, assemble ? Math.random() * 520 : delay);
      }
      for (let k = 0; k < nA; k++) {                       // pixels the new shape doesn't need fold into it
        const i = act[k]; if (used[i]) continue;
        const t = tg.length ? tg[Math.floor((k * nT) / nA)].t : { x: this.fx[i], y: this.fy[i], z: 0, c: [this.fr[i], this.fg[i], this.fb[i]] };
        go(i, { x: t.x, y: t.y, z: t.z, s: 0, c: t.c }, Math.random() * 120);
      }
      this.n = nT;
      if (this.visible) loop();
    }
    draw(now, dt) {
      const g = this.g, O = this.o, B = this.B, st = this.st || (this.st = new Float32Array(7));
      if (!B) return;
      g.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      g.clearRect(0, 0, this.cw, this.ch);
      const k = Math.min(1, dt / 220);
      this.smx += (this.mx - this.smx) * k; this.smy += (this.my - this.smy) * k;
      const tt = REDUCED ? 0 : now + this.seed * 1000, ts = tt / 1000;
      const yaw = Math.sin(tt * O.yawSpeed) * O.yaw + this.smx * 0.3;
      const pit = O.pitchBase + Math.sin(tt * O.pitchSpeed + 1.3) * O.pitch3d - this.smy * 0.2;
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pit), sp = Math.sin(pit);
      const bob = REDUCED ? 0 : Math.sin(tt * 0.0011) * O.float * B;
      const F = O.persp * B, cx = this.pad + this.B / 2, ccy = this.pad + this.H / 2;
      const RP = O.repel, RR = RP.radius * B, RR2 = RR * RR, STR = RP.strength * B, kE = Math.min(1, dt / RP.ease);
      const rep = this.px > -1e3 && !REDUCED, dr = REDUCED ? 0 : O.drift * B;
      if (this.dust) {
        const D = this.o.dust, amp = D.drift * B;
        for (const p of this.dust) {
          let x = cx + p.x * B + Math.sin(ts * p.f * 6.283 + p.ph) * amp - this.smx * D.parallax * B * p.par;
          let y = ccy + p.y * B + Math.cos(ts * p.f * 5.3 + p.ph * 1.3) * amp - this.smy * D.parallax * B * p.par + bob * 0.4;
          let tx = 0, ty = 0;
          if (rep) { const dx = x - this.px, dy = y - this.py, d2 = dx * dx + dy * dy; if (d2 < RR2 && d2 > 0.01) { const d = Math.sqrt(d2), q = 1 - d / RR, pp = STR * q * q; tx = (dx / d) * pp; ty = (dy / d) * pp; } }
          p.ox += (tx - p.ox) * kE; p.oy += (ty - p.oy) * kE;
          const s = p.s * B;
          g.fillStyle = p.c; g.fillRect(x + p.ox - s / 2, y + p.oy - s / 2, s, s);
        }
      }
      const L = this.L || (this.L = []); L.length = 0;
      for (let i = 0; i < this.cap; i++) {
        if (this.ts[i] <= 0 && now - this.t0[i] > this.du[i]) { this.ox[i] *= 0.8; this.oy[i] *= 0.8; continue; }
        this.state(i, now, st);
        const s = st[3]; if (s <= 0.00002) continue;
        const ph = this.ph[i], f = this.fq[i];
        const X = st[0] * B + Math.sin(ts * f * 6.283 + ph) * dr, Y = st[1] * B + Math.cos(ts * f * 5.1 + ph * 1.7) * dr, Z = st[2] * B;
        const x1 = X * cy + Z * sy, z1 = -X * sy + Z * cy, y2 = Y * cp - z1 * sp, z2 = Y * sp + z1 * cp;
        const sc = F / (F + z2);
        let sx = cx + x1 * sc, syy = ccy + (y2 + bob) * sc, tx = 0, ty = 0;
        if (rep) {
          const dx = sx - this.px, dy = syy - this.py, d2 = dx * dx + dy * dy;
          if (d2 < RR2 && d2 > 0.01) { const d = Math.sqrt(d2), q = 1 - d / RR, p = STR * q * q; tx = (dx / d) * p; ty = (dy / d) * p; }
        }
        this.ox[i] += (tx - this.ox[i]) * kE; this.oy[i] += (ty - this.oy[i]) * kE;
        L.push([z2, sx + this.ox[i], syy + this.oy[i], s * B * sc, this.al[i], st[4] | 0, st[5] | 0, st[6] | 0]);
      }
      L.sort((a, b) => b[0] - a[0]);
            for (const p of L) {
        g.globalAlpha = 1;                                            // actual brand colours, no fading
        g.fillStyle = `rgb(${p[5]},${p[6]},${p[7]})`;
        g.fillRect(p[1] - p[3] / 2, p[2] - p[3] / 2, p[3], p[3]);
      }
      g.globalAlpha = 1;
    }
  }
  let raf = 0, last = 0;
  function loop() {
    if (raf) return;
    last = performance.now();
    const f = (now) => {
      const dt = Math.min(64, now - last); last = now;
      let any = false;
      for (const fl of FIELDS) if (fl.visible) { fl.draw(now, dt); any = true; }
      raf = any ? requestAnimationFrame(f) : 0;
    };
    raf = requestAnimationFrame(f);
  }


  /* ---------- icons: each one a solid made of the "Our vision" pixels (front, back and sides), so it has real depth ---------- */
  const ICONS = window.SV_ICONS || {};
  const CACHE = new Map();
  const pickW = (r, list) => { let t = 0; for (const [, w] of list) t += w; let x = r() * t; for (const [c, w] of list) { if ((x -= w) <= 0) return c; } return list[0][0]; };
  const mcan = document.createElement("canvas"), mg = mcan.getContext("2d", { willReadFrequently: true });
  function iconTargets(name, fit, colors) {
    const key = name + "|" + (fit || "") + (colors ? "|c" : "");
    if (CACHE.has(key)) return CACHE.get(key);
    const d = ICONS[name], O = Object.assign({}, CFG.icon, fit ? { fit } : null, colors ? { colors } : null), M = O.mask, out = [];
    if (!d) return out;
    mcan.width = mcan.height = M;
    mg.clearRect(0, 0, M, M); mg.save(); mg.scale(M / 24, M / 24);
    mg.lineWidth = O.stroke; mg.lineCap = "round"; mg.lineJoin = "round"; mg.strokeStyle = "#000";
    d.forEach((p) => mg.stroke(new Path2D(p)));
    mg.restore();
    const A = mg.getImageData(0, 0, M, M).data, G = O.pitch, n = Math.floor(M / G);
    const on = (gx, gy) => gx >= 0 && gy >= 0 && gx < n && gy < n && A[((gy * G + (G >> 1)) * M + gx * G + (G >> 1)) * 4 + 3] > 110;
    const r = rng(hash(name)), T = O.thick / 2, sc = O.fit / n;
    const add = (gx, gy, z, k) => out.push({
      x: (gx + 0.5 - n / 2 + (r() - 0.5) * 0.22) * sc, y: (gy + 0.5 - n / 2 + (r() - 0.5) * 0.22) * sc, z,
      s: O.px * O.layers[k].size, a: O.layers[k].alpha, c: hexRgb(pickW(r, O.colors)) });
    const lay = () => { const q = r(); return q < 0.35 ? 0 : q < 0.75 ? 1 : 2; };
    for (let gy = 0; gy < n; gy++) for (let gx = 0; gx < n; gx++) {
      if (!on(gx, gy)) continue;
      add(gx, gy, -T + (r() - 0.5) * 0.008, lay());                         // front face
      if (r() < 0.18) add(gx, gy, T + (r() - 0.5) * 0.008, lay());           // back face
      const edge = !on(gx - 1, gy) || !on(gx + 1, gy) || !on(gx, gy - 1) || !on(gx, gy + 1);
      if (edge && r() < 0.32) add(gx, gy, (r() - 0.5) * T, lay());   // the sides
    }
    CACHE.set(key, out);
    return out;
  }

  /* panel copy appears with the heading word-rise */
  function riseText(el, text) {
    el.setAttribute("aria-label", text);
    el.classList.remove("is-in");
    el.innerHTML = text.split(/\s+/).map((w, i) => `<span class="hw" aria-hidden="true"><span class="hw-i" style="--i:${i}">${w.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</span></span>`).join(" ");
    void el.offsetWidth;
    requestAnimationFrame(() => el.classList.add("is-in"));
  }


  /* =====================================================================
     Negative-space icons — the whole visual box is filled with the "Our vision"
     pixels; the icon is the space they leave. Hover a service and the pixels
     inside its outline are pushed out to the edges, so the icon appears as
     clean white space. The cursor pushes them too (globe-style).
     ===================================================================== */
  const NEG = CFG.neg;
  const ncan = document.createElement("canvas"), ng = ncan.getContext("2d", { willReadFrequently: true });
  class NegField {
    constructor(host) {
      this.host = host; this.cv = host.querySelector("canvas"); this.g = this.cv.getContext("2d");
      this.visible = false; this.px = -1e4; this.py = -1e4; this.mx = 0; this.my = 0; this.smx = 0; this.smy = 0; this.icon = null; this.built = false;
      host.addEventListener("pointermove", (e) => { const r = host.getBoundingClientRect(); this.px = e.clientX - r.left; this.py = e.clientY - r.top;
        this.mx = clamp((this.px / r.width) * 2 - 1, -1, 1); this.my = clamp((this.py / r.height) * 2 - 1, -1, 1); });
      host.addEventListener("pointerleave", () => { this.px = this.py = -1e4; this.mx = this.my = 0; });
      new ResizeObserver(() => this.size()).observe(host);
      new IntersectionObserver(([e]) => { this.visible = e.isIntersecting; if (this.visible) loop(); }, { rootMargin: "120px 0px" }).observe(host);
      FIELDS.push(this);
    }
    size() {
      const W = this.host.clientWidth, H = this.host.clientHeight; if (!W || !H) return;
      if (W === this.W && H === this.H) return;
      this.W = W; this.H = H; this.dpr = Math.min(2, devicePixelRatio || 1);
      Object.assign(this.cv.style, { left: "0px", top: "0px", width: W + "px", height: H + "px" });
      this.cv.width = Math.round(W * this.dpr); this.cv.height = Math.round(H * this.dpr);
      const U = Math.max(0.45, W / 784), p = NEG.pitch * U, r = rng(hash(this.host.closest("section").id));
      this.p = p; this.U = U;
      const P = [];
      for (let y = p / 2; y < H; y += p) for (let x = p / 2; x < W; x += p) {
        if (r() > NEG.keep) continue;
        const k = r(), L = k < 0.35 ? 0 : k < 0.78 ? 1 : 2;
        P.push({ hx: x + (r() - 0.5) * p * 0.35, hy: y + (r() - 0.5) * p * 0.35, L, s: NEG.px * U * NEG.layers[L],
          ci: 0, c: pickW(r, CFG.icon.colors), c2: pickW(r, [["#0D1432", 3], ["#3457BA", 3.2], ["#F95050", 2.2], ["#0C5238", 2]]), ph: r() * 6.283, f: 0.12 + r() * 0.2,
          ox: (r() - 0.5) * W * 0.5, oy: (r() - 0.5) * H * 0.7, tx: 0, ty: 0, k: 0, ts: 1, dust: r() < NEG.dust, rx: 0, ry: 0, d: 0 });
      }
      const cols = [...new Set(P.map((q) => q.c))];
      P.forEach((q) => (q.ci = cols.indexOf(q.c)));
      P.sort((a, b) => a.ci - b.ci);                       // batch the drawing by colour
      this.P = P; this.cols = cols;
      if (this.icon) this.setIcon(this.icon, true);
    }
    setIcon(name, quiet) {
      this.icon = name;
      if (!this.P) return;
      const W = this.W, H = this.H, G = Math.max(3, this.p / 2.4), gw = Math.ceil(W / G), gh = Math.ceil(H / G);
      ncan.width = gw; ncan.height = gh;
      ng.clearRect(0, 0, gw, gh); ng.save();
      const S = (H * NEG.fit) / 24 / G;
      ng.translate(gw / 2 - 12 * S, gh / 2 - 12 * S); ng.scale(S, S);
      ng.lineWidth = NEG.mode !== "negative" ? NEG.strokePos : NEG.stroke; ng.lineCap = "round"; ng.lineJoin = "round"; ng.strokeStyle = "#000";
      (ICONS[name] || []).forEach((d) => ng.stroke(new Path2D(d)));
      ng.restore();
      const A = ng.getImageData(0, 0, gw, gh).data, N = gw * gh;
      // nearest outside cell for every cell inside the outline (multi-source flood from the outside)
      const src = new Int32Array(N).fill(-1), q = new Int32Array(N); let qh = 0, qt = 0;
      for (let i = 0; i < N; i++) if (A[i * 4 + 3] < 100) { src[i] = i; q[qt++] = i; }
      while (qh < qt) {
        const i = q[qh++], x = i % gw, y = (i / gw) | 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= gw || ny >= gh) continue;
          const j2 = ny * gw + nx; if (src[j2] >= 0) continue;
          src[j2] = src[i]; q[qt++] = j2;
        }
      }
      const pos = NEG.mode !== "negative";
      let isrc = null;
      if (pos) {                                            // nearest inside cell for every cell outside the outline
        isrc = new Int32Array(N).fill(-1); qh = 0; qt = 0;
        for (let i = 0; i < N; i++) if (A[i * 4 + 3] >= 100) { isrc[i] = i; q[qt++] = i; }
        while (qh < qt) {
          const i = q[qh++], x = i % gw, y = (i / gw) | 0;
          for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= gw || ny >= gh) continue;
            const j2 = ny * gw + nx; if (isrc[j2] >= 0) continue;
            isrc[j2] = isrc[i]; q[qt++] = j2;
          }
        }
      }
      const now = performance.now();
      for (const pt of this.P) {
        if (pos) {
          const cx = Math.min(gw - 1, (pt.hx / G) | 0), cy = Math.min(gh - 1, (pt.hy / G) | 0), i = cy * gw + cx;
          if (A[i * 4 + 3] >= 100) { pt.tx = 0; pt.ty = 0; pt.ts = NEG.iconSize; }           // inside the outline: these pixels are the icon
          else if (pt.dust) { pt.tx = 0; pt.ty = 0; pt.ts = 0.7; }                 // a few stay as loose dust
          else {                                                                     // the rest drift toward the icon and fade out
            const s = isrc[i]; let tx = 0, ty = 0;
            if (s >= 0) { tx = (((s % gw) + 0.5) * G - pt.hx) * NEG.gather; ty = ((((s / gw) | 0) + 0.5) * G - pt.hy) * NEG.gather; }
            pt.tx = tx; pt.ty = ty; pt.ts = 0;
          }
          pt.d = quiet || REDUCED ? 0 : now + Math.random() * NEG.spread;
          continue;
        }
        const cx = Math.min(gw - 1, (pt.hx / G) | 0), cy = Math.min(gh - 1, (pt.hy / G) | 0), i = cy * gw + cx;
        let tx = 0, ty = 0;
        if (A[i * 4 + 3] >= 100 && src[i] >= 0) {               // inside the icon: pushed out to the nearest edge
          const s = src[i], sx = ((s % gw) + 0.5) * G, sy = (((s / gw) | 0) + 0.5) * G;
          const dx = sx - pt.hx, dy = sy - pt.hy, d = Math.hypot(dx, dy) || 1;
          tx = dx + (dx / d) * this.p * NEG.edge; ty = dy + (dy / d) * this.p * NEG.edge;
        }
        pt.tx = tx; pt.ty = ty; pt.ts = tx || ty ? 0.55 : 1;
        pt.d = quiet || REDUCED ? 0 : now + Math.random() * NEG.spread;
      }
      if (this.visible) loop();
    }
    draw(now, dt) {
      if (!this.P) return;
      const g = this.g, W = this.W, H = this.H, U = this.U;
      g.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      const k = Math.min(1, dt / 220); this.smx += (this.mx - this.smx) * k; this.smy += (this.my - this.smy) * k;
      const ts = now / 1000, ke = REDUCED ? 1 : 1 - Math.exp(-dt / NEG.tau);
      const RR = NEG.repel.radius * U, RR2 = RR * RR, STR = NEG.repel.strength * U, kR = Math.min(1, dt / NEG.repel.ease);
      const rep = this.px > -1e3 && !REDUCED, amp = REDUCED ? 0 : NEG.drift * U, par = NEG.parallax * U, LP = [-0.6, 0.3, 1];
      let ci = -1;
      for (const p of this.P) {
        if (now >= p.d) { p.ox += (p.tx - p.ox) * ke; p.oy += (p.ty - p.oy) * ke; p.k += (p.ts - p.k) * ke; }
        const calm = p.ts > 1.05 ? NEG.iconCalm : 1, wv = REDUCED ? 0 : NEG.wave * U * (0.6 + 0.4 * p.L) * calm, wx = p.hx / (90 * U), wy = p.hy / (90 * U);
        const lift = p.ts > 1.05 && !REDUCED ? Math.sin(ts * 1.1) * NEG.bob * U : 0;      // the icon floats as one
        let x = p.hx + p.ox + Math.sin(ts * p.f * 6.283 + p.ph) * amp * calm - this.smx * par * LP[p.L] + Math.cos(wy + ts * NEG.waveSpeed * 0.8) * wv;
        let y = p.hy + p.oy + Math.cos(ts * p.f * 5.1 + p.ph * 1.7) * amp * calm - this.smy * par * LP[p.L] + Math.sin(wx + ts * NEG.waveSpeed) * wv + lift;
        let tx = 0, ty = 0;
        if (rep) { const dx = x - this.px, dy = y - this.py, d2 = dx * dx + dy * dy; if (d2 < RR2 && d2 > 0.01) { const d = Math.sqrt(d2), f = 1 - d / RR, pp = STR * f * f; tx = (dx / d) * pp; ty = (dy / d) * pp; } }
        p.rx += (tx - p.rx) * kR; p.ry += (ty - p.ry) * kR;
        x += p.rx; y += p.ry;
        if (x < -2 || y < -2 || x > W + 2 || y > H + 2) continue;
        const s = p.s * p.k; if (s <= 0.3) continue;
        const col = p.c;                                       // every brand colour, icon and dust alike
        if (col !== ci) { ci = col; g.fillStyle = col; }
        g.fillRect(x - s / 2, y - s / 2, s, s);
      }
    }
  }

  /* =====================================================================
     Holographic icons — the icon itself is the hologram. Its strokes are
     built as a 3D volume of the same brand-colour square pixels (a rounded
     tube with a front, a back and sides), so it turns in space like the
     particle globe reference: pixels at its edges catch a pale light-blue
     and pink, the faces turned to you stay deep blue and midnight, a soft
     light sweeps along it, the far side shows through dimmer and smaller,
     pixels gather in denser patches, and a few fray off the surface. It
     morphs into the next icon on hover; the cursor pushes pixels aside.
     Around it turns a round hologram of the same pixels, banded and pale at
     its rim, and the loose dust thins out from its edge to the box sides.
     (?icons=positive or ?icons=negative bring back the flat pixel fields.)
     ===================================================================== */
  const HOLO = CFG.holo;
  const hcan = document.createElement("canvas"), hg = hcan.getContext("2d", { willReadFrequently: true });
  function holoTargets(name, accent) {
    const key = "holo|" + name + "|" + (accent || "");
    const deep = accent ? HOLO.deep.filter(([c]) => c !== "#F95050" && c !== accent).concat([[accent, accent === "#F4EB02" ? 1.3 : 2.2]]) : HOLO.deep;   // the discipline's colour runs through the icon
    if (CACHE.has(key)) return CACHE.get(key);
    const d = ICONS[name], out = [];
    if (!d) return out;
    const M = HOLO.mask, hw = (HOLO.stroke * M) / 24 / 2, N = M * M;
    hcan.width = hcan.height = M;
    hg.clearRect(0, 0, M, M); hg.save(); hg.scale(M / 24, M / 24);
    hg.lineWidth = HOLO.stroke; hg.lineCap = "round"; hg.lineJoin = "round"; hg.strokeStyle = "#000";
    d.forEach((p) => hg.stroke(new Path2D(p)));
    hg.restore();
    const A = hg.getImageData(0, 0, M, M).data;
    // nearest outside pixel for every pixel in the stroke: how deep into the tube it sits, and which way is "out"
    const src = new Int32Array(N).fill(-1), q = new Int32Array(N); let qh = 0, qt = 0;
    for (let i = 0; i < N; i++) if (A[i * 4 + 3] < 110) { src[i] = i; q[qt++] = i; }
    while (qh < qt) {
      const i = q[qh++], x = i % M, y = (i / M) | 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= M || ny >= M) continue;
        const j = ny * M + nx; if (src[j] >= 0) continue;
        src[j] = src[i]; q[qt++] = j;
      }
    }
    const r = rng(hash(name) + 11), sc = HOLO.fit / M, G = HOLO.step;
    const patch = (x, y) => {                                   // smooth noise: denser and sparser patches along the strokes
      const a = x / M * 6.283, b = y / M * 6.283;
      return 0.5 + 0.25 * Math.sin(a * 2.3 + b * 1.1 + 1.7) + 0.25 * Math.sin(b * 3.1 - a * 1.6 + 0.4);
    };
    for (let y = 0; y < M; y += G) for (let x = 0; x < M; x += G) {
      const jx = Math.min(M - 1, x + ((r() * G) | 0)), jy = Math.min(M - 1, y + ((r() * G) | 0)), i = jy * M + jx;
      if (A[i * 4 + 3] < 110) continue;
      if (r() > HOLO.floor + (1 - HOLO.floor) * patch(jx, jy)) continue;
      const s0 = src[i], ex = (s0 % M) - jx, ey = ((s0 / M) | 0) - jy, e = Math.hypot(ex, ey) || 0.5;
      const gx = ex / e, gy = ey / e;                           // outward, in the icon's plane
      const off = Math.min(1, Math.max(0, (hw - e) / hw));       // 0 on the centre line, 1 at the edge
      const zz = Math.sqrt(Math.max(0, 1 - off * off));          // how far the tube bulges toward you here
      const X = (jx - M / 2) * sc, Y = (jy - M / 2) * sc, Z = zz * hw * sc * HOLO.depth;
      const faces = r() < HOLO.back ? [-1, 1] : [-1];             // front face always, the back face often
      for (const f of faces) {
        let px = X, py = Y, pz = f * Z, nx = gx * off, ny = gy * off, nz = f * zz;
        let stray = 0;
        if (r() < HOLO.stray) { stray = 0.01 + r() * HOLO.fray; px += nx * stray; py += ny * stray; pz += nz * stray; }   // frayed pixels lift off the surface
        const k = r();
        out.push({ x: px, y: py, z: -pz, s: HOLO.px * (k < 0.5 ? 0.75 : k < 0.88 ? 1 : 1.45), a: stray ? 0.6 : 1,
          c: hexRgb(pickW(r, deep)), nx, ny, nz: -nz, pi: (r() * HOLO.pale.length) | 0 });
      }
    }
    CACHE.set(key, out);
    return out;
  }
  const PALE = HOLO.pale.map(hexRgb);
  class HoloField extends PixelField {
    constructor(host) {
      super(host, { wide: true, pad: 0.24, yaw: HOLO.yaw, pitch3d: HOLO.pitch, dust: HOLO.dust, morphMs: HOLO.morphMs || 560, morphSpread: HOLO.morphSpread || 160, drift: 0.003, float: 0.008 });
      const SH = HOLO.shell, r = rng(hash((host.closest("section") || {}).id || "holo") + 7), S = [];
      const dir = () => { const a = r() * 6.283, b = Math.acos(2 * r() - 1); return [Math.sin(b) * Math.cos(a), Math.cos(b), Math.sin(b) * Math.sin(a)]; };
      const bands = Array.from({ length: SH.bands }, dir), clumps = Array.from({ length: SH.clumps }, dir);
      let tries = 0;
      while (S.length < SH.count && tries++ < SH.count * 30) {
        const n = dir();
        let w = 0;
        for (const b of bands) { const d = n[0] * b[0] + n[1] * b[1] + n[2] * b[2]; w = Math.max(w, Math.exp(-(d * d) / (2 * SH.bandWidth * SH.bandWidth))); }
        for (const c of clumps) { const d = 1 - (n[0] * c[0] + n[1] * c[1] + n[2] * c[2]); w = Math.max(w, Math.exp(-d / 0.06)); }
        if (r() > SH.floor + (1 - SH.floor) * w) continue;
        const stray = r() < SH.stray, k = r();
        S.push({ n, rr: stray ? 1.05 + r() * 0.2 : 1 + (r() - 0.5) * SH.thick * 2, s: k < 0.45 ? 0.75 : k < 0.85 ? 1 : 1.35,
          c: hexRgb(pickW(r, HOLO.deep)), pi: (r() * HOLO.pale.length) | 0, ph: r() * 6.283, ox: 0, oy: 0 });
      }
      this.S = S;
    }
    turn(dir) { this.turnT = (this.turnT || 0) + (REDUCED ? 0 : dir * Math.PI * 0.75); }
    setIcon(name, accent) { this.setTargets(holoTargets(name, accent), { assemble: !this.n }); }
    /* loose dust around the sphere: thickest at its edge, thinning toward the sides of the box, so there is no empty gap */
    makeDust() {
      if (!this.o.dust.count) { this.dust = null; return; }
      const O = this.o.dust, B = this.B, R = HOLO.shell.radius, r = rng(hash((this.host.closest("section") || {}).id || "x") + 3), half = this.W / B / 2, out = [];
      let tries = 0;
      while (out.length < O.count && tries++ < O.count * 40) {
        const x = (r() * 2 - 1) * (half - 0.03), y = (r() - 0.5) * 1.02, dd = Math.hypot(x, y);
        if (dd < R * 1.02) continue;
        if (r() > 0.12 + 0.88 * Math.exp(-(dd - R) / 0.22)) continue;
        const k = r();
        out.push({ x, y, s: O.px * (k < 0.4 ? 0.7 : k < 0.8 ? 1 : 1.3), c: `rgb(${hexRgb(pickW(r, CFG.icon.colors)).join(",")})`,
          ph: r() * 6.283, f: 0.1 + r() * 0.16, par: k < 0.4 ? 0.4 : k < 0.8 ? 1 : 1.6, ox: 0, oy: 0 });
      }
      this.dust = out;
    }
    draw(now, dt) {
      const g = this.g, O = this.o, B = this.B, st = this.st || (this.st = new Float32Array(7));
      if (!B) return;
      g.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      g.clearRect(0, 0, this.cw, this.ch);
      const k = Math.min(1, dt / 220);
      this.smx += (this.mx - this.smx) * k; this.smy += (this.my - this.smy) * k;
      const tt = REDUCED ? 0 : now + this.seed * 1000, ts = tt / 1000;
      const F = O.persp * B, cx = this.pad + this.W / 2, ccy = this.pad + this.H / 2;
      const bob = REDUCED ? 0 : Math.sin(tt * 0.0011) * O.float * B;
      const RP = O.repel, RR = RP.radius * B, RR2 = RR * RR, STR = RP.strength * B, kE = Math.min(1, dt / RP.ease);
      const rep = this.px > -1e3 && !REDUCED;
      const pushTo = (sx, sy, o) => {
        let tx = 0, ty = 0;
        if (rep) { const dx = sx - this.px, dy = sy - this.py, d2 = dx * dx + dy * dy; if (d2 < RR2 && d2 > 0.01) { const d = Math.sqrt(d2), q = 1 - d / RR, p = STR * q * q; tx = (dx / d) * p; ty = (dy / d) * p; } }
        o.ox += (tx - o.ox) * kE; o.oy += (ty - o.oy) * kE;
      };
      if (this.dust) {
        const D = this.o.dust, amp = D.drift * B;
        g.globalAlpha = 0.85;
        for (const p of this.dust) {
          const x = cx + p.x * B + Math.sin(ts * p.f * 6.283 + p.ph) * amp - this.smx * D.parallax * B * p.par;
          const y = ccy + p.y * B + Math.cos(ts * p.f * 5.3 + p.ph * 1.3) * amp - this.smy * D.parallax * B * p.par + bob * 0.4;
          pushTo(x, y, p);
          const s = p.s * B; g.fillStyle = p.c; g.fillRect(x + p.ox - s / 2, y + p.oy - s / 2, s, s);
        }
      }
      const L = this.L || (this.L = []); L.length = 0;
      const yaw = Math.sin(tt * O.yawSpeed) * O.yaw + this.smx * 0.3 + ((this.turnT || 0) - (this.turnV || 0)) * 0.6;
      const pit = O.pitchBase + Math.sin(tt * O.pitchSpeed + 1.3) * O.pitch3d - this.smy * 0.2;
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pit), sp = Math.sin(pit), dr = REDUCED ? 0 : O.drift * B;
      const sw = tt * HOLO.sweep, Lx0 = Math.cos(sw), Lz0 = Math.sin(sw) * 0.6 - 0.55, Ly0 = Math.sin(sw * 0.7) * 0.5 - 0.3;
      const Ll = Math.hypot(Lx0, Ly0, Lz0), lx = Lx0 / Ll, ly = Ly0 / Ll, lz = Lz0 / Ll;   // the light sweeping along the icon
      const o = { ox: 0, oy: 0 };
      // the round hologram: its own slow spin, lit by the same sweep as the icon
      this.turnV = this.turnV || 0; this.turnT = this.turnT || 0; this.turnV += (this.turnT - this.turnV) * Math.min(1, dt / 520);   // eased extra turn between disciplines
      const SH = HOLO.shell, R = SH.radius * B, spin = tt * SH.spin + this.smx * 0.35 + this.turnV;
      const tilt = SH.tilt + Math.sin(tt * 0.00021) * 0.08 - this.smy * 0.18;
      const cs = Math.cos(spin), sn = Math.sin(spin), ct = Math.cos(tilt), stl = Math.sin(tilt);
      for (const p of this.S) {
        const n = p.n, wob = REDUCED ? 1 : 1 + Math.sin(ts * 0.9 + p.ph) * (SH.breathe || 0);
        const x0 = n[0] * cs + n[2] * sn, z0 = -n[0] * sn + n[2] * cs, y1 = n[1] * ct - z0 * stl, z1 = n[1] * stl + z0 * ct;
        const rr = R * p.rr * wob, Zs = z1 * rr, sc = F / (F + Zs), sx = cx + x0 * rr * sc, sy = ccy + (y1 * rr + bob) * sc;
        pushTo(sx, sy, p);
        const rim = 1 - Math.abs(z1), lit = Math.max(0, x0 * lx + y1 * ly + z1 * lz);
        const glint = Math.pow(lit, 7) + (REDUCED ? 0 : Math.max(0, Math.sin(ts * 1.7 + p.ph * 3)) ** 30 * (HOLO.sparkle ?? 0.8));
        const far = (z1 + 1) / 2;
        let c = p.c;                                              // deep midnight and blue where it faces you …
        if (rim > 0.5 || glint > 0.5) {                           // … an iridescent band of brand colours around the rim, slowly shifting
          const IRI = SH.iriRgb || (SH.iriRgb = SH.iri.map(hexRgb));
          const h = Math.atan2(y1, x0) / 6.2832 + 0.5 + rim * 0.25 + (REDUCED ? 0 : tt * 0.00003);
          c = IRI[(((h * IRI.length) | 0) % IRI.length + IRI.length) % IRI.length];
        }
        const a = (p.rr > 1.04 ? 0.6 : 1) * (SH.nearAlpha + (SH.farAlpha - SH.nearAlpha) * far);
        const size = SH.px * B * p.s * sc * (1 - far * 0.3) * (1 + glint * 0.5);
        L.push([Zs, sx + p.ox, sy + p.oy, size, a, c[0], c[1], c[2]]);
      }
      for (let i = 0; i < this.cap; i++) {
        if (this.ts[i] <= 0 && now - this.t0[i] > this.du[i]) { this.ox[i] *= 0.8; this.oy[i] *= 0.8; continue; }
        this.state(i, now, st);
        const s = st[3]; if (s <= 0.00002) continue;
        const ph = this.ph[i], f = this.fq[i];
        const X = st[0] * B + Math.sin(ts * f * 6.283 + ph) * dr, Y = st[1] * B + Math.cos(ts * f * 5.1 + ph * 1.7) * dr, Z = st[2] * B;
        const x1 = X * cy + Z * sy, z1 = -X * sy + Z * cy, y2 = Y * cp - z1 * sp, z2 = Y * sp + z1 * cp;
        // the surface normal, turned with the icon (z > 0 = facing away)
        const nx0 = this.nx[i], ny0 = this.ny[i], nz0 = this.nz[i];
        const m1x = nx0 * cy + nz0 * sy, m1z = -nx0 * sy + nz0 * cy, m2y = ny0 * cp - m1z * sp, m2z = ny0 * sp + m1z * cp;
        const sc = F / (F + z2), sx = cx + x1 * sc, syy = ccy + (y2 + bob) * sc;
        o.ox = this.ox[i]; o.oy = this.oy[i]; pushTo(sx, syy, o); this.ox[i] = o.ox; this.oy[i] = o.oy;
        const rim = 1 - Math.abs(m2z), lit = Math.max(0, m1x * lx + m2y * ly + m2z * lz);
        const glint = Math.pow(lit, 9) + (REDUCED ? 0 : Math.max(0, Math.sin(ts * 2.1 + ph * 3)) ** 24 * (HOLO.sparkle ?? 0.8));   // the sweep, plus a few pixels catching the light
        const pale = rim > 0.82 || glint > 0.6, away = m2z > 0.15;
        const c = pale ? PALE[this.pi[i] % PALE.length] : [st[4] | 0, st[5] | 0, st[6] | 0];
        const a = this.al[i] * (away ? HOLO.backAlpha : 1);
        const size = s * B * sc * (away ? 0.75 : 1) * (1 + glint * 0.45);
        L.push([z2, sx + o.ox, syy + o.oy, size, a, c[0], c[1], c[2]]);
      }
      L.sort((a, b) => b[0] - a[0]);                              // far to near
      for (const p of L) {
        g.globalAlpha = p[4];
        g.fillStyle = `rgb(${p[5]},${p[6]},${p[7]})`;
        g.fillRect(p[1] - p[3] / 2, p[2] - p[3] / 2, p[3], p[3]);
      }
      const RG = HOLO.shell.ring;
      if (RG && RG.count) {                                       // the edge: evenly spaced pixels on an exact circle
        const R0 = HOLO.shell.radius * B, rs = HOLO.shell.px * B * 1.05, a0 = REDUCED ? 0 : tt * RG.turn;
        g.globalAlpha = RG.alpha;
        for (let j = 0; j < RG.count; j++) {
          const a = a0 + (j / RG.count) * 6.2832;
          g.fillStyle = j % 3 === 0 ? "#3457BA" : "#0D1432"; g.fillRect(cx + Math.cos(a) * R0 - rs / 2, ccy + bob + Math.sin(a) * R0 - rs / 2, rs, rs);
        }
      }
      g.globalAlpha = 1;
    }
  }
  window.SV_HOLO = { HoloField };
  document.querySelectorAll(".svs").forEach((sec) => {
    const rows = [...sec.querySelectorAll(".svs__row")];
    const desc = sec.querySelector(".svs__desc"), host = sec.querySelector(".sv-px"), num = sec.querySelector(".svs__num");
    if (!rows.length || !host) return;
    const field = new (/^(positive|negative)$/.test(new URLSearchParams(location.search).get("icons") || "") ? NegField : HoloField)(host);
    let cur = -1, t = 0;
    const select = (i, quiet) => {
      if (i === cur) return;
      cur = i;
      rows.forEach((r, k) => { r.classList.toggle("is-on", k === i); r.setAttribute("aria-pressed", k === i ? "true" : "false"); });
      riseText(desc, rows[i].dataset.d);
      if (num) { num.textContent = `${String(i + 1).padStart(2, "0")} / ${String(rows.length).padStart(2, "0")}`; if (!quiet && B30.scramble) B30.scramble(num, { duration: 360 }); }
      field.setIcon(rows[i].dataset.t);
    };
    select(0, true);
    rows.forEach((r, i) => {
      r.addEventListener("pointerenter", () => { clearTimeout(t); t = setTimeout(() => select(i), 40); });
      r.addEventListener("focus", () => select(i));
      r.addEventListener("click", () => select(i));
    });
  });

  /* ---------- hero: hovering a discipline plays its images in the top-right frame ---------- */
  (function heroImages() {
    const box = document.querySelector(".svh__img"), nav = document.querySelector(".svh__idx");
    const IM = window.SV_HERO_IMGS; if (!box || !nav || !IM) return;
    const keys = ["design", "engineering", "marketing", "ai"];
    const mk = (src) => { const im = new Image(); im.src = src; im.alt = ""; im.decoding = "async"; box.appendChild(im); im.decode && im.decode().catch(() => {}); return im; };
    const def = mk(IM.default[0]); def.classList.add("is-on");
    const sets = {}; keys.forEach((k) => { sets[k] = (IM[k] || []).map(mk); });
    const links = [...nav.querySelectorAll("a")];
    let shown = def, timer = 0, zi = 1;
    const show = (im, loop) => {                             // appears like the case-study images: from the top edge, settling from 1.14×
      if (im === shown) return;
      shown = im; im.style.zIndex = ++zi; im.classList.add("is-on");
      if (REDUCED) return;
      im.getAnimations().forEach((a) => a.cancel());
      if (loop) im.animate([{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)" }], { duration: CFG.heroSwapMs, easing: "steps(4, end)" });   // inside the loop: a rigid, stepped 100ms wipe
      else im.animate([{ clipPath: "inset(0 0 100% 0)", transform: "scale(1.14)" }, { clipPath: "inset(0 0 0% 0)", transform: "scale(1)" }],
        { duration: CFG.heroRevealMs, easing: "cubic-bezier(.65,0,.35,1)" });             // on hover: the case-study reveal
    };
    const play = (i) => {
      clearInterval(timer);
      links.forEach((a, j) => a.classList.toggle("is-on", j === i));
      nav.classList.toggle("is-hov", i >= 0);
      if (i < 0) { show(def); return; }
      const list = sets[keys[i]]; let k = 0;
      show(list[0]);
      if (!REDUCED) timer = setInterval(() => { k = (k + 1) % list.length; show(list[k], true); }, CFG.heroFrameMs);
    };
    links.forEach((a, i) => { a.addEventListener("pointerenter", () => play(i)); a.addEventListener("focus", () => play(i)); a.addEventListener("blur", () => play(-1)); });
    nav.addEventListener("pointerleave", () => play(-1));
  })();

  /* ---------- say hello: the homepage's pixel formation, in Flash yellow; the hand slides in from the left ---------- */
  (function hello() {
    const sec = document.querySelector(".svhello"); if (!sec) return;
    const hand = sec.querySelector(".svhello__hand"), img = hand && hand.querySelector("img");
    const CELL = 80, ORIGIN = 204, TOP = -206, BOTTOM = 506;
    // same Figma band as the homepage services (identical cells), coloured as in this frame
    const FIG = { "-239": [8, 9, 10, 12, 14, 17, 18, 19, 20, 21], "-159": [1, 5, 6, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 20], "-79": [1, 3, 4, 6, 8, 9, 10, 12, 13, 14, 16, 17, 18, 21, 23] };
    const rr = (n) => { const v = Math.sin(n * 91.345 + 7.13) * 43758.5453; return v - Math.floor(v); };
    const cells = []; let n = 0;
    for (let y = -239; y < BOTTOM; y += CELL) {
      const row = FIG[String(y)], yn = (y - TOP) / (BOTTOM - TOP);
      for (let c = 0; c < 24; c++) { n++; if (row && !row.includes(c)) continue; cells.push({ x: c * CELL, y, t0: (1 - yn) * 0.62 + rr(n) * 0.2 }); }
    }
    const cv = document.createElement("canvas"); cv.className = "svhello__px"; cv.setAttribute("aria-hidden", "true");
    sec.prepend(cv);
    const ctx = cv.getContext("2d");
    let s = 1, dpr = 1, grad = null, lastPr = -1, raf = 0, cur = 0, hq = 0;
    function size() {
      s = document.documentElement.clientWidth / 1920; dpr = Math.min(devicePixelRatio || 1, 2);
      cv.style.top = (ORIGIN + TOP) * s + "px"; cv.style.height = (BOTTOM - TOP) * s + "px";
      cv.width = Math.round(document.documentElement.clientWidth * dpr); cv.height = Math.round((BOTTOM - TOP) * s * dpr);
      grad = ctx.createLinearGradient(0, 193 - ORIGIN, 0, 1203 - ORIGIN);   // Figma: #F3EA08 at the band → white at the bottom
      grad.addColorStop(0, "#F3EA08"); grad.addColorStop(1, "#FFFFFF");
      lastPr = -1; cur = progress(); draw();
    }
    function progress() {
      const top = sec.getBoundingClientRect().top + (ORIGIN + TOP) * s, vh = innerHeight;
      return REDUCED ? 1 : clamp((vh + CFG.hello.lead - top) / (vh * 0.8));
    }
    function draw() {
      raf = 0;
      const goal = progress();
      cur += (goal - cur) * (REDUCED ? 1 : 0.13);            // inertia, as on the homepage
      if (Math.abs(goal - cur) < 0.0006) cur = goal;
      if (cur !== goal) raf = requestAnimationFrame(draw);
      hq = cur;
      if (Math.abs(cur - lastPr) < 0.0002) return;
      const pr = (lastPr = cur);
      ctx.setTransform(s * dpr, 0, 0, s * dpr, 0, -TOP * s * dpr);
      ctx.clearRect(0, TOP, 1920, BOTTOM - TOP);
      ctx.fillStyle = grad;
      for (const c of cells) {
        const a = clamp((pr - c.t0) / 0.05);
        if (a <= 0) continue;
        const e = easeOut(a), sz = CELL * (0.74 + 0.26 * e) + 1, o = (CELL - sz) / 2;
        ctx.globalAlpha = e;
        ctx.fillRect(c.x + o, c.y + o, sz, sz);
      }
      ctx.globalAlpha = 1;
    }
    addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(draw); }, { passive: true });
    addEventListener("resize", size);
    size();
    // the hand is always there: it slides in from the left as the section arrives, then keeps a slow, small drift
    if (!hand) return;
    let vis = false, hx = 0;
    new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis) requestAnimationFrame(tick); }, { rootMargin: "200px 0px" }).observe(sec);
    function tick(now) {
      if (!vis) return;
      const r = sec.getBoundingClientRect(), vh = innerHeight;
      const goal = REDUCED ? 1 : easeOut(clamp((vh - r.top) / (vh * 1.05)));
      hx += (goal - hx) * 0.08;
      const U = u();
      hand.style.transform = `translate3d(${(-(1 - hx) * 280 * U).toFixed(2)}px,${((1 - hx) * 30 * U).toFixed(2)}px,0)`;
      if (img && !REDUCED) img.style.transform = `translate3d(${(Math.sin(now * 0.00055) * 16 * U).toFixed(2)}px,${(Math.sin(now * 0.00072) * 18 * U).toFixed(2)}px,0) rotate(${(Math.sin(now * 0.00048) * 1.4).toFixed(3)}deg)`;
      requestAnimationFrame(tick);
    }
  })();
})();

/* =====================================================================
   SERVICES — one holographic sphere (516 × 516 at 1920, the same for every
   discipline) carried down the page. While a discipline is in the middle of
   the screen the sphere sits in the centre of its list; between disciplines
   it travels down with the scroll and settles into the next one. The dashed
   rule under each row is cut wherever the sphere's white halo crosses it,
   with a square pixel at each cut, so a row the sphere has left joins back
   into one line and a row it arrives at opens up to the Figma gap.
   ===================================================================== */
window.SVX = {
  size: 516,          // sphere box, design px
  cut: 304,           // radius at which the rules stop (the halo's edge), design px
  pixel: 5,           // the square at each cut, design px (rounded to whole screen px)
  hold: 0.24,         // share of the way between two disciplines the sphere stays put at either end
  follow: 0.16,       // smoothing of the sphere's travel (per frame at 60fps)
  hoverDelay: 60      // ms before a hover counts
};
(() => {
  "use strict";
  const sec = document.querySelector(".svx"), H = window.SV_HOLO;
  if (!sec || !H) return;
  const C = window.SVX, REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches, small = matchMedia("(max-width: 899px)");
  const u = () => document.documentElement.clientWidth / 1920;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const orb = sec.querySelector(".svx__orb"), host = sec.querySelector(".svx__px");
  const panels = [...sec.querySelectorAll(".svx__p")];
  const field = new H.HoloField(host);
  const P = panels.map((p) => ({
    el: p, c: p.dataset.c, list: p.querySelector(".svx__list"), desc: p.querySelector(".svx__desc"),
    btns: [...p.querySelectorAll(".svx__s")], on: null,
    rows: [...p.querySelectorAll(".svx__row:not(.is-last)")].map((r) => ({ el: r, l: r.querySelector(".svx__ln.l"), r: r.querySelector(".svx__ln.r"), pl: r.querySelector(".svx__pp.l"), pr: r.querySelector(".svx__pp.r"), y: 0, h: 0 }))
  }));
  const rise = (el, text) => {
    el.setAttribute("aria-label", text); el.classList.remove("is-in");
    el.innerHTML = text.split(/\s+/).map((w, i) => `<span class="hw" aria-hidden="true"><span class="hw-i" style="--i:${i}">${w.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</span></span>`).join(" ");
    void el.offsetWidth; requestAnimationFrame(() => el.classList.add("is-in"));
  };

  /* ---------- choosing a service ---------- */
  let curP = -1;
  function pick(pi, btn, quiet) {
    const p = P[pi]; if (p.on === btn && !quiet) return;
    p.on = btn;
    p.btns.forEach((b) => { const on = b === btn; b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", on ? "true" : "false"); });
    rise(p.desc, btn.dataset.d);
    if (pi === curP) field.setIcon(btn.dataset.t, p.c);
  }
  P.forEach((p, pi) => {
    pick(pi, p.btns[0], true);
    let t = 0;
    p.btns.forEach((b) => {
      b.addEventListener("pointerenter", () => { clearTimeout(t); t = setTimeout(() => { pick(pi, b); if (pi !== curP && !small.matches) enter(pi); }, C.hoverDelay); });
      b.addEventListener("pointerleave", () => clearTimeout(t));
      b.addEventListener("focus", () => pick(pi, b));
      b.addEventListener("click", () => { clearTimeout(t); pick(pi, b); });
    });
  });
  function enter(k, quiet) {                         // the sphere arrives at a discipline: its colour, its chosen service
    if (k === curP) return;
    const dir = k > curP ? 1 : -1; curP = k;
    if (!quiet && field.turn) field.turn(dir);
    field.setIcon(P[k].on.dataset.t, P[k].c);
  }

  /* ---------- layout: where each list's centre is, where each rule sits (section coordinates) ---------- */
  let anchors = [], W = 0, oy = null, target = 0, raf = 0, last = 0;
  function measure() {
    const sr = sec.getBoundingClientRect(); W = sr.width;
    sec.style.setProperty("--gr", (C.cut + 34).toFixed(0));
    anchors = P.map((p) => { const r = p.list.getBoundingClientRect(); return r.top - sr.top + r.height / 2; });
    P.forEach((p) => p.rows.forEach((row) => { const r = row.el.getBoundingClientRect(); row.y = r.bottom - sr.top; row.h = r.height; }));
  }
  /* where the sphere wants to be for the current scroll: held in a discipline, then carried to the next */
  function goal() {
    const sr = sec.getBoundingClientRect(), vc = innerHeight / 2 - sr.top;
    if (vc <= anchors[0]) return anchors[0];
    for (let i = 0; i < anchors.length - 1; i++) {
      const a = anchors[i], b = anchors[i + 1];
      if (vc <= b) { const t = clamp(((vc - a) / (b - a) - C.hold) / (1 - 2 * C.hold)); return a + (b - a) * (REDUCED ? Math.round(t) : smooth(t)); }
    }
    return anchors[anchors.length - 1];
  }
  /* cut every rule around the sphere at its current place */
  function cut(y) {
    const U = u(), R = C.cut * U, cx = W / 2, s = Math.max(4, Math.round(C.pixel * U)), off = Math.floor(s / 2);
    for (const p of P) for (const row of p.rows) {
      const dy = row.y - 0.5 - y, inside = Math.abs(dy) < R;
      const half = inside ? Math.sqrt(R * R - dy * dy) : 0;
      const L = Math.round(cx - half), Rr = Math.round(cx + half), open = Rr - L > 2;
      row.l.style.width = (open ? L : W) + "px";
      row.r.style.left = Rr + "px"; row.r.style.width = (open ? Math.max(0, W - Rr) : 0) + "px";
      row.r.style.backgroundPosition = -Rr + "px 0";   // the dashes keep one rhythm across the gap
      const top = Math.round(row.h - 1 - off) + "px";
      row.pl.style.transform = `translate(${L - s}px,0)`; row.pl.style.top = top; row.pl.style.width = row.pl.style.height = s + "px";
      row.pr.style.transform = `translate(${Rr}px,0)`; row.pr.style.top = top; row.pr.style.width = row.pr.style.height = s + "px";
      row.pl.classList.toggle("on", open); row.pr.classList.toggle("on", open);
    }
  }
  function frame(now) {
    raf = 0;
    if (small.matches) return;
    const dt = Math.min(64, now - (last || now)); last = now;
    target = goal();
    if (oy === null || REDUCED) oy = target;
    else oy += (target - oy) * (1 - Math.pow(1 - C.follow, dt / 16.67));
    if (Math.abs(target - oy) < 0.05) oy = target;
    orb.style.setProperty("--oy", oy.toFixed(2) + "px");
    cut(oy);
    // the discipline the sphere is in (or nearest to)
    let k = 0, bd = 1e9; anchors.forEach((a, i) => { const d = Math.abs(a - oy); if (d < bd) { bd = d; k = i; } });
    enter(k);
    if (oy !== target) raf = requestAnimationFrame(frame); else last = 0;
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
  const relayout = () => { measure(); oy = null; kick(); };
  addEventListener("scroll", kick, { passive: true });
  addEventListener("resize", relayout);
  addEventListener("load", relayout);
  new ResizeObserver(relayout).observe(sec);
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(relayout);
  measure(); enter(0, true); kick();
})();
