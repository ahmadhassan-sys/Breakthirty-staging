/* Phones, on top of the phone layer (from the mobile designs, block b30-m5js).
   Phones only (≤ 899px); nothing here runs on desktop. */
/* PHONES (≤ 899 px): the network switch sits inline under the body copy (elsewhere it floats) */
(() => {
  const mq = matchMedia('(max-width: 899px)');
  const place = () => { const sw = document.querySelector('.nx__switch'), top = document.querySelector('.nx-sec .nx__top'); if (!sw || !top) return;
    if (mq.matches) { if (sw.parentElement !== top) top.appendChild(sw); sw.inert = false; sw.classList.remove('is-on', 'nx__fl'); }
    else { sw.classList.add('nx__fl'); if (sw.parentElement !== document.body) { document.body.appendChild(sw); dispatchEvent(new Event('scroll')); } } };
  place(); mq.addEventListener('change', place); addEventListener('load', place); setTimeout(place, 900);
})();
/* PHONES: the services title reads on one line (its desktop line break becomes a space) */
(() => { const t = document.querySelector('#services .b30s__mobile > .b30s__title'); if (!t) return;
  const mq = matchMedia('(max-width: 899px)'), orig = t.innerHTML;
  const set = () => { t.innerHTML = mq.matches ? orig.replace(/<br\s*\/?>/gi, ' ') : orig; }; set(); mq.addEventListener('change', set); })();
/* PHONES: in the vision section, two dashed lines cross the rock (as in the Figma), with a pixel where each meets a side line */
(() => { const sec = document.querySelector('section.vision'); if (!sec) return;
  const mq = matchMedia('(max-width: 899px)');
  const mk = (k) => { const e = document.createElement('div'); e.className = 'vs-rk ' + k; e.setAttribute('aria-hidden', 'true'); e.innerHTML = '<i></i><i></i>'; sec.appendChild(e); return e; };
  const T = mk('t'), B = mk('b');
  const place = () => { const st = sec.querySelector('.vs-stone'), on = mq.matches && st && st.offsetWidth;
    T.style.display = B.style.display = on ? '' : 'none'; if (!on) return;
    const s = sec.getBoundingClientRect(), r = st.getBoundingClientRect(), sides = [...sec.querySelectorAll('.vs-vl, .vs-side')].map((e) => e.getBoundingClientRect()).filter((q) => q.width < 4 && q.height > 100);
    const xs = sides.length >= 2 ? [Math.min(...sides.map((q) => q.left)), Math.max(...sides.map((q) => q.left))] : [20, s.width - 21];
    const y1 = r.top - s.top + r.height * .07, y2 = r.top - s.top + r.height * .76;   // (Figma: 14 px under the rock's top, 51 above its foot)
    [[T, y1], [B, y2]].forEach(([e, y]) => { e.style.top = Math.round(y) + 'px'; const [a, b] = e.children; a.style.left = Math.round(xs[0] - 2) + 'px'; b.style.left = Math.round(xs[1] - 2) + 'px'; }); };
  addEventListener('load', () => setTimeout(place, 300)); addEventListener('resize', place); mq.addEventListener('change', place); setTimeout(place, 1500);
})();
/* PHONES: the vision section's top line, 64 above the heading, with a pixel where it meets each side line */
(() => { const sec = document.querySelector('section.vision'); if (!sec) return;
  const mq = matchMedia('(max-width: 899px)');
  const ln = document.createElement('div'); ln.className = 'vs-tl'; ln.setAttribute('aria-hidden', 'true'); ln.innerHTML = '<i></i><i></i>'; sec.appendChild(ln);
  const place = () => { const big = sec.querySelector('.vs-big'); const on = mq.matches && big; ln.style.display = on ? '' : 'none'; if (!on) return;
    const s = sec.getBoundingClientRect(), b = big.getBoundingClientRect(), y = Math.max(0, Math.round(b.top - s.top - 64));
    ln.style.top = y + 'px'; sec.style.setProperty('--vtl', y + 'px');
    const sides = [...sec.querySelectorAll('.vs-vl, .vs-side')].map((e) => e.getBoundingClientRect()).filter((q) => q.width < 4 && q.height > 100);
    const xs = sides.length >= 2 ? [Math.min(...sides.map((q) => q.left)), Math.max(...sides.map((q) => q.left))] : [16, s.width - 17];
    ln.children[0].style.left = Math.round(xs[0] - 1.5) + 'px'; ln.children[1].style.left = Math.round(xs[1] - 1.5) + 'px'; };
  addEventListener('load', () => setTimeout(place, 300)); addEventListener('resize', place); mq.addEventListener('change', place); setTimeout(place, 1500);
})();
/* PHONES: keep the network switch under the body copy, however late the section's script (re)builds things */
(() => { const mq = matchMedia('(max-width: 899px)');
  const fix = () => { if (!mq.matches) return; const sw = document.querySelector('.nx__switch'), top = document.querySelector('.nx-sec .nx__top'); if (!sw || !top) return;
    if (sw.parentElement !== top) top.appendChild(sw); sw.classList.remove('nx__fl', 'is-on'); sw.inert = false; sw.hidden = false;
    const L = { partner: 'Partners', global: 'Global' }; sw.querySelectorAll('button[data-to]').forEach((b) => { if (!b.textContent.trim()) b.textContent = L[b.dataset.to] || b.dataset.to; }); };
  let n = 0; const t = setInterval(() => { fix(); if (++n > 20) clearInterval(t); }, 500);
  addEventListener('load', fix); addEventListener('scroll', () => { if (mq.matches) fix(); }, { passive: true });
})();

