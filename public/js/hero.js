/* Video sources: the monitor's reel and the foreground clip. */
(() => {
  const fg = document.querySelector('[data-asset="b30-fg"]');
  const reel = document.querySelector('[data-asset="b30-reel"]');
  if (fg && fg.dataset.video) fg.src = fg.dataset.video;
  if (reel && reel.dataset.video) reel.dataset.src = reel.dataset.video;
  if (reel && reel.dataset.videoSmall) reel.dataset.srcSmall = reel.dataset.videoSmall;
})();

/* ==========================================================================
   Breakthirty — Hero: scroll-controlled monitor push-in
   - Native position:sticky pins the stage (no scroll hijacking).
   - One rAF loop reads scroll, smooths it, and drives every layer + both videos.
   - Foreground (people, desk, keyboard) is a stacked-alpha MP4 drawn with WebGL:
     top half = colour, bottom half = alpha. Works in every browser (no WebM/HEVC alpha).
   - The reel sits *behind* the monitor bezel, locked to the glass, and scales with it.
     It plays on its own (muted loop) from the first frame; scroll only drives the camera.
   ========================================================================== */
(() => {
  "use strict";

  const CONFIG = {
    pinLength: 1.8,          // pinned scroll for reveal + push-in + hold, in viewport heights (was 2.4 — a quarter less scroll)
    coverLength: 0.85,       // (was 1)
    shrinkAt: 0.9,           // from 90 % of the pinned scroll the video scales down a little…
    shrinkTo: 0.9,
    coverAt: 1,           // the next section starts sliding in at 95 % of the pinned (video) scroll          // scroll for the next section to slide over, in viewport heights
    smooth: 9,               // scroll smoothing (higher = snappier). 0 disables.
    zoom: [0.0, 0.6],      // monitor push-in until the glass fills the viewport
    fgOut: [0.3, 0.52],      // as in the first scene: people and desk fade while the Mac carries on into the screen     // people/desk fade out (late: parallax carries them out first)
    fgParallax: 0,          // the whole scene zooms as one image: people, Mac, stand, desk; nothing separates         // extra scale on the foreground (it is closer to camera)
    glowOut: [0.05, 0.45],     // background glow fade
    copyOut: [0.0, 0.16],    // header/copy fade (only matters when it is still on screen)
    coverDim: 0.1,           // 10 % black over the hero…
    dimAt: 0.95,             // …fading in from 95 % of the video scroll           // dim on the hero while the next section covers it
    coverScale: 0.94,
    // Orbit of tool chips riding the faded ring (Figma "Subtract": Ø1404 / Ø1154 at 258,511)
    ring: { cx: 960, cy: 1173, rOuter: 702, rInner: 577 },
    orbit: {
      radius: 639.5,              // text baseline runs along the centre of the ring band
      arc: 115,                   // path spans ±115° from the top; both ends sit inside the fade
      speed: 5,                   // idle drift, degrees per second (clockwise)
      fade: [640, 780],           // frame-y where the words fade out towards the ring's lower ends
      friction: 2.6,              // how quickly a flick settles back to the idle drift
      mode: "words",              // "words" | "logos"
      words: (window.B30_CONTENT.hero || {}).orbitWords || [],
      // logos are loaded straight from these CDN URLs and drawn as a flat tint
      logos: [
        ["Figma", "https://cdn.simpleicons.org/figma"],
        ["Webflow", "https://cdn.simpleicons.org/webflow"],
        ["WordPress", "https://cdn.simpleicons.org/wordpress"],
        ["Shopify", "https://cdn.simpleicons.org/shopify"],
        ["Framer", "https://cdn.simpleicons.org/framer"],
        ["Semrush", "https://cdn.simpleicons.org/semrush"],
        ["MongoDB", "https://cdn.simpleicons.org/mongodb"],
        ["Python", "https://cdn.simpleicons.org/python"],
        ["React", "https://cdn.simpleicons.org/react"],
        ["JavaScript", "https://cdn.simpleicons.org/javascript"],
        ["LangChain", "https://cdn.simpleicons.org/langchain"],
        ["Zapier", "https://cdn.simpleicons.org/zapier"],
        ["Docker", "https://cdn.simpleicons.org/docker"],
      ],
      logoSize: 34,               // every logo in the same square box (frame px)
      logoGap: 48,                // logo → pixel and pixel → logo
      logoColor: false,           // true = brand colours straight from the CDN, no tint
      logoTint: "#000",           // flat black logos (also the separator pixels)
      logoInk: "#000",            // hovered logo
      font: 18,                   // BDO Grotesk, frame px
      color: "#000",
      gap: 96,                    // word → pixel and pixel → word
      pixel: 5,                   // square separator, frame px
      minFontPx: 11,              // floor on small screens so the words stay legible
      // life: hover focus
      hoverSpeed: 0.06,           // share of the idle drift kept while a word is hovered
      dimTo: 0.35,                // opacity of everything except the hovered word
      focusEase: 7,               // how fast the dim/undim eases
      hitBand: 42,                // radial reach of a word's hover zone (frame px)
    },
    fgClipEnd: 0.45,         // pinned progress at which the main (people) clip reaches its last frame
    // Figma frame + source-video geometry (do not change unless assets change)
    frame: { w: 1920, h: 1740, sceneTop: 654 },   // "Updtaed Hero" 3433:2260
    src: { w: 1912, h: 1080 },
    screenOuter: { x: 508, y: 235, w: 932, h: 513 },   // New_Video: reel tucked 2px under the bezel, never outside it   // reel rect, hidden edges sit behind bezel
    screenInner: { x: 510, y: 237, w: 928, h: 509 },   // New_Video glass: the push-in ends with the whole screen filling the view   // visible glass, used for the cover-fit
    bezel: { x: 490, y: 217, w: 968, h: 695 },   // New_Video: monitor ring + stand   // monitor + stand
    // Glow = Figma's own render of "Rectangle 12" (blue wave + 300 blur + Lens Distortion shader),
    // exported at its render bounds inside the frame. The shader needs WebGPU + HTML-in-Canvas,
    // so we ship the baked result; it is pure blur, so a small image is lossless to the eye.
    glow: { x: 0, y: 363.55, w: 1920, h: 1376.45 },
  };

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const range = (p, [a, b]) => clamp((p - a) / (b - a));
  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
  const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);

  /* ---------------------------------------------------------------------------
     Scroll-scrubbed <video>: one seek in flight at a time, always chasing the
     latest target. Short-GOP / all-intra encodes make each seek cheap.
  --------------------------------------------------------------------------- */
  class Scrubber {
    constructor(video, { start = 0, end = null, onFrame = null } = {}) {
      this.v = video;
      this.start = start;
      this.end = end;
      this.onFrame = onFrame;
      this.target = start;
      this.busy = false;
      this.ready = false;
      this.timer = 0;
      const ready = () => {
        if (this.ready) return;
        this.ready = true;
        if (this.end == null) this.end = Math.max(0, (video.duration || 0) - 0.05);
        this.pump(true);
      };
      video.addEventListener("loadeddata", ready);
      if (video.readyState >= 2) ready();
      video.addEventListener("seeked", () => {
        this.busy = false;
        clearTimeout(this.timer);
        this.onFrame && this.onFrame();
        this.pump();
      });
    }
    set(t01) {
      this.t01 = clamp(t01);
      if (!this.ready) return;
      this.target = lerp(this.start, this.end, this.t01);
      this.pump();
    }
    pump(force) {
      if (!this.ready || this.busy) return;
      if (this.t01 != null) this.target = lerp(this.start, this.end, this.t01);
      if (!force && Math.abs(this.v.currentTime - this.target) < 1 / 60) return;
      this.busy = true;
      this.v.currentTime = this.target;
      // Safety: some engines skip 'seeked' for no-op seeks.
      clearTimeout(this.timer);
      this.timer = setTimeout(() => { this.busy = false; this.onFrame && this.onFrame(); }, 250);
    }
  }

  /* ---------------------------------------------------------------------------
     Foreground: stacked-alpha video → premultiplied RGBA on a WebGL canvas.
  --------------------------------------------------------------------------- */
  function createStackedAlphaRenderer(canvas, video) {
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false })
      || canvas.getContext("experimental-webgl");
    if (!gl) return null;
    const vs = `attribute vec2 p; varying vec2 uv;
      void main(){ uv = vec2(p.x*.5+.5, .5-p.y*.5); gl_Position = vec4(p,0.,1.); }`;
    const fs = `precision mediump float; varying vec2 uv; uniform sampler2D t;
      void main(){
        vec3 c = texture2D(t, vec2(uv.x, uv.y*.5)).rgb;
        float a = texture2D(t, vec2(uv.x, .5 + uv.y*.5)).r;
        a = clamp((a - .02) / .96, 0., 1.);          // crush codec noise in the matte
        gl_FragColor = vec4(c * a, a);
      }`;
    const prog = link(gl, vs, fs);
    if (!prog) return null;
    gl.useProgram(prog);
    quad(gl, prog);
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach((k) => gl.texParameteri(gl.TEXTURE_2D, k, gl.CLAMP_TO_EDGE));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    return {
      draw() {
        if (video.readyState < 2) return false;
        const w = video.videoWidth, h = video.videoHeight / 2;
        if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
        gl.viewport(0, 0, w, h);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        return true;
      },
    };
  }

  function link(gl, vsSrc, fsSrc) {
    const sh = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
      return s;
    };
    const v = sh(gl.VERTEX_SHADER, vsSrc), f = sh(gl.FRAGMENT_SHADER, fsSrc);
    if (!v || !f) return null;
    const p = gl.createProgram();
    gl.attachShader(p, v); gl.attachShader(p, f); gl.linkProgram(p);
    return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null;
  }
  function quad(gl, prog) {
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  }


  /* ---------------------------------------------------------------------------
     Orbit: tool chips riding the faded ring. Idle spin + drag/flick to spin
     (angular drag around the ring centre, with inertia). Lives inside the rig,
     so the scroll push-in carries it away with the camera.
  --------------------------------------------------------------------------- */
  function createOrbit(el, reduced) {
    const O = CONFIG.orbit, NS = "http://www.w3.org/2000/svg";
    const svg = el.querySelector("svg.b30h__words");
    const path = svg.querySelector("path");
    const group = svg.querySelector("g");
    const D = 1404, C = D / 2;
    // flat-colour filters for logos: rgb := tint, alpha kept
    const defs = document.createElementNS(NS, "defs");
    const mk = (id, hex) => {
      const h = hex.replace("#", "").padEnd(6, hex.replace("#", "")).slice(0, 6);
      const [r, g, b] = [0, 2, 4].map((i) => (parseInt(h.substr(i, 2), 16) / 255).toFixed(4));
      return `<filter id="${id}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 ${b} 0 0 0 1 0"/></filter>`;
    };
    defs.innerHTML = mk("b30h-tint", O.logoTint || "#8a8a8a") + mk("b30h-ink", O.logoInk || "#000");
    svg.insertBefore(defs, svg.firstChild);
    let items = [], cycle = 1, total = 1, pathLen = 1, scale = 1;
    let offset = 0, vel = 0, base = 0, dragging = false, lastA = 0, lastT = 0, flick = 0, active = true;
    const degToLen = (d) => (d * Math.PI / 180) * O.radius;

    // open arc over the top, left → right, so the strip reads the right way up
    const a0 = (-O.arc * Math.PI) / 180, a1 = (O.arc * Math.PI) / 180, r = O.radius;
    const pt = (a) => `${(C + r * Math.sin(a)).toFixed(2)} ${(C - r * Math.cos(a)).toFixed(2)}`;
    path.setAttribute("d", `M ${pt(a0)} A ${r} ${r} 0 1 1 ${pt(a1)}`);

    function build(fontScale) {
      group.textContent = "";
      group.setAttribute("fill", O.mode === "logos" ? (O.logoTint || O.color) : O.color);
      items = [];
      scale = fontScale;
      const fs = O.font * fontScale, gap = O.gap * fontScale, px = O.pixel * fontScale;
      // measure each word once in the real font
      const probe = document.createElementNS(NS, "text");
      probe.setAttribute("font-size", fs);
      probe.setAttribute("class", "b30h__word");
      group.appendChild(probe);
      const widths = O.words.map((w) => { probe.textContent = w; return probe.getComputedTextLength(); });
      group.removeChild(probe);

      // one cycle: item · gap · pixel · gap · item …
      const seq = [];
      let x = 0;
      if (O.mode === "logos") {
        const ls = O.logoSize * fontScale, lg = O.logoGap * fontScale;
        O.logos.forEach(([name, url]) => {
          seq.push({ kind: "logo", name, url, at: x, w: ls });
          x += ls + lg;
          seq.push({ kind: "px", at: x + px / 2 });
          x += px + lg;
        });
      } else {
        O.words.forEach((w, i) => {
          seq.push({ kind: "word", text: w, at: x, w: widths[i] });
          x += widths[i] + gap;
          seq.push({ kind: "px", at: x + px / 2 });
          x += px + gap;
        });
      }
      cycle = Math.max(x, 1);
      pathLen = path.getTotalLength();
      const reps = Math.ceil(pathLen / cycle) + 1;
      total = reps * cycle;
      for (let k = 0; k < reps; k++) {
        seq.forEach((s0) => {
          const it = { ...s0, at: s0.at + k * cycle };
          if (it.kind === "word") {
            const t = document.createElementNS(NS, "text");
            t.setAttribute("class", "b30h__word");
            t.setAttribute("font-size", fs);
            const tp = document.createElementNS(NS, "textPath");
            tp.setAttribute("href", "#b30h-orbit-path");
            tp.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#b30h-orbit-path");
            tp.textContent = it.text;
            t.appendChild(tp);
            group.appendChild(t);
            it.el = t; it.tp = tp;
          } else if (it.kind === "logo") {
            const im = document.createElementNS(NS, "image");
            im.setAttribute("href", it.url);
            im.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", it.url);
            im.setAttribute("x", -it.w / 2); im.setAttribute("y", -it.w / 2);
            im.setAttribute("width", it.w); im.setAttribute("height", it.w);
            im.setAttribute("preserveAspectRatio", "xMidYMid meet");
            if (!O.logoColor) im.setAttribute("filter", "url(#b30h-tint)");
            im.setAttribute("aria-label", it.name);
            group.appendChild(im);
            it.el = im;
          } else {
            const q = document.createElementNS(NS, "rect");
            q.setAttribute("class", "b30h__pixel");
            q.setAttribute("x", -px / 2); q.setAttribute("y", -px / 2);
            q.setAttribute("width", px); q.setAttribute("height", px);
            group.appendChild(q);
            it.el = q;
          }
          items.push(it);
        });
      }
      place();
    }

    let hovered = null, pointer = null;
    function place() {
      for (const it of items) {
        // wrap so items stream in at the left end and out at the right end
        let p = ((it.at + offset) % total + total) % total - cycle;
        it.p = p;
        const w = it.kind === "word" ? it.w : 0;
        const show = p > -w - 4 && p < pathLen + 4;
        it.show = show;
        it.el.style.display = show ? "" : "none";
        if (!show) continue;
        const op = (1 - (it.focus || 0)) + (it.focus || 0) * (it === hovered ? 1 : O.dimTo);
        it.el.setAttribute("opacity", op.toFixed(3));
        if (it.kind === "word") {
          it.tp.setAttribute("startOffset", p.toFixed(2));
        } else if (it.kind === "logo") {
          const q = path.getPointAtLength(clamp(p + it.w / 2, 0, pathLen));
          const ang = Math.atan2(q.x - C, -(q.y - C)) * 180 / Math.PI;    // stands upright on the curve
          it.el.setAttribute("transform", `translate(${q.x.toFixed(2)} ${q.y.toFixed(2)}) rotate(${ang.toFixed(2)})`);
          const ink = it === hovered && it.focus > 0.5;
          if (!O.logoColor && ink !== it.ink) { it.ink = ink; it.el.setAttribute("filter", ink ? "url(#b30h-ink)" : "url(#b30h-tint)"); }
        } else {
          const q = path.getPointAtLength(clamp(p, 0, pathLen));
          const ang = Math.atan2(q.x - C, -(q.y - C)) * 180 / Math.PI;   // tangent-aligned square
          it.el.setAttribute("transform", `translate(${q.x.toFixed(2)} ${q.y.toFixed(2)}) rotate(${ang.toFixed(2)})`);
        }
      }
    }

    // which word sits under the pointer (in viewBox units): polar test against each word's arc span
    function pick() {
      if (!pointer || dragging) return null;
      const dx = pointer.x - C, dy = pointer.y - C;
      if (Math.abs(Math.hypot(dx, dy) - O.radius) > O.hitBand * scale) return null;
      const s0 = (Math.atan2(dx, -dy) + (O.arc * Math.PI) / 180) * O.radius;   // arc length along the path
      const pad = 10 * scale;
      for (const it of items) {
        if ((it.kind === "word" || it.kind === "logo") && it.show && s0 >= it.p - pad && s0 <= it.p + it.w + pad) return it;
      }
      return null;
    }
    const toView = (e) => {
      const b = el.getBoundingClientRect();
      return { x: ((e.clientX - b.left) / b.width) * D, y: ((e.clientY - b.top) / b.height) * D };
    };
    el.addEventListener("pointermove", (e) => { if (e.pointerType === "mouse") pointer = toView(e); });
    el.addEventListener("pointerleave", () => { pointer = null; });

    base = vel = reduced ? 0 : degToLen(O.speed);

    if (O.mode === "logos") {
      // Keep every logo that loads. Retry a failed one once (CDN hiccup) before dropping it.
      let pending = O.logos.length, dropped = [];
      O.logos.slice().forEach((entry) => {
        let tries = 0;
        const attempt = () => {
          const probe = new Image();
          // simpleicons SVGs have a viewBox but no width/height, so Safari/Firefox report
          // naturalWidth 0 even though they render fine: a load event alone means "keep".
          probe.onload = () => settle(true);
          probe.onerror = () => (++tries < 2 ? setTimeout(attempt, 1500) : settle(false));
          probe.src = entry[1] + (tries ? (entry[1].includes("?") ? "&" : "?") + "r=" + tries : "");
        };
        const settle = (ok) => {
          if (!ok) { O.logos = O.logos.filter((e) => e !== entry); dropped.push(entry[0]); }
          if (--pending === 0 && dropped.length) {
            console.warn("[b30 hero] logos that could not load and were removed:", dropped.join(", "));
            if (O.logos.length) build(scale);
          }
        };
        attempt();
      });
    }

    const pointerAngle = (e) => {
      const b = el.getBoundingClientRect();
      return (Math.atan2(e.clientX - (b.left + b.width / 2), -(e.clientY - (b.top + b.height / 2))) * 180) / Math.PI;
    };
    el.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      dragging = true; flick = 0;
      lastA = pointerAngle(e); lastT = performance.now();
      el.setPointerCapture(e.pointerId);
      el.classList.add("is-dragging");
    });
    el.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const a = pointerAngle(e), now = performance.now();
      let d = a - lastA;
      if (d > 180) d -= 360; else if (d < -180) d += 360;
      offset += degToLen(d);
      const dt = Math.max(1, now - lastT) / 1000;
      flick = lerp(flick, degToLen(d) / dt, 0.35);
      lastA = a; lastT = now;
      place();
    });
    const end = () => {
      if (!dragging) return;
      dragging = false;
      el.classList.remove("is-dragging");
      if (performance.now() - lastT > 120) flick = 0;
      vel = clamp(flick, -degToLen(900), degToLen(900));
      if (!reduced && Math.abs(vel) > 1) base = Math.sign(vel) * degToLen(O.speed);
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    el.addEventListener("lostpointercapture", end);

    return {
      layout(px /* orbit size in css px */) {
        const sf = px / D;                                   // viewBox unit → css px
        const fsScale = Math.max(1, O.minFontPx / (O.font * sf));
        if (Math.abs(fsScale - scale) > 0.01 || !items.length) build(fsScale);
      },
      rebuild() { build(scale); },
      setActive(v) { active = v; },
      step(dt) {
        if (!active) return;
        hovered = pick();
        el.classList.toggle("is-hovering", !!hovered);
        // ease every item's focus toward 1 while something is hovered, 0 otherwise
        const fk = 1 - Math.exp(-O.focusEase * dt);
        for (const it of items) it.focus = lerp(it.focus || 0, hovered ? 1 : 0, fk);
        if (!dragging) {
          const target = hovered ? base * O.hoverSpeed : base;
          vel = lerp(vel, target, 1 - Math.exp(-(hovered ? 6 : O.friction) * dt));
          offset = (offset + vel * dt) % total;
        }
        place();
      },
    };
  }

  /* ---------------------------------------------------------------------------
     Hero controller
  --------------------------------------------------------------------------- */
  function initHero(root) {
    const $ = (s) => root.querySelector(s);
    const pin = $(".b30h__pin"), stage = $(".b30h__stage"), copy = $(".b30h__copy");
    const nav = $(".b30h__nav"), glowCanvas = $(".b30h__glow"), scene = $(".b30h__scene");
    const rig = $(".b30h__rig"), fgWrap = $(".b30h__fg"), fgCanvas = $(".b30h__fg canvas");
    const fgVideo = $("video.b30h__fgsrc"), screen = $(".b30h__screen");
    const reel = $(".b30h__screen video");
    const bezel = $(".b30h__bezel"), dim = $(".b30h__dim");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const orbitEl = $(".b30h__orbit"), ringEl = $(".b30h__ring");
    const vlines = root.querySelectorAll(".b30h__vline");
    const mqMobile = matchMedia("(max-width: 899px)");

    // pick the reel resolution once
    if (!reel.src) {
      const src = mqMobile.matches ? reel.dataset.srcSmall || reel.dataset.src : reel.dataset.src;
      reel.src = src;
    }

    const orbit = createOrbit(orbitEl, reduced);
    const fgRenderer = createStackedAlphaRenderer(fgCanvas, fgVideo);
    const drawFg = () => { if (fgRenderer && fgRenderer.draw()) fgWrap.classList.add("is-live"); };
    const fgScrub = new Scrubber(fgVideo, { start: 0, onFrame: drawFg });
    // Showreel: plain muted autoplay loop. Paused while the hero is off-screen to save battery.
    reel.muted = true; reel.loop = true; reel.playsInline = true;
    const playReel = () => { const pr = reel.play(); if (pr && pr.catch) pr.catch(() => {}); };
    playReel();
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e]) => (e.isIntersecting ? playReel() : reel.pause()))
        .observe(screen);
    }

    // iOS/Safari: decoders only commit frames for seeks after the element was "activated".
    const prime = () => {
      const p = fgVideo.play(); if (p && p.then) p.then(() => fgVideo.pause()).catch(() => {});
      playReel();   // iOS low-power mode can block autoplay until the first touch
      removeEventListener("touchstart", prime); removeEventListener("pointerdown", prime);
    };
    addEventListener("touchstart", prime, { passive: true, once: true });
    addEventListener("pointerdown", prime, { passive: true, once: true });

    let L = null;               // layout
    const S = { y: 0 };   // smoothed scroll

    function layout() {
      const cw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      const mobile = mqMobile.matches;
      const F = CONFIG.frame, src = CONFIG.src;
      let u, W, H, left, top, stageH;
      if (!mobile) {
        u = cw / F.w;
        root.style.setProperty("--u", u + "px");
        W = cw; H = (W * src.h) / src.w;
        stageH = Math.max(F.h * u, vh);
        top = stageH - H; left = 0;
      } else {
        u = cw / F.w;
        root.style.setProperty("--u", u + "px");
        const copyBottom = copy.offsetTop + copy.offsetHeight;   // offsets: unaffected by ancestor transforms (loader card)
        H = clamp(cw * 0.9, vh * 0.36, vh * 0.48);   // wide enough to keep both people in frame
        W = (H * src.w) / src.h;
        left = (cw - W) / 2;
        stageH = Math.max(vh, copyBottom + H * 0.86);
        top = stageH - H;
      }
      const s = W / src.w;            // source px → css px
      const sf = W / F.w;             // figma px → css px (scene spans the 1920 frame)
      const pinDist = CONFIG.pinLength * vh, coverDist = CONFIG.coverLength * vh;

      root.style.height = stageH + pinDist + coverDist + "px";
      root.style.setProperty("--stage-h", stageH + "px");
      root.style.setProperty("--pin-top", Math.min(0, vh - stageH) + "px");
      root.style.setProperty("--view-cy", stageH - vh / 2 + "px");
      const next = root.nextElementSibling;
      if (next) next.style.marginTop = -(coverDist + (1 - CONFIG.coverAt) * pinDist) + "px";

      Object.assign(scene.style, { left: left + "px", top: top + "px", width: W + "px", height: H + "px" });
      const box = (el, r) => Object.assign(el.style, { left: r.x * s + "px", top: r.y * s + "px", width: r.w * s + "px", height: r.h * s + "px" });
      box(screen, CONFIG.screenOuter);
      box(bezel, CONFIG.bezel);
      dim.style.top = stageH - vh + "px";
      dim.style.height = vh + "px";

      // glow: Figma frame coords mapped through the scene (same transform as the people)
      const g = CONFIG.glow;
      Object.assign(glowCanvas.style, {
        left: left + g.x * sf + "px", top: top + (g.y - F.sceneTop) * sf + "px",
        width: g.w * sf + "px", height: g.h * sf + "px",
      });
      // the glow is drawn as one layer that runs on past the picture's end (its last rows carried down), so the colour
      // reaches past the desk however the screen is shaped — one element, so there's no seam or line where it continues
      let gx = glowCanvas.nextElementSibling;
      if (!gx || !gx.classList.contains("b30h__glowx")) { gx = document.createElement("div"); gx.className = "b30h__glowx"; gx.setAttribute("aria-hidden", "true"); glowCanvas.after(gx); }
      const gh = g.h * sf;
      Object.assign(gx.style, { position: "absolute", pointerEvents: "none", zIndex: getComputedStyle(glowCanvas).zIndex, mixBlendMode: getComputedStyle(glowCanvas).mixBlendMode,
        left: glowCanvas.style.left, width: glowCanvas.style.width, top: top + (g.y - F.sceneTop) * sf + "px", height: gh * 1.6 + "px",
        backgroundImage: `url("${glowCanvas.currentSrc || glowCanvas.src}"),url("${glowCanvas.currentSrc || glowCanvas.src}")`, backgroundRepeat: "no-repeat,no-repeat",
        backgroundSize: `100% ${gh}px,100% ${gh * 60}px`, backgroundPosition: "0 0,0 100%",
        marginTop: getComputedStyle(glowCanvas).marginTop });

      // ring + orbit, in rig-local px (rig box = scene; frame → scene: x·sf, (y − sceneTop)·sf)
      const R = CONFIG.ring;
      const ringBox = { left: (R.cx - R.rOuter) * sf + "px", top: (R.cy - R.rOuter - F.sceneTop) * sf + "px",
        width: 2 * R.rOuter * sf + "px", height: 2 * R.rOuter * sf + "px" };
      Object.assign(ringEl.style, ringBox);
      Object.assign(orbitEl.style, ringBox);
      // chips fade toward the lower ends of the ring (frame-y → orbit-local %)
      const fy = (v) => (((v - (R.cy - R.rOuter)) / (2 * R.rOuter)) * 100).toFixed(2) + "%";
      orbitEl.style.setProperty("--fade-a", fy(CONFIG.orbit.fade[0]));
      orbitEl.style.setProperty("--fade-b", fy(CONFIG.orbit.fade[1]));
      orbit.layout(2 * R.rOuter * sf);

      const si = CONFIG.zoomTo || CONFIG.screenInner;
      L = {
        cw, vh, stageH, pinStart: Math.max(0, stageH - vh), pinDist, coverDist, left, top, s,
        sc: { x: (si.x + si.w / 2) * s, y: (si.y + si.h / 2) * s },
        k: Math.max(cw / (si.w * s), vh / (si.h * s)) * 1.004,
      };
      fgWrap.style.transformOrigin = `${L.sc.x}px ${L.sc.y}px`;
      S.y = scrollTop();
      render(true);
    }

    const scrollTop = () => -root.getBoundingClientRect().top;

    function render() {
      if (!L) return;
      const y = S.y;
      const approach = L.pinStart > 0 ? clamp(y / L.pinStart) : 1;
      const p = clamp((y - L.pinStart) / L.pinDist);
      const c = clamp((y - L.pinStart - L.pinDist * CONFIG.coverAt) / L.coverDist);

      /* monitor push-in: log-space scale (constant perceived speed), screen centre glides to viewport centre */
      const ez = easeInOutCubic(range(p, CONFIG.zoom));
      const sc = Math.exp(Math.log(L.k) * ez);
      const w = (sc - 1) / (L.k - 1 || 1);
      const viewTop = L.stageH - L.vh;                       // viewport top in stage coords while pinned
      const c0x = L.left + L.sc.x, c0y = L.top + L.sc.y;     // screen centre in stage coords at rest
      const tx = lerp(c0x, L.cw / 2, w), ty = lerp(c0y, viewTop + L.vh / 2, w);
      rig.style.transform = `translate3d(${tx - L.left - sc * L.sc.x}px, ${ty - L.top - sc * L.sc.y}px, 0) scale(${sc})`;

      /* foreground leaves faster than the monitor (parallax) and fades */
      const fo = easeInOutSine(range(p, CONFIG.fgOut));
      fgWrap.style.transform = `scale(${1 + CONFIG.fgParallax * ez})`;
      fgWrap.style.opacity = 1 - fo;

      const go = 1 - easeInOutSine(range(p, CONFIG.glowOut));
      glowCanvas.style.opacity = 1; { const gx = glowCanvas.nextElementSibling; if (gx && gx.classList.contains("b30h__glowx")) gx.style.opacity = 1; }   // the colour layer holds: no white opens up behind the monitor
      orbitEl.style.opacity = go; ringEl.style.opacity = go;
      vlines.forEach((v) => (v.style.opacity = go));
      orbit.setActive(go > 0.01 && c < 1);
      const co = 1 - range(p, CONFIG.copyOut);
      copy.style.opacity = co; nav.style.opacity = co;

      /* main (people) clip: scrubbed purely by scroll, first frame at the top of the page */
      fgScrub.set(clamp(y / (L.pinStart + CONFIG.fgClipEnd * L.pinDist)));

      /* next section slides over */
      // the hero sinks (moves down, under a light dim) once the strip below it is 70% in view, while the page rises over it
      const bp = window.__b30pEl || (window.__b30pEl = document.getElementById("partners"));
      let drop = 0; if (bp) { const r = bp.getBoundingClientRect(); drop = Math.min(1, Math.max(0, (innerHeight - r.top - r.height * 0.7) / (innerHeight * 0.85))); }
      const de = reduced ? 0 : drop * drop * (3 - 2 * drop), py = de * L.vh * 0.16;
      stage.style.transformOrigin = "50% 100%";   // it moves down and grows by the same amount from its bottom edge, so its top never leaves the screen's top
      stage.style.transform = py ? `translate3d(0,${py.toFixed(1)}px,0) scale(${(1 + py / L.vh).toFixed(4)})` : "";
      if (false)
      stage.style.transform = py ? `translate3d(0,${py.toFixed(1)}px,0)` : "";
      dim.style.opacity = CONFIG.coverDim * Math.max(easeInOutSine(range(p, [CONFIG.dimAt, 1])), c);
      // full video mode: the monitor fills the screen (the scroll cursor shows over it)
      const full = ez > 0.97 && c < 0.6;
      if (full !== root.classList.contains("is-video")) { root.classList.toggle("is-video", full); root.dispatchEvent(new CustomEvent("b30:video", { detail: full })); }
    }

    let last = performance.now();
    function tick(now) {
      const dt = Math.min(0.1, (now - last) / 1000);   // cap so a slow frame never jumps
      last = now;
      const target = scrollTop();
      const k = reduced || !CONFIG.smooth ? 1 : 1 - Math.exp(-(window.__b30lenis ? 16 : CONFIG.smooth) * dt);   // light extra smoothing on top of Lenis keeps the video scrub steady
      const prevY = S.y;
      S.y = Math.abs(target - S.y) < 0.1 ? target : lerp(S.y, target, k);
      if (S.y !== prevY) render();
      orbit.step(dt);
      requestAnimationFrame(tick);
    }


    let rz = 0;
    const onResize = () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(layout); };
    addEventListener("resize", onResize);
    mqMobile.addEventListener ? mqMobile.addEventListener("change", onResize) : mqMobile.addListener(onResize);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { orbit.rebuild(); onResize(); });

    layout();
    requestAnimationFrame(tick);
    // laid out and drawn once: now the hero can show (it fades in from the head's hold)
    // …and its pictures (the two figures, the glow) are decoded, so they don't pop in a beat later (capped at 1.2s)
    const pics = [...root.querySelectorAll("img")].map((im) => (im.decode ? im.decode().catch(() => {}) : Promise.resolve()));
    Promise.race([Promise.all(pics), new Promise((r) => setTimeout(r, 1200))])
      .then(() => requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.remove("b30h-pre"))));
    return { layout, render, state: S, get layoutInfo() { return L; } };
  }

  const boot = () => document.querySelectorAll("[data-b30-hero]").forEach((el) => (el.__b30 = initHero(el)));
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", boot) : boot();
})();

