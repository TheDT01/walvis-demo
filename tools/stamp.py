"""Stamp every stylesheet and script link in the site's pages with a version (?v=...),
so browsers fetch fresh copies after each publish instead of reusing old cached ones."""
import os, re, sys, time
OUT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))   # the site folder (this file lives in tools/)
V = sys.argv[1] if len(sys.argv) > 1 else time.strftime("%Y%m%d%H%M", time.gmtime())
n = 0
for fn in sorted(os.listdir(OUT)):
    if not fn.endswith(".html"): continue
    p = os.path.join(OUT, fn); s = open(p).read()
    s2 = re.sub(r'((?:href|src)="(?:css|js)/[^"?#]+\.(?:css|js))(?:\?v=[^"]*)?"', r'\1?v=' + V + '"', s)
    if s2 != s: open(p, "w").write(s2); n += 1
print("stamped", n, "pages with v=" + V)
