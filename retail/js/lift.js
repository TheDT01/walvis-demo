/* =========================================================
   WALVIS CONCIERGE · retail/js/lift.js
   The glass lift. Inside the cab you look out across the atrium. Choose a floor: the doors slide
   shut, the cab starts with a soft jolt, gathers speed, and glides past the other floors (their shops,
   people and escalators go by, light sweeps over the glass at every slab) before slowing, settling
   and opening onto the floor you chose.
   Used from the lobby (you walk into the cab) and from every other page (the "Glass lift" button).
   ========================================================= */
(function () {
  'use strict';
  var M = window.Mall; if (!M) return;
  var esc = M.esc, levels = M.P.levels;
  var CAB_Z = 250;   // where you stand inside the cab

  function floorName(n) { return n ? levels[n - 1].name : 'Lobby'; }
  function floorLabel(n) { return n ? String(n) : 'G'; }

  // the inside of the cab, drawn over the scene: glass, frame, handrail, floor display and buttons
  function cabinHTML(from) {
    return '<div class="mx-cabin">' +
      '<span class="mx-cabin-streaks" aria-hidden="true"></span><span class="mx-cabin-sweep" aria-hidden="true"></span>' +
      '<span class="mx-cabin-ceiling" aria-hidden="true"><i></i></span><span class="mx-cabin-floor" aria-hidden="true"></span>' +
      '<span class="mx-cabin-post mx-cabin-post-l" aria-hidden="true"></span><span class="mx-cabin-post mx-cabin-post-r" aria-hidden="true"></span>' +
      '<span class="mx-cabin-rail" aria-hidden="true"></span><span class="mx-cabin-glass" aria-hidden="true"></span>' +
      '<span class="mx-cabin-door mx-cabin-door-l" aria-hidden="true"></span><span class="mx-cabin-door mx-cabin-door-r" aria-hidden="true"></span>' +
      '<div class="mx-display" role="status" aria-live="polite"><span class="mx-display-arrow" aria-hidden="true"></span><b>' + floorLabel(from) + '</b><span class="mx-display-text"><small>You are on</small><em>' + esc(floorName(from)) + '</em></span></div>' +
      '<div class="mx-panel" role="group" aria-label="Choose a floor"><span class="mx-panel-h">Choose your floor</span>' +
        levels.slice().reverse().map(function (l) {
          return '<button type="button" class="mx-floor-btn" data-to="' + l.number + '"' + (l.number === from ? ' aria-current="true"' : '') + '><i>' + l.number + '</i><span><b>' + esc(l.name) + '</b><small>' +
            l.shops.map(function (s) { return esc(s.name); }).join(' · ') + '</small></span></button>';
        }).join('') +
        '<button type="button" class="mx-floor-btn mx-floor-g" data-to="0"' + (from === 0 ? ' aria-current="true"' : '') + '><i>G</i><span><b>Lobby</b><small>The ground floor and the entrance</small></span></button>' +
        '<button type="button" class="mx-panel-close" data-stay>Stay on this floor</button></div>' +
    '</div>';
  }

  /* opts: { from, to, shop, cam, built, viewport, onClose }.
     Without a scene (cam) the lift builds its own over the page: its frosted doors close over the page you
     are on, and clear to show the atrium, so there is never a blank moment. */
  function open(opts) {
    var from = opts.from || 0, own = !opts.cam, wrap, viewport, world, cam, built;
    if (own) {
      wrap = document.createElement('div'); wrap.className = 'mx-ride'; wrap.setAttribute('role', 'dialog'); wrap.setAttribute('aria-modal', 'true'); wrap.setAttribute('aria-label', 'The glass lift');
      wrap.innerHTML = '<div class="mx-viewport"><div class="mx-world"></div></div>';
      document.body.appendChild(wrap); document.body.classList.add('no-scroll');
      viewport = wrap.querySelector('.mx-viewport'); world = wrap.querySelector('.mx-world');
      viewport.style.perspective = M.persp() + 'px';
      built = M.buildAtrium(world);
      cam = new M.Camera(world, M.persp()).set({ x: 0, y: built.eyeY(from), z: CAB_Z });
    } else { viewport = opts.viewport; cam = opts.cam; built = opts.built; wrap = viewport; }
    viewport.classList.add('mx-inside');
    (own ? wrap : viewport).insertAdjacentHTML('beforeend', cabinHTML(from));
    var cabin = (own ? wrap : viewport).querySelector('.mx-cabin'), display = cabin.querySelector('.mx-display'), riding = false, closed = false;
    var streaks = cabin.querySelector('.mx-cabin-streaks'), sweep = cabin.querySelector('.mx-cabin-sweep');
    function say(label, small, name) {
      display.querySelector('b').textContent = label; display.querySelector('small').textContent = small; display.querySelector('em').textContent = name;
    }
    if (own) {
      // the cab appears around you; its frosted doors slide shut over the page, then the glass clears onto the atrium
      cabin.classList.add('frosted', 'closing');
      requestAnimationFrame(function () { requestAnimationFrame(function () { cabin.classList.add('on'); }); });
      closed = true;
      M.wait(M.reduce ? 0 : 1250).then(function () { wrap.classList.add('on'); return M.wait(M.reduce ? 0 : 450); })
        .then(function () { cabin.classList.remove('frosted'); return M.wait(M.reduce ? 0 : 700); })
        .then(function () { cabin.classList.add('ready'); focusFirst(); });
    } else {
      requestAnimationFrame(function () { cabin.classList.add('on', 'ready'); });
      setTimeout(focusFirst, 450);
    }
    function focusFirst() { if (opts.to == null) { var b = cabin.querySelector('.mx-floor-btn:not([aria-current])'); if (b) b.focus({ preventScroll: true }); } }

    function close() {
      if (riding) return;
      removeEventListener('keydown', onKey);
      if (own) {
        cabin.classList.add('frosted'); cabin.classList.remove('ready');
        M.wait(500).then(function () { wrap.classList.remove('on'); return M.wait(450); })
          .then(function () { cabin.classList.remove('closing'); return M.wait(1000); })
          .then(function () { cabin.classList.remove('on'); return M.wait(500); })
          .then(function () { wrap.remove(); document.body.classList.remove('no-scroll'); });
      } else {
        cabin.classList.remove('on');
        setTimeout(function () { cabin.remove(); viewport.classList.remove('mx-inside'); if (opts.onClose) opts.onClose(); }, 500);
      }
    }
    function onKey(e) { if (e.key === 'Escape' && !riding) { e.preventDefault(); close(); } }
    addEventListener('keydown', onKey);
    cabin.addEventListener('click', function (e) {
      var b = e.target.closest('.mx-floor-btn');
      if (b && !b.hasAttribute('aria-current')) ride(+b.getAttribute('data-to'));
      if (e.target.closest('[data-stay]')) close();
    });

    function ride(to) {
      if (riding) return; riding = true;
      cabin.classList.add('riding'); cabin.classList.toggle('down', to < from);
      cabin.querySelectorAll('.mx-floor-btn').forEach(function (b) { b.classList.toggle('chosen', +b.getAttribute('data-to') === to); });
      var d = Math.abs(to - from), FH = built.FH;
      var ms = Math.min(12500, 2600 + d * 1450);                       // about four seconds for one floor
      var a = Math.min(.38, 1700 / ms);                                // a steady speed-up and slow-down, however far
      var y0 = built.eyeY(from), y1 = built.eyeY(to), dir = to > from ? -1 : 1, lastHalf = null;
      var url = to ? M.url.level(levels[to - 1], 'lift') + (opts.shop ? '&shop=' + encodeURIComponent(opts.shop) : '') : M.url.lobby() + '?via=lift';
      if (M.reduce) { M.go(url, 0); return; }
      say(floorLabel(from), to > from ? 'Going up to' : 'Going down to', floorName(to));
      var shut = closed ? Promise.resolve() : (cabin.classList.add('closing'), M.wait(1250));
      shut.then(function () { return M.wait(450); })
      .then(function () {
        // the first soft jolt as the motor takes the weight
        return cam.to({ y: y0 + dir * -4 }, 260, M.ease.inOutSine).then(function () { return cam.to({ y: y0 }, 240, M.ease.inOutSine); });
      }).then(function () {
        return cam.to({ y: y1 }, ms, function (t) { return M.ease.lift(t, a); }, function (p, e) {
          var y = y0 + (y1 - y0) * e, speed = Math.min(1, (M.ease.lift(Math.min(1, p + .005), a) - M.ease.lift(p, a)) / .005 * (1 - a));
          cam.roll = Math.sin(p * 47) * .08 * speed; cam.x = Math.sin(p * 29) * 1.4 * speed;
          // reflections slide down the glass as you climb, faster as the cab speeds up
          streaks.style.transform = 'translateY(' + ((y - y0) * -.9 % 900).toFixed(1) + 'px)'; streaks.style.opacity = (.15 + speed * .7).toFixed(2);
          // light sweeps across the glass as each floor's slab goes by
          var half = Math.floor(-y / FH + .5);
          if (lastHalf !== null && half !== lastHalf) { sweep.classList.remove('go'); void sweep.offsetWidth; sweep.classList.add('go'); }
          lastHalf = half;
          var now = Math.max(0, Math.min(levels.length, Math.round(-y / FH)));
          if (p < .82) say(floorLabel(now), now === from ? (to > from ? 'Going up to' : 'Going down to') : 'Passing', now === from ? floorName(to) : floorName(now));
          else say(floorLabel(to), 'Arriving at', floorName(to));
          display.classList.toggle('tick', false);
        });
      }).then(function () {
        // the cab settles: a breath past the floor, then level
        return cam.to({ y: y1 + dir * 3, roll: 0, x: 0 }, 300, M.ease.out).then(function () { return cam.to({ y: y1 }, 420, M.ease.inOutSine); });
      }).then(function () {
        streaks.style.opacity = 0;
        say(floorLabel(to), 'Welcome to', floorName(to));
        cabin.classList.add('arrived');                                  // the chime, then the doors open
        return M.wait(700);
      }).then(function () {
        cabin.classList.remove('closing');
        return M.wait(1100);
      }).then(function () {
        cabin.classList.add('stepping');                                 // step out onto the floor
        cam.to({ z: CAB_Z - 520, pitch: -1.5 }, 1500, M.ease.inOut);
        return M.wait(1050);
      }).then(function () { M.go(url, 420); });
    }
    if (opts.to != null && opts.to !== from) setTimeout(function () { ride(opts.to); }, own ? 2600 : 700);
    return { ride: ride, close: close };
  }

  // arriving on a page by lift: the cab's frame is still around you as you step out
  function arrive(viewport) {
    if (M.reduce) return Promise.resolve();
    var a = document.createElement('div'); a.className = 'mx-cabin mx-cabin-arrive on'; a.setAttribute('aria-hidden', 'true');
    a.innerHTML = '<span class="mx-cabin-ceiling"><i></i></span><span class="mx-cabin-floor"></span><span class="mx-cabin-post mx-cabin-post-l"></span><span class="mx-cabin-post mx-cabin-post-r"></span><span class="mx-cabin-rail"></span><span class="mx-cabin-glass"></span>';
    (viewport || document.body).appendChild(a);
    setTimeout(function () { a.classList.add('away'); }, 250);
    return M.wait(1900).then(function () { a.remove(); });
  }

  // the "Glass lift" button on every page except the lobby, where the lift itself is in view
  function button(current) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'mx-lift-btn';
    b.innerHTML = '<span class="mx-lift-ico" aria-hidden="true"><i></i><i></i></span><span>Glass lift</span><b>' + floorLabel(current) + '</b>';
    b.setAttribute('aria-label', 'Take the glass lift. You are on ' + (current ? 'level ' + current + ', ' + floorName(current) : 'the lobby'));
    b.addEventListener('click', function () { open({ from: current }); });
    document.body.appendChild(b);
    return b;
  }

  M.Lift = { open: open, arrive: arrive, button: button, CAB_Z: CAB_Z };
})();
