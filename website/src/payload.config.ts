import path from 'path'
import { fileURLToPath } from 'url'

import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { revalidatePath } from 'next/cache'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Categories } from './collections/Categories'
import { LinkedinPosts } from './collections/LinkedinPosts'
import { Machines } from './collections/Machines'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { About } from './globals/About'
import { Blog } from './globals/Blog'
import { Home } from './globals/Home'
import { Site } from './globals/Site'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Revalidate all pages when any CMS content changes. revalidatePath throws
// outside a request scope (e.g. the seed script), so swallow that case.
// ponytail: revalidates the whole site on every edit; scope per-collection if it gets slow.
const revalidateSite = () => {
  try {
    revalidatePath('/', 'layout')
  } catch {}
}

const collections = [Categories, Machines, Posts, LinkedinPosts, Media, Users].map((c) => ({
  ...c,
  hooks: {
    ...c.hooks,
    afterChange: [...(c.hooks?.afterChange ?? []), revalidateSite],
    afterDelete: [...(c.hooks?.afterDelete ?? []), revalidateSite],
  },
}))

const globals = [Home, About, Blog, Site].map((g) => ({
  ...g,
  hooks: {
    ...g.hooks,
    afterChange: [...(g.hooks?.afterChange ?? []), revalidateSite],
  },
}))

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections,
  globals,
  editor: lexicalEditor(),
  localization: {
    locales: ['it', 'en'],
    defaultLocale: 'it',
    fallback: true,
  },
  secret: process.env.PAYLOAD_SECRET || 'pkt-dev-secret-change-me',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Dev setup: SQLite file + local uploads (media/ dir).
  // Production: swap to @payloadcms/db-postgres and a storage adapter
  // (Vercel Blob or S3) here — see specs/00-site.md.
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./pkt.db',
    },
  }),
  sharp,
})
