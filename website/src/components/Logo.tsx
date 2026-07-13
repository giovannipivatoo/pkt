import Link from 'next/link'

/** "PKT" wordmark with the red-dots accent from the wireframes. */
export function Logo({ href }: { href: string }) {
  return (
    <Link href={href} className="flex items-baseline gap-1.5">
      <span className="text-2xl font-black tracking-tight">PKT</span>
      <span className="flex gap-0.5" aria-hidden>
        <span className="size-1.5 rounded-full bg-accent" />
        <span className="size-1.5 rounded-full bg-accent" />
        <span className="size-1.5 rounded-full bg-accent" />
      </span>
    </Link>
  )
}
