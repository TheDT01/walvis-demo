/* =========================================================
   WALVIS CONCIERGE · retail/js/core.js
   The Walvis Promenade, shared by every page in retail/: the collection's index, numbering,
   prices and WhatsApp links, photos and their credits, the Day/Evening switch, the gentle
   reveal on scroll and the viewing room (a piece's photograph, full screen).
   Pages: index.html (the collection), level.html?level=… (a salon), item.html?item=… (a piece).
   Every page has <base href="../">, so all paths are written from the site's main folder.
   Works with or without the host site's js/site.js (header, footer, waLink): see retail/README.md.
   ========================================================= */
(function () {
  'use strict';
  var P = window.WALVIS_PROMENADE, W = window.WALVIS || {}, C = window.WALVIS_RETAIL || {};
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var M = window.Mall = { P: P, W: W, C: C, reduce: reduce };
  var esc = M.esc = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };

  /* ---------- photos: a local copy, or the free-licence original on Wikimedia Commons ---------- */
  var COMMONS = 'https://commons.wikimedia.org/wiki/', remote = {};
  M.commonsPage = function (file) { return COMMONS + 'File:' + encodeURIComponent(file.replace(/ /g, '_')); };
  function commonsImage(file, w) { return COMMONS + 'Special:FilePath/' + encodeURIComponent(file.replace(/ /g, '_')) + '?width=' + (w || 1600); }
  function resolve(i) {
    var p = i.photo; if (!p) return;
    var far = p.file ? commonsImage(p.file) : '';
    if (p.local && far) remote[p.local] = far;
    i.image = (C.images === 'local' || !far) ? (p.local || far) : far;
  }

  /* ---------- the collection, indexed and numbered (Nº 001 to Nº 075, in catalogue order) ---------- */
  var ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  var lv = {}, sh = {}, it = {}, all = [];
  P.levels.forEach(function (l) {
    lv[l.id] = l; l.items = [];
    l.shops.forEach(function (s) {
      s.level = l; sh[s.id] = s;
      s.items.forEach(function (i) { i.shop = s; i.level = l; it[i.id] = i; all.push(i); l.items.push(i); i.no = all.length; resolve(i); });
    });
  });
  M.level = function (id) { return lv[id]; };
  M.shop = function (id) { return sh[id]; };
  M.item = function (id) { return it[id]; };
  M.all = all;
  M.pick = function (ids) { return (ids || []).map(M.item).filter(Boolean); };
  M.lot = function (i) { return 'Nº ' + ('00' + i.no).slice(-3); };
  M.roman = function (n) { return ROMAN[n] || String(n); };
  M.levelLabel = function (l) { return 'Salon ' + M.roman(l.number) + ' · ' + l.name; };
  M.cover = function (l) { return M.item(l.cover) || l.items[0]; };
  M.url = {
    home: function () { return 'retail/index.html'; },
    level: function (l) { return 'retail/level.html?level=' + l.id; },
    shop: function (s) { return 'retail/level.html?level=' + s.level.id + '#room-' + s.id; },
    item: function (i) { return 'retail/item.html?item=' + i.id; }
  };
  M.param = function (name) { return new URLSearchParams(location.search).get(name); };

  /* ---------- prices and WhatsApp ---------- */
  M.money = function (amount, note) {
    var n = Number(amount) || 0;
    if (n <= 0) return 'Price on request';
    var t;
    if (n >= 1e7) t = '৳ ' + Number((n / 1e7).toFixed(2)) + ' crore';
    else if (n >= 1e5) t = '৳ ' + Number((n / 1e5).toFixed(2)) + ' lakh';
    else t = '৳ ' + n.toLocaleString('en-IN');
    return (String(note || '').toLowerCase() === 'from' ? 'From ' : '') + t;
  };
  M.priceHTML = function (i) {
    if (!(Number(i.price) > 0)) return '<span class="rx-price rx-por">Price on request</span>';
    return '<span class="rx-price">' + esc(M.money(i.price, i.priceNote)) + '</span><span class="rx-ind">indicative</span>';
  };
  M.itemMsg = function (i) {
    var price = Number(i.price) > 0 ? M.money(i.price, i.priceNote).replace(/^From /, 'from ') : 'price on request';
    return 'Hello Walvis, I am interested in ' + i.title + ' from ' + i.shop.name + ', ' + i.level.name + ' at The Walvis Promenade. Listed at ' + price + '. Please share details.';
  };
  M.wa = function (msg) { return typeof waLink === 'function' ? waLink(msg) : 'https://wa.me/' + (C.whatsapp || '') + '?text=' + encodeURIComponent(msg); };
  M.waAttrs = function (msg) { return 'href="' + esc(M.wa(msg)) + '" target="_blank" rel="noopener"'; };
  M.SOURCING = 'Every piece is sourced on request through our trusted network. Walvis Concierge is not an authorised dealer of the brands shown. Prices are indicative, confirmed with you before anything is bought, and exclude import duties, taxes, registration and delivery, which we quote separately.';
  M.sourcing = function () { return '<p class="rx-sourcing">' + esc(M.SOURCING) + '</p>'; };
  M.chat = '<svg class="i" aria-hidden="true"><use href="#i-chat"/></svg>';
  M.arrow = '<svg class="i" aria-hidden="true"><use href="#i-arrow"/></svg>';

  /* ---------- photos and their credits ---------- */
  // w: how wide the photo is drawn, so a small card does not download and decode a large photo
  M.sized = function (src, w) { return /Special:FilePath/.test(src || '') ? src.replace(/width=\d+/, 'width=' + w) : src; };
  function frame(alt) {
    return '<span class="rx-frame" role="img" aria-label="' + esc(alt ? 'Photo to follow: ' + alt : 'Photo to follow') + '"><img src="retail/images/brand/walvis-seal-96.png" alt="" draggable="false"></span>';
  }
  M.photo = function (src, alt, w, eager) {
    if (!src) return frame(alt);
    return '<img src="' + esc(M.sized(src, w || 800)) + '" alt="' + esc(alt) + '"' + (eager ? ' fetchpriority="high"' : ' loading="lazy"') +
      ' decoding="async" draggable="false" referrerpolicy="no-referrer" onload="this.classList.add(\'in\')" onerror="Mall.photoFailed(this)">';
  };
  // a local copy that is not there yet falls back to the original; if that fails too, the empty frame
  M.photoFailed = function (img) {
    var src = img.getAttribute('src'), far = remote[src.replace(/\?.*$/, '')] || remote[src];
    if (far && far !== src) { img.src = far; return; }
    img.onerror = null; img.outerHTML = frame(img.alt);
  };
  M.credit = function (i) {
    var p = i.photo; if (!p) return '';
    var who = [p.author && !/^See /.test(p.author) ? p.author : '', p.licence && !/^See /.test(p.licence) ? p.licence : ''].filter(Boolean).join(', ');
    return '<p class="rx-credit">' + (p.shows ? esc(p.shows) + '. ' : '') + 'Photo' + (who ? ': ' + esc(who) : '') +
      (p.file ? ', via <a href="' + esc(M.commonsPage(p.file)) + '" target="_blank" rel="noopener">Wikimedia Commons</a>' : '') + '. The photograph shows the kind of piece described, not the exact piece offered.</p>';
  };

  /* ---------- small shared pieces of page ---------- */
  M.crumbs = function (parts) {
    return '<nav class="rx-crumbs" aria-label="You are here"><ol>' + parts.map(function (p, i) {
      return '<li>' + (i < parts.length - 1 ? '<a href="' + p[1] + '">' + esc(p[0]) + '</a>' : '<span aria-current="page">' + esc(p[0]) + '</span>') + '</li>';
    }).join('') + '</ol></nav>';
  };
  M.setMeta = function (title, desc) {
    document.title = title;
    var m = document.querySelector('meta[name="description"]'); if (m && desc) m.setAttribute('content', desc);
  };
  // the 'why it is special' line, unless the description already opens with it
  M.noteOf = function (i) { var n = String(i.note || '').replace(/\.$/, ''); return n && String(i.summary || '').indexOf(n) !== 0 ? i.note : ''; };
  M.badge = function (t) { return '<span class="rx-avail">' + esc(t || 'On request') + '</span>'; };
  // a piece as a card: photograph, number, maker, title, why it is special, price
  M.card = function (i, o) {
    o = o || {};
    return '<article class="rx-card' + (o.cls ? ' ' + o.cls : '') + '"><a class="rx-card-link" href="' + M.url.item(i) + '">' +
      '<span class="rx-card-ph">' + M.photo(i.image, i.title, o.w || 800) + '</span>' +
      '<span class="rx-card-meta"><span class="rx-lot">' + M.lot(i) + '</span><span class="rx-maker">' + esc(i.maker) + '</span></span>' +
      '<span class="rx-card-title">' + esc(i.title) + '</span>' +
      (o.note === false ? '' : '<span class="rx-card-note">' + esc(i.note) + '</span>') +
      '<span class="rx-card-foot">' + M.priceHTML(i) + '<span class="rx-card-go">View ' + M.arrow + '</span></span></a></article>';
  };
  // the private request: common searches, each opening WhatsApp with the words already written
  M.requests = function (title) {
    var asks = [['A specific watch reference', 'I am looking for a specific watch reference.'], ['A car, built to order', 'I would like a car built to order.'],
      ['A work by a Bangladeshi master', 'I am looking for a work by a Bangladeshi master.'], ['Something for a wedding', 'I am looking for something special for a wedding.'],
      ['A gift that cannot be bought in a shop', 'I am looking for a gift that cannot be bought in a shop.'], ['Something else entirely', 'I am looking for something not listed in The Walvis Promenade.']];
    return '<section class="rx-request rx-reveal" aria-labelledby="rx-req-h"><div class="rx-wrap"><span class="rx-kicker">The private request</span>' +
      '<h2 id="rx-req-h">' + (title || 'Not on display? <em>Tell us what you are looking for.</em>') + '</h2>' +
      '<p class="rx-lead">Most of what we find for our clients is never listed anywhere. Choose a starting point and a concierge will reply on WhatsApp.</p>' +
      '<div class="rx-asks">' + asks.map(function (a) { return '<a class="rx-ask" ' + M.waAttrs('Hello Walvis. ' + a[1] + ' Could you help?') + '>' + M.chat + '<span>' + esc(a[0]) + '</span></a>'; }).join('') + '</div></div></section>';
  };
  M.footnote = function () {
    return '<div class="rx-wrap rx-foot">' + M.sourcing() + '<p class="rx-credit">Photographs are free-licence files from Wikimedia Commons. <a href="retail/credits.html">See every photo credit</a>.</p></div>';
  };

  /* ---------- Day and Evening ---------- */
  var THEME = 'walvis-mall-theme', html = document.documentElement;
  M.light = function () { return html.classList.contains('rx-light'); };
  M.themeSwitch = function (host) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'rx-theme';
    function label() {
      var day = M.light();
      b.setAttribute('aria-pressed', String(day));
      b.setAttribute('aria-label', day ? 'Switch to evening' : 'Switch to daylight');
      b.innerHTML = '<span class="rx-theme-track" aria-hidden="true"><i></i></span><span class="rx-theme-txt">' + (day ? 'Daylight' : 'Evening') + '</span>';
    }
    b.addEventListener('click', function () {
      html.classList.add('rx-themeing'); html.classList.toggle('rx-light');
      try { localStorage.setItem(THEME, M.light() ? 'light' : 'dark'); } catch (e) {}
      label(); setTimeout(function () { html.classList.remove('rx-themeing'); }, 700);
    });
    label(); (host || document.body).appendChild(b); return b;
  };

  /* ---------- a gentle reveal as things scroll into view ---------- */
  M.reveal = function (root) {
    var els = (root || document).querySelectorAll('.rx-reveal:not(.on)');
    if (reduce || !('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('on'); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  };

  /* ---------- the viewing room: a piece's photograph, full screen; ← → move through a list ---------- */
  M.viewing = function (list, start) {
    var idx = Math.max(0, list.indexOf(start)), last = document.activeElement;
    var box = document.createElement('div');
    box.className = 'rx-view'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Viewing room');
    box.innerHTML = '<div class="rx-view-stage"></div><div class="rx-view-bar"><div class="rx-view-cap"></div>' +
      '<div class="rx-view-act"><button type="button" class="rx-view-btn" data-go="-1" aria-label="Previous piece">‹</button><button type="button" class="rx-view-btn" data-go="1" aria-label="Next piece">›</button>' +
      '<button type="button" class="rx-view-btn rx-view-close" aria-label="Close the viewing room">✕</button></div></div>';
    document.body.appendChild(box); document.body.classList.add('no-scroll');
    var stage = box.querySelector('.rx-view-stage'), cap = box.querySelector('.rx-view-cap');
    function show() {
      var i = list[idx];
      stage.innerHTML = i.image ? '<img src="' + esc(M.sized(i.image, 2000)) + '" alt="' + esc(i.title) + '" referrerpolicy="no-referrer" onerror="Mall.photoFailed(this)">' : frame(i.title);
      stage.classList.remove('zoom');
      cap.innerHTML = '<span class="rx-lot">' + M.lot(i) + '</span><b>' + esc(i.title) + '</b><span>' + esc(i.maker) + '</span>' +
        '<a class="rx-view-enq" ' + M.waAttrs(M.itemMsg(i)) + '>' + M.chat + ' Arrange a private viewing</a>' + (list.length > 1 ? '<span class="rx-view-n">' + (idx + 1) + ' / ' + list.length + '</span>' : '');
      box.querySelectorAll('[data-go]').forEach(function (b) { b.hidden = list.length < 2; });
    }
    function go(d) { idx = (idx + d + list.length) % list.length; show(); }
    function close() { removeEventListener('keydown', key); box.remove(); document.body.classList.remove('no-scroll'); if (last && last.focus) last.focus(); }
    function key(e) {
      if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight') go(1); else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Tab') {   // keep focus inside the room
        var f = [].slice.call(box.querySelectorAll('button:not([hidden]), a[href]')), a = f.indexOf(document.activeElement);
        e.preventDefault(); f[(a + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    }
    // a click on the photograph looks closer, where you clicked; a second click steps back
    stage.addEventListener('click', function (e) {
      var img = stage.querySelector('img'); if (!img) return;
      if (stage.classList.toggle('zoom')) { var r = img.getBoundingClientRect(); img.style.transformOrigin = ((e.clientX - r.left) / r.width * 100) + '% ' + ((e.clientY - r.top) / r.height * 100) + '%'; }
    });
    box.querySelectorAll('[data-go]').forEach(function (b) { b.addEventListener('click', function () { go(+b.getAttribute('data-go')); }); });
    box.querySelector('.rx-view-close').addEventListener('click', close);
    addEventListener('keydown', key);
    show(); box.querySelector('.rx-view-close').focus();
  };

  /* ---------- on another website: what the host site's js/site.js would otherwise give ---------- */
  function standalone() {
    if (typeof waLink === 'function') return;
    if (!document.getElementById('i-chat')) document.body.insertAdjacentHTML('afterbegin', '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">' +
      '<symbol id="i-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1.4-4A8 8 0 1 1 8 18.6z"/></symbol>' +
      '<symbol id="i-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16M14 6l6 6-6 6"/></symbol></svg>');
    var head = document.getElementById('site-header'), foot = document.getElementById('site-footer'), brand = esc(C.brand || 'Home');
    if (head && !head.innerHTML.trim()) head.innerHTML = '<header class="rx-solo-head"><a class="rx-solo-brand" href="' + esc(C.home || '/') + '"><img src="retail/images/brand/walvis-seal-96.png" alt="" width="40" height="40"><span>' + brand + '</span></a>' +
      '<nav aria-label="Retail"><a href="retail/index.html" aria-current="page">Retail</a><a ' + M.waAttrs('Hello Walvis, I would like to ask about The Walvis Promenade.') + '>' + M.chat + ' WhatsApp</a></nav></header>';
    if (foot && !foot.innerHTML.trim()) foot.innerHTML = '<footer class="rx-solo-foot"><span>© ' + new Date().getFullYear() + ' ' + brand + '</span><a href="retail/credits.html">Photo credits</a></footer>';
  }
  standalone();
})();
