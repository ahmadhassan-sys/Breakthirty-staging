/* =====================================================================
   CTA — "Think. Make / Break through." in BDO Grotesk (as on the work and services pages) on a white panel. As
   the panel scrolls up, the words turn into pixels along a moving front and
   the pixels drift up and fade ("Think. Make" first, "Break through." just after),
   while the pixel-step frame at the bottom rises. There is no hold: the panel
   scrolls straight through and the footer follows right behind, the break
   finishing as the footer comes into view. Going back up rebuilds the words.
   ===================================================================== */
const CTA_BTN = `<a class="b30btn b30btn--solid" href="mailto:hello@breakthirty.com?subject=Hello%20Breakthirty" data-btn data-anim="target"><span class="b30btn__ic"><svg viewBox="0 0 24.0011 24" fill="#000" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M18.0005 1.99903V0H16.0004H6V1.99903H16.0004H18.0005Z"/><path d="M6.00009 1.99902H4V3.99911H6.00009V1.99902Z"/><path d="M20.0001 1.99902H18V3.99911H20.0001V1.99902Z"/><path d="M4.00009 3.99915H2V5.99923H4.00009V3.99915Z"/><path d="M16.0004 3.99915H8V5.99923H16.0004V3.99915Z"/><path d="M22.0001 3.99915H20V5.99923H22.0001V3.99915Z"/><path d="M2.00009 5.99915H0V15.9996V17.9997H2.00009V15.9996V5.99915Z"/><path d="M8.00009 5.99915H6V7.99923H8.00009V5.99915Z"/><path d="M18.0001 5.99927H16V7.99936H18.0001V5.99927Z"/><path d="M22 5.99927V7.99936V11.9995V13.9996V15.9997V17.9998H24.0001V15.9997V13.9996V11.9995V7.99936V5.99927H22Z"/><path d="M6.00009 7.99927H4V9.99936V15.9996H6.00009V9.99936V7.99927Z"/><path d="M14.0002 7.99927H10V9.99936H14.0002V7.99927Z"/><path d="M20.0001 7.99927H18V15.9996H20.0001V7.99927Z"/><path d="M10.0001 9.99939H8V13.9996H10.0001V9.99939Z"/><path d="M16.0001 9.99939H14V13.9996H16.0001V9.99939Z"/><path d="M14.0002 13.9995H10V15.9996H14.0002V13.9995Z"/><path d="M8.00009 15.9996H6V17.9997H8.00009V15.9996Z"/><path d="M18.0001 15.9996H16V17.9997H18.0001V15.9996Z"/><path d="M4.00009 17.9998H2V19.9998H4.00009V17.9998Z"/><path d="M16.0004 17.9998H8V19.9998H16.0004V17.9998Z"/><path d="M22.0001 17.9998H20V19.9998H22.0001V17.9998Z"/><path d="M6.00009 19.9998H4V21.9998H6.00009V19.9998Z"/><path d="M20.0001 19.9998H18V21.9998H20.0001V19.9998Z"/><path d="M18.0005 21.9999H6V24H18.0005V21.9999Z"/></svg></span><span class="b30btn__lbl" data-lbl>Let’s discuss</span></a>`;
window.WK_CTA = {
  size: 200,                  // BDO Grotesk, design px (same as the work page)
  height: 522.5,              // the white panel's height, design px: 300 of air above and below the closing line (to the footer's floor)
  start: 0.72,                // the words begin to go when the panel's top is this far down the screen (share of its height)
  frame: 0.9,                 // the frame starts rising when the panel's top is this far down the screen
  end: 0.5,                   // everything is done when the panel's bottom reaches this far down the screen
  cell: 4,                    // pixel size the words break into, design px (fine, like the Vision particles)
  hold: 0.12,                 // share of the scroll the words stay whole
  pix: 0.08,                  // each cell shows as a solid pixel this long before it lets go
  life: 0.3,                  // how long each pixel takes to drift away
  rise: 150,                  // how far the pixels drift up, design px
  tint: 0.32,                 // share of pixels that turn a brand colour as they go
  follow: 0.1                 // smoothing between the scroll and the motion
};
(() => {
  "use strict";
  const C = window.WK_CTA;
  const sec = document.getElementById("contact"); if (!sec) return;
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const u = () => document.documentElement.clientWidth / 1920;
  const clamp = (v) => Math.min(1, Math.max(0, v));
  const easeIO = (t) => t * t * (3 - 2 * t);
  const BRAND = ["#3457BA", "#F95050", "#0C5238", "#F4EB02", "#B0E9FD", "#FAD7FF"];
  const SWEEP = 1 - C.hold - C.pix - C.life;   // the last pixel is gone exactly as the hold ends
  sec.classList.add("wk-cta-proof");

  const stage = document.createElement("div"); stage.className = "wk-cta-stage";
  sec.appendChild(stage);
  sec.querySelectorAll(".b30c__st").forEach((n) => stage.appendChild(n));
  stage.insertAdjacentHTML("beforeend",
    `<canvas class="wk-cta__px" aria-hidden="true"></canvas>
     <p class="wk-cta__t" aria-hidden="true"></p>
     <div class="cta2">
       <h2 class="cta2__h" data-heading data-once>${((window.B30_CONTENT.contact || {}).heading || []).map((l) => `<span class="ln">${l}</span>`).join("")}</h2>
     </div>`);
  const cv = stage.querySelector(".wk-cta__px"), g = cv.getContext("2d");
  const tx = stage.querySelector(".wk-cta__t"), lines = [...tx.querySelectorAll(".wk-cta__ln")];
  let img = null, cells = [], W = 0, H = 0, dpr = 1, cur = 0, raf = 0, PADT = 0, PADB = 0, mx = -1e5, my = -1e5, mraf = 0;
  addEventListener("pointermove", (e) => {                     // cursor in the panel's coordinates
    if (e.pointerType !== "mouse") return;
    const r = stage.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, inside = y > -PADT && y < r.height + 40 && x > -40 && x < r.width + 40;
    if (!inside && mx < -1e4) return;
    mx = inside ? x : -1e5; my = inside ? y : -1e5;
    if (!mraf) mraf = requestAnimationFrame(() => { mraf = 0; draw(true); });
  }, { passive: true });   // PADT: extra canvas above the panel for the drifting pixels

  function layout() {
    const U = u();
    sec.style.setProperty("--ctah", C.height);
    tx.style.fontSize = C.size * U + "px";
    W = stage.clientWidth; H = stage.clientHeight; dpr = Math.min(2, devicePixelRatio || 1);
    const vh = innerHeight; PADT = Math.round(Math.max(440 * U, vh * 0.75)); PADB = Math.round(vh * 0.45);   // room to scatter over the whole screen
    cv.style.top = -PADT + "px"; cv.style.height = H + PADT + PADB + "px";
    cv.width = Math.round(W * dpr); cv.height = Math.round((H + PADT + PADB) * dpr);
    tx.style.top = (H - tx.offsetHeight) / 2 - 40 * U + "px";
    // draw the two lines exactly where the text sits, then cut them into cells
    img = document.createElement("canvas"); img.width = cv.width; img.height = cv.height;
    const x = img.getContext("2d"), sr = stage.getBoundingClientRect(), cs = getComputedStyle(tx), fs = parseFloat(cs.fontSize);
    x.scale(dpr, dpr); x.translate(0, PADT); x.fillStyle = cs.color; x.textAlign = "center"; x.textBaseline = "alphabetic";
    x.font = `400 ${fs}px ${cs.fontFamily}`;
    if ("letterSpacing" in x) x.letterSpacing = cs.letterSpacing;
    const rects = lines.map((ln) => {
      const r = ln.getBoundingClientRect(), m = x.measureText(ln.textContent), fa = m.fontBoundingBoxAscent, fd = m.fontBoundingBoxDescent;
      x.fillText(ln.textContent, r.left - sr.left + r.width / 2, r.top - sr.top + (r.height - (fa + fd)) / 2 + fa);
      return { x0: r.left - sr.left + (r.width - m.width) / 2, x1: r.left - sr.left + (r.width + m.width) / 2, y0: r.top - sr.top, y1: r.bottom - sr.top };
    });
    const c = Math.max(3, C.cell * U), d = x.getImageData(0, 0, img.width, img.height).data;
    const tr = tx.getBoundingClientRect();
    let y0 = tr.top - sr.top - 20 * U, y1 = tr.bottom - sr.top + 20 * U;
    let gx0 = Math.min(...rects.map((r) => r.x0)) - c, gx1 = Math.max(...rects.map((r) => r.x1)) + c;
    // the cell grid must cover every inked pixel: descenders (y, p, g) and overhangs reach past the text box,
    // and any ink outside the grid was never cleared, leaving a stray chip behind once the words have gone
    let ix0 = img.width, iy0 = img.height, ix1 = -1, iy1 = -1;
    for (let yy = 0; yy < img.height; yy++) for (let xx = 0; xx < img.width; xx++) {
      if (d[(yy * img.width + xx) * 4 + 3] <= 6) continue;
      if (xx < ix0) ix0 = xx; if (xx > ix1) ix1 = xx; if (yy < iy0) iy0 = yy; if (yy > iy1) iy1 = yy;
    }
    if (ix1 >= 0) {
      gx0 = Math.min(gx0, ix0 / dpr - c); gx1 = Math.max(gx1, (ix1 + 1) / dpr + c);
      y0 = Math.min(y0, iy0 / dpr - PADT - c);   y1 = Math.max(y1, (iy1 + 1) / dpr - PADT + c);
    }
    cells = []; let n = 0;
    for (let yy = y0; yy < y1; yy += c) for (let xx = gx0; xx < gx1; xx += c) {
      let on = 0, tot = 0;                                   // coverage of this cell
      for (let sy = 0.05; sy < 1; sy += 0.225) for (let sx = 0.05; sx < 1; sx += 0.225) {
        const px = Math.round((xx + sx * c) * dpr), py = Math.round((yy + PADT + sy * c) * dpr);
        tot++; if (px >= 0 && py >= 0 && px < img.width && py < img.height && d[(py * img.width + px) * 4 + 3] > 6) on++;
      }
      if (!on) continue;
      const ra = Math.abs(Math.sin(++n * 91.345 + 7.13) * 43758.5453 % 1), rb = Math.abs(Math.sin(n * 12.9898) * 43758.5453 % 1);
      const li = yy + c / 2 < (rects[0].y1 + rects[1].y0) / 2 ? 0 : 1, R = rects[li];
      const xf = clamp((xx - R.x0) / (R.x1 - R.x0));
      // the front runs left to right, line one leading; a little noise keeps the edge ragged
      const order = clamp(li * 0.4 + Math.min(xf, 1 - xf) * 2 * 0.5 + ra * 0.1);   // both ends at once, meeting in the middle
      cells.push({ x: xx, y: yy, cov: on / tot, at: C.hold + C.pix + order * SWEEP,
        dx: (xf < 0.5 ? -1 : 1) * (0.2 + rb * 0.8) * 70 * U, dy: -(0.35 + ra * 0.65) * C.rise * U, col: rb < C.tint ? BRAND[(ra * BRAND.length) | 0] : B30T.ink(),
        sw: (ra - 0.5) * 50 * U, tx: Math.abs(Math.sin(n * 3.3317 + 1.7) * 9241.71 % 1), ty: Math.abs(Math.sin(n * 7.1193 + 0.3) * 3713.33 % 1), ph: rb * 6.283, wob: (2 + ra * 4) * U, dz: (Math.abs(Math.sin(n * 4.1414 + 2.7) * 24634.6345 % 1) - 0.4) * 1100 * U });   // dz: depth it drifts to
    }
    cells.c = c;
    draw(true);
  }

  /* one scroll axis for both: e = the panel's way in (frame rises), p = the words' break */
  function axis() {
    const r = sec.getBoundingClientRect(), vh = innerHeight;
    const end = vh * C.end - r.height, a = vh * C.start, f = vh * C.frame;
    return { e: clamp((f - r.top) / (f - end)), p: clamp((a - r.top) / (a - end)) };
  }
  let lastDrawn = -1;
  function draw(force) {
    raf = 0;
    const A = axis();
    sec.style.setProperty("--cp", easeIO(A.e).toFixed(4));   // the white panel's frame rises on the same scroll
    if (window.B30_CTA_TYPE) return;                           // the pixel break is off: the headline is live type
    cur += (A.p - cur) * (REDUCED ? 1 : C.follow);
    if (Math.abs(A.p - cur) < 0.0005) cur = A.p;
    if (cur !== A.p) raf = requestAnimationFrame(() => draw());
    if (!img || (!force && Math.abs(cur - lastDrawn) < 0.0002)) return;
    lastDrawn = cur;
    const p = cur, c = cells.c;
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, cv.width, cv.height);
    g.drawImage(img, 0, 0);
    g.setTransform(dpr, 0, 0, dpr, 0, PADT * dpr);
    g.fillStyle = B30T.ink();
    for (const k of cells) {
      if (p <= k.at - C.pix) continue;
      g.clearRect(k.x - 0.5, k.y - 0.5, c + 1, c + 1);          // the smooth letter gives way to its pixel…
      if (p < k.at) {                                         // …a solid block, sized by how much ink the cell held
        const s = Math.round(c * Math.min(1, 0.35 + k.cov * 0.75));
        g.fillRect(k.x + (c - s) / 2, k.y + (c - s) / 2, s, s);
      }
    }
    for (const k of cells) {                                  // …which then drifts up and away
      const t = clamp((p - k.at) / C.life); if (t <= 0 || t >= 1) continue;
      // a soft lift that eases out, curving sideways on an arc with a gentle sway — like ash on warm air
      const e = 1 - Math.pow(1 - t, 3), st = t * t * (3 - 2 * t);
      const x = k.x + k.dx * e + k.sw * Math.sin(t * Math.PI) + Math.sin(t * 7 + k.ph) * k.wob * t;
      const y = k.y + k.dy * e;
      // in 3D, like the Vision particles: each pixel also drifts toward or away from you, so it grows or shrinks and spreads in perspective
      const F = 1400 * u(), cx = W / 2, cy = H / 2, zz = k.dz * e * 0.6, kk = F / Math.max(F * 0.4, F - zz);   // a touch of depth
      let X = cx + (x + c / 2 - cx) * kk, Y = cy + (y + c / 2 - cy) * kk;
      if (mx > -1e4) {                                                                    // the cursor parts them
        const ddx = X - mx, ddy = Y - my, Rr = 110 * u(), d2 = ddx * ddx + ddy * ddy;
        if (d2 < Rr * Rr) { const d = Math.sqrt(d2) || 1, f = 1 - d / Rr; X += (ddx / d) * f * f * 30 * u(); Y += (ddy / d) * f * f * 30 * u(); }
      }
      const s = c * Math.min(1, 0.35 + k.cov * 0.75) * (1 - st * 0.4) * kk;
      g.globalAlpha = (1 - st) * Math.min(1, 0.55 + 0.45 * kk);
      g.fillStyle = t > 0.2 ? k.col : B30T.ink();
      g.fillRect(X - s / 2, Y - s / 2, s, s);
    }
    g.globalAlpha = 1;
  }
  addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(() => draw()); }, { passive: true });
  let rw = 0;
  addEventListener("resize", () => { if (innerWidth !== rw) { rw = innerWidth; layout(); } });
  addEventListener("b30:theme", () => layout());   // redraw the words in the new ink
  rw = innerWidth;
  (document.fonts ? Promise.all([document.fonts.ready, document.fonts.load(`${C.size}px "BDO Grotesk"`).catch(() => 0)]) : Promise.resolve()).then(layout);
})();

