/* =====================================================================
   Footer — slides up from underneath as the page above moves away
   (ref. weldonbrewster.com), small text decodes in ASCII once.
   ===================================================================== */
(() => {
  const ft = document.getElementById("footer");
  if (!ft) return;
  const layers = [ft.querySelector(".bt-footer"), ft.querySelector(".b30f__c")];   // the sky cap at the top stays put, so the seam under the page above is always the same colour
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = matchMedia("(max-width: 899px)");
  const yr = ft.querySelector("[data-year]"); if (yr) yr.textContent = new Date().getFullYear();
  let revealed = false, raf = 0;
  const texts = [...ft.querySelectorAll("[data-fascii]")];
  const DIM_MAX = 0.15;       // black over the footer before it rises; clears as it comes into view
  const WING_AT = 0.7;        // share of the gutter opening already done when the footer's top reaches the screen
                              // (starts the moment the CTA panel enters the screen)
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const fdim = ft.querySelector(".b30f__dim");
  const cta = document.getElementById("contact"), st = cta && cta.querySelector(".b30c__st");
  if (st) ["l", "r"].forEach((side) => { const w = document.createElement("i"); w.className = `b30c__wing ${side}`; w.setAttribute("aria-hidden", "true"); st.parentElement.appendChild(w); });
  function reveal() {
    revealed = true;
    ft.classList.add("is-rev");
    texts.forEach((el, i) => setTimeout(() => {
      el.classList.add("ascii-run");
      B30.scramble ? B30.scramble(el, { mode: "reveal", duration: 900, stagger: 0.6 }) : 0;
    }, i * 55));
  }
  function render() {
    raf = 0;
    const r = ft.getBoundingClientRect(), vh = innerHeight;
    const span = Math.min(r.height, vh);
    const p = Math.min(1, Math.max(0, (vh - r.top) / span));
    const tf = "";   // the footer sits still (no slide-up)
    layers.forEach((l) => l && (l.style.transform = tf));
    const still = mobile.matches;
    if (fdim) fdim.style.opacity = still ? "0" : (DIM_MAX * (1 - ease(p))).toFixed(4);
    if (cta) {
      const cr = cta.getBoundingClientRect();
      const q = still ? 1 : Math.min(1, Math.max(0, (vh - cr.top) / (cr.height / WING_AT)));
      cta.style.setProperty("--wp", (1 - q).toFixed(4));
      cta.classList.toggle("is-open", q > 0.995);
    }
    if (!revealed && p > 0.38) reveal();
  }
  addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(render); }, { passive: true });
  addEventListener("resize", render);
  render();
  if (reduced) texts.forEach((el) => el.classList.add("ascii-run"));
})();

/* =====================================================================
   14. Footer — pixel-break wordmark (component as supplied)
   ===================================================================== */

