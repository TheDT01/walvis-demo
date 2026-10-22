/* =========================================================
   WALVIS CONCIERGE · js/travel.js
   The Travel page (travel.html) and each journey's own page (journey.html?id=...).

   To add a journey: copy one { ... } block under "items", paste it below the last one,
   put a comma between blocks, and change the words and the photo. Its page appears by itself.
   To add a way to travel: the same, under "worlds".
   Loaded before js/site.js, which then wires the WhatsApp links and the scroll reveals.
   ========================================================= */
var WALVIS_TRAVEL = {
    name: "Travel",
    worlds: [
      { title: "Private aviation", kicker: "By air", image: "images/lux-private-jet.jpg",
        text: "Your aircraft, your hour. Private jets and helicopters arranged with crew, catering and quiet terminals." },
      { title: "Yachts and cruises", kicker: "By sea", image: "images/lux-superyacht.jpg",
        text: "A yacht on the Riviera, a suite at sea or a private vessel through the Sundarbans." },
      { title: "The grand hotels", kicker: "To stay", image: "images/lux-ocean-lounge.jpg",
        text: "The best suite, the right floor, the view you asked for and someone expecting you." },
      { title: "Honeymoons", kicker: "For two", image: "images/lux-maldives-lagoon.jpg",
        text: "Overwater villas, island dinners and days that belong to nobody else." },
      { title: "Umrah and Hajj", kicker: "With care", image: "images/bd-star-mosque-interior.jpg",
        text: "Pilgrimage arranged with dignity: trusted operators, close hotels and a calm journey for the family." },
      { title: "Bangladesh, privately", kicker: "At home", image: "images/bd-ahsan-manzil.jpg",
        text: "Palaces of Old Dhaka, the coast by private boat and the country as very few people see it." },
      { title: "Mountains and winter", kicker: "To the peaks", image: "images/lux-alpenglow.jpg",
        text: "Alpine chalets, slopes at first light and a fire waiting when you come in." },
      { title: "Cities after dark", kicker: "The world", image: "images/lux-paris-night.jpg",
        text: "Paris, Dubai, London, Istanbul. The tables, the shows and the doors that are usually closed." }
    ],
    items: [
      {
        id: "riviera-by-sea",
        title: "The Riviera, by Sea",
        type: "Yachting", place: "Monaco, Cannes, Saint-Tropez",
        duration: "7 nights",
        image: "images/lux-harbour-riviera.jpg", alt: "A harbour full of yachts below a hillside town",
        summary: "A crewed yacht along the Côte d'Azur. Mornings swimming off the deck, afternoons ashore, dinners on the water.",
        highlights: ["Crewed motor yacht with chef", "Monaco, Cannes and Saint-Tropez", "Tables and beach clubs reserved"]
      },
      {
        id: "paris-after-dark",
        title: "Paris, After Dark",
        type: "Cities", place: "Paris",
        duration: "5 nights",
        image: "images/lux-louvre-night.jpg", alt: "The Louvre pyramid lit up at night",
        summary: "A palace hotel, a private evening at a museum, the couture houses by appointment and the tables everyone asks about.",
        highlights: ["Suite at a palace hotel", "After-hours museum visit", "Private shopping appointments"]
      },
      {
        id: "maldives-overwater",
        title: "Maldives, Overwater",
        type: "Honeymoon", place: "Maldives",
        duration: "6 nights",
        image: "images/lux-ocean-pool.jpg", alt: "A private pool on the edge of the ocean",
        summary: "A seaplane arrival, a villa over the lagoon and a sandbank set for dinner under the stars.",
        highlights: ["Overwater villa with pool", "Seaplane transfers", "Private sandbank dinner"]
      },
      {
        id: "nawabs-dhaka",
        title: "The Nawabs' Dhaka",
        type: "Bangladesh", place: "Old Dhaka",
        duration: "1 day",
        image: "images/bd-lalbagh-fort.jpg", alt: "The Lalbagh Fort mosque in Old Dhaka",
        summary: "Ahsan Manzil, Lalbagh Fort and the Star Mosque with a historian, a private boat on the Buriganga and a long lunch.",
        highlights: ["Historian guide", "Private boat on the Buriganga", "Lunch at an Old Dhaka institution"]
      },
      {
        id: "alpine-winter",
        title: "An Alpine Winter",
        type: "Mountains", place: "Swiss Alps",
        duration: "6 nights",
        image: "images/lux-alpine-peak.jpg", alt: "A snow-covered mountain peak against a dark sky",
        summary: "A chalet with a fire and a chef, a private instructor for the slopes and the mountain railway to the top of Europe.",
        highlights: ["Catered chalet", "Private ski instructor", "Glacier excursion"]
      },
      {
        id: "desert-nights",
        title: "Desert Nights, Dubai",
        type: "Cities", place: "Dubai",
        duration: "4 nights",
        image: "images/lux-desert-dunes.jpg", alt: "Golden desert dunes seen from above",
        summary: "A marina suite, a dinner in the dunes, a sunrise flight and the city's best tables in between.",
        highlights: ["Marina suite", "Private desert dinner", "Sunrise balloon flight"]
      }
    ]
  };

