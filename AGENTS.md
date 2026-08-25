# PKT — website

PKT is an Italian packaging-systems manufacturer. This repo is the new **pkt.it**:
a static marketing site + machine catalog, with a hosted Sanity CMS so non-technical
staff can maintain content in 4 languages.

There is an existing pkt.it (old site). This replaces it — treat URL migration and
redirects as real work, not an afterthought.

## Shape

Two apps, one domain:

| | what | where |
|---|---|---|
| `web/` | Astro, **static output**. The public site. | `pkt.it` |
| `studio/` | Standalone Sanity Studio. Schemas + editor UI. | URL/path TBD |

Flow: editor publishes in Sanity → webhook → Vercel deploy hook → Astro
rebuilds → new static HTML on the CDN. The public site never talks to the CMS at
runtime.

## Non-negotiables

These came out of a design interview. Don't quietly trade them away.

1. **Public pages are static HTML with near-zero client JS.** The contact form is one
   exception (a server endpoint, not a SPA). The `/feed/` LinkedIn widget is a second
   (decided 2026-07-23 — see `context/routes.md` → Feed). Any *new* `<script>` still
   needs a reason; these two are the standing exceptions, not an open door.
2. **Editors are non-technical and edit content only.** Page structure and layout are
   code. Never build a page-builder, never let the CMS decide layout.
3. **Adding a 5th locale is one entry in a config array** — not a schema migration,
   not 50 new documents. Design every localized field this way.
4. **GDPR-first:** EU data residency, no analytics, no personal data at rest. The
   contact form emails and forgets. **Cookies:** none of our own — but the `/feed/`
   LinkedIn widget sets third-party cookies (decided 2026-07-23), so a prior-consent
   cookie banner is required site-wide and must block that widget until consent. This
   is the one place cookies enter; don't add more.
5. **Human translation only.** No automatic AI translation into the CMS.

## Locales

`it` (default) · `en` · `de` · `fr` — all live at launch, all human-translated by PKT staff.
Empty localized field falls back to `it` rather than rendering blank or 404ing.

## Design

Design lives in **Figma** and is owned by the user. Do not invent layouts, components,
or visual decisions — ask. Content model and component breakdown will be specified.

## Working rules

- Read `context/stack.md` before proposing a different library or approach — the
  alternatives were already considered and rejected, with reasons.
- Read `context/todo.md` for what's blocked and what's unanswered. Don't invent
  answers to open questions; add to that file instead.
- No new dependency for what a few lines can do. Native HTML/CSS before JS.
- Anything legal (privacy policy, cookie policy, imprint) is PKT's to supply via a
  third-party service. Do not draft legal text.
