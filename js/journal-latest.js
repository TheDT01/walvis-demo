/* The latest stories from The Journal (js/journal-data.js), shown on the home page with their
   illustrations (js/journal-art.js) or photos. Runs before js/site.js, so the cards get the same
   glass, reveal and swipe as the rest of the page. */
(function () {
  'use strict';
  var J = window.WALVIS_JOURNAL, row = document.getElementById('journal-latest');
  if (!J || !row) return;
  var names = {}, now = Date.now(); J.sections.forEach(function (s) { names[s.id] = s.name; });
  function when(s) { return s.date ? new Date(s.date.replace(' ', 'T')).getTime() : now - (s.ago || 0) * 3600000; }
  var latest = J.stories.filter(function (s) { return s.kind !== 'brief'; }).sort(function (a, b) { return when(b) - when(a); }).slice(0, 3);
  row.innerHTML = latest.map(function (s, i) {
    var link = 'journal.html#/story/' + s.id, a = s.art || ['compass', 'plum'];
    var pic = s.img ? '<img src="images/' + s.img + '" alt="" loading="lazy">' : (window.JournalArt ? JournalArt(a[0], a[1], s.id) : '');
    return '<article class="world reveal' + (i ? ' d' + i : '') + '"><a class="ph jx-home-art" href="' + link + '" tabindex="-1" aria-hidden="true">' + pic + '</a>' +
      '<span class="k">' + names[s.s] + '</span><h3><a href="' + link + '">' + s.t + '</a></h3><p>' + s.dek + '</p>' +
      '<a class="link" href="' + link + '">Read the story <svg class="i"><use href="#i-arrow"/></svg></a></article>';
  }).join('');
})();
