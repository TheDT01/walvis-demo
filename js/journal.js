/* The Journal: the opening book is pure CSS (css/journal.css). This only removes it when it has
   finished, and lets a click, Esc, Enter or Space skip it. Reduced-motion visitors never see it. */
(function () {
  'use strict';
  var root = document.documentElement, book = document.getElementById('jb');
  if (!book) return;
  if (!root.classList.contains('jr-intro-on')) { book.remove(); return; }
  // land the zoom with the book's "Journal" exactly on the page's own title: same size, same place
  var bk = book.querySelector('.jb-book'), word = book.querySelector('.jb-title b'), title = document.querySelector('.jr-title h1');
  if (title && word) {
    var zs = parseFloat(getComputedStyle(title).fontSize) / parseFloat(getComputedStyle(word).fontSize), r = title.getBoundingClientRect();
    var zy = (r.top + r.height / 2 - innerHeight / 2) - zs * (word.offsetTop + word.offsetHeight / 2 - bk.offsetHeight / 2);
    bk.style.setProperty('--zs', zs.toFixed(3)); bk.style.setProperty('--zy', zy.toFixed(1) + 'px');
  }
  function done() { root.classList.remove('jr-intro-on'); book.remove(); }
  function skip() { book.classList.add('skip'); }
  book.addEventListener('animationend', function (e) { if (e.target === book && e.animationName === 'jb-out') done(); });
  book.addEventListener('click', skip);
  addEventListener('keydown', function (e) { if (/^(Escape|Enter| )$/.test(e.key) && book.isConnected) { e.preventDefault(); skip(); } });
  setTimeout(done, 9000);                                   // never keep anyone waiting if animations are off
})();
