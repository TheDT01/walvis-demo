/* Probashi Concierge page: slide-in reveals, the statement that grows as you scroll,
   the steps line and the card tilt. From walvis-concierge-for-expats.html. */
(function () {
  var root = document.querySelector("main.px");
  if (!root) return;
  root.classList.add("px-js");
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function clamp(v) { return Math.min(1, Math.max(0, v)); }
  function ease(t) { return t * t * (3 - 2 * t); }

  /* Slide-in reveals */
  var rvs = [].slice.call(document.querySelectorAll(".px-rv"));
  if (reduce || !("IntersectionObserver" in window)) {
    rvs.forEach(function (e) { e.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    rvs.forEach(function (e) { io.observe(e); });
  }

  /* Letters that grow as you scroll */
  var growSec = document.getElementById("statement");
  var growLine = document.getElementById("growLine");
  var growSub = document.getElementById("growSub");
  var letters = [];
  if (growLine && !reduce) {
    var text = growLine.textContent;
    growLine.setAttribute("aria-label", text);
    growLine.textContent = "";
    text.split(" ").forEach(function (word, wi, arr) {
      var w = document.createElement("span");
      w.className = "px-w";
      w.setAttribute("aria-hidden", "true");
      word.split("").forEach(function (c) {
        var s = document.createElement("span");
        s.className = "px-ch";
        s.textContent = c;
        w.appendChild(s);
        letters.push(s);
      });
      growLine.appendChild(w);
      if (wi < arr.length - 1) growLine.appendChild(document.createTextNode(" "));
    });
  }

  /* Steps line */
  var stepsEl = document.getElementById("steps");
  var stepItems = stepsEl ? [].slice.call(stepsEl.querySelectorAll(".px-step")) : [];

  var queued = false;
  function update() {
    queued = false;
    var vh = window.innerHeight;
    if (growSec && letters.length) {
      var r = growSec.getBoundingClientRect();
      var total = r.height - vh;
      var p = total > 0 ? clamp(-r.top / total) : 1;
      var n = letters.length;
      for (var i = 0; i < n; i++) {
        var start = (i / n) * 0.55;
        var l = ease(clamp((p * 1.15 - start) / 0.4));
        letters[i].style.opacity = (0.16 + 0.84 * l).toFixed(3);
        letters[i].style.transform = "translateY(" + ((1 - l) * 0.18).toFixed(3) + "em) scale(" + (0.5 + 0.5 * l).toFixed(3) + ")";
      }
      var sp = ease(clamp((p - 0.72) / 0.2));
      growSub.style.opacity = sp.toFixed(3);
      growSub.style.transform = "translateY(" + ((1 - sp) * 18).toFixed(1) + "px)";
    }
    if (stepsEl) {
      var sr = stepsEl.getBoundingClientRect();
      var mid = vh * 0.6;
      stepsEl.style.setProperty("--p", clamp((mid - sr.top) / sr.height).toFixed(3));
      stepItems.forEach(function (st) {
        var b = st.getBoundingClientRect();
        st.classList.toggle("on", reduce ? true : b.top + 40 < mid);
      });
    }
  }
  function req() { if (!queued) { queued = true; requestAnimationFrame(update); } }
  window.addEventListener("scroll", req, { passive: true });
  window.addEventListener("resize", req);
  update();

  /* 3D tilt on cards (mouse only) */
  if (!reduce) {
    [].slice.call(document.querySelectorAll(".px-tilt")).forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        if (e.pointerType !== "mouse") return;
        var b = el.getBoundingClientRect();
        var x = (e.clientX - b.left) / b.width;
        var y = (e.clientY - b.top) / b.height;
        el.style.transform = "rotateX(" + ((0.5 - y) * 9).toFixed(2) + "deg) rotateY(" + ((x - 0.5) * 11).toFixed(2) + "deg)";
        el.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
        el.style.setProperty("--my", (y * 100).toFixed(1) + "%");
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });
  }
})();
