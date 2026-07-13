import Link from 'next/link'

export type BlogCardData = {
  href: string
  image: { url: string; alt: string } | null
  title: string
  excerpt: string
  date: string // pre-formatted dd.mm.yy
}

/**
 * Shared blog card (spec 00): image, title, 3-line excerpt, "LEGGI TUTTO"
 * link, date. Pure component — used on the server (home, related) and inside
 * the client-side blog index.
 */
export function BlogCard({ card, readMore }: { card: BlogCardData; readMore: string }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-ink/10 bg-white">
      {card.image && (
        <Link href={card.href} className="block aspect-[4/3] overflow-hidden bg-mist">
          {/* Local uploads in dev — plain img keeps the media pipeline simple */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={card.image.url} alt={card.image.alt} className="size-full object-cover" />
        </Link>
      )}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-bold leading-snug">
          <Link href={card.href} className="hover:underline">
            {card.title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm text-ink/70">{card.excerpt}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <Link
            href={card.href}
            className="text-xs font-bold uppercase tracking-widest underline underline-offset-4"
          >
            {readMore}
          </Link>
          <span className="text-xs text-ink/50">{card.date}</span>
        </div>
      </div>
    </article>
  )
}
