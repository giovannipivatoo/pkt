import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Carousel } from '../../../../../../components/Carousel'
import { InquiryForm } from '../../../../../../components/InquiryForm'
import { LogosBand } from '../../../../../../components/LogosBand'
import {
  getAllMachines,
  getMachineBySlug,
  getSiteGlobal,
  imgs,
} from '../../../../../../lib/data'
import { isLocale, LOCALES } from '../../../../../../lib/locale'
import { inquiryStrings } from '../../../../../../lib/ui'

export const dynamicParams = false

export async function generateStaticParams() {
  const machines = await getAllMachines('it')
  return LOCALES.flatMap((locale) =>
    machines.flatMap((m) =>
      typeof m.category === 'object'
        ? [{ locale, category: m.category.slug, machine: m.slug }]
        : [],
    ),
  )
}

type Props = { params: Promise<{ locale: string; category: string; machine: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, machine: slug } = await params
  if (!isLocale(locale)) return {}
  const machine = await getMachineBySlug(slug, locale)
  return { title: machine ? `${machine.name} — PKT` : 'PKT' }
}

export default async function MachinePage({ params }: Props) {
  const { locale, category: categorySlug, machine: machineSlug } = await params
  if (!isLocale(locale)) notFound()

  const machine = await getMachineBySlug(machineSlug, locale)
  if (
    !machine ||
    typeof machine.category !== 'object' ||
    machine.category.slug !== categorySlug
  ) {
    notFound()
  }

  const site = await getSiteGlobal(locale)
  const gallery = imgs(machine.gallery)
  const heroImage = gallery[0] ?? null

  return (
    <>
      {/* 1. Hero */}
      <section className="bg-mist">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            {machine.name}
          </h1>
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

      {/* 2. Lede */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <p className="text-xl leading-relaxed sm:text-2xl">{machine.lede}</p>
      </section>

      {/* 3. Technical information — renders the machine's ordered specs list */}
      {(machine.specs?.length ?? 0) > 0 && (
        <section className="mx-auto max-w-4xl px-4 pb-16">
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
            {site.uiStrings.technicalInformation}
          </h2>
          <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
            {machine.specs!.map((spec) => (
              <div key={spec.id} className="flex items-baseline justify-between gap-6 py-4">
                <dt className="font-medium">{spec.label}</dt>
                <dd className="text-right text-ink/70">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* 4. Gallery carousel — partial next slide visible at the right edge */}
      {gallery.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="px-2 sm:px-6">
            <Carousel arrows="sides" itemClassName="w-[80%] sm:w-[60%]">
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

      {/* 5. Inquiry form — tagged with the machine name */}
      <InquiryForm strings={inquiryStrings(site.uiStrings)} machineName={machine.name} />

      {/* 6. Logos band */}
      <LogosBand heading={site.logosHeading} logos={imgs(site.clientLogos)} />
    </>
  )
}
