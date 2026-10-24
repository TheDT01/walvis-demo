# Site tools

Run from anywhere; both scripts find the site folder themselves.

- `python3 tools/build.py` regenerates the inner pages (membership, lifestyle, travel tiles, about, contact, privacy, credits and others) from the content written in this file. `index.html`, `experiences.html`, `travel.html`, `journal.html` and the Retail mall in `retail/` are hand-made and are not touched (`retail.html` only forwards to `retail/`).
- `python3 tools/stamp.py` adds a version (`?v=...`) to every stylesheet and script link (including the pages in `retail/`) so browsers load fresh files. Run it after `build.py` and before every publish.

Photo credits: add a line to `js/credits.js` for every new photo; `build.py` lists the ones in use on `credits.html`.

The Journal: the news, sections, the "Coming up" calendar and the travel season guide all live in `js/journal-data.js` (the stories there now are a demo edition; see the notes at the top of that file). Each story shows an illustration from `js/journal-art.js`, or a photo if you give it `img:`. The three newest stories also appear on the home page.