function b30FooterArt() {
  const footer = document.querySelector('.bt-footer');
  const canvas = footer.querySelector('.bt-canvas');
  const gl = canvas.getContext('webgl2', { antialias:false, alpha:false, premultipliedAlpha:false, powerPreference:'high-performance' });
  if (!gl) { footer.classList.add('no-gl'); return; }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------ Tuning ------------------------------ */
  const PIXEL_ROWS   = 30;     // the wordmark resolves into a 30-row pixel grid
  const COVERAGE     = 0.42;   // how much of a cell the letterform must fill to become a pixel
  const PIXEL_GAP    = 0.14;   // gap between pixels at rest, as a fraction of a cell
  const WAVE_SPEED   = 1.4;    // break-up wave, in logo-widths per second
  const REFORM_SPEED = 1.1;    // re-form wave, in logo-widths per second
  const BURST        = reduced ? 0 : 1050;   // spreads farther before it re-forms   // initial scatter speed (CSS px/s)
  const REPEL        = reduced ? 0 : 5200;  // cursor push strength
  const SWIRL        = reduced ? 0 : 1400;  // sideways curl around the cursor
  const REPEL_RADIUS = 150;    // CSS px
  const SPRING       = 110;     // pull back into the grid
  const DAMPING      = 8.6;    // lower = more wobble

  /* Breakthirty wordmark (white on transparent, 1593 x 278) */
  const LOGO_SRC = '/assets/images/footer-wordmark.png';
  const LOGO_BASELINE = 229/278;
  const logoImg = new Image();
  logoImg.src = LOGO_SRC;

  /* ------------------------------ Shaders ------------------------------ */
  const VS = `#version 300 es
  in vec2 aPos; void main(){ gl_Position = vec4(aPos,0.0,1.0); }`;

  const FS = `#version 300 es
  precision highp float;
  out vec4 outColor;
  uniform vec2 uRes;
  uniform float uDpr, uTime, uClock, uTravel, uGlow, uHover, uShatter, uNight;
  uniform vec2 uMouse;
  uniform vec4 uLogoBox;          // x0, y0(baseline), x1, y1(top) in uv, y up
  uniform vec4 uGrid;             // pixel grid box: x0, y0(bottom), x1, y1(top) in uv
  uniform sampler2D uLogo, uMask, uCells, uParts;

  float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx)*.1031); p3 += dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
  float vnoise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f*f*f*(f*(f*6.0-15.0)+10.0);
    float a = hash12(i), b = hash12(i+vec2(1,0)), c = hash12(i+vec2(0,1)), d = hash12(i+vec2(1,1));
    return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
  }
  const mat2 ROT = mat2(0.8,-0.6,0.6,0.8);
  float fbm(vec2 p, int oct){
    float s = 0.0, a = 0.5, n = 0.0;
    for (int i = 0; i < 6; i++){
      if (i >= oct) break;
      s += a*vnoise(p); n += a;
      p = ROT*p*2.03 + vec2(17.1, 9.2);
      a *= 0.5;
    }
    return s/n;
  }
  vec2 zoomAt(vec2 uv, vec2 c, float s){ return c + (uv - c)/s; }

  void main(){
    vec2 frag = gl_FragCoord.xy;
    vec2 uv = frag/uRes;
    float asp = uRes.x/uRes.y;
    vec2 C = vec2((uLogoBox.x+uLogoBox.z)*0.5, (uLogoBox.y+uLogoBox.w)*0.5);
    float lh = uLogoBox.w - uLogoBox.y;
    vec2 par = (uMouse - 0.5) * uHover;
    float t = uTime;
    float warm = smoothstep(0.62, 0.08, uv.x);

    /* ---------- Sky ---------- */
    vec3 skyTop = vec3(0.690,0.878,0.957);
    vec3 skyMid = vec3(0.855,0.937,0.980);
    vec3 skyLow = vec3(0.900,0.905,0.978);
    vec3 col = mix(skyLow, skyMid, smoothstep(0.28,0.62,uv.y));
    col = mix(col, skyTop, smoothstep(0.58,1.0,uv.y));

    vec2 gp = vec2((uv.x-0.64)*asp*0.8, uv.y+0.06);
    float pool = exp(-dot(gp,gp)*3.2);
    vec3 deep = vec3(0.26,0.37,0.80);
    col = mix(col, deep, pool*0.40);

    /* ---------- Back cloud bank ---------- */
    vec2 qb = zoomAt(uv, C, 1.0 + uTravel*0.045) - par*0.006;
    float hBase = uLogoBox.w + lh*0.12 + 0.10*smoothstep(0.35,1.0,qb.x);
    col = mix(col, vec3(0.86,0.85,0.975), smoothstep(hBase+0.30, hBase-0.02, qb.y)*0.55);

    float dB = 0.0, nb = 0.5, bodyB = 0.0;
    if (qb.y < hBase + 0.22){
      vec2 bp = vec2(qb.x*asp, qb.y);
      float hB = hBase + 0.16*(fbm(vec2(bp.x*0.8 + t*0.006, 3.7),3)-0.5);
      vec2 wb = vec2(fbm(bp*1.1 + vec2(t*0.020,0.0),2), fbm(bp*1.1 + vec2(4.3,2.1) - t*0.015,2));
      nb = fbm(bp*2.3 + wb*1.2 + vec2(t*0.035,0.0), 5);
      bodyB = (hB - qb.y)/0.20;
      float vB = bodyB*0.75 + (nb-0.5)*2.2 ;
      dB = smoothstep(0.0, 0.62, vB) * smoothstep(hBase + 0.22, hBase + 0.12, qb.y);
      dB *= 1.0 - smoothstep(0.0, 0.9, texture(uMask, uv).g) * 0.8;   // fades where the cursor has been
    }
    float tone = smoothstep(0.35,0.75,nb);
    vec3 bShadow = mix(vec3(0.50,0.55,0.87), vec3(0.62,0.56,0.86), warm);
    vec3 bBase   = mix(vec3(0.73,0.75,0.95), vec3(0.83,0.75,0.93), warm);
    vec3 bHi     = vec3(0.95,0.93,0.99);
    float depthB = smoothstep(0.0,1.8,bodyB);
    vec3 bc = mix(bBase, bShadow, depthB*0.75*(1.0-tone));
    bc = mix(bc, bHi, tone*tone*(1.0-depthB*0.6)*0.75);
    bc = mix(bc, deep*1.08, pool*0.50*(1.0-tone*0.7));
    col = mix(col, bc, dB*0.95);

    if (uNight < 0.5) col = mix(col, col * vec3(0.78, 0.66, 1.02) + vec3(0.05, 0.0, 0.08), smoothstep(0.42, 0.0, uv.y) * 0.75);   // deeper lilac-purple toward the bottom
    /* ---------- Logo: smooth wordmark + pixel layer ---------- */
    vec2 ql = zoomAt(uv, C, 1.0 + uTravel*0.02) - par*0.009;
    ql += vec2(sin(uClock*0.23) * 0.0022 + sin(uClock*0.6 + ql.y*9.0) * 0.0007, sin(uClock*0.31 + ql.x*5.0) * 0.0016);   // flows with the clouds, barely

    // per-cell break state: where a cell has turned into a pixel, the smooth letterform steps aside
    vec2 gq = (ql - uGrid.xy)/(uGrid.zw - uGrid.xy);
    float pc = 0.0;
    if (gq.x >= 0.0 && gq.y >= 0.0 && gq.x < 1.0 && gq.y < 1.0) pc = texture(uCells, gq).r;
    float ls = texture(uLogo, ql).a * (1.0 - smoothstep(0.12, 0.5, pc));

    vec4 P = texture(uParts, ql);                       // premultiplied pixels
    float la = max(ls, P.a);

    float g3 = textureLod(uLogo, ql, 3.0).a, g5 = textureLod(uLogo, ql, 5.0).a, g7 = textureLod(uLogo, ql, 7.0).a;
    float p3 = textureLod(uParts, ql, 3.0).a, p5 = textureLod(uParts, ql, 5.0).a, p7 = textureLod(uParts, ql, 7.0).a;
    float glowS = clamp(g3*0.25 + g5*0.55 + g7*0.9, 0.0, 1.0);
    float glowP = clamp(p3*0.22 + p5*0.40 + p7*0.6, 0.0, 1.0);
    float glowF = mix(glowS, glowP, uShatter);
    float near  = mix(g3, p3, uShatter);
    vec3 glowCol = mix(vec3(0.78,0.85,1.0), vec3(1.0), clamp(near*1.5,0.0,1.0));
    col += vec3(1.0) * glowF * (0.2 + uGlow*0.27) * (1.0 - la);   // a soft white glow round the letters   // more glow on the resting logo
    col = mix(col, vec3(1.0), ls);   // white
    col = col*(1.0 - P.a) + P.rgb;

    /* ---------- Front clouds ---------- */
    vec4 mask = texture(uMask, uv);
    float dF = 0.0, nf = 0.5;
    vec2 qf = zoomAt(uv, C, 1.0 + uTravel*0.09) - par*0.016;
    if (qf.y < uLogoBox.w + lh*1.1){
      vec2 fp = vec2(qf.x*asp, qf.y);
      float tf = t*1.6;
      float ridge  = fbm(vec2(fp.x*0.9 + tf*0.010, 7.3), 3);
      float ridge2 = fbm(vec2(fp.x*1.3 - tf*0.008, 2.1), 2);
      float hF   = uLogoBox.y + lh*(-0.35 + 1.05*smoothstep(0.38,0.70,ridge));
      float lowF = uLogoBox.y - lh*(0.25 + 0.9*ridge2);
      vec2 wf = vec2(fbm(fp*1.6 + vec2(tf*0.020,1.7),2), fbm(fp*1.6 + vec2(8.1,-tf*0.018),2));
      nf = fbm(fp*3.2 + wf*1.25 + vec2(tf*0.04,0.0), 5);
      float patchN = fbm(fp*vec2(1.1,1.7) + vec2(-tf*0.012,12.0), 3);
      float body = min((hF - qf.y)/(lh*0.55), (qf.y - lowF)/(lh*0.45));
      float vF = body*0.6 + (nf-0.5)*2.6 + (patchN-0.56)*1.2 + 0.08;   // clouds part more clearly under the cursor
      dF = smoothstep(0.02, 0.55, vF) * smoothstep(uLogoBox.w + lh*1.1, uLogoBox.w + lh*0.5, qf.y);
      dF *= 1.0 - smoothstep(0.0, 0.9, mask.g) * 0.95;                       // the clouds fade away under the cursor
    }
    float ft = smoothstep(0.30,0.80,nf);
    vec3 fShadow = mix(vec3(0.60,0.63,0.90), vec3(0.70,0.63,0.88), warm);
    vec3 fBase   = mix(vec3(0.84,0.84,0.98), vec3(0.89,0.82,0.95), warm);
    vec3 fHi     = vec3(0.985,0.975,1.0);
    vec3 fc = mix(fShadow, fBase, ft);
    fc = mix(fc, fHi, ft*ft*0.7);
    fc = mix(fc, deep*1.15, pool*0.32*(1.0-ft));
    fc += vec3(0.86,0.90,1.0) * glowF * (0.16 + uGlow*0.34) * (1.0 - dF*0.55);
    col = mix(col, fc, dF*0.92);

    /* ---------- Pixel dust ---------- */
    float cloudAmt = clamp(dB*0.75 + dF, 0.0, 1.0);
    float trail = mask.r;
    float cs = 3.0*uDpr;
    vec2 cell = floor(frag/cs);
    float h1 = hash12(cell), h2 = hash12(cell+19.19), h3 = hash12(cell+71.7);
    float upper = smoothstep(0.34, 0.5, uv.y);
    float chance = cloudAmt*0.016*upper + 0.0016*(1.0 - upper) + trail*(0.012 + cloudAmt*0.05);   // just a few, very faint, low down
    float sp = step(1.0-chance, h1);
    float tw = 0.5 + 0.5*sin(uClock*(0.7+h2*2.4) + h3*6.2831);
    vec3 spc = h2 > 0.72 ? vec3(0.99,0.80,0.94) : (h2 > 0.55 ? vec3(0.82,0.90,1.0) : vec3(1.0));
    col = mix(col, spc, sp*tw*0.85*mix(0.35, 1.0, max(upper, trail))*(1.0-la));

    vec2 cell2 = floor(frag/(5.0*uDpr));
    float k1 = hash12(cell2+5.5), k2 = hash12(cell2+2.2);
    float sp2 = step(1.0 - cloudAmt*0.0035*upper - trail*0.006, k1);
    col = mix(col, vec3(1.0), sp2*(0.45+0.45*sin(uClock*(0.5+k2*1.5)+k2*9.0))*(1.0-la));

    /* ---------- Fine grain ---------- */
    col += (hash12(frag + fract(uClock*0.37)*113.0) - 0.5)*0.014;

    if (uNight > 0.0) {                        // dark theme: the same sky at night — deep where it's clear, the clouds kept lighter so they still read
      float L = dot(col, vec3(0.299, 0.587, 0.114));
      vec3 night = mix(col * vec3(0.22, 0.26, 0.45), col * vec3(0.60, 0.62, 0.84), smoothstep(0.82, 0.98, L));
      night = mix(night, night * vec3(1.32, 0.9, 1.18) + vec3(0.05, 0.0, 0.06), smoothstep(0.45, 0.0, uv.y) * 0.85);   // a little more purple towards the bottom
      col = mix(col, mix(night, col, la), uNight);   // the wordmark and its pixels stay as they are
    }
    outColor = vec4(col, 1.0);
  }`;

  /* Instanced square pixels, drawn into an offscreen layer in logo space */
  const PVS = `#version 300 es
  in vec2 aCorner;
  in vec4 iA;      // x, y (canvas px, y down), size, alpha
  in vec3 iC;      // colour
  uniform vec2 uRes;
  out vec4 vC;
  void main(){
    vec2 p = iA.xy + (aCorner - 0.5)*iA.z;
    gl_Position = vec4(p.x/uRes.x*2.0 - 1.0, 1.0 - p.y/uRes.y*2.0, 0.0, 1.0);
    vC = vec4(iC*iA.w, iA.w);
  }`;
  const PFS = `#version 300 es
  precision mediump float;
  in vec4 vC; out vec4 o;
  void main(){ o = vC; }`;

  function compile(type, src){
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(s)); return null; }
    return s;
  }
  function program(vsrc, fsrc){
    const vs = compile(gl.VERTEX_SHADER, vsrc), fs = compile(gl.FRAGMENT_SHADER, fsrc);
    if (!vs || !fs) return null;
    const p = gl.createProgram();
    gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { console.error(gl.getProgramInfoLog(p)); return null; }
    return p;
  }
  const prog = program(VS, FS), pprog = program(PVS, PFS);
  if (!prog || !pprog) { footer.classList.add('no-gl'); return; }

  // full-screen triangle
  const vaoMain = gl.createVertexArray();
  gl.bindVertexArray(vaoMain);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  // pixel quads
  const vaoParts = gl.createVertexArray();
  gl.bindVertexArray(vaoParts);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0, 1,0, 0,1, 0,1, 1,0, 1,1]), gl.STATIC_DRAW);
  const aCorner = gl.getAttribLocation(pprog, 'aCorner');
  gl.enableVertexAttribArray(aCorner);
  gl.vertexAttribPointer(aCorner, 2, gl.FLOAT, false, 0, 0);
  const instBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, instBuf);
  const iA = gl.getAttribLocation(pprog, 'iA'), iC = gl.getAttribLocation(pprog, 'iC');
  gl.enableVertexAttribArray(iA); gl.vertexAttribPointer(iA, 4, gl.FLOAT, false, 28, 0);  gl.vertexAttribDivisor(iA, 1);
  gl.enableVertexAttribArray(iC); gl.vertexAttribPointer(iC, 3, gl.FLOAT, false, 28, 16); gl.vertexAttribDivisor(iC, 1);
  gl.bindVertexArray(null);

  const U = {};
  gl.useProgram(prog);
  ['uRes','uDpr','uTime','uClock','uTravel','uGlow','uHover','uShatter','uNight','uMouse','uLogoBox','uGrid','uLogo','uMask','uCells','uParts']
    .forEach(n => U[n] = gl.getUniformLocation(prog, n));
  gl.uniform1i(U.uLogo, 0); gl.uniform1i(U.uMask, 1); gl.uniform1i(U.uCells, 2); gl.uniform1i(U.uParts, 3);
  const PU_RES = gl.getUniformLocation(pprog, 'uRes');

  function makeTex(unit, minF, magF){
    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minF);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magF);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
  }
  const logoTex  = makeTex(0, gl.LINEAR_MIPMAP_LINEAR, gl.LINEAR);
  const maskTex  = makeTex(1, gl.LINEAR, gl.LINEAR);
  const cellTex  = makeTex(2, gl.NEAREST, gl.NEAREST);
  const partsTex = makeTex(3, gl.LINEAR_MIPMAP_LINEAR, gl.LINEAR);
  const fbo = gl.createFramebuffer();

  /* ------------------------------ State ------------------------------ */
  let W = 0, H = 0, scale = 1, cw = 0, ch = 0;
  let logoRect = { x:0, y:0, w:0, h:0 };
  let logoBoxUV = [0,0,1,1], gridUV = [0,0,1,1];
  let logoPx = { left:0, top:0, w:0, h:0 };
  let MW = 160, MH = 100, trailA, clearA, maskBytes;

  // pixel grid
  let cellSize = 1, cols = 1, rows = PIXEL_ROWS, cellBytes = new Uint8Array(1);
  let N = 0, hx, hy, ox, oy, vx, vy, pv, tOn, tOff, act, rA, rB, rC, cellIdx, inst;
  let halo = [];     // empty cells that touch a pixel: [cellIndex, neighbourParticleIndices...]

  function hash(n){ const s = Math.sin(n*127.1 + 311.7)*43758.5453; return s - Math.floor(s); }

  function buildLogo(){
    const c = document.createElement('canvas'); c.width = cw; c.height = ch;
    const x = c.getContext('2d', { willReadFrequently:true });
    const iw = logoImg.naturalWidth || 1593, ih = logoImg.naturalHeight || 278;

    const MOB = matchMedia('(max-width: 899px)').matches;   // phones: the wordmark a touch wider and lower
    let w = cw*(MOB ? 0.92 : 0.83), h = w*ih/iw;
    const maxAsc = ch*0.24;
    if (h*LOGO_BASELINE > maxAsc){ h = maxAsc/LOGO_BASELINE; w = h*iw/ih; }
    w = Math.round(w); h = Math.round(h);
    const left = Math.round((cw - w)/2);
    const baseline = MOB ? Math.round(ch - 104*scale) : Math.round(ch*0.815);   // phones: just above the © line; desktop: the descender of the y stays clear of the bottom rule
    const top = Math.round(baseline - h*LOGO_BASELINE);

    x.imageSmoothingEnabled = true;
    x.imageSmoothingQuality = 'high';
    x.drawImage(logoImg, left, top, w, h);

    if (w > iw*1.15){
      const rx = Math.max(0,left), ry = Math.max(0,top);
      const rw = Math.min(cw-rx, w), rh = Math.min(ch-ry, h);
      const img = x.getImageData(rx, ry, rw, rh), d = img.data;
      for (let i = 3; i < d.length; i += 4){
        const a = d[i]/255, s = Math.min(1, Math.max(0, (a-0.5)*1.9 + 0.5));
        d[i] = s*s*(3-2*s)*255;
      }
      x.putImageData(img, rx, ry);
    }

    uploadCanvas(0, logoTex, c, true);
    logoBoxUV = [left/cw, 1 - baseline/ch, (left+w)/cw, 1 - top/ch];
    logoRect = { x:left/scale, y:top/scale, w:w/scale, h:h/scale };
    logoPx = { left, top, w, h };
    buildGrid(x, left, top, w, h);
  }

  function buildGrid(x, left, top, w, h){
    cellSize = h / PIXEL_ROWS;
    rows = PIXEL_ROWS;
    cols = Math.ceil(w / cellSize);
    const gw = Math.min(cw - left, Math.ceil(cols*cellSize));
    const d = x.getImageData(left, top, gw, h).data;
    const sum = new Float32Array(cols*rows), cnt = new Float32Array(cols*rows);
    for (let py = 0; py < h; py++){
      const r = Math.min(rows-1, Math.floor(py / cellSize));
      for (let px = 0; px < gw; px++){
        const ci = Math.min(cols-1, Math.floor(px / cellSize));
        const k = r*cols + ci;
        sum[k] += d[(py*gw + px)*4 + 3]; cnt[k] += 1;
      }
    }
    const filled = new Int32Array(cols*rows).fill(-1);
    const list = [];
    for (let k = 0; k < cols*rows; k++){
      if (cnt[k] && sum[k]/cnt[k]/255 >= COVERAGE){ filled[k] = list.length; list.push(k); }
    }
    N = list.length;
    hx = new Float32Array(N); hy = new Float32Array(N);
    ox = new Float32Array(N); oy = new Float32Array(N);
    vx = new Float32Array(N); vy = new Float32Array(N);
    pv = new Float32Array(N); tOn = new Float32Array(N); tOff = new Float32Array(N);
    act = new Uint8Array(N); rA = new Float32Array(N); rB = new Float32Array(N); rC = new Float32Array(N);
    cellIdx = new Int32Array(N);
    inst = new Float32Array(N*7);
    for (let i = 0; i < N; i++){
      const k = list[i], r = Math.floor(k/cols), ci = k % cols;
      cellIdx[i] = k;
      hx[i] = left + (ci + 0.5)*cellSize;
      hy[i] = top  + (r  + 0.5)*cellSize;
      rA[i] = hash(k*1.13 + 0.5); rB[i] = hash(k*2.71 + 7.3); rC[i] = hash(k*0.37 + 19.9);
    }
    // empty cells bordering pixels borrow their neighbours' state, so no smooth slivers are left behind
    halo = [];
    for (let k = 0; k < cols*rows; k++){
      if (filled[k] >= 0 || !cnt[k] || sum[k] === 0) continue;
      const r = Math.floor(k/cols), ci = k % cols, nb = [];
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++){
        const rr = r+dy, cc = ci+dx;
        if (rr < 0 || cc < 0 || rr >= rows || cc >= cols) continue;
        const f = filled[rr*cols + cc];
        if (f >= 0) nb.push(f);
      }
      if (nb.length) halo.push([k, nb]);
    }
    cellBytes = new Uint8Array(cols*rows);
    gridUV = [left/cw, 1 - (top + rows*cellSize)/ch, (left + cols*cellSize)/cw, 1 - top/ch];

    // offscreen pixel layer at canvas resolution
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, partsTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, cw, ch, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, partsTex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.bindBuffer(gl.ARRAY_BUFFER, instBuf);
    gl.bufferData(gl.ARRAY_BUFFER, inst.byteLength, gl.DYNAMIC_DRAW);
    mode = 0;
  }

  function uploadCanvas(unit, tex, cnv, mip){
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cnv);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    if (mip) gl.generateMipmap(gl.TEXTURE_2D);
  }

  function buildMask(){
    MW = 160; MH = Math.max(40, Math.round(160*H/W));
    trailA = new Float32Array(MW*MH);
    clearA = new Float32Array(MW*MH);
    maskBytes = new Uint8Array(MW*MH*4);
  }

  function layout(){
    const r = footer.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    scale = Math.min(dpr, Math.sqrt(1.5e6/(W*H)));
    cw = Math.round(W*scale); ch = Math.round(H*scale);
    canvas.width = cw; canvas.height = ch;
    buildLogo();
    buildMask();
  }

  /* ------------------------------ Pointer ------------------------------ */
  const pointer = { x:0.5, y:0.5, inside:false, cx:0, cy:0 };
  let lastStamp = null;
  const smooth = { x:0.5, y:0.5 };

  function onMove(e){
    const r = footer.getBoundingClientRect();
    pointer.cx = e.clientX - r.left; pointer.cy = e.clientY - r.top;
    pointer.x = pointer.cx / r.width; pointer.y = 1 - pointer.cy / r.height;
    pointer.inside = true;
  }
  footer.addEventListener('pointermove', onMove, { passive:true });
  footer.addEventListener('pointerdown', onMove, { passive:true });
  footer.addEventListener('pointerleave', () => { pointer.inside = false; lastStamp = null; });

  function stamp(ux, uy, radiusPx, rAmt, gAmt){
    const gx = ux*MW, gy = uy*MH;
    const rad = radiusPx / W * MW;
    const r2 = rad*rad;
    const x0 = Math.max(0, Math.floor(gx-rad*1.6)), x1 = Math.min(MW-1, Math.ceil(gx+rad*1.6));
    const y0 = Math.max(0, Math.floor(gy-rad*1.6)), y1 = Math.min(MH-1, Math.ceil(gy+rad*1.6));
    for (let y = y0; y <= y1; y++){
      for (let x = x0; x <= x1; x++){
        const dx = x+0.5-gx, dy = y+0.5-gy;
        const w = Math.exp(-(dx*dx+dy*dy)/(r2*0.55));
        const i = y*MW + x;
        if (rAmt) trailA[i] = Math.max(trailA[i], w*rAmt);
        if (gAmt) clearA[i] = Math.min(1, clearA[i] + w*gAmt);
      }
    }
  }

  /* ------------------------------ Pixel physics ------------------------------ */
  let mode = 0;                          // 0 = whole, 1 = breaking / broken, 2 = re-forming
  let onLogo = false;
  const lp = { x:0, y:0, px:0, py:0, vx:0, vy:0, has:false };   // pointer in logo space (canvas px, y down)

  function pointerToLogo(travel, hover){
    // inverse of the shader's logo transform, so pixels react exactly under the cursor
    const s = 1 + travel*0.02;
    const Cx = (logoBoxUV[0] + logoBoxUV[2])*0.5, Cy = (logoBoxUV[1] + logoBoxUV[3])*0.5;
    const parx = (smooth.x - 0.5)*hover, pary = (smooth.y - 0.5)*hover;
    const qx = Cx + (pointer.x - Cx)/s - parx*0.009;
    const qy = Cy + (pointer.y - Cy)/s - pary*0.009;
    return [qx*cw, (1 - qy)*ch];
  }

  function startBreak(ex, ey, now){
    const speed = WAVE_SPEED * logoPx.w;
    for (let i = 0; i < N; i++){
      if (act[i] && pv[i] > 0.5) continue;           // already a pixel, leave it be
      act[i] = 0;
      const d = Math.hypot(hx[i]-ex, hy[i]-ey);
      tOn[i] = now + d/speed + rA[i]*0.12;
    }
    mode = 1;
  }
  function startReform(ex, ey, now){
    const speed = REFORM_SPEED * logoPx.w;
    for (let i = 0; i < N; i++){
      const d = Math.hypot(hx[i]-ex, hy[i]-ey);
      tOff[i] = now + rB[i]*0.03;   // re-form immediately on leave
    }
    mode = 2;
  }

  function stepPixels(dt, now, inside){
    const s = scale;
    const R = REPEL_RADIUS*s, R2 = R*R;
    const cell = cellSize;
    let sumP = 0, visible = 0, n = 0;
    for (let i = 0; i < N; i++){
      // break / re-form timing
      if (mode === 1 && !act[i] && now >= tOn[i]){
        act[i] = 1;
        let dx = hx[i] - lp.x, dy = hy[i] - lp.y;
        const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
        const a = (rB[i] - 0.5)*0.9, ca = Math.cos(a), sa = Math.sin(a);
        const fall = 0.35 + 0.65*Math.exp(-d/(logoPx.w*0.28));
        const sp = BURST*s*fall*(0.55 + 0.9*rA[i]);
        vx[i] += (dx*ca - dy*sa)*sp;
        vy[i] += (dx*sa + dy*ca)*sp - BURST*s*0.35*rC[i]*fall;
      }
      if (mode === 2 && act[i] && now >= tOff[i]) act[i] = 0;

      const dispX = ox[i], dispY = oy[i];
      const disp = Math.hypot(dispX, dispY);
      if (act[i]) pv[i] += (1 - pv[i])*Math.min(1, dt*12);
      else if (disp < cell*0.5) pv[i] = Math.max(0, pv[i] - dt*9);

      // a quiet shimmer keeps the broken grid alive
      const amp = cell*(onLogo ? 2.4 : 0.045)*pv[i]*(reduced ? 0 : 1);   // hovered: pixels float freely in space
      const tx = Math.sin(now*(0.55 + rA[i]*0.9) + rB[i]*6.283)*amp;
      const ty = Math.cos(now*(0.50 + rC[i]*0.8) + rA[i]*6.283)*amp;

      let ax = -(onLogo ? SPRING*0.3 : SPRING)*(dispX - tx) - DAMPING*vx[i];
      let ay = -(onLogo ? SPRING*0.3 : SPRING)*(dispY - ty) - DAMPING*vy[i];

      if (inside && pv[i] > 0.02 && lp.has){
        const dx = hx[i] + dispX - lp.x, dy = hy[i] + dispY - lp.y;
        const d2 = dx*dx + dy*dy;
        if (d2 < R2){
          const d = Math.sqrt(d2) || 1, f = (1 - d/R), f2 = f*f;
          ax += (dx/d*REPEL + (-dy/d)*SWIRL)*f2*s*pv[i];
          ay += (dy/d*REPEL + ( dx/d)*SWIRL)*f2*s*pv[i];
          if (!reduced){ ax += lp.vx*f2*0.9; ay += lp.vy*f2*0.9; }
        }
      }
      vx[i] += ax*dt; vy[i] += ay*dt;
      ox[i] += vx[i]*dt; oy[i] += vy[i]*dt;

      cellBytes[cellIdx[i]] = pv[i]*255;
      sumP += pv[i];

      const alpha = Math.min(1, pv[i]/0.35);
      if (alpha <= 0.002) continue;
      const nd = Math.hypot(ox[i], oy[i]) / cell;
      const speed = Math.hypot(vx[i], vy[i]) / s;
      const gap = PIXEL_GAP + Math.min(0.12, nd*0.02);
      const size = cell*(1 - gap)*(1 + Math.min(0.18, speed/3000));
      const fade = 1 - Math.min(0.3, nd/30);
      // colour: mostly white, a few cool/lilac pixels, moving ones pick up a cool tint
      let r = 1, g = 1, b = 1;
      if (rC[i] > 0.94){ r = 0.90; g = 0.89; b = 1.0; }
      else if (rC[i] > 0.89){ r = 0.88; g = 0.93; b = 1.0; }
      const m = Math.min(1, speed/900)*0.32;
      r += (0.80 - r)*m; g += (0.86 - g)*m;
      const o = n*7;
      inst[o]   = hx[i] + ox[i]; inst[o+1] = hy[i] + oy[i];
      inst[o+2] = size;          inst[o+3] = alpha*fade;
      inst[o+4] = r; inst[o+5] = g; inst[o+6] = b;
      n++;
    }
    for (let j = 0; j < halo.length; j++){
      const [k, nb] = halo[j];
      let m = 0; for (let q = 0; q < nb.length; q++) m = Math.max(m, pv[nb[q]]);
      cellBytes[k] = m*255;
    }
    if (mode === 2 && sumP === 0) mode = 0;
    return { count:n, shatter: N ? sumP/N : 0 };
  }

  /* ------------------------------ Loop ------------------------------ */
  let hover = 0, travel = 0, glow = 0, cloudTime = 0, clock = 0, prev = performance.now();
  let running = true, ready = false;

  function frame(now){
    requestAnimationFrame(frame);
    if (!running || !ready) { prev = now; return; }
    if (!pointer.inside && hover < 0.01 && !onLogo && (frame.sk = !frame.sk)) return;   // idle: the clouds drift at 30fps
    const dt = Math.min(0.05, (now - prev)/1000); prev = now;

    const inside = pointer.inside;
    const m = onLogo ? 8 : 4;         // a little hysteresis so the edge doesn't flicker
    const overLogo = inside &&
      pointer.cx > logoRect.x - m && pointer.cx < logoRect.x + logoRect.w + m &&
      pointer.cy > logoRect.y - m && pointer.cy < logoRect.y + logoRect.h + m;

    hover  += ((inside ? 1 : 0) - hover) * (1 - Math.exp(-dt*2.5));
    travel += ((inside && !reduced ? 1 : 0) - travel) * (1 - Math.exp(-dt*(inside ? 0.55 : 0.9)));
    glow   += ((overLogo ? 1 : 0) - glow) * (1 - Math.exp(-dt*(overLogo ? 4 : 2.2)));
    smooth.x += (pointer.x - smooth.x) * (1 - Math.exp(-dt*2));
    smooth.y += (pointer.y - smooth.y) * (1 - Math.exp(-dt*2));
    cloudTime += dt * (1 + travel*1.1) * (reduced ? 0.35 : 1);
    clock += dt;

    // pointer in logo space + its velocity
    if (inside){
      const [x, y] = pointerToLogo(travel, hover);
      if (lp.has && dt > 0){
        lp.vx += ((x - lp.x)/dt - lp.vx)*Math.min(1, dt*14);
        lp.vy += ((y - lp.y)/dt - lp.vy)*Math.min(1, dt*14);
      } else { lp.vx = lp.vy = 0; }
      lp.x = x; lp.y = y; lp.has = true;
    } else { lp.has = false; lp.vx = lp.vy = 0; }

    if (overLogo && !onLogo){ onLogo = true;  startBreak(lp.x, lp.y, clock); }
    if (!overLogo && onLogo){ onLogo = false; startReform(lp.has ? lp.x : logoPx.left + logoPx.w/2, lp.has ? lp.y : logoPx.top + logoPx.h/2, clock); }

    const px = stepPixels(dt, clock, inside);

    // decay interaction fields
    const kR = Math.exp(-dt*1.25), kG = dt*0.16;
    for (let i = 0; i < trailA.length; i++){ trailA[i] *= kR; clearA[i] = Math.max(0, clearA[i] - kG); }

    if (inside){
      const cur = { x:pointer.x, y:pointer.y };
      const from = lastStamp || cur;
      const distPx = Math.hypot((cur.x-from.x)*W, (cur.y-from.y)*H);
      const steps = Math.max(1, Math.ceil(distPx/18));
      for (let s = 1; s <= steps; s++){
        const f = s/steps;
        stamp(from.x + (cur.x-from.x)*f, from.y + (cur.y-from.y)*f, 80, 1, 0);
      }
      stamp(cur.x, cur.y, 125, 0, dt*3.4);
      lastStamp = cur;
    }

    for (let i = 0, j = 0; i < trailA.length; i++, j += 4){
      maskBytes[j]   = trailA[i]*255;
      maskBytes[j+1] = clearA[i]*255;
    }
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, maskTex);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, MW, MH, 0, gl.RGBA, gl.UNSIGNED_BYTE, maskBytes);

    // cell state (row 0 at the top in the grid, flipped here so v=0 is the bottom)
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, cellTex);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    if (!frame.flip || frame.flip.length !== cellBytes.length) frame.flip = new Uint8Array(cellBytes.length);
    for (let r = 0; r < rows; r++) frame.flip.set(cellBytes.subarray(r*cols, r*cols + cols), (rows-1-r)*cols);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, cols, rows, 0, gl.RED, gl.UNSIGNED_BYTE, frame.flip);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);

    // pixel layer: only while pixels are moving (or once more, to clear them)
    if (px.count || frame.hadPx !== false) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.viewport(0, 0, cw, ch);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    if (px.count){
      gl.useProgram(pprog);
      gl.uniform2f(PU_RES, cw, ch);
      gl.bindVertexArray(vaoParts);
      gl.bindBuffer(gl.ARRAY_BUFFER, instBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, inst, 0, px.count*7);
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, px.count);
      gl.disable(gl.BLEND);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, partsTex);
    gl.generateMipmap(gl.TEXTURE_2D);
    }
    frame.hadPx = px.count > 0;

    // scene
    gl.viewport(0, 0, cw, ch);
    gl.useProgram(prog);
    gl.bindVertexArray(vaoMain);
    gl.uniform2f(U.uRes, cw, ch);
    gl.uniform1f(U.uDpr, scale);
    gl.uniform1f(U.uTime, cloudTime);
    gl.uniform1f(U.uNight, window.B30T && B30T.dark() ? 1 : 0);
    gl.uniform1f(U.uClock, clock);
    gl.uniform1f(U.uTravel, travel);
    gl.uniform1f(U.uGlow, glow);
    gl.uniform1f(U.uHover, hover);
    gl.uniform1f(U.uShatter, Math.min(1, px.shatter*1.4));
    gl.uniform2f(U.uMouse, smooth.x, smooth.y);
    gl.uniform4f(U.uLogoBox, logoBoxUV[0], logoBoxUV[1], logoBoxUV[2], logoBoxUV[3]);
    gl.uniform4f(U.uGrid, gridUV[0], gridUV[1], gridUV[2], gridUV[3]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  new IntersectionObserver(([e]) => { running = e.isIntersecting; }).observe(footer);
  let rz = 0;
  new ResizeObserver(() => { cancelAnimationFrame(rz); rz = requestAnimationFrame(() => ready && layout()); }).observe(footer);

  logoImg.decode().catch(() => {}).then(() => { layout(); ready = true; });
  requestAnimationFrame(frame);
}
/* Start the footer wordmark only when the page nears the footer: setting up its WebGL shaders can take a second or
   more on a first visit, and the footer is the last thing on the page, so it shouldn't hold up the first screen. */
