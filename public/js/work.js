(() => {
const WROOT = document.getElementById("work");

/* =================================================================
   CASE STUDIES — copy and images from Figma (Wrok 4).
   standing in until the real project shots are ready. Swap `img` for
   your own URLs. `focus` is the crop focal point (0–1).
   ================================================================= */
const WORK = (window.B30_CONTENT.work || {}).items || [];   // case studies: edit them in src/data/home.js

const CONFIG = {
  revealSpan:.42,                  // how much of the screen height the image takes to fully reveal (lower = quicker)
  revealFrom:0,                    // the wipe starts from the image's top edge
  revealAt:.86,                    // it plays once the image's top edge has risen to this share of the screen…
  revealMs:1300,                   // …and takes this long to run from top to bottom (plays once, like it's loading in)
  revealSoft:.06,                  // the soft edge on the wipe (share of the image's height)
  follow:.12,                      // smoothing on the scroll scrub (lower = softer, higher = more direct)
  grid:28, gridRadius:.22, gridStrength:.9, gridRelax:.925,   // hover grid deformation
  asciiSpeed:11,                   // ms between characters in the ASCII reveal
  drift:.028,                      // the image drifts this much (share of its height) inside its frame as you scroll past
  pixelFrom:22,                    // px: the image arrives as squares this big…
  resolveBy:.65,                   // …and is fully sharp by this point of its reveal
  textLift:0,                      // (parallax off) px the text column would glide against the image as the row crosses the screen
};
const GLYPHS = "#%&@*+=-:/\\<>[]{}01░▒▓";

const CTA_LABEL = (window.B30_CONTENT.work || {}).ctaLabel || "View case study";
const N = WORK.length;
const pad = n => String(n).padStart(2,"0");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobile = matchMedia("(max-width: 899px)");
const clamp = (v,a,b)=>Math.min(Math.max(v,a),b);
const lerp = (a,b,t)=>a+(b-a)*t;
const easeIO = t => t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
const rnd = () => GLYPHS[(Math.random()*GLYPHS.length)|0];

/* ---------- build rows ---------- */
const rowsEl = document.getElementById("rows");
const arrow = `<svg viewBox="0 0 9 9" fill="currentColor" shape-rendering="crispEdges"><rect x="5" y="1" width="1" height="1"/><rect x="6" y="2" width="1" height="1"/><rect x="7" y="3" width="1" height="1"/><rect x="0" y="4" width="1" height="1"/><rect x="1" y="4" width="1" height="1"/><rect x="2" y="4" width="1" height="1"/><rect x="3" y="4" width="1" height="1"/><rect x="4" y="4" width="1" height="1"/><rect x="5" y="4" width="1" height="1"/><rect x="6" y="4" width="1" height="1"/><rect x="7" y="4" width="1" height="1"/><rect x="8" y="4" width="1" height="1"/><rect x="7" y="5" width="1" height="1"/><rect x="6" y="6" width="1" height="1"/><rect x="5" y="7" width="1" height="1"/></svg>`;   // pixel arrow
const words = s => s.split(" ").map((w,i)=>`<span class="w"><span style="--i:${i}">${w}</span></span>`).join(" ");

WORK.forEach((w,i)=>{
  const flip = i % 2 === 1;    // alternating: 1st image right, 2nd image left, 3rd right…
  const text = `
    <div class="text">
      <div class="kicker"><span data-ascii>${w.kicker}</span></div>
      <div class="desc rise"><p class="num">(${pad(i+1)})</p><p>${words(w.body)}</p></div>
    </div>`;
  const media = `
    <div class="media">
      <div class="mhead">
        <div>
          <h3 class="rise">${words(w.title)}</h3>
          <a class="cta" href="${w.href}" data-btn data-pt data-pt-label="Case study"><span class="ic">${arrow}${arrow}</span><span class="lbl" data-lbl>${CTA_LABEL}</span><span class="sr">: ${w.title}</span></a>
        </div>
        <span class="yr" data-ascii>${w.year}</span>
      </div>
      <div class="slot" data-slot="${i}"><img src="${w.img}" alt="${w.alt}" loading="lazy"></div>
    </div>`;
  const row = document.createElement("article");
  row.className = "row" + (flip ? " flip" : "");
  row.innerHTML = text + media;
  rowsEl.appendChild(row);
});
const rows  = [...WROOT.querySelectorAll(".row")];
const slots = [...WROOT.querySelectorAll(".slot")];

/* =================================================================
   ASCII TEXT — each character arrives as a glyph and resolves in a
   left-to-right wave. Glyphs overlay the real letter, so lines never reflow.
   ================================================================= */
function prepAscii(el){
  const text = el.textContent;
  el.setAttribute("aria-label", text);
  el.innerHTML = text.split(" ").map(w =>
    `<span class="aw" aria-hidden="true">${[...w].map(c=>`<span class="ch">${c}</span>`).join("")}</span>`
  ).join(" ");
  el._chars = [...el.querySelectorAll(".ch")];
}
function playAscii(el, { hidden = true } = {}){
  const chars = el._chars; if (!chars) return;
  cancelAnimationFrame(el._raf);
  el.classList.remove("done");
  if (reduce){ el.classList.add("done"); chars.forEach(c=>c.className="ch on"); return; }
  const t0 = performance.now(), spd = CONFIG.asciiSpeed;
  const plan = chars.map((c,i)=>{ const start = i*spd*.6 + Math.random()*60; return { start, end: start + 140 + Math.random()*180 }; });
  chars.forEach(c=>{ c.className = hidden ? "ch" : "ch on g"; if (!hidden) c.dataset.g = rnd(); });
  let last = 0;
  const step = now => {
    const t = now - t0, tick = now - last > 45; if (tick) last = now;
    let busy = false;
    chars.forEach((c,i)=>{
      const p = plan[i];
      if (t < p.start){ busy = true; return; }
      if (t < p.end){ busy = true; if (!c.classList.contains("g")) c.className = "ch on g"; if (tick) c.dataset.g = rnd(); }
      else if (c.classList.contains("g") || !c.classList.contains("on")) c.className = "ch on";
    });
    if (busy) el._raf = requestAnimationFrame(step); else el.classList.add("done");
  };
  el._raf = requestAnimationFrame(step);
}
function hideAscii(el){ cancelAnimationFrame(el._raf); el.classList.remove("done"); el._chars?.forEach(c=>c.className="ch"); }
WROOT.querySelectorAll("[data-ascii]").forEach(prepAscii);

/* hover scramble for mono labels (fixed-width font, so plain text swap is stable) */
function scrambleText(el){
  const final = el.dataset.final || (el.dataset.final = el.textContent);
  if (reduce) return;
  cancelAnimationFrame(el._raf);
  const t0 = performance.now(), dur = 420; let last = 0;
  const step = now => {
    const t = (now - t0)/dur;
    if (now - last > 40){ last = now;
      el.textContent = [...final].map((c,k)=> c===" " ? " " : (k/final.length < t ? c : rnd())).join("");
    }
    if (t < 1) el._raf = requestAnimationFrame(step); else el.textContent = final;
  };
  el._raf = requestAnimationFrame(step);
}
WROOT.querySelectorAll("[data-scramble-hover]").forEach(el=>{
  const host = el.closest("a") || el;
  host.addEventListener("pointerenter", ()=>scrambleText(el));
  host.addEventListener("focus", ()=>scrambleText(el));
});

/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    const el = e.target;
    if (e.isIntersecting){
      if (el._shown) return; el._shown = true;
      el.classList.add("in");
      if (el.matches("[data-ascii]")) playAscii(el);
      el.querySelectorAll?.("[data-ascii]").forEach((a,k)=>setTimeout(()=>playAscii(a), k*90));
    }                                               // plays once: scrolling back up and down doesn't replay it
  });
},{ threshold:.18 });
rows.forEach(r=>io.observe(r));

