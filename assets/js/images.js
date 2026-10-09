(function () {
  "use strict";
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var imgs = Array.prototype.slice.call(document.querySelectorAll(".card-photo img,.art-photo"));
  if (!imgs.length) return;
  var busy = false, vh = window.innerHeight;
  function frame() {
    vh = window.innerHeight;
    imgs.forEach(function (im) {
      var r = im.parentNode.getBoundingClientRect();
      if (r.bottom < -80 || r.top > vh + 80) return;
      var k = (r.top + r.height / 2 - vh / 2) / vh; /* -1..1 */
      im.style.setProperty("--py", (k * -16).toFixed(1));
    });
    busy = false;
  }
  window.addEventListener("scroll", function () { if (!busy) { busy = true; requestAnimationFrame(frame); } }, { passive: true });
  window.addEventListener("resize", frame);
  frame();
  /* Pointer parallax: photo drifts opposite the cursor inside its frame */
  if (window.matchMedia && window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
    document.querySelectorAll(".pillar-card,.impact-card,.article-card").forEach(function (card) {
      var im = card.querySelector(".card-photo img,.art-photo");
      if (!im) return;
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        im.style.setProperty("--px", (((e.clientX - r.left) / r.width - 0.5) * -14).toFixed(1));
      });
      card.addEventListener("pointerleave", function () { im.style.setProperty("--px", 0); });
    });
  }
})();