(() => {
  const f = document.querySelector('.bt-footer'); if (!f) return;
  let started = false;
  const io = new IntersectionObserver((es) => {
    if (started || !es.some((e) => e.isIntersecting)) return;
    started = true; io.disconnect(); b30FooterArt();
  }, { rootMargin: '1500px 0px' });
  io.observe(f);
})();

/* =====================================================================
   The pixel band into the footer (Figma: the footer's band, same grid as the services band). It builds itself
   as you arrive, exactly as the services band does: bottom rows first, each pixel settling in from a slightly
   smaller square, gliding on after the wheel stops.
   ===================================================================== */
(() => {
  const ft = document.getElementById("footer"); if (!ft) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)"), mobile = matchMedia("(max-width: 899px)");
  const CELL = 80, H = 208;   // the services band's three stepped rows, the last one sitting on the footer
  // (one cell added under column 12 so nothing hangs in the air: every pixel connects down to the footer)
  const ROWS = { "-33": [8, 9, 10, 12, 14, 17, 18, 19, 20, 21], "47": [1, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20],
    "127": [1, 3, 4, 6, 8, 9, 10, 12, 13, 14, 16, 17, 18, 21, 23] };
  const rr = (n) => { const v = Math.sin(n * 91.345 + 7.13) * 43758.5453; return v - Math.floor(v); };
  const cells = []; let n = 0;
  Object.keys(ROWS).forEach((k) => { const y = +k, yn = (y + 33) / 160; ROWS[k].forEach((c) => cells.push({ x: c * CELL, y, t0: (1 - yn) * 0.62 + rr(++n) * 0.2 })); });
  const cv = document.createElement("canvas"); cv.className = "b30fb"; cv.setAttribute("aria-hidden", "true"); ft.insertBefore(cv, ft.firstChild);
  const ctx = cv.getContext("2d");
  let s = 1, dpr = 1, cur = 0, lastPr = -1, raf = 0;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  function size() { s = document.documentElement.clientWidth / 1920; dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = Math.round(1920 * s * dpr); cv.height = Math.round(H * s * dpr); lastPr = -1; draw(); }
  function progress() { const top = cv.getBoundingClientRect().top, vh = innerHeight; return reduce.matches || mobile.matches ? 1 : Math.min(1, Math.max(0, (vh + 100 - top) / (vh * 0.8))); }
  function draw() {
    raf = 0;
    const goal = progress();
    cur += (goal - cur) * (reduce.matches ? 1 : 0.13);
    if (Math.abs(goal - cur) < 0.0006) cur = goal;
    if (cur !== goal) raf = requestAnimationFrame(draw);
    if (Math.abs(cur - lastPr) < 0.0002) return;
    const pr = (lastPr = cur);
    ctx.setTransform(s * dpr, 0, 0, s * dpr, 0, 0); ctx.clearRect(0, 0, 1920, H);
    { const cs = getComputedStyle(cv), gr = ctx.createLinearGradient(0, 0, 0, H);   // darker at the top, easing into the footer's colour
      gr.addColorStop(0, cs.getPropertyValue("--fb-top").trim() || "#7DBFEA"); gr.addColorStop(1, cs.getPropertyValue("--fb-bot").trim() || "#9DD4F2"); ctx.fillStyle = gr; }
    for (const c of cells) {
      const a = Math.min(1, Math.max(0, (pr - c.t0) / 0.05)); if (a <= 0) continue;
      const e = easeOut(a), sz = CELL * (0.74 + 0.26 * e) + 1, o = (CELL - sz) / 2;
      ctx.globalAlpha = e; ctx.fillRect(c.x + o, c.y + o, sz, sz);
    }
    ctx.globalAlpha = 1;
  }
  addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(draw); }, { passive: true });
  addEventListener("resize", size); addEventListener("b30:theme", () => { lastPr = -1; draw(); });
  size();
})();
/* Partners tabs: the two live icons — a turning ball of partner-colour tiles (an icosahedron) and a turning pixel globe */
(() => {
  const pg = document.querySelector(".pg"); if (!pg || !window.B30_OG) return;
  const { PARTNERS, LAND_BITS } = window.B30_OG, D2R = Math.PI / 180, RED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bits = Uint8Array.from(atob(LAND_BITS), (c) => c.charCodeAt(0));
  const isLand = (lat, lon) => { const y = Math.min(359, Math.max(0, Math.floor((90 - lat) * 2))), x = ((Math.floor((lon + 180) * 2) % 720) + 720) % 720, i = y * 720 + x; return (bits[i >> 3] >> (i & 7)) & 1; };
  const land = []; for (let i = 0; i < 1400; i++) { const y = 1 - ((i + 0.5) / 1400) * 2, lat = Math.asin(y) / D2R, lon = ((i * 137.50776) % 360) - 180; if (isLand(lat, lon)) land.push([lat * D2R, lon * D2R]); }
  const P = (1 + Math.sqrt(5)) / 2, V = [[-1, P, 0], [1, P, 0], [-1, -P, 0], [1, -P, 0], [0, -1, P], [0, 1, P], [0, -1, -P], [0, 1, -P], [P, 0, -1], [P, 0, 1], [-P, 0, -1], [-P, 0, 1]].map((v) => { const l = Math.hypot(...v); return v.map((q) => q / l); });
  const E = []; for (let i = 0; i < 12; i++) for (let j = i + 1; j < 12; j++) { const d = Math.hypot(V[i][0] - V[j][0], V[i][1] - V[j][1], V[i][2] - V[j][2]); if (d < 1.1) E.push([i, j]); }
  const cols = PARTNERS.slice(0, 12).map((p) => p.bg);
  const icons = [...pg.querySelectorAll(".pg__tab")].map((b) => { const cv = document.createElement("canvas"); cv.className = "pg__ic3"; cv.setAttribute("aria-hidden", "true"); b.appendChild(cv); return { b, cv, g: cv.getContext("2d"), kind: b.dataset.to }; });
  const size = () => icons.forEach((o) => { const r = o.cv.getBoundingClientRect(), d = Math.min(3, devicePixelRatio || 1) * 2; o.cv.width = Math.round(r.width * d); o.cv.height = Math.round(r.height * d); o.s = o.cv.width / 22; });
  size(); addEventListener("resize", size);
  let vis = false; new IntersectionObserver(([e]) => (vis = e.isIntersecting)).observe(pg.querySelector(".pg__tabs"));
  (function tick(now) {
    requestAnimationFrame(tick); if (!vis) return;
    const t = RED ? 0.7 : now / 1000;
    for (const o of icons) {
      const g = o.g, hot = o.b.getAttribute("aria-pressed") === "true" || o.b.matches(":hover"), sp = hot ? 1 : 0.55;
      g.setTransform(o.s, 0, 0, o.s, 0, 0); g.clearRect(0, 0, 22, 22);
      const ink = getComputedStyle(o.cv).color;
      if (o.kind === "global") {
        const R = 9, tilt = 20 * D2R, ct = Math.cos(tilt), st = Math.sin(tilt), r = t * 0.8 * sp;
        g.globalAlpha = 0.3; g.strokeStyle = ink; g.lineWidth = 0.7; g.beginPath(); g.arc(11, 11, R + 0.4, 0, Math.PI * 2); g.stroke();
        g.fillStyle = ink;
        for (const [la, lo] of land) { const cl = Math.cos(la), x = cl * Math.sin(lo + r), y0 = Math.sin(la), z0 = cl * Math.cos(lo + r), z = y0 * st + z0 * ct;
          if (z < 0) continue; g.globalAlpha = 0.25 + 0.75 * z; const s = 0.9 + 0.5 * z; g.fillRect(11 + x * R - s / 2, 11 - (y0 * ct - z0 * st) * R - s / 2, s, s); }
      } else {
        const ay = t * 0.9 * sp, ax = 0.45 + Math.sin(t * 0.4) * 0.25, cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax), R = 8.4;
        const Q = V.map(([x, y, z]) => { const x1 = x * cy + z * sy, z1 = -x * sy + z * cy, y1 = y * cx - z1 * sx, z2 = y * sx + z1 * cx, k = 3.2 / (3.2 - z2); return [11 + x1 * R * k, 11 - y1 * R * k, z2]; });
        g.strokeStyle = ink; g.lineWidth = 0.45;
        for (const [i, j] of E) { g.globalAlpha = 0.12 + 0.2 * ((Q[i][2] + Q[j][2]) / 2 + 1) / 2; g.beginPath(); g.moveTo(Q[i][0], Q[i][1]); g.lineTo(Q[j][0], Q[j][1]); g.stroke(); }
        Q.map((q, i) => [q, i]).sort((p, q) => p[0][2] - q[0][2]).forEach(([q, i]) => { const s = 1.9 + 1.4 * (q[2] + 1) / 2; g.globalAlpha = 0.45 + 0.55 * (q[2] + 1) / 2; g.fillStyle = cols[i % cols.length]; g.fillRect(q[0] - s / 2, q[1] - s / 2, s, s); });
      }
      g.globalAlpha = 1;
    }
  })(performance.now());
})();
(() => { const pg = document.querySelector(".pg"); if (!pg) return; new IntersectionObserver(([e]) => (window.__pgVis = e.isIntersecting), { rootMargin: "100px 0px" }).observe(pg); })();

