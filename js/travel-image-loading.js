/* Loading feedback stays local to Travel; cached images appear immediately. */
(() => {
  const root = document.querySelector('.travel-refresh');
  if (!root) return;
  const pending = new Set();
  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => entries.forEach(entry => {
        entry.target.classList.toggle('tr-loading-visible', entry.isIntersecting);
      }), { rootMargin: '100px' })
    : null;

  function watch(image, frame) {
    if (image.complete && image.naturalWidth > 0) return;
    let settled = false;
    frame.classList.add('tr-loading');
    frame.setAttribute('aria-busy', 'true');
    pending.add(frame);
    if (observer) observer.observe(frame);
    else frame.classList.add('tr-loading-visible');

    function finish(failed = false) {
      if (settled) return;
      settled = true;
      image.removeEventListener('load', ready);
      image.removeEventListener('error', error);
      frame.classList.remove('tr-loading', 'tr-loading-visible');
      frame.classList.toggle('tr-load-error', failed);
      frame.removeAttribute('aria-busy');
      observer?.unobserve(frame);
      pending.delete(frame);
    }
    async function ready() {
      try { if (image.decode) await image.decode(); } catch (_) {}
      finish(image.naturalWidth === 0);
    }
    function error() { finish(true); }
    image.addEventListener('load', ready);
    image.addEventListener('error', error);
    // Handles cached failures and loads completed between setup and listeners.
    if (image.complete) image.naturalWidth ? ready() : error();
  }

  root.querySelectorAll('.tr-card > img, .tr-stays article > img, .tr-bangladesh figure > img').forEach(image => {
    const frame = document.createElement('div');
    frame.className = 'tr-photo';
    image.before(frame);
    frame.append(image);
    watch(image, frame);
  });
  // Later slideshow images decode behind the current photograph, without a loader flash.
  const hero = root.querySelector('.tr-slides');
  const first = hero?.querySelector('img.is-current');
  if (first) watch(first, hero);
  function visibility() {
    root.classList.toggle('tr-loading-paused', document.hidden);
  }
  document.addEventListener('visibilitychange', visibility);
  visibility();
})();
