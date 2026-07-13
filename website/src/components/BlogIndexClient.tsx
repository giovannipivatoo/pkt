'use client'

import { useMemo, useState } from 'react'

import type { BlogCardData } from './BlogCard'
import { BlogCard } from './BlogCard'

const PER_PAGE = 12

/**
 * Blog index interactivity (spec 05): client-side search filter over
 * title + excerpt, 3-column grid, prev/next pagination (12 per page,
 * hidden when the filtered set fits one page).
 */
export function BlogIndexClient({
  cards,
  searchPlaceholder,
  readMore,
}: {
  cards: BlogCardData[]
  searchPlaceholder: string
  readMore: string
}) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return cards
    return cards.filter(
      (c) => c.title.toLowerCase().includes(q) || c.excerpt.toLowerCase().includes(q),
    )
  }, [cards, query])

  const pageCount = Math.ceil(filtered.length / PER_PAGE)
  const current = Math.min(page, Math.max(0, pageCount - 1))
  const visible = filtered.slice(current * PER_PAGE, (current + 1) * PER_PAGE)

  return (
    <div>
      <div className="mx-auto max-w-xl">
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setPage(0)
          }}
          placeholder={searchPlaceholder}
          className="w-full rounded-full border border-ink/20 px-5 py-3"
        />
      </div>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((card) => (
          <BlogCard key={card.href} card={card} readMore={readMore} />
        ))}
      </div>
      {pageCount > 1 && (
        <div className="mt-12 flex justify-center gap-3">
          <button
            type="button"
            aria-label="Previous page"
            disabled={current === 0}
            onClick={() => setPage(current - 1)}
            className="flex size-11 items-center justify-center rounded-full border border-ink/20 disabled:opacity-30"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path d="M9 2L4 7l5 5" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next page"
            disabled={current >= pageCount - 1}
            onClick={() => setPage(current + 1)}
            className="flex size-11 items-center justify-center rounded-full border border-ink/20 disabled:opacity-30"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path d="M5 2l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
