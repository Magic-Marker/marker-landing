(function () {
  const USERLIST_FORM_URL = 'https://forms.userlist.com/5444a4a9-ad95-4e2a-87b2-090ce86aa9cd/submissions';
  const USERLIST_WORKER_URL = 'https://userlist-proxy.marker-276.workers.dev';

  function waitlistMarkup() {
    return `
      <div class="fixed inset-0 z-[120] flex items-center justify-center bg-[#efeae7]/90 opacity-0 backdrop-blur-[9px] transition-opacity duration-200 pointer-events-none" id="followup-modal">
        <div class="relative max-h-[85vh] w-[520px] max-w-[90vw] overflow-y-auto rounded-[16px] border border-ink/30 bg-paperWarm px-[36px] py-[40px] font-museum text-ink transition-transform duration-200 translate-y-[18px]" data-followup-dialog>
          <button class="absolute right-[18px] top-[14px] border-0 bg-transparent text-[28px] leading-none text-black/50" type="button" id="followup-close">&times;</button>
          <h2 class="mb-[12px] text-[32px] leading-[1.1]" id="followup-title">You're on the list!</h2>
          <p class="mb-[18px] font-graphik text-[16px] leading-[1.45]" id="followup-subtitle">These questions are optional, but they help us prioritise the waitlist. Email us at <a class="text-markerRed underline" href="mailto:hi@marker.page">hi@marker.page</a> if you are desperate though.</p>
          <form id="followup-form">
            <div class="mb-[24px]">
              <label class="mb-[8px] block text-[15px] leading-[1.3]" for="field_name">What is your name?</label>
              <input class="w-full rounded-[8px] border border-ink/30 bg-white px-[12px] py-[10px] font-graphik text-[14px] outline-none" type="text" id="field_name" placeholder="Your name">
            </div>
            <div class="mb-[24px]">
              <label class="mb-[8px] block text-[15px] leading-[1.3]">What are you writing?</label>
              <div class="flex flex-col gap-[10px] font-graphik text-[14px] leading-[1.35]">
                <label class="flex cursor-pointer items-start gap-[10px]"><input class="mt-[2px]" type="checkbox" name="writing" value="Newsletter or blog"> Newsletter or blog (Substack and beyond)</label>
                <label class="flex cursor-pointer items-start gap-[10px]"><input class="mt-[2px]" type="checkbox" name="writing" value="Journalism and non-fiction"> Journalism, non-fiction, personal essays</label>
                <label class="flex cursor-pointer items-start gap-[10px]"><input class="mt-[2px]" type="checkbox" name="writing" value="Creative writing"> Creative writing (novels, scripts, short stories)</label>
                <label class="flex cursor-pointer items-start gap-[10px]"><input class="mt-[2px]" type="checkbox" name="writing" value="Work writing"> Work writing (comms, PR, memos, grants)</label>
                <label class="flex cursor-pointer items-start gap-[10px]"><input class="mt-[2px]" type="checkbox" name="writing" value="Academic"> Academic papers or assignments</label>
              </div>
            </div>
            <div class="mb-[24px]">
              <label class="mb-[8px] block text-[15px] leading-[1.3]" for="field_secret_code">Do you have a secret code?</label>
              <input class="w-full rounded-[8px] border border-ink/30 bg-white px-[12px] py-[10px] font-graphik text-[14px] outline-none" type="text" id="field_secret_code" placeholder="Enter your code">
            </div>
            <button class="h-[44px] w-full rounded-[11px] border border-ink bg-ink font-mono text-[11px] uppercase tracking-[1.1px] text-paperWarm disabled:cursor-not-allowed disabled:opacity-60" type="submit">Submit</button>
          </form>
          <div class="hidden py-[22px] text-center" id="followup-thankyou">
            <h3 class="mb-[12px] text-[28px]">Thanks!</h3>
            <p class="font-graphik text-[16px] leading-[1.45]">You're all signed up. We'll be in touch.</p>
          </div>
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
    const followupForm = document.getElementById('followup-form');
    const thankyou = document.getElementById('followup-thankyou');
    const dialog = overlay?.querySelector('[data-followup-dialog]');
    let storedEmail = '';

    if (!form || !emailInput || !overlay || !closeButton || !followupForm || !thankyou) return;

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
        storedEmail = email;
        emailInput.value = '';
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        followupForm.style.display = '';
        thankyou.classList.add('hidden');
        document.getElementById('followup-title').style.display = '';
        document.getElementById('followup-subtitle').style.display = '';
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

    followupForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submitButton = followupForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = '...';

      const secretCode = document.getElementById('field_secret_code').value.trim();
      const name = document.getElementById('field_name').value.trim();
      const checkedBoxes = followupForm.querySelectorAll('input[name="writing"]:checked');
      const writingValues = Array.from(checkedBoxes).map((checkbox) => checkbox.value).join(', ');
      const nameParts = name.split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      const properties = {};
      if (secretCode) properties.secret_code = secretCode;
      if (writingValues) properties.writing_question = writingValues;
      if (firstName) properties.firstname = firstName;
      if (lastName) properties.lastname = lastName;

      try {
        const res = await fetch(USERLIST_WORKER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: storedEmail, properties })
        });
        if (!res.ok) throw new Error('Submission failed');
        followupForm.style.display = 'none';
        document.getElementById('followup-title').style.display = 'none';
        document.getElementById('followup-subtitle').style.display = 'none';
        thankyou.classList.remove('hidden');
        window.setTimeout(closeOverlay, 5000);
      } catch (error) {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        alert('Something went wrong. Please try again.');
      }
    });
  }

  window.MarkerSite = window.MarkerSite || {};
  window.MarkerSite.mountWaitlistModal = mountWaitlistModal;
  window.MarkerSite.initWaitlist = initWaitlist;
})();
