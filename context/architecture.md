# Architecture Context

## Stack

| Layer     | Technology                                | Role                                          |
| --------- | ----------------------------------------- | --------------------------------------------- |
| Framework | Next.js 16 (App Router) + TypeScript      | Static site generation + serving              |
| UI        | Tailwind CSS v4                           | Styling (design tokens in `globals.css`)      |
| CMS       | Payload 3 (embedded, admin at `/admin`)   | All content + UI microcopy, IT/EN localized   |
| Database  | SQLite via `@payloadcms/db-sqlite` (dev)  | Payload storage — swap to Postgres for prod   |
| Media     | Payload local uploads (`website/media/`)  | Swap to Vercel Blob/S3 adapter for prod       |

## System Boundaries

- `website/src/payload.config.ts` — CMS config: localization, DB, collections, globals
- `website/src/collections/`, `website/src/globals/` — data model (see specs/00-site.md)
- `website/src/app/(payload)/` — Payload admin panel + REST/GraphQL routes (standard template)
- `website/src/app/(site)/[locale]/` — all public pages, statically generated per locale
- `website/src/components/` — shared blocks (header, footer, inquiry form, cards, carousels)
- `website/src/lib/` — Local API data access (`data.ts`), locale helpers (`locale.ts`), revalidation hook (`revalidate.ts`)
- `website/src/proxy.ts` — i18n routing: IT at root (rewrite → `/it/...`), EN under `/en`
- `website/src/seed/` — idempotent placeholder content seed (`npm run seed`)

## Storage Model

- **SQLite (`website/pkt.db`, dev)**: all CMS documents — categories, machines, posts, media metadata, users, globals
- **Local uploads (`website/media/`)**: uploaded image files, served at `/api/media/file/*`

## Auth and Access Model

- Only the Payload admin panel requires auth (`users` collection; dev login admin@pkt.it / pkt-admin-2026)
- All content collections/globals have public `read` access; writes require an admin session
- The public site has no user accounts

## Invariants

1. All text content lives in the CMS — no hardcoded copy or translation files in the repo (spec 00)
2. Every page is statically generated (`generateStaticParams`, `dynamicParams = false`); content changes revalidate via `afterChange` hooks
3. One document per machine/post/category with both locales inside it; EN falls back to IT (`fallback: true`)
4. Form submissions are stubbed — no inquiry data is persisted or sent (deferred client decision, spec 00)
