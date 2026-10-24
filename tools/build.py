import html, os, re, json
import os as _os
OUT = _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))   # the site folder (this file lives in tools/)
E = html.escape
def U(s): return html.unescape(s)

HEAD = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title} · Walvis Concierge</title>
  <meta name="description" content="{desc}">
  <meta property="og:title" content="{title} · Walvis Concierge">
  <meta property="og:image" content="images/share/walvis-share.jpg">
  <link rel="icon" href="images/logo/walvis-icon-32.png">
  <link rel="apple-touch-icon" href="images/logo/walvis-icon-180.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
  <script>document.documentElement.classList.add(\'veiled\')</script>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div id="site-header"></div>
  <main id="main">
"""
FOOT = """
  </main>
  <div id="site-footer"></div>
  <script src="js/site.js"></script>
</body>
</html>
"""
ARROW = '<svg class="i"><use href="#i-arrow"/></svg>'
CHAT = '<svg class="i"><use href="#i-chat"/></svg>'
GHOST = '<svg class="ghost-whale" viewBox="0 0 200 600" aria-hidden="true"><path d="M100,14 C116,14 128,40 132,82 C136,124 137,170 137,214 C136,300 126,404 108,500 C110,520 130,530 170,546 C178,550 177,560 168,562 C140,566 112,571 100,558 C88,571 60,566 32,562 C23,560 22,550 30,546 C70,530 90,520 92,500 C74,404 64,300 63,214 C63,170 64,124 68,82 C72,40 84,14 100,14 Z M137,190 C160,215 185,265 199,320 C200,330 195,335 189,329 C170,290 150,250 136,226 Z M63,190 C40,215 15,265 1,320 C0,330 5,335 11,329 C30,290 50,250 64,226 Z"/></svg>'
def d(i): return f" d{i%3}" if i % 3 else ""

CAPTIONS = {
  "Personal Lifestyle": "Your time, given back.",
  "Experiences": "A table set for one night only.",
  "Travel": "Somewhere above the clouds, everything already arranged.",
  "Retail": "Found, checked, and quietly delivered.",
  "Assets": "Home, kept exactly as you left it.",
  "Discover Bangladesh": "Old Dhaka, shown by people who live here.",
  "Probashi Concierge": "The city at night, waiting for you to come home.",
  "The Journal": "Every story starts with a blank page.",
  "Special Requests": "The stranger the request, the better.",
  "Membership": "A small circle, by design.",
  "What we offer": "Seas, mountains and everything between.",
  "About us": "Calm water, and a steady course.",
  "Contact": "One message away.",
  "Privacy": "Discretion is part of what we do.",
}
def hero(img, crumb, kicker, h1, lead, wa, cta="Enquire on WhatsApp", second=("membership.html", "View membership"), pos="center"):
    sec = f'<a class="btn btn-line" href="{second[0]}">{second[1]} {ARROW}</a>' if second else ""
    cap = CAPTIONS.get(crumb, "")
    return f"""
  <section class="page-hero deep on-dark" data-notes>
    <div class="ocean" aria-hidden="true"><div class="surface"></div><div class="rays"></div><canvas class="sea" data-mode="lite"></canvas><div class="depth"></div></div>
    <div class="wrap ph-grid">
      <div class="ph-copy">
        <div class="crumbs reveal"><a href="index.html">Home</a> &nbsp;/&nbsp; {crumb}</div>
        <span class="kicker reveal">{kicker}</span>
        <h1 class="reveal d1">{h1}</h1>
        <p class="lead reveal d2">{lead}</p>
        <div class="btn-row reveal d3"><a class="btn btn-teal" data-wa="{E(U(wa))}" href="#">{CHAT} {cta}</a>{sec}</div>
      </div>
      <figure class="arch reveal"><img src="images/{img}" alt="" style="object-position:{pos}"><span class="tint"></span><span class="ring"></span>{f'<figcaption>{cap}</figcaption>' if cap else ''}</figure>
    </div>
  </section>
"""

def intro(img, kicker, h2, paras, checks=None, flip=False, tone="light", alt=""):
    ps = "".join(f"<p>{p}</p>" for p in paras)
    ch = ('<ul class="checks reveal d3">' + "".join(f"<li>{c}</li>" for c in checks) + "</ul>") if checks else ""
    return f"""
  <section class="section {tone}">
    <div class="wrap split{' flip' if flip else ''}">
      <div class="media reveal"><div class="mask"><img src="images/{img}" alt="{E(alt)}" loading="lazy"></div><span class="frame"></span></div>
      <div class="copy">
        <span class="kicker reveal">{kicker}</span>
        <h2 class="t-1 reveal d1">{h2}</h2>
        <div class="lead reveal d2">{ps}</div>
        {ch}
      </div>
    </div>
  </section>
"""

def worlds(kicker, h2, lead, items, tone="mist", id=""):
    cards = "".join(f"""<article class="world reveal{d(i)}"><div class="ph"><img src="images/{img}" alt="{E(U(t))}" loading="lazy"></div><span class="k">{k}</span><h3>{t}</h3><p>{x}</p><a class="link" data-wa="{E('Hello Walvis, I would like to ask about: ' + U(t))}" href="#">Ask about this {ARROW}</a></article>""" for i, (img, k, t, x) in enumerate(items))
    idattr = f' id="{id}" style="scroll-margin-top:70px"' if id else ""
    return f"""
  <section class="section {tone}"{idattr}>
    <div class="wrap">
      <div class="head reveal"><span class="kicker">{kicker}</span><h2 class="t-1">{h2}</h2>{f'<p class="lead">{lead}</p>' if lead else ''}</div>
      <div class="worlds">{cards}</div>
    </div>
  </section>
"""

def svc(kicker, h2, lead, items, tone="light"):
    cells = "".join(f'<div class="reveal{d(i)}"><span class="n">{i+1:02d}</span><h3>{t}</h3><p>{x}</p></div>' for i, (t, x) in enumerate(items))
    return f"""
  <section class="section {tone}">
    <div class="wrap">
      <div class="head reveal"><span class="kicker">{kicker}</span><h2 class="t-1">{h2}</h2>{f'<p class="lead">{lead}</p>' if lead else ''}</div>
      <div class="svc">{cells}</div>
    </div>
  </section>
"""

def steps(kicker, h2, items, tone="light"):
    li = "".join(f'<li class="reveal{d(i)}"><h3>{t}</h3><p>{x}</p></li>' for i, (t, x) in enumerate(items))
    return f"""
  <section class="section {tone}">
    <div class="wrap">
      <div class="head reveal"><span class="kicker">{kicker}</span><h2 class="t-1">{h2}</h2></div>
      <ol class="steps">{li}</ol>
    </div>
  </section>
"""

def principles(kicker, h2, items, tone="mist", lead=""):
    cells = "".join(f'<div class="reveal{d(i)}"><h3>{t}</h3><p>{x}</p></div>' for i, (t, x) in enumerate(items))
    return f"""
  <section class="section {tone}">
    <div class="wrap">
      <div class="head reveal"><span class="kicker">{kicker}</span><h2 class="t-1">{h2}</h2>{f'<p class="lead">{lead}</p>' if lead else ''}</div>
      <div class="principles">{cells}</div>
    </div>
  </section>
"""

def band(img, kicker, h2, lead, link=None):
    l = f'<div class="btn-row reveal d3"><a class="btn btn-line" href="{link[0]}">{link[1]} {ARROW}</a></div>' if link else ""
    return f"""
  <section class="band">
    <img src="images/{img}" alt="" loading="lazy">
    <div class="wrap"><div class="copy on-dark">
      <span class="kicker reveal">{kicker}</span><h2 class="t-1 reveal d1">{h2}</h2><p class="lead reveal d2">{lead}</p>{l}
    </div></div>
  </section>
"""

def closing(kicker, h2, lead, wa, small=""):
    sm = f'<p class="small-print reveal">{small}</p>' if small else ""
    return f"""
  <section class="section closing dark">
    <div class="ocean faint" aria-hidden="true"><canvas class="sea" data-mode="faint"></canvas></div>
    <div class="wrap">
      <div class="meander short reveal"></div>
      <img class="seal reveal" src="images/logo/walvis-seal-180.png" alt="" width="92" height="92">
      <span class="kicker reveal">{kicker}</span>
      <h2 class="t-1 reveal d1">{h2}</h2>
      <p class="lead reveal d2">{lead}</p>
      <div class="btn-row reveal d3" style="justify-content:center">
        <a class="btn btn-teal" data-wa="{E(U(wa))}" href="#">{CHAT} Enquire on WhatsApp</a>
        <a class="btn btn-line" href="contact.html" style="color:#fffafa;border-color:rgba(255,250,250,.45)">Other ways to reach us</a>
      </div>
      {sm}
    </div>
  </section>
"""

def write(fn, title, desc, body):
    open(os.path.join(OUT, fn), "w").write(HEAD.format(title=title, desc=E(desc)) + body + FOOT)

# =================================================================== PERSONAL LIFESTYLE
# Content from the Personal Life page (walvisconcierge.com/personal-life.html), told around the real problem: no time.
PL_MOMENTS = [
  ("11:40 pm", "Your sister&rsquo;s birthday is tomorrow.", "The bakery she loves closed at ten."),
  ("Tuesday, Singapore", "Your anniversary is on Friday.", "Your flight home lands on Saturday."),
  ("Nine days to Eid", "Forty families on the list.", "Forty hampers, forty addresses, one week."),
  ("4:15 pm, in a meeting", "Abbu&rsquo;s medicine runs out today.", "The pharmacy closes before you get out."),
]
moments = "".join(f"""
        <article class="pl-moment reveal{d(i)}"><time>{t}</time><h3>{a}</h3><p>{b}</p></article>""" for i, (t, a, b) in enumerate(PL_MOMENTS))

PL_CHAT = [
  ("me", "Ammu&rsquo;s birthday is on Sunday and I&rsquo;m travelling until Monday.", "22:51"),
  ("them", "Leave it with us. Her favourite white roses and a small chocolate cake from the bakery she likes in Dhanmondi? We can add a card in your words.", "22:54"),
  ("me", "Perfect. Card: &ldquo;Happy birthday, Ammu. See you Monday. Love always.&rdquo;", "22:56"),
  ("them", "Done. Delivery on Sunday at 10 am, and we&rsquo;ll send you a photo when it arrives.", "22:57"),
  ("them", "Delivered. She has already called to say thank you.", "Sun 10:12"),
]
chat = "".join(f'<div class="msg {w}">{m}<time>{t}</time></div>' for w, m, t in PL_CHAT)

PL_HANDLE = [
  ("Gifts &amp; flowers", ["Gifts chosen for the person, wrapped and delivered", "Same-day flowers in Dhaka, with your card", "Cakes, mishti and hampers from the right places", "Eid, Puja and wedding gift lists, one home or fifty"]),
  ("Dates &amp; occasions", ["Birthdays and anniversaries, remembered for you", "A quiet reminder a week ahead, or simply done", "New babies, graduations and family gatherings", "Pohela Boishakh, Eid and Puja, planned early"]),
  ("Reservations &amp; plans", ["Tables at the places that are hard to book", "Tickets and seats for concerts, matches and shows", "Salon, spa and wellness appointments", "Doctor and clinic appointments for the family"]),
  ("Errands &amp; home", ["Pick-ups, drop-offs and deliveries", "Repairs and trusted people for the home", "Bills, renewals and paperwork kept on time", "Personal shopping, sent to try at home"]),
]
handle = "".join(f"""
        <div class="pl-col reveal{d(i)}"><h3>{h}</h3><ul class="checks">{''.join(f'<li>{x}</li>' for x in xs)}</ul></div>""" for i, (h, xs) in enumerate(PL_HANDLE))

write("lifestyle.html", "Personal Lifestyle", "Personal lifestyle management by Walvis Concierge: gifts, flowers, cakes, remembered dates, reservations and errands, handled in your name.",
  hero("lux-cufflinks.jpg", "Personal Lifestyle", "Personal Lifestyle", "Never miss <em>the moment.</em>",
    "Meetings run late, flights leave early, and the people you love still have birthdays. Hand us the small things that matter. We take care of them in your name, on the right day.",
    "Hello Walvis, I would like help with something personal.", cta="Send something")
  + f"""
  <section class="section dark on-dark">
    <div class="wrap">
      <div class="head reveal"><span class="kicker">Sound familiar?</span><h2 class="t-1">You don&rsquo;t run out of love. <em>You run out of hours.</em></h2>
      <p class="lead">Life is busy, and the people you love still have birthdays. These are the moments that slip, not because you forgot to care, but because there was no time left in the day.</p></div>
      <div class="pl-moments">{moments}
      </div>
      <p class="pl-answer reveal">One message to us, and every one of them is <em>handled.</em></p>
    </div>
  </section>
"""
  + intro("handwritten-note.jpg", "Your social life", "Thoughtful, without <em>the running around.</em>",
    ["We make sure the right thing arrives at the right door on the right day.",
     "It goes out in your name, with your words on the card. The thank-you messages come to you."],
    ["Gifts chosen for the person, not the occasion", "Cakes and flowers, delivered on time", "Important dates remembered for you", "Reservations and invitations handled"], tone="light", alt="A fountain pen resting on a handwritten note")
  + band("lux-pocket-watch.jpg", "Remembered dates", "Give us the calendar once. <em>We will remember the rest.</em>",
    "Birthdays, anniversaries, Eid, Puja, graduations, new babies. Tell us the date and the person, and decide each time whether you want a reminder or simply want it done.")
  + worlds("In your name", "The small things, <em>done beautifully.</em>", "Tell us who it is for and what the card should say. We take care of the rest, on the day.", [
    ("roses.jpg", "Sent today", "Flowers", "Hand-tied, delivered in water, with your words on the card."),
    ("pl-birthday-cake.jpg", "Sweet things", "Cakes and mishti", "From the bakeries and sweet shops that do it best, on the right day."),
    ("retail-gift-box.jpg", "Chosen for them", "Gifts", "For the person, not the occasion. Wrapped and delivered by hand."),
    ("proposal-ring.jpg", "Never missed", "Remembered dates", "Give us the calendar once. A reminder, or simply done."),
  ], tone="mist", id="in-your-name")
  + f"""
  <section class="section light">
    <div class="wrap split">
      <div class="media reveal">
        <div class="phone">
          <div class="screen">
            <div class="chat-top"><img src="images/logo/walvis-seal-96.png" alt=""><div><b>Walvis Concierge</b><small>online</small></div></div>
            <div class="chat-body">{chat}</div>
          </div>
        </div>
        <p class="note-small">A sample conversation, for illustration</p>
      </div>
      <div class="copy">
        <span class="kicker reveal">How it feels</span>
        <h2 class="t-1 reveal d1">One message. <em>Then it&rsquo;s done.</em></h2>
        <p class="lead reveal d2">Wherever you are and however late it is, write to us the way you would to a friend. A real person replies, suggests the right thing and takes care of it, then lets you know when it&rsquo;s there.</p>
        <div class="btn-row reveal d3"><a class="btn btn-teal" data-wa="{E('Hello Walvis, I would like help with something personal.')}" href="#">{CHAT} Message us on WhatsApp</a></div>
      </div>
    </div>
  </section>

  <section class="section mist">
    <div class="wrap">
      <div class="head reveal"><span class="kicker">Lifestyle management</span><h2 class="t-1">Everything we <em>take off your plate.</em></h2>
      <p class="lead">The small things that mean a lot, and the everyday ones that quietly eat an afternoon.</p></div>
      <div class="pl-handle">{handle}
      </div>
    </div>
  </section>
"""
  + closing("Personal Lifestyle", "Someone&rsquo;s day <em>coming up?</em>", "Tell us who it is for and when. We will send you a few ideas.", "Hello Walvis, someone's special day is coming up and I would like some ideas."))

# EXPERIENCES: experiences.html is hand-made (css/experiences.css, js/experiences.js); not generated here

# TRAVEL: travel.html, journey.html, css/travel.css and js/travel.js come from gen_travel.py (redesign); not generated here

# =================================================================== RETAIL
types = [
  ("lux-cufflinks.jpg", "Jewellery", "Bridal sets, fine pieces and the gift that is kept for a lifetime, from jewellers we trust."),
  ("lux-pocket-watch.jpg", "Timepieces", "Sought-after watches, sourced from trusted dealers and checked before they reach you."),
  ("bd-holud-stage.jpg", "Heritage crafts", "Master-woven jamdani, Rajshahi silk and the crafts of Bangladesh, commissioned for you."),
  ("lux-candlelight.jpg", "Fragrance", "Rare oud and attar from Dubai and beyond, delivered to Dhaka."),
  ("lux-palace-salon.jpg", "Home &amp; art", "Rugs, art and objects for the home, found, framed and installed."),
  ("retail-gift-box.jpg", "Gifting", "Gifts that feel personal, wrapped and delivered with your note."),
]
write("retail.html", "Retail · The Collection", "The Collection by Walvis Concierge: jewellery, timepieces, heritage crafts, fragrance, home and art, sourced for you.",
  hero("lux-cufflinks.jpg", "Retail", "Retail · The Collection", "Rare pieces, <em>found for you.</em>",
    "Jewellery, timepieces, jamdani and oud. Sourced, checked and delivered quietly to your door, from Dhaka to Dubai, London and beyond.",
    "Hello Walvis, I am looking for something specific.", cta="Tell us what you want")
  + worlds("The Collection", "A few things <em>members ask for.</em>", "No checkout and no rush. Tap “Ask about this” and we come back with options, availability and price.",
    [(img, "The Collection", t, x) for img, t, x in types], tone="light")
  + band("lux-glass-dome.jpg", "Something specific?", "Send a photo, a link <em>or a feeling.</em>", "If it exists, we will find it. If it does not, we will tell you plainly and offer the next best thing.")
  + svc("How we shop", "Shopping, <em>without the shopping.</em>", "", [
    ("Sourced through people we trust", "Dealers, boutiques and makers we know personally, at home and abroad."),
    ("Checked before handover", "Pieces are checked carefully before any money changes hands."),
    ("Your approval first", "You see the piece, the price and the timing before anything is bought."),
  ])
  + closing("The Collection", "Looking for <em>something?</em>", "Tell us what it is. We will find it.", "Hello Walvis, I am looking for something specific."))

# =================================================================== ASSETS
write("assets.html", "Assets", "Homes, vehicles, paperwork and household staff in Dhaka, looked after by Walvis Concierge, especially for Bangladeshis living abroad.",
  hero("lux-villa-evening.jpg", "Assets", "Assets", "What you own, <em>looked after.</em>",
    "Your home, your cars, your renewals and your staff. For members who live abroad, we are your eyes, hands and keys in Dhaka, with updates on WhatsApp.",
    "Hello Walvis, I would like help looking after my property.")
  + intro("lux-ocean-lounge.jpg", "Bangladeshis abroad", "Far from home, <em>still on top of it.</em>",
    ["A flat in Gulshan, a car that needs its papers renewed, a tenant moving in on Sunday. Things at home do not wait for your next visit.",
     "We put a simple routine in place, check on it, and send you photos so you always know where things stand."],
    ["Visits with photos after every one", "Contractors we know, supervised", "One thread for everything"], alt="A calm living room")
  + svc("What we handle", "Peace of mind, <em>wherever you live.</em>", "", [
    ("Home care", "Scheduled visits, cleaning, repairs and renovation supervised, with before and after photos."),
    ("Tenants and keys", "Handovers, inspections and keys held safely for you."),
    ("Vehicles", "Servicing and renewals handled, and a trusted driver ready when you visit."),
    ("Renewals and paperwork", "Dates tracked and reminders sent, coordinated with trusted professionals."),
    ("Household staff", "Drivers, guards, cooks and housekeepers found, introduced and checked on."),
    ("Projects", "Interiors and upgrades managed with one point of contact and your approval at every step."),
  ], tone="mist")
  + closing("Assets", "Leave it <em>with us.</em>", "Tell us what needs looking after. We will suggest a simple routine.", "Hello Walvis, I would like help looking after my property."))

# =================================================================== FOREIGNERS
write("foreigners.html", "Discover Bangladesh", "For visitors and executives arriving in Bangladesh: airport reception, stays, car and driver, business visits and guided trips.",
  hero("bd-ahsan-manzil.jpg", "Discover Bangladesh", "Discover Bangladesh", "Bangladesh, <em>made easy.</em>",
    "For visitors and executives. A local team on your side from the moment you land, in English and with patience.",
    "Hello Walvis, I am visiting Bangladesh and would like concierge support.")
  + intro("lux-jet-window.jpg", "A friend in the city", "Someone who <em>knows everyone.</em>",
    ["A new country is easier with someone who knows how things work. Whether you are here for three days or three weeks, we are the people you call.",
     "We arrange it, explain it, and come along if you would like us to."],
    ["Met at the airport and taken to your door", "Somewhere good to stay", "A trusted car and driver", "Where to eat, shop and spend a free day"], alt="Aircraft window view")
  + svc("What we handle", "From arrival <em>to departure.</em>", "", [
    ("Airport reception", "Someone waiting when you land, help with luggage and a local SIM, and a car to your door."),
    ("Your stay", "Hotels and serviced apartments chosen for the area, the length of stay and the way you like to live."),
    ("Car and driver", "Reliable cars and careful drivers, by the day or the week."),
    ("Business visits", "Meeting rooms, interpreters, schedules and dinners for working trips that need to go smoothly."),
    ("Guided trips", "Day trips and longer journeys, from Old Dhaka to the tea gardens and the coast, with a good guide."),
    ("Everyday help", "Shopping, deliveries, reservations, and the questions a search engine cannot answer."),
  ], tone="mist")
  + steps("How it works", "Ready <em>before you land.</em>", [
    ("Send your dates", "Tell us when you arrive, how long you are staying and what the trip is for."),
    ("We prepare", "A short plan with options for your stay, transport and anything else you need."),
    ("You approve", "Nothing is booked until you are happy with it."),
    ("We stay close", "One message away for the whole of your stay."),
  ])
  + closing("Visitors", "Arriving <em>soon?</em>", "Send us your dates and what you need. We will have a plan ready before you land.", "Hello Walvis, I am visiting Bangladesh and would like concierge support."))

# =================================================================== PROBASHI CONCIERGE
write("expats.html", "Probashi Concierge", "For Bangladeshis living abroad: family looked after, gifts on the day, home and paperwork handled, and everything ready when you fly in.",
  hero("bd-hatirjheel-night.jpg", "Probashi Concierge", "Probashi Concierge", "Far away, <em>still close.</em>",
    "For Bangladeshis living abroad. Your family looked after, your home kept and everything ready when you fly in, by a team on the ground in Dhaka.",
    "Hello Walvis, I live abroad and would like help at home in Bangladesh.")
  + intro("handwritten-note.jpg", "Your people in Dhaka", "Someone you trust, <em>on the ground.</em>",
    ["Living abroad means the things at home still need a person: a parent&rsquo;s doctor visit, a gift on Eid, a flat that needs looking after, papers waiting to be collected.",
     "Send us one message from wherever you are. We handle it here, keep you updated, and you never have to ask a favour twice."],
    ["Parents and family looked in on", "Gifts and flowers on the right day", "Home, bills and paperwork handled", "Everything ready when you land"], alt="A handwritten note")
  + svc("What we handle", "Home, <em>taken care of.</em>", "", [
    ("Family care", "Visits to parents, doctor appointments, medicine and groceries, with a short note back to you each time."),
    ("Gifts on the day", "Eid, birthdays, weddings and anniversaries. Chosen well and delivered in your name."),
    ("Home and property", "Your flat or house kept, repairs arranged, tenants and caretakers looked after."),
    ("Bills and paperwork", "Utility bills, renewals and documents collected, kept track of and done on time."),
    ("Coming home", "Met at the airport, a car and driver for the visit, and the house aired and stocked before you arrive."),
    ("Family occasions", "Weddings, aqiqahs and milad mehfils planned from abroad, ready for you to walk into."),
  ], tone="mist")
  + steps("How it works", "From anywhere, <em>in one message.</em>", [
    ("Tell us who and what", "Your family, your home and the dates that matter to you."),
    ("We set it up", "A simple plan for regular care, and options for anything special."),
    ("You approve", "Nothing is booked or paid for until you say yes."),
    ("We keep you posted", "Photos and short updates, in your time zone."),
  ])
  + closing("Probashi Concierge", "Home is <em>one message away.</em>", "Tell us where you live and what you need looked after in Bangladesh. We will send a simple plan.", "Hello Walvis, I live abroad and would like help at home in Bangladesh."))

# =================================================================== THE JOURNAL
# Opening the page plays the book film (videos/the-journal.mp4) before the page appears: css/journal.css, js/journal.js.
ENTRIES = [
  ("I", "Personal Lifestyle", "The art of the Eid gift", "Choosing something that feels personal, not just expensive.",
   ["The best Eid gifts are rarely the most expensive ones. They are the ones that show you were paying attention: the attar your uncle mentioned once, the sweets from the shop your mother grew up near, the book a friend has been meaning to read.",
    "We start with a short list of names and a few words about each person. Then we find two or three ideas for every name, wrap them properly, and send them out on the right morning with a card in your words.",
    "A small tip from our side: decide the list a week before Chaand Raat. The good mishti shops and florists are busiest exactly when you need them."]),
  ("II", "Bangladesh", "Old Dhaka, slowly", "A morning between the palaces, the river and a long lunch.",
   ["Old Dhaka rewards anyone who arrives early. Before the traffic wakes up, Ahsan Manzil glows pink by the Buriganga and Lalbagh Fort is quiet enough to hear the birds.",
    "We like to go on foot where we can, with someone who knows the stories behind the doorways, then take a small boat on the river before lunch. The Star Mosque is best seen in the softer light of late morning.",
    "It is a day for comfortable shoes, an empty afternoon and an appetite. Tell us how much walking feels right and we will shape the route around it."]),
  ("III", "Experiences", "Planning a surprise that stays a surprise", "Proposals, birthdays and anniversaries, kept quiet until the moment.",
   ["The hardest part of a surprise is not the flowers or the table. It is keeping it secret. So we keep the conversation with one person only, and every message is written so it gives nothing away if someone else picks up the phone.",
    "We plan a cover story with you, a back-up for the weather, and someone on the ground on the day so you can simply arrive and enjoy it.",
    "Our favourite surprises are small and personal: a song that matters, a view from the first trip, a note in the right handwriting."]),
  ("IV", "Travel", "What to ask before booking a villa", "Five questions that save a holiday.",
   ["Photographs are generous. Before we recommend a villa, we ask what the pictures do not show: how far the beach really is, whether the pool is heated, who cooks, and what is being built next door.",
    "We also ask about the people: is there a house manager, who answers at night, and how quickly can a doctor arrive. For families with grandparents or little ones, the stairs and the bathrooms matter more than the view.",
    "None of this is glamorous, which is exactly why we do it for you. You should only have to choose between places that already work."]),
  ("V", "Probashi Concierge", "Coming home for a family wedding", "A gentle checklist for Bangladeshis flying in from abroad.",
   ["A wedding at home is a joy and a project. Outfits to tailor in time, gifts for both families, a car for every function and somewhere comfortable to stay when the house is full.",
    "We like to start six to eight weeks out: measurements sent ahead, fittings booked for the first days after landing, and a simple plan of which car goes where on each evening.",
    "Then, once you land, the only thing left to arrange is your time with family. That is the part we cannot do for you, and should not."]),
  ("VI", "How we work", "Why we always send options first", "Two or three good choices, never a decision made for you.",
   ["Every request starts with a short conversation and ends with options: usually two or three, each one we would be happy to book ourselves.",
    "Nothing is bought or booked until you say yes. It is slower by a few minutes and calmer by a mile, and it means there are no surprises you did not ask for.",
    "If something cannot be done, we say so early and suggest the next best thing. That honesty is part of the service too."]),
]
entries = "".join(f"""
        <details class="jr-entry reveal{d(i)}">
          <summary>
            <span class="jr-num">{n}</span>
            <span class="kicker">{k}</span>
            <h3>{t}</h3>
            <p class="jr-dek">{dek}</p>
            <span class="jr-read">Read <span aria-hidden="true">+</span></span>
          </summary>
          <div class="jr-body">{''.join(f'<p>{p}</p>' for p in ps)}<a class="link" data-wa="{E('Hello Walvis, I read “' + t + '” in The Journal and would like to ask about it.')}" href="#">Ask us about this {ARROW}</a></div>
        </details>""" for i, (n, k, t, dek, ps) in enumerate(ENTRIES))
write("journal.html", "The Journal", "The Journal by Walvis Concierge: stories, guides and small discoveries on travel, gifting, celebrations and Bangladesh.",
  f"""
  <section class="section jr-paper" id="entries">
    <div class="wrap">
      <div class="jr-title">
        <span class="jr-small">Walvis Concierge</span>
        <span class="jr-the">The</span>
        <h2>Journal</h2>
        <span class="jr-rule" aria-hidden="true"><i></i></span>
        <p>In this issue: six short reads, from Eid gifts to a slow morning in Old Dhaka.</p>
      </div>
      <div class="jr-entries">{entries}
      </div>
    </div>
  </section>
"""
  + closing("The Journal", "A story you would like <em>us to write?</em>", "Tell us what you are curious about. The best ideas for The Journal come from our members.", "Hello Walvis, I have an idea for The Journal."))

# the film plays before the page appears (skipped for reduced motion, or if the browser will not play it)
JR_HEAD = """<link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/journal.css">
  <script>if (!matchMedia('(prefers-reduced-motion: reduce)').matches) document.documentElement.classList.add('jr-intro-on')</script>"""
JR_INTRO = """<body class="journal-page">
  <div class="jb" id="jb" aria-hidden="true">
    <div class="jb-book">
      <i class="jb-base"></i><i class="jb-edge jb-fore"></i><i class="jb-edge jb-top"></i><i class="jb-edge jb-bottom"></i><i class="jb-spine"></i>
      <div class="jb-lside"><i class="jb-base"></i><i class="jb-edge jb-fore"></i><i class="jb-edge jb-top"></i><i class="jb-edge jb-bottom"></i></div>
      <div class="jb-page jb-right"><img src="images/logo/walvis-seal-180.png" alt=""><b>Walvis</b><small>Concierge</small></div>
      <div class="jb-cover"><div class="jb-front"><img src="images/logo/walvis-seal-180.png" alt=""><span>The Journal</span></div><div class="jb-page jb-back jb-title"><small>Walvis Concierge</small><i>The</i><b>Journal</b><span class="jr-rule"><i></i></span><em>&#10042;</em></div></div>
    </div>
    <button class="jb-skip" type="button" tabindex="-1">Skip</button>
  </div>"""
jp = os.path.join(OUT, "journal.html"); jh = open(jp).read()
jh = jh.replace('<link rel="stylesheet" href="css/style.css">', JR_HEAD, 1).replace("<body>", JR_INTRO, 1)
jh = jh.replace('<script src="js/site.js"></script>', '<script src="js/site.js"></script>\n  <script src="js/journal.js"></script>', 1)
open(jp, "w").write(jh)

# old Portal links forward to The Journal
open(os.path.join(OUT, "portal.html"), "w").write("""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>The Journal · Walvis Concierge</title>
<meta http-equiv="refresh" content="0; url=journal.html"><link rel="canonical" href="journal.html">
<script>location.replace('journal.html' + location.hash)</script></head>
<body><p><a href="journal.html">The Portal is now The Journal.</a></p></body></html>
""")

# =================================================================== SPECIAL REQUESTS
write("special-requests.html", "Special Requests", "Special requests at Walvis Concierge: the unusual, the last-minute and the things you would not know where to begin with. If it's legal, ask.",
  hero("lux-superyacht.jpg", "Special Requests", "Special Requests", "If it&rsquo;s legal, <em>ask.</em>",
    "The unusual, the last-minute and the things you would not know where to begin with.", "Hello Walvis, I have a special request.", cta="Make a request")
  + f"""
  <section class="section light">
    <div class="wrap narrow" style="text-align:center">
      <p class="t-2 reveal" style="font-family:var(--serif);line-height:1.25">No request is strange to us. Some take a phone call. Some take a week. <em style="color:var(--teal-dark)">We will tell you which.</em></p>
    </div>
  </section>
"""
  + principles("Our promise", "Straight answers, <em>real options.</em>", [
    ("Options within 24 hours", "Two or three ways to do it, each clearly explained, so you can choose with confidence."),
    ("Your approval first", "Nothing is bought, booked or paid for until you have said yes."),
    ("An honest effort", "We cannot promise the impossible. We can promise to try properly and tell you exactly where things stand."),
  ])
  + f"""
  <section class="section dark">
    <div class="wrap">
      <div class="head reveal"><span class="kicker">For example</span><h2 class="t-1">The kind of thing <em>you can ask.</em></h2><p class="lead">Every request is different. These are only examples, to show the range.</p></div>
      <ul class="examples">
        <li class="reveal">A table tonight at the place that is fully booked.</li>
        <li class="reveal d1">A gift in another city by this evening.</li>
        <li class="reveal">A private screening for my son&rsquo;s birthday.</li>
        <li class="reveal d1">Something that is simply not sold in Bangladesh.</li>
        <li class="reveal">A full weekend for guests who land tomorrow.</li>
        <li class="reveal d1">A rooftop, a violinist and a quiet word with the chef.</li>
      </ul>
    </div>
  </section>
"""
  + intro("balloons.jpg", "For members", "A members&rsquo; <em>privilege.</em>",
    ["Special requests are part of membership. It is how we keep the attention where it belongs, and the answers fast.",
     "Not a member yet? Message us. We will explain how membership works and what it includes."], tone="light", flip=True, alt="Balloons in the sky")
  + closing("Special Requests", "Go on. <em>Try us.</em>", "Tell us what you are after. The stranger, the better.", "Hello Walvis, I have a special request.", "Special requests are for members."))

# =================================================================== MEMBERSHIP
write("membership.html", "Membership", "Walvis Concierge membership: Personal Concierge for you and your family, and Corporate Concierge with terms tailored to your company.",
  f"""
  <section class="wm" id="why-membership" aria-labelledby="why-title">
    <div class="wm-wrap reveal">
      <div class="wm-main">
        <span class="wm-eyebrow">Membership</span>
        <h1 id="why-title">Why choose <em>us.</em></h1>
        <p class="wm-lead">Walvis is a small circle, known by name. One team learns your tastes, remembers your dates and handles the rest, so <strong>you only ever have to ask.</strong></p>
        <p class="wm-found">Here you&rsquo;ll find:</p>
        <ul class="wm-points">
          <li><h3>One standard, for every member</h3><p>No paid tiers of service. Every personal member receives the same care.</p></li>
          <li><h3>Options within 24 hours</h3><p>For special requests, two or three ways to do it arrive within a day.</p></li>
          <li><h3>Your approval first</h3><p>Nothing is bought or booked until you have said a clear yes.</p></li>
          <li><h3>A personal touch, always discreet</h3><p>Real people who know you, on WhatsApp or by phone. What you ask stays between us.</p></li>
        </ul>
        <a class="wm-btn" data-wa="{E('Hello Walvis, I would like to start my Walvis journey and learn about membership.')}" href="#">Start your Walvis journey <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg></a>
      </div>
      <aside class="wm-side">
        <div class="wm-card">
          <img class="wm-seal" src="images/logo/walvis-seal-96.png" alt="Walvis Concierge seal" width="58" height="58">
          <span class="wm-eyebrow">Memberships</span>
          <div class="wm-limited">Limited members</div>
          <nav class="wm-links" aria-label="Walvis Concierge services">
            <a href="lifestyle.html">Personal Lifestyle</a><a href="travel.html">Travel</a><a href="retail.html">Retail</a><a href="experiences.html">Experiences</a>
            <a href="foreigners.html">Discover Bangladesh</a><a href="expats.html">Probashi Concierge</a><a href="journal.html">The Journal</a>
          </nav>
        </div>
      </aside>
    </div>
  </section>
"""
  + f"""
  <section class="section mist">
    <div class="wrap">
      <div class="tiers">
        <article class="tier reveal" id="personal" style="scroll-margin-top:90px">
          <div class="ph mask"><img src="images/lux-candlelight.jpg" alt="" loading="lazy" style="object-position:50% 40%"></div>
          <div class="body">
            <span class="kicker">Personal</span><h3>Your life, <em>lighter.</em></h3>
            <p>A personal concierge for you and your family, at home or abroad. One small team that learns your tastes, remembers your dates and handles the rest.</p>
            <ul class="checks"><li>Travel, at home and abroad</li><li>Gifts, cakes and flowers sent in your name</li><li>Birthdays, anniversaries and celebrations</li><li>Rare and hard-to-find things, sourced</li><li>Reservations, tickets and errands</li><li>Special requests, whatever they turn out to be</li></ul>
            <div class="foot"><small>Membership by enquiry</small><a class="btn btn-plum" data-wa="Hello Walvis, I would like to know about Personal Concierge membership." href="#">{CHAT} Enquire</a></div>
          </div>
        </article>
        <article class="tier reveal d1" id="corporate" style="scroll-margin-top:90px">
          <div class="ph mask"><img src="images/lux-skyline-night.jpg" alt="" loading="lazy"></div>
          <div class="body">
            <span class="kicker">Corporate</span><h3>Your company, <em>well looked after.</em></h3>
            <p>For your leadership, your guests and the people you want to impress. The details your company is remembered for, handled by your outside team.</p>
            <ul class="checks"><li>Executive support, handled discreetly</li><li>Visiting guests and buyers, met and hosted</li><li>Corporate gifting, ten boxes or a thousand</li><li>Business travel around the meeting schedule</li><li>Client dinners, launches and celebrations</li><li>Staff rewards that feel like a real thank-you</li></ul>
            <div class="foot"><small>Terms tailored to your company</small><a class="btn btn-plum" data-wa="Hello Walvis, I would like to know about Corporate Concierge membership." href="#">{CHAT} Enquire</a></div>
          </div>
        </article>
      </div>
    </div>
  </section>
"""
  + principles("Who it is for", "Different lives, <em>the same ease.</em>", [
    ("The busy and the young", "Big weeks, bigger weekends. You make the plans; we make them happen while you get on with things."),
    ("Established families", "Weddings, school holidays, parents&rsquo; birthdays, the house full of guests. One team keeps it all running smoothly."),
    ("Bangladeshis abroad", "Far from home but still the one who remembers. Gifts on the day, errands for family, everything ready when you fly in."),
  ], tone="mist")
  + steps("Getting started", "It begins with <em>one message.</em>", [
    ("Say hello", "Message us on WhatsApp. We will explain membership and answer every question."),
    ("We get to know you", "A relaxed conversation about your family or company, your tastes and the dates that matter."),
    ("Message us any time", "Big or small. For special requests, two or three options arrive within 24 hours."),
    ("Consider it done", "You approve, we handle every step and let you know when it is finished."),
  ])
  + closing("Membership", "Membership is <em>by enquiry.</em>", "Message us and we will walk you through how it works, what is included and whether it is the right fit.", "Hello Walvis, I would like to know how membership works."))

# Membership opens on the "Why choose us" design (css/membership.css)
mp = os.path.join(OUT, "membership.html"); mh = open(mp).read()
open(mp, "w").write(mh.replace('<link rel="stylesheet" href="css/style.css">', '<link rel="stylesheet" href="css/style.css">\n  <link rel="stylesheet" href="css/membership.css">', 1))

# =================================================================== WHAT WE OFFER
areas = [
  ("lifestyle.html", "pl-flowers-hero.jpg", "Personal Lifestyle", "Your life, lighter", "Flowers, cakes and gifts sent in your name, dates remembered and errands handled."),
  ("experiences.html", "lux-place-setting.jpg", "Experiences", "Beyond the expected", "Private celebrations, exceptional journeys, the private table, rare access, retreats and collections."),
  ("travel.html", "lux-private-jet.jpg", "Travel", "You pack. We plan.", "Private aviation, yachts, grand hotels, honeymoons, Umrah and Hajj, Bangladesh privately and the great cities."),
  ("retail.html", "lux-pocket-watch.jpg", "Retail", "The Collection", "Jewellery, timepieces, heritage crafts, fragrance, home and art, found for you."),
  ("assets.html", "lux-villa-evening.jpg", "Assets", "What you own, looked after", "Homes, vehicles, renewals and staff, especially when you live abroad."),
  ("foreigners.html", "bd-ahsan-manzil.jpg", "Discover Bangladesh", "Bangladesh, made easy", "Airport reception, stays, car and driver, business visits and guided trips."),
  ("expats.html", "bd-hatirjheel-night.jpg", "Probashi Concierge", "Far away, still close", "Family looked after, home kept and everything ready when you fly in."),
  ("special-requests.html", "lux-superyacht.jpg", "Special requests", "If it&rsquo;s legal, ask", "The unusual, the last-minute and everything in between. For members."),
  ("membership.html", "lux-candlelight.jpg", "Membership", "Personal &amp; Corporate", "One standard for every personal member. Terms tailored for companies."),
]
tiles = "".join(f'<a class="tile reveal{d(i)}" href="{h}" style="aspect-ratio:4/5"><img src="images/{img}" alt="" loading="lazy"><span class="go">{ARROW}</span><span class="k">{k}</span><h3>{t}</h3><p>{x}</p></a>' for i, (h, img, k, t, x) in enumerate(areas))
write("what-we-offer.html", "What we offer", "Everything Walvis Concierge arranges: lifestyle, travel, The Collection, assets, Discover Bangladesh, Probashi Concierge, special requests and membership.",
  hero("lux-glass-dome.jpg", "What we offer", "What we offer", "One message <em>covers it all.</em>",
    "The finest of Bangladesh, thoughtful gifting, evenings to remember and travel planned end to end. Choose where to begin, or simply tell us what is on your mind.",
    "Hello Walvis, I would like to know more about what you offer.", second=("membership.html", "View membership"))
  + f"""
  <section class="section mist">
    <div class="wrap">
      <div class="head reveal"><span class="kicker">The world of Walvis</span><h2 class="t-1">Where would you <em>like to begin?</em></h2></div>
      <div class="tiles4 tiles3">{tiles}</div>
    </div>
  </section>
"""
  + closing("Walvis Concierge", "Something <em>else entirely?</em>", "Special requests are our favourite. If It&rsquo;s Legal, It&rsquo;s Possible.", "Hello Walvis, I have a special request."))

# =================================================================== ABOUT
write("about.html", "About us", "Walvis Concierge was started in Dhaka by four friends who think good service should feel easy. Why a whale, and how we work.",
  hero("bd-river-boats-dusk.jpg", "About us", "About us", "A concierge that <em>keeps its cool.</em>",
    "Started in Dhaka by four friends who think good service should feel easy.", "Hello Walvis, I would like to say hello.", cta="Say hello", second=None)
  + f"""
  <section class="section light">
    <div class="wrap statement">
      <div class="reveal"><img class="seal" src="images/logo/walvis-seal-180.png" alt="Walvis seal" style="margin-bottom:28px"><blockquote>Why <em>a whale?</em></blockquote></div>
      <div class="body reveal d1">
        <p>Walvis is the Dutch word for whale. Calm, unhurried, and at home in every ocean on earth. That is the kind of concierge we set out to build.</p>
        <p>We started Walvis in Dhaka because the people who have earned their time rarely get to enjoy it. Too much of it goes on arranging things: calling around, following up, remembering.</p>
        <p>So we do the arranging, working with people we trust across travel, hospitality, retail and events. Quietly, and properly.</p>
      </div>
    </div>
  </section>
"""
  + band("bd-coxs-bazar.jpg", "From seas to mountains", "It is all <em>in our water.</em>", "A beach at Cox&rsquo;s Bazar or a mountain road in Bhutan. A birthday cake or a boardroom dinner. “From seas to mountains” is our way of saying we cover everything, from the smallest favour to the biggest plan.")
  + intro("handwritten-note.jpg", "Who we are", "Four friends, <em>no faces.</em>",
    ["You will not find our photos on this site, and that is on purpose. A good concierge works in the background. The attention belongs to you, not to us.",
     "What you will find is a small team in Dhaka that answers its own phone, remembers how you like things, and is easy to talk to."], tone="light", flip=True, alt="A handwritten note")
  + principles("How we work", "A few things <em>we hold to.</em>", [
    ("Personal, always", "You deal with people who know you, on WhatsApp or by phone. No app, no call centre."),
    ("No paid tiers of service", "Personal membership has one standard: the same care for every personal member. Corporate terms are tailored."),
    ("Relaxed, not stiff", "Polished in how we deliver, easy-going in how we talk."),
    ("Your approval first", "We bring options. You decide. Only then do we act."),
    ("Honest about limits", "We try for everything, and say so plainly when something cannot be done."),
    ("Discretion, always", "What you ask us for stays between us."),
  ])
  + closing("Walvis Concierge", "We would like to <em>hear from you.</em>", "Questions about membership, or about anything on this site? Message us.", "Hello Walvis, I would like to know more about membership."))

# =================================================================== CONTACT
write("contact.html", "Contact", "Contact Walvis Concierge in Dhaka by WhatsApp, phone or email. A real person replies.",
  hero("handwritten-note.jpg", "Contact", "Contact", "A real person <em>replies.</em>",
    "WhatsApp is the quickest way to reach us. Prefer a call or an email? Those work too.", "Hello Walvis, I would like to get in touch.", cta="WhatsApp us", second=None)
  + f"""
  <section class="section light">
    <div class="wrap">
      <div class="principles">
        <div class="reveal"><span class="kicker">WhatsApp</span><h3><a data-wa="Hello Walvis, I would like to get in touch." href="#">Message us</a></h3><p>The quickest way to reach us, for anything at all.</p></div>
        <div class="reveal d1"><span class="kicker">Phone</span><h3><a href="tel:+8801411267007">+880 1411-267007</a></h3><p>Call or leave a voice note on WhatsApp.</p></div>
        <div class="reveal d2"><span class="kicker">Email</span><h3><a href="mailto:walvisconcierge@gmail.com" style="word-break:break-all">walvisconcierge@gmail.com</a></h3><p>For introductions, companies and anything long.</p></div>
      </div>
      <p class="limited reveal" style="margin-top:60px"><span class="dot"></span> Based in Dhaka, Bangladesh. Working wherever our members travel.</p>
    </div>
  </section>
""")

# =================================================================== PRIVACY (text from the old site)
pm = open(_os.path.join(OUT, "tools/privacy-source.html")).read()
body = re.search(r'Last updated.*?</p>(.*)', pm, re.S)
prose = pm
# keep only headings, paragraphs and lists, drop old classes/wrappers
blocks = re.findall(r'<(h2|h3|p|ul)[^>]*>(.*?)</\1>', pm, re.S)
out = []
for tag, inner in blocks:
    inner = re.sub(r'\s+', ' ', inner).strip()
    inner = re.sub(r' class="[^"]*"', '', inner)
    if tag in ("h2", "h3"): out.append(f'<h3 class="t-3" style="margin:44px 0 12px">{inner}</h3>')
    elif tag == "ul": out.append(f'<ul class="checks" style="margin:10px 0 16px">{inner}</ul>')
    else: out.append(f'<p style="color:var(--ink-soft)">{inner}</p>')
write("privacy.html", "Privacy", "How Walvis Concierge handles your information. Discretion is part of what we do.",
  hero("lux-candlelight.jpg", "Privacy", "Privacy", "Your privacy, <em>simply put.</em>",
    "Discretion is part of what we do. This page explains what we know about you and what we do with it.", "Hello Walvis, I have a question about privacy.", cta="Ask us", second=None)
  + '\n  <section class="section light"><div class="wrap narrow">' + "\n".join(out[2:] if out and "Your privacy" in out[0] else out) + '</div></section>\n')

# =================================================================== CREDITS
cj = open(os.path.join(OUT, "js/credits.js")).read()
creds = re.findall(r'\{ file: "([^"]+)", title: "([^"]*)", creator: "([^"]*)", licence: "([^"]*)", source: "([^"]+)" \}', cj)
used = set()
for fn in os.listdir(OUT):
    if fn.endswith(".html"): used |= set(re.findall(r'images/([a-z0-9-]+\.jpg)', open(os.path.join(OUT, fn)).read()))
for fn in ["js/travel-refresh.js", "css/experiences.css"]:
    if os.path.exists(os.path.join(OUT, fn)): used |= set(re.findall(r'images/([a-z0-9-]+\.jpg)', open(os.path.join(OUT, fn)).read()))
# the Travel page keeps its own photos in images/travel-ref/
for fn in ["travel.html", "js/travel-refresh.js"]:
    used |= {"travel-ref/" + f for f in re.findall(r'images/travel-ref/([a-z0-9-]+\.jpg)', open(os.path.join(OUT, fn)).read())}
rows = "".join(f'<tr><td>{E(f)}</td><td>{E(t) or "&mdash;"}</td><td>{E(c.replace("%20"," ").replace("%u0144","ń"))}</td><td>{E(l)}</td><td><a class="link" style="padding:0;border:0" href="{E(s)}" target="_blank" rel="noopener">Source</a></td></tr>' for f, t, c, l, s in creds if f in used)
write("credits.html", "Photo credits", "Photo credits for the Walvis Concierge website.",
  f"""
  <section class="section dark" style="padding-top:170px">
    <div class="wrap">
      <div class="head reveal"><span class="kicker">Photo credits</span><h1 class="t-1">With thanks to <em>the photographers.</em></h1>
      <p class="lead">Photos licensed under CC BY-SA must stay credited while they are in use. Photos without a line here are our own or CC0.</p></div>
      <div style="overflow-x:auto"><table class="credits">
        <thead><tr><th>File</th><th>Title</th><th>Creator</th><th>Licence</th><th></th></tr></thead>
        <tbody>{rows}</tbody></table></div>
    </div>
  </section>
""")
print("built; photos used:", len(used))
