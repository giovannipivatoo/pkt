import {defineArrayMember, defineField, defineType} from 'sanity'
import {localizedText} from '../../localized'

export const machine = defineType({
  name: 'machine',
  title: 'Macchine',
  type: 'document',
  groups: [
    {name: 'content', title: 'Contenuti', default: true},
    {name: 'technical', title: 'Dati tecnici'},
    {name: 'seo', title: 'Motori di ricerca'},
  ],
  fields: [
    defineField({
      name: 'model',
      title: 'Modello',
      description: 'Nome commerciale condiviso tra le lingue, per esempio FPK24.',
      type: 'string',
      group: 'content',
      validation: (rule) =>
        rule.required().custom((value) => Boolean(value?.trim()) || 'Inserisci il modello.'),
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'reference',
      to: [{type: 'category'}],
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug URL',
      description:
        'Uguale in tutte le lingue. Cambiare slug o categoria dopo la pubblicazione richiede i redirect dei vecchi URL.',
      type: 'slug',
      group: 'content',
      options: {source: 'model'},
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
    defineField({
      name: 'shortDescription',
      title: 'Descrizione breve',
      type: 'internationalizedArrayText',
      group: 'content',
    }),
    defineField({
      name: 'subtitle',
      title: 'Sottotitolo',
      type: 'internationalizedArrayString',
      group: 'content',
    }),
    defineField({
      name: 'introduction',
      title: 'Introduzione pagina',
      type: 'internationalizedArrayText',
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Approfondimento principale',
      type: 'internationalizedArrayRichText',
      group: 'content',
    }),
    defineField({
      name: 'secondaryBody',
      title: 'Approfondimento aggiuntivo',
      type: 'internationalizedArrayRichText',
      group: 'content',
    }),
    defineField({
      name: 'detailImage',
      title: 'Immagine accanto alle specifiche',
      type: 'catalogImage',
      group: 'content',
    }),
    defineField({
      name: 'gallery',
      title: 'Galleria',
      type: 'array',
      of: [defineArrayMember({type: 'catalogImage'})],
      group: 'content',
    }),
    defineField({
      name: 'description',
      title: 'Descrizione completa',
      type: 'internationalizedArrayText',
      group: 'content',
    }),
    defineField({
      name: 'image',
      title: 'Immagine principale',
      type: 'catalogImage',
      group: 'content',
    }),
    defineField({
      name: 'order',
      title: 'Ordine nella categoria',
      description: 'I numeri più bassi vengono prima.',
      type: 'number',
      initialValue: 0,
      group: 'content',
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'specifications',
      title: 'Specifiche tecniche',
      description: 'Aggiungi e riordina le righe della tabella di questa macchina.',
      type: 'array',
      of: [defineArrayMember({type: 'specification'})],
      group: 'technical',
    }),
    defineField({name: 'seo', title: 'Motori di ricerca', type: 'seo', group: 'seo'}),
  ],
  orderings: [
    {
      title: 'Ordine nella categoria',
      name: 'catalogOrder',
      by: [
        {field: 'order', direction: 'asc'},
        {field: 'model', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {title: 'model', categoryName: 'category.name', media: 'image'},
    prepare({title, categoryName, media}) {
      return {title: title || 'Nuova macchina', subtitle: localizedText(categoryName), media}
    },
  },
})
