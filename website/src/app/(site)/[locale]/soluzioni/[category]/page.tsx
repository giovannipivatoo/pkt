import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { LogosBand } from '../../../../../components/LogosBand'
import {
  getCategories,
  getCategoryBySlug,
  getMachinesByCategory,
  getSiteGlobal,
  img,
  imgs,
} from '../../../../../lib/data'
import { isLocale, LOCALES, lp } from '../../../../../lib/locale'

export const dynamicParams = false

export async function generateStaticParams() {
  const categories = await getCategories('it')
  return LOCALES.flatMap((locale) => categories.map((c) => ({ locale, category: c.slug })))
}

type Props = { params: Promise<{ locale: string; category: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category: slug } = await params
  if (!isLocale(locale)) return {}
  const category = await getCategoryBySlug(slug, locale)
  return { title: category ? `${category.name} — PKT` : 'PKT' }
}

export default async function CategoryPage({ params }: Props) {
  const { locale, category: slug } = await params
  if (!isLocale(locale)) notFound()

  const category = await getCategoryBySlug(slug, locale)
  if (!category) notFound()

  const [machines, site] = await Promise.all([
    getMachinesByCategory(category.id, locale),
    getSiteGlobal(locale),
  ])
  const heroImage = img(category.heroImage)

  return (
    <>
      {/* 1. Hero */}
      <section className="bg-mist">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">{category.name}</h1>
            <p className="mt-5 max-w-md text-ink/70">{category.description}</p>
          </div>
          {heroImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImage.url}
              alt={heroImage.alt}
              className="aspect-[4/3] w-full rounded-xl object-cover"
            />
          )}
        </div>
      </section>

      {/* 2. Machine list — alternating rows starting text-left; whole row links */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="space-y-16">
          {machines.map((machine, i) => {
            const image = imgs(machine.gallery)[0] ?? null
            const flipped = i % 2 === 1
            return (
              <Link
                key={machine.slug}
                href={lp(locale, `/soluzioni/${slug}/${machine.slug}`)}
                className="group grid items-center gap-8 md:grid-cols-2"
              >
                <div className={flipped ? 'md:order-2' : ''}>
                  <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                    {machine.name}
                  </h2>
                  <p className="mt-4 text-ink/70">{machine.shortDescription}</p>
                </div>
                {image && (
                  <div className={flipped ? 'md:order-1' : ''}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="aspect-[4/3] w-full rounded-xl object-cover transition-transform group-hover:scale-[1.02]"
                    />
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </section>

      {/* 3. Logos band */}
      <LogosBand heading={site.logosHeading} logos={imgs(site.clientLogos)} />
    </>
  )
}
