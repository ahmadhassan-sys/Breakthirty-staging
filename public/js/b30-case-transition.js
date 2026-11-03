/* ==========================================================================
   Breakthirty — Case study transition

   ON THE HOMEPAGE (or any page listing case studies):
     Click a case study and its image grows out of its slot to fill the screen.
     It first glides, at its own size, to the centre of the screen, then scales up
     to full screen, while the row's text fades where it is. Then the case study opens.

   ON THE CASE STUDY:
     It opens with that same image still filling the screen. The image then shrinks
     into the hero's frame, the header slides down from the top, and the image fades
     away over the real hero.

   USAGE — the same file on the homepage AND on every case study, in <head>,
   as a plain (blocking) script, right after b30-loader.js:
       <script src="/b30-loader.js"><\/script>
       <script src="/b30-case-transition.js"><\/script>

   Which elements it uses (CONFIG below — the defaults match the current pages):
     homepage   a link inside .work .row → its image is .slot img
                (any other link can join in: data-case-link on the link, data-case-img on its image)
     case study the hero image .cz-hero__img (or data-case-hero) · the header .cz-top (or data-case-header)
   ========================================================================== */
(() => {
  "use strict";

  const CONFIG = {
    // homepage
    rowLink: ".work .row a",                // links that open a case study
    rowRoot: ".work .row",                  // …and the row around each one
    rowImage: ".slot img",                  // the image inside that row
    rowFade: ".kicker, .desc, h3, .cta, .mhead, .year, .num, .yr",   // row text that fades out
    expandTime: 1300,                       // ms: glide to the centre, then grow to full screen
    glideShare: 0.42,                       // the share of that time spent gliding
    // case study
    hero: "[data-case-hero], .cz-hero__img",
    header: "[data-case-header], .cz-top",
    settleTime: 1100,                       // ms: full screen → the hero's frame
    fadeTime: 450,                          // ms: the image fades over the real hero
    headerTime: 1100,                       // ms: the header slides down
    ease: "cubic-bezier(.16,1,.3,1)",
  };

  const KEY = "b30-pt", IMG = "b30-case-img";
  const html = document.documentElement;
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ss = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); return true; } catch (e) { return false; } },
    del(k) { try { sessionStorage.removeItem(k); } catch (e) {} },
  };
  const lenis = (on) => { const l = window.B30 && window.B30.lenis; if (l) on ? l.start() : l.stop(); };

  const css = document.createElement("style");
  css.textContent = `
.b30-cx{position:fixed;inset:0;z-index:2147483300;overflow:hidden;pointer-events:none;will-change:clip-path}
.b30-cx img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;transform-origin:50% 50%;will-change:transform}
.b30c-arr{position:fixed;inset:0;z-index:2147483300;pointer-events:none;background:#fff center/cover no-repeat;will-change:clip-path,opacity}
html.b30c-arrive ${CONFIG.header.split(",").join(", html.b30c-arrive ")}{transform:translate3d(0,-100vh,0)}
html.b30c-arrive ${CONFIG.hero.split(",").join(", html.b30c-arrive ")}{clip-path:inset(0)!important;transition:none!important}
html.b30c-arrive.pt-img::after,html.b30c-arrive.pt-px::after{display:none!important}`;
  document.head.appendChild(css);

  /* ==========================================================================
     Homepage: the clicked image grows to fill the screen, then the case study opens
     ========================================================================== */
  const faded = [];
  function expand(row, a, im) {
    const slot = im.parentElement, r = slot.getBoundingClientRect(), W = innerWidth, H = innerHeight;
    lenis(false);
    // A fixed layer over the page (nothing in the page moves): the image is laid out at its final,
    // full-screen size and starts scaled + clipped so it looks exactly like it does in its slot.
    const ov = document.createElement("div");
    ov.className = "b30-cx"; ov.setAttribute("aria-hidden", "true");
    const pic = document.createElement("img");
    pic.src = im.currentSrc || im.src; pic.alt = "";
    ov.appendChild(pic); html.appendChild(ov);
    slot.style.visibility = "hidden";                              // the moving copy is the only one on screen
    const nw = im.naturalWidth, nh = im.naturalHeight;
    const sF = Math.max(W / nw, H / nh), sI = Math.max(r.width / nw, r.height / nh);
    const k = sI / sF, dx = r.left + r.width / 2 - W / 2, dy = r.top + r.height / 2 - H / 2;
    const ins = (t, rr, b, l) => `inset(${t}px ${rr}px ${b}px ${l}px)`;
    const i0 = [r.top, W - r.right, H - r.bottom, r.left];
    const cT = (H - r.height) / 2, cL = (W - r.width) / 2, iC = [cT, cL, cT, cL];
    const D = CONFIG.expandTime, o1 = CONFIG.glideShare;
    // first it glides, at its own size, to the centre of the screen; then it scales up to fill it
    ov.animate([
      { clipPath: ins(...i0), easing: "cubic-bezier(.65,0,.35,1)" },
      { clipPath: ins(...iC), offset: o1, easing: "cubic-bezier(.7,0,.2,1)" },
      { clipPath: ins(0, 0, 0, 0) },
    ], { duration: D, fill: "forwards" });
    const last = pic.animate([
      { transform: `translate(${dx}px,${dy}px) scale(${k})`, easing: "cubic-bezier(.65,0,.35,1)" },
      { transform: `translate(0px,0px) scale(${k})`, offset: o1, easing: "cubic-bezier(.7,0,.2,1)" },
      { transform: "translate(0,0) scale(1)" },
    ], { duration: D, fill: "forwards" });
    // the row's words simply fade where they are
    if (row) row.querySelectorAll(CONFIG.rowFade).forEach((el) =>
      faded.push(el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 420, easing: "ease-out", fill: "forwards" })));
    // tell the case study it's arriving from this image (and which image, so it can carry on with it)
    ss.set(KEY, "__img");
    const src = im.currentSrc || im.src;
    if (!(src.length < 3.5e6 && ss.set(IMG, src))) ss.del(IMG);
    last.finished.then(() => setTimeout(() => { location.href = a.href; }, 80));
  }

  // runs before b30-loader.js's own link handler (which listens on window), so it takes these clicks
  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest(`${CONFIG.rowLink}, a[data-case-link]`);
    if (!a || (a.target && a.target !== "_self") || REDUCED) return;
    const row = a.closest(CONFIG.rowRoot);
    const im = a.hasAttribute("data-case-link")
      ? (document.querySelector(a.getAttribute("data-case-link") || "") || a.querySelector("[data-case-img], img") ||
         (a.closest("[data-case-card]") || a).querySelector("[data-case-img], img"))
      : row && row.querySelector(CONFIG.rowImage);
    if (!im || !im.naturalWidth) return;                            // no image ready: the normal page transition runs
    e.preventDefault();
    expand(row, a, im);
  });

  /* ==========================================================================
     Case study: the image is still full screen, settles into the hero, the header comes down
     ========================================================================== */
  const arriving = ss.get(KEY) === "__img" && !REDUCED;
  if (arriving) {
    html.classList.add("b30c-arrive");
    const arr = document.createElement("div");
    arr.className = "b30c-arr"; arr.setAttribute("aria-hidden", "true");
    const src = ss.get(IMG);
    if (src) arr.style.backgroundImage = `url("${src.replace(/"/g, "%22")}")`;
    html.appendChild(arr);                                          // up before the first paint

    const go = () => {
      ss.del(KEY); ss.del(IMG);
      html.classList.remove("pt-img", "pt-px");
      const hero = document.querySelector(CONFIG.hero), top = document.querySelector(CONFIG.header);
      if (hero) hero.classList.add("in");
      if (!src && hero) {                                           // no image carried over: take on the hero's own look
        const cs = getComputedStyle(hero.tagName === "IMG" ? document.body : hero);
        if (hero.tagName === "IMG") arr.style.backgroundImage = `url("${hero.currentSrc || hero.src}")`;
        else { arr.style.backgroundImage = cs.backgroundImage; arr.style.backgroundColor = cs.backgroundColor; }
      }
      // the header: down from the top, smoothly
      if (top) {
        const h = top.animate([{ transform: "translate3d(0,-100%,0)" }, { transform: "translate3d(0,0,0)" }],
          { duration: CONFIG.headerTime, delay: 80, easing: CONFIG.ease, fill: "backwards" });
        html.classList.remove("b30c-arrive");                       // the animation now holds the header's start pose
        h.finished.then(() => { top.style.transform = ""; }).catch(() => {});
      } else html.classList.remove("b30c-arrive");
      if (!hero) {                                                  // nowhere to settle: just fade
        arr.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, easing: "ease-out", fill: "forwards" })
          .finished.then(() => arr.remove(), () => arr.remove());
        return;
      }
      // full screen → the hero's frame, then it fades over the real hero
      const r = hero.getBoundingClientRect(), W = innerWidth, H = innerHeight;
      const to = `inset(${Math.max(0, r.top)}px ${Math.max(0, W - r.right)}px ${Math.max(0, H - r.bottom)}px ${Math.max(0, r.left)}px)`;
      arr.animate([{ clipPath: "inset(0px 0px 0px 0px)" }, { clipPath: to }],
        { duration: CONFIG.settleTime, delay: 80, easing: CONFIG.ease, fill: "forwards" })
        .finished.then(() => arr.animate([{ opacity: 1 }, { opacity: 0 }], { duration: CONFIG.fadeTime, easing: "ease-out", fill: "forwards" }).finished)
        .then(() => arr.remove(), () => arr.remove());
    };
    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", go, { once: true }) : go();
  }

  // back to a page restored from the browser's cache: undo the expanded image
  addEventListener("pageshow", (e) => {
    if (!e.persisted) return;
    document.querySelectorAll(".b30-cx, .b30c-arr").forEach((n) => n.remove());
    document.querySelectorAll(`${CONFIG.rowRoot} ${CONFIG.rowImage}`).forEach((im) => (im.parentElement.style.visibility = ""));
    faded.splice(0).forEach((x) => x.cancel());
    html.classList.remove("b30c-arrive");
    lenis(true);
  });

  window.B30Case = { config: CONFIG };
})();
