# PKT Website

Marketing website for PKT, an Italian company (Viale Marco Biagi 28, 31037 Loria TV) that designs and builds packaging machines and complete packaging lines. Contact: info@pkt.it.

## Status

Built and verified against the specs. The app lives in `website/`: Next.js 16 (App Router, TS, Tailwind v4) with Payload 3 embedded — SQLite + local uploads in dev (swap to Postgres + storage adapter for production, `src/payload.config.ts`). All pages statically generated; ALL text content is CMS-managed (collections + per-page globals, `site.ui` for microcopy). IT at root, EN under `/en` (rewrite in `src/proxy.ts`).

Commands (from `website/`): `npm run dev` (site :3000, CMS at `/admin`) · `npm run seed` (placeholder content, idempotent) · `npm run build` + `npm start`. Local admin login: admin@pkt.it / pkt-admin-2026.

Wireframes: `rewireframepktwebsite/wireframepktwebsite/` (reference only — specs win).

## Source of truth: `specs/`

`specs/00-site.md` (global) through `specs/06-blog-post.md` (one per page) are the contract for the build. To change the site, change the spec first, then the code. Wireframes are reference only; specs win where they differ.

## Site structure (from wireframes)

| Page | Wireframe | Notes |
|------|-----------|-------|
| Home | `01-PKT-Home.png` | Hero, solutions carousel, About video, blog carousel, contact form + map |
| Product category | `02-PKT-Cat prodotti.png` | e.g. "Confezionatrici verticali" listing machines (FPK 42/44/48) in alternating rows |
| Product detail | `03-PKT-scheda prodotto.png` | Hero, description, "Technical information" spec table, image gallery, inquiry form |
| About | `04-PKT-about us.png` | Company story, video, value bullets, gallery, inquiry form |
| Blog index | `05-PKT-blog.png` | Search + 3-col card grid, pagination |
| Blog post | `06-PKT-blog post.png` | Article, image carousel, "Altri articoli" related posts |

Product categories: Confezionatrici verticali (vertical packaging machines), Presse (presses), Avvolgitori (wrappers). Machines are named FPK + number.

## Shared blocks

- Header nav: Home, PKT (about), Packaging Solutions, Blog, Contatti. Logo: "PKT" wordmark with red dots accent.
- Footer: contact info, link columns (Packaging solutions / About / Blog), social icons, language selector.
- "Richiedi informazioni macchinario" inquiry form (name, email/phone, request, T&C checkbox) — appears on product detail and about pages.
- Supplier/client logos band above the footer on most pages.

## Conventions

- Bilingual: content is Italian, wireframes show an English language switch — plan for IT/EN i18n from the start.
- Content is placeholder (lorem ipsum) in wireframes; real copy TBD.
- Site is content-driven (machines, blog posts) — model those as data/CMS content, not hardcoded pages.
