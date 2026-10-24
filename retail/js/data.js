/* =========================================================
   WALVIS CONCIERGE · retail/js/data.js
   The Walvis Promenade: every floor, shop and piece in the mall.
   The pages in retail/ (lobby, floor, shop, piece) are all built from this file.
   ========================================================= */

/* Site-wide switches */
var WALVIS = window.WALVIS || {};
// true: show "template" notes and "Add a photo" labels on placeholder pieces.
WALVIS.showTemplateNotes = false;

/* =========================================================
   THE WALVIS PROMENADE
   Six floors, each with its shops, each shop with its pieces.

   HOW TO ADD A PIECE
     Copy one item block { ... } in a shop's "items" list, paste it after the
     last one (mind the comma) and change the text. Give it a new "id": short,
     lower case, words joined with dashes, and unique in the Promenade (it becomes
     the link retail/item.html?item=your-id).

   HOW TO CHANGE A PRICE
     "price" is in taka, digits only: 38 lakh is 3800000, 12.5 crore is 125000000.
     0 shows "Price on request". "priceNote": "from" shows "From ৳ 38 lakh".
     Prices are always shown as indicative. Every piece below is on request.

   PHOTOS
     "photo" names a free-licence file on Wikimedia Commons, with its author and
     licence (shown on each piece and on retail/credits.html), plus "local": where
     the downloaded copy lives. Run  python3 retail/tools/fetch_images.py  to copy
     every photo into retail/images/catalog/, then set "images" to "local" in
     retail/js/config.js. To use your own photo instead, put it in retail/images/
     and write  photo: { local: "retail/images/your-photo.jpg", author: "...", licence: "..." }.

   OTHER FIELDS
     availability  "Available", "On request", "Made to order", "Charter" or "Reserved"
     leadTime      a few words, e.g. "Six to eight weeks"
     specs         label: value pairs; empty values are not shown
     highlights    short lines, shown with ticks

   Describe pieces by name, but never use maker logos or press photos, and never
   word anything as if Walvis sells on behalf of a brand.
   ========================================================= */
