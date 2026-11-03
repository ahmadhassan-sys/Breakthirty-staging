/* Case study (template B) · numbers and words that roll up letter by letter (data-count, data-roll) */
(() => {
  "use strict";
  const RED = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =====================================================================
     Numbers — an odometer: each digit rolls up, the old figure leaving upwards as the next one comes in from
     below, played once the number is well inside the screen.
     ===================================================================== */
  // widths are measured per glyph (in em), so the figures sit with their natural spacing — no tabular gaps
  const glyphW = (host, t) => { const s = document.createElement("span"); s.style.cssText = "position:absolute;visibility:hidden;white-space:pre;left:-9999px"; s.textContent = t; host.appendChild(s); const w = s.getBoundingClientRect().width; s.remove(); return w; };
  const build = (el, seqs, label) => {
    const fs = parseFloat(getComputedStyle(el).fontSize) || 16;
    const cs = getComputedStyle(el.parentElement), lh = (parseFloat(cs.lineHeight) / parseFloat(cs.fontSize)) || 1.1;
    const em = (t) => (glyphW(el, t) / fs).toFixed(4);
    let html = "", li = 0;
    seqs.forEach((col) => {
      const last = col[col.length - 1];
      if (col.length === 1) { html += `<span class="odo__x">${last === " " ? "&nbsp;" : last}</span>`; return; }
      const w0 = em(col[0] === "\u00a0" ? last : col[0]), w1 = em(last), letter = col[0] === "\u00a0";
      const dl = letter ? (0.08 + li++ * 0.045) : 0, n = col.length - 1, dur = letter ? 1.1 : (1.6 + Math.min(n, 12) * 0.12);
      html += `<span class="odo__c" style="width:${letter ? w1 : w0}em;--w1:${w1}em;--dur:${dur.toFixed(2)}s;--dl:${dl.toFixed(2)}s"><span class="odo__s" style="--n:${n}">${col.map((c) => `<span>${c === " " || c === "\u00a0" ? "&nbsp;" : c}</span>`).join("")}</span></span>`;
    });
    el.setAttribute("aria-label", label);
    el.innerHTML = `<span class="odo" aria-hidden="true" style="--lh:${lh.toFixed(3)}">${html}</span>`;
  };
  const roll = (el) => {
    let total = 0;
    el.querySelectorAll(".odo__c").forEach((c) => { c.style.width = c.style.getPropertyValue("--w1"); const s = c.firstElementChild; s.style.setProperty("--k", s.style.getPropertyValue("--n"));
      total = Math.max(total, parseFloat(c.style.getPropertyValue("--dur")) + parseFloat(c.style.getPropertyValue("--dl"))); });
    const label = el.getAttribute("aria-label");
    setTimeout(() => { el.textContent = label; el.removeAttribute("aria-label"); }, total * 1000 + 80);   // finished: plain text again, with the font's own kerning
  };
  const play = (el) => {
    if (RED) { el.querySelectorAll(".odo__c, .odo__s").forEach((x) => (x.style.transition = "none")); roll(el); return; }
    const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; io.disconnect(); setTimeout(() => roll(el), 120); }, { threshold: 0, rootMargin: "0px 0px -6% 0px" });
    io.observe(el.closest("section") || el);
  };
  const letters = (t) => [...t].map((ch) => (/\s/.test(ch) ? [" "] : /[.,]/.test(ch) ? [ch] : ["\u00a0", ch]));
  // numbers: each digit rolls up through the in-between values, the old one leaving upwards as the next comes in;
  // the words around them (and words on their own, like "Weekly") rise in letter by letter the same way
  document.querySelectorAll("[data-count]").forEach((el) => {
    const dec = +(el.dataset.dec || 0), F = Math.pow(10, dec), pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
    const fmt = (n) => (n / F).toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
    const to = Math.round(+el.dataset.count * F), from = Math.round(+el.dataset.from * F);
    const seq = []; for (let n = from; n <= to; n++) seq.push(fmt(n));
    const len = seq[seq.length - 1].length, pads = seq.map((s) => s.padStart(len, " "));
    const cols = [];
    for (let p = 0; p < len; p++) {
      const ch = pads.map((s) => s[p]), lastc = ch[ch.length - 1];
      if (!/\d/.test(lastc)) { cols.push([lastc]); continue; }
      const col = []; ch.forEach((c) => { const v = c === " " ? "\u00a0" : c; if (col[col.length - 1] !== v) col.push(v); });
      cols.push(col);
    }
    build(el, [...letters(pre), ...cols, ...letters(suf)], pre + fmt(to) + suf);
    play(el);
  });
  document.querySelectorAll("[data-roll]").forEach((el) => { const t = el.textContent; build(el, letters(t), t); play(el); });
})();