/* PHONES: the services scene from the Figma — state 1 (the hands about to touch a small white pixel) as you arrive, then, as you
   scroll on, the hands part (each ending 16 from the card), the pixel grows into the card and turns in as on desktop, and the
   loose pixels drift off the screen; once it has landed, swipe (or tap a dot) to turn the card to the next service */
(() => {
  const sec = document.getElementById('services'), mob = sec && sec.querySelector('.b30s__mobile'); if (!mob) return;
  const mq = matchMedia('(max-width: 899px)'), RED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const faces = [...mob.querySelectorAll('.m-cards .b30s__face')]; if (faces.length !== 4) return;
  const rSrc = sec.querySelector('.b30s__handimg.robot'), hSrc = sec.querySelector('.b30s__handimg.human'); if (!rSrc || !hSrc) return;
  const label = mob.querySelector('.b30s__label'), lede = mob.querySelector('.b30s__lede'), title = mob.querySelector('.b30s__title');
  const sc = document.createElement('div'); sc.className = 'mc';
  sc.innerHTML = `<div class="mc__k">
      <div class="mc__hd"><p class="mc__eye">${label ? label.textContent : 'Services'}</p><h2 class="mc__h">${title ? title.innerHTML.replace(/<br\s*\/?>/gi, ' ') : 'Solutions we provide'}</h2><p class="mc__p">${lede ? lede.textContent : ''}</p></div>
      <div class="mc__pxs" aria-hidden="true"></div>
      <img class="mc__hand r" alt="" aria-hidden="true" draggable="false"><img class="mc__hand h" alt="" aria-hidden="true" draggable="false">
      <div class="mc__box"><div class="mc__cube"></div></div>
      <div class="mc__dots" role="group" aria-label="Services">${faces.map((f, i) => `<button type="button" aria-label="${(f.querySelector('.svc__name') || {}).textContent || 'Service ' + (i + 1)}"></button>`).join('')}</div>
    </div>`;
  mob.appendChild(sc); mob.classList.add('has-mc');
  const k = sc.querySelector('.mc__k'), R = sc.querySelector('.mc__hand.r'), H = sc.querySelector('.mc__hand.h'), box = sc.querySelector('.mc__box'), cube = sc.querySelector('.mc__cube'), dots = [...sc.querySelectorAll('.mc__dots button')], dotsEl = sc.querySelector('.mc__dots'), pxBox = sc.querySelector('.mc__pxs');
  R.src = rSrc.getAttribute('src'); H.src = hSrc.getAttribute('src');
  faces.forEach((f, i) => { f.classList.add('mc__f'); f.style.setProperty('--i', i); cube.appendChild(f); });
  // Figma geometry in the 390-wide frame: [x, y, width]  (state 1 = "1st stage", state 2 = the services frame)
  const A = { r: [-20, 362, 227], h: [190, 491, 216], b: [181, 456, 40] }, B = { r: [-114, 319, 367], h: [183, 774, 299], b: [63, 494, 264] };
  // a few loose pixels round the fingertips, some tucked under the hands; they drift away as the hands part
  // three pixels tucked under the lower hand, riding with it (offsets from the hand's top-left, in its own 299-wide frame)
  // each hand's real shape: its height for its width, and where its picture actually ends (the robot's lowest fingertip, the
  // human's highest), so the gap above the box and the gap below it are measured to the hands themselves
  const M = { rh: 450 / 990.5, hh: 450 / 1046.5, rb: 1, ht: 0 };
  const edge = (img, bottom) => { try { const w = 120, h = Math.max(1, Math.round(w * img.naturalHeight / img.naturalWidth)), c = document.createElement('canvas'); c.width = w; c.height = h;
      const x = c.getContext('2d'); x.drawImage(img, 0, 0, w, h); const d = x.getImageData(0, 0, w, h).data;
      if (bottom) { for (let y = h - 1; y >= 0; y--) for (let i = 0; i < w; i++) if (d[(y * w + i) * 4 + 3] > 60) return (y + 1) / h; }
      else { for (let y = 0; y < h; y++) for (let i = 0; i < w; i++) if (d[(y * w + i) * 4 + 3] > 60) return y / h; } } catch (e) {} return bottom ? 1 : 0; };
  const measure = () => { if (R.naturalWidth) { M.rh = R.naturalHeight / R.naturalWidth; M.rb = edge(R, true); } if (H.naturalWidth) { M.hh = H.naturalHeight / H.naturalWidth; M.ht = edge(H, false); } kick(); };
  R.addEventListener('load', measure); H.addEventListener('load', measure);
  const pxs = [];
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t;
  const io = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2), oc = (t) => 1 - Math.pow(1 - t, 3);
  let s = 1, cur = 0, goal = 0, raf = 0, landed = false, n = 0, ang = 0;
  const fit = () => { s = sc.clientWidth / 390; k.style.transform = `scale(${s})`; sc.style.height = 989 * s + 'px'; };
  const target = () => { if (RED) return 1; const r = sc.getBoundingClientRect(); return clamp(-r.top / (380 * s)); };   // state 1 while the section's top reaches the top of the screen; state 2 after 380 more
  const setFace = (instant) => { if (instant) cube.style.transition = 'none';
    cube.style.transform = `translateZ(-132px) rotateY(${ang}deg)`; if (instant) { void cube.offsetWidth; cube.style.transition = ''; }
    const f = ((n % 4) + 4) % 4; faces.forEach((el, i) => { const on = landed && i === f; el.classList.toggle('is-front', on); el.setAttribute('aria-hidden', String(!on)); el.querySelectorAll('a').forEach((a) => (a.tabIndex = on ? 0 : -1)); });
    dots.forEach((d, i) => d.setAttribute('aria-pressed', String(landed && i === f))); };
  function draw() { raf = 0; if (!mq.matches) return;
    goal = target(); cur += (goal - cur) * (RED ? 1 : .14); if (Math.abs(goal - cur) < .0005) cur = goal; else raf = requestAnimationFrame(draw);
    const g = oc(clamp(cur / .9));
    // the pixel grows into the card, turning as it comes (as on desktop): -120° to square on, landing on Design
    const bx = lerp(A.b[0] + A.b[2] / 2, B.b[0] + B.b[2] / 2, g), by = lerp(A.b[1] + A.b[2] / 2, B.b[1] + B.b[2] / 2, g), bs = lerp(A.b[2], B.b[2], g) / B.b[2];
    box.style.transform = `translate3d(${bx - 132}px,${by - 132}px,0) scale(${bs})`;
    // the hands ride on the box: the upper one just above its top edge, the lower one just below its foot, so the box grows
    // between them (touching at first, 16 apart once it has landed); sideways they ease from state 1 to state 2
    const half = bs * 132, gap = lerp(3, 8, g);
    const rw = lerp(A.r[2], B.r[2], g), hw = lerp(A.h[2], B.h[2], g);
    const ry = by - half - gap - rw * M.rh * M.rb, hy = by + half + gap - hw * M.hh * M.ht, rx = lerp(A.r[0], B.r[0], g), hx = lerp(A.h[0], B.h[0], g);
    R.style.transform = `translate3d(${rx}px,${ry}px,0) scale(${rw / B.r[2]})`; H.style.transform = `translate3d(${hx}px,${hy}px,0) scale(${hw / B.h[2]})`;
    if (!landed) { ang = -120 * Math.pow(1 - g, 1.2); setFace(true); }
    sc.style.setProperty('--fc', clamp((cur - .82) / .16).toFixed(3));
    const live = cur > .97; if (live && !landed) { landed = true; n = 0; ang = 0; setFace(true); sc.classList.add('is-live'); }
    else if (!live && landed) { landed = false; sc.classList.remove('is-live'); }

  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(draw); };
  const turn = (dir) => { if (!landed) return; n += dir; ang -= 90 * dir; setFace(); };
  const goTo = (i) => { if (!landed) return; let d = i - (((n % 4) + 4) % 4); if (d > 2) d -= 4; if (d < -2) d += 4; if (d) turn(d); };
  let t0 = null;
  k.addEventListener('touchstart', (e) => { const t = e.touches[0]; t0 = { x: t.clientX, y: t.clientY }; }, { passive: true });
  k.addEventListener('touchend', (e) => { if (!t0) return; const t = e.changedTouches[0], dx = t.clientX - t0.x, dy = t.clientY - t0.y; t0 = null; if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) turn(dx < 0 ? 1 : -1); }, { passive: true });
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
  const init = () => { if (!mq.matches) return; fit(); cur = target(); measure(); draw(); };
  init(); addEventListener('scroll', kick, { passive: true }); addEventListener('resize', () => { fit(); kick(); }); mq.addEventListener('change', init); addEventListener('load', init);
})();
/* PHONES: case-study titles never leave one word alone on the last line (the last two words stay together) */
(() => { const glue = () => document.querySelectorAll('.work .row h3').forEach((h) => { if (h.dataset.glued) return; const ws = [...h.querySelectorAll(':scope .w')];
    if (ws.length >= 3) { const a = ws[ws.length - 2], b = ws[ws.length - 1], wrap = document.createElement('span'); wrap.style.whiteSpace = 'nowrap'; a.before(wrap); const mid = a.nextSibling; wrap.append(a); if (mid && mid !== b) wrap.append(mid); wrap.append(b); }
    else { h.style.textWrap = 'balance'; } h.dataset.glued = '1'; });
  if (document.readyState === 'complete') glue(); else addEventListener('load', glue); setTimeout(glue, 1200); })();

