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
  "Concierge for Expats": "The city at night, waiting for you to come home.",
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

# =================================================================== CONCIERGE FOR EXPATS
# Section by section and word for word from the "Concierge for Expats" design (tools/sources/concierge-for-expats.html),
# in the site's own theme. Page styles: css/expats.css; scroll effects: js/expats.js.
XP_WA = "Hello Walvis, I live abroad and would like help for my family in Bangladesh."
XP_FAMILIAR = [
  ("Before dawn, your time", "Mum&rsquo;s medicine is almost finished.", "The pharmacy in Dhaka closes at ten, and the only cousin who could go is stuck at work."),
  ("Three days before Eid", "The florist you trusted last year stops answering.", "Every other shop sounds just as sure, and you have no way to tell which one will turn up."),
  ("Order placed, never arrived", "The vendor says delivered. Your father says nothing came.", "Long-distance orders go wrong quietly, and you are the last to find out."),
  ("Hospital day", "Your brother takes the day off to sit with a parent.", "Again. Relatives at home carry the whole load while you scroll through messages from another time zone."),
  ("Your flight lands Saturday", "The house is shut, you need a car and a working SIM.", "A week of leave is too short to spend it sorting out logistics."),
  ("An overdue notice", "A bill or renewal at home slips past while you are abroad.", "Paperwork has a deadline, and nobody in your family wants to stand in that queue."),
]
XP_ARRANGE = [
  ("Special occasions", ["Surprise birthdays and anniversaries", "Eid and Pohela Boishakh celebrations", "Aqiqah and graduations", "Small weddings and family gatherings"]),
  ("Gifting", ["Curated gifts, wrapped and delivered", "Flowers and sweets from trusted shops", "Iftar hampers and Eid clothing", "Qurbani coordination through a trusted source"]),
  ("Parents&rsquo; care", ["Regular check-in visits", "Escort to doctor appointments", "Pharmacy delivery", "Coordination with hospitals and caregivers (we coordinate; we do not give medical advice)"]),
  ("Family trips", ["Private-car packages", "Our Sundarbans plan", "Our Sylhet plan", "Designed for families and solo travelers"]),
  ("Visits home", ["VIP airport pickup", "SIM card and a driver", "Hotel or home preparation", "A custom itinerary"]),
  ("Errands", ["Document pickup and delivery", "Bill payments", "Home repairs", "Household tasks through trusted partners"]),
]
XP_CHAT = [
  ("me", "Abba&rsquo;s birthday is on Friday and I can&rsquo;t be there. Can you do something nice?", "9:14 pm"),
  ("them", "Of course. A small cake from his favourite shop, flowers and your card, delivered Friday at 4 pm. Shall we add a video call at the door?", "9:26 pm"),
  ("me", "Yes please. Write on the card: &ldquo;Happy birthday, Abba. Love, Rafi.&rdquo;", "9:28 pm"),
  ("them", "Confirmed. Quote sent. We will message you a photo the moment it arrives.", "9:31 pm"),
]
XP_WHY = [
  ("Trust", "We vet every vendor, driver and guide, and keep the same team on a family&rsquo;s requests."),
  ("Proof of delivery", "Photos, short videos or a live video call, so you see the moment."),
  ("One point of contact", "One WhatsApp number instead of chasing ten people."),
  ("Time-zone friendly", "Updates timed for your evening, with urgent requests handled fast."),
  ("Luxury and care", "Elegant presentation, thoughtful details and respect for elderly family members."),
  ("Backup plans", "A second option ready if a vendor, car or venue falls through."),
  ("Privacy", "Family details stay confidential and are used only to deliver your request."),
  ("Transparent pricing", "A clear quote before any work starts, with no surprise add-ons."),
]
XP_STEPS = [
  ("Request", "Send a message with the occasion, date, budget and your loved one&rsquo;s details."),
  ("Plan", "We reply within an agreed time with a plan and a price."),
  ("Approve", "You confirm and pay by the agreed method."),
  ("Deliver", "Our team runs it on the ground, with photos or video."),
  ("Follow-up", "We check how it went and save the family&rsquo;s preferences for next time."),
]
xp_familiar = "".join(f"""
        <article class="pl-moment reveal{d(i)}"><time>{t}</time><h3>{a}</h3><p>{b}</p></article>""" for i, (t, a, b) in enumerate(XP_FAMILIAR))
