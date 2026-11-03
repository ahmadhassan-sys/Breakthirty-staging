/* =====================================================================
   Homepage rebuild (Oct 2026): rule pixels on the case studies, the frames' draw-in (Our vision, the
   separator), the partners grid drawing itself before the partners arrive, and the CTA's broken word.
   ===================================================================== */
(() => {
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const once = (el, cls, thr, cb) => { if (!el) return; if (REDUCED) { el.classList.add(cls); cb && cb(); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { el.classList.add(cls); cb && cb(); io.disconnect(); } }), { threshold: thr, rootMargin: "0px 0px -8% 0px" }); io.observe(el); };

  // Selected work: a 6px pixel at both ends of every rule
  document.querySelectorAll(".work .row").forEach((r) => r.insertAdjacentHTML("beforeend",
    '<i class="rpx t l" aria-hidden="true"></i><i class="rpx t r" aria-hidden="true"></i><i class="rpx b l" aria-hidden="true"></i><i class="rpx b r" aria-hidden="true"></i>'));

  // Our vision: the frame's rules draw out from the middle, then the corner pixels land
  once(document.querySelector(".vision"), "vz-in", 0.3);
  // the separator before the partners
  once(document.querySelector(".b30sep"), "is-in", 1);

  // Partners: the grid draws itself (columns from the middle out, rows top to bottom), then the partners arrive
  const pg = document.querySelector(".pg");
  if (pg) {
    const prep = () => {
      const vs = [...pg.querySelectorAll(".pg__lines .pg__v")], hs = [...pg.querySelectorAll(".pg__lines .pg__hz")];
      vs.forEach((v) => { const x = parseFloat(v.style.left.replace(/[^0-9.]/g, "")) || 978; v.style.setProperty("--gd", Math.round(Math.abs(x - 978) / 800 * 190) + "ms"); });
      hs.forEach((h, i) => h.style.setProperty("--gd", 80 + i * 55 + "ms"));
      [...pg.querySelectorAll(".pg__t")].forEach((t) => { const d = Math.hypot(parseFloat(t.dataset.cx) - 978, parseFloat(t.dataset.cy) - 400); t.querySelector(".pg__mk").style.setProperty("--ld", 410 + Math.round(d / 900 * 310) + "ms"); });
    };
    requestAnimationFrame(prep);
    once(pg.querySelector(".pg__stage"), "x", 0.3, () => { pg.classList.add("is-drawn"); setTimeout(() => pg.classList.add("is-settled"), 1300); });
  }
})();
