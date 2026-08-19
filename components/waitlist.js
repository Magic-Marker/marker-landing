(function () {
  const USERLIST_FORM_URL = 'https://forms.userlist.com/5444a4a9-ad95-4e2a-87b2-090ce86aa9cd/submissions';

  function waitlistMarkup() {
    return `
      <div class="fixed inset-0 z-[120] flex items-center justify-center bg-[#efeae7]/90 opacity-0 backdrop-blur-[9px] transition-opacity duration-200 pointer-events-none" id="followup-modal">
        <div class="relative max-h-[85vh] w-[520px] max-w-[90vw] overflow-y-auto rounded-[16px] border border-ink/30 bg-paperWarm px-[36px] py-[40px] font-museum text-ink transition-transform duration-200 translate-y-[18px]" data-followup-dialog>
          <button class="absolute right-[18px] top-[14px] border-0 bg-transparent text-[28px] leading-none text-black/50" type="button" id="followup-close">&times;</button>
          <h2 class="mb-[12px] text-[32px] leading-[1.1]">You're on the list!</h2>
          <p class="mb-[7px] font-graphik text-[16px] leading-[1.45]">You're all signed up. We'll be in touch. Email us at <a class="text-markerRed underline" href="mailto:hi@marker.page">hi@marker.page</a> if you are desperate though.</p>
        </div>
      </div>
    `;
  }

  function mountWaitlistModal(target = document.body) {
    if (document.getElementById('followup-modal')) return;
    target.insertAdjacentHTML('beforeend', waitlistMarkup());
  }

  function initWaitlist({ formSelector = '[data-waitlist-form]', emailSelector = '[data-waitlist-email]' } = {}) {
    const form = document.querySelector(formSelector);
    const emailInput = document.querySelector(emailSelector);
    const overlay = document.getElementById('followup-modal');
    const closeButton = document.getElementById('followup-close');
    const dialog = overlay?.querySelector('[data-followup-dialog]');

    if (!form || !emailInput || !overlay || !closeButton) return;

    function openOverlay() {
      overlay.classList.remove('pointer-events-none', 'opacity-0');
      dialog?.classList.remove('translate-y-[18px]');
    }

    function closeOverlay() {
      overlay.classList.add('opacity-0', 'pointer-events-none');
      dialog?.classList.add('translate-y-[18px]');
    }

    document.querySelectorAll('[data-focus-waitlist]').forEach((button) => {
      button.addEventListener('click', () => {
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        window.setTimeout(() => emailInput.focus(), 450);
      });
    });

    closeButton.addEventListener('click', closeOverlay);
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) closeOverlay();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeOverlay();
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!emailInput.checkValidity()) {
        emailInput.reportValidity();
        return;
      }

      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = '...';

      const email = emailInput.value.trim();
      const formData = new FormData();
      formData.append('fields[email]', email);

      try {
        const res = await fetch(USERLIST_FORM_URL, { method: 'POST', body: formData });
        if (!res.ok) throw new Error('Submission failed');
        emailInput.value = '';
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        openOverlay();
      } catch (error) {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        const errorEl = document.createElement('div');
        errorEl.className = 'mt-[12px] font-mono text-[10px] uppercase tracking-[0.6px] text-markerRed';
        errorEl.textContent = 'Something went wrong. Please try again.';
        form.insertAdjacentElement('afterend', errorEl);
        window.setTimeout(() => errorEl.remove(), 4000);
      }
    });
  }

  window.MarkerSite = window.MarkerSite || {};
  window.MarkerSite.mountWaitlistModal = mountWaitlistModal;
  window.MarkerSite.initWaitlist = initWaitlist;
})();
