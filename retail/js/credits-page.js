/* =========================================================
   WALVIS CONCIERGE · retail/js/credits-page.js
   retail/credits.html: every photo in the Promenade, what it shows, who took it,
   its licence and a link to its page on Wikimedia Commons.
   ========================================================= */
(function () {
  'use strict';
  var M = window.Mall; if (!M) return;
  var esc = M.esc, box = document.getElementById('mx-credits');
  function known(v) { return v && !/^See /.test(v) ? esc(v) : '<span class="mx-muted">See the file page</span>'; }
  box.innerHTML = '<header class="mx-below-head"><span class="mx-pill">The Walvis Promenade</span><h1>Photo <em>credits.</em></h1>' +
    '<p>Every photo in the Promenade is a free-licence file from Wikimedia Commons, shown here with its author and licence. ' +
    'Where a licence asks for it, the photo is shared under the same licence. Photos show the kind of piece described, not the exact piece on offer, ' +
    'and brand names describe the pieces only.</p></header>' +
    M.P.levels.map(function (l) {
      return '<section class="mx-credit-floor"><h2>' + esc(M.levelLabel(l)) + '</h2><table class="mx-credit-table"><thead><tr><th scope="col">Piece</th><th scope="col">Photo shows</th><th scope="col">Author</th><th scope="col">Licence</th><th scope="col">Source</th></tr></thead><tbody>' +
        l.shops.map(function (s) {
          return s.items.filter(function (i) { return i.photo; }).map(function (i) {
            var p = i.photo;
            return '<tr><td><a href="' + M.url.item(i) + '">' + esc(i.title) + '</a><small>' + esc(s.name) + '</small></td><td>' + esc(p.shows || '') + '</td><td>' + known(p.author) + '</td><td>' + known(p.licence) + '</td>' +
              '<td>' + (p.file ? '<a href="' + esc(M.commonsPage(p.file)) + '" target="_blank" rel="noopener">Wikimedia Commons</a>' : 'Walvis') + '</td></tr>';
          }).join('');
        }).join('') + '</tbody></table></section>';
    }).join('') +
    '<p class="mx-404-act"><a class="btn btn-teal" href="retail/index.html">Back to the lobby</a></p>';
})();
