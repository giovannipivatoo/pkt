# PKT Figma preview

Run `npm install` and `npm run dev` in this directory. Open http://127.0.0.1:4321/it/.
`npm run build` generates static HTML in `dist/`.

Implemented mockups from Figma file `eynZ4rWjULZ5E6HhqDTU7U`:

- `/it/` — home (3:168, with detached hero 7:1196)
- `/it/pkt/` — company (3:281)
- `/it/sustainability/` — sustainability (3:401)
- `/it/feed/` — social feed (3:516)
- `/it/packaging-solutions/` and `/it/packaging-solutions/confezionatrici/` — catalog (3:1148)
- `/it/packaging-solutions/confezionatrici/fpk-24/` — machine detail (3:1251)

Reusable Astro components follow the existing `../components/` references. SocialPost was separately approved for the preview. Imagery and social icons were extracted from Figma. Apfel Grotezk font files include their OFL license. Desktop dimensions follow the 1920px Figma canvas; narrower layouts adapt the existing component previews.

This is a visual preview, deliberately marked noindex. Catalog content is fetched from Sanity at build time; fixed-page copy remains local. Locale routes share Italian fallback copy until PKT provides human translations. No legal copy is generated. Form submission remains disabled pending the email endpoint, recipient, and privacy service. The local and GitHub Pages previews use the supplied LinkedIn embed, with temporary direct loading explicitly approved by the owner. Default builds retain the static sample posts until production consent is configured. The FPK24 catalog card uses the same layout as FPK44, with the photo from its detail mockup. Each machine card now links to its own CMS-generated detail page. Home and Inside PKT gallery arrows use a small deferred script for relative horizontal navigation without page jumps, with boundary states and reduced-motion support.

Before launch: complete the existing `../context/todo.md` CMS, translation, consent, form, SEO, redirects and deployment tasks; replace mock social content; remove noindex when approved for publication.

## GitHub Pages preview

### LinkedIn preview

The local and GitHub Pages previews display nine copies of the supplied full LinkedIn post (504 × 946px), with one featured post centered above the grid. Grid embeds are capped at 400px wide. The featured embed spans the full grid width: up to 1264px on desktop, 832px with two columns, and 400px with one column. Internal iframe scrolling is retained. The remaining eight posts use three columns on desktop, two below 1200px and one below 761px. There are no alternative formats or shuffle controls. Six embeds use native lazy loading. All locale routes use the same sample post. The supplied height applies to this post; future embeds may need their own heights.

Temporary direct loading on the public GitHub Pages preview was authorized on 2026-09-09. Its build sets `PKT_LINKEDIN_PREVIEW=true`; local development also enables embeds. Default builds keep embeds disabled. The production pkt.it launch still requires prior-consent handling; Sanity integration remains separate work.

Verify default builds with `node scripts/verify-feed.mjs --build-only`. For the public preview, run `PKT_LINKEDIN_PREVIEW=true npm run build` then `node scripts/verify-feed.mjs --preview --build-only`. Omit `--build-only` to also check the dev server on port 4321. CI checks the preview embeds before publishing.

### Deployment

`.github/workflows/pages.yml` builds and deploys `web/` when changes reach `main`.
It uses GitHub's Pages base path and `scripts/pages.mjs` to prefix generated HTML/CSS URLs and validate that assets and routes exist. This step adds no browser JavaScript. Local builds remain at `/`.

Shared preview: https://giovannipivatoo.github.io/pkt/it/

## Layout verification

`scripts/verify-layout.mjs` uses an externally installed Playwright module; it adds no site dependency. After building, serve `dist/` on `127.0.0.1:4322` and keep the dev server on port 4321. Run `node scripts/verify-layout.mjs /path/to/playwright/index.mjs`.

The check covers seven page routes at seven widths (320–1920px), with all four locales at 390px and 1440px: 91 page/viewport combinations. It checks text clipping and section overflow, image assets, internal links and anchors, mutually exclusive mobile menus, disabled preview form submission, machine gallery arrow separation, and local LinkedIn grid alignment. Screenshots and the report are written to `/private/tmp/pkt-layout-qa/verified/`. Third-party iframe content and backend form delivery are outside these geometry checks.

The owner approved making the repository public on 2026-09-09. GitHub Pages is enabled with **GitHub Actions** as its source. Run **Deploy website preview** to deploy manually.

## Editing the live catalog

Open https://pkt-cms.sanity.studio/ and log in with the existing Sanity account.
Edit **Categorie** or **Macchine**, then click **Pubblica**. Drafts stay off the
website. GitHub Pages rebuilds approximately every ten minutes; GitHub can delay
scheduled jobs. A manual **Deploy website preview** run refreshes it on demand.

The current catalog data generates all category/machine URLs in all four locales,
as well as home cards and navigation. FPK42/44 intentionally copy FPK24 data.
Fixed-page copy (company, sustainability, feed and the rest of home) still lives
in code pending its CMS schemas.

Build configuration (optional; defaults match PKT):

- `SANITY_PROJECT_ID=85609dop`
- `SANITY_DATASET=production` (public; no browser/build read token needed)
- `SITE_BASE_URL=https://giovannipivatoo.github.io/pkt` for canonical/hreflang links

`node scripts/verify-catalog.mjs` checks the generated pages against published CMS
content, fallback, category links, specifications and absence of client CMS code.
Run it after `npm run build` and before `node scripts/pages.mjs`.

Failed builds leave the previous deployed site intact. Review failures in GitHub
Actions. GitHub may disable scheduled workflows in public repositories after long
periods without repository activity; production should use the planned publish
webhook and Vercel deploy hook.
