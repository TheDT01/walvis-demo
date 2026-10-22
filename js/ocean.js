/* =========================================================
   WALVIS CONCIERGE · js/ocean.js  (WebGL)
   The deep: a dark plum sea, light falling from above, and one
   vast translucent teal whale gliding diagonally overhead, from
   bottom-right to top-left. It is too big to fit on screen at
   once; the moment it leaves, it glides in again.

   Everything is drawn on the graphics card (WebGL), so the
   computer's processor stays almost idle:
   - the whale's body parts are painted once into textures,
     then only moved each frame;
   - the light on the water and the god rays are computed per
     pixel by the graphics card;
   - fish, motes and ripples are a single batch.
   It watches its own frame rate and, only on a machine that is
   struggling, gently lowers its drawing resolution (and as a last
   resort turns off the glass blur over the moving sea).
   Without WebGL it falls back to js/ocean-2d.js.

   Every <canvas class="sea" data-mode="hero|lite|faint">
   gets its own ocean. Settings for each mode are in MODES.
   Only "hero" (the home page) has the whale.
   ========================================================= */
(function () {
  // Visitors whose computer asks for reduced motion (Windows "Animation effects" off, "Adjust for best
  // performance", macOS "Reduce motion") still see the whale move, but slower and without following the
  // mouse or scroll. Everyone can pause it with the button on the scene (window.WalvisSea.paused).
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reduce = false;
  var SEA = window.WalvisSea = window.WalvisSea || { paused: false, engine: '', renderer: '', tier: 0, calm: calm };
  var RAD = Math.PI / 180;
  var small = innerWidth < 820;

  /* ---------- Settings ---------- */
  var MODES = {
    hero: {
      // len: whale length in screen heights (over 1 = never fits on screen)
      // speed: pixels per second · angle: direction of travel (-135 = up and to the left)
      // opacity: how see-through the whale is (0 = invisible, 1 = solid)
      whale: { len: small ? 1.1 : 1.9, speed: small ? 34 : 52, angle: small ? -112 : -128, opacity: .55 },
      fish: small ? 55 : 95, motes: small ? 45 : 80, glowMotes: small ? 6 : 12,
      light: [.5, .2], alpha: 1, rays: true, ripple: true, scroll: true
    },
    lite: {
      whale: null,
      fish: small ? 30 : 55, motes: small ? 30 : 50, glowMotes: 5,
      light: [.3, .12], alpha: .9, rays: true, ripple: true, scroll: false
    },
    fish: {
      whale: null,
      fish: small ? 90 : 160, motes: 0, glowMotes: 0,
      light: [.5, .5], alpha: .9, rays: false, ripple: false, scroll: false, spread: true
    },
    // Intro-only mode: a small school of understated fish, without water lines, rays or particles.
    'fish-lite': {
      whale: null,
      fish: small ? 8 : 14, motes: 0, glowMotes: 0,
      light: [.5, .5], alpha: .58, rays: false, ripple: false, scroll: false, spread: true
    },
    faint: {
      whale: null,
      fish: 0, motes: 26, glowMotes: 3, light: [.5, .1], alpha: .3, rays: false, ripple: false, scroll: false
    }
  };
  // colours of the deep: plum water, teal light
  var C = {
    fish: [[70, 30, 74], [48, 16, 50], [30, 7, 30]],
    mote: [170, 240, 235], ray: [195, 248, 240], sun: [215, 255, 250], caustic: '205, 255, 248', ring: [205, 250, 245]
  };
  function rgb(c) { return [c[0] / 255, c[1] / 255, c[2] / 255]; }

  // drawing resolution steps, used only if a machine struggles (1 = full quality)
  var TIERS = [1, .8, .66, .5];

  /* ---------- WebGL available? Otherwise use the 2D version ---------- */
  var fellBack = false;
  function fallback() { if (fellBack) return; fellBack = true; var s = document.createElement('script'); s.src = 'js/ocean-2d.js' + (window.ASSET_V || ''); document.body.appendChild(s); }
  // WebGL only pays off with real graphics acceleration. Without it (old or blocked drivers), browsers
  // emulate WebGL in software, which is slower than the 2D version, so those machines get 2D.
  var GL_OPTS = { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, failIfMajorPerformanceCaveat: true };
  var probeGL = null;
  try { var probe = document.createElement('canvas'); probeGL = probe.getContext('webgl', GL_OPTS); } catch (e) {}
  if (probeGL) {
    var dbg = probeGL.getExtension('WEBGL_debug_renderer_info');
    var renderer = dbg ? String(probeGL.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
    SEA.renderer = renderer;
    if (/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer)) { SEA.whyNot = 'no hardware acceleration (' + renderer + ')'; probeGL = null; }
  }
  if (!probeGL) { SEA.whyNot = SEA.whyNot || 'WebGL unavailable or would be slow on this machine'; fallback(); return; }
  var lose = probeGL.getExtension('WEBGL_lose_context'); if (lose) lose.loseContext();

  /* ---------- Whale shape, seen from below, head up ----------
     Drawn in a 200 x 600 box (fins and flukes reach outside it).
     A tapered snout widening to the flippers, then a long taper to the tail. */
  var BODY = new Path2D('M100,6 C116,6 130,20 137,44 C146,72 154,104 160,140 C166,180 170,220 170,262 C170,320 156,390 136,440 C124,470 112,492 106,505 L94,505 C88,492 76,470 64,440 C44,390 30,320 30,262 C30,220 34,180 40,140 C46,104 54,72 63,44 C70,20 84,6 100,6 Z');
  var FIN_R = new Path2D('M160,198 C194,228 230,280 252,345 C258,362 252,374 241,365 C219,332 191,294 163,272 Z');
  var FIN_L = new Path2D('M40,198 C6,228 -30,280 -52,345 C-58,362 -52,374 -41,365 C-19,332 9,294 37,272 Z');
  var FLUKE = new Path2D('M92,486 C90,516 62,536 2,556 C-8,560 -6,572 6,574 C42,578 84,580 100,566 C116,580 158,578 194,574 C206,572 208,560 198,556 C138,536 110,516 108,486 Z');
  // the long throat pleats, running from the chin back along the belly
  var PLEATS = new Path2D('M97,26 C86,100 66,180 58,268 M98,24 C92,100 80,180 74,280 M100,22 L100,292 M102,24 C108,100 120,180 126,280 M103,26 C114,100 134,180 142,268 M95,30 C80,96 58,170 48,240 M105,30 C120,96 142,170 152,240');
  var PARTS = {
    finR:  { path: FIN_R, box: [150, 188, 264, 382], pivot: [164, 210] },
    finL:  { path: FIN_L, box: [-64, 188, 50, 382],  pivot: [36, 210] },
    fluke: { path: FLUKE, box: [-14, 478, 214, 586], pivot: [100, 488], rim: [-40, 504, 240, 600] },
    rear:  { path: BODY,  box: [24, 282, 176, 514],  clip: [0, 286, 200, 520], pivot: [100, 296], rim: [0, 0, 200, 500] },
    front: { path: BODY,  box: [24, 0, 176, 308],    clip: [0, 0, 200, 306], pleats: true }
  };
  var PART_ORDER = ['finR', 'finL', 'fluke', 'rear', 'front'];
  var CENTER = [100, 292];
  // points around the whale's silhouette, for knowing exactly when it is in view
  var OUTLINE = [[100,6],[137,44],[160,140],[170,262],[160,350],[136,440],[106,505],[2,556],[6,574],[100,566],[194,574],[198,556],[94,505],[64,440],[40,350],[30,262],[40,140],[63,44],[252,345],[241,365],[230,300],[-52,345],[-41,365],[-30,300]];

  function mix(a, b, t) { return a + (b - a) * t; }

  /* each whale part is painted once (2D canvas), then uploaded as a texture */
  function partCanvas(part, k, dpr) {
    var b = part.box, w = (b[2] - b[0]) * k, h = (b[3] - b[1]) * k;
    var c = document.createElement('canvas');
    c.width = Math.max(2, Math.ceil(w * dpr)); c.height = Math.max(2, Math.ceil(h * dpr));
    var g = c.getContext('2d');
    g.scale(c.width / (b[2] - b[0]), c.height / (b[3] - b[1])); g.translate(-b[0], -b[1]);
    if (part.clip) { g.beginPath(); g.rect(part.clip[0], part.clip[1], part.clip[2] - part.clip[0], part.clip[3] - part.clip[1]); g.clip(); }
    // light catching the outline
    g.lineJoin = 'round'; g.lineWidth = 5 / Math.max(.6, k * 1.2);
    g.strokeStyle = 'rgba(215, 255, 250, .7)';
    if (part.rim) { g.save(); g.beginPath(); g.rect(part.rim[0], part.rim[1], part.rim[2] - part.rim[0], part.rim[3] - part.rim[1]); g.clip(); g.stroke(part.path); g.restore(); }
    else g.stroke(part.path);
    // teal body, brighter at the head where the light falls, deeper towards the tail
    var grad = g.createLinearGradient(0, 4, 0, 580);
    grad.addColorStop(0, '#46beb6'); grad.addColorStop(.3, '#1d948f'); grad.addColorStop(.7, '#0f6a6c'); grad.addColorStop(1, '#0a4a50');
    g.fillStyle = grad; g.fill(part.path);
    g.globalCompositeOperation = 'source-atop';
    // a deeper teal along the edges, so the body reads as rounded
    var edge = g.createLinearGradient(20, 0, 180, 0);
    edge.addColorStop(0, 'rgba(6, 40, 46, .45)'); edge.addColorStop(.3, 'rgba(6, 40, 46, 0)'); edge.addColorStop(.7, 'rgba(6, 40, 46, 0)'); edge.addColorStop(1, 'rgba(6, 40, 46, .45)');
    g.fillStyle = edge; g.fillRect(-80, -20, 360, 640);
    var hl = g.createRadialGradient(100, 60, 10, 100, 180, 300);
    hl.addColorStop(0, 'rgba(220, 255, 250, .35)'); hl.addColorStop(1, 'rgba(220, 255, 250, 0)');
    g.fillStyle = hl; g.fillRect(-80, -20, 360, 640);
    if (part.pleats) { g.strokeStyle = 'rgba(225, 255, 250, .16)'; g.lineWidth = .9; g.stroke(PLEATS); }
    return c;
  }

  /* a seamless caustic texture: the soft, cellular net of light you see under water */
  function causticTile(size, rgbs) {
    var c = document.createElement('canvas'); c.width = c.height = size;
    var g = c.getContext('2d'), img = g.createImageData(size, size), d = img.data, parts = rgbs.split(',').map(Number);
    var pts = [], n = 14, seed = 7;
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    for (var i = 0; i < n; i++) pts.push([rnd() * size, rnd() * size]);
    for (var y = 0; y < size; y++) for (var x = 0; x < size; x++) {
      var f1 = 1e9, f2 = 1e9;
      for (var j = 0; j < n; j++) {
        var dx = Math.abs(x - pts[j][0]), dy = Math.abs(y - pts[j][1]);
        if (dx > size / 2) dx = size - dx; if (dy > size / 2) dy = size - dy;   // wrap, so the tile repeats seamlessly
        var dd = dx * dx + dy * dy;
        if (dd < f1) { f2 = f1; f1 = dd; } else if (dd < f2) f2 = dd;
      }
      var e = Math.sqrt(f2) - Math.sqrt(f1);
      var val = Math.pow(Math.max(0, 1 - e / 9), 2.4);
      var k = (y * size + x) * 4; d[k] = parts[0]; d[k + 1] = parts[1]; d[k + 2] = parts[2]; d[k + 3] = Math.round(val * 200);
    }
    g.putImageData(img, 0, 0);
    // soften: shrink and grow back
    var s2 = document.createElement('canvas'); s2.width = s2.height = size / 4;
    var g2 = s2.getContext('2d'); g2.imageSmoothingQuality = 'high'; g2.drawImage(c, 0, 0, size / 4, size / 4);
    var out = document.createElement('canvas'); out.width = out.height = size;
    var go = out.getContext('2d'); go.imageSmoothingQuality = 'high'; go.drawImage(s2, 0, 0, size, size);
    go.globalAlpha = .55; go.drawImage(c, 0, 0);
    return out;
  }

  /* one small texture with four little white shapes, tinted when drawn: fish, glow, bubble, ripple ring */
  function atlasCanvas() {
    var c = document.createElement('canvas'); c.width = 256; c.height = 64;
    var g = c.getContext('2d');
    g.save(); g.translate(36, 32); g.fillStyle = '#fff';
    var len = 20; g.beginPath(); g.ellipse(0, 0, len, len * .3, 0, 0, 6.283); g.fill();
    g.beginPath(); g.moveTo(-len * .8, 0); g.lineTo(-len * 1.5, -len * .42); g.lineTo(-len * 1.3, 0); g.lineTo(-len * 1.5, len * .42); g.closePath(); g.fill();
    g.restore();
    var gr = g.createRadialGradient(96, 32, 0, 96, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.25, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(64, 0, 64, 64);
    g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 4.5; g.beginPath(); g.arc(160, 32, 25, 0, 6.283); g.stroke();
    g.fillStyle = 'rgba(255,255,255,.65)'; g.beginPath(); g.arc(154, 26, 6, 0, 6.283); g.fill();
    g.strokeStyle = '#fff'; g.lineWidth = 2.2; g.beginPath(); g.arc(224, 32, 29, 0, 6.283); g.stroke();
    return c;
  }
  var CELL = { fish: 0, glow: 1, bubble: 2, ring: 3 };

  /* ---------- shaders ---------- */
  var VS_SPRITE =
    'attribute vec2 a_pos; attribute vec2 a_uv; attribute vec4 a_col;' +
    'uniform vec2 u_res; varying vec2 v_uv; varying vec4 v_col;' +
    'void main(){ vec2 c = a_pos / u_res * 2.0 - 1.0; gl_Position = vec4(c.x, -c.y, 0.0, 1.0); v_uv = a_uv; v_col = a_col; }';
  var FS_SPRITE =
    'precision mediump float; uniform sampler2D u_tex; varying vec2 v_uv; varying vec4 v_col;' +
    'void main(){ gl_FragColor = texture2D(u_tex, v_uv) * v_col; }';
  var VS_FULL =
    'attribute vec2 a_pos; uniform vec2 u_res; varying vec2 v_px; varying vec2 v_uv;' +
    'void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); v_uv = a_pos * .5 + .5; v_px = vec2(v_uv.x, 1.0 - v_uv.y) * u_res; }';
  // the whale layer, laid over the water as see-through glass
  var FS_COMPOSITE =
    'precision mediump float; uniform sampler2D u_tex; uniform float u_opacity; varying vec2 v_uv;' +
    'void main(){ gl_FragColor = texture2D(u_tex, v_uv) * u_opacity; }';
  // light on the water: two drifting caustic sheets, nine god rays and the glow of the surface
  var FS_LIGHT =
    '#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n' +
    'uniform vec2 u_size; uniform float u_time; uniform vec2 u_sun; uniform float u_sunR; uniform vec2 u_rayO; uniform float u_rayL;' +
    'uniform vec4 u_ray[9]; uniform sampler2D u_tile; uniform vec3 u_cCol; uniform vec3 u_rCol; uniform vec3 u_sCol; uniform float u_alpha;' +
    'varying vec2 v_px;' +
    'void main(){' +
    '  vec2 p = v_px;' +
    '  vec2 q1 = (p - u_time * vec2(14.0, 9.0)) / 921.6;' +
    '  float cs = cos(-0.4887), sn = sin(-0.4887);' +
    '  vec2 d2 = p - u_time * vec2(-11.0, 6.0); vec2 q2 = vec2(cs * d2.x - sn * d2.y, sn * d2.x + cs * d2.y) / 665.6;' +
    '  float c = texture2D(u_tile, q1).a * .17 + texture2D(u_tile, q2).a * .10;' +
    '  float y = p.y / u_size.y; float fade = y < .5 ? mix(1.0, .5, y * 2.0) : mix(.5, .08, (y - .5) * 2.0);' +
    '  vec3 light = u_cCol * c * fade;' +
    '  vec2 s = (p - u_sun) / vec2(u_sunR, u_sunR * .55); float sd = length(s);' +
    '  float sunA = sd < .25 ? mix(1.0, .55, sd / .25) : max(0.0, mix(.55, 0.0, (sd - .25) / .75));' +
    '  light += u_sCol * sunA * .2;' +
    '  vec2 d = p - u_rayO; float r = 0.0;' +
    '  for (int i = 0; i < 9; i++) {' +
    '    vec4 R = u_ray[i]; vec2 dir = vec2(-sin(R.x), cos(R.x)); vec2 per = vec2(cos(R.x), sin(R.x));' +
    '    float along = dot(d, dir) / u_rayL; float across = abs(dot(d, per)) / R.y;' +
    '    float v = along < .45 ? mix(1.0, .35, along / .45) : max(0.0, mix(.35, 0.0, (along - .45) / .55));' +
    '    r += max(0.0, 1.0 - across) * v * step(0.0, along) * R.z;' +
    '  }' +
    '  light += u_rCol * r;' +
    '  gl_FragColor = vec4(light * u_alpha, 0.0);' +
    '}';

  function compile(gl, type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  function program(gl, vs, fs) {
    var p = gl.createProgram();
    gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs)); gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    var info = { p: p, a: {}, u: {} };
    for (var i = 0, n = gl.getProgramParameter(p, gl.ACTIVE_ATTRIBUTES); i < n; i++) { var a = gl.getActiveAttrib(p, i); info.a[a.name] = gl.getAttribLocation(p, a.name); }
    for (var j = 0, m = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); j < m; j++) { var u = gl.getActiveUniform(p, j); info.u[u.name.replace(/\[0\]$/, '')] = gl.getUniformLocation(p, u.name); }
    return info;
  }
  function texture(gl, src, repeat) {
    var t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    var wrap = repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
    return t;
  }

  var TILE = causticTile(256, C.caustic), ATLAS = atlasCanvas();

  /* ---------- One ocean ---------- */
  function Ocean(canvas) {
    var mode = MODES[canvas.getAttribute('data-mode')] || MODES.hero;
    var host = canvas.closest('section') || canvas.parentElement;
    var gl = canvas.getContext('webgl', GL_OPTS);
    if (!gl) return;
    var baseDpr = Math.min(devicePixelRatio || 1, small ? 1.5 : 1.75), tier = 0;
    var W = 0, H = 0, PW = 0, PH = 0, whale = null, fish = [], motes = [], glows = [], ripples = [];
    var visible = true, mx = 0, my = 0, cmx = 0, cmy = 0, last = 0, time = 0;
    var rays = [];
    for (var ri = 0; ri < 9; ri++) rays.push({ a: (-34 + ri * 8.5 + Math.random() * 4) * RAD, w: .04 + Math.random() * .08, o: .05 + Math.random() * .08,
      sp: .05 + Math.random() * .06, sw: (1.5 + Math.random() * 2.5) * RAD, p: Math.random() * 6.283 });

    var P, buf, quadBuf, tex = {}, fbo = null, fboTex = null, partTex = {}, verts = new Float32Array(1600 * 6 * 8), nv = 0;
    var rayU = new Float32Array(36);

    function setupGL() {
      P = { sprite: program(gl, VS_SPRITE, FS_SPRITE), comp: program(gl, VS_FULL, FS_COMPOSITE), light: program(gl, VS_FULL, FS_LIGHT) };
      buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, verts.byteLength, gl.DYNAMIC_DRAW);
      quadBuf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      tex.atlas = texture(gl, ATLAS, false); tex.tile = texture(gl, TILE, true);
      gl.disable(gl.DEPTH_TEST); gl.enable(gl.BLEND);
      partTex = {}; fbo = null; fboTex = null;
    }

    /* the whale's line across the screen: a slightly different line on each pass */
    function newPass() {
      var cfg = mode.whale;
      whale.ang = (cfg.angle + (Math.random() - .5) * 8) * RAD;
      whale.cx = W * (.42 + Math.random() * .16); whale.cy = H * (.42 + Math.random() * .14);
      whale.jit = .95 + Math.random() * .08;
      var L = whale.L * whale.jit, dx = Math.cos(whale.ang), dy = Math.sin(whale.ang);
      // find exactly when the first point of the outline comes into view and the last one leaves,
      // so the next pass begins the moment the tail is gone
      var k = L / 560 * 1.03, rot = whale.ang + Math.PI / 2, c = Math.cos(rot), sn = Math.sin(rot), s0 = Infinity, s1 = -Infinity;
      for (var i = 0; i < OUTLINE.length; i++) {
        var lx = (OUTLINE[i][0] - CENTER[0]) * k, ly = (OUTLINE[i][1] - CENTER[1]) * k;
        var ox = whale.cx + lx * c - ly * sn, oy = whale.cy + lx * sn + ly * c;
        // the stretch of the path during which this point is on screen
        var ax = (0 - ox) / dx, bx = (W - ox) / dx, ay = (0 - oy) / dy, by = (H - oy) / dy;
        var lo = Math.max(Math.min(ax, bx), Math.min(ay, by)), hi = Math.min(Math.max(ax, bx), Math.max(ay, by));
        if (lo < hi) { if (lo < s0) s0 = lo; if (hi > s1) s1 = hi; }
      }
      whale.s0 = s0 - 4; whale.s1 = s1 + 4;
      whale.s = whale.s0;
    }

    function size() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      if (!W || !H) return false;
      var scale = TIERS[tier];
      PW = Math.max(1, Math.round(W * baseDpr * scale)); PH = Math.max(1, Math.round(H * baseDpr * scale));
      canvas.width = PW; canvas.height = PH;
      if (mode.whale) {
        if (!fboTex) { fboTex = gl.createTexture(); fbo = gl.createFramebuffer(); }
        gl.bindTexture(gl.TEXTURE_2D, fboTex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, PW, PH, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fboTex, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        // paint the whale's parts once, at the resolution they will be shown
        var L = H * mode.whale.len, k = L / 560, maxT = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        var res = Math.min(baseDpr * scale, maxT / ((PARTS.front.box[3] - PARTS.front.box[1]) * k * 1.01));
        PART_ORDER.forEach(function (key) {
          if (partTex[key]) gl.deleteTexture(partTex[key]);
          partTex[key] = texture(gl, partCanvas(PARTS[key], k, res), false);
        });
        var prog = whale ? (whale.s - whale.s0) / (whale.s1 - whale.s0) : .32;   // start partway across, already in view
        whale = { L: L, ph: whale ? whale.ph : Math.random() * 6.283 };
        newPass();
        whale.s = mix(whale.s0, whale.s1, prog);
      }
      return true;
    }

    function populate() {
      fish = [];
      var R = mode.spread ? H : Math.min(W, H);
      for (var f = 0; f < mode.fish; f++) {
        var d = Math.random();
        var radius = mode.spread ? H * (.025 + Math.pow(Math.random(), 1.65) * .62) : R * (.1 + Math.random() * .34);
        fish.push({ a: Math.random() * 6.283, w: (.07 + Math.random() * .09) * (Math.random() < .88 ? 1 : -1), r: radius,
          p: Math.random() * 6.283, d: d, s: .3 + d * .55, x: null, y: null, h: 0 });
      }
      motes = [];
      for (var m = 0; m < mode.motes; m++) motes.push({ x: Math.random() * W, y: Math.random() * H, r: .6 + Math.random() * 1.8, v: 2 + Math.random() * 7, p: Math.random() * 6.283, a: .15 + Math.random() * .45 });
      glows = [];
      for (var gq = 0; gq < mode.glowMotes; gq++) glows.push({ x: Math.random() * W, y: Math.random() * H, r: 10 + Math.random() * 26, v: 3 + Math.random() * 6, p: Math.random() * 6.283, a: .05 + Math.random() * .1 });
    }

    /* ---------- batching quads ---------- */
    var QX = [-1, 1, 1, -1], QY = [-1, -1, 1, 1], QU = [0, 1, 1, 0], QV = [0, 0, 1, 1], QI = [0, 1, 2, 0, 2, 3];
    function quad(cx, cy, hw, hh, ang, cell, col, a) {
      if (a <= 0 || nv + 6 > verts.length / 8) return;
      var c = Math.cos(ang), s = Math.sin(ang), u0 = cell * .25;
      var pr = col[0] * a, pg = col[1] * a, pb = col[2] * a;
      for (var i = 0; i < 6; i++) {
        var j = QI[i], o = (nv + i) * 8, x = QX[j] * hw, y = QY[j] * hh;
        verts[o] = cx + x * c - y * s; verts[o + 1] = cy + x * s + y * c;
        verts[o + 2] = u0 + QU[j] * .25; verts[o + 3] = QV[j];
        verts[o + 4] = pr; verts[o + 5] = pg; verts[o + 6] = pb; verts[o + 7] = a;
      }
      nv += 6;
    }
    // a whale part: its box carried through the part's own transform
    function partQuad(m, box) {
      var xs = [box[0], box[2], box[2], box[0]], ys = [box[1], box[1], box[3], box[3]];
      for (var i = 0; i < 6; i++) {
        var j = QI[i], o = (nv + i) * 8;
        verts[o] = m[0] * xs[j] + m[2] * ys[j] + m[4]; verts[o + 1] = m[1] * xs[j] + m[3] * ys[j] + m[5];
        verts[o + 2] = QU[j]; verts[o + 3] = QV[j];
        verts[o + 4] = 1; verts[o + 5] = 1; verts[o + 6] = 1; verts[o + 7] = 1;
      }
      nv += 6;
    }
    function flush(t) {
      if (!nv) return;
      var S = P.sprite;
      gl.useProgram(S.p);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferSubData(gl.ARRAY_BUFFER, 0, verts.subarray(0, nv * 8));
      gl.enableVertexAttribArray(S.a.a_pos); gl.vertexAttribPointer(S.a.a_pos, 2, gl.FLOAT, false, 32, 0);
      gl.enableVertexAttribArray(S.a.a_uv); gl.vertexAttribPointer(S.a.a_uv, 2, gl.FLOAT, false, 32, 8);
      gl.enableVertexAttribArray(S.a.a_col); gl.vertexAttribPointer(S.a.a_col, 4, gl.FLOAT, false, 32, 16);
      gl.uniform2f(S.u.u_res, W, H);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, t); gl.uniform1i(S.u.u_tex, 0);
      gl.drawArrays(gl.TRIANGLES, 0, nv);
      gl.disableVertexAttribArray(S.a.a_uv); gl.disableVertexAttribArray(S.a.a_col);
      nv = 0;
    }
    function fullscreen(prog) {
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
      gl.enableVertexAttribArray(prog.a.a_pos); gl.vertexAttribPointer(prog.a.a_pos, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    /* 2D affine helpers, like canvas transforms: [a, b, c, d, e, f] */
    function mul(m, n) { return [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]]; }
    function T(x, y) { return [1, 0, 0, 1, x, y]; }
    function Rt(a) { var c = Math.cos(a), s = Math.sin(a); return [c, s, -s, c, 0, 0]; }
    function Sc(x, y) { return [x, 0, 0, y, 0, 0]; }
    function about(m, pv, rot, sy) { var r = mul(mul(m, T(pv[0], pv[1])), Rt(rot)); if (sy) r = mul(r, Sc(1, sy)); return mul(r, T(-pv[0], -pv[1])); }

    function drawWhale(ox, oy) {
      var w = whale, dx = Math.cos(w.ang), dy = Math.sin(w.ang);
      var x = w.cx + dx * w.s + ox, y = w.cy + dy * w.s + oy;
      var t = time + w.ph * 3;
      var rot = w.ang + Math.PI / 2 + Math.sin(time * .1 + w.ph) * .025;
      var k = (w.L * w.jit) / 560;
      var breathe = 1 + Math.sin(t * .5) * .012;                       // a slow breath, barely there
      var base = mul(mul(mul(T(x, y), Rt(rot)), Sc(k * breathe, k)), T(-CENTER[0], -CENTER[1]));
      var wave = Math.sin(t * .55);                                     // a very small wave through the body
      var rearM = about(base, [100, 296], wave * 2.4 * RAD);
      var mats = {
        finR: about(base, PARTS.finR.pivot, Math.sin(t * .4) * 5 * RAD),
        finL: about(base, PARTS.finL.pivot, -Math.sin(t * .4) * 5 * RAD),
        fluke: about(rearM, PARTS.fluke.pivot, Math.sin(t * .55 - .9) * 6 * RAD, .86 + .14 * Math.sin(t * .55 - .4)),
        rear: rearM,
        front: about(base, [100, 296], -wave * .9 * RAD)
      };
      // paint the parts solid into the whale layer (so no seams where they overlap), then lay it over the water, see-through
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo); gl.viewport(0, 0, PW, PH);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      PART_ORDER.forEach(function (key) { partQuad(mats[key], PARTS[key].box); flush(partTex[key]); });
      gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, PW, PH);
      gl.useProgram(P.comp.p);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, fboTex); gl.uniform1i(P.comp.u.u_tex, 0);
      gl.uniform1f(P.comp.u.u_opacity, mode.whale.opacity); gl.uniform2f(P.comp.u.u_res, W, H);
      fullscreen(P.comp);
    }

    /* ---------- watching our own smoothness ---------- */
    var samples = [], calmGlass = false, warm = 0;
    function adapt(dt) {
      warm += dt; if (warm < 2) return;                       // let the page settle first
      samples.push(dt);
      if (samples.length < 90) return;
      var s = samples.slice().sort(function (a, b) { return a - b; }), med = s[s.length >> 1];
      samples.length = 0;
      if (med > .024) {                                       // slower than ~42 fps: step down one notch
        if (tier === 1 && !calmGlass && mode === MODES.hero) { calmGlass = true; SEA.calmGlass = true; document.documentElement.classList.add('calm-glass'); }
        else if (tier < TIERS.length - 1) { tier++; size(); SEA.tier = tier; }
      } else if (med < .0135 && tier > 0) {                   // comfortably fast again: step back up
        tier--; size(); SEA.tier = tier;
      }
    }

    function frame(now) {
      if (!reduce) requestAnimationFrame(frame);
      var dt = last ? Math.min(.05, (now - last) / 1000) : .016; last = now;
      if (SEA.paused && drawn) return;                     // paused: keep the last picture
      if (calm) dt *= .6;                                   // reduced motion: everything drifts slower
      if (!visible || document.hidden || !W || gl.isContextLost()) return;
      time += dt;
      if (!reduce) adapt(dt);
      cmx += (mx - cmx) * .03; cmy += (my - cmy) * .03;
      var sy = mode.scroll && !calm ? Math.min(scrollY, H) : 0;
      var lx = W * mode.light[0], ly = H * mode.light[1];
      if (whale && !reduce) { whale.s += mode.whale.speed * dt; if (whale.s >= whale.s1) newPass(); }

      gl.viewport(0, 0, PW, PH);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      // far motes and the school of fish around the light beam (seen through the whale)
      var mc = rgb(C.mote);
      for (var i = 0; i < motes.length; i++) {
        var p = motes[i]; p.y -= p.v * dt; p.p += dt * .5;
        if (p.y < -6) { p.y = H + 6; p.x = Math.random() * W; }
        quad(p.x + Math.sin(p.p) * 8, p.y, p.r * 2, p.r * 2, 0, CELL.glow, mc, mode.alpha * p.a * (.6 + .4 * Math.sin(p.p * 2)));
      }
      for (var f = 0; f < fish.length; f++) {
        var fi = fish[f]; fi.a += fi.w * dt; fi.p += dt * .35;
        var rad = fi.r * (1 + .08 * Math.sin(fi.p));
        var fx = lx + Math.cos(fi.a) * rad * (mode.spread ? W / H : 1) + cmx * 14 * fi.d;
        var fy = ly + Math.sin(fi.a) * rad * .42 + Math.sin(fi.p * 1.3) * rad * .1 + rad * .18 - sy * .1;
        if (fi.x !== null) { var target = Math.atan2(fy - fi.y, fx - fi.x); fi.h += Math.atan2(Math.sin(target - fi.h), Math.cos(target - fi.h)) * .1; }
        fi.x = fx; fi.y = fy;
        var half = 19.2 * fi.s;                                 // same size as before
        quad(fx, fy, half, half, fi.h, CELL.fish, rgb(C.fish[fi.d < .33 ? 0 : fi.d < .66 ? 1 : 2]), mode.alpha * (.4 + fi.d * .45));
      }
      flush(tex.atlas);

      // the whale, see-through
      if (whale) drawWhale(cmx * 26, cmy * 16 - sy * .28);

      // light on the water, over everything behind: caustics, god rays, the glow of the surface
      if (mode.rays) {
        var L = P.light, rl = Math.hypot(W, H) * 1.05;
        for (var r = 0; r < 9; r++) {
          var ry = rays[r];
          rayU[r * 4] = ry.a + Math.sin(time * ry.sp + ry.p) * ry.sw;
          rayU[r * 4 + 1] = Math.max(W, H) * ry.w / 2;
          rayU[r * 4 + 2] = ry.o * (.7 + .3 * Math.sin(time * ry.sp * 1.7 + ry.p));
          rayU[r * 4 + 3] = 0;
        }
        gl.blendFunc(gl.ONE, gl.ONE);
        gl.useProgram(L.p);
        gl.uniform2f(L.u.u_res, W, H); gl.uniform2f(L.u.u_size, W, H); gl.uniform1f(L.u.u_time, time);
        gl.uniform2f(L.u.u_sun, lx, ly - H * .2); gl.uniform1f(L.u.u_sunR, Math.max(W, H) * .42 * (1 + .04 * Math.sin(time * .25)));
        gl.uniform2f(L.u.u_rayO, lx, ly - H * .25); gl.uniform1f(L.u.u_rayL, rl);
        gl.uniform4fv(L.u.u_ray, rayU);
        gl.uniform3f(L.u.u_cCol, 205 / 255, 1, 248 / 255);
        var rc = rgb(C.ray), sc = rgb(C.sun);
        gl.uniform3f(L.u.u_rCol, rc[0], rc[1], rc[2]); gl.uniform3f(L.u.u_sCol, sc[0], sc[1], sc[2]);
        gl.uniform1f(L.u.u_alpha, mode.alpha * .95);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex.tile); gl.uniform1i(L.u.u_tile, 0);
        fullscreen(L);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      }

      // in front: out-of-focus motes and ripples
      for (var gq = 0; gq < glows.length; gq++) {
        var gm = glows[gq]; gm.y -= gm.v * dt; gm.p += dt * .3;
        if (gm.y < -gm.r * 2) { gm.y = H + gm.r * 2; gm.x = Math.random() * W; }
        quad(gm.x + Math.sin(gm.p) * 14 + cmx * 40, gm.y, gm.r * 2, gm.r * 2, 0, CELL.glow, mc, mode.alpha * gm.a * (.7 + .3 * Math.sin(gm.p * 2)));
      }
      var rcol = rgb(C.ring);
      for (var rr = ripples.length - 1; rr >= 0; rr--) {
        var rp = ripples[rr], age = time - rp.t;
        if (age > 3) { ripples.splice(rr, 1); continue; }
        for (var ring = 0; ring < 3; ring++) {
          var ra = age - ring * .35; if (ra <= 0) continue;
          var rad2 = ra * 70 * (32 / 29);
          quad(rp.x, rp.y, rad2, rad2 * .55, 0, CELL.ring, rcol, Math.max(0, .45 * (1 - ra / 2.6)));
        }
      }
      flush(tex.atlas);
    }

    var drawn = false;
    (function markDrawn() { requestAnimationFrame(function () { if (W) drawn = true; else markDrawn(); }); })();

    /* interaction */
    if (!calm) host.addEventListener('mousemove', function (e) { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
    if (mode.ripple) host.addEventListener('click', function (e) {
      if (e.target.closest('a, button')) return;
      var rc = canvas.getBoundingClientRect(), x = e.clientX - rc.left, y = e.clientY - rc.top;
      ripples.push({ x: x, y: y, t: time });
    });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(canvas);
    var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { if (size()) { populate(); if (reduce) still(); } }, 150); });
    canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); });
    canvas.addEventListener('webglcontextrestored', function () { setupGL(); size(); });

    // reduced motion: one calm, still frame with the whale in view
    function still() { time = 30; last = 0; visible = true; if (whale) whale.s = mix(whale.s0, whale.s1, .45); frame(performance.now()); }

    try { setupGL(); } catch (err) {
      if (window.console) console.warn('Walvis ocean: WebGL shaders refused, using 2D', err);
      SEA.whyNot = 'graphics driver refused the shaders: ' + (err && err.message);
      // this canvas is now tied to WebGL, so hand the 2D version a fresh one
      var fresh = canvas.cloneNode(false); canvas.parentNode.replaceChild(fresh, canvas);
      fallback(); return;
    }
    size(); populate();
    if (reduce) still(); else requestAnimationFrame(frame);
  }

  SEA.engine = 'WebGL';
  document.querySelectorAll('canvas.sea').forEach(function (c) { Ocean(c); });
})();
