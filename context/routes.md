# Routes

The URL map for pkt.it. Also the routing spec for the Astro `src/pages/[lang]/…` tree.

## Rules

- **Single slug.** A path is the same string in every locale — only the `[lang]`
  prefix changes: `/it/packaging-solutions/`, `/de/packaging-solutions/`. No
  translated slugs.
- **`[lang]` is always the first segment**, from the one locale array (`it` `en`
  `de` `fr`). Every route's `getStaticPaths` fans out over it. Adding a 5th locale
  adds pages, touches no route file.
- **`it` is default.** Bare `/` redirects to `/it/`. Missing translation falls back
  to `it` content (handled in the content layer, not the route).
- Trailing slash convention: TBD (set once in `astro.config` `build.format`).

## Pages

| Path (`/[lang]/…`) | Type | Astro file | Content source |
|---|---|---|---|
| `/` (home) | fixed | `[lang]/index.astro` | `Page` (home) |
| `/pkt/` | fixed | `[lang]/pkt.astro` | `Page` (pkt) |
| `/packaging-solutions/` | list | `[lang]/packaging-solutions/index.astro` | all `Category` |
| `/packaging-solutions/[type]/` | generated | `[lang]/packaging-solutions/[type]/index.astro` | one `Category` + its `Machine`s |
| `/packaging-solutions/[type]/[machine]/` | generated | `[lang]/packaging-solutions/[type]/[machine].astro` | one `Machine` |
| `/sustainability/` | fixed | `[lang]/sustainability.astro` | `Page` (sustainability) |
| `/feed/` | list | `[lang]/feed.astro` | `Page` (feed) + LinkedIn post items — see Feed |

### Dynamic segments

- `[type]` = a `Category` slug (the "machine type", e.g. `confezionatrici`).
  `getStaticPaths` = locales × categories.
- `[machine]` = a `Machine` slug within that category.
  `getStaticPaths` = locales × machines.

### Content-model mapping

- `[type]` → **`Category`** — the `category_card` links here; the page lists its
  machines with `machine_card`.
- `[machine]` → **`Machine`** — detail page.
- Everything else → **`Page`** (fixed, code-defined structure, localized fields).

## Also needed (not user-facing pages)

- **Root redirect** `/` → `/it/` (`redirects` config, or a small `index.astro`).
- **Per-locale 404**.
- **`sitemap.xml`** + `hreflang` across the 4 locales on every page.
- **Contact form submission endpoint** — the one server-rendered route, POST target
  for the form section. e.g. `src/pages/api/contact.ts`. (See `stack.md` → contact form.)

## Not routes — behaviors

- **Contact — not a page.** The `contact_form` is a **section** embedded in selected
  pages (homepage at least). The "Contatti" nav/footer link jumps to that section on
  the current page (`#contact`); if the page has no form, it links to the homepage's
  section (`/[lang]/#contact`). Submission POSTs to the endpoint above.
- **Privacy / Cookie policy — not pages.** The footer links open a **third-party
  overlay** (Iubenda or similar) in place. No `/privacy-policy/` or `/cookie-policy/`
  route.

## Feed

`/feed/` embeds LinkedIn posts with **LinkedIn's official widget** (decided
2026-07-23). Real LinkedIn rendering, loads on page view. Editors supply post URLs;
the widget renders them.

Consequences now in scope — the widget sets third-party cookies and transfers to
LinkedIn (US) on load:

- **Site-wide cookie consent banner is now required** (GDPR/ePrivacy: non-essential
  cookies need prior consent). New work — see `todo.md`.
- **Privacy/cookie policy must disclose** the LinkedIn embed + US transfer.
- Knowingly trades against non-negotiables **#1** (zero client JS) and **#4** (no
  cookies). Accepted by the user; `AGENTS.md` reflects the exception.

## Open

- [ ] **Which pages embed the contact section?** Homepage yes — which others?
- [ ] **Legal overlay = JS.** Iubenda's overlay needs a `<script>` — another
      exception to the zero-JS rule. Confirm the service. See `todo.md` legal item.
- [ ] Trailing slash: with or without.
