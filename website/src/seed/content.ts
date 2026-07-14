/**
 * Placeholder seed content (real copy TBD — lorem ipsum per the wireframes),
 * except the About page copy, which is real and comes verbatim from
 * specs/04-about.md.
 */

export const LOREM_IT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'

export const LOREM_EN =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Placeholder English copy until the final translations arrive. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'

export const CATEGORIES = [
  {
    slug: 'confezionatrici-verticali',
    order: 1,
    it: {
      name: 'Confezionatrici verticali',
      description:
        'Macchine confezionatrici verticali per sacchi e sacchetti: soluzioni flessibili per ogni esigenza di imballaggio. ' +
        LOREM_IT,
    },
    en: {
      name: 'Vertical packaging machines',
      description:
        'Vertical form-fill-seal machines for bags and sacks: flexible solutions for every packaging need. ' +
        LOREM_EN,
    },
  },
  {
    slug: 'presse',
    order: 2,
    it: {
      name: 'Presse',
      description: 'Presse per la compattazione del prodotto prima del confezionamento. ' + LOREM_IT,
    },
    en: {
      name: 'Presses',
      description: 'Presses that compact the product ahead of packaging. ' + LOREM_EN,
    },
  },
  {
    slug: 'avvolgitori',
    order: 3,
    it: {
      name: 'Avvolgitori',
      description: 'Avvolgitori per la stabilizzazione dei carichi pallettizzati. ' + LOREM_IT,
    },
    en: {
      name: 'Wrappers',
      description: 'Wrappers that stabilise palletised loads. ' + LOREM_EN,
    },
  },
]

type MachineSeed = {
  slug: string
  name: string
  category: string
  order: number
  it: { shortDescription: string; lede: string }
  en: { shortDescription: string; lede: string }
  specs: { labelIt: string; labelEn: string; value: string }[]
}

const STANDARD_SPECS = (speed: string, width: string, power: string) => [
  { labelIt: 'Velocità massima', labelEn: 'Maximum speed', value: speed },
  { labelIt: 'Larghezza bobina', labelEn: 'Reel width', value: width },
  { labelIt: 'Potenza installata', labelEn: 'Installed power', value: power },
  { labelIt: 'Aria compressa', labelEn: 'Compressed air', value: '6 bar' },
]

export const MACHINES: MachineSeed[] = [
  {
    slug: 'fpk-44',
    name: 'FPK 44',
    category: 'confezionatrici-verticali',
    order: 1,
    it: { shortDescription: 'Confezionatrice verticale ad alta velocità. ' + LOREM_IT, lede: LOREM_IT },
    en: { shortDescription: 'High-speed vertical packaging machine. ' + LOREM_EN, lede: LOREM_EN },
    specs: STANDARD_SPECS('60 sacchi/min', '1200 mm', '18 kW'),
  },
  {
    slug: 'fpk-42',
    name: 'FPK 42',
    category: 'confezionatrici-verticali',
    order: 2,
    it: { shortDescription: 'Confezionatrice verticale compatta. ' + LOREM_IT, lede: LOREM_IT },
    en: { shortDescription: 'Compact vertical packaging machine. ' + LOREM_EN, lede: LOREM_EN },
    specs: STANDARD_SPECS('45 sacchi/min', '1000 mm', '14 kW'),
  },
  {
    slug: 'fpk-48',
    name: 'FPK 48',
    category: 'confezionatrici-verticali',
    order: 3,
    it: { shortDescription: 'Confezionatrice verticale per grandi formati. ' + LOREM_IT, lede: LOREM_IT },
    en: { shortDescription: 'Large-format vertical packaging machine. ' + LOREM_EN, lede: LOREM_EN },
    specs: STANDARD_SPECS('35 sacchi/min', '1500 mm', '22 kW'),
  },
  {
    slug: 'fpk-60',
    name: 'FPK 60',
    category: 'presse',
    order: 1,
    it: { shortDescription: 'Pressa compattatrice standard. ' + LOREM_IT, lede: LOREM_IT },
    en: { shortDescription: 'Standard compacting press. ' + LOREM_EN, lede: LOREM_EN },
    specs: STANDARD_SPECS('30 cicli/min', '800 mm', '11 kW'),
  },
  {
    slug: 'fpk-65',
    name: 'FPK 65',
    category: 'presse',
    order: 2,
    it: { shortDescription: 'Pressa compattatrice ad alte prestazioni. ' + LOREM_IT, lede: LOREM_IT },
    en: { shortDescription: 'High-performance compacting press. ' + LOREM_EN, lede: LOREM_EN },
    specs: STANDARD_SPECS('40 cicli/min', '1000 mm', '15 kW'),
  },
  {
    slug: 'fpk-70',
    name: 'FPK 70',
    category: 'avvolgitori',
    order: 1,
    it: { shortDescription: 'Avvolgitore automatico per pallet. ' + LOREM_IT, lede: LOREM_IT },
    en: { shortDescription: 'Automatic pallet wrapper. ' + LOREM_EN, lede: LOREM_EN },
    specs: STANDARD_SPECS('45 pallet/ora', '500 mm', '7 kW'),
  },
  {
    slug: 'fpk-75',
    name: 'FPK 75',
    category: 'avvolgitori',
    order: 2,
    it: { shortDescription: 'Avvolgitore ad anello rotante. ' + LOREM_IT, lede: LOREM_IT },
    en: { shortDescription: 'Rotating-ring wrapper. ' + LOREM_EN, lede: LOREM_EN },
    specs: STANDARD_SPECS('90 pallet/ora', '750 mm', '12 kW'),
  },
]

