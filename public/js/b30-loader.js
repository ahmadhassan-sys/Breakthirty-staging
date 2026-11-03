/* ==========================================================================
   Breakthirty — Intro loader (Orbit) + pixel page transitions

   INTRO (a fresh visit or a reload):
     A dot globe blooms in the centre. Drag it or scroll to spin it — it keeps its
     momentum. As the page loads, dots peel off the spinning globe into the
     Breakthirty logo. At 100 % a wave of pixels opens from the bottom centre and the
     page settles in behind it. It waits for the page to be ready (window "load",
     fonts, anything handed to B30Loader.waitFor) or CONFIG.gateTimeout at most.

   PAGE TRANSITIONS (moving between pages):
     Going forward (any internal link): the page whites out in a blink, and the next
     page opens in a wave from the BOTTOM — the same wave as the end of the intro.
     Going back (the browser's back button, B30PX.back(), or a link to the page you
     just came from): the page opens in a wave from the TOP instead.
     One wave per page change — only on the page you arrive at.
     Arriving through a transition never replays the intro.

   USAGE — in <head>, as a plain (blocking) script so nothing flashes:
       <script src="/b30-loader.js"><\/script>

   Optional hooks on the page:
       data-b30-stage     the element that scales into place behind the intro reveal (default <main>)
       data-b30-rise      elements that rise ~32px into place, staggered
       data-b30-drop      elements that slide down from above (the nav)
       data-no-pt         on a link: navigate without the pixel transition
       data-b30-layer     after a page change, blocks rise into place layer by layer as the wave reaches
                          them. By default the visible headings, text, images, buttons and cards are picked
                          automatically; mark blocks with data-b30-layer to choose them yourself, or
                          data-no-layer to leave one (and everything inside it) still

   API:
       window.B30_LOADER = false     (set before the script) no intro — transitions still work
       ?loader=0                     no intro for this load
       B30Loader.waitFor(promise)    hold the intro's reveal until promise settles
       B30Loader.skip()              jump to the reveal
       B30PX.go(href, "back"|"forward")   navigate with the transition yourself
       B30PX.back()                  a "Back" button: whites out, then the browser goes back
       B30PX.ready()                 on a heavy page, call it right after the above-the-fold markup + scripts
                                     so the arrival wave starts before the rest of the page has parsed
   Events (window): "b30:loaded" (overlay gone), "b30:released" (scrolling handed back)

   ON THIS SITE (Astro): only the homepage loads this file (src/layouts/BaseLayout.astro, `loader` on
   src/pages/index.astro), first thing in <head>. The intro plays when the homepage is opened fresh or
   reloaded — not when you arrive from another page of the site, and not on the browser's back / forward.
   The page transitions between pages stay the site's own (public/js/core.js): the page sets
   window.B30_PX = false, so this file's transitions (B30PX, its link clicks) are left off.
   Geist Mono is served by the site (assets/fonts), so the Google Fonts link is not added.
   ========================================================================== */
