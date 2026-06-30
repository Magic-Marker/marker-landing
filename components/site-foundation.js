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
    .site-header-join-short { display: none; }
    .about-hero-copy p + p {
      margin-top: 10px;
      text-indent: 2.5em;
    }

    .marker-waitlist {
      max-width: 538px !important;
    }

    .marker-waitlist h2 {
      margin-bottom: 48px !important;
    }

    .marker-waitlist-form {
      position: relative !important;
      margin-top: 0 !important;
      height: 64px !important;
      align-items: flex-start !important;
      gap: 16px !important;
      border-bottom: 0 !important;
      padding-bottom: 0 !important;
      background: transparent !important;
    }

    .marker-waitlist-form::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 2px;
      background: #111111;
      opacity: 0.72;
      transform: rotate(-0.25deg);
      transform-origin: left center;
      box-shadow: 0 2px 0 rgba(17, 17, 17, 0.18);
      pointer-events: none;
    }

    .marker-waitlist-input {
      flex: 1 1 auto !important;
      height: 42px !important;
      padding: 0 14px !important;
      border-bottom: 0 !important;
      font-family: 'iA Writer Quattro', 'Courier New', monospace !important;
      font-size: 18px !important;
      line-height: 1.1 !important;
      color: #111111 !important;
    }

    .marker-waitlist-input::placeholder {
      color: #111111 !important;
      opacity: 1 !important;
    }

    .marker-waitlist-button {
      flex: 0 0 165px !important;
      width: 165px !important;
      height: 42px !important;
      border-width: 1.2px !important;
      font-size: 11px !important;
      letter-spacing: 1.1px !important;
    }

    [data-site-header-mounted] {
      position: fixed !important;
      left: 0 !important;
      top: 0 !important;
      width: 100% !important;
      height: 84px !important;
      z-index: 100 !important;
    }

    .site-header-textured {
      background-color: #fbede2;
      background-image: url('images/bag.png');
      background-position: center top;
      background-repeat: repeat;
      background-size: 1254px 1254px;
    }

    @media (min-width: 768px) {
      .writer-thinking-hero-image {
        padding-top: 20px;
        padding-bottom: 20px;
      }
    }

    @media (min-width: 768px) and (max-width: 1023px) {
      .essay-content-layout {
        width: 550px !important;
        max-width: calc(100vw - 48px) !important;
        justify-items: stretch !important;
      }

      .essay-sticky-rail {
        width: 100% !important;
        max-width: 550px !important;
      }

      .essay-content-article {
        width: 100% !important;
        max-width: 550px !important;
      }
    }

    @media (min-width: 1024px) {
      .essay-sticky-rail {
        position: sticky !important;
        top: 96px !important;
        align-self: start !important;
      }
    }

    @media (min-width: 768px) {
      [data-site-header-mounted] .site-header-link {
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(10px);
      }

      [data-site-header-mounted] .site-header-link:not(.text-paperWarm),
      [data-site-header-mounted] .site-header-link:not(.text-paperWarm):hover {
        background-color: transparent !important;
      }
    }

    .footer-spacer {
      margin-top: 180px !important;
    }

    @media (max-width: 900px) {
      .footer-spacer {
        margin-top: 420px !important;
      }
    }

    @media (max-width: 767px) {
      [data-site-header-mounted] {
        height: 104px !important;
      }

      .site-header-pebbles {
        display: none !important;
      }

      .site-header-logo {
        position: absolute !important;
        left: 50% !important;
        top: 28px !important;
        transform: translateX(-50%) !important;
      }

      .site-header-logo img {
        position: static !important;
        width: auto !important;
        height: 27px !important;
        transform: none !important;
      }

      .site-header-nav {
        position: absolute !important;
        left: 0 !important;
        right: 0 !important;
        top: 34px !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: flex-start !important;
        padding: 0 32px !important;
        pointer-events: none !important;
      }

      .site-header-link {
        position: relative !important;
        display: inline-flex !important;
        width: auto !important;
        height: auto !important;
        min-width: 0 !important;
        padding: 0 !important;
        border: 0 !important;
        border-radius: 0 !important;
        background: transparent !important;
        color: #111 !important;
        font-size: 14px !important;
        line-height: 1.25 !important;
        letter-spacing: 1.4px !important;
        pointer-events: auto !important;
      }

      .site-header-link::after {
        content: '';
        position: absolute;
        left: -3px;
        right: -3px;
        top: calc(100% + 4px);
        height: 3px;
        background-image: url("data:image/svg+xml,%3Csvg width='72' height='4' viewBox='0 0 72 4' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 2.4C7 1.1 11.8 2.8 17.9 1.8C24.4 0.7 29 2.9 35.7 1.9C42.2 1 48.1 2.7 54.7 1.8C60.8 1 65.2 2.1 71 1.6' stroke='%23111' stroke-width='1.4' stroke-linecap='round'/%3E%3C/svg%3E");
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100% 3px;
      }

      .site-header-join-full {
        display: none !important;
      }

      .site-header-join-short {
        display: inline !important;
      }

      .about-page-main {
        padding: 300px 30px 0 !important;
      }

      .about-hero {
        display: block !important;
        max-width: 500px !important;
      }

      .about-hero-title {
        margin: 0 auto !important;
        max-width: 500px !important;
        text-align: center !important;
        font-size: 30px !important;
        line-height: 1.2 !important;
      }

      .about-hero-copy {
        margin-top: 190px !important;
        padding-top: 0 !important;
        font-size: 16px !important;
        line-height: 1.38 !important;
        letter-spacing: 0.32px !important;
      }

      .about-hero-copy p + p {
        margin-top: 10px !important;
        text-indent: 2.5em !important;
      }

      .about-learn-more {
        display: block !important;
        margin-top: 78px !important;
        max-width: 500px !important;
      }

      .about-learn-more-label {
        font-size: 14px !important;
        line-height: 1.25 !important;
        letter-spacing: 1.4px !important;
      }

      .about-learn-more-title {
        margin-top: 28px !important;
        text-align: center !important;
        font-size: 30px !important;
        line-height: 1.2 !important;
      }

      .about-learn-more-list {
        margin-top: 62px !important;
        padding-top: 0 !important;
      }

      .about-question {
        padding-top: 26px !important;
      }

      .about-question + .about-question {
        margin-top: 26px !important;
      }

      .about-question h3 {
        font-size: 24px !important;
        line-height: 1.2 !important;
      }

      .about-question p {
        margin-top: 12px !important;
        max-width: none !important;
        font-size: 16px !important;
        line-height: 1.38 !important;
        letter-spacing: 0.32px !important;
      }

      .marker-waitlist {
        max-width: 340px !important;
      }

      .marker-waitlist h2 {
        font-size: 24px !important;
        line-height: 1.2 !important;
        margin-bottom: 40px !important;
      }

      .marker-waitlist-form {
        margin-top: 0 !important;
        display: flex !important;
        height: auto !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 28px !important;
        border-bottom: 0 !important;
        padding-bottom: 0 !important;
      }

      .marker-waitlist-form::after {
        top: 31px;
        bottom: auto;
        background: #111111;
      }

      .marker-waitlist-input {
        width: 340px !important;
        height: 31px !important;
        flex: none !important;
        padding: 0 8px 10px !important;
        border-bottom: 0 !important;
        color: #111111 !important;
        text-align: center !important;
        font-size: 16px !important;
        line-height: 1.3 !important;
      }

      .marker-waitlist-button {
        width: 214px !important;
        height: 43px !important;
        font-size: 14px !important;
        letter-spacing: 1.4px !important;
      }

      [data-about-carousel],
      [data-essay-carousel] {
        padding-left: 30px !important;
      }

      [data-essay-carousel-mounted] {
        touch-action: pan-y !important;
      }

      [data-essay-carousel-mounted] [data-essay-track] {
        cursor: grab;
        gap: 14px !important;
        user-select: none;
      }

      [data-essay-carousel-mounted] [data-essay-track]:active {
        cursor: grabbing;
      }

      [data-essay-carousel-mounted] [data-essay-prev],
      [data-essay-carousel-mounted] [data-essay-next] {
        display: none !important;
      }

      [data-essay-card] {
        width: 280px !important;
        height: 432px !important;
        border-radius: 6.6px !important;
      }

      .essay-card-bg,
      .essay-card-texture {
        top: 0 !important;
        border-radius: 6.6px !important;
      }

      .essay-card-texture {
        background-size: 520px 520px !important;
        opacity: 0.05 !important;
      }

      .essay-card-image {
        left: 60px !important;
        top: 42px !important;
        width: 159px !important;
        height: 177px !important;
        border-width: 4.8px !important;
      }

      .essay-card-title {
        top: 289px !important;
        width: 232px !important;
        font-size: 24px !important;
        line-height: 1.2 !important;
      }

      .essay-card-excerpt {
        top: 311px !important;
        width: 232px !important;
        height: auto !important;
        font-size: 13px !important;
        line-height: 1.25 !important;
      }

      .essay-card-cta {
        left: 50% !important;
        top: 369px !important;
        width: 130px !important;
        height: 43px !important;
        transform: translateX(-50%) !important;
        padding: 0 18px !important;
        font-size: 14px !important;
        letter-spacing: 1.4px !important;
      }

      .footer-spacer {
        margin-top: 150px !important;
      }

      [data-site-footer-mounted] img {
        width: 378px !important;
        max-width: none !important;
      }

      [data-site-footer-mounted] nav {
        margin-top: 20px !important;
        gap: 30px !important;
        padding-bottom: 35px !important;
        font-size: 12px !important;
        letter-spacing: 1.2px !important;
      }

      [data-site-footer-mounted] nav a:first-child {
        display: none !important;
      }
    }
  `;

  function installSiteFoundation() {
    if (!document.querySelector('style[data-marker-fonts]')) {
      const style = document.createElement('style');
      style.dataset.markerFonts = 'true';
      style.textContent = fontStyles;
      document.head.append(style);
    }

    document.documentElement.classList.add('text-ink');
    document.body.classList.add('min-h-screen', 'overflow-x-clip', 'bg-paper', 'bg-repeat', 'bg-top', 'text-ink', 'antialiased');
    document.body.style.backgroundColor = '#fbede2';
    document.body.style.backgroundImage = "url('images/bag.png')";
    document.body.style.backgroundPosition = 'center top';
    document.body.style.backgroundRepeat = 'repeat';
    document.body.style.backgroundSize = '1254px 1254px';
    document.body.style.color = '#111';
    document.documentElement.style.overflowX = 'clip';
    document.body.style.overflowX = 'clip';
  }

  window.MarkerSite = window.MarkerSite || {};
  window.MarkerSite.installSiteFoundation = installSiteFoundation;
})();
