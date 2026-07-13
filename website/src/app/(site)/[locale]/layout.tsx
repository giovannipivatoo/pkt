import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { Footer } from '../../../components/Footer'
import { Header } from '../../../components/Header'
import { getCategories, getSiteGlobal } from '../../../lib/data'
import { isLocale } from '../../../lib/locale'
import '../globals.css'

export const metadata: Metadata = {
  title: 'PKT',
  description: 'PKT — macchine e linee complete per l’imballaggio',
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function SiteLayout({ children, params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const [site, categories] = await Promise.all([getSiteGlobal(locale), getCategories(locale)])
  const ui = site.uiStrings
  const categoryLinks = categories.map((c) => ({ name: c.name, slug: c.slug }))

  return (
    <html lang={locale}>
      <body className="flex min-h-screen flex-col">
        <Header
          locale={locale}
          strings={{
            navHome: ui.navHome,
            navAbout: ui.navAbout,
            navSolutions: ui.navSolutions,
            navBlog: ui.navBlog,
            navContacts: ui.navContacts,
          }}
          categories={categoryLinks}
        />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} site={site} categories={categoryLinks} />
      </body>
    </html>
  )
}
