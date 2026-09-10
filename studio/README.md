# PKT — Sanity Studio

Run `npm install` and `npm run dev` from this directory. The Studio connects to
project `85609dop`, dataset `production`.

After installing or updating dependencies, stop the running dev server with
Ctrl+C and start it again. A running Vite process can retain package paths that
npm has moved. `@sanity/language-filter` is an explicit dependency required by
the internationalized-array plugin, even without enabling the language filter UI.

## Catalog editing

1. Create a **Categoria**, enter its Italian name and generate its shared slug.
2. Create a **Macchina**, enter the model, select one category and generate its slug.
3. Add descriptions, the main image and free technical specification rows.
4. Add human translations using the field language buttons. Empty translations
   fall back to Italian when resolved with the shared content helper.

Ordering uses non-negative integers (lower first). The model, category, slug,
images and ordering are shared across languages. Names, prose, image descriptions,
specification labels/values and SEO text are localized. Do not store private files.

Italian names and specification labels/values are required. Uploaded images need
an Italian accessible description. Descriptions and SEO overrides are optional.
Sanity checks slug uniqueness within each document type. Changing a published
slug or a machine's category requires redirects for its old website URLs.

The language list lives in `../locales.ts`; add languages there. Localization uses
`sanity-plugin-internationalized-array` v5 (`language`, not `_key`, identifies the
language): [plugin documentation](https://github.com/sanity-io/plugins/tree/main/plugins/sanity-plugin-internationalized-array).

## Verification

- `npm run check`: TypeScript, schema validation and executable fallback checks.
- `npm run build`: production Studio build.

## Current boundary

These are the initial category/machine schemas. Astro reads published categories/machines at build time. The GitHub Pages
preview rebuilds on a ten-minute schedule; GitHub may delay scheduled runs. The initial catalog seed is described below; no automated translations are included. Additional gallery requirements, PDFs, video and
variants remain open in `../context/todo.md`. Studio is hosted at https://pkt-cms.sanity.studio/. The production publish
webhook remains future work.

## Initial catalog import

`source.json` in `scripts/catalog/` is the snapshot of the current local preview.
It contains three categories and FPK24 data shared by FPK 24, FPK 42 and FPK 44.
Only model and slug differ across machines. FPK42/44 are placeholders authorized
by the user and require approved technical content before production launch.

```sh
# Read-only plan; uses the existing CLI login without exposing credentials.
npx sanity exec scripts/catalog/import.mjs --with-user-token
# Upload images and create missing published CMS documents. Never overwrite.
npx sanity exec scripts/catalog/import.mjs --with-user-token -- --write
# Verify counts, references, machine content equality and image assets.
npx sanity exec scripts/catalog/import.mjs --with-user-token -- --verify
```

The import preserves existing wording, including English specification text in
the Italian source page. Other languages remain empty for human translation.
The Studio models the existing rich text and gallery; Astro now renders these fields.
Existing URLs are retained; the horizontal/presse slugs also generate category routes. No redirect changes or production website cutover are performed.

## Online access

Studio: https://pkt-cms.sanity.studio/
Website: https://giovannipivatoo.github.io/pkt/it/

Publish category/machine edits to include them in the next preview rebuild
(approximately ten minutes, subject to GitHub scheduling). No local dev server
is required for content editing. Other fixed-page content has no CMS schema yet.
Schema changes need `npm run deploy` from this directory; ordinary content edits
do not require deploying the Studio. The hosted app ID is in `sanity.cli.ts`.
