import type { GlobalConfig } from 'payload'

import { revalidateAfterChange } from '../lib/revalidate'

export const Blog: GlobalConfig = {
  slug: 'blog',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateAfterChange],
  },
  fields: [
    {
      name: 'heroTitle',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
