(function () {
  function mountSiteHeader(target, options = {}) {
    if (!target) return;

    const {
      active = '',
      positionClass = 'fixed left-0 top-0',
      blend = false,
      aboutModal = false,
      texture = false
    } = options;

    const difference = blend ? ' mix-blend-difference' : '';
    const textureClass = texture ? ' site-header-textured' : '';
    const aboutActive = active === 'about';
    const buttonBase = 'site-header-link inline-flex h-[40px] items-center justify-center rounded-[11px] border border-ink px-[16px] font-mono text-[11px] uppercase leading-[1.25] tracking-[1.1px] transition-colors hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25';
    const aboutClass = aboutActive
      ? `${buttonBase} bg-ink text-paperWarm hover:bg-ink`
      : `${buttonBase} bg-transparent text-ink`;

    target.outerHTML = `
      <header class="${positionClass} z-30 h-[84px] w-full font-mono${difference}${textureClass}" style="position: fixed; left: 0; top: 0; width: 100%; height: 84px; z-index: 100;" data-site-header-mounted>
        <a class="site-header-pebbles" href="landing-figma-preview.html" aria-label="Marker home">
          <img class="absolute left-[27px] top-[18px] block h-auto w-[38px]" src="images/pebbles-together.png" alt="">
        </a>
        <a class="site-header-logo" href="landing-figma-preview.html" aria-label="Marker home">
          <img class="absolute left-1/2 top-[24px] block h-auto w-[110px] -translate-x-1/2" src="images/marker-logo.svg" alt="Marker">
        </a>
        <nav class="site-header-nav absolute right-[27px] top-[22px] flex items-center gap-[16px]" aria-label="Primary">
          <a class="${aboutClass} w-[82px]" href="about.html"${aboutModal ? ' data-open-about' : ''}>About</a>
          <button class="${buttonBase} w-[168px] bg-transparent text-ink" type="button" data-focus-waitlist><span class="site-header-join-full">Join the waitlist</span><span class="site-header-join-short">Join</span></button>
        </nav>
      </header>
    `;
  }

  window.MarkerSite = window.MarkerSite || {};
  window.MarkerSite.mountSiteHeader = mountSiteHeader;
})();
