// Deployment-only URL prefixing keeps the pkt.it and local builds at the domain root.
// This preview has static href/src attributes, a meta redirect, and CSS asset URLs.
import { readdir, readFile, writeFile, access } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';

const base = (process.env.PAGES_BASE ?? '/pkt').replace(/\/$/, '');
assert(base === '' || /^\/[\w-]+$/.test(base), 'Expected one repository path segment');
const root = resolve('dist');
const files = (await readdir(root, { recursive: true })).filter(f => /\.(html|css)$/.test(f));
const prefix = text => text
  .replace(/\b(href|src)="\/(?!\/)/g, `$1="${base}/`)
  .replace(/url\((['"]?)\/(?!\/)/g, `url($1${base}/`)
  .replace(/(content="[^"]*url=)\/(?!\/)/gi, `$1${base}/`);
assert.equal(prefix('<a href="/it/">'), `<a href="${base}/it/">`);
assert.equal(prefix('url(/fonts/a.woff2)'), `url(${base}/fonts/a.woff2)`);
assert.equal(prefix('<a href="https://example.com/">'), '<a href="https://example.com/">');
for (const file of files) {
  const path = join(root, file);
  const output = prefix(await readFile(path, 'utf8'));
  assert(!/<script\b/i.test(output), `Unexpected client script: ${file}`);
  for (const match of output.matchAll(/(?:\b(?:href|src)="|url\(['"]?)(\/[^"'\s)]+)/g)) {
    const url = match[1];
    if (url.startsWith('//')) continue;
    assert(!base || url.startsWith(`${base}/`), `Missing prefix: ${url}`);
    const local = url.slice(base.length).split(/[?#]/)[0];
    await access(join(root, decodeURIComponent(local), local.endsWith('/') ? 'index.html' : ''));
  }
  await writeFile(path, output);
}
console.log(`Prepared ${files.length} HTML/CSS files for ${base || '/'}, all local URLs verified.`);
