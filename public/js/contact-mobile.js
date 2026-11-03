/* Contact page on phones: menu, partner pixels, the form's button, text reveals (block ct-mobile-js).
   Phones only (≤ 899px); nothing here runs on desktop. */
/* ===== Contact — phones only (≤ 899 px), per the Figma mobile frame: menu, partner pixels, the form's button, text reveals ===== */
(() => {
  const MQ = matchMedia('(max-width: 899px)'), RED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  let built = false;
  function boot() { if (built || !MQ.matches) return; built = true; reveals(); }
  if (document.readyState === 'complete') boot(); else addEventListener('load', boot);
  MQ.addEventListener && MQ.addEventListener('change', boot);
  // the globe measured the hero before these phone styles arrived (726 tall, not the screen): have it measure again
  if (MQ.matches) { const re = () => dispatchEvent(new Event('resize')); requestAnimationFrame(re); addEventListener('load', re); }

  /* ---------- the form's button: "Submit your form" with the pixel arrow on phones; desktop keeps "Send a message" ---------- */
  const ARROW_PX = '<svg width="17" height="15" viewBox="0 0 17 15" fill="#000" aria-hidden="true" style="display:block"><path d="M8.1 0h1.35v1.35H8.1zM9.45 1.35h1.35V2.7H9.45zM10.8 2.7h1.35v1.35H10.8zM12.15 4.05h1.35V5.4h-1.35zM13.5 5.4h1.35v1.35H13.5zM0 6.75h13.5V8.1H0zM14.85 6.75h1.35V8.1h-1.35zM13.5 8.1h1.35v1.35H13.5zM12.15 9.45h1.35v1.35h-1.35zM10.8 10.8h1.35v1.35H10.8zM9.45 12.15h1.35v1.35H9.45zM8.1 13.5h1.35v1.35H8.1z"/></svg>';
  const send = document.querySelector('.ctf__send'), sIc = send && send.querySelector(':scope > i'), sLb = send && send.querySelector('[data-lbl]');
  const orig = send ? { ic: sIc ? sIc.innerHTML : '', lb: sLb ? sLb.textContent : '' } : null;
  function sendBtn() { if (!send) return; const m = MQ.matches;
    if (sIc) sIc.innerHTML = m ? ARROW_PX : orig.ic;
    if (sLb && !sLb.querySelector('span')) sLb.textContent = m ? 'Submit your form' : orig.lb;
    send.setAttribute('aria-label', m ? 'Submit your form' : orig.lb); }
  sendBtn(); MQ.addEventListener && MQ.addEventListener('change', sendBtn);

  /* ---------- Text reveals: copy without its own entrance rises in as it arrives ---------- */
  function reveals() {
    if (RED || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' });
    document.querySelectorAll('.ctf__legal').forEach((el, i) => {
      if (el.classList.contains('m-rv') || el.closest('[data-reveal]')) return;
      el.classList.add('m-rv'); el.style.transitionDelay = (el.matches('.b30f__col') ? (i % 2) * 80 : 0) + 'ms'; io.observe(el); });
  }
})();
