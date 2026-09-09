# Stack

Decisions, with the reasoning and what was rejected. If you want to change one of
these, read the "why not" column first — it was already argued.

## Connected resources

- Sanity project: **pkt** (`85609dop`)
- Sanity dataset: **production** (public)
- Studio source: `studio/` in this repository; code-managed schemas are authoritative
- GitHub repository: public `giovannipivatoo/pkt` (owner approved 2026-09-09); GitHub Pages hosts the shareable visual preview.

## Decided

| Layer | Choice | Why |
|---|---|---|
| Frontend | **Astro**, `output: 'static'` | Ships zero JS by default. Client gets plain HTML. |
| CMS | **Sanity Studio**, standalone in `studio/` | Hosted content backend, code-defined schemas, non-technical editor UI. Decision changed from Payload on 2026-08-25. |
| Content storage | **Sanity Content Lake**, dataset `production` | Managed database and asset pipeline; no Postgres or custom CMS runtime to operate. Data-residency and DPA verification remain pre-launch work. |
| File storage | **Sanity assets** for public images/documents | Keeps editorial assets beside content. Never upload private files; production video needs a dedicated streaming service. |
| Hosting | **Vercel** for the Astro site; Studio hosting URL TBD | Public pages stay static. The Studio can be deployed separately without putting a CMS runtime behind `pkt.it`. |
| Email | **Resend** | Contact form only. Needs SPF/DKIM on `pkt.it`. |
| Analytics | **None** | Nobody will read a dashboard. The consent banner exists only because the accepted LinkedIn widget sets third-party cookies. |
| Rebuild | Sanity publish webhook → Vercel deploy hook | A content publish triggers an Astro rebuild; visitors never query Sanity at runtime. |

## Rejected, and why

- **Next.js for the frontend** — hydration ships a JS bundle for pages that are pure
  content. Astro doesn't. The whole point is clean static HTML.
- **Payload 3** — previously selected for field-level localization, then replaced by
  Sanity at the user's direction on 2026-08-25. It requires operating a Next.js CMS,
  Postgres, asset storage, authentication, and API hardening that Sanity manages.
- **Storyblok** — best visual editing in class, but i18n and seats are paywalled forever.
- **Strapi / Directus** — another CMS application and database to operate, without a
  benefit that now outweighs the managed Sanity setup.
- **Git-based CMS (Keystatic, MDX in repo)** — cheapest possible, but editors would need
  git, and per-locale content becomes folder duplication. Fails requirement #2 and #3.
- **Google Analytics** — forces extra tracking and data transfers. Not worth it for a
  catalog site; the LinkedIn consent requirement is not permission to add analytics.
- **reCAPTCHA** — Google JS + a GDPR argument, for a form that will get ~10 submissions
  a month. Honeypot + rate limit first; Cloudflare Turnstile if spam ever becomes real.

## Contact form

The only PKT-owned dynamic thing on the public site.

- Fields: `name`, `company`, `email`, `message`. Plus an **unchecked** consent checkbox
  linking the privacy policy — that checkbox is the legal basis for sending the mail,
  it is not optional.
- Server endpoint (the sole non-static Astro route) → validate → send via Resend →
  **store nothing**. Never write submissions to Sanity.
- Spam: honeypot field + rate limit. Nothing else.
- Validate on the server. Client-side validation is a nicety, never the boundary.
- Dev: send to a personal Gmail via Resend's test sender until `pkt.it` DNS is set up.

## Content model (shape, not final)

See `sanity.md` for the 2026-09-09 discussion, confirmed decisions, proposed document
types, editorial limitations and unanswered questions. Studio schemas remain empty.

Roughly 6–9 categories, each with up to ~6 machines → ~40–55 machine pages.

- `Category` — name, slug, description, image, ordering
- `Machine` — exactly one category; name, slug, description, images and free
  label/value specification rows (confirmed 2026-09-09). Downloads/video/variants
  remain to be confirmed.
- `Page` — conceptual grouping for fixed pages. Separate singleton schemas were
  proposed for each page; that schema breakdown is not finalized.
- Every editorial text field is localized. Slugs are single across locales according
  to `routes.md`; the remaining stale question in `todo.md` must be resolved before
  schema work begins.

Structure is defined by the developer. Editors fill fields; they never add or reorder
page sections. Do not add a Sanity page-builder.

Editors publish directly (confirmed 2026-09-09); no approval workflow requested.
Editor count, plan and least-privilege roles remain open.

## i18n rules

- Locale list lives in **one code-owned array** shared by the Studio and Astro.
  Adding `es` is one entry, not a schema migration or a new set of documents.
- Use field-level localization with `sanity-plugin-internationalized-array`, not one
  document per locale and not localized objects that multiply schema attributes.
- URLs are locale-prefixed: `/it/...`, `/en/...`, `/de/...`, `/fr/...`.
- `it` is the default. GROQ projections use `coalesce(requested, Italian)` so missing
  translations fall back to Italian at build time.
- `hreflang` tags on every page — otherwise Google treats 4 locales as duplicate content.
- Translation is human-only. Do not install or enable Sanity AI translation tooling.
