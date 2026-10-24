/* =========================================================
   WALVIS CONCIERGE · js/journal-data.js
   Everything The Journal shows: the sections (interests), the news, the
   "Coming up" calendar and the travel season guide. journal.html and the
   "From The Journal" row on index.html both read this file.

   DEMO EDITION: every story below is sample text written to show the design.
   Replace them with your own news before going live, and remove `demo: true`.

   TO ADD A STORY: copy one block in `stories` and change it.
     id     letters and dashes; the link becomes journal.html#/story/your-id
     s      the section id (see `sections`)
     t      headline, dek: the one-line summary under it
     date   when it was published, e.g. '2026-10-24 09:30'
            (the demo stories use `ago: hours` instead, so they always look fresh)
     kind   'lead' for the main story on the front page (one only), 'top' for the
            stories beside it, 'brief' for short items with no picture
     art    an illustration: [picture, colours] from js/journal-art.js
     img    or a photo instead: 'my-photo.jpg' (in images/; credit it in js/credits.js)
     body   the paragraphs
   ========================================================= */
var WALVIS_JOURNAL = {

  demo: true,
  issue: { name: 'The Journal', line: 'The latest in style, travel, collecting and the good life, every day.' },

  sections: [
    { id: 'style', name: 'Style', dek: 'Fashion, the great houses and what people are wearing.' },
    { id: 'watches', name: 'Watches & Jewellery', dek: 'Timepieces, stones and the salerooms.' },
    { id: 'travel', name: 'Travel', dek: 'Where to go now, and how people are getting there.' },
    { id: 'hotels', name: 'Hotels', dek: 'Openings, renovations and the rooms worth booking.' },
    { id: 'food', name: 'Food & Drink', dek: 'Restaurants, chefs, wine and the tables everyone wants.' },
    { id: 'art', name: 'Art & Design', dek: 'Fairs, auctions, exhibitions and objects.' },
    { id: 'motoring', name: 'Motoring', dek: 'Cars, collectors and the open road.' },
    { id: 'yachts', name: 'Yachts & Jets', dek: 'Life at sea and in the air.' },
    { id: 'property', name: 'Property', dek: 'Homes, villas and the markets that move them.' },
    { id: 'wellness', name: 'Wellness', dek: 'Health, rest, retreats and the science behind them.' },
    { id: 'culture', name: 'Culture', dek: 'Music, theatre, books and the events of the season.' },
    { id: 'tech', name: 'Tech', dek: 'Gadgets and the technology quietly changing how we live.' },
    { id: 'bangladesh', name: 'Bangladesh', dek: 'News from home: places, craft, food and the season.' }
  ],

  stories: [
    /* ---------------- the lead and the top stories ---------------- */
    { id: 'winter-wedding-season', s: 'bangladesh', kind: 'lead', ago: 1.2, read: 6, art: ['palace', 'rose'],
      t: 'Dhaka&rsquo;s wedding season opens with smaller lists and bigger details',
      dek: 'Planners report more intimate holuds, heirloom gold restyled and a return to jamdani as the cool weather arrives.',
      body: [
        'The wedding season has arrived with the first cool evenings, and those who plan Dhaka&rsquo;s celebrations say this year looks different. Guest lists are shorter, venues are smaller, and the money saved is going into flowers, food and music.',
        'Jewellers report a rise in families bringing in grandmothers&rsquo; gold to be cleaned, restrung or reset rather than buying new. Weavers, meanwhile, say demand for fine jamdani is the strongest in years, with some pieces already booked into the new year.',
        'With more relatives flying in from abroad, logistics have become part of the story too: cars for every function, rooms for visiting family and tailoring fittings squeezed into the first days after landing.',
        'Planners&rsquo; advice is the same as ever: decide the big dates first, and start the weaving and tailoring early.'
      ] },
    { id: 'small-watches', s: 'watches', kind: 'top', ago: 2.5, read: 4, art: ['watch', 'sage'],
      t: 'The small watch is back, and collectors are queueing for it',
      dek: 'Slim cases between 36 and 39 millimetres are outselling the oversized watches of the last decade.',
      body: [
        'After years of ever-larger cases, the watches collectors want now are smaller and slimmer. Dealers report steady demand for dress watches between 36 and 39 millimetres, often on leather straps, and long lists for the most sought-after references.',
        'Part of the shift is fashion: softer tailoring makes a heavy steel watch look out of place. Part of it is the vintage market, which has taught a new generation how elegant the smaller watches of the last century were.',
        'For buyers, the usual advice applies: ask for the box, papers and service history, and have anything pre-owned checked independently.'
      ] },
    { id: 'night-trains', s: 'travel', kind: 'top', ago: 4, read: 5, art: ['train', 'oxblood'],
      t: 'Sleeper trains sell out a season ahead as travellers trade airports for views',
      dek: 'From the Alps to Southeast Asia, the grand trains are fully booked for spring.',
      body: [
        'The most requested journeys this year are not flights at all. Luxury sleeper and panoramic trains report cabins selling out months ahead, with spring and autumn departures the first to go.',
        'The appeal is simple: unpack once, eat slowly, and let the scenery do the rest. Operators say families travelling with grandparents are a fast-growing group of passengers.',
        'Flexibility on dates remains the best way to find a cabin at short notice.'
      ] },
    { id: 'counter-dining', s: 'food', kind: 'top', ago: 5.5, read: 4, art: ['plate', 'coral'],
      t: 'Eight seats, no menu: the chef&rsquo;s counter is the hardest table in town',
      dek: 'Tasting counters are replacing the window table as the reservation everyone wants.',
      body: [
        'From Tokyo to London to Dubai, the most wanted dinners are served to eight or ten guests at a counter, often at a single seating and with no printed menu.',
        'Many open bookings on one fixed day each month and are full within minutes. Some only take guests through hotels or regular diners.',
        'The format has travelled into private homes too, with chefs cooking tasting menus at the host&rsquo;s own kitchen counter.'
      ] },
    { id: 'coloured-stones', s: 'watches', kind: 'top', ago: 7, read: 4, art: ['gem', 'forest'],
      t: 'Sapphires and spinels move centre stage on engagement rings',
      dek: 'Coloured stones are winning over buyers who want something more personal than a white diamond.',
      body: [
        'Jewellers report that more couples are choosing sapphires, emeralds and spinels for engagement rings, drawn by colour and character as much as value.',
        'Experts stress that coloured stones are harder to compare than diamonds. A report from a respected independent laboratory, stating origin and any treatment, is the most important document a buyer can ask for.'
      ] },

    /* ---------------- style ---------------- */
    { id: 'quiet-luxury-texture', s: 'style', ago: 9, read: 5, art: ['suit', 'rose'],
      t: 'Quiet luxury grows up: texture is the new logo',
      dek: 'The label has moved inside the jacket. What people notice now is the cloth.',
      body: [
        'Quiet luxury was a headline a few seasons ago. Now it is simply how many people dress. Logos are smaller or gone, and attention has shifted to the material: brushed cashmere, heavy silk, linen washed until it falls properly.',
        'Houses have responded by widening made-to-measure services and putting more emphasis on hand finishing, the details you feel rather than see.',
        'Tailors in Dhaka say they are seeing the same shift, with more clients asking for fewer, better pieces.'
      ] },
    { id: 'special-orders', s: 'style', ago: 26, read: 4, art: ['handbag', 'forest'],
      t: 'Made to order is the new limited edition',
      dek: 'Special-order services, from bags to shoes to fragrance, are the most exclusive thing a boutique offers.',
      body: [
        'Waiting lists have become part of luxury, but the most interesting pieces are increasingly made for one person: a bag in a leather not on the shelf, shoes on your own last, a fragrance blended to order.',
        'These services are rarely advertised and usually take months. They are offered through boutiques, to clients the team knows.'
      ] },
    { id: 'oud-revival', s: 'style', ago: 50, read: 3, art: ['perfume', 'ochre'],
      t: 'Oud goes quiet: perfumers rethink the region&rsquo;s signature note',
      dek: 'Lighter, cleaner oud compositions are winning new fans far from the Gulf.',
      body: [
        'For years oud meant smoky, heavy and unmistakable. A new generation of perfumes uses it more gently, paired with citrus, tea and soft woods.',
        'Perfumers say the softer style suits warm climates and daytime wear, and has introduced oud to buyers who once found it too strong.'
      ] },
    { id: 'tailors-dhaka', s: 'style', kind: 'brief', ago: 31, read: 2,
      t: 'Dhaka tailors report a winter rush for sherwanis and bandhgalas',
      dek: 'Fittings are booked solid into December as wedding season begins.',
      body: ['Several of Dhaka&rsquo;s best-known tailors say their winter calendars are nearly full. The advice: send measurements ahead if you are flying in, and book the first fitting for your first days home.'] },

    /* ---------------- watches & jewellery ---------------- */
    { id: 'pre-owned-papers', s: 'watches', ago: 33, read: 4, art: ['compass', 'sand'],
      t: 'Pre-owned watches: why the papers matter more than ever',
      dek: 'As the second-hand market grows, so does the value of a complete set.',
      body: [
        'The pre-owned watch market has become a serious part of the industry, with certified programmes and specialist dealers in every major city.',
        'Dealers say the difference in value between a watch with its original box, papers and service history and one without has widened. Buyers are advised to insist on the full set and an independent check.'
      ] },
    { id: 'lab-vs-natural', s: 'watches', ago: 72, read: 5, art: ['ring', 'plum'],
      t: 'Natural or lab-grown? Jewellers say buyers want plain answers',
      dek: 'Clear labelling and independent grading are now the first questions at the counter.',
      body: [
        'Lab-grown diamonds have become common in jewellery shops, and buyers are asking sharper questions. Jewellers say the most frequent is simple: which is which, and what does it mean for value over time?',
        'The advice from independent graders is to buy what you love, and make sure the certificate says clearly what it is.'
      ] },
    { id: 'auction-jewels', s: 'watches', kind: 'brief', ago: 40, read: 2,
      t: 'Signed vintage jewels draw strong bidding at autumn sales',
      dek: 'Pieces with a maker&rsquo;s signature and clear history continue to lead.',
      body: ['Salerooms report that signed pieces with documented provenance remain the most contested lots of the season. Unsigned jewels of similar quality often sell for a fraction of the price.'] },

    /* ---------------- travel ---------------- */
    { id: 'winter-sun', s: 'travel', ago: 11, read: 4, art: ['sunsea', 'lagoon'],
      t: 'Winter sun: the best island villas are already booked for the holidays',
      dek: 'Late January and early March remain the quiet, better-value windows.',
      body: [
        'The dry season in the Maldives and much of the Indian Ocean runs from around December into April. Villas with the most privacy, and those suited to families with grandparents, are largely booked over Christmas and New Year.',
        'Travel advisers point to late January and early March as quieter, better-value weeks with the same weather.'
      ] },
    { id: 'safari-season', s: 'travel', ago: 46, read: 4, art: ['safari', 'oxblood'],
      t: 'Safari camps open bookings for next year&rsquo;s migration',
      dek: 'The best camps for July to October are filling now, a year ahead.',
      body: [
        'The great migration across the Masai Mara and Serengeti draws visitors from roughly July to October, and the smallest, best-placed camps open their books a year in advance.',
        'Operators recommend deciding on dates early and staying at least four nights to give the wildlife time to appear.'
      ] },
    { id: 'japan-autumn', s: 'travel', ago: 20, read: 3, art: ['blossom', 'navy'],
      t: 'Japan&rsquo;s autumn colour peaks as visitor numbers keep climbing',
      dek: 'Kyoto&rsquo;s temples are at their best and busiest in November.',
      body: [
        'Japan&rsquo;s maple season moves south through November, with Kyoto&rsquo;s temple gardens at their most beautiful in the second half of the month.',
        'Regular visitors suggest arriving at famous sites at opening time, and spending more nights in smaller towns.'
      ] },
    { id: 'umrah-planning', s: 'travel', ago: 58, read: 4, art: ['lantern', 'night'],
      t: 'Umrah demand rises for the cooler months',
      dek: 'Families are booking earlier, especially for older parents.',
      body: [
        'Travel agents report strong demand for Umrah in the cooler months, with many families planning journeys for older parents and asking for hotels within walking distance of the Haram.',
        'Rooms for the last ten nights of Ramadan are the most sought-after of the year and are booked many months ahead.'
      ] },
    { id: 'visa-tip', s: 'travel', kind: 'brief', ago: 14, read: 1,
      t: 'Travelling in December? Check visa appointments now',
      dek: 'Appointment slots for popular destinations fill quickly before the holidays.',
      body: ['Visa appointment centres typically see their busiest weeks before the December holidays. Travellers are advised to book appointments and check passport validity now.'] },

    /* ---------------- hotels ---------------- */
    { id: 'hotel-sleep', s: 'hotels', ago: 16, read: 4, art: ['moon', 'night'],
      t: 'Hotels redesign rooms around one luxury: sleep',
      dek: 'Blackout that works, quiet air and adjustable beds are the new amenities.',
      body: [
        'Ask frequent travellers what they want from a hotel and the answer, more and more, is sleep. Hotels are responding with rooms designed for it: real blackout, quieter air conditioning, adjustable beds and calmer evening menus.',
        'The simplest requests still help most: a room away from the lift, and a late check-out on the day you land.'
      ] },
    { id: 'palace-hotels', s: 'hotels', ago: 39, read: 4, art: ['chandelier', 'plum'],
      t: 'Grand old hotels reopen after long restorations',
      dek: 'Original details are back, and the rooms are fewer and larger.',
      body: [
        'Several of the world&rsquo;s historic grand hotels have reopened after restorations that took years. The common thread: original plasterwork and ballrooms brought back, and rooms combined into fewer, larger suites.',
        'Rates have risen with the renovations, but so has demand.'
      ] },
    { id: 'villa-questions', s: 'hotels', ago: 98, read: 3, art: ['villa', 'sand'],
      t: 'Five questions to ask before booking a villa',
      dek: 'What the photographs never show.',
      body: [
        'Photographs are generous. Before booking a villa, ask how far the beach really is, whether the pool is heated, who cooks, and what is being built next door.',
        'Ask about the people too: is there a house manager, who answers at night, and how quickly a doctor can arrive. For families with grandparents or little ones, the stairs and the bathrooms matter more than the view.'
      ] },
    { id: 'hotel-brief', s: 'hotels', kind: 'brief', ago: 22, read: 1,
      t: 'Late check-out is the most requested hotel perk of the year',
      dek: 'Ahead of upgrades and breakfast.',
      body: ['Hotel managers say late check-out is now the perk guests ask for most, ahead of room upgrades. Asking at booking, rather than at the desk, gives the best chance.'] },

    /* ---------------- food & drink ---------------- */
    { id: 'dinner-party', s: 'food', ago: 28, read: 4, art: ['glass', 'teal'],
      t: 'The dinner party is back, with a chef in the kitchen',
      dek: 'Private chefs report their busiest season as hosts move the night home.',
      body: [
        'The most talked-about evenings this season are happening at home, around one long table, with a private chef in the kitchen and the host free to sit down.',
        'Chefs say requests for tasting menus for eight to twelve guests have risen sharply, often with florists and serving staff booked alongside.'
      ] },
    { id: 'winter-pithas', s: 'food', ago: 44, read: 3, art: ['plate', 'ochre'],
      t: 'Pitha season: winter sweets return to Dhaka&rsquo;s tables',
      dek: 'Date-palm molasses, rice cakes and the stalls that only appear in the cold months.',
      body: [
        'With the first cold mornings comes khejur gur, the date-palm molasses that defines Bangladeshi winter, and with it the pithas: steamed, fried and filled rice cakes made for a few short months.',
        'Pitha festivals are expected across the city in the coming weeks.'
      ] },
    { id: 'wine-brief', s: 'food', kind: 'brief', ago: 35, read: 1,
      t: 'Low- and no-alcohol pairings arrive on fine-dining menus',
      dek: 'Teas, ferments and juices are getting the same care as the wine list.',
      body: ['More fine-dining restaurants now offer a full non-alcoholic pairing, built from teas, ferments and pressed juices, served with the same ceremony as wine.'] },

    /* ---------------- art & design ---------------- */
    { id: 'first-artwork', s: 'art', ago: 18, read: 5, art: ['frames', 'teal'],
      t: 'Buying a first serious work of art: what advisers tell new collectors',
      dek: 'Provenance, condition and the costs nobody mentions.',
      body: [
        'The art calendar runs on fairs and the major auctions around them. For a first serious purchase, advisers say: buy what you would live with for twenty years, then do the dull work.',
        'Ask for provenance, a condition report and exhibition history. At auction, remember the buyer&rsquo;s premium, taxes, shipping and insurance, and set your limit with those included.'
      ] },
    { id: 'bengal-modern', s: 'art', ago: 62, read: 5, art: ['gavel', 'oxblood'],
      t: 'Interest in Bangladeshi modern art keeps rising',
      dek: 'Works on paper by the masters are drawing new collectors, and new caution.',
      body: [
        'Interest in Bangladesh&rsquo;s modern masters, from Zainul Abedin to S. M. Sultan and Mohammad Kibria, continues to grow at home and abroad.',
        'Dealers advise new collectors to start with works on paper, and to insist on written provenance: rising prices bring a real risk of misattributed and copied works.'
      ] },
    { id: 'design-week', s: 'art', kind: 'brief', ago: 27, read: 1,
      t: 'Collectible design is the fastest-growing corner of the art market',
      dek: 'Furniture and lighting by known makers is drawing art buyers.',
      body: ['Galleries report that limited-edition furniture and lighting by recognised designers is drawing more art collectors than ever, with lighting the most sought-after category.'] },

    /* ---------------- motoring ---------------- */
    { id: 'classic-cars', s: 'motoring', ago: 24, read: 4, art: ['car', 'navy'],
      t: 'Classic cars: the youngtimers are taking over the auctions',
      dek: 'Cars from the 1980s and 1990s are now the focus for a new generation of collectors.',
      body: [
        'At classic car sales, the cars drawing the most bidders are no longer from the 1950s and 60s. Collectors who grew up with posters of 1980s and 90s sports cars are now buying them.',
        'Originality and documented history matter most. Specialists warn that heavily modified cars rarely hold their value.'
      ] },
    { id: 'ev-grand-tourer', s: 'motoring', ago: 70, read: 3, art: ['compass', 'teal'],
      t: 'The electric grand tourer comes of age',
      dek: 'Long range and fast charging are finally making electric road trips practical.',
      body: [
        'For years the electric car was a city car. Improvements in range and charging speed are now making long-distance electric touring realistic on major routes.',
        'Planning still matters: drivers advise mapping chargers before setting off, especially in rural areas.'
      ] },
    { id: 'chauffeur-brief', s: 'motoring', kind: 'brief', ago: 52, read: 1,
      t: 'Wedding season pushes up demand for chauffeured cars in Dhaka',
      dek: 'Book early for December weekends.',
      body: ['Car-hire firms say December weekends are already heavily booked for wedding functions. Families are advised to reserve cars and drivers for every evening at once.'] },

    /* ---------------- yachts & jets ---------------- */
    { id: 'caribbean-season', s: 'yachts', ago: 13, read: 4, art: ['yacht', 'navy'],
      t: 'Superyachts head west for the Caribbean winter season',
      dek: 'Charter fleets cross the Atlantic as the Mediterranean season ends.',
      body: [
        'With the Mediterranean season over, much of the charter fleet is crossing the Atlantic for the Caribbean winter. Christmas and New Year weeks are the most heavily booked.',
        'First-time charterers are reminded that the advertised fee is only part of the cost: fuel, food, harbour fees and crew tips are paid on top, often adding a quarter to a third.'
      ] },
    { id: 'fly-private-guide', s: 'yachts', ago: 37, read: 5, art: ['jet', 'night'],
      t: 'Charter, jet card or share: how people are flying private now',
      dek: 'A plain guide to the three main ways to fly privately.',
      body: [
        'Charter, where you pay per journey, suits those who fly privately a few times a year. Jet cards and memberships trade money up front for guaranteed availability. Fractional ownership suits those who fly a great deal.',
        'Whichever you choose, ask who operates the aircraft, how old it is, and what happens if it cannot fly on the day.'
      ] },
    { id: 'empty-legs', s: 'yachts', kind: 'brief', ago: 19, read: 1,
      t: 'Empty-leg flights: bargains, with conditions',
      dek: 'One-way private flights at a discount, if your plans can move.',
      body: ['Empty legs, private jets flying without passengers to collect someone else, can be booked at a large discount. The catch: the schedule belongs to the original client, and flights can change at short notice.'] },

    /* ---------------- property ---------------- */
    { id: 'dubai-homes', s: 'property', ago: 30, read: 4, art: ['skyline', 'coral'],
      t: 'Gulf property draws more buyers from South Asia',
      dek: 'Second homes and investment flats in the Gulf remain popular with Bangladeshi families abroad.',
      body: [
        'Agents report continued interest from South Asian buyers in Gulf property, both as second homes and as investments.',
        'Advisers recommend independent legal checks, a clear view of service charges, and caution with off-plan purchases.'
      ] },
    { id: 'villa-market', s: 'property', ago: 85, read: 4, art: ['door', 'ochre'],
      t: 'Buying a holiday home? Agents say rent it first',
      dek: 'A season as a tenant is the best survey there is.',
      body: [
        'Agents in popular holiday regions say the buyers who are happiest are those who rented in the area first, ideally in more than one season.',
        'A winter month reveals what a summer week never will: which restaurants close, how the roads are, and who the neighbours really are.'
      ] },
    { id: 'property-brief', s: 'property', kind: 'brief', ago: 41, read: 1,
      t: 'Gulshan and Baridhara rents hold firm into winter',
      dek: 'Furnished family flats remain in short supply.',
      body: ['Letting agents in Dhaka&rsquo;s diplomatic area say well-furnished family flats remain scarce, with the best properties let within days.'] },

    /* ---------------- wellness ---------------- */
    { id: 'longevity-clinics', s: 'wellness', ago: 21, read: 5, art: ['spa', 'sage'],
      t: 'The longevity retreat: part clinic, part spa',
      dek: 'Week-long stays now come with blood tests, scans and a doctor.',
      body: [
        'Many well-known wellness resorts now offer a medical programme alongside massages and mountain walks: blood tests, scans, sleep studies and advice built from the results.',
        'Doctors advise asking who the physicians are, what is included and what happens to your results afterwards, and talking to your own doctor first.'
      ] },
    { id: 'walking-holidays', s: 'wellness', ago: 66, read: 3, art: ['mountains', 'teal'],
      t: 'Walking holidays replace the beach for a new kind of rest',
      dek: 'Guided walks with luggage sent ahead are booming.',
      body: [
        'Walking holidays, where luggage travels ahead by car and each night is spent in a different inn, are one of the fastest-growing kinds of travel.',
        'Operators say the most popular routes are gentle: four to five hours a day, with long lunches.'
      ] },
    { id: 'wellness-brief', s: 'wellness', kind: 'brief', ago: 34, read: 1,
      t: 'Winter health check-ups: clinics advise booking before the holidays',
      dek: 'Appointments thin out in December.',
      body: ['Private clinics recommend booking annual check-ups before mid-December, when many specialists take leave.'] },

    /* ---------------- culture ---------------- */
    { id: 'book-fair', s: 'culture', ago: 15, read: 3, art: ['stage', 'plum'],
      t: 'The season of festivals: what is coming to Dhaka this winter',
      dek: 'Music, literature and the Ekushey Book Fair in February.',
      body: [
        'Dhaka&rsquo;s cultural calendar fills up as the weather cools, with classical music evenings, literature festivals and exhibitions running through to spring.',
        'The Amar Ekushey Book Fair runs through February, and remains one of the great gatherings of the year.'
      ] },
    { id: 'classical-music', s: 'culture', ago: 48, read: 3, art: ['piano', 'forest'],
      t: 'Concert halls report a younger audience for classical music',
      dek: 'Shorter programmes and late starts are drawing new listeners.',
      body: [
        'Concert halls in several cities say audiences for classical music are getting younger, helped by shorter programmes, later start times and informal late-night concerts.',
        'The best seats for major winter concerts are already selling.'
      ] },
    { id: 'culture-brief', s: 'culture', kind: 'brief', ago: 29, read: 1,
      t: 'Theatre tickets for the holiday season are going fast',
      dek: 'The big shows in London and New York are selling out weeks ahead.',
      body: ['Holiday-season performances of the major shows in London and New York are selling out weeks in advance. Matinees offer the best chance of good seats.'] },

    /* ---------------- tech ---------------- */
    { id: 'smart-home', s: 'tech', ago: 23, read: 4, art: ['tech', 'lagoon'],
      t: 'The quiet smart home: technology you never see',
      dek: 'Hidden speakers, invisible switches and lighting that follows the sun.',
      body: [
        'The newest smart homes are designed to hide their technology: speakers behind plaster, switches that look like stone, and lighting that warms and dims through the day.',
        'Installers say the best systems are the simplest to use, and that a good one is planned before the walls are finished.'
      ] },
    { id: 'travel-tech', s: 'tech', ago: 76, read: 3, art: ['compass', 'navy'],
      t: 'The travel gadgets frequent flyers actually use',
      dek: 'Trackers in luggage, good noise-cancelling and one universal charger.',
      body: [
        'Ask people who fly every week what they carry and the list is short: a tracker in every bag, noise-cancelling headphones, and a single compact charger for everything.',
        'Most also keep digital copies of passports and visas somewhere they can reach offline.'
      ] },
    { id: 'tech-brief', s: 'tech', kind: 'brief', ago: 43, read: 1,
      t: 'Luggage trackers become standard kit for families',
      dek: 'Airlines report fewer lost-bag disputes when passengers can share a location.',
      body: ['Small Bluetooth trackers in checked bags have become common, and travellers say being able to show the airline where a bag is speeds up recovery.'] },

    /* ---------------- bangladesh ---------------- */
    { id: 'jamdani-world', s: 'bangladesh', ago: 8, read: 5, art: ['jamdani', 'sand'],
      t: 'Jamdani finds a new audience far from home',
      dek: 'Designers abroad and a younger generation in Dhaka are rediscovering the UNESCO-recognised weave.',
      body: [
        'Jamdani, woven by hand with the pattern built into the cloth, was recognised by UNESCO as Intangible Cultural Heritage in 2013. The best still comes from weaving villages near the Shitalakshya river, outside Dhaka.',
        'Weavers say demand now comes from designers abroad cutting jamdani into jackets and scarves, and from younger buyers at home choosing it over imported silk.',
        'A fine sari can take weeks or months on the loom, so orders for the wedding season need to be placed early.'
      ] },
    { id: 'sundarbans-season', s: 'bangladesh', ago: 12, read: 4, art: ['boat', 'teal'],
      t: 'Sundarbans boat season opens with the dry, cool months',
      dek: 'November to February is the best time for the mangroves.',
      body: [
        'The cool, dry months are the best time to visit the Sundarbans, when calm water makes a few nights on a boat comfortable and the birdlife is at its richest.',
        'Operators say the best boats are booked early for the December holidays.'
      ] },
    { id: 'tea-country', s: 'bangladesh', ago: 36, read: 3, art: ['tea', 'forest'],
      t: 'Sreemangal&rsquo;s tea country is quiet, green and cool this month',
      dek: 'Weekend escapes from Dhaka are back in season.',
      body: [
        'The tea gardens of Sylhet and Sreemangal are at their most peaceful in the cool months, with misty mornings and empty lanes.',
        'Resorts in the area report strong weekend bookings through to February.'
      ] },
    { id: 'coast-winter', s: 'bangladesh', ago: 60, read: 3, art: ['sunsea', 'coral'],
      t: 'Cox&rsquo;s Bazar and Kuakata prepare for the busiest season',
      dek: 'The coast is at its finest from November to February.',
      body: [
        'Hotels along Bangladesh&rsquo;s coast say bookings for the winter season are strong, with December weekends filling first.',
        'Kuakata, one of the few beaches where both sunrise and sunset can be seen over the sea, is drawing more visitors each year.'
      ] },
    { id: 'old-dhaka', s: 'bangladesh', ago: 90, read: 3, art: ['palace', 'coral'],
      t: 'Old Dhaka, slowly: a morning between the palaces and the river',
      dek: 'Why the old city rewards the early riser.',
      body: [
        'Old Dhaka rewards anyone who arrives early. Before the traffic wakes up, Ahsan Manzil glows pink by the Buriganga and Lalbagh Fort is quiet enough to hear the birds.',
        'A small boat on the river before lunch, and the Star Mosque in the softer light of late morning, complete the perfect morning.'
      ] },
    { id: 'probashi-brief', s: 'bangladesh', kind: 'brief', ago: 6, read: 1,
      t: 'Flights home for December are filling fast',
      dek: 'Probashi families are advised to book now for the holidays.',
      body: ['Airlines serving Dhaka from the Gulf, Europe and North America report heavy December bookings as families plan winter visits and weddings.'] }
  ],

  // the travel season guide: best months (1 = January)
  where: [
    { place: 'The Sundarbans', region: 'Bangladesh', m: [11, 12, 1, 2] },
    { place: 'The Maldives', region: 'Indian Ocean', m: [12, 1, 2, 3, 4] },
    { place: 'The Alps', region: 'Ski season', m: [12, 1, 2, 3] },
    { place: 'Japan', region: 'Blossom and maples', m: [3, 4, 10, 11] },
    { place: 'The Masai Mara', region: 'Kenya', m: [7, 8, 9, 10] },
    { place: 'The Mediterranean', region: 'By yacht', m: [6, 7, 8, 9] }
  ],

  // coming up: recurring moments of the season (dates confirmed nearer the time)
  calendar: [
    { m: 'Nov', t: 'Wedding season begins', p: 'Dhaka' },
    { m: 'Dec', t: 'Art Basel Miami Beach', p: 'Early December' },
    { m: 'Dec', t: 'Victory Day', p: '16 December' },
    { m: 'Feb', t: 'Amar Ekushey Book Fair', p: 'All month, Dhaka' },
    { m: 'Feb', t: 'Pohela Falgun', p: 'The first day of spring' },
    { m: 'Mar', t: 'Art Basel Hong Kong', p: 'Late March' },
    { m: 'Apr', t: 'Pohela Boishakh', p: '14 April' },
    { m: 'Apr', t: 'Watches and Wonders', p: 'Geneva, spring' }
  ]
};
