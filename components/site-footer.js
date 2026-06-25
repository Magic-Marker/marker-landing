(function () {
  function mountSiteFooter(target, options = {}) {
    if (!target) return;

    const {
      positionClass = 'relative',
      logoClass = 'mx-auto block w-[1370px] max-w-[96vw]',
      linksClass = 'mt-[35px] flex items-center justify-center gap-[30px] pb-[35px]'
    } = options;

    target.outerHTML = `
      <footer class="${positionClass}" data-site-footer-mounted>
        <img class="${logoClass}" src="images/marker-logo.svg" alt="" aria-hidden="true">
        <nav class="${linksClass} font-mono text-[11px] uppercase leading-[1.25] tracking-[1.1px]" aria-label="Footer">
          <a class="hover:underline hover:underline-offset-4" href="about.html">About</a>
          <a class="hover:underline hover:underline-offset-4" href="jobs/">Jobs</a>
          <a class="hover:underline hover:underline-offset-4" href="https://discord.com" rel="noopener">Discord</a>
          <a class="hover:underline hover:underline-offset-4" href="https://substack.com" rel="noopener">Substack</a>
        </nav>
      </footer>
    `;
  }

  window.MarkerSite = window.MarkerSite || {};
  window.MarkerSite.mountSiteFooter = mountSiteFooter;
})();
