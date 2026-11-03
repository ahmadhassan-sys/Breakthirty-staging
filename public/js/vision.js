/* =====================================================================
   Our vision — the statement hidden in the clouds.
   Inside the frame: a sky running from night down into bright cyan, the statement in white across it, and two banks
   of cloud (left and right) in front of the words, hiding parts of them. Scrolling down, the banks part — drifting
   out to the sides and down — and the whole line comes clear. The sky breathes slowly; the clouds idle-drift and
   move at slightly different depths.
   ===================================================================== */
(() => {
  const root = document.querySelector("[data-vision]"); if (!root) return;
  const scene = root.querySelector(".vz-scene"); if (!scene) return; const sky = scene.querySelector(".vz-sky"), say = scene.querySelector(".vz-say"), cl = scene.querySelector(".vz-cl.l"), cr = scene.querySelector(".vz-cl.r");
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // the frame on whole pixels (rules, side lines, corner pixels centred on their crossings), and the scene inside it
  function snap() {
    const r = root.getBoundingClientRect(), W = Math.round(r.width), H = Math.round(r.height); if (!W) return;
    const yT = Math.round(H * 0.1465), yB = Math.round(H * 0.8535), xL = Math.round(W >= 900 ? 164 * W / 1920 : 20), xR = W - xL - 1;
    const lt = root.querySelector(".vz-ln.t"), lb = root.querySelector(".vz-ln.b"), vl = root.querySelector(".vz-vl.l"), vr = root.querySelector(".vz-vl.r");
    if (lt) lt.style.top = yT + "px"; if (lb) lb.style.top = yB + "px"; if (vl) vl.style.left = xL + "px"; if (vr) { vr.style.right = "auto"; vr.style.left = xR + "px"; }
    root.querySelectorAll(".vz-sq").forEach((sq) => { const t = sq.classList.contains("t"), l = sq.classList.contains("l");
      sq.style.top = ((t ? yT : yB) - 2) + "px"; sq.style.bottom = "auto"; sq.style.left = ((l ? xL : xR) - 2) + "px"; sq.style.right = "auto"; sq.style.width = sq.style.height = "5px"; });
    Object.assign(scene.style, { top: yT + 1 + "px", left: xL + 1 + "px", right: "auto", bottom: "auto", width: xR - xL - 1 + "px", height: yB - yT - 1 + "px" });
  }
  snap(); addEventListener("resize", snap); addEventListener("load", snap); if (window.ResizeObserver) new ResizeObserver(snap).observe(root);
  let p = REDUCED ? 1 : 0, goal = p, raf = 0, vis = false;
  // 0 while the frame comes up the screen; 1 once its middle has risen to a little above the screen's middle
  const progress = () => { const r = scene.getBoundingClientRect(), vh = innerHeight, mid = r.top + r.height / 2; return Math.min(1, Math.max(0, (vh * 0.85 - mid) / (vh * 0.85 - vh * 0.42))); };
  function frame(now) {
    raf = 0; if (!vis) return;
    goal = REDUCED ? 1 : progress(); p += (goal - p) * 0.08; if (Math.abs(goal - p) < 0.0005) p = goal;
    const T = now / 1000, e = p * p * (3 - 2 * p), idle = REDUCED ? 0 : 1;
    // the banks part: out to the sides and a little down, the nearer (right) one a touch faster
    // at first the banks tower up over the words (grown from their outer bottom corners, so no edge of them ever
    // shows); scrolling, they settle down to their own size and part out to the sides
    const sL = 1.42 - e * 0.42, sR = 1.46 - e * 0.46;   // part of the line peeks out from the start
    const lx = -e * 16 + Math.sin(T * 0.35) * 0.4 * idle * e, ly = e * 6 + Math.cos(T * 0.3) * 0.3 * idle;
    const rx = e * 18 + Math.sin(T * 0.3 + 1.7) * 0.45 * idle * e, ry = e * 7 + Math.cos(T * 0.27 + 0.6) * 0.3 * idle;
    cl.style.transform = `translate3d(${lx.toFixed(2)}%,${ly.toFixed(2)}%,0) scale(${sL.toFixed(4)})`;
    cr.style.transform = `translate3d(${rx.toFixed(2)}%,${ry.toFixed(2)}%,0) scale(${sR.toFixed(4)})`;
    say.style.transform = `translate3d(0,${((1 - e) * 2).toFixed(2)}%,0) scale(${(0.97 + e * 0.03).toFixed(4)})`;
    say.style.opacity = (0.75 + e * 0.25).toFixed(3);
    sky.style.transform = `scale(${(1.06 - e * 0.04 + Math.sin(T * 0.12) * 0.006 * idle).toFixed(4)}) translate3d(0,${(-e * 1.5).toFixed(2)}%,0)`;
    raf = requestAnimationFrame(frame);
  }
  const check = () => { const r = root.getBoundingClientRect(); vis = r.bottom > -100 && r.top < innerHeight + 100; if (vis && !raf) raf = requestAnimationFrame(frame); };
  addEventListener("scroll", check, { passive: true }); addEventListener("load", check); check();
  if (window.IntersectionObserver) new IntersectionObserver(([en]) => { vis = en.isIntersecting; if (vis && !raf) raf = requestAnimationFrame(frame); }, { rootMargin: "100px 0px" }).observe(root);
})();

