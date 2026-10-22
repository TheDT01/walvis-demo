/* Scroll sequence and exclusive experience accordions. */
(function () {
  "use strict";

  // Scroll choreography: values are progress fractions across the Discover section.
  // The approach itself moves with normal document scrolling; adjust its travel
  // distance in css/experiences.css under .exp-discover min-height.
  // Increasing a start value makes that part begin later; increasing a duration
  // makes it take longer. Word start values are staggered by WORD_STAGGER.
  var TIMING = {
    WORD_START: 0.05,             // First word: Discover
    WORD_STAGGER: 0.12,           // Delay between Discover / the / Extraordinary
    WORD_REVEAL_DURATION: 0.075,  // Scroll distance used to lift each word into view
    PERIOD_REVEAL_OFFSET: 0.035,  // Delay before the final punctuation appears
    PERIOD_REVEAL_DURATION: 0.035, // Scroll distance for the punctuation pop
    TITLE_FADE_START: 0.52,       // When the full title starts fading away
    TITLE_FADE_DURATION: 0.1,     // Longer duration = slower title fade
    MOTTO_FADE_IN_START: 0.36,    // “Rare by nature. Personal by design.” fade-in start
    MOTTO_FADE_IN_DURATION: 0.09, // Longer duration = slower motto fade-in
    MOTTO_FADE_OUT_START: 0.6,    // Motto fade-out start
    MOTTO_FADE_OUT_DURATION: 0.08, // Longer duration = slower motto fade-out
    APPROACH_CENTER_PROGRESS: 0.98, // Scroll progress where the approach reaches the middle
    APPROACH_HIGHLIGHT_TRANSITION_MS: 450, // Highlight-in/out transition; keep in sync with CSS
    APPROACH_HIGHLIGHT_HOLD_MS: 450, // Time to hold at center after highlight-in, before highlight-out
    APPROACH_LABEL_THRESHOLD: 0.45, // Label line animation visibility threshold
    NOTES_THRESHOLD: 0.4,         // Approach notes visibility threshold
    EXPERIENCE_STAGGER_MS: 70,    // Delay between experience row pop-ins
    EXPERIENCE_STAGGER_COUNT: 4,
    EXPERIENCE_CLOSE_MS: 480      // Duration of experience panel close animation
  };

  var scene = document.querySelector('.exp-discover');
  if (!scene) return;

  var words = scene.querySelectorAll('[data-discover-word]');
  var motto = scene.querySelector('[data-discover-motto]');
  var heroTrigger = document.querySelector('.exp-hero__copy p');
  var approach = document.querySelector('.exp-approach');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // A brief cluster of glassy bubbles marks clicks anywhere on this page.
  // Spawn one fish on every fifth click; keep fish appearance and motion unchanged.
  var fishClickCount = 0;
  if (!reduce) document.addEventListener('click', function (event) {
    for (var i = 0; i < 5; i++) {
      var bubble = document.createElement('span');
      bubble.className = 'page-click-bubble';
      bubble.setAttribute('aria-hidden', 'true');
      bubble.style.setProperty('--bubble-x', (event.clientX + Math.random() * 24 - 12) + 'px');
      bubble.style.setProperty('--bubble-y', (event.clientY + Math.random() * 18 - 9) + 'px');
      bubble.style.setProperty('--bubble-size', (5 + Math.random() * 7) + 'px');
      bubble.style.setProperty('--bubble-dx', (Math.random() * 44 - 22) + 'px');
      bubble.style.setProperty('--bubble-dy', (-38 - Math.random() * 42) + 'px');
      bubble.addEventListener('animationend', function () { this.remove(); });
      document.body.appendChild(bubble);
    }
    fishClickCount += 1;
    if (fishClickCount % 5 !== 0) return;
    var fish = document.createElement('span');
    fish.className = 'page-click-fish';
    fish.setAttribute('aria-hidden', 'true');
    fish.innerHTML = "<svg viewBox='0 0 64 32' focusable='false'><path class='click-fish-tail' fill='#461e4a' d='M12 16L2 7L5 16L2 25Z'/><path fill='#461e4a' d='M8 16C15 7 29 5 41 12L47 16L41 20C29 27 15 25 8 16Z'/><circle cx='41' cy='13.5' r='1.3' fill='#1c0719'/></svg>";
    var fishWidth = 34, fishHeight = 22;
    var startX = event.clientX + scrollX - fishWidth / 2, startY = event.clientY + scrollY - fishHeight / 2;
    var angle = Math.random() * Math.PI * 2;
    var vx = Math.cos(angle), vy = Math.sin(angle), edgeDistances = [];
    if (vx > 0) edgeDistances.push((innerWidth + fishWidth - event.clientX) / vx);
    if (vx < 0) edgeDistances.push((-fishWidth - event.clientX) / vx);
    if (vy > 0) edgeDistances.push((innerHeight + fishHeight - event.clientY) / vy);
    if (vy < 0) edgeDistances.push((-fishHeight - event.clientY) / vy);
    var travel = Math.min.apply(Math, edgeDistances.filter(function (distance) { return distance >= 0; }));
    var endX = event.clientX + scrollX + vx * travel - fishWidth / 2;
    var endY = event.clientY + scrollY + vy * travel - fishHeight / 2;
    var rotation = angle * 180 / Math.PI;
    document.body.appendChild(fish);
    var swim = fish.animate([
      { transform: 'translate3d(' + startX + 'px,' + startY + 'px,0) rotate(' + rotation + 'deg)', opacity: .82 },
      { transform: 'translate3d(' + endX + 'px,' + endY + 'px,0) rotate(' + rotation + 'deg)', opacity: .82 }
    ], { duration: 15000, easing: 'linear', fill: 'forwards' });
    swim.addEventListener('finish', function () { fish.remove(); });
  });
  var ticking = false;
  var centerHighlightPlayed = false;
  var centerHoldUntil = 0;
  function clamp(n) { return Math.max(0, Math.min(1, n)); }
  function ease(n) { n = clamp(n); return n * n * (3 - 2 * n); }

  function paint() {
    var rect = scene.getBoundingClientRect();
    var runway = Math.max(1, rect.height - innerHeight);
    var rawProgress = Math.max(0, -rect.top / runway);
    var sceneProgress = clamp(rawProgress);
    // Start the title timeline precisely when the opening sentence reaches the fixed menu.
    // Its end remains the end of the Discover pin, so the animation stays scroll-linked.
    var progress = sceneProgress;
    if (heroTrigger) {
      var triggerRect = heroTrigger.getBoundingClientRect();
      var menu = document.getElementById('topbar');
      var menuBottom = menu ? menu.getBoundingClientRect().bottom : 0;
      var triggerScroll = scrollY + triggerRect.top - menuBottom;
      var discoverEndScroll = scrollY + rect.top + rect.height - innerHeight;
      progress = clamp((scrollY - triggerScroll) / Math.max(1, discoverEndScroll - triggerScroll));
    }
    words.forEach(function (word, index) {
      var wordStart = TIMING.WORD_START + index * TIMING.WORD_STAGGER;
      var reveal = reduce ? 1 : ease((progress - wordStart) / TIMING.WORD_REVEAL_DURATION);
      var dissolve = reduce ? 1 : 1 - ease((progress - TIMING.TITLE_FADE_START) / TIMING.TITLE_FADE_DURATION);
      var wordText = word.querySelector('.discover-word-text');
      word.style.opacity = dissolve;
      word.style.setProperty('--line-progress', reveal.toFixed(3));
      if (wordText) {
        wordText.style.opacity = reveal;
        wordText.style.clipPath = 'inset(0 ' + ((1 - reveal) * 50) + '% 0 ' + ((1 - reveal) * 50) + '%)';
        var wordBlur = 'blur(' + ((1 - reveal) * 2 + (1 - dissolve) * 10) + 'px)';
        wordText.style.filter = index === 1 ? wordBlur + ' drop-shadow(0 0 12px rgba(92,196,192,' + (reveal * .2) + '))' : wordBlur;
        wordText.style.transform = 'scaleX(' + (.94 + reveal * .06) + ')';
      }
    });
    var period = scene.querySelector('[data-discover-period]');
    if (period) {
      var periodProgress = reduce ? 1 : ease((progress - (TIMING.WORD_START + (words.length - 1) * TIMING.WORD_STAGGER + TIMING.PERIOD_REVEAL_OFFSET)) / TIMING.PERIOD_REVEAL_DURATION);
      period.style.opacity = periodProgress;
      period.style.transform = 'scale(' + (.92 + periodProgress * .08) + ')';
    }
    if (motto) {
      var show = reduce ? 1 : ease((progress - TIMING.MOTTO_FADE_IN_START) / TIMING.MOTTO_FADE_IN_DURATION);
      var mottoDissolve = reduce ? 1 : 1 - ease((progress - TIMING.MOTTO_FADE_OUT_START) / TIMING.MOTTO_FADE_OUT_DURATION);
      motto.style.opacity = show * mottoDissolve;
      motto.style.transform = 'translateY(' + ((1 - show) * 14 - (1 - mottoDissolve) * 8) + 'px)';
      motto.style.letterSpacing = (.3 - show * .1) + 'em';
    }
    // The approach rises into view through normal scrolling; only its center highlight pauses scrolling.
    if (approach && !reduce) {
      if (sceneProgress >= TIMING.APPROACH_CENTER_PROGRESS && !centerHighlightPlayed) {
        centerHighlightPlayed = true;
        var totalHighlightMs = TIMING.APPROACH_HIGHLIGHT_TRANSITION_MS * 2 + TIMING.APPROACH_HIGHLIGHT_HOLD_MS;
        centerHoldUntil = performance.now() + totalHighlightMs;
        var approachLabel = document.querySelector('.exp-approach__label');
        if (approachLabel) approachLabel.classList.add('is-centered-highlight');
        setTimeout(function () {
          if (approachLabel) approachLabel.classList.remove('is-centered-highlight');
        }, TIMING.APPROACH_HIGHLIGHT_TRANSITION_MS + TIMING.APPROACH_HIGHLIGHT_HOLD_MS);
        setTimeout(function () { centerHoldUntil = 0; }, totalHighlightMs);
      }
    }
    ticking = false;
  }
  function schedule() { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }
  addEventListener('scroll', schedule, { passive: true });
  function holdAtCenter(event) {
    if (centerHoldUntil && performance.now() < centerHoldUntil) event.preventDefault();
  }
  addEventListener('wheel', holdAtCenter, { passive: false });
  addEventListener('touchmove', holdAtCenter, { passive: false });
  addEventListener('keydown', function (event) {
    if (!centerHoldUntil || performance.now() >= centerHoldUntil) return;
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].indexOf(event.key) !== -1) event.preventDefault();
  });
  addEventListener('resize', schedule); paint();

  var explore = document.querySelector('.exp-hero a[href="#experiences"]');
  var experiences = document.getElementById('experiences');
  if (explore && experiences) {
    explore.addEventListener('click', function (event) {
      event.preventDefault();
      if (reduce) { experiences.scrollIntoView({ behavior: 'auto', block: 'start' }); return; }
      experiences.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
  }

  // Give the opening collage a subtle response to the visitor's pointer.
  var hero = document.querySelector('.exp-hero');
  if (hero && !reduce && matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointermove', function (event) {
      var bounds = hero.getBoundingClientRect();
      var x = (event.clientX - bounds.left) / bounds.width - .5;
      var y = (event.clientY - bounds.top) / bounds.height - .5;
      hero.style.setProperty('--hero-x', (x * 16).toFixed(1) + 'px');
      hero.style.setProperty('--hero-y', (y * 12).toFixed(1) + 'px');
    });
    hero.addEventListener('pointerleave', function () {
      hero.style.setProperty('--hero-x', '0px');
      hero.style.setProperty('--hero-y', '0px');
    });
  }

  // Animate the approach marker only when it enters the page.
  var approachLabel = document.querySelector('.exp-approach__label');
  if (approachLabel && !reduce && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          approachLabel.classList.add('in-view');
          observer.unobserve(approachLabel);
        }
      });
    }, { threshold: TIMING.APPROACH_LABEL_THRESHOLD });
    observer.observe(approachLabel);
  } else if (approachLabel) {
    approachLabel.classList.add('in-view');
  }

  var notes = document.querySelector('.exp-approach__notes');
  if (notes && !reduce && 'IntersectionObserver' in window) {
    var notesObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        notes.classList.add('in');
        notesObserver.unobserve(notes);
      }
    }, { threshold: TIMING.NOTES_THRESHOLD });
    notesObserver.observe(notes);
  } else if (notes) {
    notes.classList.add('in');
  }

  var items = document.querySelectorAll('.exp-item');
  items.forEach(function (item, index) {
    item.classList.add('pop-reveal');
    item.style.transitionDelay = Math.min(index % TIMING.EXPERIENCE_STAGGER_COUNT, TIMING.EXPERIENCE_STAGGER_COUNT - 1) * TIMING.EXPERIENCE_STAGGER_MS + 'ms';
    var summary = item.querySelector('summary');
    summary.addEventListener('click', function (event) {
      // Keep the native details element open briefly so the close animation can play.
      if (!item.open || item.classList.contains('is-closing') || reduce) return;
      event.preventDefault();
      item.classList.add('is-closing');
      setTimeout(function () {
        item.open = false;
        item.classList.remove('is-closing');
      }, TIMING.EXPERIENCE_CLOSE_MS);
    });
  });
})();
