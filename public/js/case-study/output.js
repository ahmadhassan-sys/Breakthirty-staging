/* Case study · the output: sticky tabs that follow the scroll and move on by themselves */
(() => {
  "use strict";
  const RED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const U = () => document.documentElement.clientWidth / 1920;

  /* =====================================================================
     The output — sticky tabs; click to jump; on auto, a line runs along the bottom of the active tab for 5 s,
     then the page moves on to the next part.
     ===================================================================== */
  const out = document.querySelector(".cz-out");
  if (out) {
    const bar = out.querySelector(".cz-tabs"), tabs = [...bar.querySelectorAll(".cz-tab")], parts = [...out.querySelectorAll(".cz-part")];
    const DUR = 7000;
    let active = -1, prog = 0, last = 0, userAt = 0, autoUntil = 0, raf = 0;
    const setActive = (i) => { if (i === active) return; active = i; prog = 0; tabs.forEach((t, k) => { t.classList.toggle("on", k === i); t.setAttribute("aria-current", k === i ? "true" : "false"); }); };
    const goTo = (i) => {
      const el = parts[i]; if (!el) return;
      const off = -(bar.offsetHeight + 40);
      autoUntil = performance.now() + 1800; prog = 0;
      if (window.B30 && B30.lenis) B30.lenis.scrollTo(el, { offset: off, duration: 1.4 });
      else scrollTo({ top: el.getBoundingClientRect().top + scrollY + off, behavior: RED ? "auto" : "smooth" });
      setActive(i);
    };
    tabs.forEach((t, i) => t.addEventListener("click", (e) => { e.preventDefault(); userAt = 0; goTo(i); }));
    ["wheel", "touchmove", "keydown", "pointerdown"].forEach((ev) => addEventListener(ev, (e) => { if (e.type === "pointerdown" && e.target.closest && e.target.closest(".cz-tab")) return; userAt = performance.now(); prog = 0; }, { passive: true }));
    const which = () => { const line = bar.getBoundingClientRect().bottom + innerHeight * 0.3; let i = 0; parts.forEach((p, k) => { if (p.getBoundingClientRect().top <= line) i = k; }); return i; };
    const loop = (now) => {
      const dt = Math.min(64, now - (last || now)); last = now;
      if (now > autoUntil) setActive(which());
      const br = bar.getBoundingClientRect(), inside = br.top <= innerHeight * 0.5 && parts[parts.length - 1].getBoundingClientRect().bottom > br.bottom + 40;
      const idle = now - userAt > 900 && now > autoUntil;
<<<<<<< HEAD
      prog = 0;   // no timer line, no auto-advance: the tabs jump on click and follow the scroll
=======
      if (!RED && inside && idle && active < parts.length - 1) prog += dt; else if (!inside) prog = 0;
>>>>>>> f0e7d935b7adba6199409368d09b447496a99313
      tabs.forEach((t, k) => t.style.setProperty("--p", k === active ? clamp(prog / DUR).toFixed(4) : 0));
      if (prog >= DUR) goTo(active + 1);
      raf = requestAnimationFrame(loop);
    };
    new IntersectionObserver(([e]) => { if (e.isIntersecting) { if (!raf) { last = 0; raf = requestAnimationFrame(loop); } } else { cancelAnimationFrame(raf); raf = 0; } }, { rootMargin: "200px 0px" }).observe(out);
    setActive(0);
  }
})();
