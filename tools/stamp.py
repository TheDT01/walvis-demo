"""Stamp every stylesheet and script link in the site's pages with a version (?v=...),
so browsers fetch fresh copies after each publish instead of reusing old cached ones."""
import os, re, sys, time
OUT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))   # the site folder (this file lives in tools/)
V = sys.argv[1] if len(sys.argv) > 1 else time.strftime("%Y%m%d%H%M", time.gmtime())
n = 0
# the site's pages, and the mall's own pages in retail/
pages = [os.path.join(OUT, f) for f in sorted(os.listdir(OUT))] + [os.path.join(OUT, "retail", f) for f in sorted(os.listdir(os.path.join(OUT, "retail")))]
for p in pages:
    if not p.endswith(".html"): continue
    s = open(p).read()
    s2 = re.sub(r'((?:href|src)="(?:retail/)?(?:css|js)/[^"?#]+\.(?:css|js))(?:\?v=[^"]*)?"', r'\1?v=' + V + '"', s)
    if s2 != s: open(p, "w").write(s2); n += 1
print("stamped", n, "pages with v=" + V)
