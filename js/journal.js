/* =========================================================
   The Journal: the book film plays when the page opens, then fades into the page.
   Click, tap, Skip, Esc, Enter or Space skips it. If the browser will not play it
   (or it is slow to arrive), the page simply appears. Visitors who ask their device
   for reduced motion never see it (the class is set in the page's <head>).
   ========================================================= */
(function () {
  'use strict';
  var root = document.documentElement, intro = document.getElementById('jrIntro');
  if (!intro) return;
  if (!root.classList.contains('jr-intro-on')) { intro.remove(); return; }

  var film = intro.querySelector('video'), done = false, started = false, stall;

  function finish() {
    if (done) return; done = true;
    clearTimeout(stall);
    intro.classList.add('out');                                   // fades over .9s (css/journal.css)
    setTimeout(function () {
      root.classList.remove('jr-intro-on');                       // the page's opening words now rise in
      try { film.pause(); } catch (e) {}
      intro.remove();
    }, 900);
  }
  // give up gracefully if the film has not started within a few seconds, or stops for too long
  function watchdog(ms) { clearTimeout(stall); stall = setTimeout(finish, ms); }

  film.addEventListener('playing', function () { started = true; watchdog(14000); });
  film.addEventListener('waiting', function () { if (started) watchdog(3500); });
  film.addEventListener('ended', finish);
  film.addEventListener('error', finish);
  intro.addEventListener('click', finish);
  addEventListener('keydown', function (e) { if (!done && /^(Escape|Enter| )$/.test(e.key)) { e.preventDefault(); finish(); } });
  // leaving with the back button and returning should not replay it
  addEventListener('pageshow', function (e) { if (e.persisted) finish(); });

  watchdog(4000);
  var p = film.play();
  if (p && p.catch) p.catch(finish);
})();
