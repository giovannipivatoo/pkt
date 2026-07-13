import Link from 'next/link'

import type { Locale } from '../lib/locale'
import { lp } from '../lib/locale'
import type { Site } from '../payload-types'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Logo } from './Logo'

type Props = {
  locale: Locale
  site: Site
  categories: { name: string; slug: string }[]
}

const SOCIAL_ICONS: Record<string, string> = {
  facebook: 'M14 7h-2a1 1 0 0 0-1 1v2H9v3h2v7h3v-7h2.2l.3-3H14V8.5c0-.4.2-.5.5-.5H17V5h-2.5A2.5 2.5 0 0 0 12 7.5',
  linkedin: 'M6.5 8.5A1.5 1.5 0 1 0 6.5 5a1.5 1.5 0 0 0 0 3.5ZM5 10h3v9H5v-9Zm5 0h3v1.3c.5-.8 1.5-1.5 3-1.5 2.3 0 3 1.5 3 3.7V19h-3v-4.8c0-1.1-.3-1.9-1.4-1.9-1.2 0-1.6.9-1.6 2V19h-3v-9Z',
  x: 'M5 5l6 7.5L5.2 19H7l4.8-5.4L16 19h4l-6.3-8L19.4 5h-1.8l-4.3 4.9L9 5H5Z',
  instagram: 'M8 5h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Zm4 3.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Zm0 1.7a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6ZM16.2 7a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8Z',
}

export function Footer({ locale, site, categories }: Props) {
  const ui = site.uiStrings
  const socials = Object.entries({
    facebook: site.socials?.facebook,
    linkedin: site.socials?.linkedin,
    x: site.socials?.x,
    instagram: site.socials?.instagram,
  }).filter((entry): entry is [string, string] => Boolean(entry[1]))

  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <div className="text-white [&_a]:text-white">
            <Logo href={lp(locale, '/')} />
          </div>
          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-white/60">
            {ui.footerContactHeading}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-white/80">
            <a href={`mailto:${site.contact.email}`} className="hover:underline">
              {site.contact.email}
            </a>
            <br />
            {site.contact.addressLine1}
            <br />
            {site.contact.addressLine2}
          </p>
          {socials.length > 0 && (
            <div className="mt-4 flex gap-3">
              {socials.map(([name, url]) => (
                <a
                  key={name}
                  href={url}
                  aria-label={name}
                  className="rounded-full border border-white/30 p-1.5 hover:border-white"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d={SOCIAL_ICONS[name]} />
                  </svg>
                </a>
              ))}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">
            {ui.navSolutions}
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={lp(locale, `/soluzioni/${c.slug}`)} className="text-white/80 hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">
            {ui.navAbout}
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href={lp(locale, '/pkt')} className="text-white/80 hover:text-white">
                {ui.navAbout}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">
            {ui.navBlog}
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href={lp(locale, '/blog')} className="text-white/80 hover:text-white">
                {ui.navBlog}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-5 sm:flex-row">
          <LanguageSwitcher locale={locale} />
          <p className="text-xs text-white/60">
            {ui.copyright.replace('{year}', String(new Date().getFullYear()))}
          </p>
        </div>
      </div>
    </footer>
  )
}
