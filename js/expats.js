/* Concierge for Expats: the statement whose letters grow as you scroll, the steps line that fills,
   and the trust cards that tilt under the mouse. Scroll reveals come from js/site.js. */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function clamp(v) { return Math.min(1, Math.max(0, v)); }
  function ease(t) { return t * t * (3 - 2 * t); }

  var growSec = document.getElementById('statement'), growLine = document.getElementById('growLine'), growSub = document.getElementById('growSub');
  var letters = [];
  if (growLine && !reduce) {
    var text = growLine.textContent;
    growLine.setAttribute('aria-label', text); growLine.textContent = '';
    text.split(' ').forEach(function (word, wi, arr) {
      var w = document.createElement('span'); w.className = 'xp-w'; w.setAttribute('aria-hidden', 'true');
      word.split('').forEach(function (c) { var s = document.createElement('span'); s.className = 'xp-ch'; s.textContent = c; w.appendChild(s); letters.push(s); });
      growLine.appendChild(w);
      if (wi < arr.length - 1) growLine.appendChild(document.createTextNode(' '));
    });
  }

  var stepsEl = document.getElementById('steps');
  var stepItems = stepsEl ? [].slice.call(stepsEl.querySelectorAll('.xp-step')) : [];

  var queued = false;
  function update() {
    queued = false;
    var vh = innerHeight;
    if (growSec && letters.length) {
      var r = growSec.getBoundingClientRect(), total = r.height - vh, p = total > 0 ? clamp(-r.top / total) : 1, n = letters.length;
      for (var i = 0; i < n; i++) {
        var l = ease(clamp((p * 1.15 - (i / n) * .55) / .4));
        letters[i].style.opacity = (.16 + .84 * l).toFixed(3);
        letters[i].style.transform = 'translateY(' + ((1 - l) * .18).toFixed(3) + 'em) scale(' + (.5 + .5 * l).toFixed(3) + ')';
      }
      var sp = ease(clamp((p - .72) / .2));
      growSub.style.opacity = sp.toFixed(3);
      growSub.style.transform = 'translateY(' + ((1 - sp) * 18).toFixed(1) + 'px)';
    }
    if (stepsEl) {
      var sr = stepsEl.getBoundingClientRect(), mid = vh * .6;
      stepsEl.style.setProperty('--p', clamp((mid - sr.top) / sr.height).toFixed(3));
      stepItems.forEach(function (st) { st.classList.toggle('on', reduce || st.getBoundingClientRect().top + 40 < mid); });
    }
  }
  function req() { if (!queued) { queued = true; requestAnimationFrame(update); } }
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  update();

  if (!reduce) [].slice.call(document.querySelectorAll('.xp-tilt')).forEach(function (el) {
    el.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var b = el.getBoundingClientRect(), x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
      el.style.transform = 'rotateX(' + ((.5 - y) * 9).toFixed(2) + 'deg) rotateY(' + ((x - .5) * 11).toFixed(2) + 'deg)';
      el.style.setProperty('--mx', (x * 100).toFixed(1) + '%'); el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
    });
    el.addEventListener('pointerleave', function () { el.style.transform = ''; });
  });
})();
