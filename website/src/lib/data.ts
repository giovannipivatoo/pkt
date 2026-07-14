import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Category, LinkedinPost, Machine, Media, Post } from '../payload-types'
import type { Locale } from './locale'

const client = cache(() => getPayload({ config }))

export const getSiteGlobal = cache(async (locale: Locale) =>
  (await client()).findGlobal({ slug: 'site', locale, depth: 1 }),
)

export const getHomeGlobal = cache(async (locale: Locale) =>
  (await client()).findGlobal({ slug: 'home', locale, depth: 1 }),
)

export const getAboutGlobal = cache(async (locale: Locale) =>
  (await client()).findGlobal({ slug: 'about', locale, depth: 1 }),
)

export const getBlogGlobal = cache(async (locale: Locale) =>
  (await client()).findGlobal({ slug: 'blog', locale, depth: 1 }),
)

export const getCategories = cache(async (locale: Locale): Promise<Category[]> => {
  const res = await (await client()).find({
    collection: 'categories',
    locale,
    sort: 'order',
    depth: 1,
    limit: 100,
  })
  return res.docs
})

export const getCategoryBySlug = cache(
  async (slug: string, locale: Locale): Promise<Category | null> => {
    const res = await (await client()).find({
      collection: 'categories',
      locale,
      where: { slug: { equals: slug } },
      depth: 1,
      limit: 1,
    })
    return res.docs[0] ?? null
  },
)

export const getMachinesByCategory = cache(
  async (categoryId: number, locale: Locale): Promise<Machine[]> => {
    const res = await (await client()).find({
      collection: 'machines',
      locale,
      where: { category: { equals: categoryId } },
      sort: 'order',
      depth: 1,
      limit: 100,
    })
    return res.docs
  },
)

export const getAllMachines = cache(async (locale: Locale): Promise<Machine[]> => {
  const res = await (await client()).find({
    collection: 'machines',
    locale,
    sort: 'order',
    depth: 1,
    limit: 200,
  })
  return res.docs
})

export const getMachineBySlug = cache(
  async (slug: string, locale: Locale): Promise<Machine | null> => {
    const res = await (await client()).find({
      collection: 'machines',
      locale,
      where: { slug: { equals: slug } },
      depth: 1,
      limit: 1,
    })
    return res.docs[0] ?? null
  },
)

export const getPosts = cache(async (locale: Locale): Promise<Post[]> => {
  const res = await (await client()).find({
    collection: 'posts',
    locale,
    sort: '-date',
    depth: 1,
    limit: 500,
  })
  return res.docs
})

export const getLinkedinPosts = cache(async (): Promise<LinkedinPost[]> => {
  const res = await (await client()).find({
    collection: 'linkedin-posts',
    sort: '-date',
    depth: 0,
    limit: 500,
  })
  return res.docs
})

export const getPostBySlug = cache(async (slug: string, locale: Locale): Promise<Post | null> => {
  const res = await (await client()).find({
    collection: 'posts',
    locale,
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  return res.docs[0] ?? null
})

/** Narrow a populated upload field to a usable image, or null. */
export const img = (value: number | Media | null | undefined): { url: string; alt: string } | null => {
  if (!value || typeof value === 'number' || !value.url) return null
  return { url: value.url, alt: value.alt }
}

/** Narrow a hasMany upload field to usable images. */
export const imgs = (value: (number | Media)[] | null | undefined): { url: string; alt: string }[] =>
  (value ?? []).map((v) => img(v)).filter((v): v is { url: string; alt: string } => v !== null)

/** dd.mm.yy — blog card date format from the wireframes. */
export const formatCardDate = (iso: string): string => {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${String(d.getFullYear()).slice(-2)}`
}
