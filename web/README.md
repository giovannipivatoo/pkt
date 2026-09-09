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

This is a visual preview, deliberately marked noindex. Content is local, not connected to Sanity. Locale routes share Italian fallback copy until PKT provides human translations. No legal copy is generated. Form submission remains disabled pending the email endpoint, recipient, and privacy service. Feed posts are the static sample content in the design; no LinkedIn embed or third-party cookies are loaded. The gray FPK24 catalog block follows the current Figma placeholder. Only FPK24 has a supplied detail mockup; other machine calls to action lead to the contact section. Gallery arrows use native anchors and horizontal scrolling without JavaScript.

Before launch: complete the existing `../context/todo.md` CMS, translation, consent, form, SEO, redirects and deployment tasks; replace mock social content; remove noindex when approved for publication.

## GitHub Pages preview

`.github/workflows/pages.yml` builds and deploys `web/` when changes reach `main`.
It uses GitHub's Pages base path and `scripts/pages.mjs` to prefix generated HTML/CSS URLs and validate that assets and routes exist. This step adds no browser JavaScript. Local builds remain at `/`.

Shared preview: https://giovannipivatoo.github.io/pkt/it/

The owner approved making the repository public on 2026-09-09. GitHub Pages is enabled with **GitHub Actions** as its source. Run **Deploy website preview** to deploy manually.
