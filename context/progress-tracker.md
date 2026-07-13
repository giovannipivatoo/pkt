# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Complete — built and verified against specs 00–06.

## Current Goal

- None. Awaiting real copy/brand assets and production decisions.

## Completed

- Next.js 16 + Payload 3 scaffold in `website/` (SQLite dev DB, local uploads)
- Data model: categories, machines, posts, media collections; home/about/blog/site globals with localized `uiStrings`
- IT/EN localization (IT at root, EN under `/en` via `src/proxy.ts` rewrite; footer language selector)
- Shared blocks: header (hover dropdown), footer, inquiry form (stubbed), logos band, blog card, carousels
- All six page types per specs 01–06, statically generated (58 routes)
- Idempotent seed (`npm run seed`): admin user, 3 categories, 7 machines (FPK 42/44/48 + presse/avvolgitori), 14 posts, placeholder media, all globals incl. verbatim About copy
- Verified: `npm run build` green; seed idempotence (re-run, counts stable); all routes 200; `/it` → canonical 308; localized content on EN tree; category row order FPK 44/42/48; spec-table order; conditional post gallery; related posts exclude current; blog pagination (12/14 + arrows); zero dead links across 50 crawled pages; admin login works

## In Progress

- None.

## Next Up

- Production hardening: Postgres + storage adapter, real `PAYLOAD_SECRET`, wire inquiry/contact form submissions (email or inquiries collection)

## Open Questions

- Home hero CTA "Scopri di più" points to the `#soluzioni` section anchor (no solutions index page exists per spec 00). Confirm with client if it should target a category page instead.
- Final brand palette/typography pending — placeholder tokens in `website/src/app/(site)/globals.css`.

## Architecture Decisions

- Machines/categories get an `order` number field (`defaultSort: 'order'`) so the wireframe machine order (FPK 44, 42, 48) is CMS-controlled rather than hardcoded.
- Machine hero/category-row image = first gallery image (spec data model defines no separate hero field).
- Revalidation is coarse (`revalidatePath('/', 'layout')` on any change) since header/footer render CMS content on every page.
- Blog search + pagination are fully client-side over server-rendered card data (spec 05 "ponytail" note; fine for a few hundred posts).
- Seed uses top-level await — `payload run` exits before floating promises settle.

## Session Notes

- Repo has NO git remote — work must be pushed once a remote is added, or it is lost when the container is reclaimed.
- Dev commands (from `website/`): `npm run dev` · `npm run seed` · `npm run build` + `npm start`. Admin: admin@pkt.it / pkt-admin-2026.
