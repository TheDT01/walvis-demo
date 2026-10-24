/* =========================================================
   WALVIS CONCIERGE · retail/js/config.js
   The few settings the Promenade needs from its host website.
   Change these when moving the retail/ folder to another site.
   ========================================================= */
var WALVIS_RETAIL = window.WALVIS_RETAIL || {
  brand: 'Walvis Concierge',
  whatsapp: '8801411267007',          // digits only, with country code; used when the host site has no waLink()
  home: 'index.html',                 // the host site's home page, for the stand-alone header
  // "remote": photos load from Wikimedia Commons.
  // "local":  photos load from retail/images/catalog/ (run python3 retail/tools/fetch_images.py first).
  images: 'remote'
};
