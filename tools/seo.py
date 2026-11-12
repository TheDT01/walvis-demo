"""Search engines and link previews, for every page of the site.

For each page (root *.html and retail/*.html, except the small pages that only forward to another address) it:
1. sets the preferred address (canonical) and og:url to the full https://walvisconcierge.com/... address,
2. makes the share image a full address (Facebook, WhatsApp and LinkedIn ignore relative ones), adds og:type,
   og:site_name, og:description and a Twitter card,
3. puts plain footer links inside <div id="site-footer"> so they exist without JavaScript (js/site.js replaces them),
then writes sitemap.xml and robots.txt.

Run after tools/images.py and before tools/stamp.py:   python3 tools/seo.py
Re-running is safe: the tags it adds are removed and written again each time.
"""
import os, re, glob, datetime

SITE = "https://walvisconcierge.com/"
OUT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHARE = SITE + "images/share/walvis-share.jpg"
FOOTER_LINKS = [("index.html", "Home"), ("what-we-offer.html", "What we offer"), ("membership.html", "Membership"),
                ("special-requests.html", "Special Requests"), ("assets.html", "Assets"), ("contact.html", "Contact"),
                ("about.html", "About us"), ("terms.html", "Terms"), ("privacy.html", "Privacy"), ("credits.html", "Photo credits")]
MARK = "<!--seo-->"

pages = sorted(glob.glob(os.path.join(OUT, "*.html")) + glob.glob(os.path.join(OUT, "retail", "*.html")))
listed = []
for fn in pages:
    rel = os.path.relpath(fn, OUT).replace(os.sep, "/")
    s = open(fn, encoding="utf-8").read()
    if 'http-equiv="refresh"' in s:
        continue                                   # a forwarding page: not listed, not tagged
    url = SITE + ("" if rel == "index.html" else rel)
    # 1-2. head tags: drop what an earlier run (or the page itself) set, then add the full set once
    s = re.sub(r'\s*<link rel="canonical"[^>]*>', '', s)
    s = re.sub(r'\s*<meta (?:property|name)="(?:og:url|og:type|og:site_name|og:image|og:description|twitter:card|twitter:title|twitter:description|twitter:image)"[^>]*>', '', s)
    s = s.replace(MARK, "")
    title = (re.search(r'<meta property="og:title" content="([^"]*)"', s) or re.search(r'<title>([^<]*)</title>', s)).group(1)
    desc_m = re.search(r'<meta name="description" content="([^"]*)"', s)
    desc = desc_m.group(1) if desc_m else ""
    tags = (f'\n  {MARK}<link rel="canonical" href="{url}">'
            f'\n  <meta property="og:url" content="{url}">'
            f'\n  <meta property="og:type" content="website">'
            f'\n  <meta property="og:site_name" content="Walvis Concierge">'
            f'\n  <meta property="og:image" content="{SHARE}">'
            + (f'\n  <meta property="og:description" content="{desc}">' if desc else '')
            + f'\n  <meta name="twitter:card" content="summary_large_image">'
            f'\n  <meta name="twitter:title" content="{title}">'
            + (f'\n  <meta name="twitter:description" content="{desc}">' if desc else '')
            + f'\n  <meta name="twitter:image" content="{SHARE}">')
    anchor = re.search(r'<meta property="og:title"[^>]*>', s) or re.search(r'<meta name="description"[^>]*>', s) or re.search(r'</title>', s)
    s = s[:anchor.end()] + tags + s[anchor.end():]
    # 3. footer links that work without JavaScript
    links = "".join(f'<a href="{h}">{t}</a> ' for h, t in FOOTER_LINKS)
    s = re.sub(r'<div id="site-footer">.*?</div>(?=\s*\n)', f'<div id="site-footer"><nav class="foot-fallback" aria-label="Site">{links.strip()}</nav></div>', s, count=1, flags=re.S)
    open(fn, "w", encoding="utf-8").write(s)
    listed.append((url, os.path.getmtime(fn)))

today = datetime.date.today().isoformat()
with open(os.path.join(OUT, "sitemap.xml"), "w", encoding="utf-8") as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    for url, _ in listed:
        if "credits.html" in url: continue
        f.write(f"  <url><loc>{url}</loc><lastmod>{today}</lastmod></url>\n")
    f.write("</urlset>\n")
with open(os.path.join(OUT, "robots.txt"), "w", encoding="utf-8") as f:
    f.write(f"User-agent: *\nAllow: /\n\nSitemap: {SITE}sitemap.xml\n")
print(f"pages tagged: {len(listed)}; sitemap.xml and robots.txt written")
