/* the dashed-letter strip ("Sketch. Make. Break. Scale.", or the page's own words): hovering it plays the images' reveal — under the cursor a ragged patch
   opens, and inside it the letters' pixels are filled in solid black (the rest stay as dashed outlines) */
(() => {
  const sec = document.querySelector('.mq'), trk = sec && sec.querySelector('.mq__t'); if (!sec || matchMedia('(hover: none)').matches) return;
  const CELLS = JSON.parse(sec.dataset.cells || '[]'), SW = +sec.dataset.w || 4258.36, SH = +sec.dataset.h || 228;   // the page's drawing (components/closing/strips.js)
  const cv = document.createElement('canvas'); cv.className = 'mq__fx'; cv.setAttribute('aria-hidden', 'true'); sec.appendChild(cv); const g = cv.getContext('2d');
  const h = (a, b) => { const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return v - Math.floor(v); };
  let mx = 0, my = 0, sx = 0, sy = 0, hv = 0, want = 0, raf = 0, dpr = 1;
  const size = () => { dpr = Math.min(2, devicePixelRatio || 1); cv.width = Math.round(sec.clientWidth * dpr); cv.height = Math.round(sec.clientHeight * dpr); cv.style.width = sec.clientWidth + 'px'; cv.style.height = sec.clientHeight + 'px'; };   // (sized exactly, so nothing is stretched)
  const frame = () => { raf = 0; hv += (want - hv) * .16; sx += (mx - sx) * .25; sy += (my - sy) * .25;
    if (cv.width !== Math.round(sec.clientWidth * dpr) || cv.height !== Math.round(sec.clientHeight * dpr)) size();
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, cv.width, cv.height);
    const k = document.documentElement.clientWidth / 1920, tx = new DOMMatrix(getComputedStyle(trk).transform).m41, svr = trk.querySelector('svg').getBoundingClientRect(), oy = svr.top - sec.getBoundingClientRect().top + svr.height / SH;   // the drawing's own top (its viewBox starts a unit up)
    const r = hv * 150 * k, sw = SW * k, m = Math.max(6, 12 * k);
    if (r > 1) {
      // the patch: small square pixels around the cursor, with a ragged edge (as on the images)…
      const clip = new Path2D(), gx0 = Math.floor((sx - r - m) / m), gx1 = Math.ceil((sx + r + m) / m), gy0 = Math.floor((sy - r - m) / m), gy1 = Math.ceil((sy + r + m) / m);
      for (let i = gx0; i <= gx1; i++) for (let j = gy0; j <= gy1; j++) { const cx2 = (i + .5) * m, cy2 = (j + .5) * m, d = Math.hypot(cx2 - sx, cy2 - sy) + (h(i, j) - .5) * m * 1.8; if (d < r) clip.rect(i * m, j * m, m, m); }
      // …and inside it only, the letters' own pixels filled solid (their exact shapes, nothing else)
      g.save(); g.clip(clip); g.fillStyle = '#000';
      for (let c = 0; c < 2; c++) for (const q of CELLS) { const x = tx + c * sw + q[0] * k, y = oy + q[1] * k, w = q[2] * k, hh = q[3] * k; if (x + w < sx - r - m || x > sx + r + m) continue; g.fillRect(x, y, w, hh); }
      g.restore(); }
    if (want || hv > .01) raf = requestAnimationFrame(frame); else g.clearRect(0, 0, cv.width, cv.height); };
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
  sec.addEventListener('pointerenter', (e) => { const b = sec.getBoundingClientRect(); mx = sx = e.clientX - b.left; my = sy = e.clientY - b.top; want = 1; kick(); });
  sec.addEventListener('pointermove', (e) => { const b = sec.getBoundingClientRect(); mx = e.clientX - b.left; my = e.clientY - b.top; want = 1; kick(); });
  sec.addEventListener('pointerleave', () => { want = 0; kick(); });
  addEventListener('resize', size); size();
})();
