import {defineField, defineType} from 'sanity'
import {localizedText} from '../../localized'
import {requireItalian} from './validation'

export const catalogImage = defineType({
  name: 'catalogImage',
  title: 'Immagine',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({name: 'caption', title: 'Didascalia', type: 'internationalizedArrayString'}),
    defineField({
      name: 'alt',
      title: 'Descrizione accessibile',
      description: 'Descrivi ciò che mostra l’immagine per chi non può vederla.',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.custom(requireItalian),
    }),
  ],
})

export const richText = defineType({
  name: 'richText',
  title: 'Testo formattato',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        {title: 'Paragrafo', value: 'normal'},
        {title: 'Titolo', value: 'h2'},
      ],
      lists: [{title: 'Elenco puntato', value: 'bullet'}],
      marks: {
        decorators: [
          {title: 'Grassetto', value: 'strong'},
          {title: 'Corsivo', value: 'em'},
        ],
        annotations: [],
      },
    },
  ],
})

export const specification = defineType({
  name: 'specification',
  title: 'Specifica tecnica',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Caratteristica',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.custom(requireItalian),
    }),
    defineField({
      name: 'value',
      title: 'Valore',
      description: 'Includi l’unità di misura, per esempio 680 mm.',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.custom(requireItalian),
    }),
  ],
  preview: {
    select: {label: 'label', value: 'value'},
    prepare({label, value}) {
      return {title: localizedText(label) || 'Nuova specifica', subtitle: localizedText(value)}
    },
  },
})

export const seo = defineType({
  name: 'seo',
  title: 'Motori di ricerca',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Titolo SEO', type: 'internationalizedArrayString'}),
    defineField({
      name: 'description',
      title: 'Descrizione SEO',
      type: 'internationalizedArrayText',
    }),
  ],
})
