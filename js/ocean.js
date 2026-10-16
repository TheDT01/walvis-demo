/* =========================================================
   WALVIS CONCIERGE · js/ocean.js
   The deep: a dark plum sea, light falling from above, and one
   vast translucent teal whale gliding diagonally overhead, from
   bottom-right to top-left. It is too big to fit on screen at
   once; the moment it leaves, it glides in again.

   Every <canvas class="sea" data-mode="hero|lite|faint">
   gets its own ocean. Settings for each mode are in MODES.
   Only "hero" (the home page) has the whale; the others keep
   the water, light, fish and particles.
   ========================================================= */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    faint: {
      whale: null,
      fish: 0, motes: 26, glowMotes: 3, light: [.5, .1], alpha: .3, rays: false, ripple: false, scroll: false
    }
  };
  // colours of the deep: plum water, teal light
  var C = {
    fish: ['70, 30, 74', '48, 16, 50', '30, 7, 30'],
    mote: '170, 240, 235', ray: '195, 248, 240', sun: '215, 255, 250', caustic: '205, 255, 248'
  };

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
  var CENTER = [100, 292];

  function mix(a, b, t) { return a + (b - a) * t; }

  /* each whale part is drawn once into a sprite, then only moved each frame */
  function sprite(part, k, dpr) {
    var b = part.box, w = (b[2] - b[0]) * k, h = (b[3] - b[1]) * k;
    var c = document.createElement('canvas');
    c.width = Math.max(2, Math.ceil(w * dpr)); c.height = Math.max(2, Math.ceil(h * dpr));
    var g = c.getContext('2d');
    g.scale(k * dpr, k * dpr); g.translate(-b[0], -b[1]);
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
    return { c: c, box: b };
  }

  /* a seamless caustic texture: the soft, cellular net of light you see under water.
     Bright where two cells meet, then softened so it reads as light, not lines. */
  function causticTile(size, rgb) {
    var c = document.createElement('canvas'); c.width = c.height = size;
    var g = c.getContext('2d'), img = g.createImageData(size, size), d = img.data, parts = rgb.split(',').map(Number);
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
    // soften: shrink and grow back (keeps the tile seamless)
    var s2 = document.createElement('canvas'); s2.width = s2.height = size / 4;
    var g2 = s2.getContext('2d'); g2.imageSmoothingQuality = 'high'; g2.drawImage(c, 0, 0, size / 4, size / 4);
    var out = document.createElement('canvas'); out.width = out.height = size;
    var go = out.getContext('2d'); go.imageSmoothingQuality = 'high'; go.drawImage(s2, 0, 0, size, size);
    go.globalAlpha = .55; go.drawImage(c, 0, 0);
    return out;
  }

  function glowSprite(size, rgb) {
    var c = document.createElement('canvas'); c.width = c.height = size;
    var g = c.getContext('2d'), r = size / 2, gr = g.createRadialGradient(r, r, 0, r, r, r);
    gr.addColorStop(0, 'rgba(' + rgb + ',1)'); gr.addColorStop(.25, 'rgba(' + rgb + ',.55)'); gr.addColorStop(1, 'rgba(' + rgb + ',0)');
    g.fillStyle = gr; g.fillRect(0, 0, size, size); return c;
  }
  // a soft shaft of light: bright along its centre, fading at the edges and with depth
  function raySprite(w, h, rgb) {
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    var g = c.getContext('2d'), gx = g.createLinearGradient(0, 0, w, 0);
    gx.addColorStop(0, 'rgba(' + rgb + ',0)'); gx.addColorStop(.5, 'rgba(' + rgb + ',1)'); gx.addColorStop(1, 'rgba(' + rgb + ',0)');
    g.fillStyle = gx; g.fillRect(0, 0, w, h);
    g.globalCompositeOperation = 'destination-in';
    var gy = g.createLinearGradient(0, 0, 0, h);
    gy.addColorStop(0, 'rgba(0,0,0,1)'); gy.addColorStop(.45, 'rgba(0,0,0,.35)'); gy.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gy; g.fillRect(0, 0, w, h); return c;
  }
  function bubbleSprite(size) {
    var c = document.createElement('canvas'); c.width = c.height = size;
    var g = c.getContext('2d'), r = size / 2;
    g.strokeStyle = 'rgba(225, 255, 250, .75)'; g.lineWidth = size * .07; g.beginPath(); g.arc(r, r, r * .8, 0, 6.283); g.stroke();
    g.fillStyle = 'rgba(255,255,255,.65)'; g.beginPath(); g.arc(r * .7, r * .68, r * .18, 0, 6.283); g.fill();
    return c;
  }
  function fishSprite(len, rgb) {
    var c = document.createElement('canvas'); c.width = Math.ceil(len * 2.6); c.height = Math.ceil(len * 1.1);
    var g = c.getContext('2d'); g.translate(len * 1.55, len * .55); g.fillStyle = 'rgb(' + rgb + ')';
    g.beginPath(); g.ellipse(0, 0, len, len * .3, 0, 0, 6.283); g.fill();
    g.beginPath(); g.moveTo(-len * .8, 0); g.lineTo(-len * 1.5, -len * .42); g.lineTo(-len * 1.3, 0); g.lineTo(-len * 1.5, len * .42); g.closePath(); g.fill();
    return c;
  }
  function layer(cls, after) {
    var c = document.createElement('canvas'); c.className = cls; c.setAttribute('aria-hidden', 'true');
    after.parentNode.insertBefore(c, after.nextSibling); return c;
  }

  // the moving water: two caustic sheets drifting past each other (CSS, very light to render)
  var TILE = causticTile(256, C.caustic), TILE_URL = TILE.toDataURL();
  function waterSheets(ocean) {
    if (!ocean || ocean.querySelector('.caustics')) return;
    var w = document.createElement('div'); w.className = 'caustics'; w.setAttribute('aria-hidden', 'true');
    w.innerHTML = '<i></i><i></i>';
    w.querySelectorAll('i').forEach(function (i) { i.style.backgroundImage = 'url(' + TILE_URL + ')'; });
    ocean.insertBefore(w, ocean.firstChild);
  }

  /* ---------- One ocean ---------- */
  function Ocean(canvas) {
    var mode = MODES[canvas.getAttribute('data-mode')] || MODES.hero;
    var host = canvas.closest('section') || canvas.parentElement;
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(devicePixelRatio || 1, small ? 1 : 1.25);
    var W = 0, H = 0, whale = null, fish = [], motes = [], glows = [], bubbles = [], ripples = [], streams = [];
    var visible = true, mx = 0, my = 0, cmx = 0, cmy = 0, last = 0, time = 0, nextStream = 2;
    var fan = null, fanCtx = null, fanAge = 99, fanPat = null;
    // the whale gets its own layer, shown see-through by the browser: no seams where fins meet the body
    var wCanvas = null, wctx = ctx, front = 1, ws = small ? .7 : .75, pattern = null;
    if (mode.whale) {
      wCanvas = layer('sea-whale', canvas); wctx = wCanvas.getContext('2d');
      wCanvas.style.opacity = mode.whale.opacity; front = 1 / mode.whale.opacity;
      pattern = wctx.createPattern(TILE, 'repeat');
    }
    var GLOW = glowSprite(64, C.mote), BUB = bubbleSprite(32), SUN = glowSprite(256, C.sun), RAY = raySprite(64, 512, C.ray), rays = [];
    var FISH = C.fish.map(function (c) { return fishSprite(12, c); });
    for (var ri = 0; ri < 9; ri++) rays.push({ a: (-34 + ri * 8.5 + Math.random() * 4) * RAD, w: .04 + Math.random() * .08, o: .05 + Math.random() * .08,
      sp: .05 + Math.random() * .06, sw: (1.5 + Math.random() * 2.5) * RAD, p: Math.random() * 6.283 });

    /* the whale's line across the screen: a slightly different line on each pass */
    function newPass() {
      var cfg = mode.whale;
      whale.ang = (cfg.angle + (Math.random() - .5) * 8) * RAD;
      whale.cx = W * (.42 + Math.random() * .16); whale.cy = H * (.42 + Math.random() * .14);
      whale.jit = .95 + Math.random() * .08;
      var L = whale.L * whale.jit, R = L * .6, dx = Math.cos(whale.ang), dy = Math.sin(whale.ang);
      // where it is just out of sight as it arrives (bottom-right) and as it leaves (top-left)
      function edge(lim, c, d) { return (lim - c) / d; }
      whale.s0 = Math.max(edge(W + R, whale.cx, dx), edge(H + R, whale.cy, dy));
      whale.s1 = Math.min(edge(-R, whale.cx, dx), edge(-R, whale.cy, dy));
      whale.s = whale.s0;
    }

    function build() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      if (!W || !H) return;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      if (wCanvas) { wCanvas.width = Math.round(W * dpr * ws); wCanvas.height = Math.round(H * dpr * ws); }
      if (mode.whale) {
        var L = H * mode.whale.len, k = L / 560, sp = {};
        for (var key in PARTS) sp[key] = sprite(PARTS[key], k, dpr * ws);
        var prog = whale ? (whale.s - whale.s0) / (whale.s1 - whale.s0) : .32;   // start partway across, already in view
        whale = { L: L, sp: sp, ph: Math.random() * 6.283 };
        newPass();
        whale.s = mix(whale.s0, whale.s1, prog);
      }
      fish = [];
      var R = Math.min(W, H);
      for (var f = 0; f < mode.fish; f++) {
        var d = Math.random();
        fish.push({ a: Math.random() * 6.283, w: (.07 + Math.random() * .09) * (Math.random() < .88 ? 1 : -1), r: R * (.1 + Math.random() * .34),
          p: Math.random() * 6.283, d: d, s: .3 + d * .55, x: null, y: null, h: 0 });
      }
      motes = [];
      for (var m = 0; m < mode.motes; m++) motes.push({ x: Math.random() * W, y: Math.random() * H, r: .6 + Math.random() * 1.8, v: 2 + Math.random() * 7, p: Math.random() * 6.283, a: .15 + Math.random() * .45 });
      glows = [];
      for (var gq = 0; gq < mode.glowMotes; gq++) glows.push({ x: Math.random() * W, y: Math.random() * H, r: 10 + Math.random() * 26, v: 3 + Math.random() * 6, p: Math.random() * 6.283, a: .05 + Math.random() * .1 });
      fanAge = 99;
    }

    function drawPart(g, sp, pivot, rot, sy) {
      var b = sp.box;
      if (pivot) { g.save(); g.translate(pivot[0], pivot[1]); g.rotate(rot); if (sy) g.scale(1, sy); g.translate(-pivot[0], -pivot[1]); }
      g.drawImage(sp.c, b[0], b[1], b[2] - b[0], b[3] - b[1]);
      if (pivot) g.restore();
    }

    function drawWhale(g, ox, oy) {
      var w = whale, dx = Math.cos(w.ang), dy = Math.sin(w.ang);
      var x = w.cx + dx * w.s + ox, y = w.cy + dy * w.s + oy;
      var t = time + w.ph * 3;
      var rot = w.ang + Math.PI / 2 + Math.sin(time * .1 + w.ph) * .025;
      var k = (w.L * w.jit) / 560;
      var breathe = 1 + Math.sin(t * .5) * .012;                       // a slow breath, barely there
      g.save(); g.translate(x, y); g.rotate(rot); g.scale(k * breathe, k); g.translate(-CENTER[0], -CENTER[1]);
      // a very small wave runs through the body: head one way, tail the other
      var wave = Math.sin(t * .55);
      // long pectoral fins, slow heavy strokes
      drawPart(g, w.sp.finR, PARTS.finR.pivot, Math.sin(t * .4) * 5 * RAD);
      drawPart(g, w.sp.finL, PARTS.finL.pivot, -Math.sin(t * .4) * 5 * RAD);
      g.save(); g.translate(100, 296); g.rotate(wave * 2.4 * RAD); g.translate(-100, -296);
      drawPart(g, w.sp.fluke, PARTS.fluke.pivot, Math.sin(t * .55 - .9) * 6 * RAD, .86 + .14 * Math.sin(t * .55 - .4));
      drawPart(g, w.sp.rear);
      g.restore();
      g.save(); g.translate(100, 296); g.rotate(-wave * .9 * RAD); g.translate(-100, -296);
      drawPart(g, w.sp.front);
      g.restore();
      g.restore();
      // light moving over the body, like water: two caustic sheets drifting across the whale only
      if (false) {
        g.save(); g.globalCompositeOperation = 'source-atop';
        pattern.setTransform(new DOMMatrix().translate(time * 14, time * 9).scale(2.4));
        g.globalAlpha = .32; g.fillStyle = pattern; g.fillRect(0, 0, W, H);
        pattern.setTransform(new DOMMatrix().translate(-time * 11, time * 6).rotate(30).scale(1.7));
        g.globalAlpha = .22; g.fillRect(0, 0, W, H);
        g.restore();
      }
      // now and then a few slow bubbles from the blowhole
      if (!reduce && Math.random() < .012) bubbles.push({ x: x + dx * w.L * .32, y: y + dy * w.L * .32, r: 1.5 + Math.random() * 3, v: 20 + Math.random() * 25, p: Math.random() * 6.283 });
    }

    function frame(now) {
      if (!reduce) requestAnimationFrame(frame);
      var dt = last ? Math.min(.05, (now - last) / 1000) : .016; last = now;
      if (!visible || document.hidden || !W) return;
      time += dt;
      cmx += (mx - cmx) * .03; cmy += (my - cmy) * .03;
      var sy = mode.scroll ? Math.min(scrollY, H) : 0;
      var lx = W * mode.light[0], ly = H * mode.light[1];

      // the whale moves on; the moment it leaves, it glides in again
      if (whale && !reduce) {
        whale.s += mode.whale.speed * dt;
        if (whale.s >= whale.s1) newPass();
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      if (wCanvas) { wctx.setTransform(dpr * ws, 0, 0, dpr * ws, 0, 0); wctx.clearRect(0, 0, W, H); }

      // far motes
      for (var i = 0; i < motes.length; i++) {
        var p = motes[i]; p.y -= p.v * dt; p.p += dt * .5;
        if (p.y < -6) { p.y = H + 6; p.x = Math.random() * W; }
        ctx.globalAlpha = mode.alpha * p.a * (.6 + .4 * Math.sin(p.p * 2));
        ctx.drawImage(GLOW, p.x + Math.sin(p.p) * 8 - p.r * 2, p.y - p.r * 2, p.r * 4, p.r * 4);
      }

      // the school swirls slowly around the light beam (seen through the whale)
      for (var f = 0; f < fish.length; f++) {
        var fi = fish[f]; fi.a += fi.w * dt; fi.p += dt * .35;
        var rad = fi.r * (1 + .08 * Math.sin(fi.p));
        var fx = lx + Math.cos(fi.a) * rad + cmx * 14 * fi.d;
        var fy = ly + Math.sin(fi.a) * rad * .42 + Math.sin(fi.p * 1.3) * rad * .1 + rad * .18 - sy * .1;
        if (fi.x !== null) {
          var target = Math.atan2(fy - fi.y, fx - fi.x);
          fi.h += Math.atan2(Math.sin(target - fi.h), Math.cos(target - fi.h)) * .1;
        }
        fi.x = fx; fi.y = fy;
        var spr = FISH[fi.d < .33 ? 0 : fi.d < .66 ? 1 : 2], sc = fi.s;
        ctx.save(); ctx.translate(fx, fy); ctx.rotate(fi.h); ctx.globalAlpha = mode.alpha * (.4 + fi.d * .45);
        ctx.drawImage(spr, -spr.width * .6 * sc, -spr.height * .5 * sc, spr.width * sc, spr.height * sc);
        ctx.restore();
      }
      ctx.globalAlpha = mode.alpha;

      // the whale, on its own see-through layer
      if (whale) { wctx.globalAlpha = 1; drawWhale(wctx, cmx * 26, cmy * 16 - sy * .28); }

      // god rays: painted into their own half-size layer a few times a second (they move very slowly)
      if (mode.rays) {
        if (!fan) { fan = layer('sea-rays', wCanvas || canvas); fanCtx = fan.getContext('2d'); }
        if (fan.width !== Math.ceil(W / 2) || fan.height !== Math.ceil(H / 2)) { fan.width = Math.ceil(W / 2); fan.height = Math.ceil(H / 2); fanAge = 99; }
        fanAge += dt;
        if (fanAge > (small ? .1 : .06)) {
          fanAge = 0; var fc = fanCtx, hw = fan.width, hh = fan.height, flx = hw * mode.light[0], fly = hh * mode.light[1];
          fc.setTransform(1, 0, 0, 1, 0, 0); fc.clearRect(0, 0, hw, hh);
          // the moving net of light on the water (and over the whale): two caustic sheets drifting past each other
          if (!fanPat) fanPat = fc.createPattern(TILE, 'repeat');
          if (fanPat.setTransform && window.DOMMatrix) {
            fc.globalCompositeOperation = 'source-over'; fc.fillStyle = fanPat;
            fanPat.setTransform(new DOMMatrix().translate(time * 7, time * 4.5).scale(1.8)); fc.globalAlpha = .17; fc.fillRect(0, 0, hw, hh);
            fanPat.setTransform(new DOMMatrix().translate(-time * 5.5, time * 3).rotate(28).scale(1.3)); fc.globalAlpha = .1; fc.fillRect(0, 0, hw, hh);
            // brightest near the surface, fading with depth
            fc.globalCompositeOperation = 'destination-in'; fc.globalAlpha = 1;
            var fade = fc.createLinearGradient(0, 0, 0, hh); fade.addColorStop(0, 'rgba(0,0,0,1)'); fade.addColorStop(.5, 'rgba(0,0,0,.5)'); fade.addColorStop(1, 'rgba(0,0,0,.08)');
            fc.fillStyle = fade; fc.fillRect(0, 0, hw, hh);
          }
          fc.globalCompositeOperation = 'lighter';
          var sunR = Math.max(hw, hh) * .42 * (1 + .04 * Math.sin(time * .25));
          fc.globalAlpha = .2; fc.drawImage(SUN, flx - sunR, fly - hh * .2 - sunR * .55, sunR * 2, sunR * 1.1);
          var rl = Math.hypot(hw, hh) * 1.05;
          for (var r2 = 0; r2 < rays.length; r2++) {
            var ry = rays[r2], ang = ry.a + Math.sin(time * ry.sp + ry.p) * ry.sw, rw = Math.max(hw, hh) * ry.w;
            fc.save(); fc.translate(flx, fly - hh * .25); fc.rotate(ang);
            fc.globalAlpha = ry.o * (.7 + .3 * Math.sin(time * ry.sp * 1.7 + ry.p));
            fc.drawImage(RAY, -rw / 2, 0, rw, rl); fc.restore();
          }
        }
      }

      // everything in front of the whale is drawn on the whale's layer, made a little brighter to stay true
      var g = wctx;

      // bubbles: now and then a slow stream rises from below
      nextStream -= dt;
      if (nextStream <= 0 && !reduce) { streams.push({ x: W * (.1 + Math.random() * .8), left: 10 + Math.random() * 10, t: 0 }); nextStream = 4 + Math.random() * 6; }
      for (var q = streams.length - 1; q >= 0; q--) {
        var st = streams[q]; st.t -= dt;
        if (st.t <= 0) { bubbles.push({ x: st.x + (Math.random() - .5) * 10, y: H + 8, r: 2 + Math.random() * 4, v: 24 + Math.random() * 26, p: Math.random() * 6.283 }); st.t = .12 + Math.random() * .25; st.left--; }
        if (st.left <= 0) streams.splice(q, 1);
      }
      for (var b = bubbles.length - 1; b >= 0; b--) {
        var bb = bubbles[b]; bb.y -= bb.v * dt; bb.p += dt * 2.2;
        var fade = Math.min(1, bb.y / (H * .5));
        g.globalAlpha = Math.min(1, mode.alpha * .7 * Math.max(0, fade) * front);
        g.drawImage(BUB, bb.x + Math.sin(bb.p) * 4 - bb.r, bb.y - bb.r, bb.r * 2, bb.r * 2);
        if (bb.y < -10 || fade <= 0) bubbles.splice(b, 1);
      }

      // near, out-of-focus light motes
      for (var gq = 0; gq < glows.length; gq++) {
        var gm = glows[gq]; gm.y -= gm.v * dt; gm.p += dt * .3;
        if (gm.y < -gm.r * 2) { gm.y = H + gm.r * 2; gm.x = Math.random() * W; }
        g.globalAlpha = Math.min(1, mode.alpha * gm.a * (.7 + .3 * Math.sin(gm.p * 2)) * front);
        g.drawImage(GLOW, gm.x + Math.sin(gm.p) * 14 + cmx * 40 - gm.r * 2, gm.y - gm.r * 2, gm.r * 4, gm.r * 4);
      }

      // ripples from a click or tap
      for (var r = ripples.length - 1; r >= 0; r--) {
        var rp = ripples[r], age = time - rp.t;
        if (age > 3) { ripples.splice(r, 1); continue; }
        for (var ring = 0; ring < 3; ring++) {
          var ra = age - ring * .35; if (ra <= 0) continue;
          g.globalAlpha = Math.min(1, Math.max(0, .45 * (1 - ra / 2.6)) * front);
          g.strokeStyle = 'rgb(205, 250, 245)'; g.lineWidth = 1.2;
          g.beginPath(); g.ellipse(rp.x, rp.y, ra * 70, ra * 70 * .55, 0, 0, 6.283); g.stroke();
        }
      }
      ctx.globalAlpha = 1; g.globalAlpha = 1;
    }

    /* interaction */
    host.addEventListener('mousemove', function (e) { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
    if (mode.ripple) host.addEventListener('click', function (e) {
      if (e.target.closest('a, button')) return;
      var rc = canvas.getBoundingClientRect(), x = e.clientX - rc.left, y = e.clientY - rc.top;
      ripples.push({ x: x, y: y, t: time });
      for (var i = 0; i < 8; i++) bubbles.push({ x: x + (Math.random() - .5) * 30, y: y + Math.random() * 20, r: 1.5 + Math.random() * 3.5, v: 30 + Math.random() * 40, p: Math.random() * 6.283 });
    });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(canvas);
    var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { build(); if (reduce) still(); }, 150); });

    // reduced motion: one calm, still frame with the whale in view
    function still() { time = 30; last = 0; visible = true; if (whale) whale.s = mix(whale.s0, whale.s1, .45); frame(performance.now()); }
    build();
    if (reduce) still(); else requestAnimationFrame(frame);
  }

  document.querySelectorAll('canvas.sea').forEach(function (c) { Ocean(c); });
})();
