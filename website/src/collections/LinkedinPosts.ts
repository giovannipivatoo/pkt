import type { CollectionConfig } from 'payload'

import { linkedinEmbedUrl } from '../lib/linkedinEmbed'
import { revalidateAfterChange, revalidateAfterDelete } from '../lib/revalidate'

export const LinkedinPosts: CollectionConfig = {
  slug: 'linkedin-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date'],
  },
  access: {
    read: () => true,
  },
  defaultSort: '-date',
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'Internal label for the admin list' },
    },
    {
      name: 'embedUrl',
      type: 'text',
      required: true,
      admin: {
        description:
          'Paste the LinkedIn "Embed this post" code, the post URL, or the URN — it is normalized to the embed src automatically.',
      },
      hooks: {
        beforeValidate: [({ value }) => (typeof value === 'string' ? linkedinEmbedUrl(value) : value)],
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { description: 'Sort order — newest first' },
    },
    {
      name: 'height',
      type: 'number',
      defaultValue: 640,
      admin: { description: 'Embed height in px (LinkedIn posts vary; bump if the post is clipped)' },
    },
  ],
}
