/* Case study · numbers: the odometer roll-up of the big figures */
(() => {
  "use strict";
  const RED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const U = () => document.documentElement.clientWidth / 1920;

  /* =====================================================================
     Numbers — an odometer: each digit rolls up, the old figure leaving upwards as the next one comes in from
     below, played once the number is well inside the screen.
     ===================================================================== */
  const fmt = (n) => Math.round(n).toLocaleString("en-US");
  document.querySelectorAll("[data-count]").forEach((el) => {
    const to = +el.dataset.count, from = +el.dataset.from, suf = el.dataset.suffix || "";
    const cs = getComputedStyle(el.parentElement), lh = (parseFloat(cs.lineHeight) / parseFloat(cs.fontSize)) || 1.1;
    const seq = []; for (let n = from; n <= to; n++) seq.push(fmt(n));
    const len = seq[seq.length - 1].length; const pads = seq.map((s) => s.padStart(len, " "));
    let html = "";
    for (let p = 0; p < len; p++) {
      const ch = pads.map((s) => s[p]);
      if (!/\d/.test(ch[ch.length - 1])) { html += `<span class="odo__x">${ch[ch.length - 1]}</span>`; continue; }
      const col = []; ch.forEach((c) => { if (col[col.length - 1] !== c) col.push(c); });
      html += `<span class="odo__c"><span class="odo__s" style="--n:${col.length - 1};--dl:${((len - 1 - p) * 0.05).toFixed(2)}s">${col.map((c) => `<span>${c === " " ? "&nbsp;" : c}</span>`).join("")}</span></span>`;
    }
    if (suf) html += `<span class="odo__x">${suf}</span>`;
    el.setAttribute("aria-label", fmt(to) + suf);
    el.innerHTML = `<span class="odo" aria-hidden="true" style="--lh:${lh.toFixed(3)}">${html}</span>`;
    const roll = () => el.querySelectorAll(".odo__s").forEach((s) => s.style.setProperty("--k", s.style.getPropertyValue("--n")));
    if (RED) { el.querySelectorAll(".odo__s").forEach((s) => (s.style.transition = "none")); roll(); return; }
    el.querySelectorAll(".odo__s").forEach((s) => { const n = +s.style.getPropertyValue("--n"); s.style.setProperty("--dur", (1.6 + Math.min(n, 12) * 0.12).toFixed(2) + "s"); });
    const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; io.disconnect(); setTimeout(roll, 120); }, { threshold: 0, rootMargin: "0px 0px -6% 0px" });
    io.observe(el.closest("section") || el);
  });
})();
