/* the globe's cities → the office card in the hero's top right corner: hovering a city writes its details in (the
   letters tumble through ASCII and settle, as on the homepage's globe); leaving lets it go after a moment */
(() => {
  const S = document.getElementById('hero-globe'), card = document.querySelector('.cth__office'); if (!S || !card) return;
  const LOC = (window.B30_CONTENT.network || {}).locations || [];   // the offices: edit them in src/data/partners.js
  const OFFICE = Object.fromEntries(LOC.filter((l) => l.office).map((l) => [l.city, l.office]));
  const GLY = '!<>-_\\/[]{}=+*^?#%&@$ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
  const scramble = (el, text, delay) => { const t0 = performance.now() + delay, dur = 520 + text.length * 22;
    (function tick(now) { const q = (now - t0) / dur; let out = '';
      for (let c = 0; c < text.length; c++) { const at = c / Math.max(1, text.length) * .7; out += text[c] === ' ' ? ' ' : (q > at + .3 ? text[c] : q > at ? GLY[(Math.random() * GLY.length) | 0] : ' '); }
      el.textContent = out; if (q < 1.05) requestAnimationFrame(tick); else el.textContent = text; })(performance.now()); };
  const clock = (tz) => new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: tz }).replace(' ', '');
  const [c1, c2, c3, c4] = card.children;
  let shown = null, timer = 0, hideT = 0;
  const tags = () => [...S.querySelectorAll('.locs .loc')];
  function show(el) {
    const city = (el.querySelector('.name') || {}).textContent; if (!city || shown === city) return;
    const L = LOC.find((l) => l.city === city) || {}, info = OFFICE[city] || { country: L.region || '', phone: '' };
    shown = city; card.classList.add('on');
    scramble(c1, city.toUpperCase(), 40); scramble(c2, (info.country || '').toUpperCase(), 140);
    c3.textContent = ''; if (L.tz) scramble(c3, clock(L.tz), 100); c4.textContent = ''; if (info.phone) scramble(c4, info.phone, 260);
    clearInterval(timer); if (L.tz) timer = setInterval(() => { if (shown === city) c3.textContent = clock(L.tz); }, 15000);
    tags().forEach((t) => t.classList.toggle('is-on', t === el));
  }
  function hide() { shown = null; card.classList.remove('on'); clearInterval(timer); tags().forEach((t) => t.classList.remove('is-on')); }
  const wire = () => tags().forEach((el) => { if (el._wired) return; el._wired = 1; const c = el.querySelector('.card') || el;
    const live = () => parseFloat(el.style.opacity || '0') > .3;           // only a city you can actually see
    c.addEventListener('pointerenter', () => { if (!live()) return; clearTimeout(hideT); show(el); });
    c.addEventListener('pointerleave', () => { hideT = setTimeout(() => { if (shown) hide(); }, 450); });
    c.addEventListener('click', (e) => { e.stopPropagation(); if (!live()) return; if (shown === (el.querySelector('.name') || {}).textContent && e.pointerType !== 'mouse') hide(); else show(el); }); });
  wire(); setTimeout(wire, 1500);
  // a city that turns round behind the globe while it's open closes the card
  setInterval(() => { if (!shown) return; const el = tags().find((t) => t.classList.contains('is-on')); if (el && parseFloat(el.style.opacity || '0') < .15) hide(); }, 300);
})();
