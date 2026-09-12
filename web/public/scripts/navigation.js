// Requested fixed-nav studies; reuse the real navigation, with no duplicate menus.
(() => {
  const nav = document.querySelector('.pkt-nav');
  const preview = document.querySelector('.nav-preview');
  const select = preview.querySelector('select');
  const panel = preview.querySelector('.glass-controls');
  const sliders = [...panel.querySelectorAll('input[type="range"]')];
  const easing = panel.querySelector('select');
  const params = new URL(location.href).searchParams;
  for (const input of sliders) {
    const value = params.get(`glass-${input.name}`);
    if (value !== null && Number.isFinite(Number(value))) input.value = value;
  }
  if ([...easing.options].some(option => option.value === params.get('glass-easing'))) easing.value = params.get('glass-easing');
  let settings = {};
  function applySettings() {
    settings = Object.fromEntries(sliders.map(input => [input.name, Number(input.value)]));
    for (const input of sliders) {
      const output = panel.querySelector(`output[for="${input.id}"]`);
      output.value = `${input.value} ${output.dataset.unit}`;
    }
    nav.style.setProperty('--glass-blur', `${settings.blur}px`);
    nav.style.setProperty('--glass-opacity', settings.opacity / 100);
    nav.style.setProperty('--glass-saturation', `${settings.saturation}%`);
    nav.style.setProperty('--glass-shine', settings.shine / 100);
    nav.style.setProperty('--glass-shadow', settings.shadow / 100);
  }
  function saveSettings(url) {
    for (const input of sliders) {
      const key = `glass-${input.name}`;
      if (input.value === input.defaultValue) url.searchParams.delete(key);
      else url.searchParams.set(key, input.value);
    }
    if (easing.value === 'smooth') url.searchParams.delete('glass-easing');
    else url.searchParams.set('glass-easing', easing.value);
  }
  applySettings();
  // Outside the clipped hero, retaining keyboard order after the skip link.
  document.querySelector('.skip-link').after(nav);
  const requested = new URL(location.href).searchParams.get('nav');
  select.value = [...select.options].some(option => option.value === requested) ? requested : 'sfumata';
  let previous = scrollY;
  let frame = 0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let origin = 0;
  let floating = 0;
  function measureGlass() {
    if (select.value !== 'sfumata') return;
    const hero = document.querySelector('.pkt-hero');
    const bounds = hero.getBoundingClientRect();
    const contents = nav.getBoundingClientRect();
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    origin = innerWidth <= 760 ? 36 : 64 * rem;
    const inset = bounds.top + scrollY - origin;
    floating = settings.gap - inset;
    nav.style.setProperty('--glass-top', `${inset}px`);
    nav.style.setProperty('--glass-left', `${bounds.left - contents.left}px`);
    nav.style.setProperty('--glass-right', `${contents.right - bounds.right}px`);
    nav.style.setProperty('--glass-radius', getComputedStyle(hero).borderTopLeftRadius);
  }
  function paint() {
    frame = 0;
    const y = Math.max(0, scrollY);
    if (select.value === 'sfumata') {
      const progress = reduced.matches ? Number(y > settings.start + 40) : Math.max(0, Math.min(1, (y - settings.start) / settings.distance));
      const eased = easing.value === 'linear' ? progress : easing.value === 'out' ? 1 - (1 - progress) ** 3 : progress * progress * (3 - 2 * progress);
      nav.style.setProperty('--detach', eased);
      nav.style.setProperty('--nav-glass-top', `${origin + (floating - origin) * eased}px`);
    }
    nav.classList.toggle('is-docked', y > 40);
    if (select.value !== 'risalita' || y < 120 || nav.matches(':hover,:focus-within') || nav.querySelector('details[open]')) {
      nav.classList.remove('is-hidden');
    } else if (Math.abs(y - previous) > 6) {
      nav.classList.toggle('is-hidden', y > previous);
    }
    if (Math.abs(y - previous) > 6) previous = y;
  }
  function choose() {
    nav.dataset.nav = select.value;
    panel.hidden = select.value !== 'sfumata';
    measureGlass();
    const url = new URL(location.href);
    url.searchParams.set('nav', select.value);
    saveSettings(url);
    history.replaceState(null, '', url);
    for (const link of document.querySelectorAll('a[href]')) {
      const target = new URL(link.href, location.href);
      if (target.origin !== location.origin || !target.pathname.endsWith('/') || link.getAttribute('href').startsWith('#') || link.hasAttribute('download')) continue;
      target.searchParams.set('nav', select.value);
      saveSettings(target);
      link.href = target.href;
    }
    nav.classList.remove('is-hidden');
    previous = scrollY;
    paint();
  }
  select.addEventListener('change', choose);
  panel.addEventListener('input', () => { applySettings(); measureGlass(); paint(); });
  panel.addEventListener('change', choose);
  panel.querySelector('[data-glass-reset]').addEventListener('click', () => {
    sliders.forEach(input => { input.value = input.defaultValue; });
    easing.value = 'smooth';
    applySettings();
    choose();
  });
  panel.querySelector('[data-glass-preview]').addEventListener('click', () => {
    scrollTo({top: settings.start + settings.distance + 10, behavior: reduced.matches ? 'instant' : 'smooth'});
  });
  addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(paint); }, {passive:true});
  nav.addEventListener('focusin', () => nav.classList.remove('is-hidden'));
  addEventListener('resize', () => { measureGlass(); paint(); });
  reduced.addEventListener('change', paint);
  choose();
  preview.hidden = false;
})();
