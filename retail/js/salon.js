/* =========================================================
   WALVIS CONCIERGE · retail/js/salon.js
   A salon (retail/level.html?level=…): its photograph and story, then its rooms in turn.
   In each room the first piece is shown large and the others beside it; a bar of room
   names stays at hand as you scroll. Old shop links (retail/shop.html?shop=…) land on their room here.
   ========================================================= */
(function () {
  'use strict';
  var M = window.Mall; if (!M) return;
  var esc = M.esc, main = document.getElementById('rx-main');
  var l = M.level(M.param('level') || '');
  if (!l) { notFound(); return; }
  var cover = M.cover(l);
  M.setMeta(M.levelLabel(l) + ' · The Walvis Promenade | Walvis Concierge', l.name + ' at The Walvis Promenade: ' + l.tagline + ' ' + l.intro);

  main.innerHTML =
    '<header class="rx-salon-hero"><div class="rx-salon-hero-ph">' + M.photo(cover.image, '', 1920, true) + '</div>' +
    '<div class="rx-wrap rx-salon-hero-txt">' + M.crumbs([['Retail', M.url.home()], [M.levelLabel(l), '']]) +
    '<span class="rx-kicker">Salon ' + M.roman(l.number) + ' · ' + l.items.length + ' pieces</span><h1 tabindex="-1">' + esc(l.name) + '</h1>' +
    '<p class="rx-lead">' + esc(l.intro) + '</p></div>' +
    '<a class="rx-cover-cap" href="' + M.url.item(cover) + '">' + M.lot(cover) + ' · ' + esc(cover.title) + ' ' + M.arrow + '</a></header>' +

    '<nav class="rx-rooms-nav" aria-label="Rooms in this salon"><div class="rx-wrap"><span class="rx-rooms-lbl">' + esc(l.name) + '</span><ul>' + l.shops.map(function (s) {
      return '<li><a href="' + M.url.shop(s) + '" data-room="' + s.id + '">' + esc(s.name) + '</a></li>';
    }).join('') + '</ul></div></nav>' +

    l.shops.map(function (s, n) {
      var first = s.items[0], rest = s.items.slice(1);
      return '<section class="rx-room' + (n % 2 ? ' rx-room-flip' : '') + '" id="room-' + s.id + '" aria-labelledby="h-' + s.id + '"><div class="rx-wrap">' +
        '<header class="rx-room-head rx-reveal"><span class="rx-kicker">' + esc(M.roman(n + 1)) + ' · ' + esc(l.name) + '</span><h2 id="h-' + s.id + '">' + esc(s.name) + '</h2><p>' + esc(s.tagline) + '</p></header>' +
        '<article class="rx-feature rx-reveal"><a class="rx-feature-ph" href="' + M.url.item(first) + '" tabindex="-1" aria-hidden="true">' + M.photo(first.image, first.title, 1400) + '</a>' +
        '<div class="rx-feature-txt"><span class="rx-card-meta"><span class="rx-lot">' + M.lot(first) + '</span><span class="rx-maker">' + esc(first.maker) + '</span></span>' +
        '<h3><a href="' + M.url.item(first) + '">' + esc(first.title) + '</a></h3>' + (M.noteOf(first) ? '<p class="rx-note">' + esc(first.note) + '</p>' : '') + '<p>' + esc(first.summary) + '</p>' +
        '<div class="rx-feature-foot">' + M.priceHTML(first) + M.badge(first.availability) + '</div>' +
        '<div class="rx-feature-act"><a class="btn btn-teal" href="' + M.url.item(first) + '">View the piece</a><a class="rx-textlink" ' + M.waAttrs(M.itemMsg(first)) + '>' + M.chat + ' Arrange a private viewing</a></div></div></article>' +
        (rest.length ? '<div class="rx-room-rest">' + rest.map(function (i) { return M.card(i, { w: 900 }); }).join('') + '</div>' : '') +
        '</div></section>';
    }).join('') +

    '<section class="rx-others rx-wrap" aria-labelledby="rx-oth-h"><header class="rx-head rx-reveal"><span class="rx-kicker">The other salons</span><h2 id="rx-oth-h">Continue <em>your visit.</em></h2></header>' +
    '<div class="rx-others-grid">' + M.P.levels.filter(function (x) { return x !== l; }).map(function (x) {
      return '<a class="rx-other rx-reveal" href="' + M.url.level(x) + '"><span class="rx-other-ph">' + M.photo(M.cover(x).image, '', 600) + '</span><span class="rx-salon-no">Salon ' + M.roman(x.number) + '</span><b>' + esc(x.name) + '</b></a>';
    }).join('') + '</div></section>' +
    M.requests('Looking for something in ' + esc(l.name) + ' <em>that is not here?</em>') + M.footnote();

  /* ---------- the bar of rooms: it shows which room you are in ---------- */
  var links = main.querySelectorAll('[data-room]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target.id.replace('room-', '');
        links.forEach(function (a) { if (a.getAttribute('data-room') === id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    main.querySelectorAll('.rx-room').forEach(function (r) { io.observe(r); });
  }
  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault(); var t = document.getElementById('room-' + a.getAttribute('data-room'));
      t.scrollIntoView({ behavior: M.reduce ? 'auto' : 'smooth' }); history.replaceState(null, '', '#room-' + a.getAttribute('data-room'));
    });
  });
  // arriving with a room in the address (or from an old shop link): go straight to it
  if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) setTimeout(function () { t.scrollIntoView(); }, 60); }

  M.themeSwitch();
  M.reveal();

  function notFound() {
    M.setMeta('Not found · The Walvis Promenade | Walvis Concierge');
    main.innerHTML = '<section class="rx-404 rx-wrap"><span class="rx-kicker">The Walvis Promenade</span><h1>We could not find <em>that salon.</em></h1><p class="rx-lead">It may have moved. Every salon is listed in the collection.</p>' +
      '<p><a class="btn btn-teal" href="retail/index.html">Back to the collection</a></p></section>';
  }
})();