/* PHONES: the services wheel in the hero sits 32 under Say hello (and is never hidden on short screens) */
(() => { const mq = matchMedia('(max-width: 899px)'), hero = document.querySelector('.b30h'); if (!hero) return;
  const place = () => { if (!mq.matches || scrollY > 40) return; const say = hero.querySelector('.b30h__btn--line'), ring = hero.querySelector('.b30h__ring'); if (!say || !ring) return;
    hero.classList.remove('no-wheel'); const cur = parseFloat(getComputedStyle(hero).getPropertyValue('--ringY')) || 0;
    const outerC = [...ring.querySelectorAll('circle')].sort((a, b) => b.getAttribute('r') - a.getAttribute('r'))[0], top = (outerC || ring).getBoundingClientRect().top;
    const d = (say.getBoundingClientRect().bottom + 32) - top; hero.style.setProperty('--ringY', (cur + d).toFixed(1) + 'px'); };
  window.__b30RingPlace = place;
  const run = () => { place(); setTimeout(place, 400); setTimeout(place, 1200); };
  if (document.readyState === 'complete') run(); else addEventListener('load', run); addEventListener('resize', () => setTimeout(place, 100));
})();

/* PHONES: the hero wheel — the words stay exactly where the homepage puts them (and can be dragged round, as there); the two
   dashed circles are drawn around them: the outer one 24 px above the letters, the inner one 24 px below the line they sit on */