/* ---------- active case study (used by the image click) ---------- */
let shown = 0;
function setCount(i){ shown = i; }

/* ---------- smooth scroll ---------- */
const lenis = null;

/* =================================================================
   SCROLL REVEAL — each image stays in its own slot and reveals from the
   top edge as its case study scrolls in, settling from a slight zoom
   (the hero services' reveal, scrubbed by scroll). Grid deformation on hover.
   ================================================================= */
const VS = `#version 300 es
in vec2 p; out vec2 vUv;
void main(){ vUv = p*.5+.5; gl_Position = vec4(p,0.,1.); }`;
const FS = `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uT, uD, uN;
uniform vec2 uRes, uS, uF, uSN, uM;
uniform float uR, uY, uB, uE, uHv, uK;
vec2 cover(vec2 uv, float z){
  float ra = uRes.x/uRes.y, ri = uS.x/uS.y;
  vec2 sc = (ra > ri ? vec2(1., ri/ra) : vec2(ra/ri, 1.)) / z;
  return (uv-.5)*sc + .5 + (uF-.5)*(1.-sc);
}
vec2 coverN(vec2 uv){ float ra = uRes.x/uRes.y, ri = uSN.x/uSN.y; vec2 sc = ra > ri ? vec2(1., ri/ra) : vec2(ra/ri, 1.); return (uv-.5)*sc + .5; }
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main(){
  vec2 uv = vec2(vUv.x, 1.-vUv.y), uv0 = uv;
  float a = 1. - smoothstep(uR - uE, uR, uv.y);                 // soft leading edge, top to bottom
  if (a <= 0.) { o = vec4(0.); return; }
  if (uB > 1.) uv = (floor(uv * uRes / uB) + .5) * uB / uRes;   // pixel resolve: coarse squares sharpen as it arrives
  vec2 d = texture(uD, uv).rg;
  vec2 c = cover(uv - d, (1.14 - .14*min(uR, 1.)) * 1.07) + vec2(0., uY);
  o = vec4(texture(uT, c + d*.4).r, texture(uT, c).g, texture(uT, c - d*.4).b, a);
  if (uHv > .001) {
    // peek (as on the testimonials): under the cursor, a ragged patch of pixels shows the next case study
    vec2 px = uv0 * uRes, cell = floor(px / uK), g = (cell + .5) * uK;
    float r = uHv * min(uRes.x, uRes.y) * .15, dd = length(g - uM * uRes) + (h(cell) - .5) * uK * 1.6;
    if (dd < r) { vec2 cn = coverN(uv0 - d); o = vec4(texture(uN, cn + d*.4).r, texture(uN, cn).g, texture(uN, cn - d*.4).b, a); }
  }
}`;
const GW = CONFIG.grid, GH = Math.round(CONFIG.grid * 480/784);

