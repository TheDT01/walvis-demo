"""Bring the redesigned 'Concierge for Expats' page into the site as expats.html (Probashi Concierge).
Their class names get a px- prefix and every rule is scoped to <main class="px">; the site's header,
menu and footer wrap it. Writes expats.html, css/expats.css, js/expats.js."""
import re, sys, html
SRC, OUT = sys.argv[1], sys.argv[2]
src = open(SRC).read()
KEEP = {"in", "on"}                     # state classes their script toggles
px = lambda c: c if c in KEEP else "px-" + c

# ---------- markup: from the hero to the end of the summary, without their fixed logo
body = src[src.index('<header class="hero band" id="top">'):src.index("<script>", src.index('<section class="summary band"'))]
body = body.replace('<header class="hero band" id="top">', '<section class="hero band" id="top">', 1).replace("</header>", "</section>", 1)
WA = "https://wa.me/8801411267007"
R = [
 ('<p class="kicker ln" style="--d:.05s">Concierge services | Bangladesh</p>', '<p class="kicker ln" style="--d:.05s">Probashi Concierge &middot; Bangladesh</p>'),
 ('<a class="btn" href="#contact">Send your first request</a>\n      <a class="link" href="#how">',
  '<a class="btn" data-wa="Hello Walvis, I live abroad and would like help for my family in Bangladesh." href="#">Send your first request</a>\n      <a class="link" href="#how">'),
 ('<a class="btn" href="#contact">Send your first request</a>\n    </div>',
  '<a class="btn" data-wa="Hello Walvis, I live abroad and would like help for my family in Bangladesh." href="#">Send your first request</a>\n    </div>'),
 ('<div><dt>Concierge</dt><dd>[Your concierge name]</dd></div>', '<div><dt>Concierge</dt><dd>Walvis Concierge, Dhaka</dd></div>'),
 ('<div><dt>Phone / WhatsApp</dt><dd>[Phone / WhatsApp]</dd></div>', '<div><dt>Phone / WhatsApp</dt><dd><a data-wa="Hello Walvis, I live abroad and would like help for my family in Bangladesh." href="#">+880 1411-267007</a></dd></div>'),
 ('<div><dt>Email</dt><dd>[Email]</dd></div>', '<div><dt>Email</dt><dd><a href="mailto:walvisconcierge@gmail.com">walvisconcierge@gmail.com</a></dd></div>'),
 ('    <p class="foot">Concierge services | Bangladesh. Demo site. Contact details are placeholders.</p>\n',
  '    <p class="foot"><a class="btn" data-wa="Hello Walvis, I live abroad and would like help for my family in Bangladesh." href="#">Send your first request</a></p>\n'),
]
for a, b in R:
    assert a in body, a[:60]; body = body.replace(a, b, 1)
body = re.sub(r'class="([^"]*)"', lambda m: 'class="' + " ".join(px(c) for c in m.group(1).split()) + '"', body)
# the phone header uses the real seal instead of their placeholder monogram
body = re.sub(r'<svg viewBox="0 0 40 40" aria-hidden="true"><circle.*?</svg>', '<img src="images/logo/walvis-seal-96.png" alt="" width="34" height="34">', body, count=1, flags=re.S)
used = {c for grp in re.findall(r'class="([^"]*)"', body) for c in grp.split()}

# ---------- styles: their second <style> block, scoped and prefixed, unused rules dropped
css = re.findall(r"<style>(.*?)</style>", src, re.S)[1]
css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)

def parse(s, i=0):
    out = []
    while i < len(s):
        j = s.find("{", i); k = s.find("}", i)
        if k != -1 and (j == -1 or k < j): return out, k + 1
        if j == -1: break
        pre = s[i:j].strip()
        if pre.startswith("@media"):
            inner, i = parse(s, j + 1); out.append((pre, inner))
        elif pre.startswith("@keyframes"):
            d, m = 1, j + 1
            while d:
                d += {"{": 1, "}": -1}.get(s[m], 0); m += 1
            out.append((pre, s[j + 1:m - 1])); i = m
        else:
            e = s.find("}", j); out.append((pre, s[j + 1:e].strip())); i = e + 1
    return out, i

