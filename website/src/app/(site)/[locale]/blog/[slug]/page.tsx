import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BlogCard } from '../../../../../components/BlogCard'
import { Carousel } from '../../../../../components/Carousel'
import { RichTextBody } from '../../../../../components/RichTextBody'
import { getPostBySlug, getPosts, getSiteGlobal, img, imgs } from '../../../../../lib/data'
import { isLocale, LOCALES } from '../../../../../lib/locale'
import { postToCard } from '../../../../../lib/ui'

// New CMS posts render on-demand (static after first hit); edits recompile via revalidate hooks.
export const dynamicParams = true

export async function generateStaticParams() {
  const posts = await getPosts('it')
  return LOCALES.flatMap((locale) => posts.map((p) => ({ locale, slug: p.slug })))
}

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const post = await getPostBySlug(slug, locale)
  return { title: post ? `${post.title} — PKT` : 'PKT' }
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const post = await getPostBySlug(slug, locale)
  if (!post) notFound()

  const [site, allPosts] = await Promise.all([getSiteGlobal(locale), getPosts(locale)])
  const cover = img(post.cover)
  const gallery = imgs(post.gallery)
  // Related: 3 most recent posts, never including the one being read
  const related = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <>
      {/* 1. Post header — cover left, title + bold lede right; body flows below */}
      <article className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid items-start gap-10 md:grid-cols-2">
          {cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover.url}
              alt={cover.alt}
              className="aspect-[4/3] w-full rounded-xl object-cover"
            />
          )}
          <div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{post.title}</h1>
            <p className="mt-6 text-lg font-bold leading-relaxed">{post.excerpt}</p>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-3xl">
          <RichTextBody data={post.body} />
        </div>
      </article>

      {/* 2. Image carousel — only rendered when the post has gallery images */}
      {gallery.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="px-2 sm:px-6">
            <Carousel arrows="sides" itemClassName="w-[85%] sm:w-[calc((100%-1.5rem)/2)]">
              {gallery.map((image, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={image.url}
                  alt={image.alt}
                  className="aspect-[4/3] w-full rounded-xl object-cover"
                />
              ))}
            </Carousel>
          </div>
        </section>
      )}

      {/* 3. Altri articoli */}
      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-20">
          <h2 className="text-center text-3xl font-black tracking-tight">
            {site.uiStrings.relatedArticles}
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <BlogCard key={p.slug} card={postToCard(p, locale)} readMore={site.uiStrings.readMore} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