function makeSlotGL(slot, i){
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden","true");
  slot.appendChild(canvas);
  const gl = canvas.getContext("webgl2", { alpha:true, antialias:true, premultipliedAlpha:false });
  const S = { slot, canvas, gl, i, ready:false, r:0, disp:new Float32Array(GW*GH*2),
              mouse:{ x:.5, y:.5, sx:.5, sy:.5, vx:0, vy:0, inside:false, px:null, py:null }, hv:0 };
  if (!gl) return S;
  const sh = (t, src) => { const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(s); return s; };
  try{
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog); gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
    S.U = {}; ["uT","uD","uN","uRes","uS","uF","uSN","uM","uR","uY","uB","uE","uHv","uK"].forEach(k=>S.U[k]=gl.getUniformLocation(prog,k));
    gl.uniform1i(S.U.uT,0); gl.uniform1i(S.U.uD,1); gl.uniform1i(S.U.uN,2);
    const params = f => [[gl.TEXTURE_MIN_FILTER,f],[gl.TEXTURE_MAG_FILTER,f],[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE]].forEach(([k,v])=>gl.texParameteri(gl.TEXTURE_2D,k,v));
    S.dispTex = gl.createTexture(); gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, S.dispTex); params(gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG32F, GW, GH, 0, gl.RG, gl.FLOAT, S.disp);
    const im = new Image();
    im.onload = () => {
      S.tex = gl.createTexture(); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, S.tex); params(gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
      S.size = [im.naturalWidth, im.naturalHeight]; S.ready = true;
      if (!reduce && slotGLs.every(s => s.ready)) WROOT.classList.add("is-gl");
    };
    im.src = WORK[i].img;
    // the next case study, for the peek
    const nx = new Image();
    nx.onload = () => { S.ntex = gl.createTexture(); gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, S.ntex); params(gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, nx); S.nsize = [nx.naturalWidth, nx.naturalHeight]; };
    nx.src = WORK[(i + 1) % WORK.length].img;
  }catch(err){ console.warn("Work section: WebGL unavailable, showing static images.", err); }

  // hover input (mouse only)
  slot.addEventListener("pointermove", e=>{
    return;   // the picture stays still under the cursor: only the black View button follows it
    if (e.pointerType !== "mouse") return;
    const r = slot.getBoundingClientRect(), m = S.mouse;
    const x = (e.clientX - r.left)/r.width, y = (e.clientY - r.top)/r.height;
    if (m.px !== null){ m.vx = x - m.px; m.vy = y - m.py; }
    m.x = x; m.y = y; m.px = x; m.py = y; m.inside = true;
  });
  slot.addEventListener("pointerleave", ()=>{ S.mouse.inside = false; S.mouse.px = null; });
  S.word = document.createElement("span"); S.word.className = "slot__word"; S.word.setAttribute("aria-hidden","true"); S.word.textContent = "View"; slot.appendChild(S.word);
  slot.addEventListener("click", ()=> rows[i].querySelector(".cta")?.click());
  return S;
}
const slotGLs = slots.map(makeSlotGL);

