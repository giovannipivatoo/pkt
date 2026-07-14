/**
 * Idempotent placeholder seed: `npm run seed`.
 * Creates the admin user, media, categories, machines, posts and all globals
 * in both locales. Existing documents (matched by slug/email/filename) are
 * updated in place, so re-running never duplicates content.
 */
import config from '@payload-config'
import type { Payload } from 'payload'
import { getPayload } from 'payload'
import sharp from 'sharp'

import type { Media } from '../payload-types'
import {
  ABOUT_LEDE_EN,
  ABOUT_LEDE_IT,
  ABOUT_TWOCOL_EN,
  ABOUT_TWOCOL_IT,
  ABOUT_VALUES_EN,
  ABOUT_VALUES_IT,
  CATEGORIES,
  LOREM_EN,
  LOREM_IT,
  MACHINES,
  UI_STRINGS_EN,
  UI_STRINGS_IT,
} from './content'

const context = { disableRevalidate: true }

const richText = (paragraphs: string[]) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: paragraphs.map((text) => ({
      type: 'paragraph',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: [
        { type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 },
      ],
    })),
  },
})

const placeholderPng = async (label: string, color: string, w = 1200, h = 900): Promise<Buffer> => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="100%" height="100%" fill="${color}"/>
    <text x="50%" y="50%" font-family="sans-serif" font-size="${Math.round(w / 16)}" font-weight="bold"
      fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${label}</text>
  </svg>`
  return sharp(Buffer.from(svg)).png().toBuffer()
}

const ensureMedia = async (
  payload: Payload,
  name: string,
  altIt: string,
  altEn: string,
  opts: { label: string; color: string; w?: number; h?: number },
): Promise<Media> => {
  const filename = `${name}.png`
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
  })
  if (existing.docs[0]) return existing.docs[0]

  const data = await placeholderPng(opts.label, opts.color, opts.w, opts.h)
  const doc = await payload.create({
    collection: 'media',
    locale: 'it',
    data: { alt: altIt },
    file: { data, name: filename, mimetype: 'image/png', size: data.byteLength },
    context,
  })
  await payload.update({
    collection: 'media',
    id: doc.id,
    locale: 'en',
    data: { alt: altEn },
    context,
  })
  return doc
}

const run = async () => {
  const payload = await getPayload({ config })

  // ---- Admin user -----------------------------------------------------
  const admins = await payload.find({
    collection: 'users',
    where: { email: { equals: 'admin@pkt.it' } },
    limit: 1,
  })
  if (!admins.docs[0]) {
    await payload.create({
      collection: 'users',
      data: { email: 'admin@pkt.it', password: 'pkt-admin-2026', name: 'PKT Admin' },
      context,
    })
    payload.logger.info('Created admin user admin@pkt.it')
  }

  // ---- Media ----------------------------------------------------------
  const palette = ['#4a5568', '#6b7280', '#7c8b9d', '#5f6c7b', '#84919e']
  const heroHome = await ensureMedia(payload, 'hero-home', 'Linea di confezionamento PKT', 'PKT packaging line', { label: 'PKT', color: '#37414f' })
  const heroBlog = await ensureMedia(payload, 'hero-blog', 'Packaging world blog', 'Packaging world blog', { label: 'Blog', color: '#42505f' })
  const heroAbout = await ensureMedia(payload, 'hero-about', 'Stabilimento PKT a Loria', 'PKT plant in Loria', { label: 'PKT — Loria', color: '#3d4856', w: 2100, h: 900 })
  const aboutTwoCol = await ensureMedia(payload, 'about-twocol', 'Sacco doppia maniglia', 'Double-handle bag', { label: 'Bi-bag', color: '#556274' })

  const categoryImages: Record<string, Media> = {}
  for (const [i, c] of CATEGORIES.entries()) {
    categoryImages[c.slug] = await ensureMedia(payload, `cat-${c.slug}`, c.it.name, c.en.name, {
      label: c.it.name,
      color: palette[i % palette.length],
    })
  }

  const machineImages: Record<string, Media[]> = {}
  for (const [i, m] of MACHINES.entries()) {
    const a = await ensureMedia(payload, `machine-${m.slug}-1`, m.name, m.name, { label: m.name, color: palette[i % palette.length], w: 1000, h: 1000 })
    const b = await ensureMedia(payload, `machine-${m.slug}-2`, `${m.name} — dettaglio`, `${m.name} — detail`, { label: `${m.name} ②`, color: palette[(i + 2) % palette.length], w: 1000, h: 1000 })
    const c = await ensureMedia(payload, `machine-${m.slug}-3`, `${m.name} — linea`, `${m.name} — line`, { label: `${m.name} ③`, color: palette[(i + 3) % palette.length], w: 1000, h: 1000 })
    machineImages[m.slug] = [a, b, c]
  }

  const postCovers: Media[] = []
  for (let i = 1; i <= 3; i++) {
    postCovers.push(
      await ensureMedia(payload, `post-cover-${i}`, 'Novità PKT', 'PKT news', {
        label: `News ${i}`,
        color: palette[(i + 1) % palette.length],
      }),
    )
  }

  const galleryShots: Media[] = []
  for (let i = 1; i <= 4; i++) {
    galleryShots.push(
      await ensureMedia(payload, `gallery-${i}`, 'Galleria PKT', 'PKT gallery', {
        label: `PKT ${i}`,
        color: palette[(i + 2) % palette.length],
        w: 1000,
        h: 1000,
      }),
    )
  }

  const logos: Media[] = []
  for (let i = 1; i <= 5; i++) {
    logos.push(
      await ensureMedia(payload, `logo-${i}`, `Logo cliente ${i}`, `Client logo ${i}`, {
        label: `LOGO ${i}`,
        color: '#9aa3ad',
        w: 320,
        h: 128,
      }),
    )
  }
  payload.logger.info('Media ready')

  // ---- Categories -------------------------------------------------------
  const categoryIds: Record<string, number> = {}
  for (const c of CATEGORIES) {
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: c.slug } },
      limit: 1,
    })
    const data = {
      slug: c.slug,
      order: c.order,
      name: c.it.name,
      description: c.it.description,
      heroImage: categoryImages[c.slug].id,
    }
    const doc = existing.docs[0]
      ? await payload.update({ collection: 'categories', id: existing.docs[0].id, locale: 'it', data, context })
      : await payload.create({ collection: 'categories', locale: 'it', data, context })
    await payload.update({
      collection: 'categories',
      id: doc.id,
      locale: 'en',
      data: { name: c.en.name, description: c.en.description },
      context,
    })
    categoryIds[c.slug] = doc.id
  }
  payload.logger.info('Categories ready')

  // ---- Machines -----------------------------------------------------------
  for (const m of MACHINES) {
    const existing = await payload.find({
      collection: 'machines',
      where: { slug: { equals: m.slug } },
      limit: 1,
    })
    const data = {
      slug: m.slug,
      name: m.name,
      order: m.order,
      category: categoryIds[m.category],
      shortDescription: m.it.shortDescription,
      lede: m.it.lede,
      specs: m.specs.map((s) => ({ label: s.labelIt, value: s.value })),
      gallery: machineImages[m.slug].map((img) => img.id),
    }
    const doc = existing.docs[0]
      ? await payload.update({ collection: 'machines', id: existing.docs[0].id, locale: 'it', data, context })
      : await payload.create({ collection: 'machines', locale: 'it', data, context })
    await payload.update({
      collection: 'machines',
      id: doc.id,
      locale: 'en',
      data: {
        shortDescription: m.en.shortDescription,
        lede: m.en.lede,
        specs: (doc.specs ?? []).map((row, i) => ({
          id: row.id,
          label: m.specs[i]?.labelEn ?? row.label,
          value: row.value,
        })),
      },
      context,
    })
  }
  payload.logger.info('Machines ready')

  // ---- Posts (14 — exercises the 12-per-page pagination) -----------------
  for (let i = 1; i <= 14; i++) {
    const slug = `novita-packaging-${i}`
    const existing = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    const date = new Date(Date.UTC(2026, 6, 13) - i * 9 * 24 * 60 * 60 * 1000).toISOString()
    const data = {
      slug,
      title: `Novità dal mondo del packaging ${i}`,
      excerpt: `Anteprima della news numero ${i}. ${LOREM_IT}`,
      body: richText([LOREM_IT, LOREM_IT, LOREM_IT]),
      date,
      cover: postCovers[(i - 1) % postCovers.length].id,
      // First two posts get a gallery, the rest none — exercises the
      // conditional carousel (spec 06)
      gallery: i <= 2 ? galleryShots.slice(0, 3).map((g) => g.id) : [],
    }
    const doc = existing.docs[0]
      ? await payload.update({ collection: 'posts', id: existing.docs[0].id, locale: 'it', data, context })
      : await payload.create({ collection: 'posts', locale: 'it', data, context })
    await payload.update({
      collection: 'posts',
      id: doc.id,
      locale: 'en',
      data: {
        title: `News from the packaging world ${i}`,
        excerpt: `Preview of news item ${i}. ${LOREM_EN}`,
        body: richText([LOREM_EN, LOREM_EN, LOREM_EN]),
      },
      context,
    })
  }
  payload.logger.info('Posts ready')

  // ---- LinkedIn posts -----------------------------------------------------
  for (const [i, urn] of ['urn:li:share:7480866676188606464'].entries()) {
    const embedUrl = `https://www.linkedin.com/embed/feed/update/${urn}`
    const existing = await payload.find({
      collection: 'linkedin-posts',
      where: { embedUrl: { equals: embedUrl } },
      limit: 1,
    })
    const data = {
      title: `LinkedIn post ${i + 1}`,
      embedUrl,
      date: new Date(Date.UTC(2026, 6, 13) - i * 24 * 60 * 60 * 1000).toISOString(),
      height: 855,
    }
    existing.docs[0]
      ? await payload.update({ collection: 'linkedin-posts', id: existing.docs[0].id, data, context })
      : await payload.create({ collection: 'linkedin-posts', data, context })
  }
  payload.logger.info('LinkedIn posts ready')

  // ---- Globals ------------------------------------------------------------
  const video = 'https://www.youtube.com/embed/dQw4w9WgXcQ'

  await payload.updateGlobal({
    slug: 'home',
    locale: 'it',
    data: {
      hero: { title: 'Macchine e linee complete per l’imballaggio', text: LOREM_IT, image: heroHome.id, ctaLabel: 'Scopri di più' },
      solutions: { eyebrow: 'Packaging solutions', heading: 'Le nostre Soluzioni di Confezionamento' },
      about: { eyebrow: 'Chi siamo', heading: 'About PKT', videoUrl: video },
      blog: { eyebrow: 'PKT Blog', heading: 'What’s news in packaging world' },
      contact: { heading: 'Contattaci', tagline: 'Siamo a tua disposizione per ogni esigenza.', sendLabel: 'Invia richiesta' },
    },
    context,
  })
  await payload.updateGlobal({
    slug: 'home',
    locale: 'en',
    data: {
      hero: { title: 'Complete packaging machines and lines', text: LOREM_EN, image: heroHome.id, ctaLabel: 'Learn more' },
      solutions: { eyebrow: 'Packaging solutions', heading: 'Our Packaging Solutions' },
      about: { eyebrow: 'Who we are', heading: 'About PKT', videoUrl: video },
      blog: { eyebrow: 'PKT Blog', heading: 'What’s news in packaging world' },
      contact: { heading: 'Contact us', tagline: 'We are at your disposal for any need.', sendLabel: 'Send request' },
    },
    context,
  })

  await payload.updateGlobal({
    slug: 'about',
    locale: 'it',
    data: {
      heroImage: heroAbout.id,
      lede: ABOUT_LEDE_IT,
      twoCol: { text: ABOUT_TWOCOL_IT, image: aboutTwoCol.id },
      videoUrl: video,
      values: ABOUT_VALUES_IT.map((text) => ({ text })),
      gallery: galleryShots.map((g) => g.id),
    },
    context,
  })
  await payload.updateGlobal({
    slug: 'about',
    locale: 'en',
    data: {
      lede: ABOUT_LEDE_EN,
      twoCol: { text: ABOUT_TWOCOL_EN },
      values: ABOUT_VALUES_EN.map((text) => ({ text })),
    },
    context,
  })

  await payload.updateGlobal({
    slug: 'blog',
    locale: 'it',
    data: { heroTitle: 'Packaging world blog', heroImage: heroBlog.id },
    context,
  })
  await payload.updateGlobal({
    slug: 'blog',
    locale: 'en',
    data: { heroTitle: 'Packaging world blog' },
    context,
  })

  const siteShared = {
    contact: { email: 'info@pkt.it', addressLine1: 'Viale Marco Biagi 28', addressLine2: '31037 Loria (TV)' },
    socials: {
      facebook: 'https://www.facebook.com/pkt',
      linkedin: 'https://www.linkedin.com/company/pkt',
      x: 'https://x.com/pkt',
      instagram: 'https://www.instagram.com/pkt',
    },
    clientLogos: logos.map((l) => l.id),
  }
  await payload.updateGlobal({
    slug: 'site',
    locale: 'it',
    data: { ...siteShared, logosHeading: 'I nostri clienti e fornitori', uiStrings: UI_STRINGS_IT },
    context,
  })
  await payload.updateGlobal({
    slug: 'site',
    locale: 'en',
    data: { logosHeading: 'Our clients and suppliers', uiStrings: UI_STRINGS_EN },
    context,
  })
  payload.logger.info('Globals ready')

  payload.logger.info('Seed complete ✔')
  process.exit(0)
}

// Top-level await keeps the event loop alive until the seed finishes —
// a floating run().catch() would let `payload run` exit before any work happens.
try {
  await run()
} catch (err) {
  console.error(err)
  process.exit(1)
}