/* Our vision: the frame draws in early — as soon as the section above is about 70% of the way through the screen */
(() => { const v = document.querySelector(".vision"), up = document.querySelector(".b30sb"); if (!v || !up) return;
  const check = () => { if (v.classList.contains("vz-in")) return removeEventListener("scroll", check);
    const r = up.getBoundingClientRect(); if (r.top + r.height * 0.7 < innerHeight) { v.classList.add("vz-in"); removeEventListener("scroll", check); } };
  addEventListener("scroll", check, { passive: true }); check(); })();

/* "Sketch to scale" on scroll:
   1) the colour: the panel opens from 1590 wide (state 1) to the full width (state 2) while its coloured half comes up
      the screen — it starts as the colour enters at the bottom of the screen and is fully open once the whole colour
      (down to the bottom rule) is in view. It closes again on the way back up.
   2) the sentence is written onto its dashed lines: line by line, letter by letter, each line's rule drawing in under it. */
(() => {
  const v = document.querySelector('.vision'); if (!v || !v.querySelector('.vs-panel')) return;
  const RED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const panel = v.querySelector('.vs-panel'), copy = v.querySelector('.vs-copy'), big = v.querySelector('.vs-big');
  const TEXT = big.textContent.trim();
  const clamp = (x) => Math.min(1, Math.max(0, x)), ease = (t) => t * t * (3 - 2 * t);

  // ---- split the sentence into its rendered lines, then letters
  let lines = [], rules = [];
  function split() {
    big.textContent = TEXT;
    const words = TEXT.split(' ');
    big.innerHTML = words.map((w) => `<span class="vs-w">${w}</span>`).join(' ');
    const rows = [];
    big.querySelectorAll('.vs-w').forEach((w) => { const t = Math.round(w.offsetTop); let r = rows.find((x) => Math.abs(x.top - t) < 4); if (!r) rows.push(r = { top: t, words: [] }); r.words.push(w.textContent); });
    big.innerHTML = rows.map((r) => `<span class="vs-ln">${[...r.words.join(' ')].map((c) => `<span class="vs-ch">${c}</span>`).join('')}</span>`).join('');
    lines = [...big.querySelectorAll('.vs-ln')].map((el) => ({ el, chars: [...el.querySelectorAll('.vs-ch')] }));
    rules.forEach((r) => r.remove());
    const fs = parseFloat(getComputedStyle(big).fontSize), lh = parseFloat(getComputedStyle(big).lineHeight) || fs * 1.2;
    const holder = v.querySelector('.vs-rules') || copy;
    rules = lines.map((_, i) => { const r = document.createElement('i'); r.className = 'vs-ul'; r.style.top = (i * lh + fs * 1.01).toFixed(1) + 'px'; holder.appendChild(r); return r; });
    copy.classList.add('is-split');
    big.setAttribute('aria-hidden', 'true');
  }

  let colCur = -1, txtCur = -1, devCur = -1, raf = 0;
  const dev = v.querySelector('.vs-dev');
  const targets = () => {
    const h = innerHeight, r = v.getBoundingClientRect(), pr = panel.getBoundingClientRect();
    const col = r.top < h && r.bottom > 0;                             // the moment any of the section is on screen
    const cr = copy.getBoundingClientRect();
    const txt = clamp((h * .88 - cr.top) / (h * .88 - h * .32));     // written while the sentence travels from 88% to 32% of the screen
    // the tablet: from its place's top reaching the bottom of the screen → that point 25% from the top (a long, slow rise)
    const devTop = pr.top + (dev ? dev.offsetTop : 0);
    const dv = clamp((h - devTop) / (h * .75));
    return [col, txt, dv];
  };
  function paintText(p) {
    const n = lines.length || 1;
    lines.forEach((ln, i) => {
      const lp = clamp(p * n - i), m = ln.chars.length, k = 5;        // this line's progress; k letters fade at once
      ln.chars.forEach((c, j) => {
        const q = ease(clamp((lp * (m + k) - j) / k));
        c.style.setProperty('--o', (.08 + .92 * q).toFixed(3));
        c.style.setProperty('--y', ((1 - q) * .12).toFixed(3) + 'em');
      });
    });
  }
  const tick = () => {
    raf = 0;
    const [ct, tt, dt] = targets();
    const stepT = txtCur < 0 || RED ? tt : txtCur + (tt - txtCur) * .16;
    txtCur = Math.abs(stepT - tt) < .0005 ? tt : stepT;
    paintText(RED ? 1 : txtCur);
    const stepD = devCur < 0 || RED ? dt : devCur + (dt - devCur) * .07;   // softer follow, so it glides
    devCur = Math.abs(stepD - dt) < .0005 ? dt : stepD;
    if (dev) {
      const e = 1 - Math.pow(1 - devCur, 3), rise = dev.offsetHeight * .6;   // ease-out: quick to start, settles gently
      // the tablet is already in place at full size; it starts tipped 7° (its right side up) and levels out as you scroll
      v.style.setProperty('--vs-dy', '0px');
      v.style.setProperty('--vs-ds', '1');

    }
    if (txtCur !== tt || devCur !== dt) raf = requestAnimationFrame(tick);
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
  const resplit = () => { split(); txtCur = -1; kick(); };
  split();
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(resplit);
  let rw = innerWidth; addEventListener('resize', () => { if (innerWidth !== rw) { rw = innerWidth; resplit(); } else kick(); });
  addEventListener('scroll', kick, { passive: true }); kick();
})();

(() => { const v = document.querySelector('section.vision'); if (!v) return;
  const img = new Image(); img.className = 'vs-stone'; img.alt = ''; img.decoding = 'async'; img.setAttribute('aria-hidden', 'true');
  const ROCK = (window.B30_CONTENT.vision || {}).rock || {};   // the rock under the tablet: src/data/home.js (vision.rock)
  img.src = ROCK.pixel; img.dataset.orig = ROCK.original;
  const dev = v.querySelector('.vs-dev'), host = dev ? dev.parentNode : v;
  host.insertBefore(img, dev || null);                                   // in the tablet's own layer, just beneath it
  if (host !== v) { const vr = v.getBoundingClientRect(), hr = host.getBoundingClientRect(); img.style.setProperty('--sy', (hr.top - vr.top) + 'px'); img.style.setProperty('--sx', (hr.left - vr.left) + 'px'); }
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { img.classList.add('is-in'); o.disconnect(); } }, { threshold: .15 }).observe(img);
})();

