import type { GlobalConfig } from 'payload'

import { revalidateAfterChange } from '../lib/revalidate'

export const Site: GlobalConfig = {
  slug: 'site',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateAfterChange],
  },
  fields: [
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'email', type: 'text', required: true },
        { name: 'addressLine1', type: 'text', required: true },
        { name: 'addressLine2', type: 'text', required: true },
      ],
    },
    {
      name: 'socials',
      type: 'group',
      fields: [
        { name: 'facebook', type: 'text' },
        { name: 'linkedin', type: 'text' },
        { name: 'x', type: 'text' },
        { name: 'instagram', type: 'text' },
      ],
    },
    {
      name: 'clientLogos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: { description: 'Supplier/client logos band above the footer' },
    },
    {
      name: 'logosHeading',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'uiStrings',
      type: 'group',
      admin: { description: 'All UI microcopy, localized' },
      fields: [
        // Navigation
        { name: 'navHome', type: 'text', required: true, localized: true },
        { name: 'navAbout', type: 'text', required: true, localized: true },
        { name: 'navSolutions', type: 'text', required: true, localized: true },
        { name: 'navBlog', type: 'text', required: true, localized: true },
        { name: 'navContacts', type: 'text', required: true, localized: true },
        // Blog card / sections
        { name: 'readMore', type: 'text', required: true, localized: true },
        { name: 'viewNow', type: 'text', required: true, localized: true },
        { name: 'relatedArticles', type: 'text', required: true, localized: true },
        { name: 'searchPlaceholder', type: 'text', required: true, localized: true },
        // Product page
        { name: 'technicalInformation', type: 'text', required: true, localized: true },
        // Inquiry form
        { name: 'inquiryTitle', type: 'text', required: true, localized: true },
        { name: 'inquirySubtitle', type: 'text', required: true, localized: true },
        { name: 'inquiryNameLabel', type: 'text', required: true, localized: true },
        { name: 'inquiryContactLabel', type: 'text', required: true, localized: true },
        { name: 'inquiryRequestLabel', type: 'text', required: true, localized: true },
        { name: 'inquiryTermsLabel', type: 'text', required: true, localized: true },
        { name: 'inquirySubmitLabel', type: 'text', required: true, localized: true },
        { name: 'inquirySuccess', type: 'text', required: true, localized: true },
        // Home contact form
        { name: 'contactAreaLabel', type: 'text', required: true, localized: true },
        { name: 'contactAreaOther', type: 'text', required: true, localized: true },
        { name: 'contactNameLabel', type: 'text', required: true, localized: true },
        { name: 'contactEmailLabel', type: 'text', required: true, localized: true },
        { name: 'contactDescriptionLabel', type: 'text', required: true, localized: true },
        // Footer
        { name: 'footerContactHeading', type: 'text', required: true, localized: true },
        { name: 'copyright', type: 'text', required: true, localized: true, admin: { description: 'Use {year} for the current year' } },
      ],
    },
  ],
}
