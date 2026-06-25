(function () {
  const fontStyles = `
    @font-face {
      font-family: 'PP Museum';
      src: url('fonts/museum.woff2') format('woff2'), url('fonts/museum.woff') format('woff');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: 'PP Museum';
      src: url('fonts/museum-light.woff2') format('woff2'), url('fonts/museum-light.woff') format('woff');
      font-weight: 300;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: 'PP Museum';
      src: url('fonts/PPMuseum-LightItalic.woff2') format('woff2'), url('fonts/PPMuseum-LightItalic.woff') format('woff');
      font-weight: 300;
      font-style: italic;
      font-display: swap;
    }

    @font-face {
      font-family: 'Graphik';
      src: url('fonts/graphik-regular-webfont.woff2') format('woff2'), url('fonts/graphik-regular-webfont.woff') format('woff');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: 'Graphik';
      src: url('fonts/graphik-regularitalic-webfont.woff2') format('woff2'), url('fonts/graphik-regularitalic-webfont.woff') format('woff');
      font-weight: 400;
      font-style: italic;
      font-display: swap;
    }

    @font-face {
      font-family: 'Graphik';
      src: url('fonts/graphik-semibold-webfont.woff2') format('woff2'), url('fonts/graphik-semibold-webfont.woff') format('woff');
      font-weight: 600;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: 'iA Writer Quattro';
      src: url('fonts/iAWriterQuattroS-Regular.woff2') format('woff2'), url('fonts/iAWriterQuattroS-Regular.woff') format('woff');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: 'iA Writer Quattro';
      src: url('fonts/iAWriterQuattroS-Bold.woff2') format('woff2'), url('fonts/iAWriterQuattroS-Bold.woff') format('woff');
      font-weight: 700;
      font-style: normal;
      font-display: swap;
    }

    .font-museum { font-family: 'PP Museum', Georgia, 'Times New Roman', serif; }
    .font-graphik { font-family: 'Graphik', Arial, Helvetica, sans-serif; }
    .font-mono { font-family: 'iA Writer Quattro', 'Courier New', monospace; }
    .bg-paper { background-color: #fbede2; }
    .bg-paperWarm { background-color: #fff7f1; }
    .bg-ink { background-color: #111111; }
    .bg-markerGreen { background-color: #8fa689; }
    .bg-markerRed { background-color: #994e41; }
    .bg-markerBlue { background-color: #a6bdd4; }
    .bg-markerYellow { background-color: #f4bb61; }
    .text-ink { color: #111111; }
    .text-paperWarm { color: #fff7f1; }
    .text-markerRed { color: #994e41; }
    .border-ink { border-color: #111111; }
    .border-paperWarm { border-color: #fff7f1; }
  `;

  function installSiteFoundation() {
    if (!document.querySelector('style[data-marker-fonts]')) {
      const style = document.createElement('style');
      style.dataset.markerFonts = 'true';
      style.textContent = fontStyles;
      document.head.append(style);
    }

    document.documentElement.classList.add('bg-paper', 'text-ink');
    document.body.classList.add('min-h-screen', 'overflow-x-hidden', 'bg-paper', 'bg-repeat', 'bg-top', 'text-ink', 'antialiased');
    document.body.style.backgroundColor = '#fbede2';
    document.body.style.backgroundImage = "url('images/bag.png')";
    document.body.style.backgroundPosition = 'center top';
    document.body.style.backgroundRepeat = 'repeat';
    document.body.style.backgroundSize = '1254px 1254px';
    document.body.style.color = '#111';
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.overflowX = 'hidden';
  }

  window.MarkerSite = window.MarkerSite || {};
  window.MarkerSite.installSiteFoundation = installSiteFoundation;
})();
