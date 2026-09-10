// The native dialog provides focus containment and Escape; links remain a no-JS fallback.
const photoZoom = document.querySelector('.photo-zoom');
if (photoZoom) {
  const image = photoZoom.querySelector('img');
  let opener;
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('[data-photo-zoom]');
    if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = link;
    image.src = link.href;
    image.alt = link.querySelector('img')?.alt || '';
    photoZoom.showModal();
  });
  photoZoom.addEventListener('click', (event) => {
    if (event.target === photoZoom) photoZoom.close();
  });
  photoZoom.addEventListener('close', () => {
    image.removeAttribute('src');
    opener?.focus({preventScroll: true});
  });
}
