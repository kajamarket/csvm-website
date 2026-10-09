
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

(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia && window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  var raf = window.requestAnimationFrame.bind(window);

  /* Page exit fade for plain internal navigation */
  if (!reduce) {
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[href]");
      if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target && a.target !== "_self") return;
      var u; try { u = new URL(a.href, location.href); } catch (x) { return; }
      if (u.origin !== location.origin || u.pathname === location.pathname || a.hasAttribute("download")) return;
      e.preventDefault();
      document.documentElement.classList.add("page-leaving");
      setTimeout(function () { location.href = a.href; }, 180);
    });
    window.addEventListener("pageshow", function () { document.documentElement.classList.remove("page-leaving"); });
  }
  if (reduce) return;

  /* Headline word-by-word entrance */
  function split(node, state) {
    Array.prototype.slice.call(node.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          var s = document.createElement("span");
          s.className = "word"; s.textContent = part;
          s.style.setProperty("--wd", (0.15 + state.i++ * 0.09).toFixed(2) + "s");
          frag.appendChild(s);
        });
        n.parentNode.replaceChild(frag, n);
      } else if (n.nodeType === 1 && n.tagName !== "BR") { split(n, state); }
    });
  }
  document.querySelectorAll(".hero h1,.page-hero h1").forEach(function (h) {
    h.classList.add("has-words"); split(h, { i: 0 });
  });

  /* Scroll progress bar */
  var bar = document.createElement("div");
  bar.className = "scroll-progress"; bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);

  /* Particles + spotlight in heroes */
  document.querySelectorAll(".hero,.page-hero").forEach(function (h) {
    var wrap = document.createElement("div");
    wrap.className = "particles"; wrap.setAttribute("aria-hidden", "true");
    var n = window.innerWidth < 760 ? 8 : 16, html = "";
    for (var i = 0; i < n; i++) {
      html += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;--s:' + (2 + Math.random() * 4).toFixed(1) +
        'px;--t:' + (10 + Math.random() * 12).toFixed(1) + 's;--dl:-' + (Math.random() * 14).toFixed(1) +
        's;--dx:' + (Math.random() * 60 - 30).toFixed(0) + 'px"></i>';
    }
    wrap.innerHTML = html;
    h.insertBefore(wrap, h.firstChild);
    if (fine) {
      var spot = document.createElement("div");
      spot.className = "hero-spot"; spot.setAttribute("aria-hidden", "true");
      h.insertBefore(spot, h.firstChild);
      h.addEventListener("pointermove", function (e) {
        var r = h.getBoundingClientRect();
        raf(function () {
          spot.style.setProperty("--sx", (e.clientX - r.left) + "px");
          spot.style.setProperty("--sy", (e.clientY - r.top) + "px");
        });
      });
    }
  });

  /* Card glow + 3D tilt, hero card tilt, magnetic buttons */
  if (fine) {
    document.querySelectorAll(".pillar-card,.impact-card,.article-card,.hq-card,.news-index-card").forEach(function (c) {
      c.classList.add("fx-glow");
      c.addEventListener("pointermove", function (e) {
        var r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        c.style.setProperty("--mx", x + "px"); c.style.setProperty("--my", y + "px");
        c.style.transform = "perspective(900px) rotateX(" + ((0.5 - y / r.height) * 5).toFixed(2) + "deg) rotateY(" + ((x / r.width - 0.5) * 6).toFixed(2) + "deg) translateY(-4px)";
      });
      c.addEventListener("pointerleave", function () { c.style.transform = ""; });
    });
    var hc = document.querySelector(".hero-card"), hv = document.querySelector(".hero-visual");
    if (hc && hv) {
      hv.addEventListener("pointermove", function (e) {
        var r = hv.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        hc.style.transform = "perspective(900px) rotateX(" + (-y * 12).toFixed(2) + "deg) rotateY(" + (x * 14).toFixed(2) + "deg) rotate(2deg)";
      });
      hv.addEventListener("pointerleave", function () { hc.style.transform = ""; });
    }
    document.querySelectorAll(".button,.nav-cta").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.translate = ((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1) + "px " + ((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1) + "px";
      });
      b.addEventListener("pointerleave", function () { b.style.translate = ""; });
    });
  }

  /* Timeline fill + parallax, driven by one rAF-throttled scroll handler */
  var tl = document.querySelector(".timeline"), fill = null;
  if (tl) { fill = document.createElement("div"); fill.className = "timeline-fill"; fill.setAttribute("aria-hidden", "true"); tl.appendChild(fill); }
  var par = [
    { el: document.querySelector(".hero-visual"), k: -0.06 },
    { el: document.querySelector(".leader-image"), k: 0.05, rel: true },
    { el: document.querySelector(".camp-mark"), k: 0.04, rel: true }
  ].filter(function (p) { return p.el; });
  var busy = false;
  function frame() {
    var vh = window.innerHeight, y = window.pageYOffset;
    var max = document.documentElement.scrollHeight - vh;
    bar.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0).toFixed(4) + ")";
    if (fill) {
      var r = tl.getBoundingClientRect();
      fill.style.setProperty("--p", Math.max(0, Math.min(1, (vh * 0.7 - r.top) / r.height)).toFixed(3));
    }
    par.forEach(function (p) {
      var r = p.el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      var off = p.rel ? (r.top + r.height / 2 - vh / 2) * p.k : y * p.k;
      p.el.style.translate = "0 " + off.toFixed(1) + "px";
    });
    busy = false;
  }
  window.addEventListener("scroll", function () { if (!busy) { busy = true; raf(frame); } }, { passive: true });
  window.addEventListener("resize", function () { if (!busy) { busy = true; raf(frame); } });
  frame();
})();
