import { notFound } from 'next/navigation'

import { BlogIndexClient } from '../../../../components/BlogIndexClient'
import { getBlogGlobal, getPosts, getSiteGlobal, img } from '../../../../lib/data'
import { isLocale, LOCALES } from '../../../../lib/locale'
import { postToCard } from '../../../../lib/ui'

export const dynamicParams = false

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export default async function BlogIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const [blog, site, posts] = await Promise.all([
    getBlogGlobal(locale),
    getSiteGlobal(locale),
    getPosts(locale),
  ])
  const heroImage = img(blog.heroImage)

  return (
    <>
      {/* 1. Hero */}
      <section className="bg-mist">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">{blog.heroTitle}</h1>
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

      {/* 2–4. Search + grid + pagination (client-side, spec 05) */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <BlogIndexClient
          cards={posts.map((post) => postToCard(post, locale))}
          searchPlaceholder={site.uiStrings.searchPlaceholder}
          readMore={site.uiStrings.readMore}
        />
      </section>
    </>
  )
}
