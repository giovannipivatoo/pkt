# Open questions & build order

## Blocked on PKT / the user

Nothing here should be guessed at. Ask.

- [ ] **Legal pages.** Privacy policy, cookie policy, imprint (P.IVA, registered address,
      REA). To be handled by a third-party service that guarantees compliance —
      Iubenda is the obvious Italian option (~€29–90/yr, generates and hosts the policy
      in IT/EN/DE/FR). **Not decided.** The contact form cannot legally ship without a
      privacy policy to link.
- [ ] **Cookie consent banner (NEW — required by the LinkedIn feed).** The `/feed/`
      LinkedIn widget (decided 2026-07-23) sets third-party cookies on load, so a
      site-wide prior-consent banner is now mandatory and must block the widget until
      consent. Iubenda's Cookie Solution covers this if Iubenda is chosen for legal.
      This reverses `stack.md`'s "no cookies → no consent banner" assumption — that
      chain now only holds for analytics, not for the feed. See `routes.md` → Feed.
- [ ] **DNS for pkt.it.** Who controls it? Resend needs SPF/DKIM records to send
      reliably. Potentially has a lead time — find out early.
- [ ] **Recipient inbox** for contact form emails (`info@`, `sales@`, …).
- [ ] **The old pkt.it.** Which content carries over? Which URLs must keep working
      (301 redirects)? Losing existing rankings on a cutover is the classic own-goal.
- [x] **Figma file** — supplied and inspected 2026-09-09 (`eynZ4rWjULZ5E6HhqDTU7U`). All six page mockups implemented as a local visual preview in `web/`.
- [ ] **Content and component structure** — finalize with the user. Proposed Sanity
      documents and fixed-page singleton schemas are recorded in `sanity.md`;
      they are not yet approved schemas.
- [ ] **Full production category and machine list** — initial preview seed imported:
      Confezionatrice verticale, Confezionatrice orizzontale, Presse; FPK 24/42/44
      under verticale. FPK42/44 intentionally copy FPK24 and need real sheets before launch.
- [x] Machine category relationship: exactly one category (confirmed 2026-09-09).
- [x] Machine spec table: free label/value rows per machine (confirmed 2026-09-09).
- [ ] Remaining machine fields: confirm PDFs, video, variants, gallery requirements,
      and whether downloadable files differ by language.
- [x] **Shared slugs confirmed 2026-09-10.** Category and machine slugs are identical
      across locales; only the language prefix changes.
- [ ] Does the catalog need search or filtering, or is browsing by category enough?
      Default: no search. Static site, ~50 items — a category list is sufficient.
- [x] **Sanity Studio URL:** https://pkt-cms.sanity.studio/ deployed 2026-09-10.
      Existing PKT project authentication controls access.
- [ ] **Sanity seats and plan.** Confirm the number of PKT editors and that the chosen
      plan/roles fit before inviting staff.
- [x] **Publishing workflow:** editors can publish directly; no separate approver
      requested (2026-09-09). This does not grant them project-admin privileges.
- [ ] **Feed editorial controls:** approve the real post list, ordering, featured-post
      selection and per-post heights before implementing the Sanity feed schema.

## To verify (developer, not the user)

- [ ] **Sanity vendor review:** confirm current DPA, subprocessors, international
      transfers, retention/deletion, and contractual data-residency terms. The project
      must satisfy PKT's EU-residency requirement; do not rely on assumptions.
- [ ] Confirm the public `production` dataset is acceptable. If any non-public content
      is introduced, switch it to private and use a server-only build token.
- [ ] Vercel DPA / EU data-processing terms — confirm what's needed for GDPR paperwork.

## Build order

Roughly dependency-ordered. Don't start further down until the thing above is real.

1. ~~Create Sanity project + clean standalone `studio/`.~~ Done 2026-08-25.
2. ~~Scaffold `web/` (Astro static).~~ Done; decide and deploy the Studio URL.
3. Locale config + one localized document type end to end, to prove the i18n pattern
   before it's replicated 5 times.
4. Finalize and implement the content model in `sanity.md`. Structure locked by code.
   Category and machine Studio schemas and initial preview content imported
   2026-09-10; Astro catalog integration completed the same day.
5. ~~Astro catalog fetches at build time, generates static pages per locale.~~ Done; fixed-page schemas remain open.
6. Production deploy hook wiring: Sanity publish → Vercel rebuild. GitHub Pages
   preview uses a ten-minute scheduled rebuild (user chose Pages on 2026-09-10).
7. ~~Preview components from supplied Figma screens.~~ Done; remaining category/detail designs still pending.
8. Contact form endpoint + Resend + honeypot.
9. Studio URL, custom domain, redirects from the old site, `hreflang`, sitemap.
10. Hand editors a short guide for Sanity Studio.

## Visual preview — 2026-09-09

- [x] Packaging Solutions hover/focus submenu and mobile category list: Verticali,
      Orizzontali, Presse. Home's second card corrected to Confezionatrici Orizzontali.
      Orizzontali and Presse remain unlinked until their category pages exist.
- [x] User authorized temporary direct LinkedIn embeds on the public GitHub Pages preview. Enabled only through `PKT_LINKEDIN_PREVIEW=true` (and local development); production consent remains required.
- [x] Layout audit: mobile heading clipping, mobile sample-post headers, overlapping open navigation menus, and FPK24 gallery arrow placement corrected. Verified 91 page/viewport combinations, 40 image assets, and 98 internal links/anchors; reproducible check in `web/scripts/verify-layout.mjs`.
- [x] Astro static preview of home, company, sustainability, feed, catalog and FPK24.
- [x] SocialPost approved by the user for static Figma sample posts.
- [x] Replace static samples in the public preview with the supplied full LinkedIn
      embed (commit `bc5fe11`, deployed successfully). Default non-preview builds
      still use the old static samples until consent-backed production integration.
- [ ] Replace the repeated LinkedIn test post with the approved real editorial feed.
- [x] Correct the FPK24 catalog placeholder using the FPK44 layout; all machine arrows temporarily link to FPK24 detail, as requested.
- [ ] Supply remaining category/detail designs; catalog root currently reuses the supplied confezionatrici design.
- [x] Connect category/machine CMS content; four locales use Italian fallback.
- [ ] Supply human translations and connect fixed-page editorial content.
- [ ] Activate contact submission only after the email and privacy prerequisites above are resolved.

See `web/README.md` for preview routes and intentional limitations.
- [x] GitHub Actions configuration for a shareable Pages preview (requested 2026-09-09).
- [x] Enable GitHub Pages: owner approved public repository visibility on 2026-09-09; Pages now uses GitHub Actions.

## CMS-connected preview — 2026-09-10

- [x] Hosted Studio and static Sanity catalog integration.
- [x] Separate routes for FPK24/42/44 and all three categories; home/menu links use
      published categories. Current category layout is reused with available copy.
- [x] CMS text/image/specification rendering and Portable Text; schema/runtime
      validation prevents invalid category references or duplicate routes.
- [x] Preview refresh workflow scheduled every ten minutes, plus manual dispatch.
- [ ] Production Vercel integration, immediate publish hook and pkt.it cutover.

- [x] Photo zoom requested 2026-09-10: machine and Inside PKT gallery links open a
      native dialog with Esc/button/outside-click dismissal, retaining URL, scroll
      position and focus. Small dedicated script; verified in Firefox.
