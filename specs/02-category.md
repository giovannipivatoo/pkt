# 02 — Product category

Wireframe: `rewireframepktwebsite/wireframepktwebsite/02-PKT-Cat prodotti.png`

One page per category (Confezionatrici verticali, Presse, Avvolgitori), generated from the category collection. Wireframe shows "Confezionatrici verticali".

## Sections (in order)

1. **Hero** — gray background. Left: category name as large title + description paragraph. Right: image.
2. **Machine list** — one full-width row per machine in the category, alternating layout (text left / image right, then flipped). Each row: machine name (large, e.g. "FPK 44"), short description, image. Whole row links to the machine's product page. Wireframe order: FPK 44, FPK 42, FPK 48.
3. **Logos band** (shared block).

## Data

- Category (name, description, image) and its machines from the machine collection.

## Acceptance criteria

- All three category pages build from the same template.
- Machine rows alternate sides starting text-left.
- Each row navigates to `/soluzioni/{category}/{machine}` (final URL scheme set in 00-site).
- Wireframe shows a "…" loader below the list: render all machines instead — counts are small. (ponytail: no pagination; add if a category ever exceeds ~15 machines.)
