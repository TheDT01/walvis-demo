"""Make photos light for phones.

1. Every photo in images/ wider or taller than 1800px is scaled down to 1800px and re-saved (desktops never need more).
2. Every photo wider than 900px gets a 900px copy in images/sm/ (same name), which phones download instead.
3. Every <img src="images/....jpg"> in the site's pages gets  srcset="images/sm/... 900w, images/... NNNw" sizes="100vw",
   so phones take the small copy and large screens the full photo. Photos set by scripts or in CSS are left as they are.

Run after tools/build.py and before tools/stamp.py:   python3 tools/images.py
Re-running is safe: finished photos are skipped and pages that already have srcset are not touched twice.
"""
import os, re, glob
from PIL import Image

OUT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(OUT, "images")
SM = os.path.join(IMG, "sm")
MAX, SMALL = 1800, 900

sizes = {}   # "images/x.jpg" -> width after step 1
for p in glob.glob(os.path.join(IMG, "**", "*.jpg"), recursive=True):
    if os.sep + "sm" + os.sep in p: continue
    rel = os.path.relpath(p, OUT).replace(os.sep, "/")
    im = Image.open(p)
    if max(im.size) > MAX:
        im.thumbnail((MAX, MAX), Image.LANCZOS)
        im.convert("RGB").save(p, quality=82, optimize=True, progressive=True)
        im = Image.open(p)
    w, h = im.size
    sizes[rel] = w
    if w > SMALL:
        out = os.path.join(SM, os.path.relpath(p, IMG))
        if not os.path.exists(out) or os.path.getmtime(out) < os.path.getmtime(p):
            os.makedirs(os.path.dirname(out), exist_ok=True)
            s = im.copy(); s.thumbnail((SMALL, SMALL * 10), Image.LANCZOS)
            s.convert("RGB").save(out, quality=78, optimize=True, progressive=True)

tag = re.compile(r'<img\b[^>]*>')
src = re.compile(r'\bsrc="(images/[^"?#]+\.jpg)"')
pages = glob.glob(os.path.join(OUT, "*.html")) + glob.glob(os.path.join(OUT, "retail", "*.html"))
changed = 0
for fn in pages:
    s = open(fn, encoding="utf-8").read()
    def add(m):
        t = m.group(0)
        if "srcset=" in t: return t
        k = src.search(t)
        if not k or sizes.get(k.group(1), 0) <= SMALL: return t
        small = "images/sm/" + k.group(1)[len("images/"):]
        return t[:-1].rstrip("/").rstrip() + f' srcset="{small} {SMALL}w, {k.group(1)} {sizes[k.group(1)]}w" sizes="100vw">'
    s2 = tag.sub(add, s)
    if s2 != s:
        open(fn, "w", encoding="utf-8").write(s2); changed += 1
print(f"photos: {len(sizes)}, phone copies in images/sm/, pages updated: {changed}")
