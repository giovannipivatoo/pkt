'use client'

import { usePathname, useRouter } from 'next/navigation'

import type { Locale } from '../lib/locale'

/**
 * Switches between the IT tree (unprefixed) and the EN tree (/en prefix),
 * staying on the equivalent page.
 */
export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const router = useRouter()

  const switchTo = (target: Locale) => {
    if (target === locale) return
    const bare = pathname === '/en' ? '/' : pathname.replace(/^\/en\//, '/')
    router.push(target === 'en' ? (bare === '/' ? '/en' : `/en${bare}`) : bare)
  }

  return (
    <select
      value={locale}
      onChange={(e) => switchTo(e.target.value as Locale)}
      aria-label="Language"
      className="rounded border border-white/30 bg-transparent px-2 py-1 text-sm"
    >
      <option value="it" className="text-ink">
        Italiano
      </option>
      <option value="en" className="text-ink">
        English
      </option>
    </select>
  )
}