xp_arrange = "".join(f"""
        <div class="pl-col reveal{d(i)}"><h3>{h}</h3><ul class="checks">{''.join(f'<li>{x}</li>' for x in xs)}</ul></div>""" for i, (h, xs) in enumerate(XP_ARRANGE))
xp_chat = "".join(f'<div class="msg {w}">{m}<time>{t}</time></div>' for w, m, t in XP_CHAT)
xp_why = "".join(f"""
        <div class="reveal{d(i)}"><article class="xp-tilt"><h3>{t}</h3><p>{x}</p></article></div>""" for i, (t, x) in enumerate(XP_WHY))
xp_steps = "".join(f"""
        <li class="xp-step reveal"><span class="xp-num" aria-hidden="true">{i + 1}</span><div><h3>{t}</h3><p>{x}</p></div></li>""" for i, (t, x) in enumerate(XP_STEPS))

write("expats.html", "Concierge for Expats", "Concierge services for expats: caring for your loved ones in Bangladesh, while you are away. Special occasions, gifting, parents' care, family trips, visits home and errands.",
  hero("bd-hatirjheel-night.jpg", "Concierge for Expats", "Concierge services | Bangladesh", "Concierge Services <em>for Expats.</em>",
    "Caring for your loved ones in Bangladesh, while you are away.",
    XP_WA, cta="Send your first request", second=("#how", "See how it works"))
  + f"""
  <section class="section light" id="about">
    <div class="wrap xp-split">
      <h2 class="t-1 reveal">About this service</h2>
      <div class="xp-about reveal d1">
        <p class="xp-lead">Living abroad means missing birthdays, Eid mornings and the everyday moments that matter most to the people you love.</p>
        <p>Our concierge service acts as your trusted presence in Bangladesh, turning your wishes into well-organized, elegant experiences. You tell us what you want, and we plan it, deliver it and show you it was done with care.</p>
        <p>From surprise celebrations and parents&rsquo; care to family trips and visits home, we handle the details so you can stay close without being there. Below is what we offer, why families trust us and how simple it is to begin.</p>
      </div>
    </div>
  </section>

  <section class="xp-grow" id="statement" aria-label="You ask, we deliver.">
    <div class="xp-stick">
      <p class="xp-grow-line" id="growLine">You ask, we deliver.</p>
      <p class="xp-grow-sub" id="growSub">Tell us what you want for the people you love. We plan it, run it on the ground and show you it was done well.</p>
    </div>
  </section>

  <section class="section mist" id="problem">
    <div class="wrap">
      <div class="head reveal"><span class="kicker">Sounds familiar?</span><h2 class="t-1">You haven&rsquo;t stopped caring. <em>You are just an ocean away.</em></h2></div>
      <div class="pl-moments pl-moments-3">{xp_familiar}
      </div>
      <p class="pl-answer reveal">Send us one message. <em>We handle it and show you the proof.</em></p>
    </div>
  </section>

  <section class="section dark on-dark" id="lifestyle">
    <div class="wrap">
      <div class="head reveal"><span class="kicker">Lifestyle management</span><h2 class="t-1">Everything we arrange <em>for the people you love.</em></h2>
      <p class="lead">Six ways we look after the people you love, one request at a time.</p></div>
      <div class="pl-handle pl-handle-3">{xp_arrange}
      </div>
    </div>
  </section>

  <section class="section light" id="chat">
    <div class="wrap split">
      <div class="copy">
        <span class="kicker reveal">How it feels</span>
        <h2 class="t-1 reveal d1">One message. <em>Then it&rsquo;s done.</em></h2>
        <p class="lead reveal d2">No forms, no phone tag across time zones. Write to us the way you would write to a friend at home, and we reply with a plan and proof.</p>
        <div class="btn-row reveal d3"><a class="btn btn-teal" data-wa="{E(XP_WA)}" href="#">{CHAT} Send your first request</a></div>
      </div>
      <div class="media reveal">
        <div class="phone">
          <div class="screen">
            <div class="chat-top"><img src="images/logo/walvis-seal-96.png" alt=""><div><b>Walvis Concierge</b><small>Usually replies within the hour</small></div></div>
            <div class="chat-body">{xp_chat}</div>
          </div>
        </div>
        <p class="note-small">A sample conversation, for illustration</p>
      </div>
    </div>
  </section>

  <section class="section mist" id="why">
    <div class="wrap">
      <div class="head reveal"><span class="kicker">Why families choose us</span><h2 class="t-1">Why families <em>choose us.</em></h2></div>
      <div class="xp-cards4">{xp_why}
      </div>
    </div>
  </section>

  <section class="section light" id="how" style="scroll-margin-top:70px">
    <div class="wrap">
      <div class="head reveal"><span class="kicker">How it works</span><h2 class="t-1">How it <em>works.</em></h2></div>
      <ol class="xp-steps" id="steps">{xp_steps}
      </ol>
    </div>
  </section>

  <section class="band xp-occasion" id="calendar">
    <img src="images/lux-candlelight.jpg" alt="" loading="lazy">
    <div class="wrap"><div class="copy on-dark">
      <span class="kicker reveal">A special touch</span>
      <h2 class="t-1 reveal d1">The Occasion <em>Calendar.</em></h2>
      <p class="lead reveal d2">We remind you of birthdays, anniversaries and Eid dates in advance and offer a ready-made package for each, so you never miss a moment.</p>
      <div class="xp-chips reveal d3"><span>Birthdays</span><span>Anniversaries</span><span>Eid dates</span></div>
    </div></div>
  </section>

  <section class="section closing dark" id="contact">
    <div class="ocean faint" aria-hidden="true"><canvas class="sea" data-mode="faint"></canvas></div>
    <div class="wrap xp-summary">
      <div class="xp-split">
        <h2 class="t-1 reveal">In <em>summary.</em></h2>
        <div class="reveal d1">
          <p class="xp-big">Expats should not have to choose between a busy life abroad and caring for family at home. Our concierge service gives you one trusted team that plans, delivers and proves every special moment, from birthdays and Eid gifts to parents&rsquo; care and family trips.</p>
          <p>With vetted partners, clear pricing, backup plans and updates timed to your day, we remove the stress and uncertainty of long-distance arrangements. Let us handle the rest.</p>
          <p>Send us your first request, and we will take care of the people you love as if they were our own.</p>
        </div>
      </div>
      <dl class="xp-contact reveal">
        <div><dt>Concierge</dt><dd>Walvis Concierge, Dhaka</dd></div>
        <div><dt>Phone / WhatsApp</dt><dd><a data-wa="{E(XP_WA)}" href="#">+880 1411-267007</a></dd></div>
        <div><dt>Email</dt><dd><a href="mailto:walvisconcierge@gmail.com">walvisconcierge@gmail.com</a></dd></div>
      </dl>
      <div class="btn-row reveal" style="justify-content:center"><a class="btn btn-teal" data-wa="{E(XP_WA)}" href="#">{CHAT} Send your first request</a><a class="btn btn-line" href="contact.html" style="color:#fffafa;border-color:rgba(255,250,250,.45)">Other ways to reach us</a></div>
    </div>
  </section>
""")
xp = os.path.join(OUT, "expats.html"); xh = open(xp).read()
xh = xh.replace('<link rel="stylesheet" href="css/style.css">', '<link rel="stylesheet" href="css/style.css">\n  <link rel="stylesheet" href="css/expats.css">', 1)
xh = xh.replace('<script src="js/site.js"></script>', '<script src="js/site.js"></script>\n  <script src="js/expats.js"></script>', 1)
open(xp, "w").write(xh)

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
  ("V", "Concierge for Expats", "Coming home for a family wedding", "A gentle checklist for Bangladeshis flying in from abroad.",
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
write("membership.html", "Membership", "Why choose Walvis Concierge: one standard for every member, options within 24 hours, your approval first and a personal, discreet touch.",
  f"""
  <section class="section dark on-dark wm-page" id="why-membership">
    <div class="wrap wm-grid">
      <div class="wm-main">
        <span class="kicker reveal">Membership</span>
        <h1 class="t-1 reveal d1">Why choose <em>us.</em></h1>
        <p class="lead reveal d2">Walvis is a small circle, known by name. One team learns your tastes, remembers your dates and handles the rest, so <strong>you only ever have to ask.</strong></p>
        <p class="wm-found reveal">Here you&rsquo;ll find:</p>
        <ul class="wm-points">
          <li class="reveal"><h3>One standard, for every member</h3><p>No paid tiers of service. Every personal member receives the same care.</p></li>
          <li class="reveal d1"><h3>Options within 24 hours</h3><p>For special requests, two or three ways to do it arrive within a day.</p></li>
          <li class="reveal d2"><h3>Your approval first</h3><p>Nothing is bought or booked until you have said a clear yes.</p></li>
          <li class="reveal"><h3>A personal touch, always discreet</h3><p>Real people who know you, on WhatsApp or by phone. What you ask stays between us.</p></li>
        </ul>
        <div class="btn-row reveal"><a class="btn btn-teal" data-wa="{E('Hello Walvis, I would like to start my Walvis journey and learn about membership.')}" href="#">{CHAT} Start your Walvis journey</a></div>
      </div>
      <aside class="wm-side reveal d1">
        <div class="wm-card">
          <img class="wm-seal" src="images/logo/walvis-seal-96.png" alt="" width="54" height="54">
          <span class="kicker">Memberships</span>
          <p class="wm-limited"><span class="dot"></span> Limited members</p>
          <nav class="wm-links" aria-label="Walvis Concierge services">
            <a href="lifestyle.html">Personal Lifestyle {ARROW}</a><a href="travel.html">Travel {ARROW}</a><a href="retail.html">Retail {ARROW}</a><a href="experiences.html">Experiences {ARROW}</a>
            <a href="foreigners.html">Discover Bangladesh {ARROW}</a><a href="expats.html">Concierge for Expats {ARROW}</a><a href="journal.html">The Journal {ARROW}</a>
          </nav>
        </div>
      </aside>
    </div>
  </section>
"""
)

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
  ("expats.html", "bd-hatirjheel-night.jpg", "Concierge for Expats", "While you are away", "Caring for your loved ones in Bangladesh: occasions, gifts, parents’ care and visits home."),
  ("special-requests.html", "lux-superyacht.jpg", "Special requests", "If it&rsquo;s legal, ask", "The unusual, the last-minute and everything in between. For members."),
  ("membership.html", "lux-candlelight.jpg", "Membership", "Personal &amp; Corporate", "One standard for every personal member. Terms tailored for companies."),
]
tiles = "".join(f'<a class="tile reveal{d(i)}" href="{h}" style="aspect-ratio:4/5"><img src="images/{img}" alt="" loading="lazy"><span class="go">{ARROW}</span><span class="k">{k}</span><h3>{t}</h3><p>{x}</p></a>' for i, (h, img, k, t, x) in enumerate(areas))
write("what-we-offer.html", "What we offer", "Everything Walvis Concierge arranges: lifestyle, travel, The Collection, assets, Discover Bangladesh, Concierge for Expats, special requests and membership.",
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