function stepDisplacement(S){
  const { disp, mouse, gl } = S, rad = CONFIG.gridRadius * GW;
  let active = mouse.inside;
  for (let j=0;j<GH;j++) for (let i=0;i<GW;i++){
    const k = (j*GW+i)*2;
    if (mouse.inside){
      const dist = Math.hypot((i+.5) - mouse.x*GW, (j+.5) - mouse.y*GH);
      if (dist < rad){ const p = Math.pow(1 - dist/rad, 2) * CONFIG.gridStrength; disp[k] += mouse.vx*p; disp[k+1] += mouse.vy*p; }
    }
    disp[k] *= CONFIG.gridRelax; disp[k+1] *= CONFIG.gridRelax;
    if (!active && (Math.abs(disp[k]) > 1e-5 || Math.abs(disp[k+1]) > 1e-5)) active = true;
  }
  mouse.vx *= .85; mouse.vy *= .85;
  gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, S.dispTex);
  gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, GW, GH, gl.RG, gl.FLOAT, disp);
  return active;
}

let lastT = 0;
let wVis = true; new IntersectionObserver(([e]) => (wVis = e.isIntersecting), { rootMargin: "200px 0px" }).observe(WROOT);
function frame(now){
  if (!wVis) { lastT = 0; requestAnimationFrame(frame); return; }
  lenis?.raf(now);
  const dt = Math.min((now - (lastT || now)) / 1000, .05); lastT = now;
  const vh = innerHeight;
  if (!reduce && !mobile.matches) rows.forEach(r=>{
    const rr = r.getBoundingClientRect();
    if (rr.bottom < -100 || rr.top > vh + 100) return;
    const pos = clamp((rr.top + rr.height / 2 - vh / 2) / vh, -1, 1);
    const t = r._text || (r._text = r.querySelector(".text"));
    t.style.translate = `0 ${(pos * CONFIG.textLift).toFixed(2)}px`;
  });
  slotGLs.forEach(S=>{
    const rect = S.slot.getBoundingClientRect();
    // 0 when the image's top edge enters the bottom of the screen → 1 once it has risen CONFIG.revealSpan of the screen
    if (!S.ready) return;
    { const rw = S.row || (S.row = S.slot.closest('.row')), rb = rw ? rw.getBoundingClientRect() : rect;
      if (!S.go && rb.bottom > 0 && (vh - rb.top) / Math.max(1, rb.height) >= 0.7) S.go = now; }   // plays once 70% of its case study is in view
    S.r = reduce ? 1 : S.go ? clamp((now - S.go) / CONFIG.revealMs, 0, 1) : 0;
    if (rect.bottom < -50 || rect.top > vh + 50) return;          // off screen: skip drawing
    const { gl, canvas } = S;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const cw = Math.round(rect.width*dpr), ch = Math.round(rect.height*dpr);
    if (canvas.width !== cw || canvas.height !== ch){ canvas.width = cw; canvas.height = ch; }
    gl.viewport(0,0,cw,ch);
    stepDisplacement(S);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, S.tex);
    { const m = S.mouse; m.sx += (m.x - m.sx) * .22; m.sy += (m.y - m.sy) * .22;
      S.hv += (((m.inside && S.ntex && S.r >= 1) ? 1 : 0) - S.hv) * Math.min(1, dt * 7);
      if (S.ntex) { gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, S.ntex); gl.uniform2f(S.U.uSN, ...S.nsize); gl.activeTexture(gl.TEXTURE0); }
      gl.uniform2f(S.U.uM, m.sx, m.sy); gl.uniform1f(S.U.uHv, 0); /* the hover patch is off everywhere: the picture never changes under the cursor (only the black label follows it) */ gl.uniform1f(S.U.uK, Math.round(12 * cw / 609));
      S.word.classList.toggle("on", m.inside);
      S.word.style.translate = `calc(${(m.sx * rect.width).toFixed(1)}px - 50%) calc(${(m.sy * rect.height).toFixed(1)}px - 50%)`; }
    gl.uniform2f(S.U.uRes, cw, ch); gl.uniform2f(S.U.uS, ...S.size); gl.uniform2f(S.U.uF, ...WORK[S.i].focus);
    const er = 1 - Math.pow(1 - S.r, 3);                            // eases out, like something finishing loading
    gl.uniform1f(S.U.uE, 0.0001);   // hard edge: no soft blur on the reveal line
    gl.uniform1f(S.U.uR, S.r >= 1 ? 1.01 : CONFIG.revealFrom + (1 + CONFIG.revealSoft - CONFIG.revealFrom) * er);
    // the picture drifts slowly inside its frame as the row passes (it sits a little further back than the page)
    const pos = clamp((rect.top + rect.height / 2 - vh / 2) / vh, -1, 1);
    gl.uniform1f(S.U.uY, reduce ? 0 : pos * CONFIG.drift);
    // the picture arrives as coarse pixels that resolve to sharp over the first part of the reveal
    const rez = reduce ? 1 : clamp(S.r / CONFIG.resolveBy, 0, 1), sharp = 1 - Math.pow(1 - rez, 3);
    gl.uniform1f(S.U.uB, Math.max(1, CONFIG.pixelFrom * dpr * (1 - sharp)));
    gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  });
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

