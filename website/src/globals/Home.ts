import type { GlobalConfig } from 'payload'

import { revalidateAfterChange } from '../lib/revalidate'

export const Home: GlobalConfig = {
  slug: 'home',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateAfterChange],
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'text', type: 'textarea', required: true, localized: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'ctaLabel', type: 'text', required: true, localized: true },
      ],
    },
    {
      name: 'solutions',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', required: true, localized: true },
        { name: 'heading', type: 'text', required: true, localized: true },
      ],
    },
    {
      name: 'about',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', required: true, localized: true },
        { name: 'heading', type: 'text', required: true, localized: true },
        { name: 'videoUrl', type: 'text', admin: { description: 'YouTube/Vimeo embed URL' } },
      ],
    },
    {
      name: 'blog',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', required: true, localized: true },
        { name: 'heading', type: 'text', required: true, localized: true },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', required: true, localized: true },
        { name: 'tagline', type: 'text', required: true, localized: true },
        { name: 'sendLabel', type: 'text', required: true, localized: true },
      ],
    },
  ],
}