/* =====================================================================
   Sketch to scale — the footer's clouds, around the rock. The same cloud formulas as the footer's sky (its back cloud
   bank and its front clouds, same noise, same colours, same drift speed), drawn on their own with a clear background:
   one canvas behind the tablet and rock (the bank), one in front of the rock (the wisps).
   ===================================================================== */
(() => {
  const v = document.querySelector('section.vision'); if (!v || matchMedia('(max-width: 899px)').matches) return;
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
      A = dB*0.95 * smoothstep(0.0, 0.26, uv.y) * smoothstep(0.26, 0.58, nb);   // fewer: only the fuller parts of the bank     // (softened to nothing at the very bottom edge)
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
    const c = document.createElement('canvas'); c.className = 'vs-cloud ' + (kind ? 'front' : 'back'); c.setAttribute('aria-hidden', 'true');
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
  const place = () => { const vr = v.getBoundingClientRect(), hr = host.getBoundingClientRect(); host.style.setProperty('--sx', (hr.left - vr.left) + 'px'); host.style.setProperty('--sy', (hr.top - vr.top) + 'px'); };
  place(); addEventListener('resize', place);
  const L = [make(0), make(1)].filter(Boolean); if (!L.length) return;
  // the bank's horizon sits just above the rock's top (behind the tablet's foot); the wisps ride across the rock's lower half
  const BAND = [[0.72, 0, 0, 0], [0.30, 0.30, 0, 0]];   // the wisps reach up across the rock, nearly to its top
  let t = 0, last = 0, on = false, raf = 0, skip = false;
  const RED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const draw = (now) => { raf = on ? requestAnimationFrame(draw) : 0;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016); last = now; t += dt * (RED ? 0.35 : 1);   // the footer's pace
    if ((skip = !skip)) return;   // 30 fps, as the footer's clouds idle
    const night = document.documentElement.classList.contains('dark') ? 1 : 0, dpr = Math.min(1.5, devicePixelRatio || 1);
    L.forEach((o) => { const w = Math.round(o.c.clientWidth * dpr), h = Math.round(o.c.clientHeight * dpr); if (!w) return;
      if (o.c.width !== w || o.c.height !== h) { o.c.width = w; o.c.height = h; }
      const gl = o.gl; gl.viewport(0, 0, w, h); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(o.U.res, w, h); gl.uniform1f(o.U.time, t + 40); gl.uniform1f(o.U.kind, o.kind); gl.uniform1f(o.U.night, night); gl.uniform4f(o.U.band, ...BAND[o.kind]);
      gl.drawArrays(gl.TRIANGLES, 0, 3); }); };
  new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on && !raf) { last = 0; raf = requestAnimationFrame(draw); } }).observe(L[0].c);
})();

