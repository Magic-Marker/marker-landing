/*
 * Marker highlights — reusable across the site.
 *
 * Usage: wrap any text in a span with a note. Optional attributes let you set
 * the person's name (headline), avatar image, and which Marker tool to show:
 *   <span
 *     data-card-text="I love this phrase because..."
 *     data-card-img="images/ryan.png"
 *     data-card-name="Ryan"
 *     data-card-tool="editor">text</span>
 * Then include this script once: <script src="highlights.js"></script>
 *
 * data-card-name is optional: when absent (or empty) the headline shows no
 * name ("How Marker helped"); supply data-card-name="Ryan" to include one.
 * data-card-tool defaults to "editor". Available tools: editor, self-notes,
 * materials, observations, reverse-outline, super-thesaurus, namer (see TOOLS).
 *
 * Desktop (hover-capable pointers): the card appears on hover.
 * Mobile / touch: tapping opens a slide-up sheet; tap the backdrop to close.
 * No CSS file needed — everything is styled with Tailwind utility classes.
 */
(function () {
  "use strict";

  /*
   * The six Marker tools that can appear at the bottom of a highlight card.
   * `dot` is the colour of the icon dot (a yellow dot in the design); swap for
   * a real per-tool icon later if needed.
   */
  var TOOLS = {
    editor: {
      name: "Editor",
      desc: "Your first reader - work through a passage together or do quick research and much more.",
      dot: "bg-markerYellow"
    },
    "self-notes": {
      name: "Self-notes",
      desc: "Capture asides, reminders and stray thoughts alongside your draft without cluttering the page.",
      dot: "bg-markerYellow",
      icon: '<svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.4102 1.49021L7.78671 11.489C7.40918 12.1602 6.44642 12.1707 6.05437 11.5078L0.140795 1.50906C-0.253459 0.842452 0.227053 1.22578e-06 1.00152 1.15807e-06L12.5386 1.49469e-07C13.3034 8.26079e-08 13.7851 0.823603 13.4102 1.49021Z" fill="#8C8C8C"/></svg>'
    },
    materials: {
      name: "Materials",
      desc: "Keep your sources, references and research in one place, ready to pull into your writing.",
      dot: "bg-markerYellow",
      icon: '<svg width="25" height="19" viewBox="0 0 25 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.838116 16.6348L6.46158 6.63602C6.83911 5.96476 7.80187 5.95428 8.19392 6.61717L14.1075 16.6159C14.5017 17.2825 14.0212 18.125 13.2468 18.125H1.70972C0.944924 18.125 0.463207 17.3014 0.838116 16.6348Z" fill="#8FA689"/><path d="M24.1459 6.32443C24.6552 7.0254 24.6552 7.9746 24.1459 8.67557L20.6717 13.4574C20.1624 14.1583 19.2597 14.4516 18.4357 14.1839L12.8143 12.3574C11.9903 12.0897 11.4324 11.3218 11.4324 10.4553V4.5447C11.4324 3.67824 11.9903 2.91033 12.8143 2.64258L18.4357 0.816104C19.2597 0.548355 20.1624 0.841671 20.6717 1.54265L24.1459 6.32443Z" fill="#A8C5E8"/></svg>'
    },
    observations: {
      name: "Observations",
      desc: "Surface patterns and notes about your draft so you can see what you're really saying.",
      dot: "bg-markerYellow"
    },
    "reverse-outline": {
      name: "Reverse Outline",
      desc: "Work backwards from your draft to map its structure and spot what's missing.",
      dot: "bg-markerYellow",
      icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="7.65674" y="-0.828369" width="12" height="12" rx="2" transform="rotate(45 7.65674 -0.828369)" fill="#8B6B85"/></svg>'
    },
    "super-thesaurus": {
      name: "Super-Thesaurus",
      desc: "Find sharper words and phrasings in context, without losing your own voice.",
      dot: "bg-markerYellow"
    },
    namer: {
      name: "XXX",
      desc: "Leave a placeholder, Marker will do the research and find the answer",
      dot: "bg-markerYellow",
      icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="4.41421" y1="3" x2="13.7056" y2="12.2914" stroke="#A8C5E8" stroke-width="2" stroke-linecap="round"/><line x1="1" y1="-1" x2="14.14" y2="-1" transform="matrix(-0.707107 0.707107 0.707107 0.707107 14.7056 3)" stroke="#A8C5E8" stroke-width="2" stroke-linecap="round"/><line x1="8.57007" y1="1" x2="8.57007" y2="14.14" stroke="#A8C5E8" stroke-width="2" stroke-linecap="round"/><line x1="1" y1="-1" x2="13.14" y2="-1" transform="matrix(-1 0 0 1 15.8472 8.2771)" stroke="#A8C5E8" stroke-width="2" stroke-linecap="round"/></svg>'
    },
    "writers-conference": {
      name: "Writer's Conference",
      desc: "Work through your thinking before you write - clarify your angle, structure and what you're really trying to say.",
      dot: "bg-markerYellow",
      icon: '<svg width="25" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="14" r="10" fill="#8FA689"/><path d="M25 27.3333C25 27.5101 24.9311 27.6797 24.8085 27.8047C24.6859 27.9298 24.5196 28 24.3462 28H21.7308C20.6496 27.9995 19.5895 27.6953 18.6667 27.1208C17.744 26.5463 16.9943 25.7237 16.5 24.7433C16.0057 25.7237 15.256 26.5463 14.3333 27.1208C13.4105 27.6953 12.3504 27.9995 11.2692 28H8.65385C8.48044 28 8.31413 27.9298 8.19151 27.8047C8.06889 27.6797 8 27.5101 8 27.3333C8 27.1565 8.06889 26.987 8.19151 26.8619C8.31413 26.7369 8.48044 26.6667 8.65385 26.6667H11.2692C12.4831 26.6667 13.6473 26.175 14.5056 25.2998C15.3639 24.4247 15.8462 23.2377 15.8462 22V14.6667H12.5769C12.4035 14.6667 12.2372 14.5964 12.1146 14.4714C11.992 14.3464 11.9231 14.1768 11.9231 14C11.9231 13.8232 11.992 13.6536 12.1146 13.5286C12.2372 13.4036 12.4035 13.3333 12.5769 13.3333H15.8462V6C15.8462 4.76232 15.3639 3.57534 14.5056 2.70017C13.6473 1.825 12.4831 1.33333 11.2692 1.33333H8.65385C8.48044 1.33333 8.31413 1.2631 8.19151 1.13807C8.06889 1.01305 8 0.843478 8 0.666667C8 0.489856 8.06889 0.320287 8.19151 0.195262C8.31413 0.070238 8.48044 0 8.65385 0H11.2692C12.3504 0.00051111 13.4105 0.304708 14.3333 0.879201C15.256 1.4537 16.0057 2.27628 16.5 3.25667C16.9943 2.27628 17.744 1.4537 18.6667 0.879201C19.5895 0.304708 20.6496 0.00051111 21.7308 0H24.3462C24.5196 0 24.6859 0.070238 24.8085 0.195262C24.9311 0.320287 25 0.489856 25 0.666667C25 0.843478 24.9311 1.01305 24.8085 1.13807C24.6859 1.2631 24.5196 1.33333 24.3462 1.33333H21.7308C20.5169 1.33333 19.3527 1.825 18.4944 2.70017C17.6361 3.57534 17.1538 4.76232 17.1538 6V13.3333H20.4231C20.5965 13.3333 20.7628 13.4036 20.8854 13.5286C21.008 13.6536 21.0769 13.8232 21.0769 14C21.0769 14.1768 21.008 14.3464 20.8854 14.4714C20.7628 14.5964 20.5965 14.6667 20.4231 14.6667H17.1538V22C17.1538 23.2377 17.6361 24.4247 18.4944 25.2998C19.3527 26.175 20.5169 26.6667 21.7308 26.6667H24.3462C24.5196 26.6667 24.6859 26.7369 24.8085 26.8619C24.9311 26.987 25 27.1565 25 27.3333Z" fill="black"/></svg>'
    },
    collaboration: {
      name: "Collaboration",
      desc: "A suite of novel features built to help writers work together, keeping ideas - not just comments - at the centre.",
      dot: "bg-markerYellow",
      icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.7452 7.87024C15.747 8.10096 15.6769 8.3265 15.5446 8.51552C15.4123 8.70453 15.2243 8.84763 15.007 8.92492L10.5463 10.547L8.92492 15.007C8.84501 15.2223 8.70112 15.4079 8.51258 15.5391C8.32404 15.6702 8.09989 15.7405 7.87024 15.7405C7.64058 15.7405 7.41643 15.6702 7.22789 15.5391C7.03936 15.4079 6.89546 15.2223 6.81555 15.007L5.19414 10.5463L0.733517 8.92492C0.518218 8.84501 0.332533 8.70112 0.201408 8.51258C0.0702834 8.32404 0 8.09989 0 7.87024C0 7.64058 0.0702834 7.41643 0.201408 7.2279C0.332533 7.03936 0.518218 6.89546 0.733517 6.81555L5.19414 5.19414L6.81555 0.733517C6.89546 0.518218 7.03936 0.332533 7.22789 0.201408C7.41643 0.0702834 7.64058 0 7.87024 0C8.09989 0 8.32404 0.0702834 8.51258 0.201408C8.70112 0.332533 8.84501 0.518218 8.92492 0.733517L10.547 5.19414L15.007 6.81555C15.2243 6.89284 15.4123 7.03594 15.5446 7.22496C15.6769 7.41398 15.747 7.63952 15.7452 7.87024Z" fill="#994E41"/></svg>'
    }
  };

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

    function makeEl(tag, classes, text) {
      var el = document.createElement(tag);
      if (classes) addClasses(el, classes);
      if (text != null) el.textContent = text;
      return el;
    }

    /*
     * Builds the full highlight card content into `container`. The container
     * itself supplies the warm card styling (bg, padding, rounding); this fills
     * it with the avatar, headline, quote and the Marker tool block.
     */
    function buildCardInner(container, data) {
      container.innerHTML = "";

      if (data.img) {
        var image = document.createElement("img");
        image.src = data.img;
        image.alt = "";
        addClasses(
          image,
          "absolute -top-[6px] -right-[8px] w-[39px] h-[39px] rounded-full object-cover border border-paperWarm shrink-0 select-none pointer-events-none"
        );
        container.appendChild(image);
      }

      var col = makeEl("div", "flex flex-col gap-[14px] w-full");

      var head = makeEl("div", "flex flex-col gap-[8px] w-full");
      head.appendChild(
        makeEl(
          "p",
          "font-museum text-[20px] leading-[1.3] text-ink pr-[36px]",
          data.name ? "How Marker helped " + data.name : "How Marker helped"
        )
      );
      head.appendChild(
        makeEl(
          "p",
          "font-graphik text-[14px] leading-[1.3] text-ink",
          "\u201C" + data.text + "\u201D"
        )
      );
      col.appendChild(head);

      var toolCard = makeEl(
        "div",
        "flex flex-col gap-[4px] w-full bg-white rounded-[6px] pt-[9px] pb-[8px] pl-[10px] pr-[8px]"
      );
      toolCard.appendChild(
        makeEl(
          "p",
          "font-graphik text-[9px] leading-[1.3] tracking-[0.06em] text-markerRed",
          "MARKER TOOL"
        )
      );
      var toolRow = makeEl("div", "flex items-center gap-[5px]");
      var icon;
      if (data.tool.icon) {
        icon = makeEl(
          "span",
          "inline-flex items-center justify-center w-[16px] h-[16px] shrink-0 [&>svg]:block [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto"
        );
        icon.innerHTML = data.tool.icon;
      } else {
        icon = makeEl(
          "span",
          "block w-[11px] h-[11px] rounded-full shrink-0 " + data.tool.dot
        );
      }
      toolRow.appendChild(icon);
      toolRow.appendChild(
        makeEl(
          "p",
          "font-graphik font-semibold text-[14px] leading-[1.3] text-ink",
          data.tool.name
        )
      );
      toolCard.appendChild(toolRow);
      toolCard.appendChild(
        makeEl(
          "p",
          "font-graphik text-[10px] leading-[1.3] text-ink",
          data.tool.desc
        )
      );
      col.appendChild(toolCard);

      container.appendChild(col);
    }

    function cardData(el) {
      var toolKey = (el.getAttribute("data-card-tool") || "editor").toLowerCase();
      // No name by default; the headline drops the name unless data-card-name
      // is supplied (e.g. data-card-name="Ryan").
      return {
        img: el.getAttribute("data-card-img"),
        name: (el.getAttribute("data-card-name") || "").trim(),
        text: el.getAttribute("data-card-text"),
        tool: TOOLS[toolKey] || TOOLS.editor
      };
    }

    /* ---------- style the highlighted spans ---------- */
    marks.forEach(function (el) {
      addClasses(
        el,
        "bg-[rgba(244,187,97,0.4)] hover:bg-[rgba(244,187,97,0.55)] rounded-[5px] px-[3px] py-0 pb-px cursor-pointer transition-colors duration-150 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
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
      "fixed z-[120] w-[300px] max-w-[calc(100vw-24px)] opacity-0 invisible transition-opacity duration-150 ease-out pointer-events-none"
    );
    var popCard = document.createElement("div");
    addClasses(
      popCard,
      "relative bg-paperWarm rounded-[6px] pt-[14px] pb-[17px] px-[16px] shadow-[0_3px_12px_rgba(0,0,0,0.10)]"
    );
    pop.appendChild(popCard);
    document.body.appendChild(pop);

    var hideTimer = null;

    function showPop(el) {
      if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
      buildCardInner(popCard, cardData(el));
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
      "rounded-t-[20px] px-[16px] pt-[12px] pb-[24px] max-w-[560px] mx-auto"
    );
    var handle = document.createElement("div");
    addClasses(handle, "w-[40px] h-[4px] rounded-full bg-[#d9d2cb] mx-auto mb-[18px]");
    var sheetBody = document.createElement("div");
    addClasses(
      sheetBody,
      "relative bg-paperWarm rounded-[6px] pt-[14px] pb-[17px] px-[16px] shadow-[0_-6px_24px_rgba(0,0,0,0.14)]"
    );
    sheetCard.appendChild(handle);
    sheetCard.appendChild(sheetBody);
    sheet.appendChild(sheetCard);

    document.body.appendChild(backdrop);
    document.body.appendChild(sheet);

    function openSheet(el) {
      buildCardInner(sheetBody, cardData(el));
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