def sel(x):
    x = x.strip()
    if x in (":root", "body"): return ".px"
    if x == "*": return ".px *"
    if x.startswith(":focus"): return ".px " + x
    js = x.startswith(".js ")
    if js: x = x[4:]
    x = re.sub(r"\.([a-zA-Z_][\w-]*)", lambda m: "." + px(m.group(1)), x)
    cls = [c for c in re.findall(r"\.([a-zA-Z_][\w-]*)", x) if c not in KEEP]
    if any(c not in used for c in cls): return None
    return (".px.px-js " if js else ".px ") + x

def emit(items, ind=""):
    out = []
    for pre, b in items:
        if pre.startswith("@keyframes"):
            out.append(f"{ind}@keyframes px-{pre.split()[1]} {{{b}}}")
        elif isinstance(b, list):
            inner = emit(b, ind + "  ")
            if inner: out.append(f"{ind}{pre} {{\n" + "\n".join(inner) + f"\n{ind}}}")
        else:
            ss = [s for s in (sel(p) for p in pre.split(",")) if s]
            if ss:
                b = re.sub(r"\b(slideL|spin)\b", r"px-\1", b)
                out.append(f"{ind}{', '.join(ss)} {{ {b} }}")
    return out

rules, _ = parse(css)
out = "\n".join(emit(rules))
head = """/* =========================================================
   Probashi Concierge / Concierge for Expats (expats.html)
   From walvis-concierge-for-expats.html: class names carry a px- prefix and every rule is scoped to
   <main class="px">, so nothing here touches the rest of the site.
   ========================================================= */
"""
fit = """
/* ---------- fit with the site ---------- */
.px { display: block; }
.px p + p { margin-top: 0; }                                  /* the site's paragraph spacing stays out */
.px .px-about p + p { margin-top: 1.1em; }
.px .px-hero .px-wrap { padding-top: clamp(150px, 22vh, 210px); }   /* room for the floating header */
.px .px-phone-head img { width: 34px; height: 34px; border-radius: 50%; flex: none; }
.px .px-contact a { text-decoration: none; border-bottom: 1px solid var(--line); }
.px .px-foot { margin-top: 48px; }
"""
open(OUT + "/css/expats.css", "w").write(head + out + "\n" + fit)

# ---------- script: theirs, run against this page only
js = re.findall(r"<script>(.*?)</script>", src, re.S)[-1]
js = js.replace('var root = document.documentElement;\n  root.classList.add("js");',
                'var root = document.querySelector("main.px");\n  if (!root) return;\n  root.classList.add("px-js");')
js = js.replace('querySelectorAll(".rv")', 'querySelectorAll(".px-rv")').replace('querySelectorAll(".step")', 'querySelectorAll(".px-step")')
js = js.replace('querySelectorAll(".tilt")', 'querySelectorAll(".px-tilt")')
js = js.replace('s.className = "ch";', 's.className = "px-ch";').replace('w.className = "w";', 'w.className = "px-w";')
assert ".rv\"" not in js and '"js"' not in js
open(OUT + "/js/expats.js", "w").write("/* Probashi Concierge page: slide-in reveals, the statement that grows as you scroll,\n   the steps line and the card tilt. From walvis-concierge-for-expats.html. */\n" + js.strip() + "\n")

HEAD = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Probashi Concierge · Walvis Concierge</title>
  <meta name="description" content="Concierge services for expats and Bangladeshis abroad: caring for your loved ones in Bangladesh while you are away. Occasions, gifting, parents' care, family trips, visits home and errands.">
  <meta property="og:title" content="Probashi Concierge · Walvis Concierge">
  <meta property="og:image" content="images/share/walvis-share.jpg">
  <link rel="icon" href="images/logo/walvis-icon-32.png">
  <link rel="apple-touch-icon" href="images/logo/walvis-icon-180.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
  <script>document.documentElement.classList.add('veiled')</script>
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/expats.css">
</head>
<body>
  <div id="site-header"></div>
  <main id="main" class="px">
"""
FOOT = """  </main>
  <div id="site-footer"></div>
  <script src="js/site.js"></script>
  <script src="js/expats.js"></script>
</body>
</html>
"""
open(OUT + "/expats.html", "w").write(HEAD + body.rstrip() + "\n" + FOOT)
print("used classes", len(used), "css bytes", len(out))
