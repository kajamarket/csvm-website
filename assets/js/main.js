
(function () {
  "use strict";
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.querySelector("#primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        toggle.focus();
      }
    });
  }

  var search = document.querySelector("#parish-search");
  var filter = document.querySelector("#region-filter");
  var grid = document.querySelector("#parish-grid");
  var count = document.querySelector("#parish-count");
  if (search && filter && grid && count) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".parish-card"));
    function updateParishes() {
      var term = search.value.trim().toLocaleLowerCase();
      var region = filter.value;
      var visible = 0;
      cards.forEach(function (card) {
        var text = card.textContent.toLocaleLowerCase();
        var matchesText = !term || text.indexOf(term) !== -1;
        var matchesRegion = region === "all" || card.getAttribute("data-region") === region;
        var show = matchesText && matchesRegion;
        card.hidden = !show;
        if (show) visible++;
      });
      count.textContent = visible + (visible === 1 ? " listed entry" : " listed entries");
      var empty = document.querySelector("#no-parishes");
      if (!visible && !empty) {
        empty = document.createElement("p");
        empty.id = "no-parishes";
        empty.className = "small-note";
        empty.textContent = "No parishes match that search. Try another name or location.";
        grid.insertAdjacentElement("afterend", empty);
      } else if (visible && empty) {
        empty.remove();
      }
    }
    search.addEventListener("input", updateParishes);
    filter.addEventListener("change", updateParishes);
  }
})();

(function () {
  "use strict";
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Scroll-to-top button */
  var top = document.createElement("button");
  top.type = "button";
  top.className = "scroll-top";
  top.setAttribute("aria-label", "Scroll to top");
  top.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  top.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });
  document.body.appendChild(top);

  /* Header shadow + scroll-top visibility + light hero parallax (rAF-throttled) */
  var header = document.querySelector(".site-header");
  var layers = reduce ? [] : Array.prototype.slice.call(document.querySelectorAll(".hero-pattern,.hero-cross"));
  var ticking = false;
  function update() {
    var y = window.pageYOffset || 0;
    top.classList.toggle("is-visible", y > 500);
    if (header) header.classList.toggle("is-stuck", y > 10);
    if (y < 900) layers.forEach(function (el, i) { el.style.transform = "translateY(" + (y * (i ? 0.12 : 0.07)).toFixed(1) + "px)"; });
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }, { passive: true });
  update();

  /* Scroll reveals */
  if (!("IntersectionObserver" in window) || reduce) return;
  var sel = ".section-heading,.split-copy,.leader-image-wrap,.pillar-card,.impact-card,.article-card,.timeline-item,.impact-list article,.leader-card,.leader-name,.values-grid>div,.values-row>div,.mission-panel,.camp-grid>div,.news-index-card,.hq-card,.network-inner>*,.network-link,.visit-cta-inner>*,.article-layout>*,.resources-panel>*,.directory-controls";
  var items = Array.prototype.slice.call(document.querySelectorAll(sel));
  if (!items.length) return;
  root.classList.add("js");
  var seen = new Map();
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  items.forEach(function (el) {
    var n = seen.get(el.parentNode) || 0;
    seen.set(el.parentNode, n + 1);
    el.style.setProperty("--d", Math.min(n, 5) * 0.08 + "s");
    el.classList.add("reveal");
    io.observe(el);
  });
  /* Safety net: never leave content hidden */
  window.setTimeout(function () { items.forEach(function (el) { el.classList.add("is-in"); }); }, 4000);
})();
