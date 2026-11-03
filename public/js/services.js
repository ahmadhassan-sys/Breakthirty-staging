(() => {
  /* ---------------- content ---------------- */
  const SERVICES = (window.B30_CONTENT.services || {}).items || [];   // edit them in src/data/home.js
  const CORNERS = [null, { dx: -1, dy: 1 }, { dx: -1, dy: -1 }, { dx: 1, dy: 1 }];

  /* ---------------- Figma geometry (1920 frame) ---------------- */
  const D = 1920, BOX = 564, R = BOX / 2;
  const HEAD_TOP = 206, STAGE_TOP_F1 = 712;           // bg starts at 206; hands block starts at 712 (state 1)
  const ROBOT_W = 990.5, HUMAN_W = 1046.5;
  // Hand images are the frame-clipped exports (2x files at 1x design size).
  const F1 = { box: [926, 1022], robot: [1, 712], human: [873.5, 712], deco: 1088 };
  const F2 = { box: [960, 1304], robot: [-213, 715.85], human: [1199.7, 1257], deco: 1739 };
  // Visible extent of the state-2 composition (robot arm top -> human hand bottom)
  const VIS2_TOP = 715.85 + 44.5, VIS2_BOTTOM = 1257 + 410.5;
  const DECO_TOP = 1088, DECO_H = 210;
  // The first state shows just five pixels on the 40px grid (origin x 0, y 1088): 3 left, 2 right.
  // `out` is the order they leave the screen in, before the rest of the animation starts.
  const DECO = [
    [80, 1128, "#FAD7FF"], [320, 1088, "w"], [400, 1168, "w"],    // left
    [1560, 1128, "w"], [1800, 1128, "#F4EB02"],                 // right
    [1400, 1088, "#3457BA"],                                     // Breeze blue (the yellow would vanish on the yellow band), on the edge of the human hand
  ];
  const DECO_OUT = [0, 4, 1, 3, 5, 2];   // outermost first, alternating sides

  /* ---------------- scroll timeline (in viewport heights, measured from the moment the stage pins) ---------------- */
  // The pixels start leaving and the hands start parting at the same moment (stage top at 55% of the
  // viewport); the pixels are all gone by 15%, the hands reach state 2 shortly after the stage pins.
  const PIX_OUT = [-0.55, -0.15];
  const PRE = 0.55;
  const A_END = 0.45;
  const FACE_PH = [[0.75, 1.5], [1.75, 2.5], [2.75, 3.5]];
  const PIN = 3.9;                    // pinned distance

  const root = document.getElementById("services");
  const $ = (s) => root.querySelector(s);
  const el = (k) => root.querySelector(`[data-el="${k}"]`);
  const head = $(".b30s__head"), headWorld = $(".b30s__headworld"), track = $(".b30s__track"), stage = $(".b30s__stage"),
        world = $(".b30s__world"), tail = $(".b30s__tail");
  const deco = el("deco"), box = el("box"), cam = el("cam"), robot = el("robot"), human = el("human");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = matchMedia("(max-width: 899px)");

  /* ---------------- DOM ---------------- */
  const esc = (t) => t.replace(/&/g, "&amp;");
  const SVC_ARROW = '<svg viewBox="0 0 16 16" aria-hidden="true" shape-rendering="crispEdges" fill="currentColor"><rect x="4" y="1" width="1" height="1"/><rect x="5" y="1" width="1" height="1"/><rect x="6" y="1" width="1" height="1"/><rect x="7" y="1" width="1" height="1"/><rect x="8" y="1" width="1" height="1"/><rect x="9" y="1" width="1" height="1"/><rect x="10" y="1" width="1" height="1"/><rect x="11" y="1" width="1" height="1"/><rect x="12" y="1" width="1" height="1"/><rect x="13" y="1" width="1" height="1"/><rect x="14" y="1" width="1" height="1"/><rect x="4" y="2" width="1" height="1"/><rect x="5" y="2" width="1" height="1"/><rect x="6" y="2" width="1" height="1"/><rect x="7" y="2" width="1" height="1"/><rect x="8" y="2" width="1" height="1"/><rect x="9" y="2" width="1" height="1"/><rect x="10" y="2" width="1" height="1"/><rect x="11" y="2" width="1" height="1"/><rect x="12" y="2" width="1" height="1"/><rect x="13" y="2" width="1" height="1"/><rect x="14" y="2" width="1" height="1"/><rect x="12" y="3" width="1" height="1"/><rect x="13" y="3" width="1" height="1"/><rect x="14" y="3" width="1" height="1"/><rect x="11" y="4" width="1" height="1"/><rect x="12" y="4" width="1" height="1"/><rect x="13" y="4" width="1" height="1"/><rect x="14" y="4" width="1" height="1"/><rect x="10" y="5" width="1" height="1"/><rect x="11" y="5" width="1" height="1"/><rect x="13" y="5" width="1" height="1"/><rect x="14" y="5" width="1" height="1"/><rect x="9" y="6" width="1" height="1"/><rect x="10" y="6" width="1" height="1"/><rect x="13" y="6" width="1" height="1"/><rect x="14" y="6" width="1" height="1"/><rect x="8" y="7" width="1" height="1"/><rect x="9" y="7" width="1" height="1"/><rect x="13" y="7" width="1" height="1"/><rect x="14" y="7" width="1" height="1"/><rect x="7" y="8" width="1" height="1"/><rect x="8" y="8" width="1" height="1"/><rect x="13" y="8" width="1" height="1"/><rect x="14" y="8" width="1" height="1"/><rect x="6" y="9" width="1" height="1"/><rect x="7" y="9" width="1" height="1"/><rect x="13" y="9" width="1" height="1"/><rect x="14" y="9" width="1" height="1"/><rect x="5" y="10" width="1" height="1"/><rect x="6" y="10" width="1" height="1"/><rect x="13" y="10" width="1" height="1"/><rect x="14" y="10" width="1" height="1"/><rect x="4" y="11" width="1" height="1"/><rect x="5" y="11" width="1" height="1"/><rect x="13" y="11" width="1" height="1"/><rect x="14" y="11" width="1" height="1"/><rect x="3" y="12" width="1" height="1"/><rect x="4" y="12" width="1" height="1"/><rect x="2" y="13" width="1" height="1"/><rect x="3" y="13" width="1" height="1"/><rect x="1" y="14" width="1" height="1"/><rect x="2" y="14" width="1" height="1"/></svg>';
  const svcSlug = (n) => n.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");
  const faceHTML = (s) => `
    <div class="svc__head"><p class="svc__num">${s.num}</p><h3 class="svc__name">${esc(s.name)}</h3><a class="svc__go" href="${s.href || "/services"}" data-pt aria-label="Explore ${esc(s.name)}">Explore</a></div>
    <div class="svc__body"><p class="svc__desc">${s.desc}</p><ul class="svc__list">${s.items.map((it, n) => `<li style="--i:${n}">${esc(it)}</li>`).join("")}</ul></div>`;
  const faces = SERVICES.map((s, i) => {
    const f = document.createElement("article");
    f.className = "b30s__face";
    f.style.zIndex = String(i + 1);
    f.innerHTML = `${faceHTML(s)}<span class="b30s__edge"></span>`;
    cam.appendChild(f);
    return { el: f, inner: f.querySelectorAll(".svc__head, .svc__body"), edge: f.querySelector(".b30s__edge") };
  });
  root.querySelector(".m-cards").innerHTML = SERVICES.map(s => `<article class="b30s__face">${faceHTML(s)}</article>`).join("");

  // deterministic per-pixel rhythm so it looks organic but never jumps between reloads
  const rnd = (i, salt) => { const v = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453; return v - Math.floor(v); };
  deco.innerHTML = DECO.map(([x, y, k]) => {
    const pos = `left:${x}px;top:${y - DECO_TOP}px`;
    return k === "w" ? `<i class="w" style="${pos}"></i>` : `<i class="c" style="${pos};background:${k}"></i>`;
  }).join("");

  // Mobile mini-scene: state-1 hands (frame y 712..1182)
  root.querySelector(".m-scene").innerHTML = `
    <img class="b30s__hand b30s__handimg robot" alt="" loading="lazy" decoding="async" src="${robot.querySelector("img").getAttribute("src")}" style="width:${ROBOT_W/D*100}%;left:${F1.robot[0]/D*100}%;top:0">
    <img class="b30s__hand b30s__handimg human" alt="" loading="lazy" decoding="async" src="${human.querySelector("img").getAttribute("src")}" style="width:${HUMAN_W/D*100}%;left:${F1.human[0]/D*100}%;top:0">
    <i style="position:absolute;background:#fff;width:${40/D*100}%;aspect-ratio:1;left:${906/D*100}%;top:${(1002-712)/470*100}%"></i>`;

  /* ---------------- top pixel band (port of the Figma "Pixelate" effect) ---------------- */
  (function buildBand() {
    const fr = Math.fround, fract = (x) => fr(x - Math.floor(x));
    const hash21 = (x, y) => {
      let a = fract(fr(x * 0.1031)), b = fract(fr(y * 0.1031)), c = a;
      const d = fr(a * fr(b + 33.33) + b * fr(c + 33.33) + c * fr(a + 33.33));
      a = fr(a + d); b = fr(b + d); c = fr(c + d);
      return fract(fr(fr(a + b) * c));
    };
    const W = 1920, H = 413, CX = 960, CY = 206.5, CELL = 80, RADIUS = 0.75 * 1920, DISSOLVE = 0.25;
    const smooth = (t) => t * t * (3 - 2 * t);
    let rects = "";
    for (let i = -4; i <= 3; i++) for (let j = -13; j <= 12; j++) {
      const lx = (i + 0.5) * CELL, ly = (j + 0.5) * CELL;
      const dist = Math.min(Math.hypot(lx, ly) / RADIUS, 1);
      if (hash21(lx, ly) < DISSOLVE + (1 - DISSOLVE) * smooth(dist)) continue;
      const px = CX - ly, py = CY + lx;
      rects += `<rect x="${W - px - CELL / 2}" y="${H - py - CELL / 2}" width="${CELL}" height="${CELL}"/>`;
    }
    root.querySelectorAll(".b30s__band").forEach(svg => svg.innerHTML =
      `<g fill="#B4E3F7" shape-rendering="crispEdges">${rects}</g>`);
  })();

  /* ---------------- pixel formation: the band builds itself as you arrive (replaces the static band on desktop) ---------------- */
  (function pixelForm() {
    if (!head) return;
    const fr = Math.fround, fract = (x) => fr(x - Math.floor(x));
    const hash21 = (x, y) => {
      let a = fract(fr(x * 0.1031)), b = fract(fr(y * 0.1031)), c = a;
      const d = fr(a * fr(b + 33.33) + b * fr(c + 33.33) + c * fr(a + 33.33));
      a = fr(a + d); b = fr(b + d); c = fr(c + d);
      return fract(fr(fr(a + b) * c));
    };
    const CELL = 80, TOP = -206, BOTTOM = 506;
    // Figma band (3429:2234, Pixelate on #B0E9FD): the three rows that sit above the section, read cell by cell
    const FIG = {
      "-239": [8, 9, 10, 12, 14, 17, 18, 19, 20, 21],
      "-159": [1, 5, 6, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 20],
      "-79":  [1, 3, 4, 6, 8, 9, 10, 12, 13, 14, 16, 17, 18, 21, 23],
    };
    const rr = (n) => { const v = Math.sin(n * 91.345 + 7.13) * 43758.5453; return v - Math.floor(v); };
    const cells = [];
    let n = 0;
    for (let y = -239; y < BOTTOM; y += CELL) {
      const row = FIG[String(y)];
      const yn = (y - TOP) / (BOTTOM - TOP);                       // 0 top … 1 bottom
      for (let c = 0; c < 24; c++) {
        n++;
        if (row && !row.includes(c)) continue;
        // bottom rows first; inside a row the order is shuffled, so it builds in clean pixel steps
        cells.push({ x: c * CELL, y, t0: (1 - yn) * 0.62 + rr(n) * 0.2, solid: !row });
      }
    }
    const cv = document.createElement("canvas");
    cv.className = "b30s__pxform"; cv.setAttribute("aria-hidden", "true");
    head.prepend(cv);
    const ctx = cv.getContext("2d");
    const title = root.querySelector(".b30s__headworld .b30s__title");
    let s = 1, dpr = 1, grad = null, lastPr = -1, raf = 0;
    function size() {
      s = document.documentElement.clientWidth / 1920; dpr = Math.min(devicePixelRatio || 1, 2);
      cv.style.top = TOP * s + "px"; cv.style.height = (BOTTOM - TOP) * s + "px";
      cv.width = Math.round(document.documentElement.clientWidth * dpr); cv.height = Math.round((BOTTOM - TOP) * s * dpr);
      grad = ctx.createLinearGradient(0, TOP, 0, BOTTOM);
      const rs = getComputedStyle(root), bz = rs.getPropertyValue("--b30-breeze").trim() || "#B4E3F7", bm = rs.getPropertyValue("--b30s-mid").trim() || "#CBEBF9";   // follows the theme
      grad.addColorStop(0, bz); grad.addColorStop(0.3, bz); grad.addColorStop(1, bm);   // the pixels a shade deeper, easing into the section's sky blue
      lastPr = -1; cur = progress(); draw();
    }
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    function progress() {
      const top = head.getBoundingClientRect().top + TOP * s, vh = innerHeight;
      return reduce.matches ? 1 : Math.min(1, Math.max(0, (vh + 100 - top) / (vh * 0.8)));   // starts 100px before the band reaches the screen
    }
    let cur = 0;
    function draw() {
      raf = 0;
      if (mobile.matches) return;
      const goal = progress();
      cur += (goal - cur) * (reduce.matches ? 1 : 0.13);          // inertia: the build keeps gliding after the wheel stops
      if (Math.abs(goal - cur) < 0.0006) cur = goal;
      if (cur !== goal) raf = requestAnimationFrame(draw);
      if (Math.abs(cur - lastPr) < 0.0002) return;
      const pr = (lastPr = cur);
      ctx.setTransform(s * dpr, 0, 0, s * dpr, 0, -TOP * s * dpr);
      ctx.clearRect(0, TOP, 1920, BOTTOM - TOP);
      ctx.fillStyle = grad;
      for (const c of cells) {
        const a = Math.min(1, Math.max(0, (pr - c.t0) / 0.05));
        if (a <= 0) continue;
        const e = easeOut(a), sz = CELL * (0.74 + 0.26 * e) + 1, o = (CELL - sz) / 2;   // each pixel settles in from a slightly smaller square
        ctx.globalAlpha = e;
        ctx.fillRect(c.x + o, c.y + o, sz, sz);
      }
      ctx.globalAlpha = 1;
      // the pixels are in: services starts
      if (title) { if (pr > 0.9 && !title.classList.contains("is-in")) B30.setIn(title, true); else if (pr < 0.35 && title.classList.contains("is-in")) B30.setIn(title, false); }
    }
    addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(draw); }, { passive: true });
    addEventListener("resize", size); addEventListener("load", size); addEventListener("b30:theme", size); requestAnimationFrame(size);
    size();
    /* "Services" label: optically align its cap height with the heading's */
    const label = root.querySelector(".b30s__headworld .b30s__label"), lede = root.querySelector(".b30s__headworld .b30s__lede");
    const capTop = (el) => {
      const cs = getComputedStyle(el), x = document.createElement("canvas").getContext("2d");
      x.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const m = x.measureText("S"), fs = parseFloat(cs.fontSize);
      const lh = parseFloat(cs.lineHeight) || fs * 1.2;
      const asc = m.fontBoundingBoxAscent || fs * 0.9, desc = m.fontBoundingBoxDescent || fs * 0.25;
      return (lh - asc - desc) / 2 + asc - (m.actualBoundingBoxAscent || fs * 0.7);
    };
    const align = () => {
      if (!title || !label) return;
      const d = Math.max(0, capTop(title) - capTop(label));
      label.style.marginTop = d.toFixed(2) + "px";
      if (lede) lede.style.marginTop = (153 - d).toFixed(2) + "px";
    };
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(align);
  })();

  /* ---------------- math ---------------- */
  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ioCubic = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const outCubic = (t) => 1 - Math.pow(1 - t, 3);
  const smoothstep = (a, b, t) => { const x = clamp01((t - a) / (b - a)); return x * x * (3 - 2 * x); };

  let L = null;
  function measure() {
    const vw = document.documentElement.clientWidth, vh = stage.clientHeight;
    const s = vw / D, Hd = vh / s;
    // header (flow)
    head.style.height = `${(STAGE_TOP_F1 - HEAD_TOP) * s}px`;
    headWorld.style.transform = `scale(${s})`;
    root.querySelectorAll(".b30s__band").forEach(b => { b.style.height = `${413 * s}px`; b.style.top = `${-206 * s}px`; });
    // stage
    world.style.transform = `scale(${s})`;
    world.style.height = `${Hd}px`;
    track.style.height = `${vh * 2.0}px`;   // a hold: the hands settle, the box lands, and the finished scene stays a moment before the page moves on

    // State 1: Figma positions, measured from the top of the hands block (frame y 712)
    const s1 = (pt) => [pt[0], pt[1] - STAGE_TOP_F1];
    // State 2: the hands + box composition centred in the viewport, scaled down only if it doesn't fit
    const k2 = Math.min(1, (Hd - 80) / (VIS2_BOTTOM - VIS2_TOP));
    const midF = (VIS2_TOP + VIS2_BOTTOM) / 2;
    const s2 = (pt) => [960 + (pt[0] - 960) * k2, Hd / 2 + (pt[1] - midF) * k2];
    const deco2Top = s2([0, F2.deco])[1];
    L = {
      s, vh, Hd, k2,
      box: [s1(F1.box), s2(F2.box)],
      robot: [s1(F1.robot), s2(F2.robot)],
      human: [s1(F1.human), s2(F2.human)],
      deco: [F1.deco - STAGE_TOP_F1, deco2Top],
    };
    // Room after the stage so the pattern (which sits below the viewport while pinned) scrolls into view.
    // The bottom pattern hands over to the tool pixels, so nothing hangs below the fold any more.
    tail.style.height = `${120 * s}px`;   // a short fade from the tinted floor to white
  }

  /* ---------------- faces in 3D ---------------- */
  // Camera move per transition: the box turns to show its depth toward the incoming corner, then settles flat.
  const CAM = { rx: 20, ry: 24, back: 90 };   // degrees / px at the peak of a transition
  const GAP = 60;                             // px between stacked faces while the deck is open
  const ENTRY = { off: 0.95, z: 300, rx: 42, ry: 42, rz: 14 };   // where an incoming face starts (in box sizes / px / deg)

  function setFace(f, { x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, edge = 0, visible = true, opacity = 1 }) {
    f.el.style.visibility = visible ? "visible" : "hidden";
    f.el.setAttribute("aria-hidden", visible && opacity > .5 ? "false" : "true");
    if (!visible) return;
    f.el.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
    f.el.style.opacity = opacity;
    f.edge.style.opacity = edge.toFixed(3);
  }

  /* ---------------- hands make room for incoming cards ---------------- */
  // Per transition: how far each hand moves (design px) and tilts (deg) at the peak.
  // Rotation pivots sit where each arm leaves the screen, so the cut edges stay hidden.
  const YIELD = [
    { robot: { x: -10, y: -26, r: -2.4 }, human: { x: 8,  y: 6,  r: 0.6 } },   // Engineering, bottom left: robot lifts
    { robot: { x: -34, y: -16, r: -1.8 }, human: { x: 6,  y: 2,  r: 0.4 } },   // Marketing, top left: robot pulls back
    { robot: { x: -8,  y: -4,  r: -0.5 }, human: { x: 32, y: 18, r: -1.6 } },  // Automation & AI, bottom right: human steps aside
  ];
  const PIVOT = { robot: [0, 150], human: [1046.5, 190] };
  function handsYield(d) {
    const none = { robot: "", human: "" };
    if (reduce.matches) return none;
    const i = FACE_PH.findIndex(([s0, s1]) => d > s0 && d < s1);
    if (i === -1) return none;
    const [s0, s1] = FACE_PH[i];
    const t = (d - s0) / (s1 - s0);
    // lead slightly: hands start moving as the card appears, return as it lands
    const w = Math.sin(Math.PI * Math.min(1, t * 1.12)) ** 1.2;
    const part = (cfg, [px, py]) =>
      `translate(${(cfg.x * w).toFixed(2)}px, ${(cfg.y * w).toFixed(2)}px) translate(${px}px, ${py}px) rotate(${(cfg.r * w).toFixed(3)}deg) translate(${-px}px, ${-py}px)`;
    return { robot: part(YIELD[i].robot, PIVOT.robot), human: part(YIELD[i].human, PIVOT.human) };
  }

  /* ---------------- the pixels leave as the hands part ---------------- */
  // One after another, each slides off to its nearer side (ease-in: slow start, quick exit).
  const decoKids = Array.from(deco.children);
  function renderPixels(d) {
    const t = clamp01((d - PIX_OUT[0]) / (PIX_OUT[1] - PIX_OUT[0]));
    DECO_OUT.forEach((i, r) => {
      const [x] = DECO[i];
      const DUR = 0.44, step = (1 - DUR) / (DECO_OUT.length - 1);    // last one finishes exactly at the end
      const u = clamp01((t - r * step) / DUR);
      const out = x + 20 < 960 ? -(x + 60) : D - x + 20;
      decoKids[i].style.translate = `${(out * u * u * u).toFixed(1)}px 0`;
      decoKids[i].style.visibility = u >= 1 ? "hidden" : "";
    });
  }

  /* ---------------- refinements: receding services, progress ticks, auto ASCII ---------------- */
  // Four progress ticks under the card (Figma 3588:2312): current one black, the rest 20 %.
  const ticks = document.createElement("div");
  ticks.className = "b30s__ticks"; ticks.setAttribute("aria-hidden", "true");
  ticks.innerHTML = SERVICES.map((_, i) => `<i style="--k:${i}"></i>`).join("");
  world.appendChild(ticks);
  const tickEls = Array.from(ticks.children);
  /* hover the four ticks: they shrink away and a little pill opens in their place, listing every service —
     the current one in ink, the others grey. Click one to go to its card. Move off: the pill closes back
     into a line and the ticks grow back. */
  const swz = document.createElement("div"); swz.className = "b30s__swz";
  swz.innerHTML = `<div class="b30s__sw" role="group" aria-label="Services">${SERVICES.map((sv, i) => `<button type="button" class="b30s__swi" data-i="${i}">${esc(sv.name)}</button>`).join('<i aria-hidden="true"></i>')}</div>`;
  world.appendChild(swz);
  const swItems = [...swz.querySelectorAll(".b30s__swi")];
  let swCur = -1, swOpen = false;
  const restD = (i) => i === 0 ? FACE_PH[0][0] / 2 : (FACE_PH[i - 1][1] + (i < FACE_PH.length ? FACE_PH[i][0] : PIN)) / 2;   // the middle of each service's rest
  const goSvc = (i) => { svcSel = Math.max(0, Math.min(SERVICES.length - 1, i)); svcKick(); };
  {   // click the card for the next service; swipe (or drag) sideways to go either way
    let sx0 = null;
    root.addEventListener("pointerdown", (e) => { sx0 = [e.clientX, e.clientY]; });
    root.addEventListener("pointerup", (e) => {
      if (!sx0 || e.target.closest("a, button")) { sx0 = null; return; }
      const dx = e.clientX - sx0[0], dy = e.clientY - sx0[1]; sx0 = null;
      if (true) return;   // the cube handles clicks and swipes now
      const r = box.getBoundingClientRect();
      if (Math.abs(dx) < 6 && e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom) goSvc((svcSel + 1) % SERVICES.length);
    });
  }
  const swMark = (i) => swItems.forEach((b, k) => { b.classList.toggle("is-on", k === i); b.setAttribute("aria-current", k === i ? "true" : "false"); });
  const swShow = (v) => { if (swOpen === v) return; swOpen = v; swz.classList.toggle("is-open", v); ticks.classList.toggle("is-hid", v); };
  B30.swShow = swShow;   // opened and closed from the real pointer position (see the cube script)

  swItems.forEach((b) => b.addEventListener("click", () => { const i = +b.dataset.i; swMark(i); if (window.B30 && B30.svcGoTo) B30.svcGoTo(i); else goSvc(i); }));   // the popup turns the cube
  let asciiTimer = 0, asciiFace = -1;
  // receded services line up across the screen, behind the card and the hands
  const SLOTS = [{ x: 300, y: -30, r: -6 }, { x: 1420, y: -40, r: 5 }, { x: 560, y: 70, r: 3 }];   // Engineering sits right beside the current card
  let exitY = 0;
  function extras(d, a, cx, cy, k, tt, active, settled, resting, ey) {
    const half = R * k;
    exitY = ey || 0;
    ticks.style.setProperty("--px", (1920 / document.documentElement.clientWidth).toFixed(3));   // 1 screen px inside the scaled world
    ticks.style.transform = `translate3d(${960 - 36.5}px, ${(cy + half + 56).toFixed(1)}px, 0)`;
    ticks.classList.toggle("is-on", a > 0.6 && d < PIN + 0.2);
    const cur = active === -1 ? settled : (tt[active] > 0.5 ? active + 1 : active);
    tickEls.forEach((el, i) => el.classList.toggle("is-cur", i === (window.B30 && B30.svcFace != null ? B30.svcFace : cur)));   // the lines follow the cube
    swz.style.transform = `translate3d(${960 - 70}px, ${(cy + half + 56 + 6 - 22).toFixed(1)}px, 0)`;   // the hover zone is just the ticks; the pill rises onto them
    const swOn = a > 0.6 && d < PIN + 0.2; swz.classList.toggle("is-live", swOn);
    if (!swOn) { swShow(false); }   // opens on hover over the four lines (pointer-driven, in the cube script)
    { const cf = window.B30 && B30.svcFace != null ? B30.svcFace : cur; if (cf !== swCur) { swCur = cf; swMark(cf); } }
    // after ~5 s on a service (scrolling or not), its name decodes in ASCII, and again every 5 s while it stays
    const show = d < PIN + 0.4 ? resting : -1;
    if (show !== asciiFace) {
      clearInterval(asciiTimer); asciiFace = show;
      if (show !== -1 && !reduce.matches) {
        const nm = faces[show].el.querySelector(".svc__name");
        asciiTimer = setInterval(() => { if (window.B30 && B30.scramble) B30.scramble(nm, { duration: 760, stagger: 0.6 }); }, 5000);
      }
    }
  }

  /* ---------------- render ---------------- */
  let lastLanded = -1;
  function render(d) {               // d = scroll distance in viewport heights, relative to the pin point
    if (!L) return;
    const a = clamp01((d + PRE) / (A_END + PRE));
    const e = ioCubic(a), eH = ioCubic(clamp01(a * 1.08 - 0.04)), eD = ioCubic(clamp01(a * 1.1));

    const [b1, b2] = L.box, [r1, r2] = L.robot, [h1, h2] = L.human;
    const kR = lerp(1, L.k2, e), kH = lerp(1, L.k2, eH);
    // exported arms are cut at the frame edges: keep those cuts off-screen
    const rx = Math.min(lerp(r1[0], r2[0], e), 1);
    const hx = Math.max(lerp(h1[0], h2[0], eH), D - HUMAN_W * kH);
    // While a card flies in, the hands ease out of its way (and settle back once it lands).
    const yieldTo = handsYield(d);
    // as the fourth service arrives and settles, the hands drift apart alongside it (parallax)
    const pq = reduce.matches ? 0 : ioCubic(clamp01((d - FACE_PH[2][0]) / (PIN - FACE_PH[2][0])));
    // as Automation & AI scrolls away, the hands travel with the viewport a while (parallax) while the section below arrives
    const exitY = reduce.matches ? 0 : clamp01((d - PIN) / 1.1) * L.vh * (1920 / document.documentElement.clientWidth) * 0.42;
    robot.style.transform = `translate3d(${rx}px, ${lerp(r1[1], r2[1], e)}px, 0) scale(${kR}) ${yieldTo.robot} translate(${(-52 * pq).toFixed(2)}px, ${(-34 * pq + exitY * 0.25).toFixed(2)}px)`;   // left hand barely held: it scrolls on
    human.style.transform = `translate3d(${hx}px, ${lerp(h1[1], h2[1], eH)}px, 0) scale(${kH}) ${yieldTo.human} translate(${(48 * pq).toFixed(2)}px, ${(30 * pq + exitY * 0.7).toFixed(2)}px)`;
    const kD = lerp(1, L.k2, eD);
    deco.style.transform = `translate3d(0, ${L.deco[0]}px, 0)`;

    const cx = lerp(b1[0], b2[0], e), cy = lerp(b1[1], b2[1], e);
    box.style.transform = `translate3d(${cx - R}px, ${cy - R}px, 0) scale(${lerp(40 / BOX, L.k2, e)})`;
    faces[0].inner.forEach(n => (n.style.opacity = smoothstep(0.72, 1, a)));
    box.classList.toggle("is-idle", a < 0.02);

    renderPixels(d);

    // faces
    const tt = FACE_PH.map(([s0, s1]) => clamp01((d - s0) / (s1 - s0)));
    const active = tt.findIndex(t => t > 0 && t < 1);
    const settled = tt.filter(t => t >= 1).length;

    if (reduce.matches || active === -1) cam.style.transform = "none";
    faces.forEach((f, i) => {
      if (reduce.matches) {
        const o = i === 0 ? 1 - tt[0] : i < 3 ? tt[i - 1] * (1 - tt[i]) : tt[2];
        setFace(f, { opacity: o, visible: o > 0.001 });
        return;
      }
      if (active === -1) { setFace(f, { visible: i === settled }); return; }
      const t = tt[active], e = ioCubic(t), open = Math.sin(Math.PI * t), c = CORNERS[active + 1];
      if (i === active + 1) {
        // incoming: flies in from its corner, from in front of the box, and lands on top of the deck
        const u = 1 - e, arc = Math.sin(Math.PI * e) * 60;
        setFace(f, {
          x: c.dx * ENTRY.off * BOX * u, y: c.dy * ENTRY.off * BOX * u, z: ENTRY.z * u + arc,
          rx: -c.dy * ENTRY.rx * u, ry: c.dx * ENTRY.ry * u, rz: -c.dx * c.dy * ENTRY.rz * u,
          edge: open, opacity: smoothstep(0, 0.1, t),
        });
      } else if (i <= active && active - i <= 2) {
        // the deck: faces already shown push back to make room
        const n = active - i;
        setFace(f, { z: -(n + e) * GAP * open, edge: open });
      } else setFace(f, { visible: false });
    });
    // replay the rule draw-in each time a card comes to rest
    const restingFace = a >= 1 && active === -1 ? settled : -1;
    if (restingFace !== lastLanded) {
      faces.forEach(f => f.el.classList.remove("is-landed"));
      if (restingFace !== -1) { void faces[restingFace].el.offsetWidth; faces[restingFace].el.classList.add("is-landed"); }
      lastLanded = restingFace;
    }
    extras(d, a, cx, cy, lerp(40 / BOX, L.k2, e), tt, active, settled, restingFace, exitY);
    if (!reduce.matches && active !== -1) {
      const t = tt[active], open = Math.sin(Math.PI * t), c = CORNERS[active + 1];
      cam.style.transform = `translateZ(${-CAM.back * open}px) rotateX(${c.dy * CAM.rx * open}deg) rotateY(${-c.dx * CAM.ry * open}deg)`;
    }
  }

  /* ---------------- loop ---------------- */
  let target = 0, current = 0, raf = 0;
  /* the cards no longer follow the scroll: a chosen service sets where the flip animation heads (svcD), the scroll
     only drives the hands' arrival */
  let svcSel = 0, svcD = null, svcRaf = 0;
  const R0 = (FACE_PH[0][0]) / 2;
  const vd = (ds) => { window.B30 && B30.svcProgress && B30.svcProgress(ds / R0); window.B30 && B30.svcLanded && B30.svcLanded(ds >= R0 - 0.01); if (ds < R0 - 0.05) { svcSel = 0; svcD = null; } if (ds < R0) return ds; if (svcD === null) svcD = R0; return svcD; };
  function svcTick() {
    svcRaf = 0; const goal = svcSel === 0 ? R0 : (FACE_PH[svcSel - 1][1] + (svcSel < FACE_PH.length ? FACE_PH[svcSel][0] : PIN)) / 2;
    if (svcD === null) svcD = R0;
    svcD += (goal - svcD) * 0.075; if (Math.abs(goal - svcD) < 0.001) svcD = goal;
    render(vd(current));
    if (svcD !== goal) svcRaf = requestAnimationFrame(svcTick);
  }
  function svcKick() { if (!svcRaf) svcRaf = requestAnimationFrame(svcTick); }
  const distance = () => (-track.getBoundingClientRect().top) / L.vh;   // in viewport heights from the pin point
  function tick() {
    current += (target - current) * (reduce.matches ? 1 : 0.14);
    if (Math.abs(target - current) < 0.0005) current = target;
    render(vd(current));
    raf = current !== target ? requestAnimationFrame(tick) : 0;
  }
  function kick() { if (!raf) raf = requestAnimationFrame(tick); }
  const onScroll = () => { if (mobile.matches || !L) return; target = distance(); kick(); };
  const onResize = () => { if (mobile.matches) return; measure(); target = current = distance(); render(vd(current)); };

  // only animate the pixels while they're on screen
  /* ---------------- pointer: hands follow the cursor ---------------- */
  (function pointerFx() {
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const HAND = { robot: { x: 4, y: 5 }, human: { x: 3, y: 4 } };       // max follow, design px (float + follow stays inside the 14px bleed)
    const robotImg = robot.querySelector("img"), humanImg = human.querySelector("img");
    const hand = { x: 0, y: 0, tx: 0, ty: 0 };
    let mx = -1e4, my = -1e4, frame = 0;

    const step = () => {
      frame = 0;
      // hands: ease toward the cursor offset
      hand.x += (hand.tx - hand.x) * 0.08; hand.y += (hand.ty - hand.y) * 0.08;
      robotImg.style.translate = `${(hand.x * HAND.robot.x).toFixed(2)}px ${(hand.y * HAND.robot.y).toFixed(2)}px`;
      humanImg.style.translate = `${(hand.x * HAND.human.x).toFixed(2)}px ${(hand.y * HAND.human.y).toFixed(2)}px`;
      if (Math.abs(hand.tx - hand.x) + Math.abs(hand.ty - hand.y) > 0.002) frame = requestAnimationFrame(step);
    };
    const go = () => { if (!frame) frame = requestAnimationFrame(step); };

    const update = () => {
      const r = stage.getBoundingClientRect();
      const inside = mx >= r.left && mx <= r.right && my >= r.top && my <= r.bottom;
      hand.tx = inside ? ((mx - r.left) / r.width) * 2 - 1 : 0;
      hand.ty = inside ? ((my - r.top) / r.height) * 2 - 1 : 0;
      go();
    };
    addEventListener("pointermove", (e) => {
      if (!fine.matches || reduce.matches || mobile.matches) return;
      mx = e.clientX; my = e.clientY; update();
    }, { passive: true });
    document.addEventListener("pointerleave", () => { mx = my = -1e4; update(); });
    addEventListener("scroll", () => { if (mx > -1e4) update(); }, { passive: true });
  })();

  new IntersectionObserver(([en]) => deco.classList.toggle("is-paused", !en.isIntersecting)).observe(deco);
  new IntersectionObserver(([en]) => root.classList.toggle("is-offscreen", !en.isIntersecting)).observe(root);

  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onResize);
  reduce.addEventListener?.("change", onResize);
  mobile.addEventListener?.("change", onResize);
  onResize();

  // preview hook: ?d=1.2 renders that scroll distance (in viewport heights from the pin point)
  const qd = null;
  if (qd !== null) { removeEventListener("scroll", onScroll); target = current = +qd; render(current); }
})();

