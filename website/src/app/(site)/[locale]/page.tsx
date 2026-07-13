import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BlogCard } from '../../../components/BlogCard'
import { Carousel } from '../../../components/Carousel'
import { HomeContactForm } from '../../../components/HomeContactForm'
import { LogosBand } from '../../../components/LogosBand'
import { SectionHeading } from '../../../components/SectionHeading'
import { VideoEmbed } from '../../../components/VideoEmbed'
import { getCategories, getHomeGlobal, getPosts, getSiteGlobal, img, imgs } from '../../../lib/data'
import { isLocale, LOCALES, lp } from '../../../lib/locale'
import { postToCard } from '../../../lib/ui'

export const dynamicParams = false

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const [home, site, categories, posts] = await Promise.all([
    getHomeGlobal(locale),
    getSiteGlobal(locale),
    getCategories(locale),
    getPosts(locale),
  ])
  const ui = site.uiStrings
  const heroImage = img(home.hero.image)
  const address = `${site.contact.addressLine1}, ${site.contact.addressLine2}`

  return (
    <>
      {/* 1. Hero */}
      <section className="bg-mist">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              {home.hero.title}
            </h1>
            <p className="mt-5 max-w-md text-ink/70">{home.hero.text}</p>
            <a
              href="#soluzioni"
              className="mt-8 inline-block rounded-full bg-ink px-8 py-3 font-semibold text-white transition-opacity hover:opacity-80"
            >
              {home.hero.ctaLabel}
            </a>
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

      {/* 2. Solutions carousel — cards generated from the category collection */}
      <section id="soluzioni" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20">
        <Carousel
          arrows="header"
          header={
            <SectionHeading
              align="left"
              eyebrow={home.solutions.eyebrow}
              heading={home.solutions.heading}
            />
          }
          itemClassName="w-[85%] sm:w-[46%] md:w-[calc((100%-3rem)/3)]"
        >
          {categories.map((category) => {
            const image = img(category.heroImage)
            return (
              <article
                key={category.slug}
                className="flex h-full flex-col overflow-hidden rounded-lg border border-ink/10"
              >
                {image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image.url} alt={image.alt} className="aspect-[4/3] w-full object-cover" />
                )}
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="text-lg font-bold">{category.name}</h3>
                  <p className="line-clamp-2 text-sm text-ink/70">{category.description}</p>
                  <Link
                    href={lp(locale, `/soluzioni/${category.slug}`)}
                    className="mt-auto w-fit rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80"
                  >
                    {ui.viewNow}
                  </Link>
                </div>
              </article>
            )
          })}
        </Carousel>
      </section>

      {/* 3. About video */}
      {home.about.videoUrl && (
        <section className="mx-auto max-w-5xl px-4 pb-20">
          <SectionHeading eyebrow={home.about.eyebrow} heading={home.about.heading} />
          <div className="mt-10">
            <VideoEmbed url={home.about.videoUrl} title={home.about.heading} />
          </div>
        </section>
      )}

      {/* 4. Blog carousel — newest posts by date */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <SectionHeading eyebrow={home.blog.eyebrow} heading={home.blog.heading} />
        <div className="mt-10 px-2 sm:px-6">
          <Carousel
            arrows="sides"
            showDots
            itemClassName="w-[85%] sm:w-[46%] md:w-[calc((100%-3rem)/3)]"
          >
            {posts.slice(0, 6).map((post) => (
              <BlogCard key={post.slug} card={postToCard(post, locale)} readMore={ui.readMore} />
            ))}
          </Carousel>
        </div>
      </section>

      {/* 5. Contact section — anchor target for "Contatti" */}
      <section id="contatti" className="scroll-mt-24 bg-mist">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              {home.contact.heading}
            </h2>
            <p className="mt-2 text-ink/60">{home.contact.tagline}</p>
            <div className="mt-8">
              <HomeContactForm
                strings={{
                  areaLabel: ui.contactAreaLabel,
                  areaOther: ui.contactAreaOther,
                  nameLabel: ui.contactNameLabel,
                  emailLabel: ui.contactEmailLabel,
                  descriptionLabel: ui.contactDescriptionLabel,
                  sendLabel: home.contact.sendLabel,
                  success: ui.inquirySuccess,
                }}
                categories={categories.map((c) => ({ name: c.name, slug: c.slug }))}
              />
            </div>
          </div>
          <iframe
            src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
            title={address}
            loading="lazy"
            className="h-full min-h-80 w-full rounded-xl border-0"
          />
        </div>
      </section>

      {/* 6. Logos band */}
      <LogosBand heading={site.logosHeading} logos={imgs(site.clientLogos)} />
    </>
  )
}
