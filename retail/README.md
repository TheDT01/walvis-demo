# The Walvis Promenade (Retail)

The Retail section is a walk-through mall in its own folder. `retail.html` in the main folder only forwards here, so every existing link to Retail keeps working. Everything the mall needs (scripts, styles, photos, brand marks and credits) lives inside `retail/`, so the folder can be moved to another website (see **Moving retail/ to another website** below).

## The floors

| Level | Shops |
|---|---|
| 6 · Musicals | Piano, Violin, Artist-Owned Instruments, Recorded History |
| 5 · Coinage | Coins, Banknotes, Medals |
| 4 · Couture | Haute Couture, Handbags, Footwear, Furs & Capes |
| 3 · Accessories | Jewelry, Watch, Bags, Traditional Bangladeshi Accessories |
| 2 · Masterpieces | Paintings, Sculptures, Photographs |
| 1 · Conveyance | Aircraft, Automobiles, Boat, Helicopters, RV, Cars, Jet ski |

There are 25 shops with three pieces each (75 in all), chosen with Bangladesh in mind. Every piece is "Price on request"; add indicative prices in `js/data.js` when you have them.

## The pages

| Page | What it is |
|---|---|
| `index.html` | The ground-floor lobby. The first time in a visit you arrive at the glass doors; they open and you walk in. All six floors rise around the atrium, with the glass lift in the middle. A directory sits below. |
| `level.html?level=conveyance` | A floor's own lobby. You step out of the lift and its shops stand around you in a curve. Turn to a shop and walk in. |
| `shop.html?shop=aircraft` | Inside a shop: the glass doors part, the pieces stand on lit plinths, and the full listing is below. |
| `item.html?item=bell-407gx` | One piece in its vitrine, with its photo credit, details and the WhatsApp enquiry. |
| `credits.html` | Every photo: what it shows, its author, its licence and its page on Wikimedia Commons. |

The glass lift rides up and down the atrium past the other floors and opens onto the floor you chose. **Evening** (dark) is the default; the switch at the top right turns the lights up to **Daylight**, and the choice is remembered on that device. Every move ends in a soft glow and the next page starts from it, so there are no blank moments. Visitors who prefer reduced motion get the same pages without the walking and riding.

## The files

| File | What it does |
|---|---|
| `js/data.js` | **Everything you edit**: floors, shops, pieces, prices and photo credits. Instructions are at the top. |
| `js/config.js` | Brand name, WhatsApp number, home link, and whether photos load from Commons or from `images/catalog/`. |
| `js/core.js` | Shared helpers: prices in taka, WhatsApp messages, photos and credits, the 3D camera and smooth movement. |
| `js/atrium.js`, `js/lift.js` | The atrium with every floor, and the glass lift. |
| `js/lobby.js`, `js/level.js`, `js/shop.js`, `js/item.js`, `js/credits-page.js` | One script per page. |
| `css/mall.css` | All of the mall's styles. |
| `css/standalone.css` | Only for another website: the colours, fonts and buttons that `css/style.css` gives on the Walvis site. |
| `images/brand/` | The Walvis seal and icons used by the mall. |
| `images/catalog/` | Downloaded copies of the piece photos (filled by `tools/fetch_images.py`). |
| `tools/fetch_images.py` | Copies every piece photo from Wikimedia Commons into `images/catalog/`. |

## Photos

Every piece photo is a free-licence file on Wikimedia Commons, named in `js/data.js` with its author and licence and listed on `credits.html`. They show the kind of piece described, not the exact piece on offer. Some licences (CC BY-SA) require the credit to stay visible while a photo is used, so keep `credits.html` linked.

By default (`images: 'remote'` in `js/config.js`) photos load straight from Wikimedia Commons. To serve them from your own site:

1. From the main folder, run `python3 retail/tools/fetch_images.py`. It saves each photo to `retail/images/catalog/` and skips ones already there.
2. Set `images: 'local'` in `retail/js/config.js`.

If a local copy is missing, the page falls back to the Commons original. If that fails too, it shows a calm empty frame with the seal.

## Moving retail/ to another website

1. Copy the whole `retail/` folder to the **root** of the other website, keeping the name `retail`. Every page has `<base href="../">`, so paths are written as `retail/...` from the site root.
2. In each `retail/*.html` page:
   - replace `css/style.css` with `retail/css/standalone.css` (or keep your own site's stylesheet, loaded before `retail/css/mall.css`);
   - delete the `<script src="js/site.js">` line, or replace it with your own site's header script;
   - change the icon links from `images/logo/walvis-icon-...` to `retail/images/brand/walvis-icon-...`.
3. Set the brand, WhatsApp number and home link in `retail/js/config.js`.

Without `js/site.js`, `core.js` draws a small header (brand, Retail, WhatsApp) and footer (with the photo credits link) and builds WhatsApp links from `config.js`. Every enquiry still goes to WhatsApp, with the same pre-filled message.

On the Walvis site itself nothing changes: run `python3 tools/stamp.py` before publishing, as usual; it versions these pages too.
