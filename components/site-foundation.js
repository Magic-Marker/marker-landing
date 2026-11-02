(function () {
  // Styling lives in styles.tailwind.css; this only adds the rough lines.
  function installSiteFoundation() {
    injectRoughLines();
  }

  const SVG_NS = 'http://www.w3.org/2000/svg';

  // The exported Figma rough line uses an feTurbulence + feDisplacementMap
  // filter. Rendered as a CSS background-image it rasterises to a low-res
  // bitmap (pixelated); rendered as a live inline <svg> the browser applies
  // the filter at full device resolution, so it stays crisp and subtle.
  function ensureRoughLineFilter() {
    if (document.getElementById('marker-rough-line-filter')) return;
    const defs = document.createElementNS(SVG_NS, 'svg');
    defs.setAttribute('aria-hidden', 'true');
    defs.setAttribute('width', '0');
    defs.setAttribute('height', '0');
    defs.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;';
    defs.innerHTML =
      "<defs><filter id='marker-rough-line-filter' x='0' y='0' width='753' height='12' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'>" +
      "<feFlood flood-opacity='0' result='BackgroundImageFix'/>" +
      "<feBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape'/>" +
      "<feTurbulence type='fractalNoise' baseFrequency='0.04237288236618042 0.04237288236618042' numOctaves='3' seed='7255'/>" +
      "<feDisplacementMap in='shape' scale='2.7999999523162842' xChannelSelector='R' yChannelSelector='G' result='displacedImage'/>" +
      "<feMerge><feMergeNode in='displacedImage'/></feMerge>" +
      "</filter></defs>";
    document.body.appendChild(defs);
  }

  function makeRoughLine() {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'marker-rough-line');
    svg.setAttribute('viewBox', '0 0 753 12');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    svg.dataset.roughLine = 'true';
    svg.innerHTML = "<line x1='1.4' y1='6' x2='751.4' y2='6' stroke='black' filter='url(#marker-rough-line-filter)'/>";
    return svg;
  }

  // Adds the crisp inline rough line to each waitlist form (as the underline)
  // and to each About FAQ item (as the divider above the question). Safe to
  // call repeatedly - it skips elements that already have a line.
  function injectRoughLines(root) {
    const scope = root || document;
    const forms = scope.querySelectorAll('.signup-form, .m-signup-form, .marker-waitlist-form');
    if (!forms.length && !scope.querySelector('.about-question')) return;
    ensureRoughLineFilter();
    forms.forEach((form) => {
      if (form.querySelector(':scope > [data-rough-line]')) return;
      form.appendChild(makeRoughLine());
    });
    scope.querySelectorAll('.about-question').forEach((question) => {
      if (question.querySelector(':scope > [data-rough-line]')) return;
      question.insertBefore(makeRoughLine(), question.firstChild);
    });
  }

  window.MarkerSite = window.MarkerSite || {};
  window.MarkerSite.installSiteFoundation = installSiteFoundation;
  window.MarkerSite.injectRoughLines = injectRoughLines;
})();
