import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {locales} from '../../locales.ts';
import {getCatalog, validateCatalog, text, richText, categoryPath, machinePath} from '../src/lib/catalog.mjs';

const category = {_id: 'c', name: [{language: 'it', value: 'Categoria'}], slug: {current: 'categoria'}};
const machine = {_id: 'm', model: 'M', slug: {current: 'm'}, category: {_ref: 'c'}};
assert.throws(() => validateCatalog({categories: [category, {...category, _id: 'other'}], machines: []}), /Duplicate/);
assert.throws(() => validateCatalog({categories: [], machines: [machine]}), /no published category/);
assert.throws(() => validateCatalog({categories: [category], machines: [{...machine, slug: {current: '../bad'}}]}), /invalid slug/);
assert.equal(text([{language: 'it', value: 'Italiano'}, {language: 'de', value: ' '}], 'de'), 'Italiano');
const blocks = [{_type: 'block', children: [{_type: 'span', text: 'Italiano'}]}];
assert.deepEqual(richText([{language: 'it', value: blocks}, {language: 'de', value: []}], 'de'), blocks);

const catalog = await getCatalog();
const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
let pages = 0;
for (const lang of locales) {
  const home = await readFile(`dist/${lang}/index.html`, 'utf8');
  for (const category of catalog.categories) {
    assert(home.includes(escape(text(category.name, lang))), 'Home must use CMS category names');
    const html = await readFile(`dist/${lang}/${categoryPath(category)}index.html`, 'utf8');
    assert(html.includes(escape(text(category.pageTitle, lang) || text(category.name, lang))), 'Category heading must use CMS');
    for (const machine of catalog.machines.filter(item => item.category._ref === category._id)) {
      const path = machinePath(machine, category);
      assert(html.includes(`/${lang}/${path}`), 'Category card must link to its own machine');
      const detail = await readFile(`dist/${lang}/${path}index.html`, 'utf8');
      assert(detail.includes(escape(machine.model)), 'Machine model missing');
      assert(detail.includes(escape(text(machine.subtitle, lang))), 'Machine subtitle missing');
      for (const row of machine.specifications || []) {
        assert(detail.includes(escape(text(row.label, lang))), 'Specification label missing');
        assert(detail.includes(escape(text(row.value, lang))), 'Specification value missing');
      }
      const withoutZoom = detail.replace(/<script src="\/scripts\/(?:photo-zoom|motion|navigation)\.js" defer><\/script>/g, '');
      assert(!/<script\b/i.test(withoutZoom), 'Only the requested photo zoom and motion scripts may run on machine pages');
      if (machine.gallery?.length) assert(detail.includes('<dialog') && detail.includes('data-photo-zoom'), 'Gallery must support closing the zoom in place');
      assert(!detail.includes('.api.sanity.io'), 'CMS queries must not reach the browser');
      pages++;
    }
    pages++;
  }
}
console.log(`Verified ${pages} CMS category/machine pages across ${locales.length} locales, links, fallback and static output.`);