B30.bindHover && B30.bindHover(WROOT);
})();

/* Work: over a case-study image the cursor becomes the black circle, saying "View" */
(() => {
  const slots = [...document.querySelectorAll(".work .slot")];
  const orbit = document.querySelector(".b30h__orbit");
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const el = document.createElement("div");
  el.className = "b30-vcur"; el.setAttribute("aria-hidden", "true"); el.innerHTML = "<span>View</span>";
  document.body.appendChild(el);
  let cx = -200, cy = -200, tx = -200, ty = -200, show = 0, want = 0, raf = 0, last = 0, down = false;
  const lbl = el.firstChild;
  // each target shows its own word in the circle: "View" on case-study images, "Drag" on the hero orbit
  const bind = (el, word) => {
    el.addEventListener("pointerenter", (e) => {
      if (e.pointerType !== "mouse") return;
      if (show < 0.02) { cx = tx = e.clientX; cy = ty = e.clientY; }
      want = 1; lbl.textContent = word; B30.scramble && B30.scramble(lbl, { duration: 380 }); kick();
    });
    el.addEventListener("pointerleave", () => { want = 0; kick(); });
    el.addEventListener("pointerdown", () => { down = true; kick(); });
  };
  document.querySelectorAll(".work .row").forEach((r) => { bind(r, "View"); r.addEventListener("click", (e) => { if (!e.target.closest("a")) r.querySelector(".cta")?.click(); });
    r.addEventListener("pointermove", (e) => { if (e.pointerType !== "mouse") return; const img = !!e.target.closest("a:not(:has(.slot)), button");   /* over the picture too: the big View button stays */ if (img !== r._img) { r._img = img; want = img ? 0 : 1; kick(); } }); });   // the black View cursor on the whole case study row, its picture included
  // the orbit box is square, but only its ring band (where the words travel, upper arc) is draggable:
  // "Drag" shows only while the pointer is on that band
  let onRingF = null, clearRing = () => {};
  if (orbit) {
    const onRing = (e) => {
      const r = orbit.getBoundingClientRect(), R = r.width / 2;
      const dx = e.clientX - (r.left + R), dy = e.clientY - (r.top + R), d = Math.hypot(dx, dy);
      if (!(d > R * 0.8 && d < R * 1.02 && dy < -R * 0.4)) return false;   // ring band 577–702 of 702, above the words' fade
      const mon = document.querySelector(".b30h__bezel") || document.querySelector(".b30h__screen");
      if (mon) { const m = mon.getBoundingClientRect(); if (e.clientX > m.left - 24 && e.clientX < m.right + 24 && e.clientY > m.top - 24 && e.clientY < m.bottom + 24) return false; }   // never over the monitor
      return true;
    };
    let inRing = false;
    const upd = (e) => {
      if (e.pointerType !== "mouse") return;
      const now = onRing(e);
      if (now === inRing) return;
      inRing = now;
      if (now) { if (show < 0.02) { cx = tx = e.clientX; cy = ty = e.clientY; } want = 1; lbl.textContent = "Drag"; B30.scramble && B30.scramble(lbl, { duration: 380 }); }
      else want = 0;
      orbit.classList.toggle("is-ring", now);
      kick();
    };
    onRingF = onRing; clearRing = () => { inRing = false; orbit.classList.remove("is-ring"); };
    orbit.addEventListener("pointermove", upd);
    orbit.addEventListener("pointerenter", upd);
    orbit.addEventListener("pointerleave", () => { inRing = false; orbit.classList.remove("is-ring"); want = 0; kick(); });
    orbit.addEventListener("pointerdown", () => { if (inRing) { down = true; kick(); } });
  }
  addEventListener("pointerup", () => { down = false; kick(); });
  addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; if (want || show > 0.01) kick(); }, { passive: true });
  // the page can move under a still pointer (fast scrolls, the pinned hero): keep checking what's really under it, and
  // drop the circle the moment it's over anything else — the monitor's video included
  const recheck = () => {
    if (!want) return;
    const at = document.elementFromPoint(tx, ty);
    let ok = !!(at && at.closest(".work .row") && !at.closest("a:not(:has(.slot)), button"));   // the picture counts as the row
    if (!ok && orbit && at && orbit.contains(at) && onRingF) ok = onRingF({ clientX: tx, clientY: ty }) && parseFloat(getComputedStyle(orbit).opacity) > .4;
    if (!ok) { want = 0; clearRing(); kick(); }
  };
  // while the page is scrolling, the orbit's "Drag" stands down (it comes back on the next move of the mouse)
  const calm = () => { if (want && lbl.textContent === "Drag") { want = 0; clearRing(); kick(); } };
  addEventListener("scroll", () => { calm(); recheck(); }, { passive: true });
  addEventListener("wheel", () => { calm(); requestAnimationFrame(recheck); }, { passive: true });
  function kick() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } }
  function tick(now) {
    raf = 0;
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const k = 1 - Math.exp(-dt * 16);
    cx += (tx - cx) * k; cy += (ty - cy) * k;
    if (want) recheck();
    show += (want - show) * (1 - Math.exp(-dt * 12));
    el.style.transform = `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0) scale(${(show * (down ? 0.86 : 1)).toFixed(3)})`;
    if (Math.abs(want - show) > 0.004 || Math.abs(tx - cx) + Math.abs(ty - cy) > 0.3) raf = requestAnimationFrame(tick);
  }
})();

