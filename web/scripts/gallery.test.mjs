import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const buttons = [1, -1].map(direction => ({dataset:{direction}, addEventListener(_, fn){this.click=fn;}}));
const strip = {scrollLeft:0,scrollWidth:1200,clientWidth:700,
  firstElementChild:{getBoundingClientRect:()=>({width:300})},
  addEventListener(_,fn){this.update=fn;},
  scrollBy({left,behavior}){this.behavior=behavior;this.scrollLeft=Math.max(0,Math.min(500,this.scrollLeft+left));this.update();}};
const gallery = {querySelector:()=>strip,querySelectorAll:()=>buttons};
runInNewContext(readFileSync(new URL('../public/scripts/gallery.js',import.meta.url),'utf8'),{
  document:{querySelectorAll:()=>[gallery]},getComputedStyle:()=>({gap:'20px'}),
  matchMedia:()=>({matches:true}),ResizeObserver:class{observe(){}},
});
assert.equal(buttons[1].disabled,true);
buttons[0].click();assert.equal(strip.scrollLeft,320);
assert.equal(strip.behavior,'instant');assert.equal(buttons[1].disabled,false);
buttons[0].click();assert.equal(strip.scrollLeft,500);assert.equal(buttons[0].disabled,true);
buttons[1].click();assert.equal(strip.scrollLeft,180);assert.equal(buttons[0].disabled,false);
buttons[1].click();assert.equal(strip.scrollLeft,0);assert.equal(buttons[1].disabled,true);
console.log('Gallery next/previous, boundaries and reduced motion: PASS');