(() => {
  "use strict";

  const CONFIG = {
    // the globe
    sphereTime: 0.7,      // s for the globe to bloom out of a single dot
    sphereR: 1.5,         // globe radius, against the logo's height…
    orbitR: 1.35,         // …times this
    spin: 0.55,           // resting spin (rad / s); a drag or scroll adds to it and eases back
    dot: 1.8,             // a dot's size on the globe (css px)
    cell: 3,              // css px per dot once it's in the logo
    pull: 7,              // the magnet pulling a dot into the logo (no overshoot, no jiggle)
    dotsTime: 3.0,        // s for every dot to leave the globe, once the page is ready
    dotFlight: 1.0,       // s for one dot's flight into the logo
    logoScale: 1.3,       // logo + globe size
    hold: 0.5,            // s the finished logo stays up before the reveal
    gateTimeout: 6000,    // the reveal waits for the page, or this long at most (ms)
    slowCreep: 2.5,       // a slow page: the dots keep leaving the globe, ever more slowly, until the page is ready
                          //   (higher = they get closer to 95 % by the time gateTimeout runs out)
    finishTime: 1.2,      // s for the rest of the dots to land once a slow page is ready
    // the wave (intro reveal + page transitions)
    sweepTime: 1.7,       // intro reveal (s)
    band: 0.2,            // how wide the wave is (share of the diagonal)
    sweepCell: 26,        // css px per white cell on desktop (mobile 18)
    streak: 3.2,          // how far a cell's dot streams away, in cells
    logoBand: 0.3,
    accentShare: 0.12,    // share of the wave's dots in the accent blue
    accent: "#3457BA",
    leaveFade: 140,
    // the arriving page: its blocks rise into place layer by layer as the wave reaches them
    layerShift: 46,       // px each block travels (from below; from above when the wave comes from the top)
    layerTime: 950,       // ms per block
    layerMax: 28,         // most blocks animated on one page       // transition: ms for the page you're leaving to white out (no wave on the way out)
    revealTime: 1.15,     // transition: s for the next page to open
    // the page settling in behind the intro reveal
    enterTime: 1.6,
    enterScale: 1.06,
    landQuiet: 160,
    landMax: 900,
  };

  const LOGO_SVG = `<svg viewBox="0 0 258 44" fill="#000" ><path d="M134.67 0H130.23V7.99H126.16V12.36H130.23V32.33H134.3V36.33H142.8V31.97H134.67V12.36H142.8V7.99H134.67Z"/><path d="M215.4 0H210.96V7.99H206.89V12.36H210.96V32.33H215.02V36.33H223.53V31.97H215.4V12.36H223.53V7.99H215.4Z"/><path d="M167.21 11.99H163.14V7.99H154.63V11.99H150.94V.01H146.5V36.52H150.94V16.35H155V12.36H162.77V16.35H166.83V36.51H171.27V15.99H167.21Z"/><path d="M180.92 7.99H176.48V36.51H180.92Z"/><path d="M180.92 0H176.48V4.37H180.92Z"/><path d="M194.69 11.99H190.99V7.99H186.56V36.51H190.99V16.35H195.06V12.36H203.19V7.99H194.69Z"/><path d="M37.75 15.91H37.64V10.96H33.29V36.52H37.64V22.12C37.64 20.86 37.96 19.62 38.57 18.52 39.2 17.37 40.14 16.42 41.29 15.76 42.44 15.11 43.75 14.78 45.08 14.82 45.61 14.82 46.14 14.85 46.67 14.92V10.69C46.14 10.61 45.61 10.56 45.08 10.54 41.5 10.54 39.06 12.33 37.75 15.91Z"/><path d="M69.21 14.16C67.18 11.61 64.21 10.33 60.32 10.33 57.8 10.33 55.62 10.92 53.76 12.1 51.9 13.29 50.41 14.96 49.46 16.93 48.43 19.05 47.91 21.38 47.95 23.74 47.91 26.1 48.42 28.45 49.43 30.6 50.37 32.57 51.88 34.24 53.76 35.4 55.66 36.56 57.9 37.14 60.48 37.14 63.48 37.14 65.96 36.36 67.91 34.8 69.86 33.23 71.19 31.16 71.89 28.59H67.59C67.23 29.98 66.39 31.2 65.22 32.06 64.04 32.94 62.47 33.39 60.52 33.39 57.86 33.39 55.85 32.58 54.47 30.96 53.09 29.35 52.36 27.29 52.29 24.78H72.25C72.26 20.26 71.25 16.72 69.21 14.16ZM52.41 21.28C52.76 18.99 53.59 17.22 54.9 15.97 56.21 14.71 58.02 14.09 60.32 14.08 62.69 14.08 64.5 14.71 65.73 15.97 66.97 17.22 67.68 18.99 67.87 21.28Z"/><path d="M97.5 33C97.27 32.63 97.16 31.98 97.16 31.04V19.35C97.16 16.47 96.28 14.24 94.53 12.68 92.78 11.11 90.27 10.33 87.02 10.33 83.83 10.33 81.27 11.07 79.35 12.55 77.42 14.03 76.38 16.09 76.24 18.73H80.49C80.66 17.06 81.26 15.84 82.29 15.08 83.32 14.31 84.93 13.93 87.12 13.93 88.96 13.93 90.42 14.27 91.48 14.95 92.54 15.62 93.07 16.78 93.07 18.42 93.07 19.43 92.5 20.13 91.37 20.53 90.24 20.93 88.49 21.3 86.12 21.65 84.27 21.87 82.44 22.25 80.66 22.77 79.19 23.22 77.86 24.04 76.81 25.15 75.75 26.26 75.22 27.77 75.22 29.69 75.22 31.98 76 33.8 77.56 35.14 79.11 36.48 81.2 37.15 83.82 37.15 85.81 37.18 87.77 36.74 89.56 35.87 91.25 35.02 92.46 33.88 93.16 32.45H93.27V32.56C93.27 33.84 93.63 34.87 94.33 35.63 95.05 36.4 96.01 36.78 97.25 36.78 97.93 36.77 98.61 36.68 99.27 36.52V33.49C99.01 33.53 98.74 33.55 98.47 33.54 98.28 33.54 98.08 33.5 97.91 33.4 97.74 33.3 97.6 33.16 97.5 33ZM93.07 26.7C93.07 27.96 92.65 29.19 91.89 30.2 91.07 31.29 89.99 32.17 88.75 32.76 87.49 33.38 86.1 33.7 84.69 33.7 83.1 33.7 81.82 33.34 80.87 32.63 79.91 31.92 79.44 30.9 79.44 29.57 79.44 27.97 80.1 26.83 81.41 26.13 82.72 25.43 84.54 24.93 86.86 24.62 90.33 24.2 92.4 23.61 93.08 22.84Z"/><path d="M123.76 10.96H118.56L107.25 22.59V0H98.59V4.22H102.89V36.52H107.25V27.76L110.96 24.1 120.04 36.52H125.12L113.83 21.18Z"/><path d="M249.66 32.41H251.02V35.92H251.69V32.41H253.04V31.85H249.66Z"/><path d="M257.12 31.85 255.98 34.67 255.84 35.1 255.7 34.67 254.56 31.85H253.65V35.92H254.32L254.3 32.64 254.59 33.49 255.59 35.92H256.06L257.05 33.5 257.35 32.63 257.33 35.92H258V31.85Z"/><path d="M23.39 12.08C21.64 10.91 19.58 10.33 17.2 10.33 15.38 10.29 13.57 10.75 12 11.66 10.58 12.48 9.44 13.71 8.76 15.18H8.65V0H0V4.22H4.31V36.52H8.66V32.6H8.77C9.4 34.03 10.49 35.2 11.88 35.95 13.31 36.74 15.07 37.14 17.16 37.14 19.53 37.14 21.6 36.57 23.37 35.42 25.17 34.25 26.58 32.59 27.43 30.65 28.36 28.47 28.84 26.13 28.84 23.76 28.84 21.4 28.36 19.06 27.43 16.88 26.57 14.93 25.17 13.27 23.39 12.08ZM22.35 30.81C20.97 32.53 18.99 33.39 16.41 33.39 13.82 33.39 11.88 32.53 10.59 30.81 9.3 29.08 8.65 26.73 8.65 23.74 8.65 20.85 9.34 18.52 10.7 16.74 12.06 14.97 14.04 14.08 16.63 14.08 19.14 14.08 21.07 14.96 22.42 16.71 23.76 18.47 24.44 20.81 24.43 23.73 24.43 26.72 23.73 29.08 22.35 30.81Z"/><path d="M251.99 10.04V7.67H247.55V15.67H243.48V23.66H235.73V15.67H231.66V7.67H227.22V16.04H231.29V24.02H235.35V28.02H239.42V35.64H235.35V39.64H227.22V44H235.73V40.01H239.79V36.01H243.86V24.02H247.93V16.04H251.99Z"/></svg>`;

  const CSS = `
html.b30l-on{overscroll-behavior:none}
html.b30l-pending body{visibility:hidden}
html.b30l-on .b30l{visibility:visible}
html:not(.b30l-on) .b30l{display:none!important}
html.b30t-hold::after{content:"";position:fixed;inset:0;background:#fff;z-index:2147483400}
.b30l{position:fixed;inset:0;z-index:2147483000;background:#fff;touch-action:none;-webkit-user-select:none;user-select:none;cursor:grab;
  font-family:"Geist Mono",ui-monospace,"SFMono-Regular",Menlo,monospace;color:#000}
.b30l.is-grabbing{cursor:grabbing}
.b30l.is-revealing{background:transparent;pointer-events:none}
.b30l.is-done{display:none}
.b30l__cv{position:absolute;inset:0;width:100%;height:100%;display:block}
.b30l__sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.b30l__skip{position:absolute;right:20px;bottom:20px;height:32px;padding:0 12px;border:1px solid #000;background:#fff;color:#000;font:inherit;
  font-size:12px;letter-spacing:.1em;text-transform:uppercase;opacity:0;pointer-events:none}
.b30l__skip:focus-visible{opacity:1;pointer-events:auto;outline:2px solid #3457ba;outline-offset:2px}
.b30l__logo{position:absolute;width:258px;height:44px;left:-9999px;top:0;visibility:hidden;pointer-events:none}
html .b30-ptx{position:fixed;inset:0;width:100%;height:100%;z-index:2147483500;pointer-events:none;display:block}
html .b30-ptx.is-blocking{pointer-events:auto}`;

  const html = document.documentElement;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
  const easeInCubic = (x) => x * x * x;
  const easeInOutSine = (x) => -(Math.cos(Math.PI * x) - 1) / 2;
  const smoothstep = (a, b, x) => { const k = clamp((x - a) / (b - a)); return k * k * (3 - 2 * k); };
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ss = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} },
    del(k) { try { sessionStorage.removeItem(k); } catch (e) {} },
  };

  const st = document.createElement("style"); st.id = "b30l-css"; st.textContent = CSS;
  document.head.appendChild(st);
  // (Geist Mono comes from the site's own @font-face — no Google Fonts request)
  const PX_ON = window.B30_PX !== false;          // false: the page transitions below are left to the site

  /* ==========================================================================
     Where did we come from? — decides intro vs transition, and the wave's direction
     ========================================================================== */
  const HIST = "b30-hist", DIR = "b30-dir";
  const key = (u) => { const x = new URL(u, location.href); return x.pathname.replace(/\/index\.html?$/, "/") + x.search; };
  const readHist = () => { try { return JSON.parse(ss.get(HIST) || "[]"); } catch (e) { return []; } };
  const here = key(location.href);
  function settleHistory(dir) {                // keep a small trail of pages, so "back" can be recognised
    const h = readHist();
    if (dir === "back" && h.length >= 2 && h[h.length - 2] === here) h.pop();
    else if (h[h.length - 1] !== here) h.push(here);
    ss.set(HIST, JSON.stringify(h.slice(-30)));
  }
  const navType = (() => { try { return performance.getEntriesByType("navigation")[0].type; } catch (e) { return ""; } })();
  let arriving = null;                          // "forward" | "back" | null (a fresh visit)
  const pend = ss.get(DIR); ss.del(DIR);
  if (pend === "forward" || pend === "back") arriving = pend;
  else if (navType === "back_forward") {        // the browser's own back / forward buttons
    const h = readHist();
    arriving = h.length >= 2 && h[h.length - 2] === here ? "back" : h[h.length - 1] === here ? "back" : "forward";
  }
  settleHistory(arriving);
  if (arriving && PX_ON) html.classList.add("b30t-hold");   // white until the arrival wave takes over

  /* ==========================================================================
     The wave: white cells that open (or close) from the bottom centre — or the top
     ========================================================================== */
  function waveCells(vw, vh, fromTop) {
    const S = vw < 760 ? 18 : CONFIG.sweepCell;
    const cols = Math.ceil(vw / S), rows = Math.ceil(vh / S);
    const ox = (vw - cols * S) / 2, oy = (vh - rows * S) / 2;
    const qx = vw / 2, qy = fromTop ? -S : vh + S, far = Math.hypot(vw / 2, vh + S);
    const cells = [];
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
      const x = ox + (i + 0.5) * S, y = oy + (j + 0.5) * S;
      let dx = x - qx, dy = y - qy; const n = Math.hypot(dx, dy) || 1; dx /= n; dy /= n;
      cells.push({ x, y, S, d: n / far + (Math.random() - 0.5) * 0.07, dx, dy,
        run: S * CONFIG.streak * (0.6 + Math.random() * 0.8), blue: Math.random() < CONFIG.accentShare });
    }
    return { cells, qx, qy, far, vw, vh };
  }
  // the white screen with the wave front at `front`. The white clears as one smooth, soft-edged
  // circle growing from the source — no squares — and dots stream away from the front as it passes.
  function drawWave(g, W, front, band) {
    const { cells, qx, qy, far, vw, vh } = W;
    g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
    g.fillStyle = "#fff"; g.fillRect(0, 0, vw, vh);
    const r1 = front * far, r0 = Math.max(0, (front - band) * far);
    if (r1 > 0) {
      g.globalCompositeOperation = "destination-out";
      const grad = g.createRadialGradient(qx, qy, r0, qx, qy, Math.max(r1, r0 + 1));
      grad.addColorStop(0, "rgba(0,0,0,1)"); grad.addColorStop(0.5, "rgba(0,0,0,0.6)"); grad.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = grad;
      g.beginPath(); g.arc(qx, qy, Math.max(r1, r0 + 1), 0, Math.PI * 2); g.fill();
      g.globalCompositeOperation = "source-over";
    }
    for (const c of cells) {                    // the dots, streaming away from the source
      const k = (front - c.d) / band;
      if (k <= 0 || k >= 1) continue;
      const e = easeOutCubic(k), sz = 2.4 * (1 - 0.5 * k) + 0.6;
      g.globalAlpha = Math.sin(Math.PI * k) * 0.9;
      g.fillStyle = c.blue ? CONFIG.accent : "#000";
      g.fillRect(c.x + c.dx * c.run * e - sz / 2, c.y + c.dy * c.run * e - sz / 2, sz, sz);
    }
    g.globalAlpha = 1;
  }

  /* ==========================================================================
     Page transitions
     ========================================================================== */
  const PX = !PX_ON ? null : (() => {
    function layer(fromTop) {
      const cv = document.createElement("canvas"); cv.className = "b30-ptx"; cv.setAttribute("aria-hidden", "true");
      const dpr = Math.min(2, devicePixelRatio || 1), vw = innerWidth, vh = innerHeight;
      cv.width = Math.ceil(vw * dpr); cv.height = Math.ceil(vh * dpr);
      html.appendChild(cv);
      const g = cv.getContext("2d"); g.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { cv, g, vw, vh, ...waveCells(vw, vh, fromTop) };
    }
    // open: the front runs out from the source (white clears) · close: the same, backwards (white builds up)
    function play(Ly, secs, open, done) {
      const band = CONFIG.band, end = 1 + band + 0.05, t0 = performance.now();
      (function step(now) {
        const t = clamp((now - t0) / 1000 / secs), e = easeInOutSine(t);
        Ly.g.clearRect(0, 0, Ly.vw, Ly.vh);
        drawWave(Ly.g, Ly, open ? -band + (end + band) * e : end - (end + band) * e, band);
        if (t < 1) requestAnimationFrame(step); else done && done();
      })(t0);
    }
    /* the arriving page, layer by layer: pick the visible blocks (or the ones marked data-b30-layer),
       and let each one rise into place at the moment the wave front reaches it */
    function pickLayers() {
      const marked = [...document.querySelectorAll("[data-b30-layer]")];
      const sel = "header, nav, h1, h2, h3, h4, h5, p, li, blockquote, figure, picture, img, video, canvas, svg, button, " +
        "a[class*='btn'], a[class*='button'], [class*='card'], [class*='tag'], [class*='badge'], label, small, span, [data-b30-layer]";
      const pool = marked.length ? marked : [...document.querySelectorAll(sel)];
      const vw = innerWidth, vh = innerHeight, picked = [];
      for (const el of pool) {
        if (picked.length >= CONFIG.layerMax) break;
        if (el.closest(".b30-ptx, [data-b30-loader], [data-no-layer]")) continue;
        if (picked.some((p) => p.contains(el))) continue;              // its parent already moves as one layer
        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4 || r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw) continue;
        if (!marked.length && r.width * r.height > vw * vh * 0.7) continue;   // full-screen backdrops stay put
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "contents" || +cs.opacity === 0) continue;
        picked.push(el);
      }
      return picked;
    }
    function layersIn(W, secs, fromTop) {
      if (REDUCED || !Element.prototype.animate) return;
      const els = pickLayers(), shift = (fromTop ? -1 : 1) * CONFIG.layerShift;
      els.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const cx = clamp(r.left + r.width / 2, 0, W.vw), cy = clamp(fromTop ? r.top : r.bottom, 0, W.vh);
        const reach = clamp(Math.hypot(cx - W.qx, cy - W.qy) / W.far);   // when the wave front gets there (0..1)
        const delay = 60 + reach * secs * 1000 * 0.62 + (i % 3) * 25;
        el.animate([
          { translate: `0 ${shift}px`, opacity: 0 },
          { translate: "0 0", opacity: 1 },
        ], { duration: CONFIG.layerTime, delay, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" });
      });
    }

    let busy = false;
    function go(href, dir, viaHistory) {
      if (busy) return; busy = true;
      if (!dir) { const h = readHist(); dir = h.length >= 2 && h[h.length - 2] === key(href) ? "back" : "forward"; }
      ss.set(DIR, dir); ss.set("b30-pt", "__px");      // "__px": the homepage's own scripts know to skip their intro too
      window.B30 && B30.lenis && B30.lenis.stop();
      if (REDUCED) { location.href = href; return; }
      // leaving: no wave here — the page simply whites out (a quick fade), so the only wave you see
      // is the one that opens the next page (from the bottom, or from the top when going back)
      const Ly = layer(dir === "back"); Ly.cv.classList.add("is-blocking");
      Ly.g.clearRect(0, 0, Ly.vw, Ly.vh); Ly.g.fillStyle = "#fff"; Ly.g.fillRect(0, 0, Ly.vw, Ly.vh);
      // the next page is requested at once — the white-out plays while it loads, not before
      Ly.cv.animate([{ opacity: 0 }, { opacity: 1 }], { duration: CONFIG.leaveFade, easing: "ease-out", fill: "forwards" });
      requestAnimationFrame(() => { viaHistory ? history.back() : (location.href = href); });
    }
    // a "Back" button: whites out, then the browser goes back (the page we return to opens from above)
    function back() {
      const h = readHist(), prev = h.length >= 2 ? h[h.length - 2] : null;
      if (history.length > 1) go(prev || location.href, "back", true);
      else if (prev) go(prev, "back");
    }
    let arrived = false;
    function arrive(dir = arriving || "forward") {
      if (arrived) return; arrived = true;
      const Ly = layer(dir === "back");               // back: it opens from the top · forward: from the bottom
      Ly.g.clearRect(0, 0, Ly.vw, Ly.vh); drawWave(Ly.g, Ly, -CONFIG.band - 0.1, CONFIG.band);
      html.classList.remove("b30t-hold", "pt-px");
      ss.del("b30-pt");
      let go = false;
      const start = () => {
        if (go) return; go = true;
        layersIn(Ly, CONFIG.revealTime, dir === "back");             // set their starting pose before the wave opens
        requestAnimationFrame(() => play(Ly, REDUCED ? 0.01 : CONFIG.revealTime, true, () => { Ly.cv.remove(); arrived = false; }));
      };
      startNow = start;
      document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", start, { once: true }) : start();
    }
    // a heavy page can open sooner: call B30PX.ready() right after its above-the-fold markup + scripts
    let startNow = null;
    function ready() { startNow && startNow(); }

    // warm the next page while the cursor is on its way to the link (hover, focus, touch)
    const warmed = new Set();
    function warm(e) {
      const a = e.target.closest && e.target.closest("a[href]");
      if (!a || a.hasAttribute("data-no-pt") || a.hasAttribute("download")) return;
      let u; try { u = new URL(a.href, location.href); } catch (_) { return; }
      if (u.origin !== location.origin || !/^https?:$/.test(u.protocol) || u.pathname === location.pathname) return;
      const k = u.pathname + u.search; if (warmed.has(k)) return; warmed.add(k);
      const l = document.createElement("link"); l.rel = "prefetch"; l.href = u.href; document.head.appendChild(l);
    }
    addEventListener("pointerover", warm, { passive: true });
    addEventListener("focusin", warm);
    addEventListener("touchstart", warm, { passive: true });
    // every internal link — unless something else on the page already handled the click
    addEventListener("click", (e) => {
      if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest && e.target.closest("a[href]");
      if (!a || a.hasAttribute("download") || a.hasAttribute("data-no-pt") || (a.target && a.target !== "_self")) return;
      let u; try { u = new URL(a.href, location.href); } catch (_) { return; }
      if (u.origin !== location.origin || !/^https?:|^file:/.test(u.protocol)) return;
      if (u.pathname === location.pathname && u.search === location.search && u.hash) return;   // same-page anchor
      e.preventDefault(); go(u.href);
    });
    // coming back through the browser's page cache: nothing reloads, so play the arrival here
    addEventListener("pageshow", (e) => {
      if (!e.persisted) return;
      busy = false;
      document.querySelectorAll(".b30-ptx").forEach((c) => c.remove());
      const h = readHist(), dir = h.length >= 2 && h[h.length - 2] === here ? "back" : "forward";
      settleHistory(dir); arrived = false; arrive(dir);
      window.B30 && B30.lenis && B30.lenis.start();
    });
    return { go, back, arrive, ready, config: CONFIG };
  })();
  if (PX) { window.B30PX = PX; if (arriving) PX.arrive(arriving); }

  /* ==========================================================================
     The intro loader — only on a fresh visit
     ========================================================================== */
  const qs = new URLSearchParams(location.search);
  const off = arriving || window.B30_LOADER === false || qs.get("loader") === "0";
  if (off) {
    html.classList.remove("b30l-on", "b30l-pending");
    window.B30Loader = { off: true, waitFor() {}, skip() {}, config: CONFIG };
    return;
  }
  html.classList.add("b30l-on", "b30l-pending");
  const bail = setTimeout(() => html.classList.remove("b30l-pending"), CONFIG.gateTimeout + 4000);   // never leave the page hidden

  const waits = [];
  let api = null, pendingSkip = false;
  window.B30Loader = {
    waitFor(p) { waits.push(Promise.resolve(p).catch(() => {})); },
    skip() { api ? api.skip() : (pendingSkip = true); },
    get phase() { return api ? api.phase : "boot"; },
    config: CONFIG,
  };

  function mount() {
    const ov = document.createElement("div");
    ov.className = "b30l"; ov.setAttribute("data-b30-loader", "");
    ov.setAttribute("role", "dialog"); ov.setAttribute("aria-label", "Breakthirty is loading");
    ov.innerHTML =
      '<canvas class="b30l__cv" aria-hidden="true"></canvas>' +
      '<span class="b30l__sr" role="status" aria-live="polite">Loading Breakthirty</span>' +
      '<button class="b30l__skip" type="button">Skip intro</button>' +
      '<div class="b30l__logo" aria-hidden="true">' + LOGO_SVG + "</div>";
    document.body.prepend(ov);
    return ov;
  }

  function initLoader(ov) {
    const stage = document.querySelector("[data-b30-stage]") || document.querySelector("main");
    const rise = [...document.querySelectorAll("[data-b30-rise]")];
    const drop = [...document.querySelectorAll("[data-b30-drop]")];
    const srcSvg = ov.querySelector(".b30l__logo svg");
    const cv = ov.querySelector(".b30l__cv"), ctx = cv.getContext("2d");
    const srEl = ov.querySelector(".b30l__sr"), skipEl = ov.querySelector(".b30l__skip");
    const reduced = REDUCED;

    let phase = "build";                      // build → hold → reveal → done
    let clock = 0, last = performance.now(), raf = 0;
    let ready = false, holdAt = 0, tb = 0, shown = 0;
    let locked = true, landing = false, landAt = 0, lastInput = 0;
    let vw = 0, vh = 0, dpr = 1, posed = false;
    let L = null, skipped = false, cells = [];
    const dropH = drop.map((el) => el.offsetHeight || 80);

    /* ---------- the globe's controls: drag, scroll, momentum ---------- */
    const P = { x: innerWidth / 2, y: innerHeight / 2, has: false, down: false };
    const O = { yaw: 0, pitch: 0.38, yawV: CONFIG.spin, pitchV: 0, used: false, hintA: 0 };
    addEventListener("pointermove", (e) => {
      const dx = e.clientX - P.x, dy = e.clientY - P.y;
      P.x = e.clientX; P.y = e.clientY; P.has = true;
      if (P.down && phase !== "done") {
        O.yaw += dx * 0.009; O.pitch = clamp(O.pitch + dy * 0.007, -1.2, 1.2);
        O.yawV = lerp(O.yawV, dx * 0.009 * 60, 0.5); O.pitchV = lerp(O.pitchV, dy * 0.007 * 60, 0.5); O.used = true;
      }
    }, { passive: true });
    ov.addEventListener("pointerdown", (e) => {
      P.down = true; P.x = e.clientX; P.y = e.clientY; P.has = true; ov.classList.add("is-grabbing");
      try { ov.setPointerCapture(e.pointerId); } catch (_) {}
    });
    const up = () => { P.down = false; ov.classList.remove("is-grabbing"); };
    addEventListener("pointerup", up); addEventListener("pointercancel", up);
    ov.addEventListener("pointerleave", () => { if (!P.down) P.has = false; });
    function orbitStep(dt) {
      if (P.down) return;
      O.yawV += (CONFIG.spin - O.yawV) * (1 - Math.exp(-1.2 * dt));
      O.pitchV *= Math.exp(-3 * dt);
      const rest = 0.38 + (P.has ? (P.y / vh - 0.5) * 0.5 : 0);
      O.pitch += O.pitchV * dt; O.pitch += (rest - O.pitch) * (1 - Math.exp(-1.5 * dt));
      O.yaw += O.yawV * dt;
    }

    /* ---------- asset gate: never reveal before the page is ready ---------- */
    const loaded = document.readyState === "complete" ? Promise.resolve()
      : new Promise((r) => addEventListener("load", r, { once: true }));
    Promise.all([loaded, document.fonts ? document.fonts.ready : null])
      .then(() => Promise.all(waits))
      .then(() => { ready = true; });
    setTimeout(() => { ready = true; }, CONFIG.gateTimeout);

    let readyAt = -1, fromShown = 0;
    function updateProgress(dt) {
      const t = clock - CONFIG.sphereTime * 0.8;
      let goal = skipped ? 1 : clamp(t / CONFIG.dotsTime);
      if (!ready) {
        // still loading: instead of rushing to 95 % and stalling there, the dots keep coming, more and more slowly
        const tau = CONFIG.gateTimeout / 1000 / CONFIG.slowCreep;
        goal = Math.min(goal, 0.95 * (1 - Math.exp(-Math.max(0, t) / tau)));
      } else if (!skipped) {
        // ready: a slow page's remaining dots land at an even pace (a fast page keeps its normal pace)
        if (readyAt < 0) { readyAt = clock; fromShown = shown; }
        goal = Math.min(goal, fromShown + (1 - fromShown) * clamp((clock - readyAt) / CONFIG.finishTime));
      }
      shown = reduced ? goal : shown + (goal - shown) * (1 - Math.exp(-10 * dt));
      if (goal - shown < 0.001) shown = goal;
    }

    /* ---------- canvas + logo ---------- */
    function size() {
      vw = ov.clientWidth || innerWidth; vh = ov.clientHeight || innerHeight;
      dpr = Math.min(devicePixelRatio || 1, 2);
      cv.width = Math.round(vw * dpr); cv.height = Math.round(vh * dpr);
    }

    let buildId = 0;
    async function buildLogo() {
      const id = ++buildId, S = CONFIG.logoScale;
      const w0 = Math.round(S * (vw < 760 ? Math.min(vw * 0.62, vw * 0.8 / S) : clamp(vw * 0.21, 220, 420)));
      const pw = Math.round(w0 * dpr), ph = Math.round((w0 * 44 / 258) * dpr);
      const X0 = Math.round((vw * dpr - pw) / 2), Y0 = Math.round((vh * dpr - ph) / 2);
      const clone = srcSvg.cloneNode(true);
      clone.setAttribute("width", pw); clone.setAttribute("height", ph);
      clone.setAttribute("xmlns", "http://www.w3.org/2000/svg"); clone.setAttribute("fill", "#000");
      const img = new Image();
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(clone));
      try { await img.decode(); } catch (_) { return; }
      if (id !== buildId) return;
      const ink = document.createElement("canvas"); ink.width = pw; ink.height = ph;
      const ic = ink.getContext("2d", { willReadFrequently: true });
      ic.drawImage(img, 0, 0, pw, ph);
      const data = ic.getImageData(0, 0, pw, ph).data;
      const cs = Math.max(2, Math.round(CONFIG.cell * dpr)), dots = [];
      for (let sy = 0; sy < ph; sy += cs) for (let sx = 0; sx < pw; sx += cs) {
        const tw = Math.min(cs, pw - sx), th = Math.min(cs, ph - sy);
        let hit = false;
        for (let yy = sy; yy < sy + th && !hit; yy++)
          for (let xx = sx; xx < sx + tw; xx++) if (data[(yy * pw + xx) * 4 + 3] > 8) { hit = true; break; }
        if (!hit) continue;
        const u = Math.random() * 2 - 1, a = Math.random() * Math.PI * 2, r = Math.sqrt(1 - u * u);
        dots.push({
          sx, sy, tw, th, tx: X0 + sx + tw / 2, ty: Y0 + sy + th / 2,
          rank: 0.72 * Math.random() + 0.28 * ((sx + tw / 2) / pw),   // when it leaves the globe (loosely left → right)
          on: false, lt: 0, ux: r * Math.cos(a), uy: u, uz: r * Math.sin(a), x0: 0, y0: 0, px: 0, py: 0,
        });
      }
      L = { X0, Y0, pw, ph, cs, ink, dots, done: reduced || skipped || (L ? L.done : false),
        R: Math.min(ph * CONFIG.sphereR, Math.min(vw, vh) * dpr * 0.16), x: X0 / dpr, y: Y0 / dpr, w: pw / dpr, h: ph / dpr };
    }

    function pullLeft(tau) {
      const w = CONFIG.pull, raw = (x) => (1 + w * x) * Math.exp(-w * x), end = raw(1);
      return tau >= 1 ? 0 : (raw(Math.max(0, tau)) - end) / (1 - end);
    }

    /* ---------- drawing: the globe emptying into the logo ---------- */
    function drawBuild() {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);
      if (!L) return;
      if (L.done) { ctx.drawImage(L.ink, L.X0, L.Y0); return; }
      let left = 0; for (const p of L.dots) if (!p.on) left++;
      const grow = easeOutCubic(clamp(clock / CONFIG.sphereTime));
      const rk = 0.3 + 0.7 * Math.sqrt(left / L.dots.length);           // the globe shrinks as it empties
      const R = L.R * grow * rk * CONFIG.orbitR, cx = cv.width / 2, cy = cv.height / 2;
      const ca = Math.cos(O.yaw), sa = Math.sin(O.yaw), ct = Math.cos(O.pitch), stt = Math.sin(O.pitch);
      const dot = CONFIG.dot * dpr;
      let flying = 0;
      ctx.fillStyle = "#000";
      for (const p of L.dots) {
        if (!p.on) {
          const x1 = p.ux * ca + p.uz * sa, z1 = -p.ux * sa + p.uz * ca;
          const y2 = p.uy * ct - z1 * stt, z2 = p.uy * stt + z1 * ct, k = 3.2 / (3.2 - z2), dpt = (z2 + 1) / 2;
          p.px = cx + x1 * R * k; p.py = cy + y2 * R * k;
          if (shown >= p.rank && clock > CONFIG.sphereTime * 0.8) { p.on = true; p.lt = clock; p.x0 = p.px; p.y0 = p.py; }
          else {
            const sz = dot * (0.7 + 0.55 * dpt) * Math.max(0.35, grow);
            ctx.globalAlpha = (0.3 + 0.7 * dpt) * Math.min(1, grow * 1.5);
            ctx.fillRect(p.px - sz / 2, p.py - sz / 2, sz, sz);
            continue;
          }
        }
        const tau = (clock - p.lt) / CONFIG.dotFlight;
        if (tau >= 1) { ctx.globalAlpha = 1; ctx.drawImage(L.ink, p.sx, p.sy, p.tw, p.th, L.X0 + p.sx, L.Y0 + p.sy, p.tw, p.th); continue; }
        flying++;
        const m = pullLeft(tau), kk = lerp(Math.min(1, dot / L.cs), 1, smoothstep(0, 0.35, tau));
        const x = p.tx + (p.x0 - p.tx) * m, y = p.ty + (p.y0 - p.ty) * m, w = p.tw * kk, h = p.th * kk;
        ctx.globalAlpha = lerp(0.6, 1, smoothstep(0, 0.4, tau));
        ctx.drawImage(L.ink, p.sx, p.sy, p.tw, p.th, Math.round(x - w / 2), Math.round(y - h / 2), w, h);
      }
      ctx.globalAlpha = 1;
      if (shown >= 1 && !flying && !left) L.done = true;
    }
    function drawHint() {
      const want = phase === "build" && clock > CONFIG.sphereTime ? 1 : 0;
      O.hintA += (want - O.hintA) * 0.08;
      if (O.hintA < 0.01) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = '400 11px "Geist Mono", ui-monospace, Menlo, monospace'; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#000"; ctx.globalAlpha = 0.45 * O.hintA;
      ctx.fillText((O.used ? "" : "DRAG OR SCROLL TO SPIN  ·  ") + Math.round(shown * 100) + "%", vw / 2, vh - Math.max(28, vh * 0.075));
      ctx.globalAlpha = 1; ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    /* ---------- drawing: the reveal (the wave from the bottom centre) ---------- */
    let far = 1, Q = { x: 0, y: 0 }, WV = null;
    function prepSweep() {
      const W = waveCells(vw, vh, false); WV = W; cells = W.cells; far = W.far; Q = { x: W.qx, y: W.qy };
      if (!L) return;
      const QX = Q.x * dpr, QY = Q.y * dpr, diag = Math.hypot(vw, vh) * dpr;
      for (const p of L.dots) {
        let dx = p.tx - QX, dy = p.ty - QY; const n = Math.hypot(dx, dy) || 1; dx /= n; dy /= n;
        p.d = n / (far * dpr) + (Math.random() - 0.5) * 0.05; p.dx = dx; p.dy = dy; p.run = diag * (0.12 + Math.random() * 0.22);
      }
    }
    function drawSweep() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, vw, vh);
      const band = CONFIG.band, end = 1 + Math.max(band, CONFIG.logoBand) + 0.05;
      const front = lerp(-band, end, easeInOutSine(clamp(tb / CONFIG.sweepTime)));
      drawWave(ctx, WV, front, band);
      if (L) {                                   // the logo's dots leave the same way, each when the wave reaches it
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        for (const p of L.dots) {
          const k = (front - p.d) / CONFIG.logoBand;
          if (k >= 1) continue;
          const x = L.X0 + p.sx, y = L.Y0 + p.sy;
          if (k <= 0) { ctx.globalAlpha = 1; ctx.drawImage(L.ink, p.sx, p.sy, p.tw, p.th, x, y, p.tw, p.th); continue; }
          const e = easeInCubic(k) * 0.85 + k * 0.15, s = 1 - 0.55 * k;
          ctx.globalAlpha = 1 - smoothstep(0.35, 1, k);
          ctx.drawImage(L.ink, p.sx, p.sy, p.tw, p.th,
            x + p.tw / 2 + p.dx * p.run * e - (p.tw * s) / 2, y + p.th / 2 + p.dy * p.run * e - (p.th * s) / 2, p.tw * s, p.th * s);
        }
        ctx.globalAlpha = 1;
      }
      return front < end;
    }
    function drawFade() {                        // reduced motion: the white simply fades
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, vw, vh);
      const a = 1 - clamp(tb / 0.4);
      if (a <= 0) return false;
      ctx.globalAlpha = a; ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, vw, vh);
      if (L) ctx.drawImage(L.ink, L.x, L.y, L.w, L.h);
      ctx.globalAlpha = 1;
      return true;
    }

    /* ---------- the page settles in behind the reveal ---------- */
    const enterAt = () => CONFIG.sweepTime * 0.12;
    function setPage(te) {
      if (reduced) te = 1;
      const ps = easeOutCubic(clamp(te));
      if (stage) {
        if (ps < 1) {
          stage.style.transformOrigin = `50% ${(scrollY + innerHeight / 2 - stage.offsetTop).toFixed(0)}px`;
          stage.style.transform = `scale(${lerp(CONFIG.enterScale, 1, ps).toFixed(5)})`;
        } else { stage.style.transform = ""; stage.style.transformOrigin = ""; }
      }
      rise.forEach((el, i) => {
        const s = easeOutCubic(clamp((te - 0.1 - Math.min(i, 4) * 0.05) / 0.8));
        el.style.transform = s < 1 ? `translate3d(0, ${(32 * (1 - s)).toFixed(2)}px, 0)` : "";
      });
      const ns = easeOutCubic(clamp((te - 0.3) / 0.7));
      drop.forEach((el, i) => { el.style.transform = ns < 1 ? `translate3d(0, ${(-(dropH[i] + 2) * (1 - ns)).toFixed(2)}px, 0)` : ""; });
    }

    /* ---------- input: the page stays put while the loader runs (scroll spins the globe) ---------- */
    const landed = (e) => {
      const now = performance.now();
      if (now - lastInput > CONFIG.landQuiet || now - landAt > CONFIG.landMax) { release(); return true; }
      lastInput = now; e.preventDefault(); return false;
    };
    const onWheel = (e) => {
      if (landing) { landed(e); return; } if (!locked) return; lastInput = performance.now(); e.preventDefault();
      if (phase === "build") { O.yawV = clamp(O.yawV + e.deltaY * 0.012, -14, 14); O.used = true; }
    };
    const onTouchMove = (e) => { if (landing) { landed(e); return; } if (!locked) return; lastInput = performance.now(); e.preventDefault(); };
    const onKey = (e) => {
      if (landing) { landed(e); return; }
      if (!locked) return;
      if (e.target === skipEl && (e.key === "Enter" || e.key === " ")) return;
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", " ", "End", "Home"].includes(e.key)) e.preventDefault();
    };
    const onScroll = () => { if (locked && (scrollY || pageYOffset)) scrollTo(0, 0); };
    const onResize = () => { size(); if (phase === "build" || phase === "hold") buildLogo(); };
    addEventListener("wheel", onWheel, { passive: false });
    addEventListener("touchmove", onTouchMove, { passive: false });
    addEventListener("keydown", onKey);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    skipEl.addEventListener("click", () => { ready = true; skipped = true; shown = 1; if (L) L.done = true; holdAt = -1e9; });

    /* ---------- the loop ---------- */
    function startReveal() {
      phase = "reveal"; tb = 0;
      prepSweep();
      ov.classList.add("is-revealing");
      if (stage) stage.style.willChange = "transform";
    }
    function finish() {
      phase = "done"; locked = false;
      cancelAnimationFrame(raf);
      [stage, ...rise, ...drop].forEach((el) => el && (el.style.transform = ""));
      if (stage) { stage.style.transformOrigin = ""; stage.style.willChange = ""; }
      ov.classList.add("is-done");
      html.classList.remove("b30l-on", "b30l-pending");
      removeEventListener("resize", onResize);
      window.dispatchEvent(new CustomEvent("b30:loaded"));
      landing = true; landAt = performance.now();
      if (landAt - lastInput > CONFIG.landQuiet) release();
    }
    function release() {
      landing = false;
      window.dispatchEvent(new CustomEvent("b30:released"));
      removeEventListener("wheel", onWheel);
      removeEventListener("touchmove", onTouchMove);
      removeEventListener("keydown", onKey);
      removeEventListener("scroll", onScroll);
    }
    let safeAt = 0;
    function tick(now) {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now; clock += dt;
      if (!posed) { posed = true; setPage(0); html.classList.remove("b30l-pending"); clearTimeout(bail); }
      orbitStep(dt);
      if (phase === "build" || phase === "hold") {
        updateProgress(dt);
        drawBuild(); drawHint();
        if (phase === "build" && L && !L.done && shown >= 1) {          // never let play hold the page hostage
          if (!safeAt) safeAt = clock;
          if (clock - safeAt > 3.5) L.done = true;
        }
        if (phase === "build" && L && L.done) { phase = "hold"; holdAt = holdAt < -1 ? holdAt : clock; }
        if (phase === "hold") {
          if (!srEl.dataset.done) { srEl.dataset.done = "1"; srEl.textContent = "Breakthirty has loaded."; }
          if (shown >= 1 && clock - holdAt >= (reduced ? 0.3 : CONFIG.hold)) startReveal();
        }
      }
      if (phase === "reveal") {
        tb += dt;
        const busy = reduced ? drawFade() : drawSweep();
        setPage((tb - enterAt()) / CONFIG.enterTime);
        if (!busy && (reduced || tb >= enterAt() + CONFIG.enterTime)) { finish(); return; }
      }
      raf = requestAnimationFrame(tick);
    }

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    scrollTo(0, 0);
    size();
    buildLogo();
    raf = requestAnimationFrame(tick);
    return { get phase() { return phase; }, skip() { skipEl.click(); } };
  }

  const boot = () => { api = initLoader(mount()); if (pendingSkip) api.skip(); };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", boot) : boot();
})();
