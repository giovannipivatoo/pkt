// Usage: node scripts/verify-layout.mjs /path/to/playwright/index.mjs
// Serve a fresh dist/ on localhost:4322; dev server on localhost:4321.
// Playwright is an external QA tool, not a dependency shipped with the site.
import assert from 'node:assert/strict';
import {mkdir, writeFile} from 'node:fs/promises';
const {chromium} = await import(process.argv[2] || 'playwright');
const browser = await chromium.launch({headless: true});
const routes = ['', 'pkt/', 'sustainability/', 'feed/', 'packaging-solutions/', 'packaging-solutions/confezionatrici/', 'packaging-solutions/confezionatrici/fpk-24/'];
const failures = [];
const assets = new Set();
const links = new Set();
const output = '/private/tmp/pkt-layout-qa/verified';
await mkdir(output, {recursive: true});
let checks = 0;
try {
  for (const width of [320, 390, 760, 768, 1024, 1440, 1920]) {
    const page = await browser.newPage({viewport: {width, height: 900}});
    const locales = [390, 1440].includes(width) ? ['it', 'en', 'de', 'fr'] : ['it'];
    for (const lang of locales) for (const route of routes) {
      const path = `/${lang}/${route}`;
      const response = await page.goto(`http://127.0.0.1:4322${path}`);
      assert.equal(response.status(), 200, path);
      await page.evaluate(async () => {
        for (const image of document.images) image.loading = 'eager';
        await document.fonts.ready;
        await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
      });
      const result = await page.evaluate(() => {
        const errors = [];
        for (const image of document.images) if (!image.naturalWidth) errors.push(`Broken image: ${image.getAttribute('src')}`);
        for (const element of document.querySelectorAll('h1,h2,h3,p,li,td,label,address')) {
          if (element.closest('.gallery-strip, details:not([open])')) continue;
          const range = document.createRange();
          range.selectNodeContents(element);
          const rects = [...range.getClientRects()].filter(rect => rect.width && rect.height);
          const label = element.textContent.slice(0, 60);
          if (rects.some(rect => rect.left < -2 || rect.right > innerWidth + 2)) errors.push(`Text beyond viewport: ${label}`);
          const panel = element.closest('.pkt-hero, .home-about, .sustain-banner, .social-post');
          if (panel) {
            const bounds = panel.getBoundingClientRect();
            if (rects.some(rect => rect.left < bounds.left - 2 || rect.right > bounds.right + 2 || rect.bottom > bounds.bottom + 4)) errors.push(`Clipped panel text: ${label}`);
          }
          const section = element.closest('section');
          if (section && rects.some(rect => rect.bottom > section.getBoundingClientRect().bottom + 4)) errors.push(`Text spills into following section: ${label}`);
        }
        return {errors, assets: [...document.images].map(image => image.getAttribute('src')), links: [...document.querySelectorAll('a[href]')].map(a => new URL(a.href).origin === location.origin ? new URL(a.href).pathname + new URL(a.href).hash : null).filter(Boolean)};
      });
      if (route.endsWith('fpk-24/') && width > 760) {
        const arrows = await page.locator('.machine-gallery .gallery-arrows').boundingBox();
        const strip = await page.locator('.machine-gallery .gallery-strip').boundingBox();
        assert(arrows.x + arrows.width <= strip.x, 'Machine gallery arrows overlap photos');
      }
      result.assets.forEach(asset => assets.add(asset));
      result.links.forEach(link => links.add(link));
      if (result.errors.length) failures.push({width, path, errors: result.errors});
      if (lang === 'it' && [320, 1440].includes(width)) {
        await page.locator('.pkt-hero').screenshot({path: `${output}/${width}-${route.replaceAll('/', '_') || 'home'}-hero.png`});
        if (route === '') await page.locator('.home-about').screenshot({path: `${output}/${width}-home-about.png`});
        if (route === 'sustainability/') await page.locator('.sustain-banner').screenshot({path: `${output}/${width}-sustain-banner.png`});
      }
      checks++;
    }
    if (width === 320) {
      await page.goto('http://127.0.0.1:4322/it/');
      await page.locator('.pkt-mobile-nav summary').click();
      await page.locator('.pkt-lang summary').click();
      assert.equal(await page.locator('.pkt-mobile-nav').getAttribute('open'), null, 'Opening languages closes mobile menu');
      await page.locator('.pkt-mobile-nav summary').click();
      assert.equal(await page.locator('.pkt-lang').getAttribute('open'), null, 'Opening mobile menu closes languages');
      for (const link of await page.locator('.pkt-mobile-nav a').all()) {
        assert(await link.evaluate(element => {const r = element.getBoundingClientRect(); const top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return element === top || element.contains(top);}), 'Mobile menu item is obscured');
      }
      await page.locator('.pkt-hero').screenshot({path: `${output}/320-menu.png`});
      await page.locator('.pkt-mobile-nav summary').click();
      await page.locator('[name="name"]').fill('Test layout');
      await page.locator('[name="company"]').fill('PKT');
      await page.locator('[name="email"]').fill('test@example.com');
      assert(await page.locator('.pkt-contact button').isDisabled());
      await page.locator('.pkt-contact').screenshot({path: `${output}/320-contact.png`});
    }
    await page.close();
  }
  const page = await browser.newPage();
  for (const asset of assets) assert.equal((await page.request.get(`http://127.0.0.1:4322${asset}`)).status(), 200, asset);
  for (const link of links) {
    const response = await page.request.get(`http://127.0.0.1:4322${link}`);
    assert.equal(response.status(), 200, link);
    const hash = link.split('#')[1];
    if (hash) assert((await response.text()).includes(`id="${hash}"`), `Missing anchor: ${link}`);
  }
  for (const width of [390, 1024, 1440]) {
    await page.setViewportSize({width, height: 900});
    await page.goto('http://127.0.0.1:4321/it/feed/', {waitUntil: 'domcontentloaded'});
    assert.equal(await page.locator('iframe').count(), 9);
    const featured = await page.locator('.linkedin-feed__featured').boundingBox();
    const grid = await page.locator('.linkedin-feed__grid').boundingBox();
    const first = await page.locator('.linkedin-feed__grid iframe').first().boundingBox();
    const last = await page.locator('.linkedin-feed__grid iframe').nth(width > 1199 ? 2 : width > 760 ? 1 : 0).boundingBox();
    assert(Math.abs(featured.x - first.x) < 2 && Math.abs(featured.x + featured.width - last.x - last.width) < 2, 'Featured post aligns with grid');
    assert(featured.y + featured.height < grid.y, 'Featured post overlaps grid');
    assert((await page.locator('.pkt-contact').boundingBox()).y >= grid.y + grid.height, 'Feed overlaps contact form');
  }
  await writeFile(`${output}/report.json`, JSON.stringify({checks, assets: assets.size, links: links.size, failures}, null, 2));
  assert.deepEqual(failures, []);
  console.log(`${checks} page/viewport checks; ${assets.size} image assets; ${links.size} internal links; menus, form and local feed: PASS`);
} finally {
  await browser.close();
}
