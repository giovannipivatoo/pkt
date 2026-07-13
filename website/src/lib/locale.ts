export const LOCALES = ['it', 'en'] as const

export type Locale = (typeof LOCALES)[number]

export const isLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value)

/** Public href for a site path in the given locale (IT unprefixed, EN under /en). */
export const lp = (locale: Locale, path: string): string => {
  const clean = path.startsWith('/') ? path : `/${path}`
  if (locale === 'it') return clean
  return clean === '/' ? '/en' : `/en${clean}`
}
