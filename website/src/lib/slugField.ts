import type { TextField } from 'payload'

/** Force a value into a URL-safe slug: lowercase, dashes, no spaces/punctuation. */
export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * Shared slug field. A space or punctuation in a slug produces an unroutable URL
 * segment (404), so we sanitize on save rather than trusting free-text input.
 */
export const slugField = (admin?: TextField['admin']): TextField => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin,
  hooks: {
    beforeValidate: [({ value }) => (typeof value === 'string' ? slugify(value) : value)],
  },
})
