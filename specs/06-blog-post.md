# 06 — Blog post

Wireframe: `rewireframepktwebsite/wireframepktwebsite/06-PKT-blog post.png`

One page per post, generated from the post collection.

## Sections (in order)

1. **Post header** — two columns: cover image left; right column with title ("Titolo news/blog"), bold lede paragraph, body paragraphs. Wireframe shows a heart/favorite icon top-right — skip it (no user accounts to persist favorites; revisit if requested).
2. **Image carousel** — two large gallery images visible, prev/next arrows. Only rendered when the post has gallery images.
3. **Altri articoli** — centered heading + 3 blog cards (shared block): the 3 most recent other posts.

No logos band.

## Data

- Post: title, lede, body, cover, optional gallery. Related = latest 3 excluding current.

## Acceptance criteria

- Long body text flows below the two-column header without breaking layout.
- Carousel section absent (not empty) when a post has no gallery.
- Related cards never include the post being read.
