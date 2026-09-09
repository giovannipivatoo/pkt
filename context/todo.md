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
- [ ] **Content and component structure** — user will specify.
- [ ] **Category and machine list** — real names, real counts.
- [ ] Machine page fields: spec table format? PDF datasheets? video? photo gallery?
- [ ] **Resolve the stale slug decision.** `routes.md` already specifies one slug in
      every locale, while the old content-model notes left it open. Confirm the
      single-slug rule before the Sanity schema is written.
- [ ] Does the catalog need search or filtering, or is browsing by category enough?
      Default: no search. Static site, ~50 items — a category list is sufficient.
- [ ] **Sanity Studio production URL.** Use Sanity's hosted Studio domain, a dedicated
      subdomain, or a `/admin` route/proxy? Do not assume the old Payload rewrite.
- [ ] **Sanity seats and plan.** Confirm the number of PKT editors and that the chosen
      plan/roles fit before inviting staff.

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
2. Scaffold `web/` (Astro static); decide and deploy the Studio URL.
3. Locale config + one localized document type end to end, to prove the i18n pattern
   before it's replicated 5 times.
4. Content model: `Category`, `Machine`, `Page`. Structure locked by code.
5. Astro fetches at build time, generates static pages per locale.
6. Deploy hook wiring: Sanity publish → site rebuild.
7. Components from Figma.
8. Contact form endpoint + Resend + honeypot.
9. Studio URL, custom domain, redirects from the old site, `hreflang`, sitemap.
10. Hand editors a short guide for Sanity Studio.

## Visual preview — 2026-09-09

- [x] Astro static preview of home, company, sustainability, feed, catalog and FPK24.
- [x] SocialPost approved by the user for static Figma sample posts.
- [ ] Replace Figma social sample copy.
- [x] Correct the FPK24 catalog placeholder using the FPK44 layout; all machine arrows temporarily link to FPK24 detail, as requested.
- [ ] Supply remaining category/detail designs; catalog root currently reuses the supplied confezionatrici design.
- [ ] Connect approved CMS content and human translations; the preview currently uses Italian fallback copy.
- [ ] Activate contact submission only after the email and privacy prerequisites above are resolved.

See `web/README.md` for preview routes and intentional limitations.
- [x] GitHub Actions configuration for a shareable Pages preview (requested 2026-09-09).
- [x] Enable GitHub Pages: owner approved public repository visibility on 2026-09-09; Pages now uses GitHub Actions.