/* =====================================================================
   Scroll cursor — once the hero's video fills the screen, the pointer turns
   into the same round button as the case studies' "View", reading "Scroll"
   (white, difference blend: it reads on any frame) — a reminder that the
   site carries on below.
   ===================================================================== */
(() => {
  const hero = document.querySelector("[data-b30-hero]");
  if (!hero || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const el = document.createElement("div"); el.className = "b30-scur"; el.setAttribute("aria-hidden", "true"); el.innerHTML = "<span>Close</span>";
  document.body.appendChild(el);
  const lbl = el.firstChild;
  let cx = -200, cy = -200, tx = -200, ty = -200, show = 0, want = 0, raf = 0, last = 0, inPage = false;
  const over = () => { const t = document.elementFromPoint(tx, ty); return !!(t && hero.contains(t)); };
  function sync() {
    const w = inPage && hero.classList.contains("is-video") && over() ? 1 : 0;
    if (w && !want) { if (show < 0.02) { cx = tx; cy = ty; } B30.scramble && B30.scramble(lbl, { duration: 380 }); }
    want = w; kick();
  }
  function step(now) {
    raf = 0;
    const dt = Math.min(0.05, ((now - (last || now)) / 1000)); last = now;
    const k = 1 - Math.pow(1 - 0.22, dt * 60);           // same follow and grow as the "View" circle
    cx += (tx - cx) * k; cy += (ty - cy) * k;
    show += (want - show) * (1 - Math.pow(1 - 0.18, dt * 60));
    if (Math.abs(want - show) < 0.002) show = want;
    el.style.transform = `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0) scale(${show.toFixed(3)})`;
    if (Math.abs(tx - cx) > 0.2 || Math.abs(ty - cy) > 0.2 || show !== want) kick(); else last = 0;
  }
  function kick() { if (!raf) raf = requestAnimationFrame(step); }
  addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; inPage = true; sync(); }, { passive: true });
  document.addEventListener("pointerleave", () => { inPage = false; sync(); });
  addEventListener("scroll", sync, { passive: true });
  hero.addEventListener("b30:video", sync);
  // click: the video steps aside — the page glides on past the hero to the next section
  hero.addEventListener("click", (e) => {
    if (!hero.classList.contains("is-video") || e.target.closest("a, button")) return;
    const next = hero.nextElementSibling; if (!next) return;
    const y = next.getBoundingClientRect().top + scrollY;
    if (window.B30 && B30.lenis) B30.lenis.scrollTo(y, { duration: 1.8, easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2) }); else scrollTo({ top: y, behavior: "smooth" });
  });
})();
