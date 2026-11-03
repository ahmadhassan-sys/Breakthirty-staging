/* Services page on phones (block svmjs).
   Phones only (≤ 899px); nothing here runs on desktop. */
/* ===== SERVICES PAGE — phones: each discipline as in the Figma (the picture box sticks at the top while its list scrolls; tap a
   service to read its line and see its icon), and the homepage's pixel band in yellow over "Good things happen…" ===== */
(() => {
  const mq = matchMedia('(max-width: 899px)'); if (!mq.matches) return;
  const RED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), oc = (t) => 1 - Math.pow(1 - t, 3);
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const PHONE = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.5 1.5h3l1.5 3.5-2 1.5c.9 1.8 2.2 3.1 4 4l1.5-2 3.5 1.5v3c0 .6-.4 1-1 1C7.6 14 2 8.4 1.5 2.5c0-.6.4-1 1-1z" stroke="#000" stroke-width="1.1" stroke-linejoin="round"/></svg>';

  /* --- the rectangle of pixels behind each icon: denser toward the edges, iridescent at the rim, a slow drift and a light sweep --- */
  const IRI = ['#3457BA', '#B0E9FD', '#FAD7FF', '#F95050', '#B0E9FD', '#3457BA', '#FAD7FF', '#0D1432'], DEEP = ['#0D1432', '#3457BA'];
  function rectField(cv, seed) {
    const g = cv.getContext('2d'); let W = 0, H = 0, dpr = 1, P = [], vis = false, raf = 0;
    let s = seed * 9301 + 49297; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    const build = () => { const r = cv.getBoundingClientRect(); W = r.width; H = r.height; if (!W) return; dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); P = []; let tries = 0;
      while (P.length < 1500 && tries++ < 30000) { const x = rnd() * W, y = rnd() * H, d = Math.min(x, y, W - x, H - y);
        if (rnd() > 0.06 + 0.94 * Math.exp(-d / 16)) continue; const rim = d < 10, k = rnd();
        P.push({ x, y, s: k < 0.45 ? 1.4 : k < 0.85 ? 1.9 : 2.5, c: rim ? IRI[(rnd() * IRI.length) | 0] : DEEP[(rnd() * 2) | 0], a: rim ? 0.75 : 0.22 + rnd() * 0.3, ph: rnd() * 6.283, f: 0.12 + rnd() * 0.2 }); } };
    const draw = (now) => { raf = 0; if (!vis) return; const t = RED ? 0 : now / 1000; g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
      for (const p of P) { const dx = RED ? 0 : Math.sin(t * p.f * 6.283 + p.ph) * 1.2, dy = RED ? 0 : Math.cos(t * p.f * 5.1 + p.ph * 1.7) * 1.2;
        g.globalAlpha = p.a; g.fillStyle = p.c; g.fillRect(Math.round(p.x + dx - p.s / 2), Math.round(p.y + dy - p.s / 2), p.s, p.s); }
      g.globalAlpha = 1; if (!RED) raf = requestAnimationFrame(draw); };
    new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis && !raf) raf = requestAnimationFrame(draw); }, { rootMargin: '80px 0px' }).observe(cv);
    build(); addEventListener('resize', () => { build(); if (vis && !raf) raf = requestAnimationFrame(draw); });
  }

  function services() {
    const H = window.SV_HOLO;
    document.querySelectorAll('section.svx .svx__p').forEach((art, ai) => {
      if (art.querySelector('.svm-box')) return;
      const c = art.dataset.c || '#3457BA';
      const btns = [...art.querySelectorAll('.svx__s')].sort((a, b) => a.dataset.i - b.dataset.i);
      art.classList.add('svm-p');
      const box = document.createElement('div'); box.className = 'svm-box'; box.setAttribute('aria-hidden', 'true');
      box.innerHTML = '<canvas class="svm-rect"></canvas><div class="sv-px"><canvas></canvas></div><i class="svm-fr h t"></i><i class="svm-fr h b"></i><i class="svm-fr v l"></i><i class="svm-fr v r"></i>';
      const list = document.createElement('ul'); list.className = 'svm-list'; list.setAttribute('aria-label', (art.querySelector('.svx__name') || {}).textContent + ' services');
      list.innerHTML = btns.map((b) => `<li><button type="button" class="svm-s" aria-pressed="false" data-t="${esc(b.dataset.t)}" title="${esc(b.dataset.d || '')}"><i aria-hidden="true"></i><span class="t">${esc(b.dataset.t)}</span></button></li>`).join('');
      const cta = document.createElement('a'); cta.className = 'svm-cta'; cta.href = 'contact.html';
      cta.innerHTML = `<span class="ic" aria-hidden="true">${PHONE}</span><span class="lb">Get in touch</span>`;
      const stk = document.createElement('div'); stk.className = 'svm-stk';
      const hd = art.querySelector('.svx__hd'); hd.after(stk); stk.append(box, list);
      const tail = document.createElement('ul'); tail.className = 'svm-list svm-tail'; tail.setAttribute('aria-hidden', 'false');
      if (list.lastElementChild) tail.appendChild(list.lastElementChild); stk.after(tail); tail.after(cta);
      rectField(box.querySelector('.svm-rect'), ai + 1);
      let field = null;
      try { if (H && H.HoloField) { field = new H.HoloField(box.querySelector('.sv-px')); field.S = []; field.dust = null; field.makeDust = function () { this.dust = null; }; field.o.morphMs = 300; field.o.morphSpread = 70; field.setIcon(btns[0].dataset.t, c); } } catch (e) { field = null; }
      // the service just under the picture box is the one shown: scrolling the list walks the icon through every service; a tap picks one
      const rows = [...art.querySelectorAll('.svm-s')]; let cur = null, held = 0;
      const open = (r) => { if (r === cur) return; cur = r; rows.forEach((x) => { const y = x === r; x.classList.toggle('is-on', y); x.setAttribute('aria-pressed', String(y)); }); if (field) field.setIcon(r.dataset.t, c); };
      open(rows[0]);
      rows.forEach((r) => r.addEventListener('click', () => { held = performance.now(); open(r); }));
      let raf = 0; const follow = () => { raf = 0; if (performance.now() - held < 900) return; const br = box.getBoundingClientRect(); if (br.bottom < 0 || br.top > innerHeight) return;
        const y = br.bottom + 34; let pick = rows[0]; for (const r of rows) { const q = r.getBoundingClientRect(); if (q.bottom > y) { pick = r; break; } pick = r; } open(pick); };
      addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(follow); }, { passive: true });
      // the same scroll reveals as the homepage
      if (!RED) { const io = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
        [box, ...list.children, ...tail.children, cta].forEach((el, i) => { el.classList.add('m-rv'); el.style.transitionDelay = (el.tagName === 'LI' ? Math.min(6, i) * 40 : 0) + 'ms'; io.observe(el); }); }
    });
  }

  /* --- "Good things happen…": the homepage services band, in yellow (50 px pixels, built as you arrive) --- */
  function yellowBand() {
    const sec = document.querySelector('section.svhello'); if (!sec || sec.querySelector('.svm-yb')) return;
    const CELL = 80, TOP = -206, BOTTOM = 506, s = 50 / CELL;
    const FIG = { '-239': [8, 9, 10, 12, 14, 17, 18, 19, 20, 21], '-159': [1, 5, 6, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 20], '-79': [1, 3, 4, 6, 8, 9, 10, 12, 13, 14, 16, 17, 18, 21, 23] };
    const rr = (n) => { const v = Math.sin(n * 91.345 + 7.13) * 43758.5453; return v - Math.floor(v); };
    const cells = []; let n = 0;
    for (let y = -239; y < BOTTOM; y += CELL) { const row = FIG[String(y)], yn = (y - TOP) / (BOTTOM - TOP);
      for (let c = 0; c < 24; c++) { n++; if (row && !row.includes(c)) continue; if (y >= 0) continue; cells.push({ x: c * CELL, y, t0: (1 - yn) * 0.62 + rr(n) * 0.2 }); } }   // (only the stepped rows above the section: its own yellow carries on below)
    const cv = document.createElement('canvas'); cv.className = 'svm-yb'; cv.setAttribute('aria-hidden', 'true'); sec.prepend(cv);
    const ctx = cv.getContext('2d'); let dpr = 1, ox = 0, cur = 0, last = -1, raf = 0;
    const size = () => { const W = document.documentElement.clientWidth; ox = (W - 1920 * s) / 2; dpr = Math.min(devicePixelRatio || 1, 2);
      cv.style.top = TOP * s + 'px'; cv.style.height = (BOTTOM - TOP) * s + 'px'; cv.width = Math.round(W * dpr); cv.height = Math.round((BOTTOM - TOP) * s * dpr); last = -1; draw(); };
    const prog = () => RED ? 1 : clamp((innerHeight + 100 - (sec.getBoundingClientRect().top + TOP * s)) / (innerHeight * 0.8));
    function draw() { raf = 0; const goal = prog(); cur += (goal - cur) * (RED ? 1 : 0.13); if (Math.abs(goal - cur) < 0.0006) cur = goal; if (cur !== goal) raf = requestAnimationFrame(draw);
      if (Math.abs(cur - last) < 0.0002) return; last = cur;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.setTransform(s * dpr, 0, 0, s * dpr, ox * dpr, -TOP * s * dpr); ctx.fillStyle = '#F2E907';
      for (const c of cells) { const a = clamp((cur - c.t0) / 0.05); if (a <= 0) continue; const e = oc(a), sz = CELL * (0.74 + 0.26 * e) + 1, o = (CELL - sz) / 2; ctx.globalAlpha = e; ctx.fillRect(c.x + o, c.y + o, sz, sz); }
      ctx.globalAlpha = 1; }
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(draw); }, { passive: true }); addEventListener('resize', size); size();
    // the section's own yellow starts under the band's solid part
    sec.style.setProperty('background', 'linear-gradient(180deg,#F2E907 1%,#fff 84%)', 'important');
    // its button reads "Get in touch" (as in the Figma)
    const b = sec.querySelector(':scope > .b30h__btn [data-lbl]'); if (b) { b.textContent = 'Get in touch'; b.style.width = ''; b.parentElement.setAttribute('aria-label', 'Get in touch'); }
  }

  function heroTiles() {
    const idx = document.querySelector('section.wk-hero .svh__idx'); if (!idx || idx.dataset.tiles) return; idx.dataset.tiles = '1';
    const arts = [...document.querySelectorAll('section.svx .svx__p')], IC = window.SV_ICONS || {};
    const DEEP = ['#0D1432', '#3457BA'];
    idx.classList.add('svm-tiles');
    [...idx.querySelectorAll('a')].forEach((a, i) => {
      const art = arts[i]; if (!art) return; const n = art.querySelectorAll('.svx__s').length, c = art.dataset.c || '#3457BA';
      const first = [...art.querySelectorAll('.svx__s')].sort((x, y) => x.dataset.i - y.dataset.i)[0];
      const names = [...art.querySelectorAll('.svx__s')].sort((x, y) => x.dataset.i - y.dataset.i).map((b) => b.dataset.t);
      a.innerHTML = `<span class="k"><i style="--pc:${c}"></i>0${i + 1}</span><canvas class="ic" aria-hidden="true"></canvas><span class="nm">${esc(a.textContent.trim())}</span><span class="tk" aria-hidden="true"><span class="tk__i">${esc(names[0] || '')}</span></span>`;
      // the line under the name walks through the discipline's services, one at a time
      if (!RED && names.length > 1) { const tk = a.querySelector('.tk'); let j = 0;
        setTimeout(() => setInterval(() => { j = (j + 1) % names.length; const old = tk.querySelector('.tk__i'), nu = document.createElement('span'); nu.className = 'tk__i is-in'; nu.textContent = names[j];
          tk.appendChild(nu); old.classList.add('is-out'); setTimeout(() => old.remove(), 520); requestAnimationFrame(() => requestAnimationFrame(() => nu.classList.remove('is-in'))); }, 2400), i * 600); }
      // the discipline's icon in pixels: the outline rasterised on its 24-unit grid, one square per filled cell
      const cv = a.querySelector('.ic'), paths = first && IC[first.dataset.t]; if (!paths) return;
      const G = 24, k = 4, off = document.createElement('canvas'); off.width = off.height = G * k; const o = off.getContext('2d');
      o.scale(k, k); o.lineWidth = 2.1; o.lineCap = o.lineJoin = 'round'; o.strokeStyle = '#000'; paths.forEach((d) => { try { o.stroke(new Path2D(d)); } catch (e) {} });
      const D = o.getImageData(0, 0, G * k, G * k).data, P = 3, dpr = Math.min(2, devicePixelRatio || 1); cv.width = cv.height = G * 2 * P * dpr / 2 * 2 / 2 * 2; cv.width = cv.height = Math.round(G * P * dpr);
      const g = cv.getContext('2d'); g.scale(dpr, dpr); let r = (i + 1) * 977;
      const rnd = () => ((r = (r * 9301 + 49297) % 233280) / 233280);
      for (let y = 0; y < G; y++) for (let x = 0; x < G; x++) { let hit = 0; for (let yy = 0; yy < k; yy++) for (let xx = 0; xx < k; xx++) if (D[((y * k + yy) * G * k + x * k + xx) * 4 + 3] > 80) hit++;
        if (hit < k * k * 0.3) continue; const q = rnd(); g.fillStyle = q < 0.25 ? c : DEEP[q < 0.65 ? 0 : 1]; g.fillRect(x * P, y * P, P, P); }   // whole squares on whole pixels, like every other pixel on the site
    });
  }
  /* the hero stays put and the page slides up over it */
  function heroPin() { document.documentElement.classList.add('svm-pin');
    const st = document.querySelector('section.wk-hero .b30h__stage'); if (!st) return;
    const ov = document.createElement('div'); ov.className = 'svm-ov'; ov.setAttribute('aria-hidden', 'true'); st.appendChild(ov);
    const kids = [...st.querySelectorAll(':scope > .svh__title, :scope > .svh__intro, :scope > .svh__idx')];
    let raf = 0; const tick = () => { raf = 0; const h = st.offsetHeight || innerHeight, p = clamp(scrollY / h);
      ov.style.opacity = (p * 0.1).toFixed(3);
    };
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(tick); }, { passive: true }); tick(); }
  function heroMedia() {
    const hero = document.querySelector('section.wk-hero'), idx = hero && hero.querySelector('.svh__idx'), media = hero && hero.querySelector('.svh__media'), IM = window.SV_HERO_IMGS;
    if (!idx || !media || !IM || idx.dataset.m) return; idx.dataset.m = '1';
    const imgs = [...media.querySelectorAll('.wk-media__in img')]; if (!imgs.length) return;
    const keys = ['design', 'engineering', 'marketing', 'ai'], sets = {}; let n = 1;
    keys.forEach((k) => { const c = (IM[k] || []).length; sets[k] = Array.from({ length: c }, (_, i) => n + i); n += c; });
    media.classList.add('is-m'); imgs.forEach((im) => im.classList.remove('is-on'));
    const lis = [...idx.querySelectorAll('li')]; let cur = -1, j = 0, t = 0;
    const show = (i) => { imgs.forEach((im, q) => im.classList.toggle('is-m-on', q === i)); };
    const step = () => { const set = sets[keys[cur]] || []; if (!set.length) return; j = (j + 1) % set.length; show(set[j]); };
    const pick = (k) => { if (k === cur) return; cur = k; lis.forEach((li, q) => li.classList.toggle('is-on', q === k)); j = 0; const set = sets[keys[k]] || []; show(set.length ? set[0] : 0);
      clearInterval(t); if (set.length > 1) t = setInterval(step, 1500); };   // (always on a loop)
    // a tap on a discipline picks it (it doesn't jump down the page): caught before the page's own link handling
    lis.forEach((li, k) => li.addEventListener('click', (e) => { if (!mq.matches) return; e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); pick(k); }, true));
    media.addEventListener('click', (e) => { if (mq.matches) { e.preventDefault(); const d = document.getElementById(keys[cur] === 'ai' ? 'ai' : keys[cur]); if (d) d.scrollIntoView({ behavior: 'smooth' }); } });
    pick(0);
  }
  const boot = () => { heroMedia(); heroPin(); services(); yellowBand(); };
  if (document.readyState === 'complete') boot(); else addEventListener('load', boot);
})();
