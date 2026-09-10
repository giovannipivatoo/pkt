# Sanity — content-model discussion, 2026-09-09

## Current state

Project `pkt` (`85609dop`), public dataset `production`, standalone Studio in
`studio/`. Category and machine schemas are implemented (2026-09-10). The website uses local
preview content. The initial catalog content was imported on 2026-09-10;
Astro now reads the catalog at build time. The GitHub Pages preview rebuilds on
a ten-minute schedule; the production publish webhook remains pending. Sanity is the selected CMS, not an alternative under review.

## Confirmed by the user

- The CMS will supply both machine-type pages (`Category`) and individual machine
  detail pages (`Machine`). Until a category page exists, show its name without a
  link in the header and home cards; do not redirect it to an unrelated page.
- A machine belongs to **one category**.
- Technical specifications are **free label/value rows per machine**, not a fixed
  set of fields per category or normalized numeric data for comparisons.
- Editors can **publish directly**; there is no separate approval step requested.
  The number of editors and the Sanity plan are still unknown.

Existing project requirements still apply: code-owned page layouts, field-level
localization, one shared locale array, Italian fallback for empty translations,
human translations only, static Astro output, and no form submissions in Sanity.

## Proposed model — discussed, not yet approved as a final schema

Sanity stores documents and references rather than relational tables. Proposed
editor-facing content types:

| Content | Proposed fields / behavior |
|---|---|
| Category | Localized name and introduction, slug, image, ordering, SEO |
| Machine | Model/name, category reference, slug, short description, detailed content, images/gallery, free specification rows, SEO |
| Home | One fixed document with the approved page's text/images and, if needed, featured category references |
| Company | One fixed document for presentation, innovation, services, gallery and the approved remaining sections |
| Sustainability | One fixed document for approved copy, images and PKT-supplied indicators |
| Catalog introduction | One fixed document for the catalog landing page's editorial introduction |
| Feed introduction | One fixed document for the feed page's editorial text |
| LinkedIn post | Embed/post URL and ordering; rendering supplied by LinkedIn |
| Shared content | Public business contacts, social links, and shared editorial contact/footer copy |

The proposed preference is separate singleton schemas for fixed pages, exposing
only fields relevant to that page. `Page` in the older architecture notes is a
conceptual grouping, not an approved generic schema or page builder.

Gallery items, specification rows and SEO belong inside their owning document.
Use a separate referenced document only when a content item genuinely needs shared
editing/reuse. PDF downloads, video, machine variants, and language-specific files
are **not yet confirmed requirements**.

The feed preview does not finalize its CMS schema: selecting the featured post,
ordering real posts and storing per-post embed heights remain to be specified.
Do not add an arbitrary HTML input simply because the user supplied iframe markup.

## Localization and editorial implications

- Keep one machine document across languages, with localized editorial fields and
  shared category/model/order data. Do not create four copies of each machine.
- Use `sanity-plugin-internationalized-array` as selected in `stack.md`. Version 5.2.4 is
  installed and configured for string/text fields in Studio. Match projections to the installed plugin version;
  the newer plugin uses a `language` property rather than encoding language in
  `_key`. Do not blindly copy older query examples.
- Adding a locale enables fields/routes; it does not provide translations.
- Publishing applies to the document, so it can include edits to several language
  fields together. Independent per-language release workflows were not requested.
- Missing or empty translations must fall back to Italian at build time. Plain
  `coalesce` handles null/missing values, not every empty-string/empty-array case;
  verify the actual stored values in the first end-to-end example.
- Shared category/machine slugs across languages were reconfirmed on 2026-09-10.

## Limits discussed

- Publication becomes visible after a successful Astro rebuild, not immediately.
  Keep the previous deployment on build failure and make failures visible to the
  maintainer when the webhook workflow is implemented.
- Free specification rows are easy to edit but unsuitable for reliable numeric
  filtering/comparison without a later data-model change.
