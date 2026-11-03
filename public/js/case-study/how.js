/* Case study · how we worked: the green pixel band, and the hand that points at each step */
(() => {
  "use strict";
  const RED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = (t) => t * t * (3 - 2 * t);
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  /* =====================================================================
     How we worked — the homepage's pixel band (three stepped rows, built bottom row first as you arrive), in the
     section's green, so it runs straight into the gradient.
     ===================================================================== */
  const how = document.querySelector(".cz-how"), band = how && how.querySelector(".cz-band");
  if (band) {
    const ctx = band.getContext("2d"), CELL = 80, H = 208;
    const ROWS = { "-33": [8, 9, 10, 12, 14, 17, 18, 19, 20, 21], "47": [1, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20], "127": [1, 3, 4, 6, 8, 9, 10, 12, 13, 14, 16, 17, 18, 21, 23] };
    const rr = (n) => { const v = Math.sin(n * 91.345 + 7.13) * 43758.5453; return v - Math.floor(v); };
    const cells = []; let n = 0;
    Object.keys(ROWS).forEach((key) => { const y = +key, yn = (y + 33) / 160; ROWS[key].forEach((c) => cells.push({ x: c * CELL, y, t0: (1 - yn) * 0.62 + rr(++n) * 0.2 })); });
    let s = 1, dpr = 1, cur = 0, lastPr = -1, raf = 0;
    const size = () => { s = document.documentElement.clientWidth / 1920; dpr = Math.min(devicePixelRatio || 1, 2); band.width = Math.round(1920 * s * dpr); band.height = Math.round(H * s * dpr); lastPr = -1; draw(); };
    const progress = () => { const top = band.getBoundingClientRect().top, vh = innerHeight; return RED ? 1 : clamp((vh + 100 - top) / (vh * 0.8)); };
    function draw() {
      raf = 0; const goal = progress();
      cur += (goal - cur) * (RED ? 1 : 0.11); if (Math.abs(goal - cur) < 0.0006) cur = goal;
      if (cur !== goal) raf = requestAnimationFrame(draw);
      if (Math.abs(cur - lastPr) < 0.0002) return; const pr = (lastPr = cur);
      ctx.setTransform(s * dpr, 0, 0, s * dpr, 0, 0); ctx.clearRect(0, 0, 1920, H);
      const gr = ctx.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#C6D9CB"); gr.addColorStop(1, "#D1E0D4"); ctx.fillStyle = gr;
      for (const c of cells) { const a = clamp((pr - c.t0) / 0.05); if (a <= 0) continue; const e = easeOut(a), sz = CELL * (0.74 + 0.26 * e) + 1, o = (CELL - sz) / 2; ctx.globalAlpha = e; ctx.fillRect(c.x + o, c.y + o, sz, sz); }
      ctx.globalAlpha = 1;
    }
    addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(draw); }, { passive: true });
    addEventListener("resize", size); size();
  }

  /* =====================================================================
     How we worked — the hand glides with the scroll and points at each step in turn; only that step is in full
     black. It only ever moves straight up and down, so its cut arm stays flush with the left edge.
     ===================================================================== */
  const hand = how && how.querySelector(".cz-hand");
  if (hand) {
    const steps = [...how.querySelectorAll(".cz-st")], titles = steps.map((s) => s.querySelector(".cz-st__t"));
    const TIP = 69 / 277;
    let y = null, raf = 0, act = -1;
    const target = () => {
      const sr = how.getBoundingClientRect(), focus = innerHeight * 0.5;
      const cs = titles.map((t) => { const r = t.getBoundingClientRect(); return r.top + r.height / 2; });
      let c, active = 0;
      if (focus <= cs[0]) c = cs[0];
      else if (focus >= cs[cs.length - 1]) { c = cs[cs.length - 1]; active = cs.length - 1; }
      else { let i = 0; while (focus > cs[i + 1]) i++;
        const t = (focus - cs[i]) / (cs[i + 1] - cs[i]), k = ease(clamp((t - 0.25) / 0.5));
        c = cs[i] + (cs[i + 1] - cs[i]) * k; active = k < 0.5 ? i : i + 1; }
      if (active !== act) { act = active; steps.forEach((s, i) => s.classList.toggle("on", i === active)); }
      return c - sr.top - hand.offsetHeight * TIP;
    };
    const frame = () => {
      raf = 0; const t = target();
      y = y === null || RED ? t : y + (t - y) * 0.075;
      if (Math.abs(t - y) < 0.05) y = t;
      hand.style.transform = `translate3d(0,${y.toFixed(2)}px,0)`;
      if (y !== t) raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
    addEventListener("scroll", kick, { passive: true }); addEventListener("resize", kick);
    hand.complete ? kick() : hand.addEventListener("load", kick); kick();
  }
})();