/* Footer reveal: the footer's contents hold still against the screen's bottom while its box rises with the page, so the
   page above seems to slide up off a footer that was there all along; the white stripe at its top edge steps in to the
   side lines (82 / 1838) as it goes */
(() => { const ft = document.getElementById("footer"), inner = ft && ft.querySelector(".b30f__in"); if (!inner) return;
  if (matchMedia("(max-width: 899px)").matches) return;
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  ["b", "a"].forEach((n) => { const d = document.createElement("div"); d.className = "b30f__st " + n; d.setAttribute("aria-hidden", "true"); ft.appendChild(d); });   // the page's white edge, in the same three steps as the partners strip
  // the reveal, choreographed: the steps cut in one after another (the wider one first), the footer's content rises in
  // behind them in a stagger, then the steps lift away in turn (the inner one first) so no white is left on screen
  // exactly the partners strip's animation: the steps draw in from full width as the footer rises up the screen,
  // with the same pace and the same gentle catch-up; no parallax on the footer itself
  let raf = 0, cur = -1, last = 0;
  const frame = (now) => { raf = 0;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016); last = now;
    const stp = document.querySelector('.ct-steps'), r = (stp || ft).getBoundingClientRect(), vh = innerHeight;   // timed on the steps themselves, exactly as the hero strip is timed on its own top edge
    const spT = REDUCED ? 1 : Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.6))), spG = spT * spT * (3 - 2 * spT);
    cur = cur < 0 ? spG : cur + (spG - cur) * (1 - Math.exp(-dt * 9));
    if (Math.abs(spG - cur) < 0.001) cur = spG;
    [ft, document.querySelector('.ct-steps')].forEach((el) => { if (el) { el.style.setProperty("--fb", cur.toFixed(4)); el.style.setProperty("--fa", cur.toFixed(4)); } });
    if (cur !== spG) raf = requestAnimationFrame(frame); else last = 0; };
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
  addEventListener("scroll", kick, { passive: true }); addEventListener("resize", kick); kick(); })();

