/* hero: the drifting glow over the white part of the sky */
(() => { const st = document.querySelector(".b30h__stage"); if (!st) return; const a = document.createElement("div"); a.className = "b30h__aura"; a.setAttribute("aria-hidden", "true"); a.innerHTML = "<i></i><i></i><i></i>"; st.insertBefore(a, st.firstChild); })();

/* hero: the same colour in the dark theme — a transparent version of the glow (no white behind it), laid over the night */
(() => { const g = document.querySelector(".b30h__glow"); if (!g) return; const light = g.getAttribute("src"), dark = "/assets/images/hero-glow-dark.webp";
  const sync = () => { const d = document.documentElement.classList.contains("dark"); const want = d ? dark : light; if (g.getAttribute("src") !== want) g.setAttribute("src", want); };
  sync(); addEventListener("b30:theme", sync); new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] }); })();

/* keep the glow's carry-on strip on the same picture as the glow (the theme swaps it) */
(() => { const g = document.querySelector(".b30h__glow"); if (!g) return;
  const sync = () => { const x = g.nextElementSibling; if (x && x.classList.contains("b30h__glowx")) x.style.backgroundImage = `url("${g.currentSrc || g.src}"),url("${g.currentSrc || g.src}")`; };
  g.addEventListener("load", sync); addEventListener("b30:theme", () => setTimeout(sync, 60)); })();

/* =====================================================================
   Hero light — soft rays of colour rising behind the monitor, drifting very slowly, leaning a touch toward the cursor.
   Same palette and shape as the baked glow (cream → blush at the sides → lavender → B30 blue at the core), so the hero
   reads the same, only alive. Paused when the hero is off screen; still for reduced motion.
   ===================================================================== */
