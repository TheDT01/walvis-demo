/* =========================================================
   WALVIS CONCIERGE · retail/js/shop.js
   Inside a shop (retail/shop.html?shop=…). The glass doors part and you step into the boutique:
   the shop's name glows on the back wall and its pieces stand on lit plinths.
   Walk up to a piece to see it in its vitrine, or read the full listing below.
   ========================================================= */
(function () {
  'use strict';
  var M = window.Mall; if (!M) return;
  var esc = M.esc;
  var s = M.shop(M.param('shop') || '');
  var vp = document.getElementById('mx-vp'), world = document.getElementById('mx-world'), hud = document.getElementById('mx-hud'), below = document.getElementById('mx-below');
  if (!s) { notFound(); return; }
  var l = s.level;
  M.setMeta(s.name + ' · ' + l.name + ' · The Walvis Promenade | Walvis Concierge', s.name + ' at The Walvis Promenade: ' + s.tagline + ' Sourced on request by Walvis Concierge.');
  M.Lift.button(l.number);

  /* ---------- the boutique ---------- */
  vp.style.perspective = M.persp() + 'px';
  M.plane(world, 'mx-marble mx-boutique-floor', { w: 2600, h: 3000, x: 0, y: 330, z: -400, rx: 90 });
  M.plane(world, 'mx-boutique-ceiling', { w: 2600, h: 3000, x: 0, y: -820, z: -400, rx: -90 });
  M.plane(world, 'mx-boutique-wall mx-boutique-back', { w: 2600, h: 1150, x: 0, y: -245, z: -1900 },
    '<span class="mx-bq-level">' + esc(M.levelLabel(l)) + '</span><span class="mx-bq-name">' + esc(s.name) + '</span><span class="mx-bq-line"></span><span class="mx-bq-tag">' + esc(s.tagline) + '</span>');
  M.plane(world, 'mx-boutique-wall mx-boutique-side', { w: 3000, h: 1150, x: -1300, y: -245, z: -400, ry: 90 });
  M.plane(world, 'mx-boutique-wall mx-boutique-side', { w: 3000, h: 1150, x: 1300, y: -245, z: -400, ry: -90 });

  // the room: a rug under the plinths, a sculpture of light above, palms in the corners, glowing niches
  M.plane(world, 'mx-rug', { w: 1900, h: 900, x: 0, y: 329, z: -1050, rx: 90 });
  M.sculpture(world, { x: 0, y: -430, z: -1250, r: 170 });
  [-1, 1].forEach(function (side) {
    M.planter(world, { x: side * 1050, y: 330, z: -1600 });
    M.planter(world, { x: side * 1100, y: 330, z: -300 });
    for (var k = 0; k < 3; k++) M.plane(world, 'mx-niche', { w: 300, h: 420, x: side * 1296, y: -120, z: -1500 + k * 520, ry: side * -90 }, '<i></i>');
  });
  M.person(world, { x: 760, y: 330, z: -700, scale: 1.45, tone: 3 });
  M.person(world, { x: -160, y: 330, z: -1450, walk: 900, dur: 22, delay: 4, scale: 1.45, tone: 1, bag: true });
  M.themeSwitch();
  M.motes(document.getElementById('mx-scene'), 18);

  // the pieces, each on a plinth in its own glass case, under its own light
  var shown = s.items.slice(0, 5), k = shown.length, spots = [];
  shown.forEach(function (it, i) {
    var x = (i - (k - 1) / 2) * (k > 3 ? 430 : 520), z = -1050 - Math.abs(i - (k - 1) / 2) * -60;
    spots.push({ x: x, z: z });
    var g = document.createElement('a');
    g.className = 'mx-plinth'; g.href = M.url.item(it); g.setAttribute('data-i', i); g.setAttribute('tabindex', '-1'); g.setAttribute('aria-hidden', 'true');
    g.style.transform = 'translate3d(' + x + 'px,0,' + z + 'px)';
    world.appendChild(g);
    M.plane(g, 'mx-spot', { w: 520, h: 900, x: 0, y: -260, z: -10 });
    M.plane(g, 'mx-plinth-base', { w: 280, h: 300, x: 0, y: 180, z: 140 });
    M.plane(g, 'mx-plinth-base mx-plinth-side', { w: 280, h: 300, x: -140, y: 180, z: 0, ry: 90 });
    M.plane(g, 'mx-plinth-base mx-plinth-side', { w: 280, h: 300, x: 140, y: 180, z: 0, ry: -90 });
    M.plane(g, 'mx-plinth-top', { w: 280, h: 280, x: 0, y: 30, z: 0, rx: 90 });
    M.plane(g, 'mx-piece', { w: 210, h: 210, x: 0, y: -100, z: 0 }, M.photo(it.image, it.title));
    M.plane(g, 'mx-case', { w: 280, h: 320, x: 0, y: -130, z: 140 });
    M.plane(g, 'mx-case mx-case-side', { w: 280, h: 320, x: -140, y: -130, z: 0, ry: 90 });
    M.plane(g, 'mx-case mx-case-side', { w: 280, h: 320, x: 140, y: -130, z: 0, ry: -90 });
    M.plane(g, 'mx-plinth-label', { w: 300, h: 70, x: 0, y: 260, z: 142 }, '<b>' + esc(it.title) + '</b>');
  });

  /* ---------- on screen ---------- */
  hud.innerHTML = '<div class="mx-hud-top">' + M.crumbs([['Lobby', M.url.lobby()], [M.levelLabel(l), M.url.level(l)], [s.name, '']]) +
    '<h1 tabindex="-1" class="mx-shop-title">' + esc(s.name) + '</h1><p>' + esc(s.tagline) + '</p></div>' +
    '<a class="mx-scroll-cue" href="retail/shop.html?shop=' + s.id + '#listing" data-jump><span>' + s.items.length + ' pieces · see them all</span><i aria-hidden="true"></i></a>';

  var cam = new M.Camera(world, M.persp());
  var REST = { x: 0, y: -20, z: 260, pitch: 1, yaw: 0 };
  addEventListener('resize', function () { var p = M.persp(); cam.P = p; vp.style.perspective = p + 'px'; cam.apply(); });
  cam.follow(vp, [5, 2.5]);

  function walkTo(i) {
    var it = shown[i], sp = spots[i];
    hud.classList.add('away');
    cam._tx = 0; cam._ty = 0;
    cam.to({ x: sp.x * .96, y: -90, z: sp.z + 520, pitch: -2, yaw: 0 }, 1500, M.ease.inOut)
      .then(function () { M.go(M.url.item(it, 'case'), 320); });
  }
  vp.addEventListener('click', function (e) { var g = e.target.closest('.mx-plinth'); if (!g) return; e.preventDefault(); walkTo(+g.getAttribute('data-i')); });

  /* ---------- the full listing ---------- */
  below.innerHTML = '<div class="wrap" id="listing">' +
    '<header class="mx-below-head"><span class="mx-pill">' + esc(M.levelLabel(l)) + '</span><h2>' + esc(s.name) + ', <em>on display.</em></h2></header>' +
    M.templateNote(s.items) +
    '<div class="mx-cards">' + s.items.map(function (it) {
      return '<article class="mx-card"><a class="mx-card-ph" href="' + M.url.item(it) + '" data-walk tabindex="-1" aria-hidden="true">' + M.photo(it.image, it.title) + '</a>' +
        '<div class="mx-card-body"><span class="mx-maker">' + esc(it.maker) + '</span><h3><a href="' + M.url.item(it) + '" data-walk>' + esc(it.title) + '</a></h3><p>' + esc(it.summary) + '</p>' +
        '<div class="mx-card-meta">' + M.badge(it.availability) + '<span class="mx-pricebox">' + M.priceHTML(it) + '</span></div>' +
        '<div class="mx-card-act"><a class="btn btn-line mx-btn-sm" href="' + M.url.item(it) + '" data-walk>View</a><a class="btn btn-teal mx-btn-sm" ' + M.waAttrs(M.itemMsg(it)) + '><svg class="i" aria-hidden="true"><use href="#i-chat"/></svg> Enquire</a></div></div></article>';
    }).join('') + '</div>' +
    '<aside class="mx-ask"><p>Looking for something not on display? <em>We source the rarest pieces on request.</em></p><a class="btn btn-teal" ' + M.waAttrs('Hello Walvis, I am looking for something from ' + s.name + ', ' + l.name + ' at The Walvis Promenade that is not on display.') + '><svg class="i" aria-hidden="true"><use href="#i-chat"/></svg> Ask the concierge</a></aside>' +
    '<nav class="mx-other-floors" aria-label="More on this floor"><span>Also on ' + esc(l.name) + '</span>' + l.shops.filter(function (x) { return x !== s; }).map(function (x) { return '<a href="' + M.url.shop(x) + '" data-walk>' + esc(x.name) + '</a>'; }).join('') + '</nav>' +
    M.sourcing() + '<p class="mx-credit">Photos show the kind of piece described and come from Wikimedia Commons. <a href="retail/credits.html">Photo credits</a>.</p></div>';
  hud.querySelector('[data-jump]').addEventListener('click', function (e) { e.preventDefault(); document.getElementById('listing').scrollIntoView({ behavior: M.reduce ? 'auto' : 'smooth' }); });
  M.onLink(function (a) { M.go(a.getAttribute('href')); });

  /* ---------- arriving: through the shop's glass doors ---------- */
  if (M.via === 'door' && !M.reduce) {
    var d = document.createElement('div'); d.className = 'mx-shopdoors'; d.setAttribute('aria-hidden', 'true');
    d.innerHTML = '<i class="l"></i><i class="r"></i><span>' + esc(s.name) + '</span>';
    vp.appendChild(d);
    requestAnimationFrame(function () { requestAnimationFrame(function () { d.classList.add('open'); }); });
    setTimeout(function () { d.remove(); }, 2200);
    cam.set({ x: 0, y: -20, z: 1300, pitch: 0 });
  } else cam.set({ x: 0, y: -20, z: 900, pitch: 0 });
  cam.to(REST, 2300, M.ease.out).then(function () { var h = hud.querySelector('h1'); if (h) h.focus({ preventScroll: true }); });

  function notFound() {
    M.setMeta('Not found · The Walvis Promenade | Walvis Concierge');
    document.getElementById('mx-scene').remove();
    below.innerHTML = '<div class="wrap mx-404"><span class="mx-pill">The Walvis Promenade</span><h1>We could not find <em>that one.</em></h1><p>It may have moved to another floor. The lobby has every floor in its directory.</p>' +
      '<p class="mx-404-act"><a class="btn btn-teal" href="retail/index.html">Back to the lobby</a></p></div>';
    M.Lift.button(0);
  }
})();