(() => { const mq = matchMedia('(max-width: 899px)'), ring = document.querySelector('.b30h__ring'); if (!ring) return;
  const cs = [...ring.querySelectorAll('circle')]; if (cs.length < 2) return; const r0 = cs.map((c) => c.getAttribute('r'));
  const NS = 'http://www.w3.org/2000/svg';
  let grad = ring.querySelector('#m-ring-fade');
  if (!grad) { grad = document.createElementNS(NS, 'linearGradient'); grad.id = 'm-ring-fade'; grad.setAttribute('gradientUnits', 'userSpaceOnUse'); grad.setAttribute('x1', '702'); grad.setAttribute('x2', '702'); grad.setAttribute('y1', '-80'); grad.setAttribute('y2', '560');
    grad.innerHTML = '<stop offset="0" stop-color="#000" stop-opacity=".15"/><stop offset=".55" stop-color="#000" stop-opacity=".15"/><stop offset="1" stop-color="#000" stop-opacity="0"/>';
    (ring.querySelector('defs') || ring).appendChild(grad); }
  const set = () => { const w0 = document.querySelector('.b30h__words'); if (w0) w0.style.transform = '';
    if (!mq.matches) { cs.forEach((c, i) => { c.setAttribute('r', r0[i]); c.removeAttribute('stroke'); }); return; }
    const w = ring.getBoundingClientRect().width; if (!w) return; const per = 1404 / w, big = Math.max(...r0.map(Number));
    cs.forEach((c, i) => { c.setAttribute('r', (Number(r0[i]) === big ? 663.5 + 24 * per : 639.5 - 24 * per).toFixed(1)); c.setAttribute('stroke', 'url(#m-ring-fade)'); });
    if (window.__b30RingPlace) window.__b30RingPlace(); };
  const run = () => { set(); setTimeout(set, 600); }; if (document.readyState === 'complete') run(); else addEventListener('load', run); addEventListener('resize', set); mq.addEventListener('change', set);
})();