(() => {
  const hero = document.querySelector('[data-b30-hero], .wk-hero:has(.b30h__glowx)'); if (!hero) return;   // the homepage hero, or an inner-page hero that has the light layer
  const RED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SPEED = 0.085;                                  // overall pace (the reference runs ~4× faster)
  const VS = `#version 300 es
in vec2 p; out vec2 vUv; void main(){ vUv = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }`;
  const FS = `#version 300 es
precision highp float; in vec2 vUv; out vec4 o;
uniform vec2 uRes; uniform float uT, uDark, uAsp; uniform vec3 uM;   // uM: cursor x (0..1), y (glow units), strength
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float a = .5, s = 0.; for (int i = 0; i < 4; i++){ s += a * n(p); p *= 2.03; a *= .5; } return s; }
void main(){
  float x = vUv.x, Y = (1. - vUv.y) * uAsp;                 // Y: 0 at the top of the glow, 1 at the picture's end, then on
  float t = uT;
  // rays: streaks across x that slowly drift and breathe; their tips reach a little higher where they're bright
  float r = fbm(vec2(x * 4.2 + .48 * sin(t * .21) + (1. - Y) * .26 * sin(t * .13 + x * 3.), t * .42));
  float r2 = fbm(vec2(x * 9. - t * .12, 3.1 + t * .22));
  float ray = smoothstep(.32, .78, r) * .75 + smoothstep(.45, .85, r2) * .35;
  float v = smoothstep(.37 - ray * .13, .80, Y);              // rising from the bottom (as the baked glow: white above ~45%), ray tips a touch higher
  float core = exp(-pow((x - .5) / (.21 + .10 * v), 2.));     // the deep colour, centred behind the monitor
  float wide = exp(-pow((x - .5) / .52, 2.));
  // the cursor: a slow, soft lift of the light where it is
  float cur = uM.z * exp(-pow((x - uM.x) / .14, 2.)) * smoothstep(.1, 1., Y);
  float I = (v * (core * (.70 + .55 * ray) + wide * .26 * ray) + cur * .22 * v + cur * .06) * 1.14;   // a touch more glow
  float blush = v * (1. - core) * (.55 + .25 * ray);          // warm blush out at the sides
  vec3 c;
  if (uDark < .5) {
    c = vec3(1.);
    c = mix(c, vec3(.996, .975, .94), smoothstep(.0, .14, I + blush * .3));
    c = mix(c, vec3(.92, .81, .83), smoothstep(.12, .55, blush) * (1. - smoothstep(.35, .7, I)));
    c = mix(c, vec3(.72, .68, .87), smoothstep(.22, .48, I));
    c = mix(c, vec3(.33, .39, .74), smoothstep(.44, .82, I));
    c = mix(c, vec3(.20, .28, .60), smoothstep(.82, 1.1, I));
  } else {                                                    // dark: the same light, added onto the night (screen)
    c = vec3(.30, .38, .95) * smoothstep(.15, 1.05, I) * .85 + vec3(.55, .40, .75) * smoothstep(.1, .6, blush) * .22
      + vec3(.70, .78, 1.) * smoothstep(.7, 1.2, I) * .25;
  }
  float top = smoothstep(.25, .47, Y);                        // pure white (light) / pure black (dark) along the top edge: no line
  c = uDark < .5 ? mix(vec3(1.), c, top) : c * top;
  float d = (h(gl_FragCoord.xy + fract(t)) - .5) / 255. * top;   // dither: no banding in the soft gradients
  o = vec4(clamp(c + d, 0., 1.), 1.);
}`;
  let el = null, cv, gl, U = {}, raf = 0, vis = true, last = 0, T = 0;
  const m = { x: .5, y: .8, tx: .5, ty: .8, s: 0, ts: 0 };
  function init(gx) {
    cv = document.createElement('canvas'); cv.className = 'b30h__aur'; cv.setAttribute('aria-hidden', 'true');
    gl = cv.getContext('webgl2', { alpha: false, antialias: false, premultipliedAlpha: false }); if (!gl) return false;
    const sh = (ty, src) => { const x = gl.createShader(ty); gl.shaderSource(x, src); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(x); return x; };
    try {
      const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); gl.useProgram(pr);
      const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const l = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, 2, gl.FLOAT, false, 0, 0);
      ['uRes', 'uT', 'uDark', 'uAsp', 'uM'].forEach((k) => (U[k] = gl.getUniformLocation(pr, k)));
    } catch (e) { console.warn('hero light unavailable', e); return false; }
    gx.appendChild(cv); gx.classList.add('has-gl'); el = gx;
    const img = hero.querySelector('.b30h__glow'); img && img.classList.add('is-gl');
    return true;
  }
  function frame(now) {
    raf = 0;
    if (!el || !vis || document.hidden) return;
    const dt = Math.min(.05, (now - (last || now)) / 1000); last = now;
    if (!RED) T += dt * SPEED * 6;
    const w = el.clientWidth, hgt = el.clientHeight; if (!w || !hgt) { raf = requestAnimationFrame(frame); return; }
    const sc = Math.min(1, 1100 / w), cw = Math.max(2, Math.round(w * sc)), ch = Math.max(2, Math.round(hgt * sc));   // soft light: drawn at ≤1100px wide and scaled up
    if (cv.width !== cw || cv.height !== ch) { cv.width = cw; cv.height = ch; }
    gl.viewport(0, 0, cw, ch);
    const k = 1 - Math.exp(-dt * 1.6);                          // the cursor is followed slowly
    m.x += (m.tx - m.x) * k; m.y += (m.ty - m.y) * k; m.s += (m.ts - m.s) * (1 - Math.exp(-dt * 1.2));
    gl.uniform2f(U.uRes, cw, ch); gl.uniform1f(U.uT, T); gl.uniform1f(U.uDark, document.documentElement.classList.contains('dark') ? 1 : 0);
    gl.uniform1f(U.uAsp, 1.6); gl.uniform3f(U.uM, m.x, m.y, m.s);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (!RED || m.s > .001) raf = requestAnimationFrame(frame);
  }
  const kick = () => { if (!raf && el) raf = requestAnimationFrame(frame); };
  // wait for the hero's layout to make the glow layer, then light it
  (function wait() { const gx = hero.querySelector('.b30h__glowx'); if (gx) { if (init(gx)) kick(); } else requestAnimationFrame(wait); })();
  new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis) { last = 0; kick(); } }).observe(hero);
  document.addEventListener('visibilitychange', kick);
  addEventListener('pointermove', (e) => {
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect(); if (!r.width) return;
    m.tx = (e.clientX - r.left) / r.width; m.ty = (e.clientY - r.top) / r.height * 1.6;
    m.ts = e.clientY > r.top - 200 && e.clientY < r.bottom ? 1 : 0; kick();
  }, { passive: true });
  addEventListener('pointerleave', () => { m.ts = 0; });
  addEventListener('b30:theme', () => { last = 0; kick(); });
})();
