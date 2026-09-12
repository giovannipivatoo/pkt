// Approved 06 motion: entrances, photo parallax, moving cutouts and interactive cards.
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let cleanup = () => {};

  function update() {
    cleanup();
    if (reduced.matches) return;

    const animations = new Set();
    const animate = (element, frames, delay = 0) => {
      const animation = element.animate(frames, {
        duration: 1250,
        easing: 'cubic-bezier(.16,1,.3,1)', delay, fill: 'backwards',
      });
      animations.add(animation);
      animation.finished.then(() => animations.delete(animation), () => {});
    };
    const frames = [{opacity: 0, translate: '0 55px', scale: '.96'}, {opacity: 1, translate: '0 0', scale: '1'}];

    // Animate only on entry; never leave unseen content hidden in CSS.
    const observer = new IntersectionObserver(entries => {
      let index = 0;
      for (const entry of entries) if (entry.isIntersecting) {
        if (!entry.target.contains(document.activeElement)) animate(entry.target, frames, (index++ % 3) * 90);
        observer.unobserve(entry.target);
      }
    }, {threshold: 0.08});
    document.querySelectorAll('main h2, main article, main .pkt-cat, .pkt-mcard__media, .pkt-mcard__details, .machine-specs, .machine-copy > div, .sustain-energy > img, .sustain-efficiency > img, .pkt-contact__intro').forEach(element => {
      // Parent effects already reveal their headings; avoid compounded transforms.
      if (!element.parentElement.closest('article, .pkt-mcard__details, .machine-specs, .machine-copy > div')) observer.observe(element);
    });
    const title = document.querySelector('.pkt-hero__title');
    if (title && title.getBoundingClientRect().bottom > 0) animate(title, frames, 100);
    document.querySelectorAll('.pkt-hero__subtitle, .pkt-hero__description').forEach(element => animate(element, frames, 300));

    let frame = 0;
    const images = [...document.querySelectorAll('.pkt-hero__image, .home-about > img, .about-line > img, .sustain-banner > img')];
    const cutouts = [...document.querySelectorAll('.machine-details > img, .about-innovation > img, .sustain-waste > img, .home-intro > img')];
    const paint = () => {
      frame = 0;
      for (const image of images) {
        const rect = image.parentElement.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > innerHeight) continue;
        const progress = Math.max(-1, Math.min(1, (innerHeight / 2 - rect.top - rect.height / 2) / innerHeight));
        const distance = Math.min(rect.height * .045, innerWidth < 761 ? 20 : 48);
        image.style.translate = `0 ${progress * distance}px`;
        image.style.scale = '1.1';
      }
      for (const image of cutouts) {
        const rect = image.parentElement.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > innerHeight) continue;
        const progress = Math.max(-1, Math.min(1, (innerHeight / 2 - rect.top - rect.height / 2) / innerHeight));
        image.style.translate = `0 ${-progress * (innerWidth < 761 ? 20 : 65)}px`;
        image.style.rotate = `${progress * 3}deg`;
      }

    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    if (images.length || cutouts.length) {
      addEventListener('scroll', schedule, {passive: true});
      addEventListener('resize', schedule);
      paint();
    }
    const cards = [...document.querySelectorAll('.pkt-cat__media, .pkt-mcard__media')];
    const pointer = event => {
      if (event.pointerType !== 'mouse' || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
      const card = event.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.transform = `perspective(1000px) rotateX(${-y * 10}deg) rotateY(${x * 12}deg)`;
      const image = card.querySelector('img');
      if (image) { image.style.translate = `${-x * 18}px ${-y * 18}px`; image.style.scale = '1.08'; }
    };
    const resetCard = card => {
      card.style.removeProperty('transform');
      const image = card.querySelector('img');
      if (image) { image.style.removeProperty('translate'); image.style.removeProperty('scale'); }
    };
    const leave = event => resetCard(event.currentTarget);
    cards.forEach(card => {
      card.addEventListener('pointermove', pointer);
      card.addEventListener('pointerleave', leave);
    });
    cleanup = () => {
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
      images.forEach(image => { image.style.removeProperty('translate'); image.style.removeProperty('scale'); });
      cutouts.forEach(image => { image.style.removeProperty('translate'); image.style.removeProperty('rotate'); });
      cards.forEach(card => {
        card.removeEventListener('pointermove', pointer);
        card.removeEventListener('pointerleave', leave);
        resetCard(card);
      });
    };
  }
  reduced.addEventListener('change', update);
  update();
})();