/* the rock: its frame lines, and the image hover the other pictures have — the picture bends after the cursor with a
   colour split, and under the cursor a ragged patch of pixels goes black & white (with "Next" style cursor hidden) */
(() => {
  const v = document.querySelector('section.vision'), img = v && v.querySelector('.vs-stone'); if (!img || matchMedia('(max-width: 899px)').matches) return;
  const host = img.parentNode;
  // frame
  const add = (cls, style) => { const e = document.createElement('i'); e.className = 'vs-rf ' + cls; e.setAttribute('aria-hidden', 'true'); if (style) e.style.cssText = style; host.appendChild(e); return e; };
  add('h t'); add('h b'); add('v l'); add('v r');
  [['468', '1680'], ['1447', '1680'], ['468', '2014'], ['1447', '2014']].forEach(([x, y]) => add('px', `left:calc(${x}*var(--u) - var(--sx,0px));top:calc(${y}*var(--u) - var(--sy,0px))`));
  return;   // (this hover is retired — the rock now plays the case studies' hover, below)
  const cv = document.createElement('canvas'); cv.className = 'vs-rockgl'; cv.setAttribute('aria-hidden', 'true'); host.appendChild(cv);
  const gl = cv.getContext('webgl2', { alpha: true, premultipliedAlpha: false, antialias: false }); if (!gl) return;
  const VS = `#version 300 es
  in vec2 aPos; out vec2 vUv; void main(){ vUv = aPos*.5+.5; gl_Position = vec4(aPos,0.,1.); }`;
  const FS = `#version 300 es
  precision highp float; in vec2 vUv; out vec4 o;
  uniform sampler2D uT; uniform vec2 uRes, uM, uV; uniform float uHv, uK, uTime;
  float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main(){
    vec2 uv = vec2(vUv.x, 1.-vUv.y);
    // bend: the picture is dragged after the cursor's movement, strongest near it
    vec2 dm = (uv - uM) * vec2(uRes.x/uRes.y, 1.); float fall = exp(-dot(dm, dm) * 9.);
    vec2 d = uV * fall;
    vec4 c = texture(uT, uv - d);
    o = vec4(texture(uT, uv - d + d*.4).r, c.g, texture(uT, uv - d - d*.4).b, c.a);   // with a colour split along the bend
    // (no pixel patch — just the bend and its colour split)
  }`;
  const sh = (t, src) => { const x = gl.createShader(t); gl.shaderSource(x, src); gl.compileShader(x); return x; };
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); gl.useProgram(pr);
  const vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const la = gl.getAttribLocation(pr, 'aPos'); gl.enableVertexAttribArray(la); gl.vertexAttribPointer(la, 2, gl.FLOAT, false, 0, 0);
  const U = (n) => gl.getUniformLocation(pr, n), uRes = U('uRes'), uM = U('uM'), uV = U('uV'), uHv = U('uHv'), uK = U('uK');
  const tex = gl.createTexture(); let texOK = false;
  const load = () => { gl.bindTexture(gl.TEXTURE_2D, tex); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img); texOK = true; };
  if (img.complete && img.naturalWidth) load(); else img.addEventListener('load', load, { once: true });
  let hv = 0, want = 0, mx = .5, my = .5, vx = 0, vy = 0, lx = null, ly = null, raf = 0;
  const fit = () => { const hr = host.getBoundingClientRect(), r = img.getBoundingClientRect(); cv.style.left = (r.left - hr.left) + 'px'; cv.style.top = (r.top - hr.top) + 'px'; cv.style.width = r.width + 'px'; cv.style.height = r.height + 'px'; img.style.transition = 'none';
    const dpr = Math.min(2, devicePixelRatio || 1); cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr); };
  let sx = 0, sy = 0;
  const frame = () => { raf = 0; hv += (want - hv) * .14; vx *= .9; vy *= .9; sx += (vx - sx) * .2; sy += (vy - sy) * .2;   // the bend eases after the hand, so it never shakes
    if (!texOK) { raf = requestAnimationFrame(frame); return; }
    gl.viewport(0, 0, cv.width, cv.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uRes, cv.width, cv.height); gl.uniform2f(uM, mx, my); gl.uniform2f(uV, sx, sy); gl.uniform1f(uHv, hv); gl.uniform1f(uK, Math.max(8, 12 * cv.width / 975));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    const busy = !!want || Math.abs(sx) + Math.abs(sy) > .0004;
    cv.classList.toggle('on', busy); img.classList.toggle('is-gl', busy);   // swap in the same frame, so nothing flickers
    if (busy) raf = requestAnimationFrame(frame); };
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
  img.addEventListener('pointerenter', () => { fit(); want = 1; lx = ly = null; kick(); });
  img.addEventListener('pointermove', (e) => { const r = img.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    if (lx !== null) { vx = Math.max(-.05, Math.min(.05, vx + (x - lx) * .45)); vy = Math.max(-.05, Math.min(.05, vy + (y - ly) * .45)); } lx = x; ly = y; mx += (x - mx) * .5; my += (y - my) * .5; kick(); });
  img.addEventListener('pointerleave', () => { want = 0; kick(); });
  addEventListener('resize', () => { if (cv.classList.contains('on')) fit(); });
})();

