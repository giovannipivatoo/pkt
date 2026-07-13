import { notFound } from 'next/navigation'

import { Carousel } from '../../../../components/Carousel'
import { InquiryForm } from '../../../../components/InquiryForm'
import { VideoEmbed } from '../../../../components/VideoEmbed'
import { getAboutGlobal, getSiteGlobal, img, imgs } from '../../../../lib/data'
import { isLocale, LOCALES } from '../../../../lib/locale'
import { inquiryStrings } from '../../../../lib/ui'

export const dynamicParams = false

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const [about, site] = await Promise.all([getAboutGlobal(locale), getSiteGlobal(locale)])
  const heroImage = img(about.heroImage)
  const twoColImage = img(about.twoCol.image)
  const gallery = imgs(about.gallery)

  return (
    <>
      {/* 1. Hero — full-width image, no title overlay */}
      {heroImage && (
        <section className="bg-mist">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage.url}
            alt={heroImage.alt}
            className="mx-auto aspect-[21/9] w-full max-w-7xl object-cover"
          />
        </section>
      )}

      {/* 2. Lede + divider */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <p className="text-xl leading-relaxed sm:text-2xl">{about.lede}</p>
        <hr className="mt-12 border-ink/15" />
      </section>

      {/* 3. Two-column block */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 md:grid-cols-2">
        <p className="text-lg leading-relaxed text-ink/80">{about.twoCol.text}</p>
        {twoColImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={twoColImage.url}
            alt={twoColImage.alt}
            className="aspect-[4/3] w-full rounded-xl object-cover"
          />
        )}
      </section>

      {/* 4. Video */}
      {about.videoUrl && (
        <section className="mx-auto max-w-5xl px-4 pb-16">
          <VideoEmbed url={about.videoUrl} title="PKT" />
        </section>
      )}

      {/* 5. Values row — 4 → 2×2 → 1 as viewport narrows */}
      {(about.values?.length ?? 0) > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {about.values!.map((value) => (
              <li key={value.id} className="border-t-4 border-accent pt-4 font-medium">
                {value.text}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 6. Gallery carousel */}
      {gallery.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="px-2 sm:px-6">
            <Carousel arrows="sides" itemClassName="w-[70%] sm:w-[45%]">
              {gallery.map((image, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={image.url}
                  alt={image.alt}
                  className="aspect-square w-full rounded-xl object-cover"
                />
              ))}
            </Carousel>
          </div>
        </section>
      )}

      {/* 7. Inquiry form — no logos band on this page */}
      <InquiryForm strings={inquiryStrings(site.uiStrings)} />
    </>
  )
}
