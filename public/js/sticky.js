/* ===== Site-wide: a copy of the page's header, pinned to the top. It slides in while you scroll up (once the page's own header
   is out of view) and slides away as soon as you scroll down; stopping leaves it as it is. Links and buttons in it work as the
   originals (the Menu button and the theme switch pass their click on to the real ones). ===== */
(() => {
  const nav = document.querySelector('.cz-top .b30h__nav') || document.querySelector('.b30h__nav'); if (!nav) return;
  const inCz = !!nav.closest('.cz-top');
  const bar = document.createElement('div'); bar.className = 'b30-sticky'; bar.setAttribute('aria-hidden', 'true'); bar.inert = true;
  // the copy sits in the same kind of wrapper as the original, so the page's own header styles apply to it
  const wrap = inCz ? Object.assign(document.createElement('div'), { className: 'cz-top' })
    : (() => { const a = document.createElement('div'); const sec = nav.closest('.b30h'); a.className = sec ? sec.className : 'b30h'; /* the hero's own classes (e.g. wk-hero), so its header rules apply */ const b = document.createElement('div'); b.className = 'b30h__pin'; const c = document.createElement('div'); c.className = 'b30h__stage'; a.appendChild(b); b.appendChild(c); a.__in = c; return a; })();
  bar.appendChild(wrap); document.body.appendChild(bar);
  let copy = null;
  const build = () => {
    copy = nav.cloneNode(true); copy.querySelectorAll('[id]').forEach((e) => e.removeAttribute('id'));
    copy.style.cssText = ''; copy.querySelectorAll('[style]').forEach((e) => { if (e.matches('[data-lbl], .b30h__btn, .b30h__btn *')) return; e.style.opacity = ''; e.style.transform = ''; });
    (wrap.__in || wrap).replaceChildren(copy);
    // buttons with behaviour of their own: hand the click to the original
    copy.querySelectorAll('button').forEach((b, i) => { const orig = nav.querySelectorAll('button')[i]; if (orig) b.addEventListener('click', (e) => { e.preventDefault(); orig.click(); }); });
    copy.querySelectorAll('a[href]').forEach((a) => a.removeAttribute('data-bound'));
    bar.style.height = nav.getBoundingClientRect().height ? Math.round(nav.getBoundingClientRect().height) + 'px' : '';
  };
  // the page's own header may still be getting its phone parts (the Menu button) — copy it once the page has settled
  const ready = () => { build(); setTimeout(build, 1200); };
  if (document.readyState === 'complete') ready(); else addEventListener('load', ready);
  addEventListener('resize', () => { clearTimeout(build.t); build.t = setTimeout(build, 200); });

  let last = scrollY, on = false;
  const set = (v) => { if (v === on) return; on = v; bar.classList.toggle('is-on', v); bar.inert = !v; bar.setAttribute('aria-hidden', String(!v)); };
  const limit = () => { const r = nav.getBoundingClientRect(); return Math.max(140, (r.height || 80) * 2); };
  addEventListener('scroll', () => { const y = scrollY, dy = y - last; last = y;
    if (y < limit() || document.documentElement.classList.contains('b30m-open')) { set(false); return; }
    if (dy < -1) set(true); else if (dy > 1) set(false); }, { passive: true });
})();
