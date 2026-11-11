/* =========================================================
   WALVIS CONCIERGE · retail/js/piece.js
   One piece (retail/item.html?item=…), laid out like a private sale: the photograph (it opens
   the viewing room), its number, maker and title, why it is special, the details, what we do,
   the photograph's provenance, and the private viewing on WhatsApp. Then more from its salon.
   ========================================================= */
(function () {
  'use strict';
  var M = window.Mall; if (!M) return;
  var esc = M.esc, main = document.getElementById('rx-main');
  var it = M.item(M.param('item') || '');
  if (!it) { notFound(); return; }
  var s = it.shop, l = it.level, all = M.all, at = all.indexOf(it);
  var prev = all[(at - 1 + all.length) % all.length], next = all[(at + 1) % all.length];
  M.setMeta(it.title + ' · ' + s.name + ' · The Walvis Promenade | Walvis Concierge', it.title + (it.maker ? ' (' + it.maker + ')' : '') + ': ' + it.note + ' ' + it.summary + ' Sourced privately by Walvis Concierge.');

  var specs = it.specs || {}, facts = [];
  Object.keys(specs).forEach(function (k) { if (String(specs[k]).trim()) facts.push([k, specs[k]]); });
  var hl = (it.highlights || []).filter(function (h) { return String(h).trim(); });
  var more = l.items.filter(function (x) { return x !== it; }).slice(0, 4);

  main.innerHTML =
    '<article class="rx-piece rx-wrap">' +
    '<div class="rx-piece-media"><button type="button" class="rx-piece-ph" aria-label="Open the viewing room: ' + esc(it.title) + '">' + M.photo(it.image, it.title, 1600, true) +
      '<span class="rx-piece-zoom">' + 'Open the viewing room' + '</span></button>' + M.credit(it) + '</div>' +
    '<div class="rx-piece-info">' + M.crumbs([['Retail', M.url.home()], [M.levelLabel(l), M.url.level(l)], [s.name, M.url.shop(s)], [it.title, '']]) +
      '<span class="rx-card-meta"><span class="rx-lot">' + M.lot(it) + '</span><span class="rx-maker">' + esc(it.maker) + '</span></span>' +
      '<h1 tabindex="-1">' + esc(it.title) + '</h1>' + (M.noteOf(it) ? '<p class="rx-note">' + esc(it.note) + '</p>' : '') + '<p class="rx-piece-sum">' + esc(it.summary) + '</p>' +
      '<div class="rx-piece-price">' + M.priceHTML(it) + '<span class="rx-piece-avail">' + M.badge(it.availability) + '<span>' + esc(it.leadTime || 'On request') + '</span></span></div>' +
      '<div class="rx-piece-act"><a class="btn btn-teal" ' + M.waAttrs(M.itemMsg(it)) + '>' + M.chat + ' Arrange a private viewing</a>' +
      '<button type="button" class="rx-textlink rx-share">Share this piece</button></div>' +
      (facts.length ? '<section class="rx-piece-sec"><h2>The details</h2><dl class="rx-facts">' + facts.map(function (f) { return '<div><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('') + '</dl></section>' : '') +
      (hl.length ? '<section class="rx-piece-sec"><h2>What we do</h2><ul class="rx-checks">' + hl.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul></section>' : '') +
      '<section class="rx-piece-sec"><h2>Where it lives</h2><p class="rx-where"><a href="' + M.url.level(l) + '">' + esc(M.levelLabel(l)) + '</a> · <a href="' + M.url.shop(s) + '">' + esc(s.name) + '</a></p></section>' +
      M.sourcing() + '</div></article>' +

    '<nav class="rx-steps rx-wrap" aria-label="More pieces"><a href="' + M.url.item(prev) + '" rel="prev"><span>Previous · ' + M.lot(prev) + '</span><b>' + esc(prev.title) + '</b></a>' +
    '<a href="' + M.url.item(next) + '" rel="next"><span>Next · ' + M.lot(next) + '</span><b>' + esc(next.title) + '</b></a></nav>' +

    (more.length ? '<section class="rx-more rx-wrap" aria-labelledby="rx-more-h"><header class="rx-head rx-head-row rx-reveal"><div><span class="rx-kicker">' + esc(M.levelLabel(l)) + '</span><h2 id="rx-more-h">More from <em>' + esc(l.name) + '.</em></h2></div>' +
      '<a class="rx-textlink" href="' + M.url.level(l) + '">The whole salon ' + M.arrow + '</a></header><div class="rx-more-grid">' + more.map(function (x) { return M.card(x, { w: 700 }); }).join('') + '</div></section>' : '') +
    M.requests() + M.footnote();

  // the viewing room moves through this piece's salon
  main.querySelector('.rx-piece-ph').addEventListener('click', function () { M.viewing(l.items, it); });
  // share: the phone's own sheet where there is one, otherwise the link is copied
  var share = main.querySelector('.rx-share');
  share.addEventListener('click', function () {
    var data = { title: it.title + ' · The Walvis Promenade', url: location.href };
    if (navigator.share) { navigator.share(data).catch(function () {}); return; }
    (navigator.clipboard ? navigator.clipboard.writeText(location.href) : Promise.reject()).then(function () { share.textContent = 'Link copied'; }, function () { share.textContent = 'Copy the address from your browser'; });
    setTimeout(function () { share.textContent = 'Share this piece'; }, 2400);
  });
  // ← and → step through the collection
  addEventListener('keydown', function (e) {
    if (document.querySelector('.rx-view') || /input|textarea/i.test(e.target.tagName)) return;
    if (e.key === 'ArrowRight') location.href = new URL(M.url.item(next), document.baseURI).href;
    else if (e.key === 'ArrowLeft') location.href = new URL(M.url.item(prev), document.baseURI).href;
  });

  M.themeSwitch();
  M.reveal();

  function notFound() {
    M.setMeta('Not found · The Walvis Promenade | Walvis Concierge');
    main.innerHTML = '<section class="rx-404 rx-wrap"><span class="rx-kicker">The Walvis Promenade</span><h1>We could not find <em>that piece.</em></h1><p class="rx-lead">It may have found a new home. Every piece we can source is in the collection, and we can look for anything else.</p>' +
      '<p><a class="btn btn-teal" href="retail/index.html">Back to the collection</a></p></section>';
  }
})();
