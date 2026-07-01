(function () {
  function getEssays() {
    return window.MarkerEssays || [];
  }

  function renderBaseCard(essay, index, total) {
    return `
      <a href="${essay.href}" class="group relative block h-[648px] w-[436px] shrink-0 overflow-hidden rounded-[11px]" data-essay-card>
        <div class="essay-card-bg absolute inset-x-0 bottom-0 top-[45px] rounded-[11px] transition-[filter] duration-300 ease-out group-hover:brightness-[0.95] ${essay.color}"></div>
        <div class="essay-card-texture absolute inset-x-0 bottom-0 top-[45px] rounded-[11px] bg-[url('images/bag.webp')] bg-[length:720px_720px] bg-bottom opacity-[0.08] mix-blend-multiply"></div>
        <div class="essay-card-image absolute left-[85px] top-[104px] flex h-[320px] w-[265px] items-center justify-center">
          <img class="block max-h-full max-w-full object-contain" src="${essay.image}" alt="">
        </div>
        <div class="essay-card-title absolute left-1/2 top-[492px] flex w-[350px] -translate-x-1/2 -translate-y-full flex-col justify-end text-center font-museum text-[26px] leading-[1.3] ${essay.text}">
          ${essay.title}
        </div>
        <p class="essay-card-excerpt absolute left-1/2 top-[499px] h-[30px] w-[350px] -translate-x-1/2 text-center font-graphik text-[12px] leading-[1.25] ${essay.text}">
          ${essay.excerpt}
        </p>
        <span class="essay-card-cta absolute left-[165px] top-[552px] inline-flex h-[40px] items-center justify-center rounded-[11px] border px-[16px] font-mono text-[11px] uppercase leading-[1.25] tracking-[1.1px] ${essay.text} ${essay.text === 'text-paperWarm' ? 'border-paperWarm' : 'border-ink'}">
          Read more
        </span>
        <span class="sr-only">Essay ${index + 1} of ${total}</span>
      </a>
    `;
  }

  function renderCard(essay, index, total, scale) {
    const card = renderBaseCard(essay, index, total);
    if (scale === 1) return card;

    return `
      <div class="relative shrink-0" style="width:${436 * scale}px;height:${648 * scale}px">
        <div class="absolute left-0 top-0 h-[648px] w-[436px]" style="transform:scale(${scale});transform-origin:top left">
          ${card}
        </div>
      </div>
    `;
  }

  function mountEssayCarousel(target, options = {}) {
    if (!target) return;

    const essays = getEssays();
    if (!essays.length) return;

    const {
      interval = 10000,
      autoplay = false,
      controls = false,
      cardScale = 1,
      className = '',
      viewportClass = 'mx-auto w-[1798px] max-w-full overflow-hidden',
      trackClass = 'flex gap-[18px] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]'
    } = options;

    target.innerHTML = `
      <section class="${className} relative" aria-label="Essays by Marker" data-essay-carousel-mounted>
        ${controls ? `
          <div class="absolute right-[20px] top-0 z-10 flex gap-[8px]" data-essay-controls>
            <button class="grid h-[32px] w-[32px] place-items-center rounded-full bg-paperWarm/70 font-mono text-[16px] text-ink backdrop-blur-md" type="button" data-essay-prev aria-label="Previous essays">&larr;</button>
            <button class="grid h-[32px] w-[32px] place-items-center rounded-full bg-paperWarm/70 font-mono text-[16px] text-ink backdrop-blur-md" type="button" data-essay-next aria-label="Next essays">&rarr;</button>
          </div>
        ` : ''}
        <div class="${viewportClass}">
          <div class="${trackClass}" data-essay-track>
            ${essays.map((essay, index) => renderCard(essay, index, essays.length, cardScale)).join('')}
          </div>
        </div>
      </section>
    `;

    const track = target.querySelector('[data-essay-track]');
    let timerId = 0;
    let animating = false;
    // When every card fits inside the viewport (e.g. just a couple of essays
    // on a wide screen) we centre them and disable advancing/drag/controls.
    let isStatic = false;

    function applyLayout() {
      const viewport = track.parentElement;
      const styles = window.getComputedStyle(track);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || '18') || 18;

      // Reset any layout-mode styling before measuring/deciding.
      track.classList.remove('justify-center');
      track.style.transformOrigin = '';
      track.style.transform = '';
      viewport.style.height = '';

      const cards = track.children;
      const count = cards.length;
      if (!count) return;
      // Measure the real rendered card size (handles responsive overrides and
      // the cardScale wrapper) rather than assuming the base 436px.
      let cardsW = 0;
      for (let i = 0; i < count; i += 1) cardsW += cards[i].getBoundingClientRect().width;
      const total = cardsW + (gap * (count - 1));
      const cardH = cards[0].getBoundingClientRect().height;

      const fitsFull = total <= viewport.clientWidth + 1;
      // A "couple" of essays are always shown together: centred if they fit at
      // full size, otherwise scaled down so both fit the width (e.g. mobile).
      const fitAll = fitsFull || count <= 2;
      isStatic = fitAll;

      if (fitAll) {
        target.style.paddingLeft = '0px';
        track.style.transition = 'none';
        if (fitsFull) {
          track.classList.add('justify-center');
        } else {
          const scale = viewport.clientWidth / total;
          track.style.transformOrigin = 'top left';
          track.style.transform = `scale(${scale})`;
          viewport.style.height = `${cardH * scale}px`;
        }
        track.getBoundingClientRect();
      } else {
        if (target.style.paddingLeft !== '') target.style.paddingLeft = '';
        track.style.transition = '';
      }

      const ctrls = target.querySelector('[data-essay-controls]');
      if (ctrls) ctrls.style.display = isStatic ? 'none' : '';
    }
    let dragStartX = 0;
    let dragStartY = 0;
    let dragCurrentX = 0;
    let dragCurrentY = 0;
    let dragging = false;
    let pointerDownLink = null;
    let suppressClick = false;

    function getStep() {
      const firstCard = track.firstElementChild;
      if (!firstCard) return (436 * cardScale) + 18;
      const styles = window.getComputedStyle(track);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || '18') || 18;
      return firstCard.getBoundingClientRect().width + gap;
    }

    function moveNext() {
      if (isStatic || animating) return;
      animating = true;
      track.style.transition = '';
      track.style.transform = `translateX(${-getStep()}px)`;
      window.setTimeout(() => {
        track.appendChild(track.firstElementChild);
        track.style.transition = 'none';
        track.style.transform = 'translateX(0)';
        track.getBoundingClientRect();
        track.style.transition = '';
        animating = false;
      }, 720);
    }

    function movePrev() {
      if (isStatic || animating) return;
      animating = true;
      track.style.transition = 'none';
      track.insertBefore(track.lastElementChild, track.firstElementChild);
      track.style.transform = `translateX(${-getStep()}px)`;
      track.getBoundingClientRect();
      track.style.transition = '';
      track.style.transform = 'translateX(0)';
      window.setTimeout(() => {
        animating = false;
      }, 720);
    }

    function resetTimer() {
      window.clearInterval(timerId);
      if (isStatic) return;
      if (autoplay && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        timerId = window.setInterval(moveNext, interval);
      }
    }

    target.querySelector('[data-essay-next]')?.addEventListener('click', () => {
      moveNext();
      resetTimer();
    });
    target.querySelector('[data-essay-prev]')?.addEventListener('click', () => {
      movePrev();
      resetTimer();
    });

    track.addEventListener('pointerdown', (event) => {
      if (isStatic) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      dragging = true;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      dragCurrentX = event.clientX;
      dragCurrentY = event.clientY;
      pointerDownLink = event.target.closest('a[href]');
      track.style.transition = 'none';
      track.setPointerCapture?.(event.pointerId);
    });

    track.addEventListener('pointermove', (event) => {
      if (!dragging || animating) return;
      dragCurrentX = event.clientX;
      dragCurrentY = event.clientY;
      const delta = dragCurrentX - dragStartX;
      track.style.transform = `translateX(${Math.max(Math.min(delta, 70), -70)}px)`;
    });

    function endDrag(event) {
      if (!dragging) return;
      dragging = false;
      if (event?.pointerId != null) {
        track.releasePointerCapture?.(event.pointerId);
      }
      const delta = dragCurrentX - dragStartX;
      const verticalDelta = dragCurrentY - dragStartY;
      track.style.transition = '';
      track.style.transform = 'translateX(0)';
      if (Math.abs(delta) < 45) {
        const link = pointerDownLink;
        pointerDownLink = null;
        if (link && Math.abs(verticalDelta) < 12 && !event?.metaKey && !event?.ctrlKey && !event?.shiftKey && !event?.altKey) {
          suppressClick = true;
          window.setTimeout(() => {
            suppressClick = false;
          }, 450);
          window.location.href = link.href;
        }
        return;
      }
      pointerDownLink = null;
      suppressClick = true;
      window.setTimeout(() => {
        suppressClick = false;
      }, 450);
      if (delta < 0) {
        moveNext();
      } else {
        movePrev();
      }
      resetTimer();
    }

    track.addEventListener('click', (event) => {
      const link = event.target.closest('a[href]');
      if (!link || !track.contains(link)) return;
      if (suppressClick) {
        event.preventDefault();
        event.stopPropagation();
        suppressClick = false;
      }
    });

    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);

    let layoutRaf = 0;
    function scheduleLayout() {
      window.cancelAnimationFrame(layoutRaf);
      layoutRaf = window.requestAnimationFrame(() => {
        applyLayout();
        resetTimer();
      });
    }

    window.addEventListener('resize', scheduleLayout);
    window.addEventListener('load', scheduleLayout);
    // The Tailwind CDN applies card widths asynchronously, so re-measure once
    // a card reports its real size (and on any later size change).
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(scheduleLayout);
      ro.observe(track);
      if (track.firstElementChild) ro.observe(track.firstElementChild);
    }
    [120, 360, 720].forEach((delay) => window.setTimeout(scheduleLayout, delay));

    scheduleLayout();
    resetTimer();
  }

  function mountFixedEssayCarousel(target, options = {}) {
    if (!target) return;

    const essays = getEssays();
    if (!essays.length) return;

    const interval = options.interval || 5000;
    const autoplay = options.autoplay === true;
    target.innerHTML = `
      <aside class="fixed bottom-[28px] right-[28px] z-80 w-[259px] font-mono text-ink" aria-label="Essays by Marker">
        <div class="absolute -top-[28px] right-0 flex gap-[4px]">
          <button class="h-[20px] w-[20px] rounded-[8px] bg-white/55 p-0 text-[12px] leading-[20px] backdrop-blur-md" type="button" data-carousel-prev aria-label="Previous essay">&larr;</button>
          <button class="h-[20px] w-[20px] rounded-[8px] bg-white/55 p-0 text-[12px] leading-[20px] backdrop-blur-md" type="button" data-carousel-next aria-label="Next essay">&rarr;</button>
        </div>
        <a class="block min-h-[114px] w-[259px] overflow-hidden rounded-[8px] bg-white/55 px-[12px] pb-[10px] pt-[13px] shadow-[0_10px_32px_rgba(0,0,0,0.08)] backdrop-blur-md hover:bg-white/65" href="${essays[0].href}" data-carousel-card>
          <p class="mb-[9px] text-[9px] uppercase leading-[1.25] tracking-[0.9px]">Essays by Marker</p>
          <div class="grid grid-cols-[48px_1fr] gap-x-[10px] transition duration-300 ease-out" data-carousel-content>
            <img class="h-[48px] w-[48px] rounded-[8px] object-cover" src="${essays[0].image}" alt="" data-carousel-thumb>
            <div>
              <h2 class="mb-[4px] overflow-hidden text-ellipsis whitespace-nowrap text-[10px] uppercase leading-[1.25] tracking-[1px]" data-carousel-title>${essays[0].title}</h2>
              <p class="font-mono text-[10px] leading-[1.25]" data-carousel-excerpt>${essays[0].excerpt}</p>
            </div>
          </div>
          <div class="mt-[10px] flex items-center justify-between text-[9px] uppercase leading-[1.25] tracking-[0.9px]">
            <span class="underline underline-offset-2">Read more</span>
            <span data-carousel-count>1/${essays.length}</span>
          </div>
        </a>
      </aside>
    `;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const card = target.querySelector('[data-carousel-card]');
    const content = target.querySelector('[data-carousel-content]');
    const thumb = target.querySelector('[data-carousel-thumb]');
    const title = target.querySelector('[data-carousel-title]');
    const excerpt = target.querySelector('[data-carousel-excerpt]');
    const count = target.querySelector('[data-carousel-count]');
    let index = 0;
    let timerId = 0;
    let animating = false;

    function render() {
      const essay = essays[index];
      card.href = essay.href;
      thumb.src = essay.image;
      title.textContent = essay.title;
      excerpt.textContent = essay.excerpt;
      count.textContent = `${index + 1}/${essays.length}`;
    }

    function advance(delta) {
      if (animating) return;
      index = (index + delta + essays.length) % essays.length;
      if (prefersReducedMotion) {
        render();
        return;
      }
      animating = true;
      content.classList.add(delta > 0 ? '-translate-x-[22px]' : 'translate-x-[22px]', 'opacity-0');
      window.setTimeout(() => {
        render();
        content.classList.remove('-translate-x-[22px]', 'translate-x-[22px]');
        content.classList.add(delta > 0 ? 'translate-x-[22px]' : '-translate-x-[22px]');
        content.getBoundingClientRect();
        content.classList.remove('opacity-0', 'translate-x-[22px]', '-translate-x-[22px]');
        window.setTimeout(() => {
          animating = false;
        }, 300);
      }, 280);
    }

    function resetTimer() {
      window.clearInterval(timerId);
      if (autoplay) {
        timerId = window.setInterval(() => advance(1), interval);
      }
    }

    target.querySelector('[data-carousel-prev]').addEventListener('click', () => {
      advance(-1);
      resetTimer();
    });
    target.querySelector('[data-carousel-next]').addEventListener('click', () => {
      advance(1);
      resetTimer();
    });

    resetTimer();
  }

  window.MarkerSite = window.MarkerSite || {};
  window.MarkerSite.mountEssayCarousel = mountEssayCarousel;
  window.MarkerSite.mountFixedEssayCarousel = mountFixedEssayCarousel;
})();
