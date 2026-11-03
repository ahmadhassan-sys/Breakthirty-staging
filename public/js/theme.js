(() => {
  const nav = document.querySelector(".b30h__nav"); if (!nav || !window.B30T) return;
  const b = document.createElement("button");
  b.className = "b30-theme"; b.type = "button";
  b.innerHTML = '<span class="b30-tk"><svg class="b30-ks" viewBox="0 0 11 11" aria-hidden="true" shape-rendering="crispEdges"><rect x="5" y="0" width="1" height="1" fill="#FF8A1F"/><rect x="5" y="1" width="1" height="1" fill="#FF8A1F"/><rect x="2" y="2" width="1" height="1" fill="#FF8A1F"/><rect x="8" y="2" width="1" height="1" fill="#FF8A1F"/><rect x="4" y="3" width="3" height="1" fill="#FFC81F"/><rect x="3" y="4" width="5" height="1" fill="#FFC81F"/><rect x="0" y="5" width="2" height="1" fill="#FF8A1F"/><rect x="3" y="5" width="4" height="1" fill="#FFC81F"/><rect x="7" y="5" width="1" height="1" fill="#FFAE00"/><rect x="9" y="5" width="2" height="1" fill="#FF8A1F"/><rect x="3" y="6" width="3" height="1" fill="#FFC81F"/><rect x="6" y="6" width="2" height="1" fill="#FFAE00"/><rect x="4" y="7" width="1" height="1" fill="#FFC81F"/><rect x="5" y="7" width="2" height="1" fill="#FFAE00"/><rect x="2" y="8" width="1" height="1" fill="#FF8A1F"/><rect x="8" y="8" width="1" height="1" fill="#FF8A1F"/><rect x="5" y="9" width="1" height="1" fill="#FF8A1F"/><rect x="5" y="10" width="1" height="1" fill="#FF8A1F"/></svg><svg class="b30-km" viewBox="0 0 11 11" aria-hidden="true" shape-rendering="crispEdges"><rect x="3" y="1" width="1" height="1" fill="#F6E3A0"/><rect x="8" y="1" width="1" height="1" fill="#FFFFFF"/><rect x="2" y="2" width="2" height="1" fill="#F6E3A0"/><rect x="1" y="3" width="3" height="1" fill="#F6E3A0"/><rect x="1" y="4" width="3" height="1" fill="#F6E3A0"/><rect x="9" y="4" width="1" height="1" fill="#FFFFFF"/><rect x="1" y="5" width="3" height="1" fill="#F6E3A0"/><rect x="1" y="6" width="4" height="1" fill="#F6E3A0"/><rect x="1" y="7" width="5" height="1" fill="#F6E3A0"/><rect x="9" y="7" width="1" height="1" fill="#F6E3A0"/><rect x="2" y="8" width="7" height="1" fill="#F6E3A0"/><rect x="3" y="9" width="5" height="1" fill="#F6E3A0"/></svg></span><svg class="b30-tg b30-tg--moon" viewBox="0 0 11 11" aria-hidden="true" shape-rendering="crispEdges" fill="currentColor"><rect x="3" y="1" width="1" height="1"/><rect x="2" y="2" width="2" height="1"/><rect x="1" y="3" width="3" height="1"/><rect x="1" y="4" width="3" height="1"/><rect x="1" y="5" width="3" height="1"/><rect x="1" y="6" width="4" height="1"/><rect x="1" y="7" width="5" height="1"/><rect x="9" y="7" width="1" height="1"/><rect x="2" y="8" width="7" height="1"/><rect x="3" y="9" width="5" height="1"/></svg><svg class="b30-tg b30-tg--sun" viewBox="0 0 11 11" aria-hidden="true" shape-rendering="crispEdges" fill="currentColor"><rect x="5" y="0" width="1" height="1"/><rect x="5" y="1" width="1" height="1"/><rect x="2" y="2" width="1" height="1"/><rect x="8" y="2" width="1" height="1"/><rect x="4" y="3" width="3" height="1"/><rect x="3" y="4" width="5" height="1"/><rect x="0" y="5" width="2" height="1"/><rect x="3" y="5" width="5" height="1"/><rect x="9" y="5" width="2" height="1"/><rect x="3" y="6" width="5" height="1"/><rect x="4" y="7" width="3" height="1"/><rect x="2" y="8" width="1" height="1"/><rect x="8" y="8" width="1" height="1"/><rect x="5" y="9" width="1" height="1"/><rect x="5" y="10" width="1" height="1"/></svg>';
  const label = () => b.setAttribute("aria-label", B30T.dark() ? "Switch to light theme" : "Switch to dark theme");
  label(); nav.appendChild(b);
  b.addEventListener("click", () => b.classList.add("is-hold"));
  b.addEventListener("pointerleave", () => b.classList.remove("is-hold"));
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function apply(dark) {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem("b30-theme", dark ? "dark" : "light"); } catch (_) {}
    label();
    dispatchEvent(new CustomEvent("b30:theme", { detail: { dark } }));
    dispatchEvent(new Event("resize"));                  // canvases redraw their colours
  }
  // the switch: the new theme sweeps across the page from left to right — slow at the start, fast at the end
  function wipe(dark) {
    if (true) { apply(dark); return; }   // instant, like a light switch
    if (document.startViewTransition) {
      const vt = document.startViewTransition(() => apply(dark));
      vt.ready.then(() => document.documentElement.animate(
        { clipPath: dark ? ["inset(0 0 100% 0)", "inset(0 0 0% 0)"] : ["inset(100% 0 0 0)", "inset(0% 0 0 0)"] },   // to night: top → bottom; back to day: bottom → top (like the switch)
        { duration: 1400, easing: "cubic-bezier(.77,0,.18,1)", pseudoElement: "::view-transition-new(root)" }));
      return;
    }
    const band = document.createElement("div"); band.className = "b30-swipe"; band.style.background = dark ? "#000" : "#fff";   // no View Transitions: a band crosses, the theme flips under it
    document.documentElement.appendChild(band);
    band.animate({ transform: ["translateX(-100%)", "translateX(0)"] }, { duration: 1100, easing: "cubic-bezier(.45,.05,.25,1)", fill: "forwards" }).finished.then(() => {
      apply(dark);
      band.animate({ transform: ["translateX(0)", "translateX(100%)"] }, { duration: 1000, easing: "cubic-bezier(.45,.05,.25,1)", fill: "forwards" }).finished.then(() => band.remove());
    });
  }
  b.addEventListener("click", () => wipe(!B30T.dark()));
})();