/* =====================================================================
   The rock: the pixel rock by default; hovering plays the case studies' own hover — the picture's grid bends with the
   cursor (with the colour split), at 30% of their strength, and under the cursor a ragged patch of pixels shows the
   original rock.
   ===================================================================== */
(() => {
  const img = document.querySelector('section.vision .vs-stone'); if (!img || matchMedia('(max-width: 899px)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const host = img.parentNode, ORIG = img.dataset.orig; if (!ORIG) return;
  const GW = 28, GH = Math.round(28 * 471 / 975), RAD = .22 * GW, STR = .9 * .4, RELAX = .925;   // the case studies' grid, at 40%
  const cv = document.createElement('canvas'); cv.className = 'vs-rockfx'; cv.setAttribute('aria-hidden', 'true'); host.appendChild(cv);
  const gl = cv.getContext('webgl2', { alpha: true, antialias: true, premultipliedAlpha: false }); if (!gl) return;
  const VS = `#version 300 es
  in vec2 p; out vec2 vUv; void main(){ vUv = p*.5+.5; gl_Position = vec4(p,0.,1.); }`;
  const FS = `#version 300 es
  precision highp float; in vec2 vUv; out vec4 o;
  uniform sampler2D uT, uD, uN; uniform vec2 uRes, uM; uniform float uHv, uK;
  float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main(){
    vec2 uv = vec2(vUv.x, 1.-vUv.y), uv0 = uv;
    vec2 d = texture(uD, uv).rg, c = uv - d;
    vec4 b = texture(uT, c);
    o = vec4(texture(uT, c + d*.4).r, b.g, texture(uT, c - d*.4).b, b.a);
    if (uHv > .001) {   // under the cursor, a ragged patch of pixels shows the original rock (as the case studies show the next one)
      vec2 px = uv0 * uRes, cell = floor(px / uK), g = (cell + .5) * uK;
      float r = uHv * min(uRes.x, uRes.y) * .26, dd = length(g - uM * uRes) + (h(cell) - .5) * uK * 1.6;   // a bigger patch than the case studies'
      if (dd < r) { vec2 cn = uv0 - d; vec4 q = texture(uN, cn); o = vec4(texture(uN, cn + d*.4).r, q.g, texture(uN, cn - d*.4).b, q.a); }
    }
  }`;
  const sh = (t, src) => { const x = gl.createShader(t); gl.shaderSource(x, src); gl.compileShader(x); return x; };
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); gl.useProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
  const vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const la = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(la); gl.vertexAttribPointer(la, 2, gl.FLOAT, false, 0, 0);
  const U = {}; ['uT', 'uD', 'uN', 'uRes', 'uM', 'uHv', 'uK'].forEach((k) => (U[k] = gl.getUniformLocation(pr, k)));
  gl.uniform1i(U.uT, 0); gl.uniform1i(U.uD, 1); gl.uniform1i(U.uN, 2);
  const params = (f) => [[gl.TEXTURE_MIN_FILTER, f], [gl.TEXTURE_MAG_FILTER, f], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]].forEach(([k, v]) => gl.texParameteri(gl.TEXTURE_2D, k, v));
  const disp = new Float32Array(GW * GH * 2), dispTex = gl.createTexture(); gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, dispTex); params(gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG32F, GW, GH, 0, gl.RG, gl.FLOAT, disp);
  let ready = 0; const load = (unit, src) => { const t = gl.createTexture(), im = new Image(); im.onload = () => { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); params(gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im); ready++; }; im.src = src; return t; };
  const tT = load(0, img.src), tN = load(2, ORIG);
  const m = { x: .5, y: .5, sx: .5, sy: .5, vx: 0, vy: 0, inside: false, px: null, py: null }; let hv = 0, raf = 0, last = 0;
  const fit = () => { const hr = host.getBoundingClientRect(), r = img.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    Object.assign(cv.style, { left: r.left - hr.left + 'px', top: r.top - hr.top + 'px', width: r.width + 'px', height: r.height + 'px' }); cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr); };
  const step = () => { let active = m.inside, rad = RAD;
    for (let j = 0; j < GH; j++) for (let i = 0; i < GW; i++) { const k = (j * GW + i) * 2;
      if (m.inside) { const dist = Math.hypot((i + .5) - m.x * GW, (j + .5) - m.y * GH); if (dist < rad) { const p = Math.pow(1 - dist / rad, 2) * STR; disp[k] += m.vx * p; disp[k + 1] += m.vy * p; } }
      disp[k] *= RELAX; disp[k + 1] *= RELAX; if (!active && (Math.abs(disp[k]) > 1e-5 || Math.abs(disp[k + 1]) > 1e-5)) active = true; }
    m.vx *= .85; m.vy *= .85;
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, dispTex); gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, GW, GH, gl.RG, gl.FLOAT, disp); return active; };
  const frame = (now) => { raf = 0; const dt = Math.min(.05, last ? (now - last) / 1000 : .016); last = now;
    if (ready < 2) { raf = requestAnimationFrame(frame); return; }
    const active = step(); m.sx += (m.x - m.sx) * .22; m.sy += (m.y - m.sy) * .22; hv += ((m.inside ? 1 : 0) - hv) * Math.min(1, dt * 7);
    gl.viewport(0, 0, cv.width, cv.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tT); gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, tN);
    gl.uniform2f(U.uRes, cv.width, cv.height); gl.uniform2f(U.uM, m.sx, m.sy); gl.uniform1f(U.uHv, 0); /* the hover patch is off everywhere: the picture never changes under the cursor (only the black label follows it) */ gl.uniform1f(U.uK, Math.round(12 * cv.width / 609));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    const busy = active || hv > .003; cv.classList.toggle('on', busy); img.classList.toggle('is-fx', busy);
    if (busy) raf = requestAnimationFrame(frame); else last = 0; };
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
  img.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'mouse') return; fit(); m.inside = true; m.px = null; kick(); });
  img.addEventListener('pointermove', (e) => { if (e.pointerType !== 'mouse') return; const r = img.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    if (m.px !== null) { m.vx = x - m.px; m.vy = y - m.py; } m.x = x; m.y = y; m.px = x; m.py = y; m.inside = true; kick(); });
  img.addEventListener('pointerleave', () => { m.inside = false; m.px = null; kick(); });
  addEventListener('resize', () => { if (cv.classList.contains('on')) fit(); });
})();