(function () {
  "use strict";
  var T = WALVIS_TRAVEL;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function url(it) { return "journey.html?id=" + encodeURIComponent(it.id); }
  function ask(it) { return 'Hello Walvis, I would like to know more about "' + it.title + '" (Travel).'; }

  /* Ways to travel: large photo panels */
  var worlds = document.querySelector("[data-tv-worlds]");
  if (worlds) {
    worlds.className += " tv-worlds";
    worlds.innerHTML = T.worlds.map(function (w) {
      return '<article class="tv-world reveal">' +
        '<img src="' + esc(w.image) + '" alt="" loading="lazy" decoding="async">' +
        '<div class="tv-world-body">' +
          '<span class="tv-world-kicker">' + esc(w.kicker || "") + "</span>" +
          "<h3>" + esc(w.title) + "</h3>" +
          "<p>" + esc(w.text) + "</p>" +
          '<a class="tv-link-arrow" href="#" data-wa="' + esc("Hello Walvis, I would like to ask about " + w.title.toLowerCase() + " (Travel).") + '">Ask about this<span class="tv-visually-hidden">: ' + esc(w.title) + "</span></a>" +
        "</div>" +
      "</article>";
    }).join("");
  }

  /* Signature journeys: alternating photo and text rows */
  var journeys = document.querySelector("[data-tv-journeys]");
  if (journeys) {
    journeys.className += " tv-journeys";
    journeys.innerHTML = T.items.map(function (it, i) {
      return '<article class="tv-journey reveal' + (i % 2 ? " tv-journey--flip" : "") + '">' +
        '<a class="tv-journey-media" href="' + url(it) + '" tabindex="-1" aria-hidden="true"><img src="' + esc(it.image) + '" alt="" loading="lazy" decoding="async"></a>' +
        '<div class="tv-journey-body">' +
          '<span class="tv-journey-num">' + (i < 9 ? "0" : "") + (i + 1) + "</span>" +
          '<span class="tv-card-tag">' + esc([it.type, it.place].filter(Boolean).join(" · ")) + "</span>" +
          '<h3><a href="' + url(it) + '">' + esc(it.title) + "</a></h3>" +
          (it.duration ? '<p class="tv-card-meta">' + esc(it.duration) + "</p>" : "") +
          "<p>" + esc(it.summary) + "</p>" +
          (it.highlights ? '<ul class="tv-ticks">' + it.highlights.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("") + "</ul>" : "") +
          '<div class="tv-btn-row"><a class="tv-btn" href="#" data-wa="' + esc(ask(it)) + '">Enquire</a><a class="tv-btn tv-btn--line" href="' + url(it) + '">Discover</a></div>' +
        "</div>" +
      "</article>";
    }).join("");
  }

  /* One journey's own page: journey.html?id=riviera-by-sea */
  var page = document.querySelector("[data-tv-journey]");
  if (page) {
    var m = /[?&]id=([^&]*)/.exec(location.search), id = m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : "", it = null;
    T.items.forEach(function (x) { if (x.id === id) it = x; });
    if (!it) {
      page.innerHTML = '<section class="tv-section"><div class="tv-wrap tv-center tv-narrow" style="padding-top:var(--header-h)">' +
        '<span class="tv-eyebrow">Not found</span><h1>We could not find that journey.</h1>' +
        '<p class="tv-lead">It may have been updated. Have a look at the others, or simply ask us.</p>' +
        '<div class="tv-btn-row"><a class="tv-btn" href="travel.html">All journeys</a><a class="tv-btn tv-btn--line" href="#" data-wa="Hello Walvis, I would like help planning a journey.">Ask on WhatsApp</a></div>' +
        "</div></section>";
      return;
    }
    document.title = it.title + " · Travel · Walvis Concierge";
    var md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute("content", it.summary);
    var facts = [it.type && ["Type", it.type], it.place && ["Where", it.place], it.duration && ["Duration", it.duration]].filter(Boolean);
    page.innerHTML =
      '<section class="tv-detail">' +
        '<div class="tv-detail-media"><img src="' + esc(it.image) + '" alt="' + esc(it.alt || it.title) + '" fetchpriority="high"></div>' +
        '<div class="tv-detail-info">' +
          '<nav class="tv-crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><a href="travel.html">Travel</a></nav>' +
          '<span class="tv-eyebrow">' + esc(it.type || "Travel") + "</span>" +
          "<h1>" + esc(it.title) + "</h1>" +
          '<p class="tv-lead">' + esc(it.summary) + "</p>" +
          '<dl class="tv-facts">' + facts.map(function (f) { return "<div><dt>" + f[0] + "</dt><dd>" + esc(f[1]) + "</dd></div>"; }).join("") + "</dl>" +
          '<div class="tv-btn-row"><a class="tv-btn tv-btn-wa" href="#" data-wa="' + esc(ask(it)) + '">Enquire on WhatsApp</a>' +
            '<a class="tv-btn tv-btn--line" href="travel.html">Back to Travel</a></div>' +
          '<p class="tv-fine-print">Every plan is shaped around you. Nothing is booked until you say yes.</p>' +
        "</div>" +
      "</section>" +
      (it.highlights ? '<section class="tv-section tv-section--mist tv-section--tight"><div class="tv-wrap tv-detail-lists">' +
        '<div class="tv-detail-list"><h2>Highlights</h2><ul class="tv-ticks">' + it.highlights.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("") + "</ul></div>" +
      "</div></section>" : "");
  }
})();
