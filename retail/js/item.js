/* =========================================================
   WALVIS CONCIERGE · retail/js/item.js
   One piece (retail/item.html?item=…): it stands alone in a lit glass vitrine, and you walk
   slowly around it. Below are its photos, its details and the WhatsApp enquiry.
   ========================================================= */
(function () {
  'use strict';
  var M = window.Mall; if (!M) return;
  var esc = M.esc;
  var it = M.item(M.param('item') || '');
  var vp = document.getElementById('mx-vp'), world = document.getElementById('mx-world'), below = document.getElementById('mx-below');
  if (!it) { notFound(); return; }
  var s = it.shop, l = it.level;
  M.setMeta(it.title + ' · ' + s.name + ' · The Walvis Promenade | Walvis Concierge', it.title + (it.maker ? ' (' + it.maker + ')' : '') + ': ' + it.summary + ' Sourced on request by Walvis Concierge.');
  M.Lift.button(l.number);

  /* ---------- the vitrine ---------- */
  vp.style.perspective = M.persp() + 'px';
  M.plane(world, 'mx-marble mx-vitrine-floor', { w: 3000, h: 3000, x: 0, y: 330, z: -600, rx: 90 });
  M.plane(world, 'mx-vitrine-wall', { w: 3000, h: 1000, x: 0, y: -170, z: -1700 }, '<span>' + esc(s.name) + '</span>');
  var g = document.createElement('div'); g.className = 'mx-plinth mx-plinth-hero'; g.style.transform = 'translate3d(0,0,-700px)'; world.appendChild(g);
  M.plane(g, 'mx-spot mx-spot-hero', { w: 760, h: 1100, x: 0, y: -330, z: -20 });
  M.plane(g, 'mx-plinth-base', { w: 380, h: 300, x: 0, y: 180, z: 190 });
  M.plane(g, 'mx-plinth-base mx-plinth-side', { w: 380, h: 300, x: -190, y: 180, z: 0, ry: 90 });
  M.plane(g, 'mx-plinth-base mx-plinth-side', { w: 380, h: 300, x: 190, y: 180, z: 0, ry: -90 });
  M.plane(g, 'mx-plinth-top', { w: 380, h: 380, x: 0, y: 30, z: 0, rx: 90 });
  M.plane(g, 'mx-piece mx-piece-hero', { w: 300, h: 300, x: 0, y: -150, z: 0 }, M.photo(it.image, it.title, true));
  M.plane(g, 'mx-case', { w: 380, h: 440, x: 0, y: -190, z: 190 });
  M.plane(g, 'mx-case mx-case-side', { w: 380, h: 440, x: -190, y: -190, z: 0, ry: 90 });
  M.plane(g, 'mx-case mx-case-side', { w: 380, h: 440, x: 190, y: -190, z: 0, ry: -90 });
  M.plane(g, 'mx-case mx-case-back', { w: 380, h: 440, x: 0, y: -190, z: -190 });
  M.plane(g, 'mx-case-lid', { w: 380, h: 380, x: 0, y: -410, z: 0, rx: 90 });

  M.sculpture(world, { x: 0, y: -640, z: -700, r: 200 });
  M.planter(world, { x: -1000, y: 330, z: -1300 }); M.planter(world, { x: 1000, y: 330, z: -1300 });
  M.themeSwitch();
  M.motes(document.getElementById('mx-scene'), 22);
  var cam = new M.Camera(world, M.persp());
  var REST = { x: 0, y: -100, z: 420, pitch: -3, yaw: 0 };
  addEventListener('resize', function () { var p = M.persp(); cam.P = p; vp.style.perspective = p + 'px'; cam.apply(); });

  /* ---------- the details ---------- */
  var pics = [it.image].concat(it.gallery || []).filter(Boolean);
  var specs = it.specs || {};
  var facts = [['Level', '<a href="' + M.url.level(l) + '" data-walk>' + esc(M.levelLabel(l)) + '</a>'], ['Shop', '<a href="' + M.url.shop(s) + '" data-walk>' + esc(s.name) + '</a>'],
    ['Lead time', esc(it.leadTime || 'On request')], ['Availability', M.badge(it.availability)]];
  Object.keys(specs).forEach(function (k) { if (String(specs[k]).trim()) facts.push([esc(k), esc(specs[k])]); });
  var hl = (it.highlights || []).filter(function (h) { return String(h).trim(); });
  var more = s.items.filter(function (x) { return x !== it; }).slice(0, 3);
  below.innerHTML = '<div class="wrap"><div class="mx-vitrine">' +
    '<div class="mx-v-media"><div class="mx-v-main">' + M.photo(pics[0] || '', it.title, true) + '</div>' +
      (pics.length > 1 ? '<div class="mx-thumbs" role="group" aria-label="More photos">' + pics.map(function (src, i) {
        return '<button type="button" class="mx-thumb" data-src="' + esc(src) + '" aria-label="Photo ' + (i + 1) + ' of ' + pics.length + '" aria-pressed="' + (i === 0) + '"><img src="' + esc(src) + '" alt="" loading="lazy" referrerpolicy="no-referrer"></button>';
      }).join('') + '</div>' : '') + M.credit(it) + '</div>' +
    '<div class="mx-v-info">' + M.crumbs([['Lobby', M.url.lobby()], [M.levelLabel(l), M.url.level(l)], [s.name, M.url.shop(s)], [it.title, '']]) +
      '<span class="mx-maker">' + esc(it.maker) + '</span><h1 tabindex="-1">' + esc(it.title) + '</h1><p class="mx-v-sum">' + esc(it.summary) + '</p>' +
      '<div class="mx-v-price">' + M.priceHTML(it) + '</div>' + M.templateNote([it]) +
      '<dl class="mx-facts">' + facts.map(function (f) { return '<div><dt>' + f[0] + '</dt><dd>' + f[1] + '</dd></div>'; }).join('') + '</dl>' +
      (hl.length ? '<ul class="checks mx-hl">' + hl.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul>' : '') +
      '<div class="mx-v-act"><a class="btn btn-teal" ' + M.waAttrs(M.itemMsg(it)) + '><svg class="i" aria-hidden="true"><use href="#i-chat"/></svg> Enquire on WhatsApp</a>' +
      '<a class="btn btn-line" href="' + M.url.shop(s) + '" data-walk>Back to ' + esc(s.name) + '</a></div>' + M.sourcing() + '</div></div>' +
    (more.length ? '<section class="mx-more" aria-labelledby="mx-more-h"><h2 id="mx-more-h">More from <em>' + esc(s.name) + '</em></h2><div class="mx-cards">' + more.map(function (x) {
      return '<article class="mx-card"><a class="mx-card-ph" href="' + M.url.item(x) + '" data-walk tabindex="-1" aria-hidden="true">' + M.photo(x.image, x.title) + '</a><div class="mx-card-body"><span class="mx-maker">' + esc(x.maker) + '</span>' +
        '<h3><a href="' + M.url.item(x) + '" data-walk>' + esc(x.title) + '</a></h3><p>' + esc(x.summary) + '</p><div class="mx-card-meta">' + M.badge(x.availability) + '<span class="mx-pricebox">' + M.priceHTML(x) + '</span></div>' +
        '<div class="mx-card-act"><a class="btn btn-line mx-btn-sm" href="' + M.url.item(x) + '" data-walk>View</a><a class="btn btn-teal mx-btn-sm" ' + M.waAttrs(M.itemMsg(x)) + '><svg class="i" aria-hidden="true"><use href="#i-chat"/></svg> Enquire</a></div></div></article>';
    }).join('') + '</div></section>' : '') + '</div>';
  var main = below.querySelector('.mx-v-main img');
  below.querySelectorAll('.mx-thumb').forEach(function (b) {
    b.addEventListener('click', function () {
      if (main) main.src = b.getAttribute('data-src');
      below.querySelectorAll('.mx-thumb').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    });
  });
  M.onLink(function (a) { M.go(a.getAttribute('href')); });

  /* ---------- arriving, then walking slowly round the case ---------- */
  cam.set(M.via === 'case' ? { x: 0, y: -60, z: 1300, pitch: -1 } : { x: 0, y: -60, z: 1000, pitch: -1 });
  cam.to(REST, 2400, M.ease.out).then(function () {
    var h = below.querySelector('h1'); if (h && M.via) h.focus({ preventScroll: true });
    if (M.reduce) return;
    var t0 = performance.now();
    (function orbit(t) {
      var a = (t - t0) / 1000 * .22;               // a slow walk round the vitrine
      var ang = Math.sin(a) * 26 * Math.PI / 180, r = 1120;
      cam.x = Math.sin(ang) * r; cam.z = -700 + Math.cos(ang) * r; cam.yaw = -Math.sin(a) * 26;
      cam.apply();
      requestAnimationFrame(orbit);
    })(t0);
  });

  function notFound() {
    M.setMeta('Not found · The Walvis Promenade | Walvis Concierge');
    document.getElementById('mx-scene').remove();
    below.innerHTML = '<div class="wrap mx-404"><span class="mx-pill">The Walvis Promenade</span><h1>We could not find <em>that one.</em></h1><p>It may have found a new home. The lobby has every floor in its directory.</p>' +
      '<p class="mx-404-act"><a class="btn btn-teal" href="retail/index.html">Back to the lobby</a></p></div>';
    M.Lift.button(0);
  }
})();
