import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

// --preview expects an opt-in preview build; --build-only skips the dev server.
const preview = process.argv.includes('--preview');
const buildOnly = process.argv.includes('--build-only');
function verifyEmbeds(html) {
  const frames = html.match(/<iframe\b[^>]*>/g) ?? [];
  assert.equal(frames.length, 9);
  assert.equal(frames.filter(frame => frame.includes('loading="lazy"')).length, 6);
  assert(frames.every(frame => frame.includes('urn:li:ugcPost:7492627780170346496"') && frame.includes('height="946"')));
  assert(!html.includes('data-shuffle-feed'));
}
for (const lang of ['it', 'en', 'de', 'fr']) {
  const built = readFileSync(new URL(`../dist/${lang}/feed/index.html`, import.meta.url), 'utf8');
  if (preview) verifyEmbeds(built);
  else assert(!built.includes('linkedin.com/embed/'), `${lang}: default build must not load LinkedIn`);
  if (!buildOnly) {
    const response = await fetch(`http://127.0.0.1:4321/${lang}/feed/`);
    assert.equal(response.status, 200);
    verifyEmbeds(await response.text());
  }
  console.log(`${lang}: ${preview ? 'preview embeds verified' : 'default build embeds blocked'}`);
}
