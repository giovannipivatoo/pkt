# Security — pre-launch checklist

The public Astro site is static HTML and has almost no attack surface. Sanity hosts
the Content Lake and authentication; PKT owns the Studio schema, project membership,
dataset visibility, tokens, CORS origins, webhooks, and what editors are allowed to
publish.

See `stack.md` for the architecture. The contact-form endpoint has a separate,
small server-side attack surface.

## Dataset and published content

The `production` dataset is currently **public**. That is intentional only if every
published document and asset is safe to expose through Sanity's public API, not just
through the rendered website.

- [ ] Store only public catalog/site content in Sanity. No contact submissions,
      customer data, staff notes, private documents, or other personal data.
- [ ] Treat fields omitted by the Astro templates as public too. A public dataset
      can still return them through GROQ.
- [ ] Drafts require authenticated access; verify the public build queries published
      content only and never ship a read token to the browser.
- [ ] Keep the Astro build token-free while the dataset remains public. If the
      dataset becomes private, use a least-privilege read token only in Vercel's
      server-side build environment.
- [ ] Upload only public assets. Sanity asset URLs are not a private file vault.

## Studio access

- [ ] Invite only named PKT editors; remove stale members promptly.
- [ ] Use the least-privilege Sanity role available for editors. Reserve project
      administration and schema deployment for developers/owners.
- [ ] Require strong authentication on each Sanity account and enable MFA where the
      identity provider supports it.
- [ ] Remove or restrict the Vision query tool before production if editors do not
      need arbitrary dataset queries.
- [ ] Decide the production Studio URL, then allow only that origin and the required
      local-development origin in Sanity CORS. Never add `*` with credentials.

## Secrets and integrations

- [ ] Sanity write tokens, deploy-hook URLs, webhook secrets, Resend keys, and any
      future private read token are environment-only and never committed.
- [ ] Use a fixed Sanity API version in frontend/build clients.
- [ ] Configure the Sanity publish webhook to call only the intended Vercel deploy
      hook. Verify webhook signatures for any endpoint that receives content data.
- [ ] Rotate a token or hook immediately if it appears in Git history, logs, issue
      trackers, screenshots, or client-side JavaScript.
- [ ] Review CORS origins and API tokens before launch and after every hosting change.

## Contact form

- [ ] Validate and normalize all fields server-side; browser validation is only UX.
- [ ] Enforce honeypot and per-IP rate limiting on the submission endpoint.
- [ ] Email the submission through Resend and store nothing in Sanity, logs, or a
      database. Avoid logging request bodies and email addresses.
- [ ] Return generic errors; do not expose provider responses, stack traces, or keys.

## GDPR and vendor review

- [ ] Confirm Sanity's current DPA, subprocessors, international-transfer safeguards,
      retention, deletion/export process, and contractual data-residency terms with
      PKT before launch. Do not infer legal compliance from a marketing page.
- [ ] Keep personal data out of the Content Lake. Sanity account/member information is
      still personal data and must be covered by the vendor review.
- [ ] Document the lawful basis and disclosures for Sanity, Vercel, Resend, and the
      consent-gated LinkedIn widget in the third-party legal service selected by PKT.

The public site still sets no first-party cookies. Sanity Studio authentication is
an editor-only service and does not justify adding cookies to public pages. The
LinkedIn widget remains the sole public-site cookie exception and must stay blocked
until prior consent for the production pkt.it launch. The owner explicitly approved
temporary direct loading on the GitHub Pages visual preview on 2026-09-09. That
exception is enabled through `PKT_LINKEDIN_PREVIEW=true` in its build workflow;
ordinary builds do not enable embeds. See `routes.md` for the current feed and
`sanity.md` for the proposed content model and publishing decisions.
