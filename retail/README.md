# The Walvis Promenade (Retail)

The Retail section of Walvis Concierge: a private collection of 75 pieces in six salons, presented like a great gallery or a private sale. It lives in its own folder; `retail.html` in the main folder only forwards here, so every existing link to Retail keeps working (old shop and lobby links included).

## How it is laid out

| Page | What it is |
|---|---|
| `index.html` | **The collection.** A few great photographs, one at a time; the promise (sourced privately, inspected first, delivered to your door, discreet); the six salons; the season's rarities; *Bangladesh, at its finest*; the full index of every piece (Nº 001 to Nº 075, by salon); how it works in four steps; and the private request. |
| `level.html?level=couture` | **A salon.** Its photograph and story, then each of its rooms (the shops): the first piece large, the others beside it. A bar of room names stays at hand as you scroll. |
| `item.html?item=hermes-birkin` | **A piece**, laid out like a private sale: the photograph (tap it for the viewing room: full screen, tap to look closer, ← → through the salon), its number, maker and title, why it is special, the details, what we do, where it lives, the photograph's credit, and *Arrange a private viewing* on WhatsApp. Previous and next pieces, and more from the salon. ← and → also step through the collection. |
| `shop.html?shop=…` | Old shop links: forwards to that room in its salon. |
| `credits.html` | Every photograph: what it shows, its author, its licence and its page on Wikimedia Commons. |

Evening (dark) is the default; the switch at the bottom right turns on Daylight, a bright gallery, and remembers the choice on that device. Motion is quiet: photographs fade in, sections settle as you scroll, the opening photographs change slowly and wait while you look. Visitors who prefer reduced motion get the same pages, still.

Every enquiry goes to WhatsApp with the message already written. There is no cart, checkout, login or form.

## The files

| File | What it does |
|---|---|
| `js/data.js` | **Everything you edit**: salons, rooms, pieces, prices, photo credits, each piece's one-line note, each salon's cover piece, and the curation (opening photographs, rarities, Bangladesh). Instructions are at the top. |
| `js/config.js` | Brand name, WhatsApp number, home link, and whether photos load from Commons or from `images/catalog/`. |
| `js/core.js` | Shared: numbering, prices in taka, WhatsApp messages, photos and credits, cards, the private request, the Day/Evening switch, the reveal on scroll, the viewing room. |
| `js/home.js`, `js/salon.js`, `js/piece.js`, `js/credits-page.js` | One script per page. |
| `css/retail.css` | All the styles. |
| `css/standalone.css` | Only for another website: the colours, fonts and buttons that `css/style.css` gives on the Walvis site. |
| `images/brand/` | The Walvis seal and icons. |
| `images/catalog/` | Downloaded copies of the photographs (filled by `tools/fetch_images.py`). |
| `tools/fetch_images.py` | Copies every photograph from Wikimedia Commons into `images/catalog/`. |

## Photographs

Every photograph is a free-licence file on Wikimedia Commons, named in `js/data.js` with its author and licence, credited on each piece and listed on `credits.html`. They show the kind of piece described, not the exact piece offered. Some licences (CC BY-SA) require the credit to stay visible, so keep `credits.html` linked.

By default (`images: 'remote'`) photographs load from Wikimedia Commons, at the size they are shown. To serve them from your own site: run `python3 retail/tools/fetch_images.py` from the main folder, then set `images: 'local'` in `retail/js/config.js`. A missing local copy falls back to the original; if that fails too, a calm frame with the seal is shown.

## Moving retail/ to another website

1. Copy the whole `retail/` folder to the **root** of the other website, keeping the name `retail` (every page has `<base href="../">`, so paths are written as `retail/...`).
2. In each `retail/*.html` page: replace `css/style.css` with `retail/css/standalone.css` (or keep your own stylesheet, before `retail/css/retail.css`); delete the `<script src="js/site.js">` line, or replace it with your own header script; and change the icon links from `images/logo/walvis-icon-...` to `retail/images/brand/walvis-icon-...`.
3. Set the brand, WhatsApp number and home link in `retail/js/config.js`.

Without `js/site.js`, `core.js` draws a small header (brand, Retail, WhatsApp) and footer (with the photo credits link), and builds WhatsApp links from `config.js`.

On the Walvis site itself, run `python3 tools/stamp.py` before publishing, as usual.
