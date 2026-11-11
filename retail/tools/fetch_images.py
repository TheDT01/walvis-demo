#!/usr/bin/env python3
"""Copies every Promenade photo from Wikimedia Commons into retail/images/catalog/.

Run it from the website's main folder (the one that holds retail/):
    python3 retail/tools/fetch_images.py
Then set  images: 'local'  in retail/js/config.js, so the pages use the copies.
Photos already downloaded are skipped. Each file keeps the licence shown on
retail/credits.html; keep that page (or the credits) wherever the photos go.
"""
import json, os, re, sys, time, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))   # retail/
SITE = os.path.dirname(ROOT)
WIDTH = 1280

src = open(os.path.join(ROOT, 'js', 'data.js'), encoding='utf-8').read()
data = json.loads(re.search(r'var WALVIS_PROMENADE = (\{.*\});', src, re.S).group(1))
photos = [i['photo'] for l in data['levels'] for s in l['shops'] for i in s['items'] if i.get('photo', {}).get('file')]

ok = fail = 0
for p in photos:
    out = os.path.join(SITE, p['local'])
    if os.path.exists(out) and os.path.getsize(out) > 0:
        ok += 1; continue
    os.makedirs(os.path.dirname(out), exist_ok=True)
    url = 'https://commons.wikimedia.org/wiki/Special:FilePath/' + urllib.parse.quote(p['file'].replace(' ', '_')) + '?width=%d' % WIDTH
    req = urllib.request.Request(url, headers={'User-Agent': 'WalvisPromenadeImageFetch/1.0 (one-off download of credited free-licence photos)'})
    try:
        with urllib.request.urlopen(req, timeout=60) as r, open(out, 'wb') as f:
            f.write(r.read())
        ok += 1; print('saved  ', p['local'])
    except Exception as e:
        fail += 1; print('FAILED ', p['file'], '-', e, file=sys.stderr)
    time.sleep(1)    # be gentle with Wikimedia's servers

print('\n%d of %d photos in retail/images/catalog/' % (ok, len(photos)))
if fail: print('%d failed: run again later, the pages fall back to Commons for those.' % fail)
