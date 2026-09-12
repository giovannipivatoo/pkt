import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const {chromium} = await import(process.argv[2] || 'playwright');
const browser = await chromium.launch({headless:true,executablePath:process.env.PKT_QA_BROWSER});
const base = process.argv[3] || 'http://127.0.0.1:4321';
await mkdir('/private/tmp/pkt-nav-qa',{recursive:true});
try {
 const page = await browser.newPage();
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 for(const width of [320,390,768,1440,1920]) {
  await page.setViewportSize({width,height:900});
  for(const variant of (process.argv[4] ? [process.argv[4]] : ['barra','isola','risalita','glass','sfumata'])) {
   for(const route of ['it/','it/pkt/','it/packaging-solutions/confezionatrici-verticali/fpk-24/']) {
    assert.equal((await page.goto(`${base}/${route}?nav=${variant}`)).status(),200);
    assert.equal(await page.locator('.pkt-nav').count(),1);
    assert.equal(await page.locator('#nav-style').inputValue(),variant);
    await page.evaluate(() => document.fonts.ready);
    const positions = () => page.locator('.pkt-nav a,.pkt-nav summary,.pkt-nav img').evaluateAll(elements => elements.filter(el => el.getBoundingClientRect().width && getComputedStyle(el).visibility !== 'hidden').map(el => ({x:el.getBoundingClientRect().x,width:el.getBoundingClientRect().width})));
    const initial = await positions();
    if(variant==='sfumata') {
      await page.evaluate(()=>scrollTo({top:70,behavior:'instant'}));
      await page.waitForFunction(()=>Math.abs(Number(document.querySelector('.pkt-nav').style.getPropertyValue('--detach'))-.5)<.01);
      const midway=await positions();
      midway.forEach((item,index)=>assert(Math.abs(item.x-initial[index].x)<.5));
    }
    await page.mouse.move(0,899);
    await page.evaluate(()=>scrollTo({top:1200,behavior:'instant'}));
    await page.waitForFunction(()=>document.querySelector('.pkt-nav').classList.contains('is-docked'));
    if(variant==='risalita') {
     await page.waitForFunction(()=>document.querySelector('.pkt-nav').classList.contains('is-hidden'));
     await page.evaluate(()=>scrollTo({top:1000,behavior:'instant'}));
     await page.waitForFunction(()=>!document.querySelector('.pkt-nav').classList.contains('is-hidden'));
    }
    await page.waitForFunction(()=>document.getAnimations().length===0);
    const rect=await page.locator('.pkt-nav').boundingBox();
    assert(rect.y>=0 && rect.y<(variant==='sfumata'?60:20) && rect.x>=0 && rect.x+rect.width<=width+1);
    assert.equal(await page.locator('.pkt-nav').evaluate(el=>getComputedStyle(el).position),'fixed');
    if(variant==='sfumata') {
      assert(await page.locator('.pkt-nav').evaluate(el=>{
        const hero=document.querySelector('.pkt-hero');
        const h=hero.getBoundingClientRect(),n=el.getBoundingClientRect(),g=getComputedStyle(el,'::before');
        return Math.abs(n.left+parseFloat(g.left)-h.left)<.5 && Math.abs(n.right-parseFloat(g.right)-h.right)<.5 && g.borderTopLeftRadius===getComputedStyle(hero).borderTopLeftRadius && Math.abs(n.top+parseFloat(g.top)-10)<.5;
      }), 'Glass edges/radius must match hero, floating 10px from viewport top');
      const docked=await positions();
      assert.equal(docked.length,initial.length);
      docked.forEach((item,index)=>{assert(Math.abs(item.x-initial[index].x)<.5, 'Horizontal position must not shift');assert(Math.abs(item.width-initial[index].width)<.5,'Element width must not change');});
      assert.equal(await page.locator('.pkt-nav').evaluate(el=>getComputedStyle(el,'::before').opacity),'1');
    }
    assert((await page.locator('.pkt-nav__logo').getAttribute('href')).includes(`nav=${variant}`));
    if(width<=760) {
     await page.locator('.pkt-mobile-nav summary').click();
     const menu=page.locator('.pkt-mobile-nav a').first();
     assert(await menu.evaluate(el=>{const r=el.getBoundingClientRect();return el.contains(document.elementFromPoint(r.x+10,r.y+5));}));
     await page.locator('.pkt-lang summary').click();
     assert.equal(await page.locator('.pkt-mobile-nav').getAttribute('open'),null);
     await page.locator('.pkt-lang summary').click();
    } else {
     await page.locator('.pkt-catalog-nav > a').hover();
     assert(await page.locator('.pkt-catalog-nav__items a').first().isVisible());
     await page.mouse.move(0,899);
    }
    if(route==='it/') await page.screenshot({path:`/private/tmp/pkt-nav-qa/${width}-${variant}.png`});
   }
  }
 }
 await page.goto(`${base}/it/?nav=sfumata`);
 await page.setViewportSize({width:320,height:900});
 await page.locator('.glass-controls summary').click();
 await page.locator('#glass-blur').focus();
 await page.locator('#glass-blur').press('End');
 assert.equal(await page.locator('#glass-blur').inputValue(),'60');
 assert.equal(await page.locator('.pkt-nav').evaluate(el=>el.style.getPropertyValue('--glass-blur')),'60px');
 assert.equal(new URL(page.url()).searchParams.get('glass-blur'),'60');
 await page.locator('[data-glass-preview]').click();
 await page.waitForFunction(()=>scrollY>=140);
 assert.equal(await page.locator('.pkt-nav').evaluate(el=>getComputedStyle(el,'::before').backdropFilter),'blur(60px) saturate(1.05)');
 await page.reload();
 assert.equal(await page.locator('#glass-blur').inputValue(),'60');
 await page.locator('.glass-controls summary').click();
 const panel=await page.locator('.nav-preview').boundingBox();
 assert(panel.x>=0 && panel.x+panel.width<=320 && panel.y>=0 && panel.y+panel.height<=900);
 await page.screenshot({path:'/private/tmp/pkt-nav-qa/glass-controls-mobile.png'});
 await page.locator('[data-glass-reset]').click();
 assert.equal(await page.locator('#glass-blur').inputValue(),'10');
 assert.equal(new URL(page.url()).searchParams.get('glass-blur'),null);
 await page.locator('#nav-style').selectOption('barra');
 assert(new URL(page.url()).searchParams.get('nav')==='barra');
 await page.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await page.locator('.pkt-nav').evaluate(el=>getComputedStyle(el).transitionDuration),'0s');
 assert.deepEqual(errors,[]);
 console.log('PASS: navigation page/viewport combinations and unchanged 05 horizontal coordinates, fixed position, scroll direction, menus, selector, links and reduced motion.');
} finally {await browser.close();}
