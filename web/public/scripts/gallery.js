// Native horizontal scrolling; needed for relative next/previous navigation without page jumps.
for (const gallery of document.querySelectorAll('[data-gallery]')) {
  const strip = gallery.querySelector('.gallery-strip');
  const buttons = gallery.querySelectorAll('button[data-direction]');
  const update = () => {
    for (const button of buttons) {
      button.disabled = Number(button.dataset.direction) < 0
        ? strip.scrollLeft <= 1
        : strip.scrollLeft >= strip.scrollWidth - strip.clientWidth - 1;
    }
  };
  for (const button of buttons) {
    button.addEventListener('click', () => {
      const step = strip.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(strip).gap);
      strip.scrollBy({left: Number(button.dataset.direction) * step,
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    });
  }
  strip.addEventListener('scroll', update, {passive: true});
  new ResizeObserver(update).observe(strip);
  update();
}