/* Services as a cube. While the hands bring it in, the box turns with your scroll and settles on Design as it lands.
   After that the four services are the four sides of one cube: Design in front, Engineering on the left, Marketing at
   the back, Automation & AI on the right. Click the right half (cursor: Next) to turn to the next side, the left half
   (Previous) to turn back, or pick a name in the pill underneath. */
(() => {
  const root = document.querySelector('#services'), cam = root && root.querySelector('.b30s__cam'), stage = root && root.querySelector('.b30s__stage');
  const world = root && root.querySelector('.b30s__world'), box = root && root.querySelector('.b30s__box');
  if (!cam || !stage) return;
  const faces = [...cam.querySelectorAll('.b30s__face')].filter((f) => f.querySelector('.svc__name')).slice(0, 4);
  if (faces.length < 4) return;
  const tilt = document.createElement('div'); tilt.className = 'b30s__cubeT';
  const cube = document.createElement('div'); cube.className = 'b30s__cube';
  const SIDE = [0, -90, 180, 90];                                   // Design front · Engineering left · Marketing back · Automation right
  faces.forEach((f, k) => { const c = f.cloneNode(true); c.removeAttribute('style'); c.querySelectorAll('[style]').forEach((el) => el.removeAttribute('style'));
    c.classList.add('b30s__cside', 's' + k); c.style.transform = `rotateY(${SIDE[k]}deg) translateZ(var(--half))`; cube.appendChild(c); });
  const glow = document.createElement('div'); glow.className = 'b30s__cglow'; glow.setAttribute('aria-hidden', 'true');   // the dark theme's glow, just behind the front of the box
  tilt.appendChild(glow); tilt.appendChild(cube); cam.appendChild(tilt);
  const cur = document.createElement('div'); cur.className = 'b30t__cur b30s__ccur'; cur.setAttribute('aria-hidden', 'true'); cur.innerHTML = '<span>Next</span>'; document.body.appendChild(cur);
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NAMES = faces.map((f) => f.querySelector('.svc__name').textContent.trim());
  let on = false, show = false, k = 0, ang = 0;
  B30.svcFace = null;

  /* ---- the services pill (Figma 4259:3078): four segments joined by narrow necks; a white fill that squeezes through ---- */
  const ticks = root.querySelector('.b30s__ticks');
  const SEG = [135, 139, 127, 136], GAP = 9, H = 44, NK = 11;      // Figma: segment widths, the neck between them, and how far it pinches in
  let segX = [], scaleX = 1;
  const pillPath = (Wt, ins = 0) => {
    const f = Wt / 564, xs = []; let x = 0; SEG.forEach((w, i) => { xs.push([x * f, (x + w) * f]); x += w + GAP; }); if (!ins) segX = xs.map((p) => p.slice());
    const q = ins, H0 = H; let r = 12 - q * 0.9, g = GAP * f;
    const T = q, B = H0 - q, NKq = NK, X0 = q, X1 = xs[xs.length - 1][1] - q;
    // inner shape: the same outline drawn 3px in (necks pinch to the same depth, so the fill fits inside the line)
    if (q) { let d = `M${X0 + r},${T}`;
      xs.forEach(([a, b], i) => { if (i < xs.length - 1) { const nx = xs[i + 1][0], m = (b + nx) / 2;
        d += ` L${b - r},${T} C${b - 3},${T} ${b},${NKq * 0.4 + T * 0.5} ${b + g * 0.15},${NKq * 0.85 + T * 0.6} Q${m},${NKq * 1.25 + T * 0.6} ${nx - g * 0.15},${NKq * 0.85 + T * 0.6} C${nx},${NKq * 0.4 + T * 0.5} ${nx + 3},${T} ${nx + r},${T}`; } });
      d += ` L${X1 - r},${T} Q${X1},${T} ${X1},${T + r} L${X1},${B - r} Q${X1},${B} ${X1 - r},${B}`;
      for (let i = xs.length - 1; i > 0; i--) { const [a] = xs[i], pb = xs[i - 1][1], m = (a + pb) / 2;
        d += ` L${a + r},${B} C${a + 3},${B} ${a},${H0 - NKq * 0.4 - T * 0.5} ${a - g * 0.15},${H0 - NKq * 0.85 - T * 0.6} Q${m},${H0 - NKq * 1.25 - T * 0.6} ${pb + g * 0.15},${H0 - NKq * 0.85 - T * 0.6} C${pb},${H0 - NKq * 0.4 - T * 0.5} ${pb - 3},${B} ${pb - r},${B}`; }
      d += ` L${X0 + r},${B} Q${X0},${B} ${X0},${B - r} L${X0},${T + r} Q${X0},${T} ${X0 + r},${T} Z`;
      return d; }
    r = 12; let d = `M${r},0`;
    xs.forEach(([a, b], i) => { if (i < xs.length - 1) { const nx = xs[i + 1][0], m = (b + nx) / 2;
      d += ` L${b - r},0 C${b - 3},0 ${b},${NK * 0.4} ${b + g * 0.15},${NK * 0.85} Q${m},${NK * 1.25} ${nx - g * 0.15},${NK * 0.85} C${nx},${NK * 0.4} ${nx + 3},0 ${nx + r},0`; } });
    const Wd = xs[xs.length - 1][1];
    d += ` L${Wd - r},0 Q${Wd},0 ${Wd},${r} L${Wd},${H - r} Q${Wd},${H} ${Wd - r},${H}`;
    for (let i = xs.length - 1; i > 0; i--) { const [a] = xs[i], pb = xs[i - 1][1], m = (a + pb) / 2;
      d += ` L${a + r},${H} C${a + 3},${H} ${a},${H - NK * 0.4} ${a - g * 0.15},${H - NK * 0.85} Q${m},${H - NK * 1.25} ${pb + g * 0.15},${H - NK * 0.85} C${pb},${H - NK * 0.4} ${pb - 3},${H} ${pb - r},${H}`; }
    d += ` L${r},${H} Q0,${H} 0,${H - r} L0,${r} Q0,0 ${r},0 Z`;
    return d;
  };
  let pillW = 564;
  const pillOff = true;   // the pill is off for now: the four lines are back
  const fill = ticks && ticks.querySelector('.b30s__pfill');
  // the white fill: the pill's inner shape (inset 3px), shown only between two edges [L, R] that move one after the other
  let L = 0, R = 0, fillAt = 0, busy = false, queue = [], ns = 'http://www.w3.org/2000/svg', clipRect = null, innerPath = null;
  const items = () => (ticks ? [...ticks.querySelectorAll(':scope > i')] : []);
  const setEdges = () => { if (clipRect) { clipRect.setAttribute('x', L.toFixed(2)); clipRect.setAttribute('width', Math.max(0, R - L).toFixed(2)); } };
  const edgesOf = (i) => [segX[i][0], segX[i][1]];
  const ink = (i, v) => { const el = items()[i]; el && el.classList.toggle('is-cur', v); };
  const tween = (from, to, ms) => new Promise((res) => {   // from/to: [L, R]
    const t0 = performance.now(), ez = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const step = (now) => { const t = Math.min(1, (now - t0) / ms), e = reduce ? 1 : ez(t); L = from[0] + (to[0] - from[0]) * e; R = from[1] + (to[1] - from[1]) * e; setEdges(); t < 1 ? requestAnimationFrame(step) : res(); };
    requestAnimationFrame(step);
  });
  async function stepTo(j) {                                         // the fill grows (forward) or draws back (back) one segment at a time
    const i = fillAt, a0 = segX[0][0];
    ink(i, false);
    await tween([a0, segX[i][1]], [a0, segX[j][1]], 520);
    ink(j, true); fillAt = j;
  }
  async function run() { if (busy) return; busy = true; while (queue.length) { const to = queue.shift(); while (fillAt !== to) await stepTo(fillAt + (to > fillAt ? 1 : -1)); } busy = false; }
  function moveFill(to) { if (!fill || !segX.length) return; queue = [to]; run(); }
  const placeFill = () => { if (!segX.length) return; L = segX[0][0]; R = segX[fillAt][1]; setEdges(); items().forEach((el, n) => el.classList.toggle('is-cur', n === fillAt)); };
  function layoutPill() {                                           // the pill exactly as wide as the card, laid out to match
    if (pillOff || !ticks || !box) return;
    const m = /scale\(([\d.]+)\)/.exec(box.style.transform || ''), bs = m ? +m[1] : 1;
    pillW = 564 * bs;
    ticks.style.setProperty('width', pillW + 'px', 'important'); ticks.style.setProperty('margin-left', (73 - pillW) / 2 + 'px', 'important');
    const svg = ticks.querySelector('.b30s__pill'); svg.setAttribute('viewBox', `0 0 ${pillW} ${H}`);
    if (!clipRect) {
      const id = 'b30pc' + Math.random().toString(36).slice(2, 7);
      svg.innerHTML = `<defs><clipPath id="${id}"><rect y="0" height="${H}"/></clipPath></defs><path class="b30s__pin" clip-path="url(#${id})"/><path class="b30s__pout"/>`;
      clipRect = svg.querySelector('rect'); innerPath = svg.querySelector('.b30s__pin');
    }
    svg.querySelector('.b30s__pout').setAttribute('d', pillPath(pillW));
    innerPath.setAttribute('d', pillPath(pillW, 3));
    items().forEach((el, i) => { const [a, b] = segX[i]; el.style.setProperty('left', a + 'px', 'important'); el.style.setProperty('width', (b - a) + 'px', 'important'); });
    placeFill();
  }
  const setFace = (instant) => {
    if (instant) { cube.style.transition = 'none'; cube.style.transform = `translateZ(calc(var(--half) * -1)) rotateY(${ang}deg)`; void cube.offsetWidth; cube.style.transition = ''; }
    else cube.style.transform = `translateZ(calc(var(--half) * -1)) rotateY(${ang}deg)`;
    B30.svcFace = on ? ((k % 4) + 4) % 4 : null;
    if (ticks) [...ticks.querySelectorAll(':scope > i')].forEach((el, i) => el.classList.toggle('is-cur', i === (on ? B30.svcFace : 0)));   // the four lines follow the cube
  };
  /* while the hands bring the box in, it turns with the scroll (a full turn), landing square on Design */
  B30.svcProgress = (p) => { if (on) return; const vis = true; if (vis !== show) { show = vis; root.classList.toggle('is-cube-in', vis); }
    if (!reduce) { ang = -120 * Math.pow(1 - Math.min(1, p), 1.1); setFace(true); } };   // a slow turn as it arrives — a plain white box, no type until it's in
  B30.svcLanded = (v) => { if (v === on) return; on = v; root.classList.toggle('is-cube', on); if (on) { k = 0; ang = 0; layoutPill(); } setFace(true); };
  const turn = (dir) => { if (!on) return; k += dir; ang += 90 * dir; setFace(); };   // next: the left side comes round to the front
  B30.svcGoTo = (i) => { if (!on) return; const c = ((k % 4) + 4) % 4; let d = i - c; if (d > 2) d -= 4; if (d < -2) d += 4; if (d) turn(d); };
  setFace(true);
  addEventListener('resize', () => on && layoutPill());

  /* nudge the scene up so the pill keeps at least 64px from the bottom of the screen */
  function lift() {
    if (!ticks || !world) return; world.style.translate = '';
    const sb = stage.getBoundingClientRect().bottom, pb = ticks.getBoundingClientRect().bottom, need = pb - (sb - 64);
    world.style.translate = need > 0 ? `0 ${-Math.ceil(need)}px` : '';
  }
  const _land = B30.svcLanded; B30.svcLanded = (v) => { _land(v); if (v) requestAnimationFrame(lift); };
  addEventListener('resize', () => requestAnimationFrame(lift));
  const track = root.querySelector('.b30s__track'), handEls = [root.querySelector('[data-el="robot"]'), root.querySelector('[data-el="human"]')], deco = root.querySelector('[data-el="deco"]');
  let praf = 0, lastDown = [0, 0], outStart = null;
  const leave = () => { praf = 0; if (!track) return;
    const r = track.getBoundingClientRect(), vh = innerHeight, x0 = Math.max(0, Math.min(1, (vh - r.bottom) / (vh * 1.1))), x = x0 * x0 * (3 - 2 * x0);   // 0 while held, → 1 as the section scrolls on
    root.classList.toggle('is-leaving', x > 0.02);
    const sc = (world && world.getBoundingClientRect().width / world.offsetWidth) || 1;
    // 1) the hands sink gently as you scroll on …
    const down = [x * 150, x * 260];
    // 2) … and once the heading below comes within ~196px of the right hand, they slide out off the screen
    let out = 0;
    const hd = document.querySelector('.b30sb__h'), hu = handEls[1];
    if (hd && hu && x > 0) {
      const hb = hu.getBoundingClientRect().bottom - (lastDown[1] || 0) + down[1], gap = hd.getBoundingClientRect().top - hb;
      if (gap <= 196 && outStart === null) outStart = scrollY;             // the moment the heading is ~196px away
      if (outStart !== null && scrollY < outStart - 4) outStart = null;     // scrolled back up: the hands come back
      out = 0;   // the hands stay on screen (they only sink)
    }
    lastDown = [down[0], down[1]];
    handEls.forEach((h, i) => h && (h.style.translate = x || out ? `${((i ? 1 : -1) * out * 1300 / sc).toFixed(1)}px ${(down[i] / sc).toFixed(1)}px` : ''));
  };
  addEventListener('scroll', () => { if (!praf) praf = requestAnimationFrame(leave); }, { passive: true }); leave();
  // the services popup over the four lines: make sure it closes whenever the pointer isn't on it (or the section moves on)
  const swz = root.querySelector('.b30s__swz');
  // open over the four lines (only from a real pointer position), close as soon as the pointer is off it
  let pX = -1e4, pY = -1e4, swOpenNow = false;
  const near = (el, m) => { if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 0 && pX >= r.left - m && pX <= r.right + m && pY >= r.top - m && pY <= r.bottom + m; };
  const syncSw = () => {
    if (!swz || !B30.swShow) return;
    const want = on && !root.classList.contains('is-leaving') && (swOpenNow ? (near(swz.querySelector('.b30s__sw'), 6) || near(ticks, 16)) : near(ticks, 14));
    if (want && box) { const m = /scale\(([\d.]+)\)/.exec(box.style.transform || ''), bs = m ? +m[1] : 1, sw = swz.querySelector('.b30s__sw'); sw && sw.style.setProperty('width', (564 * bs).toFixed(1) + 'px'); }   // exactly the card's width
    if (want !== swOpenNow) { swOpenNow = want; B30.swShow(want); }
  };
  addEventListener('pointermove', (e) => { pX = e.clientX; pY = e.clientY; syncSw(); }, { passive: true });
  addEventListener('scroll', syncSw, { passive: true });
  document.addEventListener('pointerleave', () => { pX = pY = -1e4; syncSw(); });

  /* cursor: Next on the right half, Previous on the left; a gentle drift toward the cursor (no tilt, so the type stays crisp) */
  let cx = -200, cy = -200, sh = 0, shT = 0, craf = 0, word = 'Next', tx = -200, ty = -200;
  const ctick = () => { craf = 0; cx += (tx - cx) * 0.25; cy += (ty - cy) * 0.25; sh += (shT - sh) * 0.18;
    cur.style.transform = `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0) scale(${sh.toFixed(3)})`;
    if (Math.abs(shT - sh) > 0.005 || Math.abs(tx - cx) + Math.abs(ty - cy) > 0.3) craf = requestAnimationFrame(ctick); };
  stage.addEventListener('pointermove', (e) => {
    if (!on || e.target.closest('a, button, .b30s__ticks, .b30s__swz')) { shT = 0; if (!craf) craf = requestAnimationFrame(ctick); stage.classList.remove('is-nav'); return; }
    stage.classList.add('is-nav');
    const w = e.clientX > innerWidth / 2 ? 'Next' : 'Previous';
    if (w !== word) { word = w; cur.firstChild.textContent = w; window.B30 && B30.scramble && B30.scramble(cur.firstChild, { duration: 320 }); }
    tx = e.clientX; ty = e.clientY; if (fine && !reduce) shT = 1; if (!craf) craf = requestAnimationFrame(ctick);
    const r = stage.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width * 2 - 1, ny = (e.clientY - r.top) / r.height * 2 - 1;
    if (!reduce) tilt.style.translate = `${(nx * 10).toFixed(1)}px ${(ny * 8).toFixed(1)}px`;
  });
  stage.addEventListener('pointerleave', () => { shT = 0; if (!craf) craf = requestAnimationFrame(ctick); tilt.style.translate = ''; stage.classList.remove('is-nav'); });
  addEventListener('scroll', () => { if (!shT) return; const el = document.elementFromPoint(tx, ty); if (!on || !el || !stage.contains(el) || el.closest('a, button, .b30s__ticks, .b30s__swz')) { shT = 0; if (!craf) craf = requestAnimationFrame(ctick); stage.classList.remove('is-nav'); } }, { passive: true });   // scrolled out of the section: no cursor left behind
  // drag: a swipe left or right turns it exactly one side (next or previous); no free spinning
  let drag = null, dragged = false;
  stage.addEventListener('pointerdown', (e) => { if (!on || e.button !== 0 || e.target.closest('a, button, .b30s__ticks, .b30s__swz')) return; drag = { x: e.clientX }; dragged = false; });
  addEventListener('pointermove', (e) => { if (drag && !dragged && Math.abs(e.clientX - drag.x) > 6) { dragged = true; stage.classList.add('is-drag'); } });
  addEventListener('pointerup', (e) => {
    if (!drag) return; const dx = e.clientX - drag.x, was = dragged; drag = null; stage.classList.remove('is-drag');
    if (was && Math.abs(dx) > 40) turn(dx < 0 ? 1 : -1);
  });
  stage.addEventListener('click', (e) => { if (!on || dragged || e.target.closest('a, button, .b30s__ticks, .b30s__swz')) { dragged = false; return; } turn(e.clientX > innerWidth / 2 ? 1 : -1); });
  let sx0 = null;
  stage.addEventListener('touchstart', (e) => { sx0 = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', (e) => { if (sx0 === null) return; const dx = e.changedTouches[0].clientX - sx0; sx0 = null; if (Math.abs(dx) > 50) turn(dx < 0 ? 1 : -1); });
  addEventListener('keydown', (e) => { if (!on) return; const r = stage.getBoundingClientRect(); if (r.top > innerHeight * 0.5 || r.bottom < innerHeight * 0.5) return;
    if (e.key === 'ArrowRight') turn(1); if (e.key === 'ArrowLeft') turn(-1); });
})();

/* services: the four lines under the card go only once you're 70% of the way through the section */
(() => {
  const sv = document.querySelector('#services'); if (!sv) return;
  let raf = 0;
  const f = () => { raf = 0; const r = sv.getBoundingClientRect(); sv.classList.toggle('is-tickout', -r.top / r.height >= .7); };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(f); }, { passive: true }); f();
})();