/* =====================================================================
   Dark theme — a few stars follow the cursor. As it moves, tiny pixels
   (like the ones twinkling in the footer sky) appear near it, twinkle once
   and fade. Sparse and quiet: just enough light that the night isn't flat.
   ===================================================================== */
(() => {
  if (!window.B30T || !matchMedia("(hover: hover) and (pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const CFG = { every: 26, radius: 90, life: 1100, max: 60 };   // px of travel per star, spread around the cursor, ms each, cap
  const COLS = ["255,255,255", "255,255,255", "209,229,255", "253,204,240"];   // white, ice blue, a little pink — the footer's sparkles
  const cv = document.createElement("canvas"); cv.className = "b30-stars"; cv.setAttribute("aria-hidden", "true");
  document.body.appendChild(cv);
  const g = cv.getContext("2d");
  let W = 0, H = 0, dpr = 1, stars = [], lx = null, ly = null, acc = 0, raf = 0;
  function size() { dpr = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
  size(); addEventListener("resize", size);
  addEventListener("pointermove", (e) => {
    if (!B30T.dark()) return;
    if (lx !== null) acc += Math.hypot(e.clientX - lx, e.clientY - ly);
    lx = e.clientX; ly = e.clientY;
    while (acc > CFG.every) {
      acc -= CFG.every;
      if (stars.length >= CFG.max) stars.shift();
      const a = Math.random() * Math.PI * 2, r = CFG.radius * Math.sqrt(Math.random()), x = lx + Math.cos(a) * r, y = ly + Math.sin(a) * r;
      if (!empty(x, y)) continue;                         // only on the empty night, never over pictures, the globe, words or controls
      stars.push({ x, y, s: Math.random() < 0.8 ? 2 : 3, c: COLS[(Math.random() * COLS.length) | 0], t0: performance.now(), life: CFG.life * (0.6 + Math.random() * 0.8), a: 0.35 + Math.random() * 0.45 });
    }
    if (!raf) raf = requestAnimationFrame(frame);
  }, { passive: true });
  const BUSY = "img,canvas,video,svg,picture,iframe,a,button,input,textarea,h1,h2,h3,h4,p,li,blockquote,figure,.b30h__scene,.b30h__fg,.b30h__copy,.b30h__nav,.b30t__card,.b30s__face,.b30s__hand,.loc,.og__seg,.b30p__a,.b30p__b,.b30p__px,.b30f__c";
  function empty(x, y) {
    const el = document.elementFromPoint(x, y);
    return !!el && !el.closest(BUSY) && !(el.textContent && el.children.length === 0 && el.textContent.trim().length > 0);
  }
  function frame(now) {
    raf = 0;
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
    stars = stars.filter((q) => now - q.t0 < q.life);
    for (const q of stars) {
      const t = (now - q.t0) / q.life, tw = Math.sin(t * Math.PI);           // fade in, twinkle, fade out
      g.fillStyle = `rgba(${q.c},${(q.a * tw).toFixed(3)})`; g.fillRect(q.x - q.s / 2, q.y - q.s / 2 - t * 6, q.s, q.s);
    }
    if (stars.length) raf = requestAnimationFrame(frame);
  }
  addEventListener("b30:theme", () => { stars = []; g.clearRect(0, 0, cv.width, cv.height); });
})();

/* the day/night switch: a real rocker switch (your component), dropped into the header's theme button.
   Light theme = on (right half raised, warm rim and glow); dark theme = off (left half raised). Instant, like a light. */
(() => {
  const b = document.querySelector('.b30-theme'); if (!b) return;
  const half = (side) => `<span class="half ${side}" aria-hidden="true"><span class="fx"><span class="cast soft"></span><span class="cast mid"></span><span class="cast core"></span><span class="glow"></span><span class="rim"></span></span><span class="face"></span></span>`;
  b.classList.add('switch');
  b.innerHTML = `<span class="housing" aria-hidden="true"></span>${half('left')}${half('right')}`;
  b.setAttribute('role', 'switch');
  const sync = () => { const light = !document.documentElement.classList.contains('dark'); b.classList.toggle('is-on', light); b.setAttribute('aria-checked', String(light)); };
  new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] }); sync();
  // sound: the switch's own click (MP3), with a synthesized click if it can't play
  const sound = new Audio('https://cdn.prod.website-files.com/65e5aa08685fd0801726e90f/6ad237d410e72bb59012b861_dragon-studio-light-switch-382712.mp3');
  sound.preload = 'auto'; let broken = false; sound.addEventListener('error', () => (broken = true));
  let ctx;
  const fallback = () => { try { ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); const t = ctx.currentTime, len = Math.floor(ctx.sampleRate * 0.03);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 6);
    const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); src.buffer = buf; f.type = 'bandpass'; f.frequency.value = 2400; g.gain.value = 0.5;
    src.connect(f).connect(g).connect(ctx.destination); src.start(t); } catch (e) {} };
  b.addEventListener('click', () => { if (broken) return fallback(); sound.pause(); sound.currentTime = 0; sound.play().catch(fallback); });
})();

(() => { const r = document.documentElement; r.classList.remove('dark'); new MutationObserver(() => { if (r.classList.contains('dark')) r.classList.remove('dark'); }).observe(r, { attributes: true, attributeFilter: ['class'] }); })();
