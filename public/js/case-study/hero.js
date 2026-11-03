/* Case study · hero: the white steps draw in, the pixel pattern settles, blinks and ripples under the cursor */
(() => {
  "use strict";
  const RED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const HOVER = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = (t) => t * t * (3 - 2 * t);
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const U = () => document.documentElement.clientWidth / 1920;

  /* =====================================================================
     Hero strip — as the homepage's partners strip: the white steps draw in from full width to 1756 / 1592 as the
     strip comes up the screen, the pattern's rows settle at different speeds, and hovering a pixel blinks it with a
     soft wave through its neighbours.
     ===================================================================== */
  const hero = document.querySelector(".cz-hero");
  if (hero) {
    const rows = [...hero.querySelectorAll(".cz-px__row")], stepA = hero.querySelector(".cz-step.a");
    const squares = [...hero.querySelectorAll(".cz-px i")].map((el) => ({ el, b: el.firstElementChild, last: -1e9 }));
    const blink = (sq, delay, strong) => {
      const now = performance.now(); if (now - sq.last < 900) return; sq.last = now + delay;
      sq.b.animate(strong ? [{ opacity: 1, transform: "scale(1)" }, { opacity: 0.06, transform: "scale(.72)", offset: 0.42 }, { opacity: 1, transform: "scale(1)" }]
        : [{ opacity: 1, transform: "scale(1)" }, { opacity: 0.38, transform: "scale(.88)", offset: 0.45 }, { opacity: 1, transform: "scale(1)" }],
        { duration: strong ? 780 : 680, delay, easing: "cubic-bezier(.45,0,.2,1)" });
    };
    if (!RED) hero.addEventListener("pointermove", (e) => {
      const k = U(), hit = Math.max(26, 56 * k), wave = 240 * k; let src = null, best = 1e9;
      for (const s of squares) { const r = s.el.getBoundingClientRect(), d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)); if (d < best) { best = d; src = s; } }
      if (!src || best > hit || performance.now() - src.last < 900) return;
      const sr = src.el.getBoundingClientRect(); blink(src, 0, true);
      for (const s of squares) { if (s === src) continue; const r = s.el.getBoundingClientRect(), d = Math.hypot(r.left - sr.left, r.top - sr.top); if (d < wave) blink(s, 70 + d * 1.4, false); }
    }, { passive: true });
    /* the homepage's ripple: rings spread out from the cursor and nudge the pixels outward and back as they pass */
    if (!RED && HOVER) {
      const sq = squares.map((s) => s.el), rings = []; let rraf = 0, lastSpawn = 0, lx = -1e4, ly = -1e4;
      const rip = (now) => {
        rraf = 0;
        for (let i = rings.length - 1; i >= 0; i--) if (now - rings[i].t > 1400) rings.splice(i, 1);
        const k = U(), SPEED = 420 * k, W = 52 * k, AMP = 8 * Math.max(.6, k), REACH = 460 * k;
        for (const el of sq) {
          const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
          let dx = 0, dy = 0, sc = 0;
          for (const g of rings) {
            const age = (now - g.t) / 1000, rad = age * SPEED, ex = cx - g.x, ey = cy - g.y, d = Math.hypot(ex, ey) || 1;
            if (d > REACH) continue;
            const a = Math.exp(-Math.pow((d - rad) / W, 2)) * Math.max(0, 1 - age / 1.4) * (1 - d / REACH) * g.s;
            dx += ex / d * AMP * a; dy += ey / d * AMP * a; sc += a;
          }
          if (Math.abs(dx) + Math.abs(dy) > .05) { el.style.translate = `${dx.toFixed(2)}px ${dy.toFixed(2)}px`; el.style.scale = (1 + Math.min(.35, sc * .3)).toFixed(3); }
          else if (el.style.translate) { el.style.translate = ""; el.style.scale = ""; }
        }
        if (rings.length) rraf = requestAnimationFrame(rip);
      };
      addEventListener("pointermove", (e) => {
        if (e.pointerType !== "mouse") return;
        const hr = hero.getBoundingClientRect(), top = stepA.getBoundingClientRect().top;
        if (e.clientX < hr.left || e.clientX > hr.right || e.clientY < top - 20 || e.clientY > hr.bottom + 20) return;
        const now = performance.now(), moved = Math.hypot(e.clientX - lx, e.clientY - ly);
        if (now - lastSpawn < 140 || moved < 14) return;
        lastSpawn = now; lx = e.clientX; ly = e.clientY;
        rings.push({ x: e.clientX, y: e.clientY, t: now, s: Math.min(1, .45 + moved / 120) });
        if (rings.length > 6) rings.shift();
        if (!rraf) rraf = requestAnimationFrame(rip);
      }, { passive: true });
    }
    let qs = null, sp = null, last = performance.now(), vis = true;
    new IntersectionObserver(([e]) => (vis = e.isIntersecting)).observe(hero);
    (function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (vis) {
        const vh = innerHeight, top = stepA.getBoundingClientRect().top, k = U();
        // the pattern's rows settle into place as the strip rises (on load they're already on their way)
        const goal = RED ? 1 : easeOut(clamp((vh * 1.35 - top) / (vh * 0.75)));
        qs = qs === null ? goal * 0.35 : qs + (goal - qs) * (1 - Math.exp(-dt * 4));
        const mid = clamp((top - vh * .5) / vh, -1, 1);
        rows.forEach((r, i) => { const par = RED ? 0 : mid * (6 + i * 5) * k; r.style.transform = `translate3d(0,${((1 - qs) * (22 + i * 20) * k + par).toFixed(2)}px,0)`; });
        // the steps draw in from full width
        const spT = RED ? 1 : clamp((vh * 1.25 - top) / (vh * 0.75)), spG = ease(spT);
        sp = sp === null ? spG * 0.2 : sp + (spG - sp) * (1 - Math.exp(-dt * 5));
        hero.style.setProperty("--sp", (Math.abs(spG - sp) < 0.001 ? spG : sp).toFixed(4));
      }
      requestAnimationFrame(frame);
    })(performance.now());
  }
})();
