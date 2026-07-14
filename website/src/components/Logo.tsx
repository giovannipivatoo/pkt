import Link from 'next/link'

const dots = (
  <span className="flex gap-0.5" aria-hidden>
    <span className="size-1.5 rounded-full bg-accent" />
    <span className="size-1.5 rounded-full bg-accent" />
    <span className="size-1.5 rounded-full bg-accent" />
  </span>
)

const wordmark = <span className="text-2xl font-black tracking-tight">PKT</span>

/** "PKT" wordmark with the red-dots accent. `part` splits the two for the header. */
export function Logo({ href, part = 'full' }: { href: string; part?: 'full' | 'word' | 'dots' }) {
  if (part === 'dots') return dots
  return (
    <Link href={href} className="flex items-baseline gap-1.5">
      {wordmark}
      {part === 'full' && dots}
    </Link>
  )
}