var WALVIS_PROMENADE = {
  "name": "The Walvis Promenade",
  "levels": [
    {
      "id": "conveyance",
      "number": 1,
      "name": "Conveyance",
      "tagline": "Aircraft, cars, boats and everything that moves you.",
      "intro": "Jets that leave from Hazrat Shahjalal, helicopters on the Bangladesh register, cars for Gulshan and the Dhaka-Mawa expressway, and boats for the rivers and the Bay of Bengal. Sourced, inspected and delivered.",
      "shops": [
        {
          "id": "aircraft",
          "name": "Aircraft",
          "tagline": "Private jets, from regional hops to non-stop long range.",
          "items": [
            {
              "id": "bombardier-global-7500",
              "maker": "Bombardier",
              "title": "Bombardier Global 7500",
              "summary": "Bombardier's flagship long-range business jet, with four separate living spaces. It can fly Dhaka to London or New York non-stop with a light load.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Months, depending on the aircraft",
              "photo": {
                "file": "Bombardier Global 7500 on static display, EBACE 2018, Le Grand-Saconnex (BL7C0578).jpg",
                "author": "Matti Blume",
                "licence": "CC BY-SA 4.0",
                "shows": "A Global 7500 at EBACE 2018, Geneva",
                "local": "retail/images/catalog/bombardier-global-7500-on-static-display-ebace-2018-le-grand-saconnex-bl7c0578.jpg"
              },
              "gallery": [],
              "specs": {
                "Range": "7,700 nautical miles (14,260 km)",
                "Cabin": "Four living spaces",
                "Passengers": "Up to 19",
                "Maximum speed": "Mach 0.925"
              },
              "highlights": [
                "New or pre-owned, sourced through our network",
                "Pre-purchase inspection and records review",
                "Bangladesh (S2-) registration and CAAB paperwork arranged",
                "Import duties, taxes, registration and delivery quoted separately"
              ]
            },
            {
              "id": "gulfstream-g650er",
              "maker": "Gulfstream Aerospace",
              "title": "Gulfstream G650ER",
              "summary": "The extended-range G650: one of the fastest and longest-legged business jets flying. The aircraft in this photo was taken on the ground in Dhaka.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Months, depending on the aircraft",
              "photo": {
                "file": "Gulfstream G650ER - N1895T - Serial 6346 - VGHS.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "A G650ER at Hazrat Shahjalal International Airport, Dhaka (VGHS)",
                "local": "retail/images/catalog/gulfstream-g650er-n1895t-serial-6346-vghs.jpg"
              },
              "gallery": [],
              "specs": {
                "Range": "7,500 nautical miles (13,890 km)",
                "Maximum speed": "Mach 0.925",
                "Passengers": "Up to 19",
                "Engines": "Two Rolls-Royce BR725"
              },
              "highlights": [
                "Pre-owned aircraft with full logbooks",
                "Pre-purchase inspection at an approved centre",
                "Crew and management options on request",
                "Import duties, taxes, registration and delivery quoted separately"
              ]
            },
            {
              "id": "embraer-phenom-300e",
              "maker": "Embraer",
              "title": "Embraer Phenom 300E",
              "summary": "For years the world's best-selling light jet. Dhaka to Kathmandu, Bangkok or Kolkata sits comfortably within its range.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Weeks to months",
              "photo": {
                "file": "Embraer EMB-505 Phenom 300E (N373EE, cn 50500731) (3-20-2025).jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "A Phenom 300E in March 2025",
                "local": "retail/images/catalog/embraer-emb-505-phenom-300e-n373ee-cn-50500731-3-20-2025.jpg"
              },
              "gallery": [],
              "specs": {
                "Range": "About 2,010 nautical miles (3,720 km)",
                "Occupants": "Up to 10",
                "Pilots": "Certified for a single pilot",
                "Engines": "Two Pratt & Whitney Canada PW535E1"
              },
              "highlights": [
                "Ideal for regional trips across South and Southeast Asia",
                "New or pre-owned, with inspection",
                "Charter before you buy, on request",
                "Import duties, taxes, registration and delivery quoted separately"
              ]
            }
          ],
          "image": ""
        },
        {
          "id": "automobiles",
          "name": "Automobiles",
          "tagline": "Chauffeur-driven saloons and grand SUVs.",
          "items": [
            {
              "id": "rolls-royce-cullinan",
              "maker": "Rolls-Royce",
              "title": "Rolls-Royce Cullinan",
              "summary": "Rolls-Royce's first SUV, launched in 2018, with a V12 and the brand's 'magic carpet' ride. As at home on a village road as it is in Gulshan.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Weeks to months",
              "photo": {
                "file": "Rolls-Royce Cullinan.jpg",
                "author": "Tristan Surtel",
                "licence": "See the file page",
                "shows": "A Rolls-Royce Cullinan",
                "local": "retail/images/catalog/rolls-royce-cullinan.jpg"
              },
              "gallery": [],
              "specs": {
                "Engine": "6.75-litre twin-turbo V12",
                "Drive": "All-wheel drive",
                "Seats": "Four or five",
                "On sale since": "2018"
              },
              "highlights": [
                "New or pre-owned, sourced with service history",
                "Independent inspection before purchase",
                "Bangladesh import duties are high on large engines: we quote them up front",
                "Import duties, taxes, registration and delivery quoted separately"
              ]
            },
            {
              "id": "mercedes-maybach-s680",
              "maker": "Mercedes-Maybach",
              "title": "Mercedes-Maybach S 680",
              "summary": "The long-wheelbase Maybach S-Class with its V12, built for the back seat: reclining executive seats, a hushed cabin and two-tone paint.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Weeks to months",
              "photo": {
                "file": "Mercedes-Maybach Z223 680 1X7A5831.jpg",
                "author": "Alexander Migl",
                "licence": "See the file page",
                "shows": "A Mercedes-Maybach S 680 (Z223)",
                "local": "retail/images/catalog/mercedes-maybach-z223-680-1x7a5831.jpg"
              },
              "gallery": [],
              "specs": {
                "Engine": "6.0-litre twin-turbo V12",
                "Drive": "4MATIC all-wheel drive",
                "Generation": "Z223, from 2021",
                "Seats": "Four or five"
              },
              "highlights": [
                "Chauffeur-ready specification on request",
                "Independent inspection before purchase",
                "Import duties, taxes, registration and delivery quoted separately"
              ]
            },
            {
              "id": "toyota-land-cruiser-300",
              "maker": "Toyota",
              "title": "Toyota Land Cruiser 300",
              "summary": "The Land Cruiser is a familiar sight on Bangladesh's roads, and the 300 series is the current generation: strong, comfortable and built to last.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Weeks",
              "photo": {
                "file": "Toyota Land Cruiser LC300.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "A Toyota Land Cruiser 300",
                "local": "retail/images/catalog/toyota-land-cruiser-lc300.jpg"
              },
              "gallery": [],
              "specs": {
                "Engines": "3.5-litre twin-turbo V6 petrol, or 3.3-litre twin-turbo V6 diesel (by market)",
                "Drive": "Four-wheel drive",
                "Seats": "Up to seven",
                "On sale since": "2021"
              },
              "highlights": [
                "New or low-mileage examples sourced",
                "Choice of trim and specification",
                "Import duties, taxes, registration and delivery quoted separately"
              ]
            }
          ],
          "image": ""
        },
        {
          "id": "boats",
          "name": "Boat",
          "tagline": "Yachts, classic runabouts and the boats of Bengal.",
          "items": [
            {
              "id": "azimut-motor-yacht",
              "maker": "Azimut Yachts",
              "title": "Azimut motor yacht",
              "summary": "Italian motor yachts from one of the world's largest builders, founded in Turin in 1969. For coastal cruising off Cox's Bazar and Saint Martin's.",
              "price": 0,
              "priceNote": "",
              "availability": "Made to order",
              "leadTime": "Months",
              "photo": {
                "file": "Azimut Yacht Cannes IMG 1300.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "An Azimut yacht at Cannes",
                "local": "retail/images/catalog/azimut-yacht-cannes-img-1300.jpg"
              },
              "gallery": [],
              "specs": {
                "Builder": "Azimut Yachts, Italy",
                "Founded": "1969",
                "Size": "Chosen with you, from flybridge to superyacht"
              },
              "highlights": [
                "New build or brokerage",
                "Survey and sea trial before purchase",
                "Shipping and berthing arranged",
                "Import duties, taxes, registration and delivery quoted separately"
              ]
            },
            {
              "id": "riva-aquarama",
              "maker": "Riva",
              "title": "Riva Aquarama",
              "summary": "The varnished mahogany runabout, built by Riva on Lake Iseo from 1962 until 1996. Restored examples are prized by collectors.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Months, depending on the boat",
              "photo": {
                "file": "Riva Aquarama.jpg",
                "author": "StuivertjeWisselen",
                "licence": "CC BY-SA 4.0",
                "shows": "A Riva Aquarama",
                "local": "retail/images/catalog/riva-aquarama.jpg"
              },
              "gallery": [],
              "specs": {
                "Builder": "Riva, Sarnico, Italy",
                "Built": "1962 to 1996",
                "Hull": "Mahogany, varnished"
              },
              "highlights": [
                "Restored and original examples sourced",
                "Marine survey and restoration history",
                "Import duties, taxes, registration and delivery quoted separately"
              ]
            },
            {
              "id": "bajra-houseboat",
              "maker": "Boatbuilders of Bangladesh",
              "title": "Bajra, the Bengali houseboat",
              "summary": "The bajra is the traditional wooden houseboat of Bengal's rivers, with cabins under its roof. Rabindranath Tagore wrote aboard his own bajra, the 'Padma', at Shilaidaha. We commission new ones from traditional builders.",
              "price": 0,
              "priceNote": "",
              "availability": "Made to order",
              "leadTime": "Months",
              "photo": {
                "file": "Bajra Nouka.jpg",
                "author": "Bellayet",
                "licence": "See the file page",
                "shows": "A bajra on a Bangladeshi river",
                "local": "retail/images/catalog/bajra-nouka.jpg"
              },
              "gallery": [],
              "specs": {
                "Built in": "Bangladesh",
                "Material": "Wood, built by traditional boatbuilders",
                "Use": "River cruising and stays on the water"
              },
              "highlights": [
                "Commissioned to your design",
                "Cabins, crew quarters and modern safety fittings",
                "River permits and crew arranged"
              ]
            }
          ],
          "image": ""
        },
        {
          "id": "helicopters",
          "name": "Helicopters",
          "tagline": "Rotorcraft for city hops and the char lands.",
          "items": [
            {
              "id": "bell-407gx",
              "maker": "Bell",
              "title": "Bell 407GX",
              "summary": "A single-engine helicopter with a Garmin glass cockpit, widely used for charter. The aircraft in this photo is on the Bangladesh register at Hazrat Shahjalal.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Months",
              "photo": {
                "file": "S2-AGB,Bell-407 gx Helicopter.jpg",
                "author": "Md Shaifuzzaman",
                "licence": "CC BY-SA 4.0",
                "shows": "Bell 407GX S2-AGB at Hazrat Shahjalal International Airport",
                "local": "retail/images/catalog/s2-agb-bell-407-gx-helicopter.jpg"
              },
              "gallery": [],
              "specs": {
                "Engine": "One Rolls-Royce M250-C47B turboshaft",
                "Cockpit": "Garmin G1000H",
                "Seats": "Pilot plus up to six"
              },
              "highlights": [
                "New or pre-owned, with logbooks",
                "Bangladesh (S2-) registration and CAAB paperwork",
                "Import duties, taxes, registration and delivery quoted separately"
              ]
            },
            {
              "id": "airbus-h125",
              "maker": "Airbus Helicopters",
              "title": "Airbus H125",
              "summary": "Formerly the AS350 B3e Écureuil. A single-engine workhorse known for high-altitude flying: an AS350 B3 landed on the summit of Everest in 2005.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Months",
              "photo": {
                "file": "Airbus Helicopters H125 (HB-ZIA) der Air Zermatt (3).jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "An H125 of Air Zermatt",
                "local": "retail/images/catalog/airbus-helicopters-h125-hb-zia-der-air-zermatt-3.jpg"
              },
              "gallery": [],
              "specs": {
                "Engine": "One Safran Arriel 2D",
                "Seats": "Pilot plus up to six",
                "Former name": "AS350 B3e"
              },
              "highlights": [
                "New or pre-owned",
                "Pre-purchase inspection",
                "Import duties, taxes, registration and delivery quoted separately"
              ]
            },
            {
              "id": "robinson-r66",
              "maker": "Robinson Helicopter Company",
              "title": "Robinson R66",
              "summary": "Robinson's turbine helicopter: light, simple to run and a sensible first helicopter. This one is registered in Bangladesh.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Weeks to months",
              "photo": {
                "file": "S2-AIN, Robinson R66 Helicopter.jpg",
                "author": "See the file page",
                "licence": "CC BY-SA 4.0",
                "shows": "Robinson R66 S2-AIN in Bangladesh",
                "local": "retail/images/catalog/s2-ain-robinson-r66-helicopter.jpg"
              },
              "gallery": [],
              "specs": {
                "Engine": "One Rolls-Royce RR300 turboshaft",
                "Seats": "Five",
                "Maker": "Robinson, Torrance, California"
              },
              "highlights": [
                "New or pre-owned",
                "Pilot training can be arranged",
                "Import duties, taxes, registration and delivery quoted separately"
              ]
            }
          ],
          "image": ""
        },
        {
          "id": "rv",
          "name": "RV",
          "tagline": "Motorhomes and travel trailers for the long road.",
          "items": [
            {
              "id": "airstream-travel-trailer",
              "maker": "Airstream",
              "title": "Airstream travel trailer",
              "summary": "The riveted aluminium trailer that Airstream has built since the 1930s. Vintage examples are restored and collected around the world.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Months",
              "photo": {
                "file": "1963 Airstream trailer in Joshua Tree dllu.jpg",
                "author": "Daniel Lu (dllu)",
                "licence": "See the file page",
                "shows": "A 1963 Airstream in Joshua Tree, California",
                "local": "retail/images/catalog/1963-airstream-trailer-in-joshua-tree-dllu.jpg"
              },
              "gallery": [],
              "specs": {
                "Maker": "Airstream, Jackson Center, Ohio",
                "Body": "Riveted aluminium",
                "Options": "New, or restored vintage"
              },
              "highlights": [
                "Restored vintage or new trailers",
                "Bangladesh road and registration rules checked first",
                "Import duties, taxes, registration and delivery quoted separately"
              ]
            },
            {
              "id": "mercedes-sprinter-motorhome",
              "maker": "Coachbuilders on Mercedes-Benz",
              "title": "Mercedes-Benz based motorhome",
              "summary": "A compact motorhome on a Mercedes-Benz van chassis: easy to drive, with a kitchen, washroom and beds. Good for the Marine Drive to Teknaf.",
              "price": 0,
              "priceNote": "",
              "availability": "Made to order",
              "leadTime": "Months",
              "photo": {
                "file": "Mercedes based motorhome (7551831866).jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "A motorhome on a Mercedes-Benz chassis",
                "local": "retail/images/catalog/mercedes-based-motorhome-7551831866.jpg"
              },
              "gallery": [],
              "specs": {
                "Chassis": "Mercedes-Benz van",
                "Berths": "Usually two to four",
                "Body": "By specialist coachbuilders"
              },
              "highlights": [
                "Layout chosen with you",
                "Registration rules in Bangladesh checked first",
                "Import duties, taxes, registration and delivery quoted separately"
              ]
            },
            {
              "id": "volkner-performance",
              "maker": "Volkner Mobil",
              "title": "Volkner Mobil luxury motorhome",
              "summary": "German luxury motorhomes, known for a garage under the floor that can carry a car. A house on wheels with your car inside.",
              "price": 0,
              "priceNote": "",
              "availability": "Made to order",
              "leadTime": "Many months",
              "photo": {
                "file": "Wuppertal, Simonshöfchen 41, Volkner Mobil GmbH, Wohnmobile.jpg",
                "author": "Im Fokus",
                "licence": "See the file page",
                "shows": "Volkner Mobil motorhomes in Wuppertal, Germany",
                "local": "retail/images/catalog/wuppertal-simonshofchen-41-volkner-mobil-gmbh-wohnmobile.jpg"
              },
              "gallery": [],
              "specs": {
                "Maker": "Volkner Mobil, Germany",
                "Signature": "Under-floor garage for a car",
                "Build": "Made to order"
              },
              "highlights": [
                "Built to your specification",
                "Shipping and registration quoted separately"
              ]
            }
          ],
          "image": ""
        },
        {
          "id": "cars",
          "name": "Cars",
          "tagline": "Supercars and sports cars for the driver.",
          "items": [
            {
              "id": "porsche-911-turbo-s",
              "maker": "Porsche",
              "title": "Porsche 911 Turbo S (992)",
              "summary": "The fastest everyday supercar: all-wheel drive, four seats, and still easy to drive in Dhaka traffic.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Weeks to months",
              "photo": {
                "file": "Porsche 992 Turbo S 1X7A0411.jpg",
                "author": "Alexander Migl",
                "licence": "See the file page",
                "shows": "A Porsche 911 Turbo S of the 992 generation",
                "local": "retail/images/catalog/porsche-992-turbo-s-1x7a0411.jpg"
              },
              "gallery": [],
              "specs": {
                "Engine": "3.7-litre twin-turbo flat-six",
                "Power": "650 PS (2020 to 2024 cars)",
                "0 to 100 km/h": "2.7 seconds",
                "Drive": "All-wheel drive"
              },
              "highlights": [
                "New or low-mileage examples",
                "Independent inspection",
                "Import duties, taxes, registration and delivery quoted separately"
              ]
            },
            {
              "id": "ferrari-296-gtb",
              "maker": "Ferrari",
              "title": "Ferrari 296 GTB",
              "summary": "Ferrari's plug-in hybrid berlinetta: a V6 with an electric motor, and a short electric-only range for quiet starts.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Months",
              "photo": {
                "file": "Ferrari 296 GTB.jpg",
                "author": "MrWalkr",
                "licence": "See the file page",
                "shows": "A Ferrari 296 GTB",
                "local": "retail/images/catalog/ferrari-296-gtb.jpg"
              },
              "gallery": [],
              "specs": {
                "Engine": "2.9-litre twin-turbo V6 with an electric motor",
                "Combined power": "830 cv",
                "0 to 100 km/h": "2.9 seconds",
                "Drive": "Rear-wheel drive"
              },
              "highlights": [
                "Specification and colour chosen with you",
                "Independent inspection on pre-owned cars",
                "Import duties, taxes, registration and delivery quoted separately"
              ]
            },
            {
              "id": "lamborghini-revuelto",
              "maker": "Lamborghini",
              "title": "Lamborghini Revuelto",
              "summary": "Lamborghini's first V12 plug-in hybrid, which replaced the Aventador: a naturally aspirated V12 with three electric motors.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Months",
              "photo": {
                "file": "Lamborghini Revuelto DSC 6987.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "A Lamborghini Revuelto",
                "local": "retail/images/catalog/lamborghini-revuelto-dsc-6987.jpg"
              },
              "gallery": [],
              "specs": {
                "Engine": "6.5-litre V12 with three electric motors",
                "Combined power": "1,015 cv",
                "0 to 100 km/h": "2.5 seconds",
                "Drive": "All-wheel drive"
              },
              "highlights": [
                "Allocation or pre-owned examples sourced",
                "Independent inspection",
                "Import duties, taxes, registration and delivery quoted separately"
              ]
            }
          ],
          "image": ""
        },
        {
          "id": "jet-ski",
          "name": "Jet ski",
          "tagline": "Personal watercraft for the river and the sea.",
          "items": [
            {
              "id": "yamaha-fx-svho",
              "maker": "Yamaha",
              "title": "Yamaha FX SVHO WaveRunner",
              "summary": "Yamaha's flagship sit-down personal watercraft with a supercharged engine. Room for three.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Weeks",
              "photo": {
                "file": "2020 Yamaha FX SVHO WaveRunner.jpg",
                "author": "See the file page",
                "licence": "CC BY 2.0",
                "shows": "A 2020 Yamaha FX SVHO WaveRunner",
                "local": "retail/images/catalog/2020-yamaha-fx-svho-waverunner.jpg"
              },
              "gallery": [],
              "specs": {
                "Engine": "1.8-litre supercharged four-stroke",
                "Riders": "Up to three",
                "Type": "Sit-down personal watercraft"
              },
              "highlights": [
                "New units sourced",
                "Trailer and safety kit on request",
                "Import duties, taxes, registration and delivery quoted separately"
              ]
            },
            {
              "id": "sea-doo-spark",
              "maker": "Sea-Doo",
              "title": "Sea-Doo Spark",
              "summary": "The light, playful entry to personal watercraft, with a hull made of Polytec. Easy to tow and to store.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Weeks",
              "photo": {
                "file": "Sea-Doo Spark.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "A Sea-Doo Spark",
                "local": "retail/images/catalog/sea-doo-spark.jpg"
              },
              "gallery": [],
              "specs": {
                "Engine": "Rotax 900 ACE",
                "Riders": "Two or three, by model",
                "Hull": "Polytec composite"
              },
              "highlights": [
                "New units sourced",
                "Delivered with safety kit",
                "Import duties, taxes, registration and delivery quoted separately"
              ]
            },
            {
              "id": "kawasaki-js550",
              "maker": "Kawasaki",
              "title": "Kawasaki JS550 Jet Ski",
              "summary": "The classic stand-up Jet Ski from the 1980s, now collected and restored. 'Jet Ski' is Kawasaki's own trademark.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Weeks to months",
              "photo": {
                "file": "1985 Kawasaki 550 Jet Ski®.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "A 1985 Kawasaki 550 Jet Ski",
                "local": "retail/images/catalog/1985-kawasaki-550-jet-ski.jpg"
              },
              "gallery": [],
              "specs": {
                "Type": "Stand-up personal watercraft",
                "Engine": "Two-stroke twin, 550 cc class",
                "Era": "1980s"
              },
              "highlights": [
                "Restored examples sourced",
                "Condition report before purchase",
                "Import duties, taxes, registration and delivery quoted separately"
              ]
            }
          ],
          "image": ""
        }
      ],
      "image": ""
    },
    {
      "id": "masterpieces",
      "number": 2,
      "name": "Masterpieces",
      "tagline": "Paintings, sculpture and photography, with provenance.",
      "intro": "Works by the masters of Bangladeshi modern art, from private collections and the secondary market. Every work is checked for provenance and authenticity before you commit.",
      "shops": [
        {
          "id": "paintings",
          "name": "Paintings",
          "tagline": "The masters of Bangladeshi modern art.",
          "items": [
            {
              "id": "zainul-abedin",
              "maker": "Zainul Abedin (1914-1976)",
              "title": "A work by Zainul Abedin",
              "summary": "Shilpacharya Zainul Abedin, the father of modern art in Bangladesh, known for his famine sketches of 1943. He founded the art institute in Dhaka in 1948, now the Faculty of Fine Art at the University of Dhaka.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "When a work is offered",
              "photo": {
                "file": "Zainul Abedin Museum, Mymensingh.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "The Zainul Abedin Museum in Mymensingh, which holds his work",
                "local": "retail/images/catalog/zainul-abedin-museum-mymensingh.jpg"
              },
              "gallery": [],
              "specs": {
                "Artist": "Zainul Abedin",
                "Born": "1914, Kishoreganj",
                "Media": "Ink, watercolour and oil, by work"
              },
              "highlights": [
                "Works from private collections, when one is offered",
                "Provenance and authenticity checked by experts",
                "Export and cultural-property rules checked"
              ]
            },
            {
              "id": "sm-sultan",
              "maker": "S. M. Sultan (1923-1994)",
              "title": "A work by S. M. Sultan",
              "summary": "S. M. Sultan of Narail painted the farmers of Bengal as powerful, muscular figures. His home on the Chitra river is now a memorial museum.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "When a work is offered",
              "photo": {
                "file": "House of SM Sultan.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "S. M. Sultan's house in Narail",
                "local": "retail/images/catalog/house-of-sm-sultan.jpg"
              },
              "gallery": [],
              "specs": {
                "Artist": "S. M. Sultan",
                "Born": "1923, Narail",
                "Known for": "Monumental paintings of rural Bengal"
              },
              "highlights": [
                "Works from private collections, when one is offered",
                "Provenance and authenticity checked by experts",
                "Export and cultural-property rules checked"
              ]
            },
            {
              "id": "mohammad-kibria",
              "maker": "Mohammad Kibria (1929-2011)",
              "title": "A work by Mohammad Kibria",
              "summary": "Mohammad Kibria was a pioneer of abstract painting in Bangladesh, known for quiet, textured surfaces and restrained colour.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "When a work is offered",
              "photo": {
                "file": "Mohammad Kibria 1958.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "Mohammad Kibria, 1958",
                "local": "retail/images/catalog/mohammad-kibria-1958.jpg"
              },
              "gallery": [],
              "specs": {
                "Artist": "Mohammad Kibria",
                "Style": "Abstract",
                "Media": "Oil, and prints"
              },
              "highlights": [
                "Works from private collections, when one is offered",
                "Provenance and authenticity checked by experts"
              ]
            }
          ],
          "image": ""
        },
        {
          "id": "sculptures",
          "name": "Sculptures",
          "tagline": "Bronze, stone and the modern Bangladeshi sculptors.",
          "items": [
            {
              "id": "novera-ahmed",
              "maker": "Novera Ahmed (1939-2015)",
              "title": "A work by Novera Ahmed",
              "summary": "Novera Ahmed was the first modernist sculptor of Bangladesh. She worked with Hamidur Rahman on the original design of the Shaheed Minar.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "When a work is offered",
              "photo": {
                "file": "Composition by Novera Ahmed.jpg",
                "author": "Mashkawat.ahsan",
                "licence": "See the file page",
                "shows": "A composition by Novera Ahmed",
                "local": "retail/images/catalog/composition-by-novera-ahmed.jpg"
              },
              "gallery": [],
              "specs": {
                "Artist": "Novera Ahmed",
                "Media": "Cement, bronze and mixed media, by work"
              },
              "highlights": [
                "Works from private collections, when one is offered",
                "Provenance and condition checked",
                "Crating and transport arranged"
              ]
            },
            {
              "id": "syed-abdullah-khalid",
              "maker": "Syed Abdullah Khalid (1942-2017)",
              "title": "A work by Syed Abdullah Khalid",
              "summary": "The sculptor of Aparajeyo Bangla, the 1979 memorial to the Liberation War at the University of Dhaka. Smaller works and studies come to the market rarely.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "When a work is offered",
              "photo": {
                "file": "Aparajeyo Bangla statue.jpg",
                "author": "Ranadipam Basu",
                "licence": "See the file page",
                "shows": "Aparajeyo Bangla at the University of Dhaka, his best-known work",
                "local": "retail/images/catalog/aparajeyo-bangla-statue.jpg"
              },
              "gallery": [],
              "specs": {
                "Artist": "Syed Abdullah Khalid",
                "Best-known work": "Aparajeyo Bangla, 1979"
              },
              "highlights": [
                "Works from private collections, when one is offered",
                "Provenance checked",
                "Crating and transport arranged"
              ]
            },
            {
              "id": "nitun-kundu",
              "maker": "Nitun Kundu (1935-2006)",
              "title": "A work by Nitun Kundu",
              "summary": "Sculptor of Shabash Bangladesh at Rajshahi University, and founder of the furniture maker Otobi.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "When a work is offered",
              "photo": {
                "file": "Shabash Bangladesh.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "Shabash Bangladesh at Rajshahi University, by Nitun Kundu",
                "local": "retail/images/catalog/shabash-bangladesh.jpg"
              },
              "gallery": [],
              "specs": {
                "Artist": "Nitun Kundu",
                "Best-known work": "Shabash Bangladesh, Rajshahi University"
              },
              "highlights": [
                "Works from private collections, when one is offered",
                "Provenance checked",
                "Crating and transport arranged"
              ]
            }
          ],
          "image": ""
        },
        {
          "id": "photographs",
          "name": "Photographs",
          "tagline": "Fine-art prints, vintage photographs and the cameras that made them.",
          "items": [
            {
              "id": "dhaka-gallery-prints",
              "maker": "Photographers shown in Dhaka",
              "title": "Signed fine-art prints",
              "summary": "Editioned, signed prints by Bangladeshi photographers, through Dhaka's galleries such as Drik, which also runs the Chobi Mela festival.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Weeks",
              "photo": {
                "file": "Exhibition at Drik Gallery, Dhaka (1).JPG",
                "author": "Shuvro",
                "licence": "See the file page",
                "shows": "An exhibition at Drik Gallery, Dhaka",
                "local": "retail/images/catalog/exhibition-at-drik-gallery-dhaka-1.jpg"
              },
              "gallery": [],
              "specs": {
                "Format": "Editioned archival prints",
                "Paperwork": "Edition number and certificate"
              },
              "highlights": [
                "Prints chosen with you",
                "Framing and hanging arranged"
              ]
            },
            {
              "id": "vintage-bengal-photographs",
              "maker": "Studios of 19th-century Bengal",
              "title": "Vintage photographs of Bengal",
              "summary": "Original 19th-century photographs of Dhaka and Bengal by studios such as Johnston & Hoffmann of Calcutta, who photographed Ahsan Manzil after the tornado of 1888.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "When a print is offered",
              "photo": {
                "file": "Ahsan Manzil 1888.jpg",
                "author": "Johnston & Hoffmann",
                "licence": "Public domain (see the file page)",
                "shows": "Ahsan Manzil, Dhaka, after the tornado of 1888",
                "local": "retail/images/catalog/ahsan-manzil-1888.jpg"
              },
              "gallery": [],
              "specs": {
                "Era": "19th and early 20th century",
                "Process": "Albumen and gelatin silver prints, by piece"
              },
              "highlights": [
                "Condition and process checked",
                "Conservation framing arranged"
              ]
            },
            {
              "id": "leica-m3",
              "maker": "Leica (Ernst Leitz)",
              "title": "Leica M3",
              "summary": "The 35 mm rangefinder Leitz introduced in 1954, still one of the most loved cameras ever made, and still shooting.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Weeks",
              "photo": {
                "file": "Leica-M3-01 hg.jpg",
                "author": "Hannes Grobe",
                "licence": "See the file page",
                "shows": "A Leica M3",
                "local": "retail/images/catalog/leica-m3-01-hg.jpg"
              },
              "gallery": [],
              "specs": {
                "Type": "35 mm rangefinder",
                "Made": "1954 to 1966",
                "Maker": "Ernst Leitz, Wetzlar"
              },
              "highlights": [
                "Serviced, working examples",
                "Lenses sourced on request"
              ]
            }
          ],
          "image": ""
        }
      ],
      "image": ""
    },
    {
      "id": "accessories",
      "number": 3,
      "name": "Accessories",
      "tagline": "Jewellery, watches, bags and the crafts of Bangladesh.",
      "intro": "Gold from the goldsmiths of Dhaka, the watches collectors wait years for, travel bags, and the finest nakshi kantha and jamdani, made by the artisans who keep these crafts alive.",
      "shops": [
        {
          "id": "jewelry",
          "name": "Jewelry",
          "tagline": "Necklaces and earrings, from bridal gold to fine pearls.",
          "items": [
            {
              "id": "bridal-gold-necklace",
              "maker": "Goldsmiths of Dhaka",
              "title": "Bridal gold necklace set",
              "summary": "A Bengali bridal set in 22 karat gold, with a long necklace, a choker and matching pieces, made by goldsmiths in Dhaka.",
              "price": 0,
              "priceNote": "",
              "availability": "Made to order",
              "leadTime": "Weeks",
              "photo": {
                "file": "Bengali Hindu wedding DSCN1106 06.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "A Bengali bride wearing gold jewellery",
                "local": "retail/images/catalog/bengali-hindu-wedding-dscn1106-06.jpg"
              },
              "gallery": [],
              "specs": {
                "Gold": "22 karat, hallmarked",
                "Pieces": "Chosen with you"
              },
              "highlights": [
                "Designed with you and made by hand",
                "Weight and purity certified"
              ]
            },
            {
              "id": "gold-jhumka-earrings",
              "maker": "Goldsmiths of Dhaka",
              "title": "Gold jhumka earrings",
              "summary": "Bell-shaped jhumka earrings, worn across South Asia for centuries and loved at Bangladeshi weddings and festivals.",
              "price": 0,
              "priceNote": "",
              "availability": "Made to order",
              "leadTime": "Weeks",
              "photo": {
                "file": "Gold Jhumka, Dogra Culture, Jammu.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "Gold jhumka earrings (photographed in Jammu)",
                "local": "retail/images/catalog/gold-jhumka-dogra-culture-jammu.jpg"
              },
              "gallery": [],
              "specs": {
                "Gold": "22 or 21 karat",
                "Stones": "Pearls, rubies or none, as you like"
              },
              "highlights": [
                "Made to your design",
                "Weight and purity certified"
              ]
            },
            {
              "id": "gold-pearl-choker",
              "maker": "Fine jewellers",
              "title": "Gold and pearl choker",
              "summary": "A close-fitting neckband of gold and pearls. Natural or cultured pearls, chosen and graded with you.",
              "price": 0,
              "priceNote": "",
              "availability": "Made to order",
              "leadTime": "Weeks",
              "photo": {
                "file": "Gold and pearls neckband.JPG",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "A gold and pearl neckband",
                "local": "retail/images/catalog/gold-and-pearls-neckband.jpg"
              },
              "gallery": [],
              "specs": {
                "Gold": "22 or 18 karat",
                "Pearls": "Natural or cultured, graded"
              },
              "highlights": [
                "Pearls graded and certified",
                "Made to measure"
              ]
            }
          ],
          "image": ""
        },
        {
          "id": "watches",
          "name": "Watch",
          "tagline": "The steel sports watches collectors wait years for.",
          "items": [
            {
              "id": "rolex-submariner",
              "maker": "Rolex",
              "title": "Rolex Submariner Date",
              "summary": "The dive watch Rolex introduced in 1953. Waiting lists are long; we source new and pre-owned pieces with papers.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Weeks to months",
              "photo": {
                "file": "Rolex Submariner diving watch.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "A Rolex Submariner",
                "local": "retail/images/catalog/rolex-submariner-diving-watch.jpg"
              },
              "gallery": [],
              "specs": {
                "Case": "41 mm (current), Oystersteel",
                "Water resistance": "300 metres",
                "Bezel": "Unidirectional, ceramic insert"
              },
              "highlights": [
                "New or pre-owned, with box and papers",
                "Authenticity checked before purchase"
              ]
            },
            {
              "id": "patek-philippe-nautilus-5711",
              "maker": "Patek Philippe",
              "title": "Patek Philippe Nautilus 5711/1A",
              "summary": "Gérald Genta's 1976 design, in its most famous steel reference. Patek Philippe ended the 5711/1A in 2021, so every example now is pre-owned.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Weeks to months",
              "photo": {
                "file": "Patek-Philippe-Nautilus-5711-1A-010-1.jpg",
                "author": "Mechanicalnerd",
                "licence": "CC BY-SA 4.0",
                "shows": "A Nautilus 5711/1A-010",
                "local": "retail/images/catalog/patek-philippe-nautilus-5711-1a-010-1.jpg"
              },
              "gallery": [],
              "specs": {
                "Reference": "5711/1A",
                "Case": "40 mm steel",
                "Movement": "Automatic calibre 26-330 S C (later examples)",
                "Production ended": "2021"
              },
              "highlights": [
                "Pre-owned, with box and papers",
                "Authenticity checked by an independent watchmaker"
              ]
            },
            {
              "id": "audemars-piguet-royal-oak-15202",
              "maker": "Audemars Piguet",
              "title": "Audemars Piguet Royal Oak 15202 'Jumbo'",
              "summary": "The extra-thin 39 mm Royal Oak, closest to Genta's 1972 original. It was replaced by the 16202 in 2022.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Weeks to months",
              "photo": {
                "file": "Audemars Piguet Royal Oak ref. 15202.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "A Royal Oak ref. 15202 with a blue dial",
                "local": "retail/images/catalog/audemars-piguet-royal-oak-ref-15202.jpg"
              },
              "gallery": [],
              "specs": {
                "Reference": "15202ST",
                "Case": "39 mm steel, extra-thin",
                "Movement": "Automatic calibre 2121",
                "Successor": "16202, from 2022"
              },
              "highlights": [
                "Pre-owned, with box and papers",
                "Authenticity checked by an independent watchmaker"
              ]
            }
          ],
          "image": ""
        },
        {
          "id": "bags",
          "name": "Bags",
          "tagline": "Luggage and travel bags, from aluminium to jute.",
          "items": [
            {
              "id": "rimowa-aluminium",
              "maker": "Rimowa",
              "title": "Rimowa aluminium suitcase",
              "summary": "The grooved aluminium suitcase from Cologne, a design Rimowa has made for decades. Light, strong and built to be repaired.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Weeks",
              "photo": {
                "file": "Rimowa Koffer Topas-Serie.jpg",
                "author": "1971markus",
                "licence": "CC BY-SA 4.0",
                "shows": "Rimowa Topas aluminium suitcases",
                "local": "retail/images/catalog/rimowa-koffer-topas-serie.jpg"
              },
              "gallery": [],
              "specs": {
                "Shell": "Grooved aluminium",
                "Sizes": "Cabin to large check-in"
              },
              "highlights": [
                "New pieces sourced",
                "Monogramming on request"
              ]
            },
            {
              "id": "vintage-rimowa",
              "maker": "Rimowa",
              "title": "Vintage Rimowa aluminium case",
              "summary": "Older Rimowa aluminium cases wear their dents like passport stamps. We find well-kept vintage pieces for collectors.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "When one is offered",
              "photo": {
                "file": "Rimowa alt.jpg",
                "author": "Kofferfoto",
                "licence": "See the file page",
                "shows": "A Rimowa aluminium case from about 1982",
                "local": "retail/images/catalog/rimowa-alt.jpg"
              },
              "gallery": [],
              "specs": {
                "Era": "About 1980s",
                "Shell": "Grooved aluminium"
              },
              "highlights": [
                "Condition report before purchase",
                "Locks and wheels serviced"
              ]
            },
            {
              "id": "jute-leather-travel-bag",
              "maker": "Workshops of Bangladesh",
              "title": "Jute and leather travel bag",
              "summary": "Bangladesh's golden fibre, jute, with fine leather, made into a weekender by workshops in Bangladesh. Made to your size and colour.",
              "price": 0,
              "priceNote": "",
              "availability": "Made to order",
              "leadTime": "Weeks",
              "photo": {
                "file": "Jute Cultivation and Processing Bangladesh (2).JPG",
                "author": "Shahnoor Habib Munmun",
                "licence": "CC BY 3.0",
                "shows": "Jute being processed in Bangladesh",
                "local": "retail/images/catalog/jute-cultivation-and-processing-bangladesh-2.jpg"
              },
              "gallery": [],
              "specs": {
                "Made in": "Bangladesh",
                "Materials": "Jute and leather"
              },
              "highlights": [
                "Made to your size and colour",
                "Initials stitched on request"
              ]
            }
          ],
          "image": ""
        },
        {
          "id": "bangladeshi-heritage",
          "name": "Traditional Bangladeshi Accessories",
          "tagline": "Nakshi kantha, jamdani and the weaves of Tangail.",
          "items": [
            {
              "id": "nakshi-kantha",
              "maker": "Kantha artisans of Bangladesh",
              "title": "Nakshi kantha",
              "summary": "The embroidered quilt of Bengal: layers of soft cotton stitched by hand with flowers, birds and stories. A fine piece can take months to finish.",
              "price": 0,
              "priceNote": "",
              "availability": "Made to order",
              "leadTime": "Months",
              "photo": {
                "file": "Nakshi kantha (Flower motif).JPG",
                "author": "See the file page",
                "licence": "Public domain",
                "shows": "A nakshi kantha with a flower motif",
                "local": "retail/images/catalog/nakshi-kantha-flower-motif.jpg"
              },
              "gallery": [],
              "specs": {
                "Technique": "Running stitch by hand on layered cotton",
                "Regions": "Jamalpur, Jessore, Rajshahi and beyond",
                "Sizes": "Throws, bedcovers and wall pieces"
              },
              "highlights": [
                "Commissioned straight from the artisans",
                "Motifs and colours chosen with you"
              ]
            },
            {
              "id": "jamdani-sari",
              "maker": "Weavers of Rupganj, Narayanganj",
              "title": "Jamdani sari",
              "summary": "Woven by hand on the banks of the Shitalakshya, with patterns worked into the cloth as it is woven. UNESCO lists the art of jamdani weaving as intangible cultural heritage (2013).",
              "price": 0,
              "priceNote": "",
              "availability": "Made to order",
              "leadTime": "Weeks to months",
              "photo": {
                "file": "Weaving jamdani at BSCIC Jamdani palli, Narayanganj 107.jpg",
                "author": "Wasiul Bahar",
                "licence": "See the file page",
                "shows": "Weaving jamdani at the BSCIC Jamdani Palli, Narayanganj",
                "local": "retail/images/catalog/weaving-jamdani-at-bscic-jamdani-palli-narayanganj-107.jpg"
              },
              "gallery": [],
              "specs": {
                "Technique": "Handloom, supplementary weft",
                "Made in": "Rupganj, Narayanganj",
                "Fibre": "Fine cotton, or cotton and silk"
              },
              "highlights": [
                "Commissioned from master weavers",
                "Pattern and colours chosen with you"
              ]
            },
            {
              "id": "tangail-sari",
              "maker": "Weavers of Tangail",
              "title": "Tangail handloom sari",
              "summary": "The light, fine handloom sari of Tangail, woven by the Basak weaving families and known for its decorative borders.",
              "price": 0,
              "priceNote": "",
              "availability": "Made to order",
              "leadTime": "Weeks",
              "photo": {
                "file": "BD Tangail 4.JPG",
                "author": "P.K. Niyogi",
                "licence": "See the file page",
                "shows": "A weaver at work in Tangail",
                "local": "retail/images/catalog/bd-tangail-4.jpg"
              },
              "gallery": [],
              "specs": {
                "Technique": "Handloom",
                "Made in": "Tangail",
                "Fibre": "Cotton, or cotton and silk"
              },
              "highlights": [
                "Commissioned from weaving families",
                "Border and colours chosen with you"
              ]
            }
          ],
          "image": ""
        }
      ],
      "image": ""
    },
    {
      "id": "couture",
      "number": 4,
      "name": "Couture",
      "tagline": "Runway originals, handbags, shoes and capes.",
      "intro": "Archival haute couture from the great houses, the handbags with waiting lists, shoes made by hand, and capes and shawls for Dhaka's winter evenings and travel abroad.",
      "shops": [
        {
          "id": "haute-couture",
          "name": "Haute Couture",
          "tagline": "Runway originals and archival pieces.",
          "items": [
            {
              "id": "dior-new-look-archival",
              "maker": "Christian Dior",
              "title": "Archival Dior, New Look era",
              "summary": "Pieces from Christian Dior's own years, 1947 to 1957, starting with the 'New Look' and its Bar suit. They come up at auction from time to time.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "When a piece is offered",
              "photo": {
                "file": "Christian Dior (Moscow exhibition, 2011) 26.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "Dior's 1947 Bar suit at the 2011 Dior exhibition in Moscow",
                "local": "retail/images/catalog/christian-dior-moscow-exhibition-2011-26.jpg"
              },
              "gallery": [],
              "specs": {
                "House": "Christian Dior, Paris",
                "Era": "1947 to 1957"
              },
              "highlights": [
                "Archival pieces through auction houses and specialist sellers",
                "Condition and provenance checked",
                "Conservation and display advice"
              ]
            },
            {
              "id": "dior-evening-gown",
              "maker": "Christian Dior",
              "title": "Dior evening gown, 1950s",
              "summary": "A Dior ballgown of silk velvet and satin, of the kind now held by museums. Pieces like it reach the market through specialist sales.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "When a piece is offered",
              "photo": {
                "file": "Christian Dior Dress indianapolis.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "A Christian Dior ballgown at the Indianapolis Museum of Art",
                "local": "retail/images/catalog/christian-dior-dress-indianapolis.jpg"
              },
              "gallery": [],
              "specs": {
                "House": "Christian Dior, Paris",
                "Era": "1950s"
              },
              "highlights": [
                "Through specialist fashion sales",
                "Condition and provenance checked"
              ]
            },
            {
              "id": "jamdani-bridal-couture",
              "maker": "Weavers and ateliers of Dhaka",
              "title": "Jamdani bridal couture",
              "summary": "A bridal sari woven to order in jamdani, finished by a Dhaka atelier. Bangladesh's own couture, made for one wedding.",
              "price": 0,
              "priceNote": "",
              "availability": "Made to order",
              "leadTime": "Months",
              "photo": {
                "file": "Bangladeshi bride in Jamdani sari.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "A Bangladeshi bride in a jamdani sari",
                "local": "retail/images/catalog/bangladeshi-bride-in-jamdani-sari.jpg"
              },
              "gallery": [],
              "specs": {
                "Fabric": "Handwoven jamdani",
                "Made in": "Narayanganj and Dhaka"
              },
              "highlights": [
                "Designed with you",
                "Woven and finished to order"
              ]
            }
          ],
          "image": ""
        },
        {
          "id": "handbags",
          "name": "Handbags",
          "tagline": "The bags with waiting lists.",
          "items": [
            {
              "id": "hermes-birkin",
              "maker": "Hermès",
              "title": "Hermès Birkin",
              "summary": "Created in 1984 for Jane Birkin and made by hand by a single artisan. Exotic leathers such as ostrich are among the rarest.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Weeks to months",
              "photo": {
                "file": "Hermes Ostrich Birkin Bag.jpg",
                "author": "Wen-Cheng Liu",
                "licence": "CC BY-SA 2.0",
                "shows": "A Hermès Birkin in ostrich leather",
                "local": "retail/images/catalog/hermes-ostrich-birkin-bag.jpg"
              },
              "gallery": [],
              "specs": {
                "Introduced": "1984",
                "Sizes": "25, 30, 35 and 40 cm",
                "Leathers": "Calf, ostrich and exotic skins"
              },
              "highlights": [
                "New or pre-owned, authenticity checked",
                "CITES paperwork for exotic skins"
              ]
            },
            {
              "id": "hermes-kelly",
              "maker": "Hermès",
              "title": "Hermès Kelly",
              "summary": "The structured top-handle bag named after Grace Kelly, who was photographed with it in 1956.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Weeks to months",
              "photo": {
                "file": "Red Crocodile Kelly Bag.jpg",
                "author": "See the file page",
                "licence": "Creative Commons (see the file page)",
                "shows": "A Hermès Kelly in red crocodile",
                "local": "retail/images/catalog/red-crocodile-kelly-bag.jpg"
              },
              "gallery": [],
              "specs": {
                "Named after": "Grace Kelly",
                "Styles": "Sellier (stiff) or Retourne (soft)"
              },
              "highlights": [
                "New or pre-owned, authenticity checked",
                "CITES paperwork for exotic skins"
              ]
            },
            {
              "id": "chanel-2-55",
              "maker": "Chanel",
              "title": "Chanel 2.55",
              "summary": "Named after February 1955, when Coco Chanel introduced it: quilted leather and a shoulder chain.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Weeks",
              "photo": {
                "file": "Chanel 2.55.jpg",
                "author": "Liu Wen Cheng",
                "licence": "CC BY-SA 2.0",
                "shows": "A Chanel 2.55",
                "local": "retail/images/catalog/chanel-2-55.jpg"
              },
              "gallery": [],
              "specs": {
                "Introduced": "February 1955",
                "Closure": "Mademoiselle turn-lock (original style)"
              },
              "highlights": [
                "New or pre-owned, authenticity checked"
              ]
            }
          ],
          "image": ""
        },
        {
          "id": "footwear",
          "name": "Footwear",
          "tagline": "Red soles, handmade oxfords and wedding nagras.",
          "items": [
            {
              "id": "christian-louboutin-heels",
              "maker": "Christian Louboutin",
              "title": "Christian Louboutin heels",
              "summary": "The red lacquered sole Louboutin has used since 1993. The pair in the photo is on display at the Bata Shoe Museum in Toronto.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Weeks",
              "photo": {
                "file": "LagguageShoe by ChristianLouboutin.jpg",
                "author": "Sheila Thomson",
                "licence": "CC BY 2.0",
                "shows": "A Louboutin shoe at the Bata Shoe Museum, Toronto",
                "local": "retail/images/catalog/lagguageshoe-by-christianlouboutin.jpg"
              },
              "gallery": [],
              "specs": {
                "Signature": "Red lacquered sole",
                "Since": "1993"
              },
              "highlights": [
                "New pairs in your size",
                "Authenticity checked"
              ]
            },
            {
              "id": "goodyear-welted-oxfords",
              "maker": "English shoemakers",
              "title": "Goodyear-welted English oxfords",
              "summary": "Closed-lacing oxford shoes, Goodyear-welted so they can be resoled for decades. The pair shown is by Loake of Kettering, founded in 1880.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Weeks",
              "photo": {
                "file": "Loake Ledbury oxford shoes.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "Loake Ledbury oxford shoes",
                "local": "retail/images/catalog/loake-ledbury-oxford-shoes.jpg"
              },
              "gallery": [],
              "specs": {
                "Construction": "Goodyear welted",
                "Leather": "Calf, by model"
              },
              "highlights": [
                "Made-to-measure or ready-to-wear",
                "Resoling service arranged"
              ]
            },
            {
              "id": "embroidered-nagra-khussa",
              "maker": "Shoemakers of South Asia",
              "title": "Embroidered nagra (khussa)",
              "summary": "The embroidered leather slipper, often worn by grooms with a sherwani at Bangladeshi weddings. Made by hand with zari thread.",
              "price": 0,
              "priceNote": "",
              "availability": "Made to order",
              "leadTime": "Weeks",
              "photo": {
                "file": "KHUSSA.JPG",
                "author": "Saeed Akhtar Sial",
                "licence": "See the file page",
                "shows": "Khussa shoes at the Bahawalpur Museum",
                "local": "retail/images/catalog/khussa.jpg"
              },
              "gallery": [],
              "specs": {
                "Leather": "Soft leather",
                "Decoration": "Zari and thread embroidery"
              },
              "highlights": [
                "Made to match your sherwani",
                "Made by hand"
              ]
            }
          ],
          "image": ""
        },
        {
          "id": "furs-capes",
          "name": "Furs & Capes",
          "tagline": "Shawls, capes and vintage furs.",
          "items": [
            {
              "id": "embroidered-pashmina-shawl",
              "maker": "Shawl makers of Kashmir",
              "title": "Embroidered pashmina shawl",
              "summary": "Pashmina is the fine wool of the Changthangi goat, woven and embroidered by hand in Kashmir. Ideal for Dhaka's December evenings.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Weeks to months",
              "photo": {
                "file": "Embroidered-pashmina-shawl.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "An embroidered pashmina shawl",
                "local": "retail/images/catalog/embroidered-pashmina-shawl.jpg"
              },
              "gallery": [],
              "specs": {
                "Fibre": "Pashmina (cashmere)",
                "Work": "Hand embroidery"
              },
              "highlights": [
                "Purity checked",
                "Embroidery chosen with you"
              ]
            },
            {
              "id": "antique-kashmir-shawl",
              "maker": "Kashmir, 19th century",
              "title": "Antique Kashmir shawl",
              "summary": "19th-century Kashmir shawls, once prized across the world, are now collected as textile art. The one shown, from about 1840, has a central mandala.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "When one is offered",
              "photo": {
                "file": "Mandala Chandar, Kashmir 1840.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "A Kashmir moon shawl (chandar), about 1840",
                "local": "retail/images/catalog/mandala-chandar-kashmir-1840.jpg"
              },
              "gallery": [],
              "specs": {
                "Era": "19th century",
                "Fibre": "Pashmina wool, some with silk"
              },
              "highlights": [
                "Condition and age checked",
                "Conservation advice"
              ]
            },
            {
              "id": "vintage-mink-coat",
              "maker": "Furriers",
              "title": "Vintage mink coat",
              "summary": "A vintage mink coat with its paperwork, for winters abroad. We source pre-owned pieces only.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "When one is offered",
              "photo": {
                "file": "Sapphire mink fur coat 1980.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "A sapphire mink coat, about 1980",
                "local": "retail/images/catalog/sapphire-mink-fur-coat-1980.jpg"
              },
              "gallery": [],
              "specs": {
                "Era": "Vintage",
                "Fur": "Mink"
              },
              "highlights": [
                "Pre-owned pieces only",
                "Import and wildlife rules checked first"
              ]
            }
          ],
          "image": ""
        }
      ],
      "image": ""
    },
    {
      "id": "coinage",
      "number": 5,
      "name": "Coinage",
      "tagline": "Coins, banknotes and medals of Bengal and beyond.",
      "intro": "Silver tankas of the Bengal Sultanate, Mughal gold, the first notes of the Bank of Bengal and the coins of a young Bangladesh. Every piece is checked and graded.",
      "shops": [
        {
          "id": "coins",
          "name": "Coins",
          "tagline": "From the Sultans of Bengal to the poisha.",
          "items": [
            {
              "id": "bengal-sultanate-tanka",
              "maker": "Bengal Sultanate",
              "title": "Silver tanka of Alauddin Husain Shah",
              "summary": "A silver tanka of Alauddin Husain Shah, one of the great Sultans of Bengal, who ruled from about 1494 to 1519. This one was struck at the Husainabad mint.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "When one is offered",
              "photo": {
                "file": "Silver Tanka of Bengal Sultan Alauddin Husain Shah, struck in Khazana mint of Husainabad.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "A silver tanka of Alauddin Husain Shah, Husainabad mint",
                "local": "retail/images/catalog/silver-tanka-of-bengal-sultan-alauddin-husain-shah-struck-in-khazana-mint-of-hus.jpg"
              },
              "gallery": [],
              "specs": {
                "Ruler": "Alauddin Husain Shah",
                "Metal": "Silver",
                "Period": "Late 15th to early 16th century"
              },
              "highlights": [
                "Authenticity and grade checked",
                "Export rules for antiquities checked"
              ]
            },
            {
              "id": "mughal-gold-mohur",
              "maker": "Mughal Empire",
              "title": "Mughal gold mohur",
              "summary": "Gold mohurs of the Mughal emperors, including issues from Jahangirnagar, as Dhaka was then called. The coin shown is a very rare Shah Jahan mohur from Balkh, 1647.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "When one is offered",
              "photo": {
                "file": "Gold mohur of Mughal ruler Shah Jahan, struck at the Balkh mint.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "A gold mohur of Shah Jahan, Balkh mint",
                "local": "retail/images/catalog/gold-mohur-of-mughal-ruler-shah-jahan-struck-at-the-balkh-mint.jpg"
              },
              "gallery": [],
              "specs": {
                "Metal": "Gold",
                "Period": "16th to 19th century",
                "Mints": "Including Jahangirnagar (Dhaka)"
              },
              "highlights": [
                "Authenticity and grade checked",
                "Export rules for antiquities checked"
              ]
            },
            {
              "id": "early-bangladesh-poisha",
              "maker": "Bangladesh",
              "title": "Early coins of Bangladesh",
              "summary": "The poisha coins of the young republic, first issued in 1973. Sets in fine condition are sought by collectors.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Weeks",
              "photo": {
                "file": "50 and 25 paise coins from Bangladesh.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "50 and 25 poisha coins of Bangladesh (1984 and 1980)",
                "local": "retail/images/catalog/50-and-25-paise-coins-from-bangladesh.jpg"
              },
              "gallery": [],
              "specs": {
                "Issuer": "Bangladesh",
                "From": "1973",
                "Denominations": "Poisha and taka"
              },
              "highlights": [
                "Graded sets assembled for you"
              ]
            }
          ],
          "image": ""
        },
        {
          "id": "banknotes",
          "name": "Banknotes",
          "tagline": "The paper money of Bengal and Bangladesh.",
          "items": [
            {
              "id": "bank-of-bengal-10-rupees",
              "maker": "Bank of Bengal",
              "title": "Bank of Bengal 10 rupees, 1857",
              "summary": "A note of the Bank of Bengal, founded in Calcutta in 1806 as the Bank of Calcutta, and one of the forerunners of today's State Bank of India.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "When one is offered",
              "photo": {
                "file": "Bank of Bengal, 10 rupees, 1857.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "A Bank of Bengal 10-rupee note of 1857",
                "local": "retail/images/catalog/bank-of-bengal-10-rupees-1857.jpg"
              },
              "gallery": [],
              "specs": {
                "Issuer": "Bank of Bengal",
                "Year": "1857",
                "Denomination": "10 rupees"
              },
              "highlights": [
                "Authenticity and grade checked"
              ]
            },
            {
              "id": "british-india-10-rupees",
              "maker": "Government of India",
              "title": "British India 10 rupees",
              "summary": "The banknotes that were used across Bengal before Partition, issued by the Government of India and later the Reserve Bank of India.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "When one is offered",
              "photo": {
                "file": "British Indian ten-rupee note.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "A British Indian 10-rupee note of 1920",
                "local": "retail/images/catalog/british-indian-ten-rupee-note.jpg"
              },
              "gallery": [],
              "specs": {
                "Issuer": "Government of India",
                "Era": "Early 20th century"
              },
              "highlights": [
                "Authenticity and grade checked"
              ]
            },
            {
              "id": "taka-notes",
              "maker": "Bangladesh Bank",
              "title": "Taka banknotes",
              "summary": "The taka came into use on 4 March 1972. Early notes, specimen notes and low serial numbers are sought by collectors.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Weeks",
              "photo": {
                "file": "Taka Banknotes specimen.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "Taka specimen banknotes",
                "local": "retail/images/catalog/taka-banknotes-specimen.jpg"
              },
              "gallery": [],
              "specs": {
                "Currency since": "4 March 1972",
                "Issuer": "Bangladesh Bank"
              },
              "highlights": [
                "Graded notes assembled for you"
              ]
            }
          ],
          "image": ""
        },
        {
          "id": "medals",
          "name": "Medals",
          "tagline": "Medals and decorations of British India.",
          "items": [
            {
              "id": "kaisar-i-hind-medal",
              "maker": "British India",
              "title": "Kaisar-i-Hind Medal",
              "summary": "A medal for public service in India, first awarded in 1900. Its recipients include figures from Bengal.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "When one is offered",
              "photo": {
                "file": "Kaisar-i-Hind Medal - Female Version.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "A Kaisar-i-Hind Medal",
                "local": "retail/images/catalog/kaisar-i-hind-medal-female-version.jpg"
              },
              "gallery": [],
              "specs": {
                "Established": "1900",
                "Awarded for": "Public service in India"
              },
              "highlights": [
                "Authenticity checked",
                "Research into the recipient where named"
              ]
            },
            {
              "id": "india-general-service-medal-1854",
              "maker": "British India",
              "title": "India General Service Medal, 1854",
              "summary": "A campaign medal awarded for more than forty years. It has clasps for campaigns on Bengal's eastern frontier, such as Lushai 1871-72.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "When one is offered",
              "photo": {
                "file": "India General Service Medal 1854 obv.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "The obverse of the India General Service Medal, 1854",
                "local": "retail/images/catalog/india-general-service-medal-1854-obv.jpg"
              },
              "gallery": [],
              "specs": {
                "Instituted": "1854",
                "Clasps": "More than twenty campaigns"
              },
              "highlights": [
                "Authenticity and clasps checked",
                "Research into the recipient where named"
              ]
            },
            {
              "id": "indian-meritorious-service-medal",
              "maker": "British India",
              "title": "Indian Meritorious Service Medal",
              "summary": "A medal for long and meritorious service by soldiers of the Indian Army.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "When one is offered",
              "photo": {
                "file": "Indian Meritorious Service Medal.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "An Indian Meritorious Service Medal",
                "local": "retail/images/catalog/indian-meritorious-service-medal.jpg"
              },
              "gallery": [],
              "specs": {
                "Awarded for": "Meritorious service"
              },
              "highlights": [
                "Authenticity checked",
                "Research into the recipient where named"
              ]
            }
          ],
          "image": ""
        }
      ],
      "image": ""
    },
    {
      "id": "musicals",
      "number": 6,
      "name": "Musicals",
      "tagline": "Pianos, violins, artists' instruments and recorded history.",
      "intro": "Concert grands for a Gulshan drawing room, the violins of Cremona, the sarod and dotara of Bengal, and the recordings that hold the country's musical memory.",
      "shops": [
        {
          "id": "pianos",
          "name": "Piano",
          "tagline": "Concert grands from Hamburg, Hamamatsu and Vienna.",
          "items": [
            {
              "id": "steinway-model-d",
              "maker": "Steinway & Sons",
              "title": "Steinway Model D",
              "summary": "The concert grand that stands on most of the world's great stages. Built in New York and Hamburg.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Months",
              "photo": {
                "file": "Steinway concert grand piano D-274.jpg",
                "author": "Ma_Ti_EU (Flickr)",
                "licence": "CC BY 2.0",
                "shows": "A Steinway D-274 concert grand",
                "local": "retail/images/catalog/steinway-concert-grand-piano-d-274.jpg"
              },
              "gallery": [],
              "specs": {
                "Length": "274 cm",
                "Built in": "New York and Hamburg"
              },
              "highlights": [
                "New or rebuilt instruments",
                "Climate advice for Dhaka's humidity",
                "Delivery, tuning and regulation arranged"
              ]
            },
            {
              "id": "yamaha-c7",
              "maker": "Yamaha",
              "title": "Yamaha C7 grand",
              "summary": "A 227 cm grand from Yamaha's conservatory series, found in recording studios around the world.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Weeks to months",
              "photo": {
                "file": "Yamaha C7 Concert Grand Piano at Audio Mix House, Studio A (crop).jpg",
                "author": "Audio Mix House",
                "licence": "See the file page",
                "shows": "A Yamaha C7 in a recording studio",
                "local": "retail/images/catalog/yamaha-c7-concert-grand-piano-at-audio-mix-house-studio-a-crop.jpg"
              },
              "gallery": [],
              "specs": {
                "Length": "227 cm",
                "Maker": "Yamaha, Hamamatsu, Japan"
              },
              "highlights": [
                "New or pre-owned",
                "Delivery, tuning and regulation arranged"
              ]
            },
            {
              "id": "bosendorfer-imperial",
              "maker": "Bösendorfer",
              "title": "Bösendorfer Model 290 Imperial",
              "summary": "Vienna's legendary concert grand with 97 keys: nine extra keys in the bass extend the sound downward.",
              "price": 0,
              "priceNote": "",
              "availability": "Made to order",
              "leadTime": "Months",
              "photo": {
                "file": "Bösendorfer Model 290 Imperial at Saga Arashiyama.jpg",
                "author": "Hahifuheho",
                "licence": "See the file page",
                "shows": "A Bösendorfer Imperial at Saga Arashiyama, Kyoto",
                "local": "retail/images/catalog/bosendorfer-model-290-imperial-at-saga-arashiyama.jpg"
              },
              "gallery": [],
              "specs": {
                "Length": "290 cm",
                "Keys": "97",
                "Maker": "Bösendorfer, Vienna"
              },
              "highlights": [
                "New or pre-owned",
                "Delivery, tuning and regulation arranged"
              ]
            }
          ],
          "image": ""
        },
        {
          "id": "violins",
          "name": "Violin",
          "tagline": "Cremona's masters, and the bowed strings of Bengal.",
          "items": [
            {
              "id": "stradivari-violin",
              "maker": "Antonio Stradivari (1644-1737)",
              "title": "A violin by Antonio Stradivari",
              "summary": "Around 650 of Stradivari's instruments survive. They change hands rarely, and only with careful certificates.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "When one is offered",
              "photo": {
                "file": "Stradivarius violin, Palacio Real, Madrid.jpg",
                "author": "See the file page",
                "licence": "Public domain",
                "shows": "The 'Spanish II' Stradivari at the Palacio Real, Madrid",
                "local": "retail/images/catalog/stradivarius-violin-palacio-real-madrid.jpg"
              },
              "gallery": [],
              "specs": {
                "Maker": "Antonio Stradivari, Cremona",
                "Surviving instruments": "About 650"
              },
              "highlights": [
                "Only when one is offered",
                "Certificates from recognised experts",
                "Insurance and climate-controlled transport"
              ]
            },
            {
              "id": "guarneri-del-gesu-violin",
              "maker": "Giuseppe Guarneri 'del Gesù' (1698-1744)",
              "title": "A violin by Guarneri del Gesù",
              "summary": "The other great Cremonese maker, whose 'Il Cannone' was Paganini's own violin.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "When one is offered",
              "photo": {
                "file": "Violin stauffer Guarneri del Gesu.jpg",
                "author": "Dave74",
                "licence": "CC BY-SA 4.0",
                "shows": "The 1734 'Stauffer' Guarneri del Gesù",
                "local": "retail/images/catalog/violin-stauffer-guarneri-del-gesu.jpg"
              },
              "gallery": [],
              "specs": {
                "Maker": "Giuseppe Guarneri 'del Gesù', Cremona"
              },
              "highlights": [
                "Only when one is offered",
                "Certificates from recognised experts",
                "Insurance and climate-controlled transport"
              ]
            },
            {
              "id": "esraj",
              "maker": "Instrument makers of Bengal",
              "title": "Esraj",
              "summary": "A bowed, fretted instrument with sympathetic strings, central to the music of Rabindranath Tagore and to Santiniketan.",
              "price": 0,
              "priceNote": "",
              "availability": "Made to order",
              "leadTime": "Weeks",
              "photo": {
                "file": "Esraj musical instrument.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "An esraj at an exhibition in Chennai",
                "local": "retail/images/catalog/esraj-musical-instrument.jpg"
              },
              "gallery": [],
              "specs": {
                "Type": "Bowed, fretted, with sympathetic strings"
              },
              "highlights": [
                "Made by hand by master makers",
                "Set up for you"
              ]
            }
          ],
          "image": ""
        },
        {
          "id": "artist-instruments",
          "name": "Artist-Owned Instruments",
          "tagline": "Instruments with a story, from the artists of Bengal.",
          "items": [
            {
              "id": "sarod",
              "maker": "Sarod makers of Bengal",
              "title": "Sarod",
              "summary": "The fretless lute of Hindustani music. Its greatest players, Ustad Alauddin Khan and Ustad Ali Akbar Khan, came from Shibpur in today's Brahmanbaria.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "When one is offered",
              "photo": {
                "file": "Sarod 001.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "A sarod",
                "local": "retail/images/catalog/sarod-001.jpg"
              },
              "gallery": [],
              "specs": {
                "Type": "Fretless plucked lute",
                "Fingerboard": "Metal"
              },
              "highlights": [
                "Instruments with documented provenance when available",
                "Provenance checked with the artist's family or estate"
              ]
            },
            {
              "id": "dotara",
              "maker": "Folk instrument makers of Bangladesh",
              "title": "Dotara",
              "summary": "The long-necked lute of Baul and folk music, heard at the Lalon gatherings in Kushtia.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "When one is offered",
              "photo": {
                "file": "Bangladesh dotara.JPG",
                "author": "Danielle G.",
                "licence": "See the file page",
                "shows": "A Bangladeshi folk singer with his dotara, Dhaka",
                "local": "retail/images/catalog/bangladesh-dotara.jpg"
              },
              "gallery": [],
              "specs": {
                "Type": "Plucked folk lute",
                "Strings": "Usually four"
              },
              "highlights": [
                "Instruments played by known artists, when available",
                "Provenance checked"
              ]
            },
            {
              "id": "harmonium",
              "maker": "Harmonium makers of Kolkata and Dhaka",
              "title": "Harmonium",
              "summary": "The hand-pumped reed organ at the heart of Nazrul Sangeet, Rabindra Sangeet and qawwali.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "When one is offered",
              "photo": {
                "file": "Harmonium A instrument of India.jpg",
                "author": "Ishaan Gupta",
                "licence": "CC BY-SA 4.0",
                "shows": "An Indian harmonium",
                "local": "retail/images/catalog/harmonium-a-instrument-of-india.jpg"
              },
              "gallery": [],
              "specs": {
                "Type": "Hand-pumped reed organ"
              },
              "highlights": [
                "Instruments played by known artists, when available",
                "Provenance checked",
                "Reeds and bellows serviced"
              ]
            }
          ],
          "image": ""
        },
        {
          "id": "recorded-history",
          "name": "Recorded History",
          "tagline": "Master tapes, first pressings and early records.",
          "items": [
            {
              "id": "studio-master-tapes",
              "maker": "Recording studios",
              "title": "Studio master tapes",
              "summary": "Original master and safety tapes from historic sessions, with the machines to play them. Rights are checked first: owning a tape does not include its copyright.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "When one is offered",
              "photo": {
                "file": "Studer B67 reel-to-reel audio tape recorder, ca. 1978 (cropped and edited).jpg",
                "author": "Robert Taylor (edited)",
                "licence": "See the file page",
                "shows": "A Studer B67 studio tape recorder, about 1978",
                "local": "retail/images/catalog/studer-b67-reel-to-reel-audio-tape-recorder-ca-1978-cropped-and-edited.jpg"
              },
              "gallery": [],
              "specs": {
                "Formats": "Quarter-inch and multitrack tape",
                "Machines": "Studer and others, serviced"
              },
              "highlights": [
                "Provenance and rights checked",
                "Transfer to digital by specialists"
              ]
            },
            {
              "id": "concert-for-bangladesh-first-pressing",
              "maker": "Apple Records, 1971",
              "title": "The Concert for Bangladesh, first pressing",
              "summary": "George Harrison and Ravi Shankar's benefit concerts at Madison Square Garden on 1 August 1971. The triple album won the Grammy for Album of the Year.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "Weeks",
              "photo": {
                "file": "George Harrison Sculpture at Shadhinotar Shangram Triangle.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "A sculpture of George Harrison at Shadhinotar Shangram Triangle, Dhaka",
                "local": "retail/images/catalog/george-harrison-sculpture-at-shadhinotar-shangram-triangle.jpg"
              },
              "gallery": [],
              "specs": {
                "Recorded": "1 August 1971, New York",
                "Format": "Triple LP box set",
                "Label": "Apple Records"
              },
              "highlights": [
                "First pressings in collector condition",
                "Grading of vinyl and box"
              ]
            },
            {
              "id": "early-bengali-78s",
              "maker": "The Gramophone Company (HMV)",
              "title": "Early Bengali 78 rpm records",
              "summary": "The Gramophone Company recorded in Calcutta from 1902, and Kazi Nazrul Islam later worked with it. Shellac 78s of Bengali songs are rare survivors.",
              "price": 0,
              "priceNote": "",
              "availability": "On request",
              "leadTime": "When one is offered",
              "photo": {
                "file": "Portable 78 rpm record player.jpg",
                "author": "See the file page",
                "licence": "See the file page",
                "shows": "A portable 78 rpm record player",
                "local": "retail/images/catalog/portable-78-rpm-record-player.jpg"
              },
              "gallery": [],
              "specs": {
                "Format": "Shellac, 78 rpm",
                "Era": "From 1902"
              },
              "highlights": [
                "Condition graded",
                "Gramophones restored on request"
              ]
            }
          ],
          "image": ""
        }
      ],
      "image": ""
    }
  ]
};
