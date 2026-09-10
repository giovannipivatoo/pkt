import {defaultLocale} from '../../locales'
import type {LocalizedText} from '../../localized'

export function requireItalian(values: LocalizedText | undefined) {
  return (
    Boolean(values?.find((item) => item.language === defaultLocale)?.value?.trim()) ||
    'Inserisci il testo italiano; le altre lingue sono facoltative e usano l’italiano se vuote.'
  )
}
