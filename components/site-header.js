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
      ? `${buttonBase.replace(' hover:bg-ink/5', '')} bg-ink text-paperWarm hover:bg-ink`
      : `${buttonBase} bg-transparent text-ink`;

    const parent = target.parentNode;

    target.outerHTML = `
      <header class="${positionClass} z-30 h-[84px] w-full font-mono${difference}${textureClass}" style="position: fixed; left: 0; top: 0; width: 100%; height: 84px; z-index: 100;" data-site-header-mounted>
        <a class="site-header-pebbles" href="/" aria-label="Marker home">
          <img class="absolute left-[27px] top-[18px] block h-auto w-[38px]" src="images/pebbles-together.webp" alt="">
        </a>
        <a class="site-header-logo" href="/" aria-label="Marker home">
          <img class="absolute left-1/2 top-[24px] block h-auto w-[110px] -translate-x-1/2" src="images/marker-logo.svg" alt="Marker">
        </a>
        <nav class="site-header-nav absolute right-[27px] top-[22px] flex items-center gap-[16px]" aria-label="Primary">
          <a class="site-header-link site-header-login hidden h-[40px] items-center justify-center px-[10px] font-mono  text-[12px] opacity-70 hover:opacity-100 leading-[1.25]  text-ink/80 transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 md:inline-flex" href="https://my.marker.page">Login</a>
          <a class="${aboutClass} w-[82px]" href="about.html"${aboutModal ? ' data-open-about' : ''}>About</a>
          <div class="site-header-actions flex items-center gap-[10px]">
            <button class="${buttonBase} w-[168px] bg-transparent text-ink" type="button" data-focus-waitlist><span class="site-header-join-full">Join the waitlist</span><span class="site-header-join-short">Join</span></button>
            <a class="site-header-login relative inline-flex h-[40px] w-[40px] items-center justify-center rounded-[11px] text-ink transition-colors hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25" href="https://my.marker.page" aria-label="Log in to Marker">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              <span class="site-header-login-tip" aria-hidden="true">Log in to Marker</span>
            </a>
          </div>
        </nav>
      </header>
    `;

    const header = (parent || document).querySelector('[data-site-header-mounted]');
    if (header) attachLogoScroll(header);
  }

  function attachLogoScroll(header) {
    const fadeDistance = 84;
    const mobileFadeDistance = 120;
    let ticking = false;

    function render() {
      ticking = false;
      const y = Math.max(0, window.scrollY || window.pageYOffset || 0);
      const progress = Math.min(1, y / fadeDistance);
      header.style.setProperty('--logo-shift', `${-(progress * fadeDistance)}px`);
      header.style.setProperty('--logo-opacity', `${1 - progress}`);
      // Drives the mobile header: the logo + About link scroll up and fade out
      // while the Join chip stays pinned (see site-foundation mobile styles).
      header.style.setProperty('--header-progress', `${Math.min(1, y / mobileFadeDistance)}`);
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(render);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    render();
  }

  window.MarkerSite = window.MarkerSite || {};
  window.MarkerSite.mountSiteHeader = mountSiteHeader;
})();