/* Sketch to scale: the tablet and the rock hang in the air — each drifts gently up and down (a few pixels, slow, a
   little out of step with each other); the rock's hover copy moves with it */
(() => { const v = document.querySelector('section.vision'); if (!v || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let on = false, raf = 0, t0 = performance.now();
  const dev = v.querySelector('.vs-dev'); let rot = -7;
  const tick = (now) => { raf = on ? requestAnimationFrame(tick) : 0; const t = (now - t0) / 1000, k = document.documentElement.clientWidth / 1920;
    // the tilt: −7° while the tablet comes up the screen, level by the time it sits in the middle (smoothed)
    if (dev) { const r = dev.getBoundingClientRect(), vh = innerHeight, c = r.top + r.height / 2, q = Math.max(0, Math.min(1, (vh * .95 - c) / (vh * .45))), e = q * q * (3 - 2 * q);
      v.style.setProperty('--vs-rot', '0deg'); }   // (no tilt — the tablet stays level)
    v.style.setProperty('--bob-t', (Math.sin(t * 2 * Math.PI / 5.2) * 5 * k).toFixed(2) + 'px');            // the tablet: ±5, every ~5 s
    v.style.setProperty('--bob-r', (Math.sin(t * 2 * Math.PI / 6.4 + 1.1) * 7 * k).toFixed(2) + 'px'); };  // the rock: ±7, a little slower
  new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on && !raf) raf = requestAnimationFrame(tick); }).observe(v);
})();

