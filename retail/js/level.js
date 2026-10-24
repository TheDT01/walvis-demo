/* =========================================================
   WALVIS CONCIERGE · retail/js/level.js
   A floor's own lobby (retail/level.html?level=…). You step out of the glass lift and the
   floor's shops stand around you in a curve, their windows lit and their pieces on show.
   Turn to a shop (arrows, a swipe, the wheel or the names below), then walk in.
   ========================================================= */
(function () {
  'use strict';
  var M = window.Mall; if (!M) return;
  var esc = M.esc;
  var l = M.level(M.param('level') || '');
  var vp = document.getElementById('mx-vp'), world = document.getElementById('mx-world'), hud = document.getElementById('mx-hud'), below = document.getElementById('mx-below');
  if (!l) { notFound(); return; }
  M.setMeta(M.levelLabel(l) + ' · The Walvis Promenade | Walvis Concierge', l.name + ' at The Walvis Promenade: ' + l.tagline + ' ' + l.shops.map(function (s) { return s.name; }).join(', ') + '.');
  M.Lift.button(l.number);

  /* ---------- the room: shops in a curve, a stone floor, a ring of light above ---------- */
  var R = 1300, n = l.shops.length, STEP = n <= 3 ? 36 : n <= 4 ? 32 : 28;
  var angles = l.shops.map(function (s, i) { return (i - (n - 1) / 2) * STEP; });
  function rad(a) { return a * Math.PI / 180; }
  vp.style.perspective = M.persp() + 'px';
  M.plane(world, 'mx-marble mx-round-floor', { w: 3600, h: 3600, x: 0, y: 330, z: 0, rx: 90 }, '<i class="mx-inlay"></i>');
  M.plane(world, 'mx-round-ceiling', { w: 3400, h: 3400, x: 0, y: -520, z: 0, rx: -90 });
  l.shops.forEach(function (s, i) {
    var a = angles[i], x = R * Math.sin(rad(a)), z = -R * Math.cos(rad(a));
    var tiles = s.items.slice(0, 3).map(function (it) {
      return '<span class="mx-tile">' + M.photo(it.image, it.title) + '<span class="mx-tile-cap">' + esc(it.title) + '</span></span>';
    }).join('');
    var front = M.plane(world, 'mx-front', { w: 600, h: 720, x: x, y: -30, z: z, ry: -a, tag: 'a', href: M.url.shop(s) },
      '<span class="mx-front-sign"><span>' + esc(s.name) + '</span></span>' +
      '<span class="mx-front-win">' + (s.image ? '<img class="mx-front-bg" src="' + esc(s.image) + '" alt="" draggable="false">' : '') + '<span class="mx-tiles">' + tiles + '</span><span class="mx-front-glass"></span></span>' +
      '<span class="mx-front-foot"><em>' + esc(s.tagline) + '</em><b>' + s.items.length + ' ' + (s.items.length === 1 ? 'piece' : 'pieces') + '</b></span>');
    front.setAttribute('data-i', i); front.setAttribute('tabindex', '-1'); front.setAttribute('aria-hidden', 'true');
    // a pilaster between shops, and a soft pool of light on the floor in front of each one
    var pa = a + STEP / 2;
    if (i < n - 1) M.plane(world, 'mx-pilaster', { w: 70, h: 820, x: R * Math.sin(rad(pa)), y: -60, z: -R * Math.cos(rad(pa)), ry: -pa });
    M.plane(world, 'mx-pool', { w: 700, h: 500, x: (R - 300) * Math.sin(rad(a)), y: 329, z: -(R - 300) * Math.cos(rad(a)), ry: -a, rx: 90 });
  });
  // life on the floor: people strolling past the windows, palms between the shops, benches, banners overhead
  var rr = (function () { var s = l.number * 97 + 3; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; })();
  l.shops.forEach(function (s, i) {
    var a = angles[i], r = R - 330;
    M.person(world, { x: r * Math.sin(rad(a)), y: 330, z: -r * Math.cos(rad(a)), ry: -a, walk: 560, dur: 14 + rr() * 8, delay: rr() * 14, bag: rr() > .4, scale: 1.5, back: i % 2 === 1, tone: i });
    M.plane(world, 'mx-banner mx-banner-' + (i % 2 ? 'a' : 'b') + ' mx-banner-shop', { w: 120, h: 300, x: (R - 120) * Math.sin(rad(a + STEP * .36)), y: -330, z: -(R - 120) * Math.cos(rad(a + STEP * .36)), ry: -a },
      '<span>' + esc(s.name) + '</span>');
    if (i < n - 1) {
      var pa = a + STEP / 2, pr = R - 30;
      M.planter(world, { x: pr * Math.sin(rad(pa)), y: 330, z: -pr * Math.cos(rad(pa)), ry: -pa, scale: .62 });
    }
  });
  [-1, 1].forEach(function (side) {
    var ba = side * ((n - 1) / 2 * STEP + STEP * .55), br = R - 520;
    M.bench(world, { x: br * Math.sin(rad(ba)), y: 330, z: -br * Math.cos(rad(ba)), ry: -ba });
    M.person(world, { x: (br + 60) * Math.sin(rad(ba + side * 4)), y: 330, z: -(br + 60) * Math.cos(rad(ba + side * 4)), ry: -ba, scale: 1.45, tone: side > 0 ? 3 : 1 });
  });
  M.themeSwitch();
  M.motes(document.getElementById('mx-scene'), 22);

  // the ends of the curve: a glass rail over the atrium
  [-1, 1].forEach(function (side) {
    var a = side * ((n - 1) / 2 * STEP + STEP * .85);
    M.plane(world, 'mx-rail mx-rail-end', { w: 900, h: 130, x: R * .8 * Math.sin(rad(a)), y: 260, z: -R * .8 * Math.cos(rad(a)), ry: -a });
  });

  /* ---------- the camera ---------- */
  var cam = new M.Camera(world, M.persp()), cur = 0, busy = false;
  var focusShop = M.shop(M.param('shop') || '');
  if (focusShop && focusShop.level === l) cur = l.shops.indexOf(focusShop);
  else cur = Math.floor((n - 1) / 2);
  function stand() { return innerWidth < 700 ? 400 : innerWidth < 1100 ? 300 : 120; }   // closer on a phone
  function pose(i, extra) {
    var a = angles[i], r = stand() + (extra || 0);
    return { yaw: a, x: r * Math.sin(rad(a)), z: -r * Math.cos(rad(a)), y: 0, pitch: 0 };
  }
  addEventListener('resize', function () { var p = M.persp(); cam.P = p; vp.style.perspective = p + 'px'; cam.set(pose(cur)); });

  /* ---------- what you see on screen: where you are, the shop in front of you, the way around ---------- */
  hud.innerHTML = '<div class="mx-hud-top">' + M.crumbs([['Lobby', M.url.lobby()], [M.levelLabel(l), '']]) +
      '<h1 tabindex="-1"><span>Level ' + l.number + '</span>' + esc(l.name) + '</h1><p>' + esc(l.tagline) + '</p></div>' +
    '<div class="mx-hud-card" aria-live="polite"></div>' +
    '<nav class="mx-shop-tabs" aria-label="Shops on this floor">' + l.shops.map(function (s, i) {
      return '<button type="button" data-i="' + i + '">' + esc(s.name) + '</button>';
    }).join('') + '</nav>';
  var card = hud.querySelector('.mx-hud-card');
  function showCard() {
    var s = l.shops[cur];
    card.innerHTML = '<button type="button" class="mx-turn mx-turn-l" aria-label="Turn to the previous shop"' + (cur ? '' : ' disabled') + '><svg class="i" aria-hidden="true"><use href="#i-arrow"/></svg></button>' +
      '<div class="mx-card-text"><span>' + esc(s.tagline) + '</span><b>' + esc(s.name) + '</b><small>' + s.items.length + ' pieces · ' + esc(M.levelLabel(l)) + '</small></div>' +
      '<a class="btn btn-teal mx-enter-shop" href="' + M.url.shop(s) + '" data-walk>Enter the shop</a>' +
      '<button type="button" class="mx-turn mx-turn-r" aria-label="Turn to the next shop"' + (cur < n - 1 ? '' : ' disabled') + '><svg class="i" aria-hidden="true"><use href="#i-arrow"/></svg></button>';
    hud.querySelectorAll('.mx-shop-tabs button').forEach(function (b) { b.setAttribute('aria-current', String(+b.getAttribute('data-i') === cur)); });
    world.querySelectorAll('.mx-front').forEach(function (f) { f.classList.toggle('lit', +f.getAttribute('data-i') === cur); });
  }
  function turn(i) {
    if (busy || i < 0 || i >= n || i === cur) return;
    cur = i; showCard();
    cam.to(pose(i), 1150, M.ease.inOutSine);
  }
  function enter(i) {
    if (busy) return; busy = true;
    var s = l.shops[i];
    hud.classList.add('away');
    var go = function () {
      cam.to(pose(i, R - stand() - 330), 1500, M.ease.in, function (p) { if (p > .55) world.querySelector('.mx-front[data-i="' + i + '"]').classList.add('opening'); })
        .then(function () { M.go(M.url.shop(s, 'door'), 320); });
    };
    if (i !== cur) { cur = i; showCard(); cam.to(pose(i), 900, M.ease.inOutSine).then(go); } else go();
  }

  hud.addEventListener('click', function (e) {
    var t = e.target.closest('button[data-i]'); if (t) { turn(+t.getAttribute('data-i')); return; }
    if (e.target.closest('.mx-turn-l')) turn(cur - 1);
    if (e.target.closest('.mx-turn-r')) turn(cur + 1);
  });
  M.onLink(function (a) { if (a.classList.contains('mx-enter-shop')) enter(cur); else M.go(a.getAttribute('href')); });
  vp.addEventListener('click', function (e) {
    var f = e.target.closest('.mx-front'); if (!f) return;
    e.preventDefault(); if (moved) return;
    var i = +f.getAttribute('data-i'); if (i === cur) enter(i); else turn(i);
  });
  addEventListener('keydown', function (e) {
    if (document.querySelector('.mx-ride') || e.target.closest('input, textarea')) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); turn(cur - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); turn(cur + 1); }
  });
  var wheelAt = 0;
  vp.addEventListener('wheel', function (e) {
    var d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : 0;
    if (!d) return;
    e.preventDefault();
    if (Date.now() - wheelAt < 650 || Math.abs(d) < 8) return;
    wheelAt = Date.now(); turn(cur + (d > 0 ? 1 : -1));
  }, { passive: false });
  var sx = null, moved = false;
  vp.addEventListener('pointerdown', function (e) { sx = e.clientX; moved = false; });
  addEventListener('pointerup', function (e) {
    if (sx == null) return; var d = e.clientX - sx; sx = null;
    if (Math.abs(d) > 50) { moved = true; turn(cur + (d < 0 ? 1 : -1)); setTimeout(function () { moved = false; }, 50); }
  });
  cam.follow(vp, [4, 2]);

  /* ---------- below the scene: every shop on this floor, as a list ---------- */
  var others = M.P.levels.filter(function (x) { return x !== l; });
  below.innerHTML = '<div class="wrap"><header class="mx-below-head"><span class="mx-pill">' + esc(M.levelLabel(l)) + '</span><h2>' + esc(l.name) + '</h2><p>' + esc(l.intro) + '</p></header>' +
    '<div class="mx-shoplist">' + l.shops.map(function (s) {
      return '<a class="mx-shopcard" href="' + M.url.shop(s) + '" data-walk><span class="mx-shopcard-ph">' + M.photo(s.image, s.name) + '</span><span class="mx-shopcard-sign">' + esc(s.name) + '</span>' +
        '<span class="mx-shopcard-tag">' + esc(s.tagline) + '</span><span class="mx-shopcard-n">' + s.items.length + ' pieces</span></a>';
    }).join('') + '</div>' +
    '<nav class="mx-other-floors" aria-label="Other floors"><span>Other floors</span><a href="' + M.url.lobby() + '" data-walk>Lobby</a>' + others.map(function (x) { return '<a href="' + M.url.level(x) + '" data-walk>' + x.number + ' · ' + esc(x.name) + '</a>'; }).join('') + '</nav>' +
    M.sourcing() + '</div>';

  /* ---------- arriving: by lift you step out of the cab; otherwise you walk in ---------- */
  showCard();
  var start = pose(cur, -900);
  if (M.via === 'lift') { cam.set(Object.assign(start, { pitch: -1 })); M.Lift.arrive(vp); }
  else cam.set(pose(cur, -600));
  cam.to(pose(cur), M.via === 'lift' ? 2200 : 1800, M.ease.out).then(function () { var h = hud.querySelector('h1'); if (h) h.focus({ preventScroll: true }); });

  function notFound() {
    M.setMeta('Not found · The Walvis Promenade | Walvis Concierge');
    document.getElementById('mx-scene').remove();
    below.innerHTML = '<div class="wrap mx-404"><span class="mx-pill">The Walvis Promenade</span><h1>We could not find <em>that one.</em></h1><p>It may have moved to another floor. The lobby has every floor in its directory.</p>' +
      '<p class="mx-404-act"><a class="btn btn-teal" href="retail/index.html">Back to the lobby</a></p></div>';
    M.Lift.button(0);
  }
})();