(() => { const f = document.getElementById('footer'), c = document.getElementById('contact'); if (!f || !c) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let raf = 0; const D = () => Math.min(innerHeight * .55, 520 * document.documentElement.clientWidth / 1920, c.offsetHeight);   // never tucked further up than the closing band can cover
  let cur = 0;
  const set = () => { raf = 0; const d = D(), top = f.getBoundingClientRect().top - cur, vh = innerHeight;   // where the footer would be without the offset
    const p = Math.max(0, Math.min(1, (vh - top) / (vh * .9)));            // 0 as the footer's place reaches the bottom of the screen
    cur = -(1 - p) * d; f.style.transform = `translate3d(0,${cur.toFixed(1)}px,0)`; };   // it starts tucked up behind the closing section and eases down into place
  const req = () => { if (!raf) raf = requestAnimationFrame(set); };
  addEventListener('scroll', req, { passive: true }); addEventListener('resize', req); set(); })();

/* the footer's white steps become the closing section's lower edge (on the top layer): as the page scrolls up, that
   stepped edge lifts away and the footer behind it is revealed — and the steps still animate as before */
(() => { const c = document.getElementById('contact'), sts = document.querySelectorAll('#footer .b30f__st'); if (!c || !sts.length) return;
  const w = document.createElement('div'); w.className = 'ct-steps'; w.setAttribute('aria-hidden', 'true'); sts.forEach((e) => w.appendChild(e)); c.appendChild(w); })();

