import type { BlogCardData } from '../components/BlogCard'
import type { InquiryStrings } from '../components/InquiryForm'
import type { Post, Site } from '../payload-types'
import { formatCardDate, img } from './data'
import type { Locale } from './locale'
import { lp } from './locale'

export const postToCard = (post: Post, locale: Locale): BlogCardData => ({
  href: lp(locale, `/blog/${post.slug}`),
  image: img(post.cover),
  title: post.title,
  excerpt: post.excerpt,
  date: formatCardDate(post.date),
})

export const inquiryStrings = (ui: Site['uiStrings']): InquiryStrings => ({
  title: ui.inquiryTitle,
  subtitle: ui.inquirySubtitle,
  nameLabel: ui.inquiryNameLabel,
  contactLabel: ui.inquiryContactLabel,
  requestLabel: ui.inquiryRequestLabel,
  termsLabel: ui.inquiryTermsLabel,
  submitLabel: ui.inquirySubmitLabel,
  success: ui.inquirySuccess,
})
