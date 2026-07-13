# 03 — Product detail (scheda prodotto)

Wireframe: `rewireframepktwebsite/wireframepktwebsite/03-PKT-scheda prodotto.png`

One page per machine, generated from the machine collection. Wireframe shows "FPK 44".

## Sections (in order)

1. **Hero** — gray background. Left: machine name as large title. Right: image.
2. **Lede** — single large intro paragraph, generous margins.
3. **Technical information** — heading + spec table: one row per label/value pair, label left, value right, thin divider per row. Renders the machine's ordered `specs` list.
4. **Gallery carousel** — large square images from the machine's gallery, prev/next arrows, partial next slide visible at the right edge. Horizontal scroll view.
5. **Inquiry form** (shared block) — pre-fill or tag the request with the machine name so submissions identify the product.
6. **Logos band** (shared block).

## Data

- Machine: name, lede, specs, gallery images, category (for breadcrumb/URL).

## Acceptance criteria

- Spec table renders exactly the pairs in the machine document, in order — no hardcoded rows.
- Gallery works with 1–10 images without layout breakage.
- Inquiry form renders on the page (submission stubbed — deferred; when wired, tag submissions with the machine name).
