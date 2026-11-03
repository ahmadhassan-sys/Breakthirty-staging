/* hero: once the partners strip under it is half in view, the hero's content moves down with the scroll (at half
   speed), so the page slides up over it. Nothing moves before that point. */
window.WK_HERO_DRIFT = { rate: 0.5, at: 0.5, dim: 0.15, dimOver: 0.6 };   // dim: black overlay at most; dimOver: share of the screen height it takes to get there
(() => {
  const hero = document.querySelector('.wk-hero'), stage = hero && hero.querySelector('.b30h__stage');
  const strip = document.querySelector('.wk-hero + .b30-main > .b30p');
  if (!stage || !strip) return;
  const C = window.WK_HERO_DRIFT, RED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let top = 0, hgt = 0, raf = 0;
  const measure = () => { let y = 0, n = strip; while (n) { y += n.offsetTop; n = n.offsetParent; } top = y; hgt = strip.offsetHeight; };
  const frame = () => { raf = 0;
    if (RED || innerWidth < 900) { stage.style.transform = ''; hero.style.removeProperty('--wk-dim'); return; }
    const start = top + hgt * C.at - innerHeight;
    const d = Math.max(0, Math.min(hero.offsetHeight, scrollY - start));
    stage.style.transform = d > 0 ? `translate3d(0,${(d * C.rate).toFixed(1)}px,0)` : '';
    hero.style.setProperty('--wk-dim', (Math.min(1, d / (innerHeight * C.dimOver)) * C.dim).toFixed(4));
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
  measure(); frame();
  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', () => { measure(); kick(); });
  addEventListener('load', () => { measure(); kick(); });
})();
/* the hero waits (hidden) for its layout, as on the homepage — but the homepage's hero script is what ends the wait, and
   this page doesn't have it, so the hero sat hidden for the full 6s fallback. End the wait as soon as the fonts are in. */
(() => {
  const html = document.documentElement; if (!html.classList.contains('b30h-pre')) return;
  const go = () => requestAnimationFrame(() => requestAnimationFrame(() => html.classList.remove('b30h-pre')));
  Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise((r) => setTimeout(r, 700))]).then(go);
})();
/* featured project: hovering its picture plays its "View case study" button's hover */
(() => {
  const f = document.querySelector('.wk-feat'), media = f && f.querySelector('.wk-media'), btn = f && f.querySelector('.wk-vcs'); if (!media || !btn) return;
  media.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'mouse') return; btn.classList.add('is-hov'); btn.dispatchEvent(new Event('pointerenter')); });
  media.addEventListener('pointerleave', () => { if (!btn.classList.contains('is-hov')) return; btn.classList.remove('is-hov'); btn.dispatchEvent(new Event('pointerleave')); });
})();
