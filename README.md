# Walvis Concierge · website demo

A static website: plain HTML, CSS and JavaScript, no build step. Open `index.html` in a browser, or serve the folder with any static host (GitHub Pages works as is).

## Where things live

| What | File |
|---|---|
| Contact details, WhatsApp number, menu | top of `js/site.js` (`SITE`) |
| Whale scene: size, speed, angle, see-through | top of `js/ocean.js` (`MODES`) |
| Whale scene without graphics acceleration | `js/ocean-2d.js` (same scene in Canvas 2D; loaded automatically when WebGL would be slow; keep its `MODES` in step) |
| Colours, fonts, Liquid Glass styling | `css/style.css` (the "v6 · LIQUID GLASS" block at the end) |
| Pages | one `.html` file per page |
| Photos and logo | `images/` (photo credits: `js/credits.js`, shown on `credits.html`) |

Photos licensed CC BY-SA must stay credited on `credits.html` while they are in use.

The whale scene runs on the graphics card (WebGL) where the browser has real graphics acceleration, and on Canvas 2D elsewhere. On a machine that struggles, it lowers its own drawing resolution and turns off the glass blur over the sea; fast machines keep full quality.
