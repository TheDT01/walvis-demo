/* =========================================================
   WALVIS CONCIERGE · js/journal-art.js
   The Journal's illustrations: flat, poster-style artwork drawn in SVG, one per story,
   so the demo needs no photographs. JournalArt('watch', 'night') returns the SVG markup.
   The scene is drawn on an 800 x 600 canvas and cropped to fit any frame; the subject
   stays in the middle. When a story has its own photo (img: in js/journal-data.js),
   the photo is shown instead.
   ========================================================= */
(function () {
  'use strict';
  // bg: the ground, mid: the second tone, acc: the accent (gold, sun), lt: light, ink: darkest
  var PAL = {
    plum:    { bg: '#3a1035', mid: '#5e2258', acc: '#e3b36a', lt: '#f3e8d6', ink: '#1c0719', hi: '#5cc4c0' },
    teal:    { bg: '#0f5755', mid: '#167a76', acc: '#e3b36a', lt: '#f3e8d6', ink: '#06302f', hi: '#9ae6df' },
    oxblood: { bg: '#5e1a26', mid: '#83283a', acc: '#e7c27d', lt: '#f6e9d8', ink: '#2c0a11', hi: '#d98b7c' },
    navy:    { bg: '#14213d', mid: '#25385f', acc: '#e0b45c', lt: '#f3ead8', ink: '#0a1224', hi: '#7fa6d6' },
    night:   { bg: '#0f0c22', mid: '#262046', acc: '#e8c27a', lt: '#f3ead8', ink: '#05040e', hi: '#8b7fd6' },
    sage:    { bg: '#5f6f52', mid: '#7f9170', acc: '#f1d9a6', lt: '#f5eedf', ink: '#28331f', hi: '#c9d7b3' },
    forest:  { bg: '#1d3a2c', mid: '#2d5a43', acc: '#e2c27a', lt: '#f1e6d2', ink: '#0b1c14', hi: '#8fc4a2' },
    ochre:   { bg: '#c3812f', mid: '#dca04f', acc: '#3a1035', lt: '#f8ecd4', ink: '#4a2508', hi: '#f6d79a' },
    rose:    { bg: '#c58e88', mid: '#dfb3a7', acc: '#4a1c2c', lt: '#fbf0e8', ink: '#3a1422', hi: '#f4d3c4' },
    sand:    { bg: '#e9dcc2', mid: '#d4bf96', acc: '#11908d', lt: '#fbf5e9', ink: '#3a1035', hi: '#c66f4f' },
    coral:   { bg: '#d9694f', mid: '#ec8f6c', acc: '#1c2d4a', lt: '#fcefe2', ink: '#3d1610', hi: '#ffd2a8' },
    lagoon:  { bg: '#2f8c9a', mid: '#5bb3bd', acc: '#f6d48b', lt: '#f4fbf8', ink: '#0d3a42', hi: '#bfe8e6' }
  };

  function f(n) { return Math.round(n * 10) / 10; }
  function rect(x, y, w, h, fill, ex) { return '<rect x="' + f(x) + '" y="' + f(y) + '" width="' + f(w) + '" height="' + f(h) + '" fill="' + fill + '"' + (ex || '') + '/>'; }
  function circ(x, y, r, fill, ex) { return '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(r) + '" fill="' + fill + '"' + (ex || '') + '/>'; }
  function ell(x, y, rx, ry, fill, ex) { return '<ellipse cx="' + f(x) + '" cy="' + f(y) + '" rx="' + f(rx) + '" ry="' + f(ry) + '" fill="' + fill + '"' + (ex || '') + '/>'; }
  function path(d, fill, ex) { return '<path d="' + d + '" fill="' + fill + '"' + (ex || '') + '/>'; }
  function line(x1, y1, x2, y2, stroke, w, ex) { return '<line x1="' + f(x1) + '" y1="' + f(y1) + '" x2="' + f(x2) + '" y2="' + f(y2) + '" stroke="' + stroke + '" stroke-width="' + w + '"' + (ex || '') + '/>'; }
  function poly(pts, fill, ex) { return '<polygon points="' + pts.map(function (p) { return f(p[0]) + ',' + f(p[1]); }).join(' ') + '" fill="' + fill + '"' + (ex || '') + '/>'; }
  function op(o) { return ' opacity="' + o + '"'; }
  function stroke(c, w) { return ' fill="none" stroke="' + c + '" stroke-width="' + w + '"'; }
  // a small seeded random, so each story always gets the same picture
  function rnd(seed) { var s = seed || 1; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function hash(str) { var h = 7; for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 2147483647; return h || 1; }

  // a sun cut by horizontal bands, the classic travel-poster sun
  function bandSun(x, y, r, fill, cut, from) {
    var s = circ(x, y, r, fill), y0 = y + r * (from || .15);
    for (var i = 0, h = 4; y0 < y + r; i++, h += 2.6) { s += rect(x - r - 2, y0, r * 2 + 4, h, cut); y0 += h + 12; }
    return s;
  }
  function sea(y, c, rows) {
    var s = rect(0, y, 800, 600 - y, c.mid);
    for (var i = 0; i < (rows || 7); i++) s += rect(0, y + 22 + i * (16 + i * 4), 800, 2 + i * .8, c.lt, op(.18));
    return s;
  }
  function stars(c, r, n, yMax) {
    var s = ''; for (var i = 0; i < n; i++) s += circ(r() * 800, r() * (yMax || 300), .8 + r() * 1.8, c.lt, op(.35 + r() * .5));
    return s;
  }
  function arch(x, y, w, h) {   // a doorway: straight sides and a round top
    var rr = w / 2; return 'M' + f(x) + ',' + f(y + h) + ' L' + f(x) + ',' + f(y + rr) + ' A' + f(rr) + ',' + f(rr) + ' 0 0 1 ' + f(x + w) + ',' + f(y + rr) + ' L' + f(x + w) + ',' + f(y + h) + ' Z';
  }

  var M = {};

  M.sunsea = function (c) {
    return rect(0, 0, 800, 600, c.bg) + bandSun(400, 300, 150, c.acc, c.bg, .1) + sea(330, c, 8) +
      [0, 1, 2, 3, 4, 5].map(function (i) { var w = 220 - i * 34; return rect(400 - w / 2, 350 + i * 26, w, 4, c.acc, op(.85 - i * .1)); }).join('');
  };

  M.mountains = function (c, r) {
    var s = rect(0, 0, 800, 600, c.bg) + circ(560, 180, 66, c.acc);
    s += poly([[0, 420], [140, 250], [250, 360], [380, 170], [520, 340], [620, 240], [800, 400], [800, 600], [0, 600]], c.mid);
    s += poly([[380, 170], [420, 225], [398, 215], [372, 240], [352, 205]], c.lt) + poly([[140, 250], [168, 285], [148, 280], [122, 296], [115, 280]], c.lt) + poly([[620, 240], [652, 268], [630, 266], [606, 278], [598, 262]], c.lt);
    s += poly([[0, 500], [180, 380], [320, 470], [470, 350], [640, 470], [800, 400], [800, 600], [0, 600]], c.ink);
    s += poly([[470, 350], [500, 372], [482, 370], [462, 384], [450, 368]], c.lt, op(.9));
    return s;
  };

  M.train = function (c) {
    var s = rect(0, 0, 800, 600, c.bg) + circ(600, 150, 56, c.acc);
    s += poly([[0, 330], [160, 170], [300, 300], [430, 140], [600, 320], [800, 200], [800, 600], [0, 600]], c.mid);
    s += poly([[430, 140], [470, 186], [446, 180], [418, 200], [404, 176]], c.lt) + poly([[160, 170], [194, 206], [170, 202], [146, 218], [136, 196]], c.lt);
    s += rect(0, 420, 800, 18, c.ink);                                        // the viaduct deck
    var x;
    for (x = 0; x < 800; x += 100) s += path('M' + x + ',438 L' + (x + 100) + ',438 L' + (x + 100) + ',600 L' + (x + 82) + ',600 L' + (x + 82) + ',505 A32,32 0 0 0 ' + (x + 18) + ',505 L' + (x + 18) + ',600 L' + x + ',600Z', c.ink);
    s += path('M150,420 L540,420 L540,388 C540,380 535,376 528,376 L162,376 C155,376 150,380 150,388Z', c.acc);   // carriages
    s += path('M540,420 L612,420 C612,400 596,382 568,378 L540,376Z', c.acc);
    for (x = 166; x < 530; x += 22) s += rect(x, 386, 12, 12, c.ink, op(.8));
    s += line(150, 404, 610, 404, c.lt, 2, op(.6)) + line(270, 376, 270, 420, c.ink, 2) + line(400, 376, 400, 420, c.ink, 2);
    return s;
  };

  M.yacht = function (c) {
    var s = rect(0, 0, 800, 600, c.bg) + bandSun(560, 210, 90, c.acc, c.bg, .2) + sea(400, c, 6);
    s += path('M130,372 L670,372 L620,420 L200,420 Z', c.lt) + rect(160, 396, 470, 6, c.ink, op(.85));
    s += path('M240,372 L560,372 L540,342 L270,342 Z', c.lt) + rect(278, 350, 250, 9, c.ink, op(.85));
    s += path('M300,342 L500,342 L486,318 L322,318 Z', c.lt) + rect(330, 325, 150, 7, c.ink, op(.85));
    s += path('M352,318 L446,318 L436,302 L366,302Z', c.lt) + line(404, 302, 404, 258, c.lt, 3) + line(392, 272, 418, 272, c.lt, 2);
    s += path('M200,428 L620,428 L590,446 L230,446Z', c.lt, op(.25)) + path('M260,452 L560,452 L540,462 L280,462Z', c.lt, op(.15));
    return s;
  };

  M.jet = function (c) {
    var s = rect(0, 0, 800, 600, c.bg) + circ(400, 300, 210, c.mid);
    for (var i = 0; i < 5; i++) s += line(-100 + i * 26, 760 - i * 26, 300 + i * 26, 360 - i * 26, c.lt, 1.4, op(.35));
    var plane = 'M0,-180 C13,-170 15,-140 15,-110 L15,130 C15,158 7,176 0,182 C-7,176 -15,158 -15,130 L-15,-110 C-15,-140 -13,-170 0,-180Z' +
      'M15,-6 L205,64 L205,86 L15,44Z M-15,-6 L-205,64 L-205,86 L-15,44Z M12,134 L78,170 L78,182 L10,166Z M-12,134 L-78,170 L-78,182 L-10,166Z';
    s += '<g transform="translate(400 300) rotate(42)">' + path(plane, c.lt) + rect(70, 20, 12, 34, c.lt) + rect(-82, 20, 12, 34, c.lt) +
      path('M-6,-150 L6,-150 L6,-140 L-6,-140Z', c.ink, op(.6)) + '</g>';
    return s + circ(400, 300, 260, 'none', stroke(c.acc, 1.5) + op(.6));
  };

  M.watch = function (c) {
    var s = rect(0, 0, 800, 600, c.bg);
    s += rect(332, 0, 136, 600, c.mid) + line(344, 0, 344, 600, c.lt, 1.2, ' stroke-dasharray="7 6"' + op(.5)) + line(456, 0, 456, 600, c.lt, 1.2, ' stroke-dasharray="7 6"' + op(.5));
        s += path('M330,160 L470,160 L456,120 L344,120Z M330,440 L470,440 L456,480 L344,480Z', c.acc);   // lugs
    s += rect(546, 286, 22, 28, c.acc, ' rx="4"');                                                      // crown
    s += circ(400, 300, 160, c.acc) + circ(400, 300, 146, c.ink, op(.25)) + circ(400, 300, 142, c.lt);
    for (var i = 0; i < 60; i++) {
      var a = i * 6 * Math.PI / 180, big = i % 5 === 0, r1 = big ? 112 : 124, r2 = 132;
      s += line(400 + Math.sin(a) * r1, 300 - Math.cos(a) * r1, 400 + Math.sin(a) * r2, 300 - Math.cos(a) * r2, c.ink, big ? 4 : 1.2);
    }
    s += circ(400, 360, 26, 'none', stroke(c.ink, 1) + op(.5)) + line(400, 360, 412, 346, c.ink, 1.5);
    s += '<text x="400" y="250" text-anchor="middle" font-family="Cinzel, Georgia, serif" font-size="13" letter-spacing="4" fill="' + c.ink + '">WALVIS</text>';
    s += '<g transform="rotate(-50 400 300)">' + path('M396,300 L400,212 L404,300Z', c.ink) + '</g>';
    s += '<g transform="rotate(62 400 300)">' + path('M397,300 L400,180 L403,300Z', c.ink) + '</g>';
    s += '<g transform="rotate(150 400 300)">' + line(400, 320, 400, 186, c.bg === '#0f0c22' ? '#c0392b' : c.acc, 1.5) + '</g>';
    return s + circ(400, 300, 7, c.acc) + circ(400, 300, 2.5, c.ink);
  };

  M.gem = function (c) {
    var s = rect(0, 0, 800, 600, c.bg);
    for (var i = 0; i < 36; i++) { var a = i * 10 * Math.PI / 180; s += line(400, 290, 400 + Math.cos(a) * 520, 290 + Math.sin(a) * 520, c.acc, i % 2 ? .8 : 1.6, op(.22)); }
    var T = [[330, 200], [470, 200]], G = [[240, 262], [300, 248], [400, 244], [500, 248], [560, 262]], K = [400, 470];
    s += poly([[330, 200], [470, 200], [560, 262], [240, 262]], c.lt);
    s += poly([[330, 200], [240, 262], [300, 248]], c.hi, op(.55)) + poly([[470, 200], [560, 262], [500, 248]], c.hi, op(.4)) + poly([[330, 200], [400, 244], [300, 248]], c.acc, op(.35)) + poly([[470, 200], [400, 244], [500, 248]], c.acc, op(.25));
    s += poly([[240, 262], [560, 262], K], c.lt, op(.92));
    s += poly([[240, 262], [300, 262], K], c.hi, op(.45)) + poly([[400, 262], [480, 262], K], c.hi, op(.35)) + poly([[480, 262], [560, 262], K], c.acc, op(.3)) + poly([[300, 262], [360, 262], K], c.acc, op(.2));
    [240, 300, 360, 400, 440, 480, 560].forEach(function (x) { s += line(x, 262, K[0], K[1], c.ink, .8, op(.35)); });
    s += line(240, 262, 560, 262, c.ink, 1.2, op(.4)) + line(330, 200, 300, 262, c.ink, .8, op(.3)) + line(470, 200, 500, 262, c.ink, .8, op(.3)) + line(330, 200, 400, 262, c.ink, .8, op(.3)) + line(470, 200, 400, 262, c.ink, .8, op(.3));
    return s + path('M400,150 L406,170 L426,176 L406,182 L400,202 L394,182 L374,176 L394,170Z', c.lt, op(.9));
  };

  M.ring = function (c) {
    var s = rect(0, 0, 800, 600, c.bg) + circ(400, 330, 230, c.mid, op(.6));
    s += '<ellipse cx="400" cy="360" rx="130" ry="130" fill="none" stroke="' + c.acc + '" stroke-width="24"/>';
    s += '<ellipse cx="400" cy="360" rx="130" ry="130" fill="none" stroke="' + c.lt + '" stroke-width="3" opacity=".5" stroke-dasharray="200 620" transform="rotate(-140 400 360)"/>';
    s += path('M372,236 L428,236 L418,214 L382,214Z', c.acc);
    s += poly([[360, 196], [440, 196], [470, 226], [330, 226]], c.lt) + poly([[330, 226], [470, 226], [400, 300]], c.hi, op(.9));
    s += line(360, 196, 380, 226, c.ink, .8, op(.4)) + line(440, 196, 420, 226, c.ink, .8, op(.4)) + line(380, 226, 400, 300, c.ink, .8, op(.4)) + line(420, 226, 400, 300, c.ink, .8, op(.4));
    return s + path('M470,150 L475,166 L491,171 L475,176 L470,192 L465,176 L449,171 L465,166Z', c.lt);
  };

  M.palace = function (c) {
    var s = rect(0, 0, 800, 600, c.bg) + circ(640, 140, 48, c.acc, op(.9));
    s += rect(0, 470, 800, 130, c.mid);
    s += rect(150, 300, 500, 170, c.hi) + rect(150, 296, 500, 8, c.lt) + rect(150, 380, 500, 6, c.lt);
    for (var i = 0; i < 9; i++) { var x = 168 + i * 54; s += path(arch(x, 316, 30, 56), c.ink, op(.8)) + path(arch(x, 396, 30, 66), c.ink, op(.8)); }
    s += rect(320, 250, 160, 50, c.hi) + rect(320, 246, 160, 6, c.lt);
    for (i = 0; i < 4; i++) s += path(arch(334 + i * 36, 260, 22, 34), c.ink, op(.8));
    s += path('M336,250 C336,176 400,160 400,112 C400,160 464,176 464,250Z', c.hi) + line(400, 112, 400, 86, c.lt, 3) + circ(400, 84, 5, c.acc);
    s += poly([[330, 470], [470, 470], [520, 540], [280, 540]], c.lt, op(.85));
    for (i = 1; i < 6; i++) s += line(330 - i * 10, 470 + i * 14, 470 + i * 10, 470 + i * 14, c.ink, 1, op(.25));
    return s;
  };

  M.jamdani = function (c) {
    var s = rect(0, 0, 800, 600, c.bg), y, x, k = 0;
    for (y = 110; y < 500; y += 70) for (x = (k++ % 2) * 50 - 20; x < 820; x += 100) {
      s += poly([[x, y - 26], [x + 26, y], [x, y + 26], [x - 26, y]], 'none', stroke(c.lt, 1.6) + op(.7));
      s += circ(x, y - 9, 5, c.acc) + circ(x + 9, y, 5, c.acc) + circ(x, y + 9, 5, c.acc) + circ(x - 9, y, 5, c.acc) + circ(x, y, 3.5, c.lt);
      s += circ(x + 50, y, 2.2, c.lt, op(.6));
    }
    var border = function (y0, flip) {
      var b = rect(0, y0, 800, 70, c.mid) + rect(0, flip ? y0 + 62 : y0, 800, 8, c.acc);
      for (var xx = 0; xx < 820; xx += 40) b += poly(flip ? [[xx, y0 + 62], [xx + 20, y0 + 26], [xx + 40, y0 + 62]] : [[xx, y0 + 8], [xx + 20, y0 + 44], [xx + 40, y0 + 8]], c.acc, op(.9)) + circ(xx + 20, flip ? y0 + 16 : y0 + 54, 4, c.lt);
      return b;
    };
    return s + border(0, false) + border(530, true);
  };

  M.plate = function (c, r) {
    var s = rect(0, 0, 800, 600, c.bg);
    for (var y = 0; y < 600; y += 40) s += rect(0, y, 800, 1, c.lt, op(.07));
    s += circ(410, 315, 178, c.ink, op(.18)) + circ(400, 300, 178, c.lt) + circ(400, 300, 150, 'none', stroke(c.mid, 1.5) + op(.4)) + circ(400, 300, 120, c.lt) ;
    s += circ(400, 300, 62, c.mid) + circ(380, 286, 26, c.acc) + circ(424, 312, 16, c.hi) + circ(396, 322, 10, c.lt) + path('M352,262 C380,240 430,250 448,272', 'none', stroke(c.ink, 3) + ' stroke-linecap="round"');
    for (var i = 0; i < 5; i++) s += circ(352 + i * 22, 352 - (i % 2) * 6, 4, c.acc, op(.9));
    s += rect(176, 150, 10, 300, c.lt, ' rx="5"') + path('M166,150 L196,150 L196,210 C196,226 186,232 181,232 C176,232 166,226 166,210Z', c.lt);
    for (i = 0; i < 4; i++) s += rect(167 + i * 8, 124, 4, 40, c.lt, ' rx="2"');
    s += rect(614, 150, 12, 300, c.lt, ' rx="6"') + path('M614,150 C614,110 636,96 640,96 L640,250 L614,250Z', c.lt);
    return s + circ(640, 470, 44, 'none', stroke(c.lt, 3) + op(.6)) + circ(640, 470, 34, c.acc, op(.25));
  };

  M.glass = function (c, r) {
    var s = rect(0, 0, 800, 600, c.bg);
    for (var x = 40; x < 800; x += 80) s += rect(x, 0, 40, 600, c.mid, op(.35));
    s += circ(400, 170, 40, c.acc, op(.25));
    var flute = function (cx, rot) {
      return '<g transform="rotate(' + rot + ' ' + cx + ' 500)">' + path('M' + (cx - 34) + ',120 L' + (cx + 34) + ',120 C' + (cx + 34) + ',250 ' + (cx + 22) + ',300 ' + cx + ',306 C' + (cx - 22) + ',300 ' + (cx - 34) + ',250 ' + (cx - 34) + ',120Z', c.lt, op(.95)) +
        path('M' + (cx - 30) + ',170 L' + (cx + 30) + ',170 C' + (cx + 30) + ',250 ' + (cx + 20) + ',294 ' + cx + ',298 C' + (cx - 20) + ',294 ' + (cx - 30) + ',250 ' + (cx - 30) + ',170Z', c.acc) +
        rect(cx - 3, 304, 6, 170, c.lt) + ell(cx, 478, 52, 10, c.lt) + '</g>';
    };
    s += flute(330, -9) + flute(470, 9);
    for (var i = 0; i < 26; i++) { var t = r(); s += circ(330 + (r() - .5) * 44 + (i % 2) * 140, 140 - t * 120, 2 + r() * 4, c.lt, op(.3 + r() * .5)); }
    return s + path('M392,118 L400,96 L408,118 L430,126 L408,134 L400,156 L392,134 L370,126Z', c.lt);
  };

  M.chandelier = function (c) {
    var s = rect(0, 0, 800, 600, c.bg) + circ(400, 330, 220, c.acc, op(.12)) + circ(400, 330, 140, c.acc, op(.12));
    s += line(400, 0, 400, 170, c.acc, 3) + circ(400, 176, 12, c.acc);
    s += path('M250,260 C280,300 520,300 550,260', 'none', stroke(c.acc, 5)) + path('M200,340 C240,400 560,400 600,340', 'none', stroke(c.acc, 5));
    s += line(400, 188, 400, 420, c.acc, 4) + path('M300,268 L400,190 L500,268', 'none', stroke(c.acc, 2));
    [[250, 260], [325, 288], [400, 296], [475, 288], [550, 260], [200, 340], [280, 380], [360, 394], [440, 394], [520, 380], [600, 340]].forEach(function (p) {
      s += rect(p[0] - 6, p[1] - 28, 12, 26, c.lt) + path('M' + p[0] + ',' + (p[1] - 46) + ' C' + (p[0] + 7) + ',' + (p[1] - 36) + ' ' + (p[0] + 5) + ',' + (p[1] - 30) + ' ' + p[0] + ',' + (p[1] - 30) + ' C' + (p[0] - 5) + ',' + (p[1] - 30) + ' ' + (p[0] - 7) + ',' + (p[1] - 36) + ' ' + p[0] + ',' + (p[1] - 46) + 'Z', c.acc);
      for (var k = 0; k < 3; k++) s += line(p[0], p[1] + k * 16, p[0], p[1] + k * 16 + 8, c.lt, 1, op(.7)) + path('M' + p[0] + ',' + (p[1] + k * 16 + 8) + ' l5,8 l-5,6 l-5,-6Z', c.lt, op(.85 - k * .2));
    });
    return s + path('M400,420 l10,16 l-10,22 l-10,-22Z', c.lt) + circ(400, 466, 4, c.acc);
  };

  M.frames = function (c) {
    var s = rect(0, 0, 800, 600, c.bg) + rect(0, 480, 800, 120, c.mid);
    s += poly([[330, 0], [470, 0], [560, 480], [240, 480]], c.lt, op(.06));
    s += rect(270, 110, 260, 320, c.acc) + rect(286, 126, 228, 288, c.lt);
    s += circ(380, 230, 56, c.oxb || c.hi) + rect(330, 270, 140, 110, c.bg, op(.85)) + rect(420, 170, 70, 70, c.mid) + line(300, 400, 500, 150, c.ink, 2, op(.6));
    s += rect(100, 170, 120, 150, c.acc) + rect(110, 180, 100, 130, c.lt) + rect(122, 200, 76, 60, c.hi, op(.8)) + rect(122, 268, 76, 22, c.mid);
    s += rect(580, 150, 120, 120, c.acc) + rect(590, 160, 100, 100, c.lt) + circ(640, 210, 30, c.bg);
    s += rect(300, 500, 200, 18, c.ink) + rect(316, 518, 10, 40, c.ink) + rect(474, 518, 10, 40, c.ink);
    return s + rect(380, 444, 40, 8, c.lt, op(.7));
  };

  M.gavel = function (c) {
    var s = rect(0, 0, 800, 600, c.bg) + circ(400, 300, 200, c.mid, op(.5));
    s += ell(420, 450, 150, 30, c.ink, op(.4)) + ell(420, 430, 130, 26, c.acc) + rect(290, 404, 260, 26, c.acc) + ell(420, 404, 130, 26, c.lt);
    s += '<g transform="rotate(-32 400 300)">' + rect(380, 130, 40, 300, c.lt, ' rx="8"') + rect(300, 110, 200, 84, c.acc, ' rx="14"') + rect(300, 132, 200, 10, c.ink, op(.3)) + rect(300, 162, 200, 10, c.ink, op(.3)) + rect(288, 118, 16, 68, c.lt, ' rx="6"') + rect(496, 118, 16, 68, c.lt, ' rx="6"') + '</g>';
    return s + '<text x="160" y="140" font-family="Cinzel, Georgia, serif" font-size="22" letter-spacing="6" fill="' + c.lt + '" opacity=".7">LOT 01</text>';
  };

  M.car = function (c) {
    var s = rect(0, 0, 800, 600, c.bg) + bandSun(400, 260, 170, c.acc, c.bg, .35) + rect(0, 440, 800, 160, c.ink);
    for (var i = 0; i < 6; i++) s += rect(60 + i * 130, 500, 70, 6, c.lt, op(.4));
    s += path('M120,430 L120,380 C120,356 146,346 186,342 L318,334 C350,304 396,280 448,280 L506,282 C536,284 556,316 572,334 L650,340 C684,344 696,366 696,392 L696,430 Z', c.lt);
    s += path('M330,334 C360,308 400,292 444,292 L468,292 L474,334Z', c.ink, op(.75)) + path('M486,292 L500,292 C520,296 536,316 548,334 L490,334Z', c.ink, op(.75));
    s += rect(120, 386, 576, 6, c.acc) + rect(660, 360, 30, 10, c.acc, ' rx="4"') + rect(124, 360, 18, 12, c.hi, ' rx="3"');
    s += circ(256, 432, 58, c.bg) + circ(256, 432, 48, c.ink) + circ(256, 432, 24, c.acc) + circ(256, 432, 8, c.lt);
    s += circ(574, 432, 58, c.bg) + circ(574, 432, 48, c.ink) + circ(574, 432, 24, c.acc) + circ(574, 432, 8, c.lt);
    return s;
  };

  M.moon = function (c, r) {
    var s = rect(0, 0, 800, 600, c.bg) + stars(c, r, 50, 600);
    s += path(arch(250, 90, 300, 420), c.mid) + path(arch(266, 106, 268, 398), c.ink);
    s += circ(430, 250, 70, c.acc) + circ(458, 228, 66, c.ink);
    s += stars(c, r, 0) + circ(330, 200, 2, c.lt) + circ(360, 330, 1.6, c.lt) + circ(470, 380, 2.2, c.lt) + circ(320, 420, 1.4, c.lt);
    s += rect(400, 106, 3, 398, c.mid) + rect(266, 300, 268, 3, c.mid);
    s += path('M150,90 C210,200 200,400 240,520 L150,520Z', c.hi, op(.85)) + path('M650,90 C590,200 600,400 560,520 L650,520Z', c.hi, op(.85));
    return s + rect(120, 510, 560, 20, c.mid);
  };

  M.spa = function (c) {
    var s = rect(0, 0, 800, 600, c.bg);
    for (var i = 1; i < 9; i++) s += ell(400, 420, i * 52, i * 15, 'none', stroke(c.lt, 1.4) + op(.5 - i * .045));
    s += ell(400, 420, 140, 26, c.ink, op(.3));
    s += ell(400, 392, 120, 34, c.mid) + ell(400, 386, 118, 30, c.hi, op(.6));
    s += ell(396, 336, 92, 28, c.lt) + ell(404, 290, 70, 24, c.acc) + ell(398, 252, 48, 18, c.lt);
    s += path('M560,170 C620,170 650,230 640,280 C590,280 552,240 560,170Z', c.hi) + path('M560,170 C580,210 610,246 640,280', 'none', stroke(c.bg, 2));
    return s + circ(240, 170, 40, c.acc, op(.8));
  };

  M.handbag = function (c) {
    var s = rect(0, 0, 800, 600, c.bg) + rect(0, 470, 800, 130, c.mid, op(.6));
    s += path('M318,250 C318,140 482,140 482,250', 'none', stroke(c.acc, 16) + ' stroke-linecap="round"');
    s += path('M250,250 L550,250 L590,480 L210,480 Z', c.lt) + path('M250,250 L550,250 L560,330 C500,350 300,350 240,330Z', c.hi);
    s += rect(380, 318, 40, 34, c.acc, ' rx="6"') + circ(400, 336, 7, c.ink);
    s += line(232, 470, 568, 470, c.ink, 1.5, ' stroke-dasharray="6 5"' + op(.4)) + line(252, 262, 548, 262, c.ink, 1.2, ' stroke-dasharray="6 5"' + op(.3));
    return s + ell(400, 494, 220, 14, c.ink, op(.25));
  };

  M.perfume = function (c) {
    var s = rect(0, 0, 800, 600, c.bg) + circ(400, 330, 200, c.mid, op(.6));
    s += rect(360, 150, 80, 60, c.acc, ' rx="6"') + rect(372, 206, 56, 26, c.acc);
    s += rect(286, 230, 228, 260, c.lt, op(.92) + ' rx="18"') + rect(306, 250, 188, 220, c.hi, op(.55) + ' rx="10"');
    s += rect(330, 330, 140, 60, c.lt) + '<text x="400" y="368" text-anchor="middle" font-family="Cinzel, Georgia, serif" font-size="16" letter-spacing="5" fill="' + c.ink + '">OUD</text>';
    return s + line(318, 262, 318, 450, c.lt, 6, op(.7)) + ell(400, 500, 170, 12, c.ink, op(.25));
  };

  M.suit = function (c) {
    var s = rect(0, 0, 800, 600, c.bg);
    s += path('M210,600 L250,180 L360,120 L400,300 L440,120 L550,180 L590,600Z', c.mid);
    s += poly([[360, 120], [440, 120], [400, 300]], c.lt) + path('M384,150 L416,150 L424,170 L406,184 L420,330 L400,350 L380,330 L394,184 L376,170Z', c.acc);
    s += poly([[360, 120], [400, 300], [330, 360], [300, 250], [330, 200]], c.ink, op(.55)) + poly([[440, 120], [400, 300], [470, 360], [500, 250], [470, 200]], c.ink, op(.55));
    s += poly([[470, 300], [520, 300], [512, 268], [496, 290], [486, 266]], c.lt) + rect(462, 300, 64, 4, c.ink, op(.5));
    return s + circ(400, 420, 7, c.lt, op(.8)) + circ(400, 480, 7, c.lt, op(.8)) + rect(300, 420, 70, 4, c.ink, op(.5));
  };

  M.villa = function (c) {
    var s = rect(0, 0, 800, 600, c.bg) + circ(590, 150, 60, c.acc);
    s += rect(150, 220, 330, 120, c.lt) + rect(300, 160, 330, 70, c.lt) + rect(300, 228, 330, 8, c.ink, op(.3));
    s += rect(170, 245, 290, 76, c.ink, op(.85)) + rect(320, 176, 290, 40, c.ink, op(.85));
    for (var x = 200; x < 460; x += 58) s += line(x, 245, x, 321, c.lt, 2, op(.6));
    s += rect(110, 340, 600, 14, c.mid) + rect(110, 354, 600, 100, c.hi) + rect(110, 354, 600, 100, c.lt, op(.15));
    for (var i = 0; i < 5; i++) s += rect(150 + i * 30, 372 + i * 16, 380 - i * 50, 3, c.lt, op(.5));
    var palm = function (px, h) {
      var p = path('M' + px + ',460 C' + (px + 10) + ',' + (460 - h / 2) + ' ' + (px + 4) + ',' + (460 - h) + ' ' + (px + 22) + ',' + (460 - h) + ' L' + (px + 28) + ',' + (460 - h) + ' C' + (px + 12) + ',' + (460 - h) + ' ' + (px + 18) + ',' + (460 - h / 2) + ' ' + (px + 8) + ',460Z', c.ink);
      var tx = px + 24, ty = 460 - h;
      [[-80, 10], [-60, -26], [-10, -40], [40, -30], [80, 6], [60, 30], [-50, 34]].forEach(function (d) { p += path('M' + tx + ',' + ty + ' Q' + (tx + d[0] / 2) + ',' + (ty + d[1] - 22) + ' ' + (tx + d[0]) + ',' + (ty + d[1]) + ' Q' + (tx + d[0] / 2) + ',' + (ty + d[1] - 8) + ' ' + tx + ',' + ty + 'Z', c.ink); });
      return p;
    };
    return s + palm(660, 230) + palm(90, 180) + rect(0, 454, 800, 146, c.mid);
  };

  M.skyline = function (c, r) {
    var s = rect(0, 0, 800, 600, c.bg) + stars(c, r, 40, 260) + circ(600, 130, 40, c.acc);
    var towers = [[90, 260], [150, 200], [215, 300], [270, 150], [340, 230], [400, 110], [470, 210], [530, 170], [600, 260], [660, 190], [720, 280]];
    towers.forEach(function (t, i) {
      var w = 54 + (i % 3) * 8; s += rect(t[0] - w / 2, t[1], w, 420 - t[1], i % 2 ? c.mid : c.ink);
      for (var y = t[1] + 14; y < 410; y += 18) for (var x = t[0] - w / 2 + 8; x < t[0] + w / 2 - 8; x += 12) if (r() > .55) s += rect(x, y, 5, 8, c.acc, op(.75));
    });
    s += path('M400,110 L400,70', 'none', stroke(c.lt, 2)) + sea(420, { mid: c.ink, lt: c.acc }, 7);
    return s;
  };

  M.tech = function (c) {
    var s = rect(0, 0, 800, 600, c.bg);
    for (var i = 0; i < 8; i++) s += circ(400, 300, 60 + i * 34, 'none', stroke(c.lt, 1) + op(.25 - i * .025));
    s += '<ellipse cx="400" cy="300" rx="260" ry="80" fill="none" stroke="' + c.acc + '" stroke-width="1.6" transform="rotate(-24 400 300)"/>';
    s += rect(320, 170, 160, 260, c.ink, ' rx="34"') + rect(330, 180, 140, 240, c.mid, ' rx="26"') + circ(400, 300, 40, c.acc) + circ(400, 300, 22, c.lt);
    return s + circ(626, 210, 12, c.acc) + circ(170, 396, 8, c.hi);
  };

  M.tea = function (c) {
    var s = rect(0, 0, 800, 600, c.bg) + circ(560, 150, 60, c.acc);
    var hill = function (y, amp, col, rows) {
      var d = 'M0,' + y + ' C200,' + (y - amp) + ' 420,' + (y - amp) + ' 800,' + (y + 20) + ' L800,600 L0,600Z', h = path(d, col);
      for (var k = 1; k <= rows; k++) h += path('M0,' + (y + k * 22) + ' C200,' + (y - amp + k * 22) + ' 420,' + (y - amp + k * 22) + ' 800,' + (y + 20 + k * 22), 'none', stroke(c.lt, 2) + op(.2) + ' stroke-dasharray="3 9" stroke-linecap="round"');
      return h;
    };
    return s + hill(300, 90, c.mid, 5) + hill(390, 70, c.hi, 4) + hill(470, 60, c.ink, 6) + path('M120,300 L130,250 L140,300Z', c.ink) + path('M150,290 L162,236 L174,290Z', c.ink);
  };

  M.boat = function (c) {
    var s = rect(0, 0, 800, 600, c.bg) + bandSun(400, 300, 140, c.acc, c.bg, .3) + sea(360, c, 7);
    s += path('M190,350 C260,392 540,392 610,350 C580,382 520,396 400,398 C280,396 220,382 190,350Z', c.ink);
    s += path('M300,366 C300,316 500,316 500,366Z', c.ink) + path('M310,366 C312,330 488,330 490,366', 'none', stroke(c.acc, 2) + op(.5));
    s += line(560, 360, 640, 250, c.ink, 4) + path('M220,420 C300,440 500,440 580,420', 'none', stroke(c.ink, 6) + op(.25));
    return s;
  };

  M.safari = function (c) {
    var s = rect(0, 0, 800, 600, c.bg) + bandSun(400, 340, 180, c.acc, c.bg, .45) + rect(0, 420, 800, 180, c.ink);
    for (var i = 0; i < 5; i++) s += rect(0, 440 + i * 26, 800, 2, c.acc, op(.18));
    s += path('M386,420 C392,360 390,330 372,296 L380,294 C396,320 400,340 402,360 C410,330 430,310 454,290 L460,296 C432,320 418,350 412,420Z', c.ink);
    s += ell(330, 284, 120, 22, c.ink) + ell(470, 282, 110, 20, c.ink) + ell(400, 270, 130, 22, c.ink);
    s += path('M590,420 L594,370 L600,370 L604,420Z M600,372 L640,300 L646,304 L606,376Z', c.ink) + path('M636,298 L654,290 L656,300 L642,306Z', c.ink);
    return s;
  };

  M.blossom = function (c, r) {
    var s = rect(0, 0, 800, 600, c.bg) + circ(430, 250, 120, c.acc, op(.9));
    s += poly([[210, 470], [430, 250], [650, 470]], c.mid) + poly([[430, 250], [480, 300], [458, 296], [440, 312], [420, 296], [400, 304], [380, 280]], c.lt);
    s += rect(0, 470, 800, 130, c.ink);
    s += path('M0,120 C120,140 200,180 260,230 C300,264 330,300 340,340', 'none', stroke(c.ink, 9) + ' stroke-linecap="round"') + path('M180,170 C200,120 240,96 290,90', 'none', stroke(c.ink, 6) + ' stroke-linecap="round"');
    var flower = function (x, y, sz) { var g = ''; for (var k = 0; k < 5; k++) { var a = k * 72 * Math.PI / 180; g += circ(x + Math.cos(a) * sz, y + Math.sin(a) * sz, sz * .95, c.lt); } return g + circ(x, y, sz * .5, c.hi); };
    [[90, 130, 13], [150, 150, 11], [210, 186, 14], [262, 240, 12], [300, 286, 10], [236, 110, 11], [286, 94, 13], [330, 330, 9], [120, 100, 9]].forEach(function (p) { s += flower(p[0], p[1], p[2]); });
    for (var i = 0; i < 12; i++) s += circ(380 + r() * 380, 300 + r() * 160, 3 + r() * 3, c.lt, op(.6));
    return s;
  };

  M.lantern = function (c, r) {
    var s = rect(0, 0, 800, 600, c.bg) + stars(c, r, 40, 600) + circ(620, 130, 50, c.acc) + circ(644, 112, 46, c.bg);
    [[260, 230, 1], [400, 320, .85], [540, 250, 1.05]].forEach(function (L) {
      var x = L[0], y = L[1], k = L[2];
      s += line(x, 0, x, y - 70 * k, c.acc, 1.5) + circ(x, y, 110 * k, c.acc, op(.12));
      s += path('M' + (x - 26 * k) + ',' + (y - 70 * k) + ' L' + (x + 26 * k) + ',' + (y - 70 * k) + ' L' + (x + 40 * k) + ',' + (y - 46 * k) + ' L' + (x - 40 * k) + ',' + (y - 46 * k) + 'Z', c.acc);
      s += rect(x - 40 * k, y - 46 * k, 80 * k, 110 * k, c.acc, op(.95) + ' rx="' + 30 * k + '"');
      s += rect(x - 28 * k, y - 36 * k, 56 * k, 90 * k, c.lt, op(.9) + ' rx="' + 22 * k + '"');
      for (var j = -1; j <= 1; j++) s += line(x + j * 14 * k, y - 36 * k, x + j * 14 * k, y + 54 * k, c.acc, 2);
      s += path('M' + (x - 30 * k) + ',' + (y + 64 * k) + ' L' + (x + 30 * k) + ',' + (y + 64 * k) + ' L' + (x + 18 * k) + ',' + (y + 80 * k) + ' L' + (x - 18 * k) + ',' + (y + 80 * k) + 'Z', c.acc) + line(x, y + 80 * k, x, y + 104 * k, c.acc, 2);
    });
    return s;
  };

  M.stage = function (c) {
    var s = rect(0, 0, 800, 600, c.ink) + poly([[360, 0], [440, 0], [620, 470], [180, 470]], c.lt, op(.1)) + ell(400, 470, 220, 30, c.acc, op(.25));
    s += rect(0, 470, 800, 130, c.mid);
    var curtain = function (x0, dir) {
      var g = path(dir > 0 ? 'M0,0 L300,0 C280,200 230,380 170,600 L0,600Z' : 'M800,0 L500,0 C520,200 570,380 630,600 L800,600Z', c.bg);
      for (var k = 1; k < 7; k++) { var x = dir > 0 ? k * 40 : 800 - k * 40; g += path('M' + x + ',0 C' + (x - dir * 10) + ',220 ' + (x - dir * 30) + ',400 ' + (x - dir * (k * 18)) + ',600', 'none', stroke(c.ink, 5) + op(.35)); }
      return g;
    };
    s += curtain(0, 1) + curtain(800, -1);
    s += rect(0, 0, 800, 70, c.bg);
    for (var x = 0; x < 800; x += 80) s += path('M' + x + ',70 Q' + (x + 40) + ',120 ' + (x + 80) + ',70Z', c.bg) + circ(x + 40, 100, 5, c.acc);
    return s + rect(0, 66, 800, 6, c.acc) + circ(400, 300, 16, c.acc, op(.8));
  };

  M.piano = function (c) {
    var s = rect(0, 0, 800, 600, c.bg) + '<g transform="rotate(-18 400 300)">';
    for (var i = -4; i < 20; i++) s += rect(i * 56, 160, 54, 360, c.lt);
    [0, 1, 3, 4, 5].forEach(function (b) { for (var o = -1; o < 3; o++) s += rect((o * 7 + b) * 56 + 38, 160, 34, 220, c.ink); });
    return s + rect(-400, 130, 1600, 34, c.acc) + '</g>' + circ(650, 470, 70, c.acc, op(.2));
  };

  M.door = function (c) {
    var s = rect(0, 0, 800, 600, c.bg) + rect(0, 500, 800, 100, c.mid);
    s += path(arch(270, 110, 260, 390), c.lt) + path(arch(290, 130, 220, 370), c.acc);
    s += path(arch(304, 146, 88, 160), c.ink, op(.25)) + path(arch(408, 146, 88, 160), c.ink, op(.25)) + rect(304, 330, 88, 150, c.ink, op(.25)) + rect(408, 330, 88, 150, c.ink, op(.25));
    s += line(400, 130, 400, 500, c.ink, 2, op(.5)) + circ(380, 340, 10, 'none', stroke(c.lt, 3)) + circ(420, 340, 10, 'none', stroke(c.lt, 3));
    var pot = function (x) { return path('M' + (x - 34) + ',500 L' + (x + 34) + ',500 L' + (x + 26) + ',440 L' + (x - 26) + ',440Z', c.hi) + circ(x, 400, 44, c.ink) + circ(x - 20, 376, 28, c.ink) + circ(x + 22, 380, 30, c.ink); };
    return s + pot(200) + pot(600);
  };

  M.compass = function (c) {
    var s = rect(0, 0, 800, 600, c.bg);
    for (var i = 0; i < 6; i++) s += line(0, 100 + i * 80, 800, 100 + i * 80, c.lt, .8, op(.12)) + line(100 + i * 120, 0, 100 + i * 120, 600, c.lt, .8, op(.12));
    s += circ(400, 300, 170, c.acc) + circ(400, 300, 156, c.lt);
    for (i = 0; i < 72; i++) { var a = i * 5 * Math.PI / 180, l = i % 18 === 0 ? 20 : i % 2 ? 6 : 10; s += line(400 + Math.sin(a) * 150, 300 - Math.cos(a) * 150, 400 + Math.sin(a) * (150 - l), 300 - Math.cos(a) * (150 - l), c.ink, 1.2); }
    s += poly([[400, 170], [418, 300], [400, 430], [382, 300]], c.ink, op(.15)) + poly([[270, 300], [400, 282], [530, 300], [400, 318]], c.ink, op(.15));
    s += poly([[400, 170], [416, 300], [384, 300]], c.oxb || '#b23a3a') + poly([[400, 430], [416, 300], [384, 300]], c.ink);
    return s + circ(400, 300, 9, c.acc) + '<text x="400" y="200" text-anchor="middle" font-family="Cinzel, Georgia, serif" font-size="18" fill="' + c.ink + '">N</text>';
  };

  var n = 0;
  window.JournalArt = function (motif, palette, seedText) {
    var c = PAL[palette] || PAL.plum, draw = M[motif] || M.sunsea, r = rnd(hash(seedText || motif + palette));
    n++;
    return '<svg class="jx-svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" role="presentation" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">' +
      draw(c, r) + '<rect x="14" y="14" width="772" height="572" fill="none" stroke="' + c.lt + '" stroke-opacity=".22" stroke-width="1"/></svg>';
  };
  window.JournalArt.motifs = Object.keys(M);
  window.JournalArt.palettes = Object.keys(PAL);
})();
