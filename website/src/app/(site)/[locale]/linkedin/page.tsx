import { notFound } from 'next/navigation'

import { getBlogGlobal, getLinkedinPosts, img } from '../../../../lib/data'
import { isLocale, LOCALES } from '../../../../lib/locale'

// New LinkedIn posts appear without a rebuild (revalidated by the collection hook).
export const dynamicParams = false

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export default async function LinkedinBlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const [blog, posts] = await Promise.all([getBlogGlobal(locale), getLinkedinPosts()])
  const heroImage = img(blog.heroImage)

  return (
    <>
      {/* 1. Hero — reuses the blog global */}
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

      {/* 2. LinkedIn embed grid */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <iframe
              key={post.id}
              src={post.embedUrl}
              height={post.height ?? 640}
              className="w-full max-w-[504px] rounded-lg border border-ink/10"
              frameBorder="0"
              allowFullScreen
              title={post.title}
            />
          ))}
        </div>
      </section>
    </>
  )
}
