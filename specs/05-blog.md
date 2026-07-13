# 05 — Blog index

Wireframe: `rewireframepktwebsite/wireframepktwebsite/05-PKT-blog.png`

## Sections (in order)

1. **Hero** — gray background. Left: title "Packaging world blog" (from `blog` global). Right: image.
2. **Search bar** — centered, placeholder "Search for news". Client-side filter over title + excerpt. (ponytail: simple client-side filter over the rendered cards; add a search index if post count grows past a few hundred.)
3. **Post grid** — 3 columns × 4 rows of blog cards (shared block), newest first.
4. **Pagination** — prev/next arrows below the grid, 12 posts per page.

No logos band; footer directly after pagination.

## Data

- All posts, sorted by date descending.

## Acceptance criteria

- Grid drops to 2 columns then 1 as viewport narrows.
- Search narrows visible cards as you type; empty query restores all.
- Pagination hidden when posts ≤ 12.
