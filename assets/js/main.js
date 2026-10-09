
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
