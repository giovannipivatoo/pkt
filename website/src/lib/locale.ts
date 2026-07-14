export const LOCALES = ['it', 'en'] as const

export type Locale = (typeof LOCALES)[number]

export const isLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value)

// Static export has no middleware, so IT can't live at the root — it moves
// under /it like EN. The running app keeps IT unprefixed.
const EXPORT = process.env.NEXT_PUBLIC_EXPORT === '1'

/** Public href for a site path in the given locale (IT unprefixed, EN under /en). */
export const lp = (locale: Locale, path: string): string => {
  const clean = path.startsWith('/') ? path : `/${path}`
  if (locale === 'it') {
    if (!EXPORT) return clean
    return clean === '/' ? '/it' : `/it${clean}`
  }
  return clean === '/' ? '/en' : `/en${clean}`
}
