import assert from 'node:assert/strict'
import console from 'node:console'
import {localizedText} from '../../localized.ts'
import {requireItalian} from '../schemaTypes/validation.ts'

const values = [
  {language: 'it', value: ' Italiano '},
  {language: 'en', value: 'English'},
  {language: 'de', value: '   '},
  {language: 'fr', value: ''},
]
assert.equal(localizedText(values, 'en'), 'English')
assert.equal(localizedText(values, 'de'), 'Italiano')
assert.equal(localizedText(values, 'fr'), 'Italiano')
assert.equal(localizedText(values, 'es'), 'Italiano')
assert.equal(localizedText(undefined), '')
assert.equal(requireItalian(values), true)
assert.equal(typeof requireItalian([{language: 'it', value: '  '}]), 'string')
assert.equal(typeof requireItalian([{language: 'en', value: 'English'}]), 'string')
assert.equal(typeof requireItalian(undefined), 'string')
console.log('Localization checks passed')
