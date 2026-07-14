'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { Locale } from '../lib/locale'
import { lp } from '../lib/locale'
import { Logo } from './Logo'

type Props = {
  locale: Locale
  strings: {
    navHome: string
    navAbout: string
    navSolutions: string
    navBlog: string
    navContacts: string
  }
  categories: { name: string; slug: string }[]
}

export function Header({ locale, strings, categories }: Props) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    const href = lp(locale, path)
    return path === '/' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)
  }

  const linkClass = (active: boolean) =>
    `py-1 text-sm font-medium border-b-2 transition-colors ${
      active ? 'border-ink' : 'border-transparent hover:border-ink/30'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-6 px-4 py-4">
        <Logo href={lp(locale, '/')} part="word" />
        <nav className="flex items-center justify-center gap-4 sm:gap-7">
          <Link href={lp(locale, '/')} className={linkClass(isActive('/'))}>
            {strings.navHome}
          </Link>
          <Link href={lp(locale, '/pkt')} className={linkClass(isActive('/pkt'))}>
            {strings.navAbout}
          </Link>
          <div className="group relative">
            <span
              className={`${linkClass(isActive('/soluzioni'))} inline-flex cursor-default items-center gap-1`}
            >
              {strings.navSolutions}
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className="mt-0.5">
                <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
            <div className="invisible absolute left-1/2 z-50 w-64 -translate-x-1/2 pt-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
              <div className="rounded-lg border border-ink/10 bg-white py-2 shadow-lg">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={lp(locale, `/soluzioni/${c.slug}`)}
                    className="block px-4 py-2 text-sm hover:bg-mist"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link href={lp(locale, '/blog')} className={linkClass(isActive('/blog'))}>
            {strings.navBlog}
          </Link>
          <Link href={`${lp(locale, '/')}#contatti`} className={linkClass(false)}>
            {strings.navContacts}
          </Link>
        </nav>
        <div className="flex justify-end">
          <Logo href={lp(locale, '/')} part="dots" />
        </div>
      </div>
    </header>
  )
}