(() => { const os = document.querySelector('.vision .vs-os'); if (!os) return;
  const go = (sc) => { os.dataset.screen = sc; os.querySelectorAll('.vs-ic.sel').forEach((e) => e.classList.remove('sel')); };
  os.querySelectorAll('.s-home .vs-ic').forEach((b) => {
    b.addEventListener('click', () => { os.querySelectorAll('.vs-ic.sel').forEach((e) => e.classList.remove('sel')); b.classList.add('sel'); });   // one click selects
    b.addEventListener('dblclick', () => { if (b.dataset.open === 'process') go('proc'); if (b.dataset.open === 'bt') go('bt'); });                                                   // a double-click opens (Process)
    b.addEventListener('keydown', (e) => { if (e.key === 'Enter' && b.dataset.open === 'process') go('proc'); }); });
  const im = os.querySelector('[data-img]');
  im.addEventListener('click', () => { os.querySelectorAll('.vs-ic.sel').forEach((e) => e.classList.remove('sel')); im.classList.add('sel'); });
  im.addEventListener('dblclick', () => go('img'));                                     // double-click opens the image
  im.addEventListener('keydown', (e) => { if (e.key === 'Enter') go('img'); });
  os.querySelector('.vs-back').addEventListener('click', () => go('home'));
  os.querySelector('.s-img .vs-x').addEventListener('click', () => go('bt'));   // (the Process image's own ×: back to the BT folder)
  os.addEventListener('click', (e) => { if (!e.target.closest('.vs-ic')) os.querySelectorAll('.vs-ic.sel').forEach((x) => x.classList.remove('sel')); });
})();