// Real copy from specs/04-about.md — must appear verbatim on the page.
export const ABOUT_LEDE_IT =
  'PKT progetta produce e costruisce macchine o linee complete per l’imballaggio. La nostra filosofia aziendale è sempre stata improntata all’innovazione e alla ricerca di prodotti innovativi e semplici.'

export const ABOUT_TWOCOL_IT =
  'Due esempi di questa continua ricerca sono il sacco doppia maniglia e il bi-bag, ma basta scorrere le pagine delle nostre news per capire la velocità dello sviluppo delle soluzioni PKT.'

export const ABOUT_LEDE_EN =
  'PKT designs, manufactures and builds complete packaging machines and lines. Our company philosophy has always been driven by innovation and the pursuit of innovative, simple products.'

export const ABOUT_TWOCOL_EN =
  'Two examples of this continuous research are the double-handle bag and the bi-bag — just scroll through our news pages to see how fast PKT solutions develop.'

export const ABOUT_VALUES_IT = [
  'Progettazione specifica per le diverse esigenze del cliente.',
  'Soluzioni flessibili ed innovative.',
  'Tecnologia sempre all’avanguardia.',
  'Rete di vendita competente.',
]

export const ABOUT_VALUES_EN = [
  'Design tailored to each customer’s needs.',
  'Flexible, innovative solutions.',
  'State-of-the-art technology.',
  'A competent sales network.',
]

export const UI_STRINGS_IT = {
  navHome: 'Home',
  navAbout: 'PKT',
  navSolutions: 'Packaging Solutions',
  navBlog: 'Blog',
  navContacts: 'Contatti',
  readMore: 'Leggi tutto',
  viewNow: 'View Now',
  viewAll: 'Guarda tutto',
  relatedArticles: 'Altri articoli',
  searchPlaceholder: 'Cerca una news',
  technicalInformation: 'Informazioni tecniche',
  inquiryTitle: 'Richiedi informazioni macchinario',
  inquirySubtitle: 'È semplice e gratuito',
  inquiryNameLabel: 'Nome e cognome',
  inquiryContactLabel: 'E-mail o telefono',
  inquiryRequestLabel: 'La tua richiesta',
  inquiryTermsLabel: 'Accetto i termini e condizioni e l’informativa privacy',
  inquirySubmitLabel: 'Invia richiesta',
  inquirySuccess: 'Grazie! La tua richiesta è stata inviata.',
  contactAreaLabel: 'Area di interesse',
  contactAreaOther: 'Altro',
  contactNameLabel: 'Nome',
  contactEmailLabel: 'E-mail',
  contactDescriptionLabel: 'Descrizione (facoltativa)',
  footerContactHeading: 'Contattaci',
  copyright: 'Copyright © {year}. Tutti i diritti riservati.',
}

export const UI_STRINGS_EN = {
  navHome: 'Home',
  navAbout: 'PKT',
  navSolutions: 'Packaging Solutions',
  navBlog: 'Blog',
  navContacts: 'Contacts',
  readMore: 'Read more',
  viewNow: 'View Now',
  viewAll: 'View all',
  relatedArticles: 'More articles',
  searchPlaceholder: 'Search for news',
  technicalInformation: 'Technical information',
  inquiryTitle: 'Request machine information',
  inquirySubtitle: 'It’s free and easy',
  inquiryNameLabel: 'Full name',
  inquiryContactLabel: 'E-mail or phone',
  inquiryRequestLabel: 'Your request',
  inquiryTermsLabel: 'I accept the terms and conditions and the privacy policy',
  inquirySubmitLabel: 'Send request',
  inquirySuccess: 'Thank you! Your request has been sent.',
  contactAreaLabel: 'Area of interest',
  contactAreaOther: 'Other',
  contactNameLabel: 'Name',
  contactEmailLabel: 'E-mail',
  contactDescriptionLabel: 'Description (optional)',
  footerContactHeading: 'Contact us',
  copyright: 'Copyright © {year}. All rights reserved.',
}
