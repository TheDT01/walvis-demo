# Site tools

Run from anywhere; both scripts find the site folder themselves.

- `python3 tools/build.py` regenerates the inner pages (membership, lifestyle, travel tiles, journal, about, contact, privacy, credits and others) from the content written in this file. `index.html`, `experiences.html` and `travel.html` are hand-made and are not touched.
- `python3 tools/stamp.py` adds a version (`?v=...`) to every stylesheet and script link so browsers load fresh files. Run it after `build.py` and before every publish.

Photo credits: add a line to `js/credits.js` for every new photo; `build.py` lists the ones in use on `credits.html`.