- Plan/roles may matter before document volume. At the pricing review during this
  discussion, Free had Administrator/Viewer and Growth included Editor. Recheck
  [Sanity pricing](https://www.sanity.io/pricing) before selecting a plan or inviting
  staff; do not assume publishing permission means project-admin access.
- A public dataset exposes published fields even when the website omits them.
  Public assets are not a private document store.
- PKT's EU-residency requirement still needs contractual vendor review. Sanity
  selection is not evidence that all privacy/data-location requirements are met.
- Production video hosting/streaming is separate from ordinary file uploads;
  machine video requirements and provider have not been decided.

Reference discussed: [Sanity localization](https://www.sanity.io/docs/studio/localization).

## Proposed next steps and remaining questions

1. Obtain the real category/machine list and representative complete machine sheets.
2. Map approved page content to fields, separating shared and translated values.
3. Implement one category and one complete machine through Studio → Astro → four
   locale pages; have a PKT editor try the workflow before replicating schemas.
4. Finalize fixed-page fields, migrate approved content and old URLs, then connect
   publish/rebuild and document the editor workflow.

Still ask PKT: PDF/video/variant requirements; whether PDFs differ by language;
editor count; which old-site content and URLs
must carry over. Fixed-page schemas and feed editorial controls need approval.

## Implemented — 2026-09-10

- `category`: localized name/introduction, shared slug, main image, order, SEO.
- `machine`: shared model/slug, one required category reference, localized short
  and full descriptions, main image, order, free localized specification rows, SEO.
- Main images include localized accessible descriptions and hotspot support.
- Names, specification labels/values and image descriptions require Italian;
  translations are optional. Descriptions use plain multiline text for now.
- Studio reads the existing root `locales.ts`; `localized.ts` resolves text with
  Italian fallback for missing, empty and whitespace-only translations.
- Slugs use Sanity's default uniqueness validation within each document type;
  changing a machine category or slug requires handling old URL redirects.
- `npm run check` in `studio/` checks TypeScript, schemas and text fallback.
- Initial catalog content is now imported (see below). No hosted Studio deployment
  was performed at this stage. Astro now uses the catalog content; fixed-page CMS content,
  PDF/video/variants and the production publish hook remain pending.

## Initial catalog content — 2026-09-10

User requested recreating the current preview catalog in Sanity, copying all FPK24
data to the other vertical machines and changing only model and slug. The user
clarified category names: **Confezionatrice verticale**, **Confezionatrice
orizzontale**, **Presse**. These are distinct categories.

- Source snapshot: `studio/scripts/catalog/source.json`, extracted from the local
  Astro homepage, catalog and FPK24 detail. This is not a crawl of the old pkt.it.
- Categories: `confezionatrici`, `confezionatrici-orizzontali`, `presse`. Preserve
  the existing vertical URL. The other two slugs currently have no Astro pages.
- Vertical machines: **FPK 24**, **FPK 42**, **FPK 44** (`fpk-24`, `fpk-42`, `fpk-44`).
  All three reference the vertical category. Only name and slug differ.
- Category fields now include separate page title, subtitle, opening description
  and card image to retain the existing page content.
- Machine fields now include subtitle, introduction, two fixed rich-text fields
  (Portable Text), specification-side image and the existing three-image gallery.
  Shared images have optional localized captions. No layout controls were added.
- All source wording is preserved in the Italian base entry, including the English
  technical labels already present in the preview. No translations were generated.
- Data is created as published Content Lake documents, available for future build
  queries. Publishing here does not update the current static website.
- FPK42/FPK44 content is intentionally demonstrative, not their real technical data.
  Replace it with approved sheets before the production launch. Gallery requirements
  beyond the current preview and PDF/video/variants remain open.
- Import script uses Sanity-generated IDs and returned references, checks for
  existing slugs, and never overwrites existing documents. Images are uploaded to
  Sanity with content-based asset deduplication.
- No production cutover or old-site redirect migration is included in this seed.

## Connected and hosted — 2026-09-10

- Studio deployed: https://pkt-cms.sanity.studio/ (`appId`
  `x8q37mf59lycd14al06t6c6p`), using the existing project and accounts.
- `web/src/lib/catalog.mjs` reads published content once per production build.
  Drafts do not appear online. Local development reads fresh published content on
  refresh. Request failures or invalid references fail the build.
- Categories generate the header, home cards and category routes; machines generate
  individual detail routes and real previous/next links within their category.
- Rich text, images (including Sanity crop/hotspot), SEO fields, descriptions and
  specification rows are rendered into static HTML. Missing text falls back to
  Italian, including empty strings and empty rich-text translations.
- Fixed-page content outside the catalog is not yet editable through Studio.
- User chose GitHub Pages for now. Scheduled builds every ten minutes expose
  published changes without a webhook service or GitHub PAT in Sanity. Schedules
  may be delayed by GitHub; use manual workflow dispatch when needed.
- This remains the noindex visual preview; production domain, consent and form
  prerequisites are unchanged.