/* the footer heading rises in (like every other heading) once it is actually uncovered — the footer sits tucked under
   the closing section until you reach it, so it plays when that section has moved off it, and resets above */
(() => { const h = document.querySelector('.b30f__h'), cover = document.getElementById('contact'); if (!h || !window.B30 || !B30.setIn) return;
  let raf = 0; const check = () => { raf = 0; const r = h.getBoundingClientRect(), c = cover ? cover.getBoundingClientRect().bottom : -1;
    const shown = r.top < innerHeight * .92 && c < r.top + r.height * .4;
    if (shown && !h.classList.contains('is-in')) B30.setIn(h, true); else if (!shown && r.top > innerHeight && h.classList.contains('is-in')) B30.setIn(h, false); };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(check); }, { passive: true }); addEventListener('resize', check); check();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) B30.setIn(h, true); })();

/* =====================================================================
   Phones (≤ 899px): the footer rising in — one version for every page (from the Our Work
   mobile design). Its styles: the phone section at the end of this component's stylesheet. Nothing here runs on desktop.
   ===================================================================== */
(() => {
  const MQ = matchMedia('(max-width: 899px)'), RED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  let built = false;
  const boot = () => { if (built || !MQ.matches) return; built = true; footerReveals(); };
  if (document.readyState === 'complete') boot(); else addEventListener('load', boot);
  MQ.addEventListener && MQ.addEventListener('change', boot);

  /* ---------- the footer's columns, button and bar rise in as they arrive ---------- */
  function footerReveals() {
    if (RED || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' });
    document.querySelectorAll('.b30f__col, .b30f__cta, .b30f__bar').forEach((el, i) => {
      if (el.classList.contains('m-rv') || el.closest('[data-reveal]')) return;
      el.classList.add('m-rv'); el.style.transitionDelay = (el.matches('.b30f__col') ? (i % 2) * 80 : 0) + 'ms'; io.observe(el); });
  }
})();
