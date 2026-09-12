// node scripts/verify-motion.mjs /path/to/playwright/index.mjs [base URL]
import assert from 'node:assert/strict';
const {chromium} = await import(process.argv[2] || 'playwright');
const base = process.argv[3] || 'http://127.0.0.1:4321';
const browser = await chromium.launch({headless:true, executablePath:process.env.PKT_QA_BROWSER});
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const machine = 'it/packaging-solutions/confezionatrici-verticali/fpk-24/';
  for (const width of [320,1440]) {
    await page.setViewportSize({width,height:900});
    for (const route of ['it/','it/pkt/','it/sustainability/','it/feed/','it/packaging-solutions/',machine,'de/']) {
      assert.equal((await page.goto(`${base}/${route}`)).status(),200);
      assert.equal(await page.locator('.version-selector, [data-version], script[src*="versions.js"]').count(),0);
      assert(await page.locator('.pkt-hero__image').evaluate(image => image.style.scale === '1.1'));
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    }
  }
  await page.goto(`${base}/it/`);
  const before = await page.locator('.pkt-hero__image').evaluate(image => image.style.translate);
  await page.evaluate(() => scrollTo({top:250,behavior:'instant'}));
  await page.waitForFunction(old => document.querySelector('.pkt-hero__image').style.translate !== old,before);
  const next = page.locator('.gallery-arrows button[data-direction="1"]');
  await next.hover();
  await page.waitForFunction(() => getComputedStyle(document.querySelector('.gallery-arrows button[data-direction="1"] img')).translate === '7px');
  assert.equal(await page.locator('.gallery-arrows button:disabled img').evaluate(image => getComputedStyle(image).translate),'none');
  await next.click();
  await page.waitForFunction(() => document.querySelector('.gallery-strip').scrollLeft > 30);
  const card = page.locator('.pkt-cat__media').nth(1);
  await card.hover({position:{x:50,y:50}});
  assert((await card.evaluate(element => element.style.transform)).includes('perspective'));
  await page.goto(`${base}/${machine}`);
  const cutout = page.locator('.machine-details > img');
  await cutout.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('.machine-details > img').style.rotate !== '');
  for (const [index,translate] of [[0,'-7px'],[1,'7px']]) {
    const arrow = page.locator('.machine-pagination a').nth(index);
    await arrow.focus();
    await page.waitForFunction(({index,translate}) => getComputedStyle(document.querySelectorAll('.machine-pagination a img')[index]).translate === translate,{index,translate});
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(() => document.querySelector('.machine-details > img').style.rotate === '');
  assert.equal(await page.evaluate(() => document.getAnimations().length),0);
  assert.equal(await page.locator('.machine-pagination a img').last().evaluate(image => getComputedStyle(image).translate),'none');
  await page.goto(`${base}/it/?versione=panoramica`);
  assert.equal(await page.locator('.version-selector').count(),0);
  assert.equal(await page.locator('.home-categories .gallery-area').evaluate(element => getComputedStyle(element).position),'relative');
  const noJS = await browser.newPage({javaScriptEnabled:false});
  await noJS.goto(`${base}/it/`);
  assert(await noJS.locator('h1').isVisible());
  assert.deepEqual(errors,[]);
  console.log('PASS: 14 page/viewport checks, 06 motion, gallery scrolling, arrow hover/focus, disabled arrows, card tilt, reduced motion and no-JS fallback.');
} finally { await browser.close(); }
