/* =========================================================
   WALVIS CONCIERGE · retail/js/atrium.js
   The atrium: every floor of the mall stacked around a tall glass lift.
   The ground-floor lobby looks into it, and the lift rides up and down it.
   Floor 0 is the lobby; floors 1 to 7 are the levels in retail/js/data.js.
   ========================================================= */
(function () {
  'use strict';
  var M = window.Mall; if (!M) return;
  var esc = M.esc, plane = M.plane;
  var FH = 760, AW = 2600, FAR = -1500, EDGE = -980, SIDE = AW / 2;
  function floorY(f) { return -f * FH + 300; }      // the floor surface of floor f
  function eyeY(f) { return -f * FH; }              // where your eyes are when you stand on it

  // a small shopfront on a balcony: lit sign and a window with a glimpse of what is inside
  function shopfront(s) {
    var pieces = s.items.slice(0, 2).map(function (i) {
      return '<span class="mx-sf-piece">' + (i.image ? '<img src="' + esc(i.image) + '" alt="" loading="lazy" draggable="false">' : '<i></i>') + '</span>';
    }).join('');
    return '<span class="mx-sf"><span class="mx-sf-sign">' + esc(s.name) + '</span><span class="mx-sf-win">' +
      (s.image ? '<img class="mx-sf-bg" src="' + esc(s.image) + '" alt="" loading="lazy" draggable="false">' : '') + '<span class="mx-sf-pieces">' + pieces + '</span></span></span>';
  }

  M.buildAtrium = function (world, opts) {
    opts = opts || {};
    var levels = M.P.levels, top = levels.length;

    // the lobby floor, polished, and the skylight far above
    plane(world, 'mx-marble mx-lobby-floor', { w: AW, h: 3400, x: 0, y: floorY(0), z: 200, rx: 90 });
    plane(world, 'mx-skylight', { w: AW, h: 2600, x: 0, y: floorY(top) - FH + 40, z: -300, rx: -90 });

    for (var f = 0; f <= top; f++) {
      var l = f ? levels[f - 1] : null, fy = floorY(f), mid = fy - FH / 2;
      // the back of each floor: its shops, seen across the atrium
      var band = plane(world, 'mx-band' + (f ? '' : ' mx-band-lobby'), { w: AW, h: FH, x: 0, y: mid, z: FAR },
        f ? '<span class="mx-band-no">' + l.number + '</span><span class="mx-band-name">' + esc(l.name) + '</span>' +
            '<span class="mx-band-shops">' + l.shops.map(shopfront).join('') + '</span>'
          : '<span class="mx-lobby-sign"><b>The Walvis Promenade</b><small>Private shopping, by Walvis Concierge</small></span><span class="mx-desk"><i></i><em>Concierge</em></span>');
      band.setAttribute('data-floor', f);
      // the side walls: more shops, running towards you
      plane(world, 'mx-side mx-side-l', { w: 2300, h: FH, x: -SIDE, y: mid, z: -350, ry: 90 }, f ? '<span class="mx-side-name">' + l.number + ' · ' + esc(l.name) + '</span>' : '');
      plane(world, 'mx-side mx-side-r', { w: 2300, h: FH, x: SIDE, y: mid, z: -350, ry: -90 }, f ? '<span class="mx-side-name">' + l.number + ' · ' + esc(l.name) + '</span>' : '');
      if (!f) continue;
      // the balcony: its floor, the edge of the slab and a glass rail lit in teal
      plane(world, 'mx-marble mx-balcony', { w: AW, h: EDGE - FAR, x: 0, y: fy, z: (FAR + EDGE) / 2, rx: 90 });
      plane(world, 'mx-slab', { w: AW, h: 54, x: 0, y: fy + 27, z: EDGE });
      plane(world, 'mx-rail', { w: AW, h: 120, x: 0, y: fy - 60, z: EDGE });
      plane(world, 'mx-slab mx-slab-side', { w: 2300, h: 54, x: -SIDE + 520, y: fy + 27, z: -350, ry: 90 });
      plane(world, 'mx-slab mx-slab-side', { w: 2300, h: 54, x: SIDE - 520, y: fy + 27, z: -350, ry: -90 });
    }

    /* ---------- life: people, escalators, banners, greenery, a fountain, light ---------- */
    var rnd = (function () { var s = 7; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; })();
    // people strolling along every balcony, some with shopping bags
    for (f = 1; f <= top; f++) {
      var by = floorY(f);
      M.person(world, { x: -500 + rnd() * 400, y: by, z: -1260, walk: 900 + rnd() * 500, dur: 18 + rnd() * 10, delay: rnd() * 20, bag: rnd() > .5, scale: 1.35 });
      M.person(world, { x: 300 + rnd() * 400, y: by, z: -1130, walk: 700 + rnd() * 400, dur: 16 + rnd() * 8, delay: rnd() * 20, bag: rnd() > .4, scale: 1.35, back: true });
      if (f % 2) M.person(world, { x: -900 + rnd() * 200, y: by, z: -1350, scale: 1.3 });
      M.planter(world, { x: (f % 2 ? -1 : 1) * (AW / 2 - 260), y: by, z: -1200 });
      // a banner below each balcony, with the floor's number and name
      plane(world, 'mx-banner mx-banner-' + (f % 2 ? 'a' : 'b'), { w: 150, h: 430, x: (f % 2 ? -1 : 1) * 880, y: by + 54 + 230, z: EDGE - 6 },
        '<b>' + levels[f - 1].number + '</b><span>' + esc(levels[f - 1].name) + '</span>');
    }
    // escalators crossing the atrium between floors, their steps always moving
    var RUN = 600, L = Math.sqrt(RUN * RUN + FH * FH), TILT = Math.atan2(RUN, FH) * 180 / Math.PI;
    for (f = 0; f < top; f++) {
      var ex = (f % 2 ? 1 : -1) * 600, ey = floorY(f) - FH / 2, ez = -250 - RUN / 2;
      plane(world, 'mx-esc-truss', { w: 170, h: L, x: ex, y: ey + 34, z: ez + 18, rx: TILT });
      plane(world, 'mx-escalator' + (f % 2 ? ' down' : ''), { w: 150, h: L, x: ex, y: ey, z: ez, rx: TILT }, '<i></i>');
    }
    // the lobby: a fountain, palms, benches and people crossing
    var ly = floorY(0);
    var fountain = plane(world, 'mx-fountain', { w: 520, h: 520, x: -820, y: ly - 2, z: 420, rx: 90 }, '<i></i><i></i><i></i>');
    plane(world, 'mx-jet', { w: 60, h: 300, x: -820, y: ly - 150, z: 420 });
    [[-1060, 1150], [1060, 1150], [-1060, -480], [1060, -480], [760, 520]].forEach(function (p) { M.planter(world, { x: p[0], y: ly, z: p[1] }); });
    M.bench(world, { x: 760, y: ly, z: 900 }); M.bench(world, { x: -560, y: ly, z: 1050 });
    [[1050, 2000, 26, 0], [420, 1700, 22, 6], [-300, 1500, 24, 12], [-950, 1300, 20, 3], [760, 1200, 19, 9]].forEach(function (q, i) {
      M.person(world, { x: (i % 2 ? 200 : -200), y: ly, z: q[0], walk: q[1], dur: q[2], delay: q[3], bag: i % 2 === 0, scale: 1.45, back: i % 2 === 1, tone: i });
    });
    M.person(world, { x: 640, y: ly, z: 980, scale: 1.45, tone: 2 });
    M.person(world, { x: 860, y: ly, z: 1010, scale: 1.4, tone: 3, bag: true });
    // long banners hanging from the skylight, a sculpture of light, and glowing pendants
    var ceil = floorY(top) - FH + 60;
    plane(world, 'mx-banner mx-banner-long', { w: 200, h: 2300, x: -420, y: ceil + 1150, z: -760 }, '<span>The Walvis Promenade</span>');
    plane(world, 'mx-banner mx-banner-long b', { w: 200, h: 2300, x: 420, y: ceil + 1150, z: -760 }, '<span>Only the finest</span>');
    M.sculpture(world, { x: 0, y: floorY(5) - 120, z: -680, r: 300 });
    for (var k = 0; k < 14; k++) {
      var ox = (rnd() > .5 ? 1 : -1) * (360 + rnd() * 520), oy = floorY(1 + Math.floor(rnd() * top)) - 200 - rnd() * 300, oz = -180 - rnd() * 700;
      plane(world, 'mx-pendant-line', { w: 2, h: 900, x: ox, y: oy - 470, z: oz });
      plane(world, 'mx-pendant', { w: 46, h: 46, x: ox, y: oy, z: oz });
    }

    // the glass lift tower: four slim posts and a steel collar at every floor
    var shaftTop = floorY(top) - FH + 60, shaftH = floorY(0) - shaftTop, shaftMid = shaftTop + shaftH / 2;
    [[-270, -40], [270, -40], [-270, 450], [270, 450]].forEach(function (p) {
      plane(world, 'mx-post', { w: 14, h: shaftH, x: p[0], y: shaftMid, z: p[1] });
    });
    for (f = 1; f <= top; f++) {
      plane(world, 'mx-collar', { w: 554, h: 20, x: 0, y: floorY(f) + 6, z: -40 });
      plane(world, 'mx-collar', { w: 554, h: 20, x: 0, y: floorY(f) + 6, z: 450 });
    }
    plane(world, 'mx-shaft-glass', { w: 540, h: shaftH, x: 0, y: shaftMid, z: -41 });

    // the cab, waiting on the ground floor (hidden once you are inside it)
    var cab = document.createElement('div'); cab.className = 'mx-cab'; world.appendChild(cab);
    var cy = floorY(0) - 270;
    plane(cab, 'mx-cab-face mx-cab-back', { w: 520, h: 540, x: 0, y: cy, z: -30 });
    plane(cab, 'mx-cab-face mx-cab-side', { w: 480, h: 540, x: -260, y: cy, z: 210, ry: 90 });
    plane(cab, 'mx-cab-face mx-cab-side', { w: 480, h: 540, x: 260, y: cy, z: 210, ry: -90 });
    plane(cab, 'mx-cab-roof', { w: 520, h: 480, x: 0, y: cy - 270, z: 210, rx: -90 });
    var front = plane(cab, 'mx-cab-front', { w: 520, h: 540, x: 0, y: cy, z: 450, tag: opts.cabTag || 'div' },
      '<span class="mx-cab-door mx-cab-door-l"></span><span class="mx-cab-door mx-cab-door-r"></span><span class="mx-cab-call">' + (opts.cabLabel || '') + '</span>');
    // the departments, listed on the shaft above the lift
    var dir = plane(world, 'mx-dir-sign', { w: 960, h: 300, x: 0, y: cy - 470, z: 452 },
      '<b>The Glass Lift</b>' + levels.slice().reverse().map(function (l) {
        return '<span><i>' + l.number + '</i>' + esc(l.name) + '</span>';
      }).join('') + '<span class="mx-dir-g"><i>G</i>Lobby</span>');
    return { FH: FH, floorY: floorY, eyeY: eyeY, cab: cab, cabFront: front, dirSign: dir, top: top };
  };
  M.atrium = { FH: FH, floorY: floorY, eyeY: eyeY };
})();
