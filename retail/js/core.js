/* =========================================================
   WALVIS CONCIERGE · retail/js/core.js
   The Walvis Promenade, shared by every page in retail/:
   the mall's data index, prices and WhatsApp links, the 3D camera
   and the smooth movement that every scene uses.
   Pages: index.html (ground-floor lobby), level.html?level=…, shop.html?shop=…, item.html?item=…
   Every page has <base href="../">, so all paths are written from the site's main folder.
   Works with or without the host site's js/site.js (header, footer, waLink): see retail/README.md.
   ========================================================= */
(function () {
  'use strict';
  var P = window.WALVIS_PROMENADE, W = window.WALVIS || {}, C = window.WALVIS_RETAIL || {};
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var M = window.Mall = { P: P, W: W, C: C, reduce: reduce };

  /* ---------- photos: a local copy, or the free-licence original on Wikimedia Commons ---------- */
  var COMMONS = 'https://commons.wikimedia.org/wiki/';
  var remote = {};   // local path -> Commons URL, so a missing local copy falls back to the original
  M.commonsPage = function (file) { return COMMONS + 'File:' + encodeURIComponent(file.replace(/ /g, '_')); };
  function commonsImage(file, w) { return COMMONS + 'Special:FilePath/' + encodeURIComponent(file.replace(/ /g, '_')) + '?width=' + (w || 1280); }
  function resolve(i) {
    var p = i.photo; if (!p) return;
    var far = p.file ? commonsImage(p.file) : '';
    if (p.local && far) remote[p.local] = far;
    i.image = (C.images === 'local' || !far) ? (p.local || far) : far;
  }

  /* ---------- the mall, indexed ---------- */
  var lv = {}, sh = {}, it = {};
  P.levels.forEach(function (l) {
    lv[l.id] = l;
    l.shops.forEach(function (s) { s.level = l; sh[s.id] = s; s.items.forEach(function (i) { i.shop = s; i.level = l; it[i.id] = i; resolve(i); }); });
  });
  M.level = function (id) { return lv[id]; };
  M.shop = function (id) { return sh[id]; };
  M.item = function (id) { return it[id]; };
  M.levelByNumber = function (n) { return P.levels.filter(function (l) { return l.number === n; })[0]; };
  M.url = {
    lobby: function () { return 'retail/index.html'; },
    level: function (l, via) { return 'retail/level.html?level=' + l.id + (via ? '&via=' + via : ''); },
    shop: function (s, via) { return 'retail/shop.html?shop=' + s.id + (via ? '&via=' + via : ''); },
    item: function (i, via) { return 'retail/item.html?item=' + i.id + (via ? '&via=' + via : ''); }
  };
  // read ?name= and forget ?via= once it has been used, so shared links stay clean
  M.param = function (name) { return new URLSearchParams(location.search).get(name); };
  M.via = (function () {
    var v = M.param('via');
    if (v) { var u = new URL(location.href); u.searchParams.delete('via'); history.replaceState(null, '', u.pathname + u.search + u.hash); }
    return v || '';
  })();

  /* ---------- text, prices and WhatsApp ---------- */
  M.esc = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var esc = M.esc;
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
    if (!(Number(i.price) > 0)) return '<span class="mx-price mx-por">Price on request</span>';
    return '<span class="mx-price">' + esc(M.money(i.price, i.priceNote)) + '</span><span class="mx-ind">indicative</span>';
  };
  M.itemMsg = function (i) {
    var price = Number(i.price) > 0 ? M.money(i.price, i.priceNote).replace(/^From /, 'from ') : 'price on request';
    return 'Hello Walvis, I am interested in ' + i.title + ' from ' + i.shop.name + ', ' + i.level.name + ' at The Walvis Promenade. Listed at ' + price + '. Please share details.';
  };
  M.wa = function (msg) { return typeof waLink === 'function' ? waLink(msg) : 'https://wa.me/' + (C.whatsapp || '') + '?text=' + encodeURIComponent(msg); };
  M.waAttrs = function (msg) { return 'href="' + esc(M.wa(msg)) + '" target="_blank" rel="noopener"'; };
  M.levelLabel = function (l) { return 'Level ' + l.number + ' · ' + l.name; };
  var BADGES = { 'available': 'mx-b-available', 'on request': 'mx-b-request', 'made to order': 'mx-b-order', 'charter': 'mx-b-charter', 'reserved': 'mx-b-reserved' };
  M.badge = function (t) { t = t || 'On request'; return '<span class="mx-badge ' + (BADGES[t.toLowerCase()] || 'mx-b-request') + '">' + esc(t) + '</span>'; };
  M.SOURCING = 'Every piece is sourced on request through our trusted network. Walvis Concierge is not an authorised dealer of the brands shown. Prices are indicative, confirmed with you before anything is bought, and exclude import duties, taxes, registration and delivery, which we quote separately.';
  M.sourcing = function () { return '<p class="mx-sourcing">' + esc(M.SOURCING) + '</p>'; };
  M.templateNote = function (list) {
    if (!W.showTemplateNotes || !list.some(function (i) { return i.template; })) return '';
    return '<p class="mx-template-note"><b>Template pieces.</b> These are placeholders, waiting for real pieces, photos and prices. Edit them in retail/js/data.js.</p>';
  };
  // a photo, or the empty frame while a photo is still to come
  function frame(alt) {
    return '<span class="mx-frame" role="img" aria-label="' + esc(alt ? 'Photo to follow: ' + alt : 'Photo to follow') + '"><span><img src="retail/images/brand/walvis-seal-96.png" alt="" draggable="false">' +
      (W.showTemplateNotes ? '<em>Add a photo</em>' : '') + '</span></span>';
  }
  M.photo = function (src, alt, eager) {
    if (src) return '<img src="' + esc(src) + '" alt="' + esc(alt) + '"' + (eager ? '' : ' loading="lazy"') + ' decoding="async" draggable="false" referrerpolicy="no-referrer" onerror="Mall.photoFailed(this)">';
    return frame(alt);
  };
  // a local copy that is not there yet falls back to the original; if that fails too, the empty frame
  M.photoFailed = function (img) {
    var src = img.getAttribute('src'), far = remote[src];
    if (far && far !== src) { img.src = far; return; }
    img.onerror = null; img.outerHTML = frame(img.alt);
  };
  // who took the photo, under which licence, and what it shows
  M.credit = function (i) {
    var p = i.photo; if (!p) return '';
    var who = [p.author && !/^See /.test(p.author) ? p.author : '', p.licence && !/^See /.test(p.licence) ? p.licence : ''].filter(Boolean).join(', ');
    return '<p class="mx-credit">' + (p.shows ? esc(p.shows) + '. ' : '') + 'Photo' + (who ? ': ' + esc(who) : '') +
      (p.file ? ', via <a href="' + esc(M.commonsPage(p.file)) + '" target="_blank" rel="noopener">Wikimedia Commons</a>' : '') + '. <a href="retail/credits.html">All photo credits</a></p>';
  };
  M.crumbs = function (parts) {
    return '<nav class="mx-crumbs" aria-label="You are here"><ol>' + parts.map(function (p, i) {
      return '<li>' + (i < parts.length - 1 ? '<a href="' + p[1] + '">' + esc(p[0]) + '</a>' : '<span aria-current="page">' + esc(p[0]) + '</span>') + '</li>';
    }).join('') + '</ol></nav>';
  };
  M.setMeta = function (title, desc) {
    document.title = title;
    var m = document.querySelector('meta[name="description"]'); if (m && desc) m.setAttribute('content', desc);
  };

  /* ---------- going somewhere, with no black gaps ----------
     Every move ends in a soft glow the colour of the room's light, and the next page starts from that
     same glow and lets it go once its scene is drawn, so one place flows into the next. */
  var VEIL = 'walvis-mall-veil';
  var veil = document.createElement('div'); veil.className = 'mx-veil'; veil.setAttribute('aria-hidden', 'true');
  document.body.appendChild(veil);
  M.fade = function (on, ms) {
    veil.style.transitionDuration = (reduce ? 0 : ms || 450) + 'ms';
    void veil.offsetWidth; veil.classList.toggle('on', !!on);
    return wait(ms || 450);
  };
  M.go = function (url, ms) {
    try { sessionStorage.setItem(VEIL, String(Date.now())); } catch (e) {}
    var href = new URL(url, document.baseURI).href;
    return M.fade(true, ms == null ? 380 : ms).then(function () { location.href = href; });
  };
  (function arriving() {   // came here from another place in the mall: start in the glow, then let it go
    var t = 0; try { t = +sessionStorage.getItem(VEIL) || 0; sessionStorage.removeItem(VEIL); } catch (e) {}
    if (!t || Date.now() - t > 8000 || reduce) return;
    veil.style.transitionDuration = '0ms'; veil.classList.add('on');
    requestAnimationFrame(function () { requestAnimationFrame(function () { setTimeout(function () { M.fade(false, 900); }, 90); }); });
  })();
  addEventListener('pageshow', function (e) { if (e.persisted) M.fade(false, 300); });   // back to a page from the cache

  /* ---------- day and evening ---------- */
  var THEME = 'walvis-mall-theme';
  M.light = function () { return document.documentElement.classList.contains('mx-light'); };
  M.themeSwitch = function () {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'mx-theme';
    function label() {
      var day = M.light();
      b.setAttribute('aria-pressed', String(day));
      b.setAttribute('aria-label', day ? 'Switch to evening' : 'Switch to daylight');
      b.innerHTML = '<span class="mx-theme-track" aria-hidden="true"><i></i></span><span>' + (day ? 'Daylight' : 'Evening') + '</span>';
    }
    // the lights change behind a soft flash of light, like the house lights coming up (or going down)
    b.addEventListener('click', function () {
      var html = document.documentElement;
      veil.classList.add('flash');
      M.fade(true, reduce ? 0 : 420).then(function () {
        html.classList.toggle('mx-light');
        try { localStorage.setItem(THEME, M.light() ? 'light' : 'dark'); } catch (e) {}
        label(); return wait(120);
      }).then(function () { return M.fade(false, 900); }).then(function () { veil.classList.remove('flash'); });
    });
    label(); document.body.appendChild(b); return b;
  };

  /* ---------- light motes drifting through a scene ---------- */
  M.motes = function (scene, n) {
    if (reduce || !scene) return;
    var m = document.createElement('div'); m.className = 'mx-motes'; m.setAttribute('aria-hidden', 'true');
    var h = '';
    for (var i = 0; i < (n || 26); i++) {
      h += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;top:' + (20 + Math.random() * 80).toFixed(1) + '%;animation-delay:-' + (Math.random() * 14).toFixed(1) + 's;animation-duration:' + (10 + Math.random() * 10).toFixed(1) + 's;--s:' + (.4 + Math.random() * .9).toFixed(2) + '"></i>';
    }
    m.innerHTML = h; scene.appendChild(m);
  };
  function wait(ms) { return new Promise(function (r) { setTimeout(r, reduce ? 0 : ms); }); }
  M.wait = wait;

  /* =========================================================
     THE 3D CAMERA
     A world is an element at the centre of a viewport with perspective. Things are placed
     in it with M.plane(); the camera moves by moving the world the other way.
     x: right, y: down, z: towards you (forward is negative z). yaw: positive turns right.
     ========================================================= */
  M.ease = {
    inOut: function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
    inOutSine: function (t) { return -(Math.cos(Math.PI * t) - 1) / 2; },
    out: function (t) { return 1 - Math.pow(1 - t, 3); },
    in: function (t) { return t * t * t; },
    // a lift: gentle start, steady travel, gentle stop (a = the share of the ride spent speeding up, and slowing down)
    lift: function (t, a) { a = a || .22; if (t < a) return (t * t) / (2 * a * (1 - a)); if (t > 1 - a) return 1 - ((1 - t) * (1 - t)) / (2 * a * (1 - a)); return (t - a / 2) / (1 - a); }
  };

  function Camera(world, persp) {
    this.world = world; this.P = persp || 800;
    this.x = 0; this.y = 0; this.z = 0; this.yaw = 0; this.pitch = 0; this.roll = 0;
    this.lookX = 0; this.lookY = 0;   // small head movements that follow the pointer
    this._tx = 0; this._ty = 0;
  }
  Camera.prototype.apply = function () {
    this.world.style.transform = 'translateZ(' + this.P + 'px) rotateZ(' + this.roll.toFixed(3) + 'deg) rotateX(' + (this.pitch + this.lookY).toFixed(3) + 'deg) rotateY(' + (this.yaw + this.lookX).toFixed(3) + 'deg) translate3d(' +
      (-this.x).toFixed(2) + 'px,' + (-this.y).toFixed(2) + 'px,' + (-this.z).toFixed(2) + 'px)';
  };
  Camera.prototype.set = function (o) { for (var k in o) this[k] = o[k]; this.apply(); return this; };
  // move smoothly to a new position; returns a promise. onStep(progress, eased) runs every frame.
  Camera.prototype.to = function (o, ms, ease, onStep) {
    var cam = this, from = {}, k;
    ease = ease || M.ease.inOut;
    for (k in o) from[k] = cam[k];
    if (reduce || !ms) { cam.set(o); if (onStep) onStep(1, 1); return Promise.resolve(); }
    return new Promise(function (res) {
      var t0 = performance.now();
      cam._run = t0;
      (function frame(t) {
        if (cam._run !== t0) return res();   // a newer move took over
        var p = Math.min(1, (t - t0) / ms), e = ease(p);
        for (var key in o) cam[key] = from[key] + (o[key] - from[key]) * e;
        if (onStep) onStep(p, e);
        cam.apply();
        if (p < 1) requestAnimationFrame(frame); else res();
      })(t0);
    });
  };
  // the head follows the pointer a little; on touch screens a drag looks around
  Camera.prototype.follow = function (el, range) {
    var cam = this; range = range || [5, 2.5];
    if (reduce) return;
    var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (fine) el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      cam._tx = ((e.clientX - r.left) / r.width - .5) * range[0];
      cam._ty = -((e.clientY - r.top) / r.height - .5) * range[1];
    });
    el.addEventListener('pointerleave', function () { cam._tx = 0; cam._ty = 0; });
    (function loop() {
      cam.lookX += (cam._tx - cam.lookX) * .06; cam.lookY += (cam._ty - cam.lookY) * .06;
      if (Math.abs(cam._tx - cam.lookX) > .001 || Math.abs(cam._ty - cam.lookY) > .001) cam.apply();
      requestAnimationFrame(loop);
    })();
  };
  M.Camera = Camera;
  // perspective that suits the screen: wider screens see more of the room
  M.persp = function () { var w = innerWidth; return w < 600 ? 520 : w < 1000 ? 680 : 820; };

  // place a flat surface in a world: o = { w, h, x, y, z, ry, rx, tag, href }
  M.plane = function (parent, cls, o, html) {
    var el = document.createElement(o.tag || 'div');
    el.className = 'mx-pl ' + (cls || '');
    if (o.href) el.setAttribute('href', o.href);
    el.style.width = o.w + 'px'; el.style.height = o.h + 'px';
    el.style.marginLeft = -o.w / 2 + 'px'; el.style.marginTop = -o.h / 2 + 'px';
    el.style.transform = 'translate3d(' + (o.x || 0) + 'px,' + (o.y || 0) + 'px,' + (o.z || 0) + 'px) rotateY(' + (o.ry || 0) + 'deg) rotateX(' + (o.rx || 0) + 'deg)';
    if (html) el.innerHTML = html;
    parent.appendChild(el);
    return el;
  };

  /* ---------- the things that make a place feel lived in ---------- */
  var TONES = ['a', 'b', 'c', 'd'];
  // a person, strolling along a line in front of you (o: x, y = the floor, z, ry, walk = how far, dur, delay, bag, scale)
  M.person = function (parent, o) {
    var walk = o.walk || 0, w = 80 + walk, k = o.scale || 1;
    var el = M.plane(parent, 'mx-person-lane', { w: w, h: 210 * k, x: (o.x || 0), y: o.y - 105 * k, z: o.z, ry: o.ry || 0 },
      '<span class="mx-person mx-tone-' + TONES[(o.tone == null ? Math.floor(Math.random() * 4) : o.tone) % 4] + (walk ? ' walking' : '') + (o.back ? ' back' : '') + '" style="--walk:' + walk + 'px;--dur:' + (o.dur || 16) + 's;--delay:-' + (o.delay || 0) + 's;--k:' + k + '">' +
        '<i class="mx-p-head"></i><i class="mx-p-body"></i><i class="mx-p-leg l"></i><i class="mx-p-leg r"></i>' + (o.bag ? '<i class="mx-p-bag"></i>' : '') + '</span>');
    return el;
  };
  M.planter = function (parent, o) {
    var k = o.scale || 1, el = M.plane(parent, 'mx-planter', { w: 220 * k, h: 360 * k, x: o.x, y: o.y - 180 * k, z: o.z, ry: o.ry || 0 }, '<span style="transform:scale(' + k + ')"><i class="mx-leaf a"></i><i class="mx-leaf b"></i><i class="mx-leaf c"></i><i class="mx-leaf d"></i><i class="mx-pot"></i></span>');
    return el;
  };
  M.bench = function (parent, o) {
    return M.plane(parent, 'mx-bench', { w: 300, h: 90, x: o.x, y: o.y - 45, z: o.z, ry: o.ry || 0 }, '<i></i>');
  };
  // a slowly turning sculpture of lit rings
  M.sculpture = function (parent, o) {
    var g = document.createElement('div'); g.className = 'mx-sculpt';
    g.style.transform = 'translate3d(' + o.x + 'px,' + o.y + 'px,' + o.z + 'px)';
    var spin = document.createElement('div'); spin.className = 'mx-sculpt-spin'; g.appendChild(spin);
    [[o.r || 300, 0, 0], [(o.r || 300) * .78, 60, 0], [(o.r || 300) * .56, 120, 0], [(o.r || 300) * .78, 0, 70]].forEach(function (r) {
      M.plane(spin, 'mx-ring', { w: r[0] * 2, h: r[0] * 2, x: 0, y: 0, z: 0, ry: r[1], rx: r[2] });
    });
    M.plane(spin, 'mx-orb', { w: 70, h: 70, x: 0, y: 0, z: 0 });
    parent.appendChild(g); return g;
  };

  /* ---------- small things every page shares ---------- */
  document.documentElement.classList.add('mall-ready');
  // keep the site's water veil for leaving the mall only; inside the mall the scenes do the moving
  M.onLink = function (fn) {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[data-walk]');
      if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      fn(a, e);
    }, true);
  };

  /* ---------- on another website: what the host site's js/site.js would otherwise give ---------- */
  if (typeof waLink !== 'function') {
    if (!document.getElementById('i-chat')) document.body.insertAdjacentHTML('afterbegin', '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">' +
      '<symbol id="i-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1.4-4A8 8 0 1 1 8 18.6z"/></symbol>' +
      '<symbol id="i-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16M14 6l6 6-6 6"/></symbol></svg>');
    var head = document.getElementById('site-header'), foot = document.getElementById('site-footer'), brand = esc(C.brand || 'Home');
    if (head && !head.innerHTML.trim()) head.innerHTML = '<header class="mx-solo-head"><a class="mx-solo-brand" href="' + esc(C.home || '/') + '"><img src="retail/images/brand/walvis-seal-96.png" alt="" width="40" height="40"><span>' + brand + '</span></a>' +
      '<nav aria-label="Retail"><a href="retail/index.html" aria-current="page">Retail</a><a href="' + esc(M.wa('Hello Walvis, I would like to ask about The Walvis Promenade.')) + '" target="_blank" rel="noopener"><svg class="i" aria-hidden="true"><use href="#i-chat"/></svg> WhatsApp</a></nav></header>';
    if (foot && !foot.innerHTML.trim()) foot.innerHTML = '<footer class="mx-solo-foot"><span>© ' + new Date().getFullYear() + ' ' + brand + '</span><a href="retail/credits.html">Photo credits</a></footer>';
  }
})();