/* Selected work: each case study holds once you've seen it, and the next one rides up over it. Once the next one is half
   in view, the one underneath drifts down a little, slowly, going softly out of focus from the bottom up (no shadow,
   no tint; its rules drop away). */
(() => {
  const rows = [...document.querySelectorAll('.work .row')]; if (rows.length < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const work = document.querySelector('.work'); return;   // case studies scroll normally (no stacking)
  const fog = rows.map((r) => { const d = document.createElement('div'); d.className = 'b30-rowfog'; d.setAttribute('aria-hidden', 'true'); r.appendChild(d); return d; });
  let raf = 0;
  const place = () => rows.forEach((r) => (r.style.top = innerHeight - r.offsetHeight + 'px'));
  const upd = () => {
    raf = 0; const vh = innerHeight;
    rows.forEach((r, i) => {
      const nx = rows[i + 1]; if (!nx) return;
      const nb = nx.getBoundingClientRect(), v = Math.max(0, Math.min(1, (vh - nb.top) / Math.max(1, nb.height)));   // how much of the next one is in view
      const q = Math.max(0, Math.min(1, (v - 0.5) / 0.5)), e = q * q * (3 - 2 * q);
      r.style.setProperty('--back', e > 0 ? `${(e * 90).toFixed(1)}px` : '0px');   // the content moves (see CSS); the row's background stays put
      fog[i].style.opacity = e.toFixed(3); r.classList.toggle('is-back', e > 0.001);
    });
  };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true });
  addEventListener('resize', () => { place(); upd(); }); place(); upd();
})();
