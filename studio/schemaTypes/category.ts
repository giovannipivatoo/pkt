import {defineField, defineType} from 'sanity'
import {localizedText} from '../../localized'
import {requireItalian} from './validation'

export const category = defineType({
  name: 'category',
  title: 'Categorie',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.custom(requireItalian),
    }),
    defineField({name: 'pageTitle', title: 'Titolo pagina', type: 'internationalizedArrayString'}),
    defineField({name: 'subtitle', title: 'Sottotitolo', type: 'internationalizedArrayString'}),
    defineField({
      name: 'heroDescription',
      title: 'Descrizione di apertura',
      type: 'internationalizedArrayText',
    }),
    defineField({name: 'introduction', title: 'Introduzione', type: 'internationalizedArrayText'}),
    defineField({name: 'cardImage', title: 'Immagine scheda categoria', type: 'catalogImage'}),
    defineField({
      name: 'slug',
      title: 'Slug URL',
      description:
        'Uguale in tutte le lingue. Dopo la pubblicazione, concorda le modifiche con chi gestisce i redirect.',
      type: 'slug',
      options: {
        source: (document) => localizedText(document.name as Parameters<typeof localizedText>[0]),
      },
      validation: (rule) =>
        rule
          .required()
          .custom(
            (value) =>
              !value?.current ||
              /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current) ||
              'Usa lettere minuscole, numeri e trattini.',
          ),
    }),
    defineField({name: 'image', title: 'Immagine principale', type: 'catalogImage'}),
    defineField({
      name: 'order',
      title: 'Ordine nel catalogo',
      description: 'I numeri più bassi vengono prima.',
      type: 'number',
      initialValue: 0,
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({name: 'seo', title: 'Motori di ricerca', type: 'seo'}),
  ],
  orderings: [
    {title: 'Ordine nel catalogo', name: 'catalogOrder', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {
    select: {name: 'name', media: 'image'},
    prepare({name, media}) {
      return {title: localizedText(name) || 'Nuova categoria', media}
    },
  },
})
