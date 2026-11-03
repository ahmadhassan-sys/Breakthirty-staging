/* Case study · videos inside pictures (src/components/case-study/parts/Picture.astro `video`).
   The picture box shows the video's first frame (its poster) and plays its usual reveal; once that has played,
   the video fades in on top and plays — muted, looping, only while it's on screen (paused when it leaves).
   The hero's video waits for the page's hero to be ready (images.js / the page transition).
   Reduced motion: the videos never start; the poster stays. */
(() => {
  const vids = [...document.querySelectorAll(".ph__v")]; if (!vids.length) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { vids.forEach((v) => v.remove()); return; }   // poster only
  const REVEAL = 1200;   // about the length of the picture reveal (images.js revealMs)
  let heroReady = false;
  document.addEventListener("b30:hero-ready", () => { heroReady = true; vids.forEach((v) => v._hero && v._want && start(v)); }, { once: true });

  const STILL = (v) => !!v.closest("[data-still]");   // still pages: no wait, no fade — the video just plays over its first frame
  function start(v) {
    if (v._hero && !heroReady && !v._still) return;                       // the hero waits for the hand-off
    if (v._go) { v.play().catch(() => {}); return; }
    v._go = true;
    setTimeout(() => {
      if (!v._want) { v._go = false; return; }
      if (v.preload !== "auto") { v.preload = "auto"; v.load(); }
      const show = () => v.classList.add("on");
      v.addEventListener("playing", show, { once: true });
      v.play().catch(() => { v._go = false; });                            // autoplay refused: the poster stays
    }, v._still ? 0 : v._hero ? 300 : REVEAL);
  }

  const io = new IntersectionObserver((es) => es.forEach((e) => {
    const v = e.target._v;
    v._want = e.isIntersecting;
    if (e.isIntersecting) start(v); else if (!v.paused) v.pause();
  }), { threshold: 0.2 });

  vids.forEach((v) => {
    const box = v.closest(".ph"); box._v = v;
    v._hero = box.dataset.gl === "hero";
    v._still = STILL(v); if (v._still) v.classList.add("on");
    io.observe(box);
  });
  // back on the tab: carry on where it should be playing
  document.addEventListener("visibilitychange", () => { if (!document.hidden) vids.forEach((v) => v._want && v.classList.contains("on") && v.play().catch(() => {})); });
})();
