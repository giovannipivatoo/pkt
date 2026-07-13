# 01 — Home

Wireframe: `rewireframepktwebsite/wireframepktwebsite/01-PKT-Home.png`

## Sections (in order)

1. **Hero** — gray background. Left: very large title ("Titolo grande spot"), short paragraph, black pill CTA "Scopri di più" (→ Packaging Solutions). Right: image.
2. **Solutions carousel** — eyebrow "Packaging solutions", heading "Le nostre Soluzioni di Confezionamento", prev/next arrows top-right. Cards (one per category: Confezionatrici verticali, Presse, Avvolgitori): image, category name, one-line blurb, "View Now" button → category page. 3 visible on desktop.
3. **About video** — eyebrow "Chi siamo", heading "About PKT", wide video embed with play button.
4. **Blog carousel** — eyebrow "PKT Blog", heading "What's news in packaging world", 3 blog cards (shared block), side arrows + dot pagination. Sourced from latest posts.
5. **Contact section** (anchor target for "Contatti") — gray background. Left: "Contact us" heading, short tagline, form: area di interesse (select over categories + "other"), name, email, description (optional), "SEND REQUEST" button. Right: embedded map with pin on the Loria address.
6. **Logos band** (shared block).

## Data

- All section copy from the `home` global; categories (cards in §2); latest 3+ posts (§4); contact info from `site` global; map = Google Maps embed iframe of the Loria address.
- Contact form submission is a stub (deferred — see 00-site).

## Acceptance criteria

- Solutions cards are generated from the category collection — adding a category adds a card.
- Blog carousel shows the newest posts by date.
- Contact form validates name + email before submit.
- `#contatti` anchor from the nav lands on §5.
