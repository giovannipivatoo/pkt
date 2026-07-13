# 00 — Site-wide spec

Source of truth for everything shared across pages. Page specs (01–06) only describe what's unique to them.

## Stack

- **Next.js** (App Router, TypeScript) with **Payload CMS** embedded in the same repo (Payload 3.x installs into the Next app; admin panel at `/admin`).
- Database: Postgres (Neon/Vercel Postgres in prod, local Postgres or SQLite adapter in dev). Media: Payload uploads via a storage adapter (Vercel Blob or S3).
- Pages statically generated; page components fetch from Payload's Local API at build time (`generateStaticParams` for machines, categories, posts). Publishing content triggers revalidation via Payload `afterChange` hooks → `revalidatePath`.
- Styling: Tailwind CSS.

## i18n

- Italian (default, no URL prefix) and English (`/en/...`) via an optional `[locale]` route segment.
- Payload localization: `locales: ['it', 'en']`, `defaultLocale: 'it'`, `localized: true` on all text/rich-text fields. One document per machine/post/category, both languages inside it.
- Language selector in footer (wireframes show "English" dropdown).
- **All text content lives in the CMS** (client decision) — including UI microcopy (button labels, nav labels, form labels), which sits in the `site` global's `uiStrings` group, localized. No translation files in the repo. EN falls back to IT for untranslated fields (`fallback: true`).

## Design tokens (low-fi — refine when brand assets arrive)

- Type: bold geometric sans for headings, regular sans for body. Very large hero headings.
- Colors: near-black text, white background, light-gray section backgrounds, red accent (logo dots). Placeholder values until brand palette is provided.
- Buttons: black pill, white text (e.g. "Scopri di più", "View Now", "Invia richiesta").
- Section rhythm: eyebrow label (small, e.g. "Packaging solutions") above a large centered heading.

## Header (all pages)

- Left: PKT wordmark. Right of nav: red dots logo accent.
- Nav: Home, PKT (→ about), Packaging Solutions, Blog, Contatti. Active page underlined.
- Packaging Solutions opens a CSS hover dropdown listing the category pages (no solutions index page exists).
- Contatti anchors to the contact section on Home (no dedicated contact page in wireframes). Confirmed by client.

## Footer (all pages)

- PKT wordmark.
- Column "Contact us": info@pkt.it, Viale Marco Biagi 28, 31037 Loria (TV). Social icons: Facebook, LinkedIn, X, Instagram.
- Link columns: Packaging solutions (one link per category), About, Blog.
- Bottom bar: language selector + "Copyright © {year}. All rights reserved."

## Shared blocks

- **Inquiry form** — "Richiedi informazioni macchinario" / "It's free and easy". Fields: full name, e-mail or phone, request (textarea), T&C + privacy checkbox. Submit: "Invia richiesta". Used on: product detail, about. Client-side required-field validation; **submission is a stub** — client decision: implementation deferred. Wire to email or an inquiries collection before launch.
- **Logos band** — "Loghi fornitori/clienti", single row of N client/supplier logos on gray background. Logos should be uploaded froom the cms. Used on: home, category, product detail.
- **Blog card** — image, 3-line excerpt, "LEGGI TUTTO" link, date (dd.mm.yy). Used on: home carousel, blog grid, related articles.

## Data model (Payload collections)

- **categories**: name*, slug, description*, hero image. Known: Confezionatrici verticali, Presse, Avvolgitori.
- **machines**: name (e.g. "FPK 44"), category (relationship), short description*, lede*, specs (array of label*/value rows), gallery (media relations).
- **posts**: title*, excerpt*, body* (rich text), date, cover image, gallery.
- **media**: Payload uploads collection (alt text* required).
Fields marked * are `localized: true`.

## Globals (per-page copy — everything editable in the CMS)

- **home**: htle*, text*, imagero (tie, ctaLabel*), solutions section (eyebrow*, heading*), about section (eyebrow*, heading*, video URL), blog section (eyebrow*, heading*), contact section (heading*, tagline*, sendLabel*).
- **about**: hero image, lede*, two-col block (text*, image), video URL, values* (array), gallery.
- **blog**: hero title*, hero image.
- **site**: contact info (email, address lines), social URLs, client logos (media array), logos band heading*, `uiStrings` group* (nav labels, LEGGI TUTTO, View Now, inquiry form title/subtitle/labels, Technical information, Altri articoli, search placeholder, copyright).

## Routes

| Route | Page |
|---|---|
| `/` | Home |
| `/pkt` | About us |
| `/soluzioni/{category}` | Category |
| `/soluzioni/{category}/{machine}` | Product detail |
| `/blog`, `/blog/{slug}` | Blog index / post |
| `/en/...` | Same tree in English |
| `/admin` | Payload admin panel |

## Acceptance criteria

- Every page renders header, footer, and its shared blocks per its spec.
- All nav/footer links resolve (no dead links).
- Pages responsive: single-column stack on mobile, wireframe layout ≥ desktop breakpoint.
- Rendered pages visually match their wireframe PNG in structure and section order.
