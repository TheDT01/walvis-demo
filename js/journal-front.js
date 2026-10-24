/* =========================================================
   WALVIS CONCIERGE · js/journal-front.js
   The Journal as a news portal, drawn from js/journal-data.js
   (pictures from js/journal-art.js, or photos when a story has one). Addresses:
     journal.html               the front page
     journal.html#/latest       every story, newest first
     journal.html#/s/travel     one section
     journal.html#/story/<id>   one story, opened over the page
   ========================================================= */
(function () {
  'use strict';
  var J = window.WALVIS_JOURNAL, app = document.getElementById('jx-app');
  if (!J || !app) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var ARROW = '<svg class="i" aria-hidden="true"><use href="#i-arrow"/></svg>';
  var CHAT = '<svg class="i" aria-hidden="true"><use href="#i-chat"/></svg>';
  var now = new Date();

  /* ---------- the stories, newest first ---------- */
  J.stories.forEach(function (s) {
    s.when = s.date ? new Date(s.date.replace(' ', 'T')) : new Date(now.getTime() - (s.ago || 0) * 3600000);
  });
  var stories = J.stories.slice().sort(function (a, b) { return b.when - a.when; });
  var byId = {}, secs = {};
  stories.forEach(function (s) { byId[s.id] = s; });
  J.sections.forEach(function (s, i) { s.n = i + 1; secs[s.id] = s; });
  function inSec(id) { return stories.filter(function (s) { return s.s === id; }); }
  function pictured(list) { return list.filter(function (s) { return s.kind !== 'brief'; }); }
  var lead = stories.filter(function (s) { return s.kind === 'lead'; })[0] || pictured(stories)[0];

  /* ---------- small helpers ---------- */
  function plain(html) { var t = document.createElement('textarea'); t.innerHTML = html; return t.value; }
  function attr(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
  function wa(msg) { return typeof waLink === 'function' ? waLink(msg) : '#'; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function day(d) { return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear(); }
  function clock(d) { return pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function ago(d) {
    var m = Math.round((now - d) / 60000);
    if (m < 2) return 'Just now';
    if (m < 60) return m + ' min ago';
    if (m < 60 * 24) { var h = Math.round(m / 60); return h + (h === 1 ? ' hour ago' : ' hours ago'); }
    if (m < 60 * 48) return 'Yesterday';
    return d.getDate() + ' ' + MONTHS[d.getMonth()].slice(0, 3);
  }
  function href(s) { return '#/story/' + s.id; }
  function sec(s) { return secs[s.s] || { name: '', id: '' }; }
  function meta(s) { return '<span class="jx-meta"><time datetime="' + s.when.toISOString() + '">' + ago(s.when) + '</time> &middot; ' + s.read + ' min read</span>'; }
  function picture(s) {
    if (s.img) return '<img src="images/' + s.img + '" alt="" loading="lazy">';
    var a = s.art || ['compass', 'plum'];
    return window.JournalArt ? JournalArt(a[0], a[1], s.id) : '';
  }
  function fig(s, extra) { return '<figure class="jx-ph' + (extra || '') + '">' + picture(s) + '</figure>'; }

  // one story as a card. size: l (large), m (medium), h (horizontal, small picture), t (text only)
  function card(s, size, i) {
    size = size || 'm';
    var pic = size !== 't' && s.kind !== 'brief';
    return '<article class="jx-card jx-' + size + (pic ? '' : ' jx-nopic') + ' jx-r' + (i ? ' jx-d' + (i % 3) : '') + '">' +
      '<a class="jx-cover-link" href="' + href(s) + '" aria-label="' + attr(plain(s.t)) + '"></a>' +
      (pic ? fig(s) : '') + '<div class="jx-cc">' +
      '<span class="jx-k"><a href="#/s/' + s.s + '">' + sec(s).name + '</a>' + (s.kind === 'brief' ? ' &middot; In brief' : '') + '</span>' +
      '<h3><a href="' + href(s) + '">' + s.t + '</a></h3>' +
      (size === 'l' || size === 'm' ? '<p class="jx-dek">' + s.dek + '</p>' : '') + meta(s) + '</div></article>';
  }
  // the running list of the newest stories
  function feed(list, title, more) {
    return '<aside class="jx-feed jx-r"><h2 class="jx-label"><i class="jx-live" aria-hidden="true"></i>' + (title || 'Latest') + '</h2><ol>' + list.map(function (s) {
      return '<li><a href="' + href(s) + '"><time datetime="' + s.when.toISOString() + '">' + (now - s.when < 864e5 ? clock(s.when) : ago(s.when)) + '</time>' +
        '<span><em>' + sec(s).name + '</em><b>' + s.t + '</b></span></a></li>';
    }).join('') + '</ol>' + (more === false ? '' : '<a class="jx-all" href="#/latest">All the latest news ' + ARROW + '</a>') + '</aside>';
  }

  /* ---------- the masthead dateline and The Wire ---------- */
  var today = document.getElementById('jx-today'), issue = document.querySelector('.jx-issue');
  if (today) today.textContent = 'Dhaka · ' + DAYS[now.getDay()] + ', ' + day(now);
  if (issue) issue.textContent = J.demo ? 'Demo edition · sample stories' : 'Updated ' + clock(stories[0].when);
  var tag = document.querySelector('.jx-tagline'); if (tag && J.issue.line) tag.innerHTML = J.issue.line;

  var wire = document.getElementById('jx-wire');
  if (wire) {
    var lines = stories.slice(0, 12).map(function (s) {
      return '<a href="' + href(s) + '"><time>' + (now - s.when < 864e5 ? clock(s.when) : ago(s.when)) + '</time>' + s.t + '</a>';
    }).join('');
    wire.innerHTML = '<span class="jx-wire-k"><i class="jx-live" aria-hidden="true"></i>Latest</span><div class="jx-wire-track"><div class="jx-wire-run">' + lines +
      '</div><div class="jx-wire-run" aria-hidden="true">' + lines.replace(/<a /g, '<a tabindex="-1" ') + '</div></div>';
  }

  /* ---------- the section menu ---------- */
  var navIn = document.querySelector('#jx-nav .jx-nav-in');
  navIn.innerHTML = '<a href="#/" data-k="front">Home</a><a href="#/latest" data-k="latest">Latest</a>' +
    J.sections.map(function (s) { return '<a href="#/s/' + s.id + '" data-k="' + s.id + '">' + s.name + '</a>'; }).join('');

  /* =========================================================
     THE FRONT PAGE
     ========================================================= */
  function secHead(s, cls) {
    return '<header class="jx-mh jx-r' + (cls || '') + '"><h2><a href="#/s/' + s.id + '">' + s.name + '</a></h2><p>' + s.dek + '</p>' +
      '<a class="jx-all" href="#/s/' + s.id + '">More ' + s.name + ' ' + ARROW + '</a></header>';
  }

  function topBlock() {
    var tops = pictured(stories).filter(function (s) { return s !== lead && s.kind === 'top'; }).slice(0, 2);
    if (tops.length < 2) tops = pictured(stories).filter(function (s) { return s !== lead; }).slice(0, 2);
    return '<section class="jx-top"><div class="wrap jx-top-grid">' +
      '<article class="jx-lead jx-r"><a class="jx-cover-link" href="' + href(lead) + '" aria-label="' + attr(plain(lead.t)) + '"></a>' + fig(lead) +
        '<div class="jx-cc"><span class="jx-k"><a href="#/s/' + lead.s + '">' + sec(lead).name + '</a></span><h2><a href="' + href(lead) + '">' + lead.t + '</a></h2>' +
        '<p class="jx-dek">' + lead.dek + '</p>' + meta(lead) + '</div></article>' +
      '<div class="jx-top-mid">' + tops.map(function (s, i) { return card(s, 'm', i + 1); }).join('') + '</div>' +
      feed(stories.filter(function (s) { return s !== lead && tops.indexOf(s) < 0; }).slice(0, 9)) +
    '</div></section>';
  }

  function moreHeadlines(skip) {
    var list = pictured(stories).filter(function (s) { return skip.indexOf(s) < 0; }).slice(0, 4);
    return '<section class="jx-strip"><div class="wrap"><div class="jx-row4">' + list.map(function (s, i) { return card(s, 'm', i); }).join('') + '</div></div></section>';
  }

  // three layouts, used in turn, so the page reads like a newspaper rather than a grid
  function block(s, k, shown) {
    // stories already on the page go to the back of the queue, so each block feels new
    var list = inSec(s.id).filter(function (x) { return x !== lead; });
    list = list.filter(function (x) { return shown.indexOf(x) < 0; }).concat(list.filter(function (x) { return shown.indexOf(x) > -1; }));
    var pics = pictured(list), briefs = list.filter(function (x) { return x.kind === 'brief'; });
    if (!list.length) return '';
    var body, cells;
    if (k % 3 === 0) {
      body = '<div class="jx-b-a">' + (pics[0] ? card(pics[0], 'l') : '') + '<div class="jx-b-list">' +
        pics.slice(1, 4).map(function (x, i) { return card(x, 'h', i + 1); }).join('') + briefs.slice(0, 2).map(function (x) { return card(x, 't'); }).join('') + '</div></div>';
    } else if (k % 3 === 1) {
      cells = pics.slice(0, 3).map(function (x, i) { return card(x, 'm', i); });
      if (briefs.length) cells.push('<div class="jx-b-briefs">' + briefs.slice(0, 3).map(function (x) { return card(x, 't'); }).join('') + '</div>');
      body = '<div class="jx-row4 jx-cols-' + cells.length + '">' + cells.join('') + '</div>';
    } else {
      cells = pics.slice(0, 3).map(function (x, i) { return card(x, i ? 'm' : 'l', i); });
      if (cells.length < 3 && briefs.length) cells.push('<div class="jx-b-briefs">' + briefs.slice(0, 3).map(function (x) { return card(x, 't'); }).join('') + '</div>');
      body = '<div class="jx-b-c jx-cols-' + cells.length + '">' + cells.join('') + '</div>' +
        (pics.length >= 3 && briefs.length ? '<div class="jx-b-cb">' + briefs.slice(0, 3).map(function (x) { return card(x, 't'); }).join('') + '</div>' : '');
    }
    return '<section class="jx-block jx-block-' + (k % 3) + '" id="jx-' + s.id + '"><div class="wrap">' + secHead(s) + body + '</div></section>';
  }

  function inBrief() {
    var list = stories.filter(function (s) { return s.kind === 'brief'; }).slice(0, 8);
    if (!list.length) return '';
    return '<section class="jx-briefs"><div class="wrap"><header class="jx-mh jx-r"><h2>In brief</h2><p>The short news of the day, in a line or two.</p></header>' +
      '<ol class="jx-brief-grid">' + list.map(function (s, i) {
        return '<li class="jx-r' + (i % 3 ? ' jx-d' + (i % 3) : '') + '"><a href="' + href(s) + '"><span class="jx-k">' + sec(s).name + '</span><b>' + s.t + '</b><span class="jx-bdek">' + s.dek + '</span>' + meta(s) + '</a></li>';
      }).join('') + '</ol></div></section>';
  }

  function picks() {
    var list = pictured(stories).filter(function (s) { return s !== lead; }).sort(function (a, b) { return b.read - a.read; }).slice(0, 5);
    return '<section class="jx-picks"><div class="wrap jx-picks-grid">' +
      '<div class="jx-picks-head jx-r"><span class="jx-label">The long read</span><h2>Editor&rsquo;s <em>picks</em></h2><p>The stories worth sitting down with this week.</p></div>' +
      '<ol>' + list.map(function (s, i) {
        return '<li class="jx-r' + (i % 3 ? ' jx-d' + (i % 3) : '') + '"><a href="' + href(s) + '"><span class="jx-n">' + (i + 1) + '</span>' + fig(s, ' jx-sq') +
          '<span><em>' + sec(s).name + '</em><b>' + s.t + '</b><small>' + s.read + ' min read</small></span></a></li>';
      }).join('') + '</ol></div></section>';
  }

  function seasonBlock() {
    var m = now.getMonth() + 1;
    return '<section class="jx-season"><div class="wrap jx-season-grid">' +
      '<div class="jx-cal jx-r"><h2 class="jx-label">Coming up</h2><ul>' + J.calendar.map(function (c) {
        return '<li><span class="jx-cal-m">' + c.m + '</span><span><b>' + c.t + '</b><small>' + c.p + '</small></span></li>'; }).join('') + '</ul>' +
        '<p class="jx-fine">Dates move from year to year and are confirmed nearer the time.</p></div>' +
      '<div class="jx-where jx-r jx-d1"><h2 class="jx-label">The travel season guide</h2>' +
        '<div class="jx-where-months" aria-hidden="true"><span></span><div>' + MONTHS.map(function (x, i) { return '<i' + (i + 1 === m ? ' class="now"' : '') + '>' + x.charAt(0) + '</i>'; }).join('') + '</div></div>' +
        '<ul>' + J.where.map(function (w) {
          var best = MONTHS.filter(function (x, i) { return w.m.indexOf(i + 1) > -1; }).join(', ');
          return '<li><div class="jx-where-p"><b>' + w.place + '</b><small>' + w.region + '</small></div><div class="jx-where-bar" role="img" aria-label="Best months: ' + best + '">' +
            MONTHS.map(function (x, i) { return '<i class="' + (w.m.indexOf(i + 1) > -1 ? 'on' : '') + (i + 1 === m ? ' now' : '') + '"></i>'; }).join('') + '</div></li>';
        }).join('') + '</ul><p class="jx-fine">Best months, for most travellers. The outlined column is this month.</p></div>' +
    '</div></section>';
  }

  function deskStrip() {
    return '<section class="jx-deskstrip"><div class="wrap jx-ds-grid">' +
      '<div class="jx-r"><span class="jx-label">The concierge desk</span><h2>Read something <em>that caught your eye?</em></h2>' +
        '<p>Walvis members can ask us about anything in The Journal: a table, a trip, a piece, a ticket. A real person replies on WhatsApp.</p></div>' +
      '<form class="jx-desk jx-r jx-d1" data-ask="desk"><label class="jx-sr" for="jx-desk-q">Your question</label>' +
        '<textarea id="jx-desk-q" name="q" rows="3" placeholder="Ask us anything about a story" required></textarea>' +
        '<div class="jx-desk-row"><button class="jx-send" type="submit">' + CHAT + ' Ask on WhatsApp</button>' +
        '<a class="jx-all" href="' + attr(wa('Hello Walvis, please send me The Journal headlines on WhatsApp.')) + '" target="_blank" rel="noopener">Get the headlines on WhatsApp ' + ARROW + '</a></div></form>' +
    '</div></section>';
  }

  function front() {
    var tops = pictured(stories).filter(function (s) { return s !== lead && s.kind === 'top'; }).slice(0, 2);
    var shown = [lead].concat(tops);
    var strip = pictured(stories).filter(function (s) { return shown.indexOf(s) < 0; }).slice(0, 4);
    shown = shown.concat(strip);
    var blocks = J.sections.map(function (s, k) { return block(s, k, shown); });
    return topBlock() + moreHeadlines([lead].concat(tops)) +
      blocks.slice(0, 3).join('') + inBrief() +
      blocks.slice(3, 6).join('') + picks() +
      blocks.slice(6, 9).join('') + seasonBlock() +
      blocks.slice(9).join('') + deskStrip();
  }

  /* =========================================================
     LATEST: everything, newest first, grouped by day
     ========================================================= */
  function latest() {
    var out = '', lastDay = '';
    stories.forEach(function (s, i) {
      var d = day(s.when);
      if (d !== lastDay) { out += (lastDay ? '</ol>' : '') + '<h3 class="jx-day">' + (d === day(now) ? 'Today' : d) + '</h3><ol class="jx-river">'; lastDay = d; }
      out += '<li class="jx-r"><time datetime="' + s.when.toISOString() + '">' + clock(s.when) + '</time>' + card(s, s.kind === 'brief' ? 't' : 'h') + '</li>';
    });
    return '<section class="jx-secpage"><div class="wrap"><header class="jx-sh jx-r"><span class="jx-no">Every story, newest first</span><h2>Latest news</h2>' +
      '<span class="jr-rule" aria-hidden="true"><i></i></span></header><div class="jx-latest">' + out + '</ol></div></div></section>' + deskStrip();
  }

  /* =========================================================
     ONE SECTION
     ========================================================= */
  function section(id) {
    var s = secs[id], list = inSec(id), pics = pictured(list), briefs = list.filter(function (x) { return x.kind === 'brief'; });
    var others = J.sections.filter(function (x) { return x.id !== id; });
    return '<section class="jx-secpage"><div class="wrap">' +
      '<header class="jx-sh jx-r"><span class="jx-no">' + list.length + ' ' + (list.length === 1 ? 'story' : 'stories') + '</span>' +
        '<h2>' + s.name + '</h2><span class="jr-rule" aria-hidden="true"><i></i></span><p>' + s.dek + '</p></header>' +
      '<div class="jx-sec-top">' + (pics[0] ? card(pics[0], 'l') : '') +
        feed(stories.filter(function (x) { return x.s !== id; }).slice(0, 7), 'Latest elsewhere') + '</div>' +
      (pics.length > 1 ? '<div class="jx-grid">' + pics.slice(1).map(function (x, i) { return card(x, 'm', i); }).join('') + '</div>' : '') +
      (briefs.length ? '<div class="jx-b-cb jx-sec-briefs">' + briefs.map(function (x) { return card(x, 't'); }).join('') + '</div>' : '') +
      '<nav class="jx-more-secs" aria-label="Other sections"><span class="jx-label">More in The Journal</span>' +
        '<a href="#/">Home</a><a href="#/latest">Latest</a>' + others.map(function (x) { return '<a href="#/s/' + x.id + '">' + x.name + '</a>'; }).join('') + '</nav>' +
    '</div></section>' + deskStrip();
  }

  /* =========================================================
     THE READER: a story opens over the page
     ========================================================= */
  var reader = document.createElement('div');
  reader.className = 'jx-reader jr-paper'; reader.id = 'jx-reader'; reader.hidden = true;
  reader.setAttribute('role', 'dialog'); reader.setAttribute('aria-modal', 'true'); reader.setAttribute('aria-labelledby', 'jx-rt');
  document.body.appendChild(reader);
  var opener = null, readerOpen = false;

  function article(s) {
    var i = stories.indexOf(s), next = stories[(i + 1) % stories.length];
    var more = inSec(s.s).filter(function (x) { return x !== s; }).slice(0, 3);
    if (more.length < 3) more = more.concat(pictured(stories).filter(function (x) { return x !== s && x.s !== s.s; }).slice(0, 3 - more.length));
    return '<div class="jx-progress" aria-hidden="true"><i></i></div>' +
      '<div class="jx-rbar"><button class="jx-close" type="button" data-close>' + ARROW + '<span>The Journal</span></button>' +
        '<a class="jx-rsec" href="#/s/' + s.s + '">' + sec(s).name + '</a>' +
        '<button class="jx-copy" type="button" data-copy>Copy link</button></div>' +
      '<article class="jx-article">' +
        '<header class="jx-ahead"><span class="jx-k"><a href="#/s/' + s.s + '">' + sec(s).name + '</a></span><h1 id="jx-rt">' + s.t + '</h1><p class="jx-dek">' + s.dek + '</p>' +
          '<p class="jx-byline">The Walvis Journal &middot; <time datetime="' + s.when.toISOString() + '">' + day(s.when) + ', ' + clock(s.when) + '</time> &middot; ' + s.read + ' min read</p></header>' +
        (s.kind !== 'brief' ? fig(s, ' jx-ahero') : '') +
        '<div class="jx-agrid"><div class="jx-abody">' + s.body.map(function (p) { return '<p>' + p + '</p>'; }).join('') +
          '<p class="jx-sign">&#10042;</p>' +
          '<div class="jx-help"><div><b>Interested in this?</b><span>Walvis members can ask our concierge about anything in this story.</span></div>' +
          '<a class="jx-send" href="' + attr(wa('Hello Walvis, I read “' + plain(s.t) + '” in The Journal and have a question about it.')) + '" target="_blank" rel="noopener">' + CHAT + ' Ask the concierge</a></div></div>' +
          '<aside class="jx-aside">' + feed(stories.filter(function (x) { return x !== s; }).slice(0, 6), 'Latest news') + '</aside></div>' +
        '<footer class="jx-afoot"><h2 class="jx-label">More from The Journal</h2><div class="jx-grid">' + more.map(function (x) { return card(x, 'm'); }).join('') + '</div>' +
          '<a class="jx-next" href="' + href(next) + '"><span class="jx-label">Next story</span><b>' + next.t + '</b>' + ARROW + '</a></footer>' +
      '</article>';
  }

  function openReader(s) {
    if (!readerOpen) opener = document.activeElement;
    reader.innerHTML = article(s); reader.hidden = false; reader.scrollTop = 0;
    document.title = plain(s.t) + ' · The Journal · Walvis Concierge';
    document.body.classList.add('no-scroll', 'jx-reading');
    requestAnimationFrame(function () { reader.classList.add('open'); });
    readerOpen = true; watch(reader);
    var c = reader.querySelector('[data-close]'); if (c) c.focus({ preventScroll: true });
  }
  function closeReader() {
    if (!readerOpen) return;
    readerOpen = false; reader.classList.remove('open');
    document.body.classList.remove('no-scroll', 'jx-reading');
    document.title = 'The Journal · Walvis Concierge';
    setTimeout(function () { if (!readerOpen) { reader.hidden = true; reader.innerHTML = ''; } }, reduce ? 0 : 450);
    if (opener && opener.focus && document.contains(opener)) opener.focus({ preventScroll: true });
  }
  reader.addEventListener('scroll', function () {
    var bar = reader.querySelector('.jx-progress i'); if (!bar) return;
    var max = reader.scrollHeight - reader.clientHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, reader.scrollTop / max) : 0) + ')';
  }, { passive: true });

  /* ---------- buttons and forms ---------- */
  function backHash() { return base === 'front' ? '#/' : base === 'latest' ? '#/latest' : '#/s/' + base; }
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target : null; if (!t) return;
    var b;
    if (t.closest('[data-close]')) { location.hash = backHash(); return; }
    if ((b = t.closest('[data-copy]'))) {
      var done = function () { b.textContent = 'Link copied'; setTimeout(function () { b.textContent = 'Copy link'; }, 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done, function () {}); else done();
    }
  });
  document.addEventListener('submit', function (e) {
    var f = e.target; if (!f.matches || !f.matches('[data-ask]')) return;
    e.preventDefault();
    var ta = f.querySelector('textarea'), q = (ta.value || '').trim();
    if (!q) { ta.focus(); return; }
    window.open(wa('Hello Walvis, a question from The Journal: ' + q), '_blank', 'noopener');
  });
  addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && readerOpen) { e.preventDefault(); location.hash = backHash(); }
    if (e.key === 'Tab' && readerOpen) {   // keep the keyboard inside an open story
      var f = reader.querySelectorAll('a[href], button, textarea'), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- things rise gently into view ---------- */
  var io = ('IntersectionObserver' in window && !reduce) ? new IntersectionObserver(function (es) {
    es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
  }, { threshold: .06, rootMargin: '0px 0px -30px 0px' }) : null;
  function watch(root) {
    root.querySelectorAll('.jx-r:not(.in)').forEach(function (el) { if (io && root !== reader) io.observe(el); else el.classList.add('in'); });
  }

  /* =========================================================
     ROUTES
     ========================================================= */
  var base = null, shell = document.querySelector('.jx-shell');
  function render(key, scroll) {
    if (key === base) return;
    base = key;
    app.innerHTML = key === 'front' ? front() : key === 'latest' ? latest() : section(key);
    watch(app);
    navIn.querySelectorAll('a').forEach(function (a) {
      if (a.getAttribute('data-k') === key) { a.setAttribute('aria-current', 'page'); a.parentNode.scrollLeft = a.offsetLeft - 20; }
      else a.removeAttribute('aria-current');
    });
    if (scroll && shell) scrollTo({ top: shell.getBoundingClientRect().top + scrollY - 96, behavior: 'auto' });
  }
  function route(first) {
    var h = location.hash, m;
    if ((m = h.match(/^#\/story\/([\w-]+)/)) && byId[m[1]]) {
      if (base === null) render('front', false);
      openReader(byId[m[1]]); return;
    }
    var wasOpen = readerOpen; closeReader();
    if ((m = h.match(/^#\/s\/([\w-]+)/)) && secs[m[1]]) render(m[1], !wasOpen);
    else if (h === '#/latest') render('latest', !wasOpen);
    else render('front', !first && !wasOpen);
  }
  addEventListener('hashchange', function () { route(false); });
  route(true);
})();
