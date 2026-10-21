/* =========================================================
   WALVIS CONCIERGE · js/site.js  (v4)
   Edit SITE to change contact details and the menu.
   ========================================================= */
var SITE = {
  whatsapp: '8801411267007',            // digits only, with country code
  phone: '+880 1411-267007',
  email: 'walvisconcierge@gmail.com',
  city: 'Dhaka, Bangladesh',
  social: { instagram: '#', facebook: '#', linkedin: '#' },   // PLACEHOLDERS
  logo: 'images/logo/walvis-seal-160.png',
  // the menu (icon bar), in this order
  menu: [
    { label: 'Personal Lifestyle', href: 'lifestyle.html' },
    { label: 'Travel', href: 'travel.html' },
    { label: 'Retail', href: 'retail.html' },
    { label: 'Experiences', href: 'experiences.html' },
    { label: 'Discover Bangladesh', href: 'foreigners.html' },
    { label: 'Probashi Concierge', href: 'expats.html' },
    { label: 'Portal', href: 'portal.html' },
    { label: 'About Us', href: 'about.html' }
  ]
};

function waLink(msg) {
  return 'https://wa.me/' + SITE.whatsapp + '?text=' + encodeURIComponent(msg || 'Hello Walvis, I would like to know more.');
}

(function () {
  var here = location.pathname.split('/').pop() || 'index.html';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Icons ---------- */
  var icons = {
    arrow: '<path d="M4 12h16M14 6l6 6-6 6"/>',
    chat: '<path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z"/><path d="M8.5 9.5c.4 2.6 2.4 4.6 5 5l1.2-1.3 2 .9-.4 1.6c-3.8.4-8.1-3.9-7.7-7.7l1.6-.4.9 2-1.3 1.2"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 7 9 6 9-6"/>',
    pin: '<path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    ig: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>',
    fb: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8Z"/>',
    li: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/>'
  };
  var sprite = '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">';
  for (var k in icons) sprite += '<symbol id="i-' + k + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">' + icons[k] + '</symbol>';
  document.body.insertAdjacentHTML('afterbegin', sprite + '</svg>');
  function ic(n) { return '<svg class="i" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; }

  /* ---------- Header + drawer ---------- */
  var h = document.getElementById('site-header');
  if (h) {
    var items = SITE.menu.map(function (m) {
      return '<li><a href="' + m.href + '"' + (m.href === here ? ' aria-current="page"' : '') + '>' + m.label + '</a></li>';
    }).join('');
    h.outerHTML =
      '<a class="skip" href="#main">Skip to content</a>' +
      '<header class="topbar" id="topbar">' +
        '<button class="menu-btn" id="menuBtn" aria-label="Open menu" aria-expanded="false" aria-controls="drawer"><span class="tail" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 12V18.8M2.6 6.4C6 7.8 9.4 8.2 12 9.4 14.6 8.2 18 7.8 21.4 6.4 19.9 10.9 15.6 12.6 12 12 8.4 12.6 4.1 10.9 2.6 6.4Z"/></svg></span><span class="lbl">Menu</span></button>' +
        '<a class="brand" href="index.html" aria-label="Walvis Concierge, home"><img src="' + SITE.logo + '" alt="Walvis Concierge seal" width="58" height="58"><span class="caps">Walvis</span></a>' +
        '<a class="btn member-btn" href="membership.html"><span class="v">View&nbsp;</span>Membership</a>' +
      '</header>' +
      '<aside class="drawer" id="drawer" aria-hidden="true" aria-label="Menu">' +
        '<button class="drawer-close" id="drawerClose" aria-label="Close menu"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"/></svg></button>' +
        '<nav><ol>' + items + '</ol></nav>' +
        '<div class="drawer-foot">' +
          '<a href="' + waLink() + '" target="_blank" rel="noopener">' + ic('chat') + ' WhatsApp us</a>' +
          '<a href="tel:' + SITE.phone.replace(/[^+\d]/g, '') + '">' + ic('phone') + ' ' + SITE.phone + '</a>' +
          '<a href="mailto:' + SITE.email + '">' + ic('mail') + ' ' + SITE.email + '</a>' +
        '</div>' +
      '</aside><div class="scrim" id="scrim"></div>';
  }

  /* ---------- Footer ---------- */
  var f = document.getElementById('site-footer');
  if (f) {
    f.outerHTML =
      '<footer class="footer"><div class="meander" style="max-width:var(--wrap);margin:0 auto 70px"></div>' +
        '<div class="foot-top">' +
          '<div class="foot-brand"><img src="' + SITE.logo + '" alt="" width="74" height="74"><span class="caps">Walvis</span><p>From seas to mountains,<br>consider it done.</p></div>' +
          '<div><h4>Services</h4><nav>' + SITE.menu.filter(function (m) { return m.href !== 'about.html' && m.href !== 'portal.html'; }).map(function (m) { return '<a href="' + m.href + '">' + m.label + '</a>'; }).join('') + '</nav></div>' +
          '<div><h4>Walvis</h4><nav><a href="membership.html">Membership</a><a href="what-we-offer.html">What we offer</a><a href="assets.html">Assets</a><a href="special-requests.html">Special Requests</a><a href="portal.html">Portal</a><a href="about.html">About us</a><a href="contact.html">Contact</a></nav></div>' +
          '<div class="contact"><h4>Reach us</h4>' +
            '<a href="' + waLink() + '" target="_blank" rel="noopener">' + ic('chat') + ' WhatsApp</a>' +
            '<a href="tel:' + SITE.phone.replace(/[^+\d]/g, '') + '">' + ic('phone') + ' ' + SITE.phone + '</a>' +
            '<a href="mailto:' + SITE.email + '">' + ic('mail') + ' ' + SITE.email + '</a>' +
            '<span>' + ic('pin') + ' ' + SITE.city + '</span>' +
            '<div class="social"><a href="' + SITE.social.instagram + '" aria-label="Instagram">' + ic('ig') + '</a><a href="' + SITE.social.facebook + '" aria-label="Facebook">' + ic('fb') + '</a><a href="' + SITE.social.linkedin + '" aria-label="LinkedIn">' + ic('li') + '</a></div>' +
          '</div>' +
        '</div>' +
        '<div class="foot-base"><span>© ' + new Date().getFullYear() + ' Walvis Concierge. If It’s Legal, It’s Possible.</span>' +
          '<nav><a href="privacy.html">Privacy</a><a href="credits.html">Photo credits</a></nav></div>' +
      '</footer>' +
      '<a class="wa" href="' + waLink() + '" target="_blank" rel="noopener" aria-label="Message Walvis on WhatsApp">' + ic('chat') + '<span>Message us</span></a>';
  }

  document.querySelectorAll('img').forEach(function (im) { im.decoding = 'async'; });

  /* ---------- WhatsApp links: <a data-wa="message"> ---------- */
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = waLink(a.getAttribute('data-wa')); a.target = '_blank'; a.rel = 'noopener';
  });

  /* ---------- Drawer ---------- */
  var drawer = document.getElementById('drawer'), btn = document.getElementById('menuBtn');
  var closeB = document.getElementById('drawerClose'), scrim = document.getElementById('scrim');
  function setMenu(open) {
    drawer.classList.toggle('open', open); scrim.classList.toggle('show', open);
    drawer.setAttribute('aria-hidden', String(!open)); btn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('no-scroll', open);
    if (open) drawer.querySelectorAll('nav li').forEach(function (li, i) { li.style.transitionDelay = (.15 + i * .06) + 's'; });
  }
  if (drawer) {
    btn.addEventListener('click', function () { setMenu(true); });
    closeB.addEventListener('click', function () { setMenu(false); });
    scrim.addEventListener('click', function () { setMenu(false); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* ---------- Header turns solid after the hero ---------- */
  var bar = document.getElementById('topbar');
  var waBtn = document.querySelector('.wa');
  function onScroll() {
    if (bar) bar.classList.toggle('solid', scrollY > innerHeight * .5);
    // the floating WhatsApp button joins once you start scrolling (it would cover the hero's own buttons)
    if (waBtn) waBtn.classList.toggle('show', scrollY > Math.min(260, innerHeight * .35));
  }
  var scrollQueued = false;
  addEventListener('scroll', function () { if (scrollQueued) return; scrollQueued = true; requestAnimationFrame(function () { scrollQueued = false; onScroll(); }); }, { passive: true }); onScroll();

  /* ---------- Swipeable rows on phones: a small hint under each ---------- */
  document.querySelectorAll('.mosaic, .worlds, .rail').forEach(function (row) {
    if (row.children.length < 2) return;
    var hint = document.createElement('p'); hint.className = 'swipe-hint'; hint.setAttribute('aria-hidden', 'true'); hint.textContent = 'Swipe';
    row.parentNode.insertBefore(hint, row.nextSibling);
  });

  /* ---------- Rails ---------- */
  document.querySelectorAll('[data-rail]').forEach(function (w) {
    var rail = w.querySelector('.rail');
    w.querySelectorAll('[data-dir]').forEach(function (b) {
      b.addEventListener('click', function () { rail.scrollBy({ left: +b.getAttribute('data-dir') * rail.clientWidth * .75, behavior: 'smooth' }); });
    });
  });

  /* ---------- Reveal ---------- */
  var rev = document.querySelectorAll('.reveal, .mask');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -50px 0px' });
    rev.forEach(function (el) {
      // the opening screen of each page always appears straight away (its own delays still apply);
      // waiting for it to scroll into view could leave a button hidden at the very bottom of a short screen
      if (el.closest('.hero, .page-hero')) requestAnimationFrame(function () { el.classList.add('in'); });
      else io.observe(el);
    });
  } else rev.forEach(function (el) { el.classList.add('in'); });

  /* ---------- Whale scene state (read by the ocean engines and the ?debug panel) ---------- */
  var SEA = window.WalvisSea = window.WalvisSea || { paused: false, engine: '', renderer: '', tier: 0, calm: reduce };
  try { localStorage.removeItem('walvis-sea-paused'); } catch (e) {}

  /* ---------- Diagnostics: add ?debug to the address to see what this computer is doing ---------- */
  if (/[?&]debug\b/.test(location.search)) {
    var errs = [];
    addEventListener('error', function (e) { errs.push((e.message || 'error') + (e.filename ? ' (' + e.filename.split('/').pop() + ':' + e.lineno + ')' : '')); });
    var dbg = document.createElement('div'); dbg.className = 'debug-panel'; document.body.appendChild(dbg);
    var frames = 0, fps = 0, t0 = performance.now();
    (function count(now) { frames++; if (now - t0 >= 1000) { fps = Math.round(frames * 1000 / (now - t0)); frames = 0; t0 = now; } requestAnimationFrame(count); })(t0);
    setInterval(function () {
      var rows = [
        ['Reduced motion setting', reduce ? 'ON (whale moves slower)' : 'off'],
                ['Engine', SEA.engine || 'not started'],
        ['Why not WebGL', SEA.whyNot || '-'],
        ['Graphics card', SEA.renderer || 'unknown'],
        ['Frame rate', fps + ' fps'],
        ['Quality step', (SEA.tier || 0) + (SEA.calmGlass ? ' + plain glass' : '')],
        ['Screen', innerWidth + 'x' + innerHeight + ' @' + (devicePixelRatio || 1) + 'x'],
        ['Browser', navigator.userAgent.replace(/^Mozilla\/5\.0 /, '').slice(0, 90)],
        ['Errors', errs.length ? errs.slice(-3).join(' | ') : 'none']
      ];
      dbg.innerHTML = '<b>Walvis diagnostics</b>' + rows.map(function (r) { return '<div><span>' + r[0] + '</span>' + String(r[1]).replace(/</g, '&lt;') + '</div>'; }).join('');
    }, 500);
  }

  /* ---------- The ocean (js/ocean.js), only where a whale scene exists ---------- */
  if (document.querySelector('canvas.sea')) {
    var oc = document.createElement('script'); oc.src = 'js/ocean.js'; oc.defer = true; document.body.appendChild(oc);
  }

  /* =========================================================
     LIQUID GLASS
     ========================================================= */
  // a slow, drifting wash of plum and teal light behind everything
  var amb = document.createElement('div'); amb.className = 'ambient'; amb.setAttribute('aria-hidden', 'true');
  amb.innerHTML = '<i></i><i></i><i></i>'; document.body.insertBefore(amb, document.body.firstChild);

  // glass panels: each gets a soft highlight that follows the pointer, like light on curved glass
  var GLASS = '.topbar, .drawer, .hero-card, .tier, .world, .svc > div, .principles > div, .steps li, .honest, .closing .wrap, .phone, .footer .foot-top, .credits-wrap';
  document.querySelectorAll(GLASS).forEach(function (el) {
    el.classList.add('lg');
    var s = document.createElement('span'); s.className = 'spec'; s.setAttribute('aria-hidden', 'true'); el.insertBefore(s, el.firstChild);
  });
  document.addEventListener('pointermove', function (e) {
    var el = e.target.closest && e.target.closest('.lg'); if (!el) return;
    var r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  /* ---------- Page transitions: a liquid veil ----------
     Leaving: plum-and-teal water ripples out from where you clicked.
     Arriving: the water drains upward with a soft, wavy edge. */
  var veil = document.createElement('div'); veil.className = 'veil cover'; veil.setAttribute('aria-hidden', 'true');
  veil.innerHTML =
    '<svg width="0" height="0" style="position:absolute" focusable="false"><filter id="liquid" x="-10%" y="-10%" width="120%" height="120%">' +
      '<feTurbulence type="fractalNoise" baseFrequency=".007 .011" numOctaves="2" seed="4"/>' +
      '<feDisplacementMap in="SourceGraphic" scale="70" xChannelSelector="R" yChannelSelector="G"/></filter></svg>' +
    '<div class="veil-liquid"><div class="veil-water"><i></i></div></div>' +
    '<div class="veil-seal"><span class="veil-ring"></span><span class="veil-ring"></span><img src="' + SITE.logo + '" alt=""></div>';
  document.body.appendChild(veil);
  document.documentElement.classList.remove('veiled');
  function reveal() {
    veil.classList.remove('in', 'pre-in'); veil.classList.add('cover');
    void veil.offsetWidth;
    requestAnimationFrame(function () { veil.classList.add('out'); });
  }
  if (reduce) { veil.classList.remove('cover'); }
  else setTimeout(reveal, 140);
  addEventListener('pageshow', function (e) { if (e.persisted) { veil.classList.remove('in', 'pre-in', 'cover'); veil.classList.add('out'); } });

  if (!reduce) document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download') || a.hasAttribute('data-wa')) return;
    var href = a.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#' || /^(mailto:|tel:|https?:|javascript:)/i.test(href)) return;
    var url = new URL(a.href, location.href);
    if (url.pathname === location.pathname && url.hash) return;
    e.preventDefault();
    setMenu && drawer && drawer.classList.contains('open') && setMenu(false);
    veil.style.setProperty('--x', e.clientX + 'px'); veil.style.setProperty('--y', e.clientY + 'px');
    veil.classList.remove('out', 'cover'); veil.classList.add('pre-in');
    void veil.offsetWidth;
    veil.classList.add('in');
    setTimeout(function () { location.href = a.href; }, 820);
  });

  if (reduce) return;

  /* ---------- Parallax bands ---------- */
  var bands = [].slice.call(document.querySelectorAll('.band > img'));
  function parallax() {
    bands.forEach(function (img) {
      var r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      img.style.transform = 'translateY(' + ((r.top + r.height / 2 - innerHeight / 2) * -.12) + 'px)';
    });
  }
  var fine = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1025px)').matches, pQueued = false;
  if (bands.length && fine) { addEventListener('scroll', function () { if (pQueued) return; pQueued = true; requestAnimationFrame(function () { pQueued = false; parallax(); }); }, { passive: true }); parallax(); }

  /* ---------- Musical notes (inside [data-notes]) ---------- */
  var zones = document.querySelectorAll('[data-notes]');
  var NOTES = ['♪', '♫', '♩', '♬'], COLORS = ['#ffffff', '#c8f3ef', '#5cc4c0'];
  var lx = 0, ly = 0, lt = 0;
  function note(x, y) {
    var n = document.createElement('span');
    n.className = 'note'; n.textContent = NOTES[Math.random() * 4 | 0];
    n.style.cssText = 'left:' + x + 'px;top:' + y + 'px;color:' + COLORS[Math.random() * 3 | 0] + ';font-size:' + (14 + Math.random() * 12) + 'px';
    n.style.setProperty('--dx', (Math.random() * 50 - 25) + 'px'); n.style.setProperty('--r', (Math.random() * 30 - 15) + 'deg');
    document.body.appendChild(n); n.addEventListener('animationend', function () { n.remove(); });
  }
  zones.forEach(function (z) {
    function move(x, y) {
      var t = performance.now();
      if (t - lt > 140 && Math.hypot(x - lx, y - ly) > 46) { note(x, y); lx = x; ly = y; lt = t; }
    }
    z.addEventListener('mousemove', function (e) { move(e.clientX, e.clientY); });
    z.addEventListener('touchmove', function (e) { var p = e.touches[0]; if (p) move(p.clientX, p.clientY); }, { passive: true });
  });

})();
