/*
 * Marker highlights — reusable across the site.
 *
 * Usage: wrap any text in a span with a note (and optional image):
 *   <span data-card-text="How Marker helped..." data-card-img="images/foo.png">text</span>
 * Then include this script once: <script src="highlights.js"></script>
 *
 * Desktop (hover-capable pointers): the card appears on hover.
 * Mobile / touch: tapping opens a slide-up sheet; tap the backdrop to close.
 * No CSS file needed — everything is styled with Tailwind utility classes.
 */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var marks = Array.prototype.slice.call(
      document.querySelectorAll("[data-card-text]")
    );
    if (!marks.length) return;

    function addClasses(el, classes) {
      classes.split(/\s+/).forEach(function (c) {
        if (c) el.classList.add(c);
      });
    }

    function buildCardInner(container, img, text) {
      container.innerHTML = "";
      if (img) {
        var image = document.createElement("img");
        image.src = img;
        image.alt = "";
        addClasses(
          image,
          "w-[54px] h-[54px] rounded-full object-cover shrink-0 select-none pointer-events-none"
        );
        container.appendChild(image);
      }
      var col = document.createElement("div");
      addClasses(col, "flex-1 min-w-0 flex flex-col");
      var p = document.createElement("p");
      p.textContent = text;
      addClasses(
        p,
        "font-graphik text-[14px] leading-[22px] text-black tracking-[0.02em]"
      );
      col.appendChild(p);
      container.appendChild(col);
    }

    /* ---------- style the highlighted spans ---------- */
    marks.forEach(function (el) {
      addClasses(
        el,
        "bg-[rgba(168,160,145,0.3)] hover:bg-[rgba(168,160,145,0.42)] rounded-[2px] px-[3px] py-0 cursor-pointer transition-colors duration-150 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
      );
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      el.setAttribute("aria-label", "Show note about this passage");
    });

    /*
     * Both interactions are always wired up; which one fires is decided by the
     * pointer type at interaction time (not a one-time media query). This keeps
     * touch devices on click -> bottom sheet even if they report hover support,
     * and hybrid laptops get hover on mouse but the sheet on touch.
     */
    var lastPointerType = "mouse";
    document.addEventListener(
      "pointerdown",
      function (e) {
        lastPointerType = e.pointerType || "mouse";
      },
      true
    );

    /* ---------- DESKTOP: hover popover ---------- */
    var pop = document.createElement("div");
    addClasses(
      pop,
      "fixed z-[120] w-[320px] max-w-[calc(100vw-24px)] opacity-0 invisible transition-opacity duration-150 ease-out pointer-events-none"
    );
    var popCard = document.createElement("div");
    addClasses(
      popCard,
      "flex gap-[16px] items-start bg-white border border-[#e2e2e2] rounded-[10px] p-[20px] shadow-[0_3px_12px_rgba(0,0,0,0.10)]"
    );
    pop.appendChild(popCard);
    document.body.appendChild(pop);

    var hideTimer = null;

    function showPop(el) {
      if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
      buildCardInner(
        popCard,
        el.getAttribute("data-card-img"),
        el.getAttribute("data-card-text")
      );
      // Measure while still invisible (visibility:hidden keeps layout), then
      // place it at its final spot BEFORE fading in so it never slides around.
      var rect = el.getBoundingClientRect();
      var pw = pop.offsetWidth;
      var ph = pop.offsetHeight;
      var margin = 12;
      var left = rect.left + rect.width / 2 - pw / 2;
      left = Math.max(margin, Math.min(left, window.innerWidth - pw - margin));
      var top = rect.top - ph - 10;
      if (top < margin) top = rect.bottom + 10; // flip below if no room above
      pop.style.left = Math.round(left) + "px";
      pop.style.top = Math.round(top) + "px";
      pop.classList.remove("invisible", "opacity-0");
    }

    function hidePop() {
      hideTimer = setTimeout(function () {
        pop.classList.add("invisible", "opacity-0");
      }, 80);
    }

    window.addEventListener(
      "scroll",
      function () {
        pop.classList.add("invisible", "opacity-0");
      },
      { passive: true }
    );

    /* ---------- MOBILE / TOUCH: slide-up sheet ---------- */
    var backdrop = document.createElement("div");
    addClasses(
      backdrop,
      "fixed inset-0 z-[110] bg-black/30 opacity-0 invisible transition-opacity duration-300"
    );

    var sheet = document.createElement("div");
    addClasses(
      sheet,
      "fixed left-0 right-0 bottom-0 z-[120] translate-y-full transition-transform duration-300 ease-out"
    );
    var sheetCard = document.createElement("div");
    addClasses(
      sheetCard,
      "bg-white rounded-t-[20px] px-[22px] pt-[12px] pb-[24px] max-w-[560px] mx-auto shadow-[0_-6px_24px_rgba(0,0,0,0.14)]"
    );
    var handle = document.createElement("div");
    addClasses(handle, "w-[40px] h-[4px] rounded-full bg-[#d9d2cb] mx-auto mb-[18px]");
    var sheetBody = document.createElement("div");
    addClasses(sheetBody, "flex gap-[16px] items-start");
    sheetCard.appendChild(handle);
    sheetCard.appendChild(sheetBody);
    sheet.appendChild(sheetCard);

    document.body.appendChild(backdrop);
    document.body.appendChild(sheet);

    function openSheet(el) {
      buildCardInner(
        sheetBody,
        el.getAttribute("data-card-img"),
        el.getAttribute("data-card-text")
      );
      backdrop.classList.remove("invisible", "opacity-0");
      requestAnimationFrame(function () {
        sheet.classList.remove("translate-y-full");
      });
    }

    function closeSheet() {
      sheet.classList.add("translate-y-full");
      backdrop.classList.add("opacity-0");
      setTimeout(function () {
        backdrop.classList.add("invisible");
      }, 300);
    }

    marks.forEach(function (el) {
      // Mouse: hover shows the popover (no click needed).
      el.addEventListener("pointerenter", function (e) {
        if (e.pointerType === "mouse") showPop(el);
      });
      el.addEventListener("pointerleave", function (e) {
        if (e.pointerType === "mouse") hidePop();
      });

      // Touch / pen: only a tap (click) opens the bottom sheet.
      el.addEventListener("click", function (e) {
        if (lastPointerType === "mouse") return; // desktop uses hover instead
        e.preventDefault();
        openSheet(el);
      });

      // Keyboard accessibility: Enter/Space opens the sheet.
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openSheet(el);
        }
      });
    });

    backdrop.addEventListener("click", closeSheet);

    // swipe-down to dismiss
    var startY = null;
    sheet.addEventListener(
      "touchstart",
      function (e) {
        startY = e.touches[0].clientY;
      },
      { passive: true }
    );
    sheet.addEventListener(
      "touchmove",
      function (e) {
        if (startY === null) return;
        var dy = e.touches[0].clientY - startY;
        if (dy > 60) {
          closeSheet();
          startY = null;
        }
      },
      { passive: true }
    );
  });
})();
