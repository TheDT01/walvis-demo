/* =========================================================
   WALVIS CONCIERGE · retail/js/home.js
   The collection (retail/index.html): a few great photographs, the promise, the six salons,
   the season's rarities, Bangladesh at its finest, the full index, how we work and the private request.
   ========================================================= */
(function () {
  'use strict';
  var M = window.Mall; if (!M) return;
  var esc = M.esc, P = M.P, cur = P.curation || {}, main = document.getElementById('rx-main');
  M.setMeta('Retail · The Walvis Promenade | Walvis Concierge', 'The Walvis Promenade: ' + M.all.length + ' rare pieces in six salons, from private jets and supercars to jamdani, Mughal gold and Stradivari, sourced privately by Walvis Concierge.');

  var hero = M.pick(cur.hero).length ? M.pick(cur.hero) : M.all.slice(0, 4);
  var picks = M.pick(cur.picks), heritage = M.pick(cur.heritage);

  main.innerHTML =
    /* the opening: one great photograph at a time */
    '<section class="rx-hero" aria-label="The Walvis Promenade"><div class="rx-hero-ph">' + hero.map(function (i, n) {
      return '<figure class="rx-slide' + (n ? '' : ' on') + '" data-n="' + n + '">' + M.photo(i.image, '', 1920, !n) + '</figure>';
    }).join('') + '</div>' +
    '<div class="rx-hero-txt rx-wrap"><span class="rx-kicker">The Walvis Promenade · Private collection</span>' +
    '<h1 tabindex="-1">Rare things, <em>found for you.</em></h1>' +
    '<p class="rx-lead">' + M.all.length + ' pieces in six salons, from a Bombardier Global 7500 to a jamdani woven on the banks of the Shitalakshya. Each one sourced privately, inspected before you commit, and delivered to your door in Bangladesh.</p>' +
    '<div class="rx-hero-act"><a class="btn btn-teal" href="retail/index.html#salons" data-jump>Explore the six salons</a><a class="rx-textlink" ' + M.waAttrs('Hello Walvis, I would like to speak to a concierge about The Walvis Promenade.') + '>' + M.chat + ' Speak to a concierge</a></div></div>' +
    '<div class="rx-hero-now rx-wrap"><a class="rx-now" href="#"><span class="rx-kicker">Now showing</span><span class="rx-now-t"></span></a>' +
    '<div class="rx-dots" role="group" aria-label="Photographs">' + hero.map(function (i, n) { return '<button type="button" aria-label="Show ' + esc(i.title) + '"' + (n ? '' : ' aria-current="true"') + ' data-n="' + n + '"></button>'; }).join('') + '</div></div></section>' +

    /* the promise */
    '<section class="rx-promise rx-wrap rx-reveal" aria-label="Our promise"><ul>' +
    [['Sourced privately', 'Through a trusted network of owners, houses and specialists, never from a public listing alone.'],
     ['Inspected first', 'Independent inspection, papers and provenance checked before anything is bought.'],
     ['Delivered to your door', 'Shipping, import duties, registration and delivery in Bangladesh, quoted in taka, all handled.'],
     ['Discreet, always', 'Your name and your purchases are never shared. Viewings are private, by appointment.']].map(function (p) {
      return '<li><b>' + p[0] + '</b><span>' + p[1] + '</span></li>';
    }).join('') + '</ul></section>' +

    /* the six salons */
    '<section class="rx-salons rx-wrap" id="salons" aria-labelledby="rx-sal-h"><header class="rx-head rx-reveal"><span class="rx-kicker">Six salons</span><h2 id="rx-sal-h">Where would you like <em>to begin?</em></h2></header>' +
    '<div class="rx-salon-grid">' + P.levels.map(function (l, n) {
      var c = M.cover(l);
      return '<a class="rx-salon rx-reveal" href="' + M.url.level(l) + '" style="--d:' + (n * 60) + 'ms"><span class="rx-salon-ph">' + M.photo(c.image, '', n === 0 ? 1400 : 900) + '</span>' +
        '<span class="rx-salon-txt"><span class="rx-salon-no">Salon ' + M.roman(l.number) + '</span><span class="rx-salon-name">' + esc(l.name) + '</span>' +
        '<span class="rx-salon-rooms">' + l.shops.map(function (s) { return esc(s.name); }).join(' · ') + '</span>' +
        '<span class="rx-salon-n">' + l.items.length + ' pieces ' + M.arrow + '</span></span></a>';
    }).join('') + '</div></section>' +

    /* the season's rarities */
    (picks.length ? '<section class="rx-picks" aria-labelledby="rx-picks-h"><div class="rx-wrap"><header class="rx-head rx-head-row rx-reveal"><div><span class="rx-kicker">This season</span><h2 id="rx-picks-h">Rarities, <em>chosen by our concierges.</em></h2></div>' +
      '<div class="rx-rail-nav"><button type="button" data-rail="-1" aria-label="Previous">‹</button><button type="button" data-rail="1" aria-label="Next">›</button></div></header></div>' +
      '<div class="rx-rail" tabindex="0" aria-label="Rarities of the season">' + picks.map(function (i) { return M.card(i, { cls: 'rx-card-tall', w: 900 }); }).join('') + '</div></section>' : '') +

    /* Bangladesh, at its finest */
    (heritage.length ? '<section class="rx-heritage rx-wrap" aria-labelledby="rx-her-h"><div class="rx-her-ph rx-reveal">' + M.photo(heritage[0].image, heritage[0].title, 1400) + '</div>' +
      '<div class="rx-her-txt rx-reveal"><span class="rx-kicker">Only at Walvis</span><h2 id="rx-her-h">Bangladesh, <em>at its finest.</em></h2>' +
      '<p class="rx-lead">The world\'s great houses sit beside the masters of our own country: jamdani from the banks of the Shitalakshya, nakshi kantha stitched over months, the art of Zainul Abedin, the silver of the Bengal Sultans. Commissioned from the people who keep these crafts alive, and sourced with provenance.</p>' +
      '<ol class="rx-her-list">' + heritage.map(function (i) {
        return '<li><a href="' + M.url.item(i) + '"><span class="rx-lot">' + M.lot(i) + '</span><span class="rx-her-t">' + esc(i.title) + '</span><span class="rx-her-n">' + esc(i.note) + '</span>' + M.arrow + '</a></li>';
      }).join('') + '</ol></div></section>' : '') +

    /* the full index */
    '<section class="rx-index rx-wrap" id="index" aria-labelledby="rx-idx-h"><header class="rx-head rx-reveal"><span class="rx-kicker">The index</span><h2 id="rx-idx-h">Every piece, <em>at a glance.</em></h2></header>' +
    '<div class="rx-filters" role="group" aria-label="Show a salon"><button type="button" aria-pressed="true" data-f="">All ' + M.all.length + '</button>' +
    P.levels.map(function (l) { return '<button type="button" aria-pressed="false" data-f="' + l.id + '">' + esc(l.name) + '</button>'; }).join('') + '</div>' +
    '<ol class="rx-idx-list">' + M.all.map(function (i) {
      return '<li data-l="' + i.level.id + '"><a href="' + M.url.item(i) + '"><span class="rx-lot">' + M.lot(i) + '</span><span class="rx-idx-ph">' + M.photo(i.image, '', 160) + '</span>' +
        '<span class="rx-idx-t"><b>' + esc(i.title) + '</b><small>' + esc(i.maker) + '</small></span><span class="rx-idx-s">' + esc(i.shop.name) + '</span>' +
        '<span class="rx-idx-a">' + esc(i.availability) + '</span>' + M.arrow + '</a></li>';
    }).join('') + '</ol><p class="rx-more-btn"><button type="button" class="rx-textlink" data-more>Show all ' + M.all.length + ' pieces</button></p></section>' +

    /* how we work */
    '<section class="rx-how rx-wrap rx-reveal" aria-labelledby="rx-how-h"><header class="rx-head"><span class="rx-kicker">How it works</span><h2 id="rx-how-h">Four steps, <em>one conversation.</em></h2></header><ol>' +
    [['Ask', 'Tell us on WhatsApp what caught your eye, or what you are looking for.'],
     ['We find and verify', 'We locate the right piece, inspect it, and check its papers and provenance.'],
     ['A private viewing', 'Photographs, video or a viewing in person, with one all-in quote in taka.'],
     ['Delivered', 'Shipping, duties, registration and delivery to your door, handled for you.']].map(function (s, n) {
      return '<li><span class="rx-how-n">' + M.roman(n + 1) + '</span><b>' + s[0] + '</b><span>' + s[1] + '</span></li>';
    }).join('') + '</ol></section>' +

    M.requests() + M.footnote();

  /* ---------- the opening photographs: one at a time, slowly; they wait while you look ---------- */
  var slides = main.querySelectorAll('.rx-slide'), dots = main.querySelectorAll('.rx-dots button'), now = main.querySelector('.rx-now'), cur0 = 0, timer = null;
  function show(n) {
    cur0 = (n + hero.length) % hero.length;
    slides.forEach(function (s, k) { s.classList.toggle('on', k === cur0); });
    dots.forEach(function (d, k) { if (k === cur0) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
    var i = hero[cur0]; now.href = M.url.item(i);
    now.querySelector('.rx-now-t').innerHTML = esc(i.title) + ' <small>' + esc(M.levelLabel(i.level)) + '</small> ' + M.arrow;
  }
  function play() { if (M.reduce || hero.length < 2) return; clearInterval(timer); timer = setInterval(function () { show(cur0 + 1); }, 7000); }
  dots.forEach(function (d) { d.addEventListener('click', function () { show(+d.getAttribute('data-n')); play(); }); });
  var heroEl = main.querySelector('.rx-hero');
  heroEl.addEventListener('mouseenter', function () { clearInterval(timer); }); heroEl.addEventListener('mouseleave', play);
  document.addEventListener('visibilitychange', function () { if (document.hidden) clearInterval(timer); else play(); });
  show(0); play();

  /* ---------- the rarities rail ---------- */
  var rail = main.querySelector('.rx-rail');
  main.querySelectorAll('[data-rail]').forEach(function (b) {
    b.addEventListener('click', function () { rail.scrollBy({ left: +b.getAttribute('data-rail') * rail.clientWidth * .8, behavior: M.reduce ? 'auto' : 'smooth' }); });
  });

  /* ---------- the index: show one salon, or all ---------- */
  // the first fifteen show until you ask for all; choosing a salon shows all of its pieces
  var rows = main.querySelectorAll('.rx-idx-list li'), more = main.querySelector('[data-more]'), FIRST = 15, open = false;
  function filter(f) {
    rows.forEach(function (r, k) { r.hidden = f ? r.getAttribute('data-l') !== f : (!open && k >= FIRST); });
    more.parentNode.hidden = !!f || open;
  }
  main.querySelectorAll('.rx-filters button').forEach(function (b) {
    b.addEventListener('click', function () {
      main.querySelectorAll('.rx-filters button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      filter(b.getAttribute('data-f'));
    });
  });
  more.addEventListener('click', function () { open = true; filter(''); var r = rows[FIRST]; if (r) r.querySelector('a').focus({ preventScroll: true }); });
  filter('');

  main.querySelector('[data-jump]').addEventListener('click', function (e) { e.preventDefault(); document.getElementById('salons').scrollIntoView({ behavior: M.reduce ? 'auto' : 'smooth' }); });
  M.themeSwitch();
  M.reveal();
})();
