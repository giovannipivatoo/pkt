import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {defaultLocale, locales} from '../locales'

export default defineConfig({
  name: 'default',
  title: 'pkt',

  projectId: '85609dop',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    internationalizedArray({
      languages: locales.map((id) => ({
        id,
        title: new Intl.DisplayNames(['it'], {type: 'language'}).of(id) || id,
      })),
      defaultLanguages: [defaultLocale],
      fieldTypes: ['string', 'text', 'richText'],
      languageDisplay: 'titleOnly',
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
