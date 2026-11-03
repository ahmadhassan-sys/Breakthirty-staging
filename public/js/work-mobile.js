/* Our Work page on phones: menu, partner pixels, hero overlay, the testimonials deck (block wk-mobile-js).
   Phones only (≤ 899px); nothing here runs on desktop. */
/* ===== Work — phones only (≤ 899 px), per the Figma mobile frame: menu, partner pixels, hero overlay, the testimonials deck ===== */
(() => {
  const MQ = matchMedia('(max-width: 899px)'), RED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  let built = false;
  function boot() { if (built || !MQ.matches) return; built = true; heroDim(); helloBtn(); helloPx(); }
  if (document.readyState === 'complete') boot(); else addEventListener('load', boot);
  MQ.addEventListener && MQ.addEventListener('change', boot);
  // the spine measured the hero before these phone styles arrived: have it measure again
  if (MQ.matches) { const re = () => dispatchEvent(new Event('resize')); requestAnimationFrame(re); addEventListener('load', re); }

  /* ---------- Hero: as the page rises over it, a black overlay to 10 % ---------- */
  function heroDim() {
    const hero = document.querySelector('.wk-hero'); if (!hero) return; let raf = 0;
    const f = () => { raf = 0; if (!MQ.matches) { hero.style.removeProperty('--m-dim'); return; }
      const H = hero.querySelector('.b30h__pin').offsetHeight || 726, d = Math.max(0, Math.min(H, scrollY));
      hero.style.setProperty('--m-dim', (Math.min(1, d / (H * .75)) * .1).toFixed(4)); };
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(f); }, { passive: true }); f();
  }
  /* ---------- "One team…": the button reads Get in touch on phones (as in the Figma) ---------- */
  /* ---------- "One team…": three rows of big pink pixels stepping down into the band (the reference, 50 at 390) ---------- */
  function helloPx() {
    const sec = document.querySelector('.wk-hello'); if (!sec || sec.querySelector('.m-hpx')) return;
    const ROWS = [[-3, [0, 1, 2, 4, 6]], [-2, [0, 1, 2, 3, 5, 6, 7]], [-1, [0, 1, 2, 4, 5, 6]]];   // rows above the band, columns filled
    const box = document.createElement('div'); box.className = 'm-hpx'; box.setAttribute('aria-hidden', 'true');
    box.innerHTML = ROWS.map(([r, cs]) => cs.map((c) => `<i style="left:calc(100vw * ${-8 + c * 50} / 390);top:calc(100vw * ${r * 50} / 390);transition-delay:${RED ? 0 : (-r - 1) * 90 + c * 25}ms"></i>`).join('')).join('');
    sec.appendChild(box);
    new IntersectionObserver(([e], o) => { if (e.isIntersecting) { box.classList.add('is-in'); o.disconnect(); } }, { rootMargin: '0px 0px -10% 0px' }).observe(sec);
  }
  function helloBtn() {
    const l = document.querySelector('.wk-hello__btn [data-lbl], .wk-hello__btn .b30btn__lbl'); if (!l || l.querySelector('span')) return;
    const was = l.textContent; const set = () => { l.textContent = MQ.matches ? 'Get in touch' : was; }; set(); MQ.addEventListener && MQ.addEventListener('change', set);
  }

})();
