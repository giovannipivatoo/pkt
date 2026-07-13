import type { GlobalConfig } from 'payload'

import { revalidateAfterChange } from '../lib/revalidate'

export const About: GlobalConfig = {
  slug: 'about',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateAfterChange],
  },
  fields: [
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'lede',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'twoCol',
      type: 'group',
      fields: [
        { name: 'text', type: 'textarea', required: true, localized: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'videoUrl',
      type: 'text',
      admin: { description: 'YouTube/Vimeo embed URL' },
    },
    {
      name: 'values',
      type: 'array',
      localized: true,
      admin: { description: 'Value bullets (wireframe shows 4)' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
  ],
}
