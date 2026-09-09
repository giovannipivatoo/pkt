# Sanity — content-model discussion, 2026-09-09

## Current state

Project `pkt` (`85609dop`), public dataset `production`, standalone Studio in
`studio/`. `studio/schemaTypes/index.ts` is still empty. The website uses local
preview content; no CMS queries, editorial imports, or publish/rebuild webhook
have been implemented. Sanity is the selected CMS, not an alternative under review.

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
- Use `sanity-plugin-internationalized-array` as selected in `stack.md`. It is not
  installed/configured yet. Match projections to the installed plugin version;
  the newer plugin uses a `language` property rather than encoding language in
  `_key`. Do not blindly copy older query examples.
- Adding a locale enables fields/routes; it does not provide translations.
- Publishing applies to the document, so it can include edits to several language
  fields together. Independent per-language release workflows were not requested.
- Missing or empty translations must fall back to Italian at build time. Plain
  `coalesce` handles null/missing values, not every empty-string/empty-array case;
  verify the actual stored values in the first end-to-end example.
- `routes.md` specifies shared slugs across languages; explicit reconfirmation of
  that earlier decision was asked but not answered in this discussion.

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
editor count; explicit shared-slug confirmation; which old-site content and URLs
must carry over. Fixed-page schemas and feed editorial controls need approval.