/* =====================================================================
   CTA — lines spread across the width as they enter from the bottom of the
   screen and gather into the paragraph as they rise (ref. 097.mp4),
   plus glass lenses refracting the pixel steps at the bottom corners.
   ===================================================================== */
(() => {
  const sec = document.getElementById("contact");
  if (!sec) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const txt = sec.querySelector(".b30c__txt");
  const source = txt.textContent.trim().replace(/\s+/g, " ");
  let on = false;
  new IntersectionObserver(([e]) => { on = e.isIntersecting; }, { rootMargin: "25% 0px" }).observe(sec);

  /* local time in Kaysville, ticking */
  const clock = sec.querySelector("[data-clock]");
  if (clock) {
    const fmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Denver" });
    const upd = () => { clock.textContent = fmt.format(new Date()); };
    upd(); setInterval(upd, 15000);
  }
  /* corner pixel steps rise with the section */
  let cp = 0, cpRaf = 0;
  const setCp = () => {
    cpRaf = 0;
    const r = sec.getBoundingClientRect(), vh = innerHeight;
    const p = reduced ? 1 : Math.min(1, Math.max(0, (vh - r.bottom + r.height * 0.75) / (r.height * 0.75)));
    const goal = 1 - Math.pow(1 - p, 3);
    cp += (goal - cp) * (reduced ? 1 : 0.12);
    if (Math.abs(goal - cp) < 0.001) cp = goal;
    sec.style.setProperty("--cp", cp.toFixed(4));
    if (cp !== goal) cpRaf = requestAnimationFrame(setCp);
  };
  if (sec.classList.contains("wk-cta-proof")) return;   // the CTA script drives --cp on its own scroll axis, in sync with the words
  addEventListener("scroll", () => { if (on && !cpRaf) cpRaf = requestAnimationFrame(setCp); }, { passive: true });
  setCp();
})();

