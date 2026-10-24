/* =========================================================
   WALVIS CONCIERGE · retail/js/lobby.js
   The ground-floor lobby (retail/index.html). The first time in a visit you arrive at the doors;
   they open and you walk in. Above you rise all six floors, each with its shops lit around
   the atrium. In the middle stands the glass lift, with the departments listed on its shaft.
   ========================================================= */
(function () {
  'use strict';
  var M = window.Mall; if (!M) return;
  var esc = M.esc, levels = M.P.levels;
  var vp = document.getElementById('mx-vp'), world = document.getElementById('mx-world');
  if (!vp || !world) return;
  M.setMeta('Retail · The Walvis Promenade | Walvis Concierge', 'The Walvis Promenade: hypercars, private jets, superyachts, haute horlogerie, high jewellery, fine art and Bangladeshi heritage, sourced on request by Walvis Concierge.');

  var REST = { x: 0, y: -40, z: 1650, yaw: 0, pitch: 5 };
  vp.style.perspective = M.persp() + 'px';
  var built = M.buildAtrium(world, { cabTag: 'button', cabLabel: 'Step in' });
  M.themeSwitch();
  M.motes(document.getElementById('mx-scene'), 30);
  var cam = new M.Camera(world, M.persp());
  built.cabFront.setAttribute('type', 'button');
  built.cabFront.setAttribute('aria-label', 'Step into the glass lift');
  built.cabFront.classList.add('mx-hot');
  addEventListener('resize', function () { var p = M.persp(); cam.P = p; vp.style.perspective = p + 'px'; cam.apply(); });

  /* ---------- the directory, under the scene (and for screen readers and keyboards) ---------- */
  var dir = document.getElementById('mx-directory');
  dir.innerHTML = '<header class="mx-dir-head"><span class="mx-pill">Directory</span><h2 id="mx-dir-h">Six floors, <em>by appointment.</em></h2>' +
    '<p>Browse freely. When something catches your eye, message us and we will source it for you. Open by appointment, at any hour.</p></header>' +
    '<ol class="mx-dir-list">' + levels.slice().reverse().map(function (l) {
      return '<li><div class="mx-dir-floor"><span class="mx-dir-no">' + l.number + '</span><div><h3>' + esc(l.name) + '</h3><p>' + esc(l.tagline) + '</p></div>' +
        '<button type="button" class="mx-dir-ride" data-to="' + l.number + '">Ride up ' + '<svg class="i" aria-hidden="true"><use href="#i-arrow"/></svg></button></div>' +
        '<ul>' + l.shops.map(function (s) { return '<li><a href="' + M.url.shop(s) + '">' + esc(s.name) + '</a></li>'; }).join('') + '</ul></li>';
    }).join('') + '</ol>' + M.sourcing() + '<p class="mx-credit">Photos are free-licence files from Wikimedia Commons. <a href="retail/credits.html">See every photo credit</a>.</p>';

  /* ---------- stepping into the lift, and riding it ---------- */
  var busy = false;
  function takeLift(to, shop) {
    if (busy) return; busy = true;
    if (scrollY > 10) scrollTo({ top: 0, behavior: M.reduce ? 'auto' : 'smooth' });
    hud.classList.add('away');
    vp.classList.add('mx-walking');
    cam._tx = 0; cam._ty = 0;
    // walk across the lobby and through the open doors of the cab
    cam.to({ x: 0, y: 0, z: M.Lift.CAB_Z, pitch: 0, yaw: 0 }, 2300, M.ease.inOut, function (p) {
      if (p > .55) built.cab.classList.add('entered');
      if (p > .2) built.cab.classList.add('open');
    }).then(function () {
      M.Lift.open({ from: 0, to: to, shop: shop, cam: cam, built: built, viewport: vp, onClose: walkBack });
    });
  }
  function walkBack() {
    built.cab.classList.remove('entered');
    cam.to(REST, 1800, M.ease.inOut).then(function () { built.cab.classList.remove('open'); vp.classList.remove('mx-walking'); hud.classList.remove('away'); busy = false; });
  }
  var hud = document.querySelector('.mx-hud-lobby');
  document.querySelector('.mx-take-lift').addEventListener('click', function () { takeLift(); });
  built.cabFront.addEventListener('click', function () { takeLift(); });
  // the departments on the shaft, the shops on the balconies and the directory all ride straight up
  vp.addEventListener('click', function (e) {
    var sf = e.target.closest('[data-floor]');
    if (sf && !busy && +sf.getAttribute('data-floor') > 0) takeLift(+sf.getAttribute('data-floor'));
  });
  dir.addEventListener('click', function (e) { var b = e.target.closest('.mx-dir-ride'); if (b) takeLift(+b.getAttribute('data-to')); });
  document.querySelector('[data-jump]').addEventListener('click', function (e) { e.preventDefault(); document.getElementById('directory').scrollIntoView({ behavior: M.reduce ? 'auto' : 'smooth' }); });

  /* ---------- look around: the pointer on a desk, a drag on a phone ---------- */
  cam.follow(vp, [6, 3]);
  var drag = null;
  vp.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') drag = { x: e.clientX, y: e.clientY, tx: cam._tx, ty: cam._ty }; });
  addEventListener('pointermove', function (e) {
    if (!drag) return;
    cam._tx = Math.max(-26, Math.min(26, drag.tx + (e.clientX - drag.x) * -.08));
    cam._ty = Math.max(-6, Math.min(14, drag.ty + (e.clientY - drag.y) * .06));
  });
  addEventListener('pointerup', function () { drag = null; });

  /* ---------- arriving ---------- */
  var SEEN = 'walvis-promenade-entered';
  function seen() { try { return sessionStorage.getItem(SEEN) === '1'; } catch (e) { return false; } }
  function markSeen() { try { sessionStorage.setItem(SEEN, '1'); } catch (e) {} }
  function focusTitle() { var h = document.querySelector('.mx-hud-title h1'); if (h) h.focus({ preventScroll: true }); }

  if (M.via === 'lift') {
    // back down by lift: step out of the cab and back into the lobby
    cam.set({ x: 0, y: 0, z: M.Lift.CAB_Z, pitch: 0 }); built.cab.classList.add('entered', 'open');
    M.Lift.arrive(vp);
    cam.to(REST, 2000, M.ease.inOut, function (p) { if (p > .4) built.cab.classList.remove('entered'); }).then(function () { built.cab.classList.remove('open'); focusTitle(); });
  } else if (!seen() && !M.reduce) {
    cam.set({ x: 0, y: -40, z: 3000, pitch: 4 });
    entrance();
  } else {
    cam.set({ x: 0, y: -30, z: 2300, pitch: 6 });
    cam.to(REST, 2200, M.ease.out).then(focusTitle);
  }
  markSeen();

  /* ---------- the entrance: a night facade, glass doors, and the light inside ---------- */
  function entrance() {
    var ent = document.createElement('div');
    ent.className = 'mx-ent'; ent.setAttribute('role', 'dialog'); ent.setAttribute('aria-modal', 'true'); ent.setAttribute('aria-labelledby', 'mx-ent-name');
    ent.innerHTML = '<div class="mx-ent-scene" aria-hidden="true"><div class="mx-ent-sky"></div><div class="mx-facade"><i class="mx-col"></i><i class="mx-col"></i><i class="mx-col"></i><i class="mx-col"></i>' +
        '<div class="mx-doorway"><div class="mx-door-light"></div><div class="mx-door mx-door-l"><i></i></div><div class="mx-door mx-door-r"><i></i></div><span class="mx-door-hint">Touch the doors</span></div><div class="mx-steps"></div></div><div class="mx-grain"></div></div>' +
      '<div class="mx-ent-sign"><span class="mx-sign-name" id="mx-ent-name">The Walvis Promenade</span><span class="mx-sign-sub">Private shopping, by Walvis Concierge</span></div>' +
      '<div class="mx-ent-ui"><button class="btn btn-teal mx-enter" type="button">Enter the Promenade</button><button class="mx-skip" type="button">Skip</button></div>';
    document.body.appendChild(ent); document.body.classList.add('no-scroll', 'mx-entering');
    var enterBtn = ent.querySelector('.mx-enter'), skipBtn = ent.querySelector('.mx-skip'), done = false;
    // the doors themselves can be clicked or tapped (the button does the same for keyboards)
    ent.querySelector('.mx-ent-scene').addEventListener('click', function (e) { if (e.target.closest('.mx-doorway')) open(); });
    setTimeout(function () { enterBtn.focus({ preventScroll: true }); }, 80);
    function finish(ms) {
      setTimeout(function () { ent.remove(); document.body.classList.remove('no-scroll', 'mx-entering'); removeEventListener('keydown', key); focusTitle(); }, ms);
    }
    function open() {
      if (done) return; done = true;
      var d = ent.querySelector('.mx-doorway').getBoundingClientRect();
      ent.querySelector('.mx-ent-scene').style.transformOrigin = (d.left + d.width / 2) + 'px ' + (d.top + d.height * .55) + 'px';
      ent.classList.add('open');                                        // the doors part, and you walk through them
      setTimeout(function () { ent.classList.add('through'); }, 1500);
      setTimeout(function () { cam.to(REST, 3600, M.ease.out); }, 700);   // the lobby comes towards you as you walk in
      finish(2500);
    }
    function skip() { if (done) return; done = true; ent.classList.add('through'); cam.to(REST, 900, M.ease.out); finish(500); }
    function key(e) {
      if (e.key === 'Escape') { e.preventDefault(); skip(); }
      else if ((e.key === 'Enter' || e.key === ' ') && document.activeElement !== skipBtn) { e.preventDefault(); open(); }
      else if (e.key === 'Tab') { e.preventDefault(); (document.activeElement === enterBtn ? skipBtn : enterBtn).focus(); }
    }
    enterBtn.addEventListener('click', open); skipBtn.addEventListener('click', skip);
    addEventListener('keydown', key);
  }
})();