(() => { const d = document.querySelector('section.vision .vs-dev'); if (!d) return;
  new IntersectionObserver(([e]) => { if (e.isIntersecting) d.classList.add('is-arrived'); else if (e.boundingClientRect.top > 0) d.classList.remove('is-arrived'); }, { threshold: .25 }).observe(d); })();

/* the tablet's BT folder: four images (Before, After, About, Breakdown); one click selects, a double-click opens the
   image full screen; × closes it back to the folder, Back returns to the desktop */
(() => { const os = document.querySelector('.vision .vs-os'); if (!os) return;
  const go = (sc) => { os.dataset.screen = sc; os.querySelectorAll('.vs-ic.sel').forEach((e) => e.classList.remove('sel')); };
  os.querySelectorAll('.s-home .vs-ic[data-open="bt"]').forEach((b) => b.addEventListener('keydown', (e) => { if (e.key === 'Enter') go('bt'); }));
  os.querySelectorAll('.s-bt .vs-ic[data-view]').forEach((b) => {
    b.addEventListener('click', () => { os.querySelectorAll('.vs-ic.sel').forEach((e) => e.classList.remove('sel')); b.classList.add('sel'); });
    const open = () => { os.querySelectorAll('.vs-pic').forEach((f) => f.classList.toggle('on', f.dataset.pic === b.dataset.view)); go('view'); };
    b.addEventListener('dblclick', open); b.addEventListener('keydown', (e) => { if (e.key === 'Enter') open(); }); });
  os.querySelector('.s-bt .vs-back').addEventListener('click', () => go('home'));
  os.querySelector('.vs-x2').addEventListener('click', () => go('bt'));
})();

(() => { const os = document.querySelector('.vision .vs-os'); if (!os) return;
  // remember which picture is open (for the × above), and play the After GIF from its first frame each time it opens
  new MutationObserver(() => { const on = os.querySelector('.vs-pic.on'); os.classList.toggle('pic-after', !!on && on.dataset.pic === 'after' && os.dataset.screen === 'view');
    if (on && on.dataset.pic === 'after' && os.dataset.screen === 'view' && !os._gifPlayed) { const im = on.querySelector('img'), s0 = im.src; im.src = ''; im.src = s0; os._gifPlayed = true; }
    if (os.dataset.screen !== 'view') os._gifPlayed = false; }).observe(os, { attributes: true, subtree: true, attributeFilter: ['data-screen', 'class'] });
})();