window.B30_CTA_TYPE = true;
(() => {   // the CTA headline: a plain heading — its words rise in like every other heading on the page
  const tx = document.querySelector('.wk-cta-proof .wk-cta__t'); if (!tx || !window.B30) return;
  tx.removeAttribute('aria-hidden'); tx.setAttribute('data-heading', '');
  B30.splitWords && B30.splitWords(tx); B30.observe && B30.observe(tx);
})();

(() => { const h = document.querySelector(".cta2__h"); if (!h || !window.B30) return; B30.splitWords && B30.splitWords(h); B30.observe && B30.observe(h);
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) h.classList.add("is-in"); })();

/* =====================================================================
   The closing heading — simple: when it comes into view, its words slide up from just below their line, one after
   another, 100ms apart. (They slide back down if you scroll back up past it, so it plays again next time.)
   ===================================================================== */
(() => {
  const sec = document.getElementById('contact'), h = sec && sec.querySelector('.cta2__h'); if (!h) return;
  window.B30 && B30.splitWords && B30.splitWords(h);
  const words = [...h.querySelectorAll('.hw-i')]; if (!words.length) return;
  h.classList.add('cta-slide');
  words.forEach((w, i) => w.style.setProperty('--d', i * 100 + 'ms'));
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { h.classList.add('is-up'); return; }
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) h.classList.add('is-up');
    else if (e.boundingClientRect.top > 0) h.classList.remove('is-up');   // left below the fold: replay next time
  }, { threshold: .35 }).observe(h);
})();
