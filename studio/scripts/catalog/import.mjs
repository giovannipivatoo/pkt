import assert from 'node:assert/strict'
import console from 'node:console'
import {readFileSync, createReadStream} from 'node:fs'
import {fileURLToPath, URL} from 'node:url'
import process from 'node:process'
import {getCliClient} from 'sanity/cli'

const source = JSON.parse(readFileSync(new URL('./source.json', import.meta.url), 'utf8'))
const client = getCliClient({apiVersion: '2026-09-10'}).withConfig({
  useCdn: false,
  perspective: 'raw',
})
assert.equal(client.config().projectId, '85609dop')
assert.equal(client.config().dataset, 'production')
assert.equal(source.categories.length, 3)
assert.equal(source.machines.length, 3)
assert.equal(source.machineTemplate.specifications.length, 6)
assert.equal(source.machineTemplate.gallery.length, 3)
const write = process.argv.includes('--write')
const verify = process.argv.includes('--verify')
const localized = (value, type = 'String') => [
  {
    _type: `internationalizedArray${type}Value`,
    _key: 'original',
    language: 'it',
    value,
  },
]
const assets = new Map()

async function upload(image) {
  if (!assets.has(image.file)) {
    const path = fileURLToPath(
      new URL(`../../../web/public/images/${image.file}`, import.meta.url),
    )
    // Sanity deduplicates identical asset bytes, including across reruns.
    const asset = await client.assets.upload('image', createReadStream(path), {
      filename: image.file,
    })
    assets.set(image.file, asset._id)
  }
  return {
    _type: 'catalogImage',
    asset: {_type: 'reference', _ref: assets.get(image.file)},
    alt: localized(image.alt),
    ...(image.caption ? {caption: localized(image.caption)} : {}),
  }
}

async function transform(input) {
  const result = {}
  for (const [key, value] of Object.entries(input)) {
    if (['name', 'pageTitle', 'subtitle'].includes(key)) result[key] = localized(value)
    else if (['heroDescription', 'introduction', 'shortDescription', 'description'].includes(key))
      result[key] = localized(value, 'Text')
    else if (['body', 'secondaryBody'].includes(key)) result[key] = localized(value, 'RichText')
    else if (['image', 'cardImage', 'detailImage'].includes(key)) result[key] = await upload(value)
    else if (key === 'gallery') {
      result[key] = []
      for (const [index, image] of value.entries())
        result[key].push({...(await upload(image)), _key: `photo${index}`})
    } else if (key === 'specifications')
      result[key] = value.map((row, index) => ({
        _type: 'specification',
        _key: `spec${index}`,
        label: localized(row.label),
        value: localized(row.value),
      }))
    else if (key === 'slug') result[key] = {_type: 'slug', current: value}
    else result[key] = value
  }
  return result
}

const existing = await client.fetch('*[_type in ["category", "machine"]]{_id,_type,slug}')
function lookup(type, slug) {
  const matches = existing.filter((doc) => doc._type === type && doc.slug?.current === slug)
  assert(matches.length <= 1, `Multiple versions of ${type}/${slug}; review before importing.`)
  assert(!matches[0]?._id.startsWith('drafts.'), `Existing draft ${slug}; review before importing.`)
  return matches[0]
}
const planned = [
  ...source.categories.map((item) => ({type: 'category', item})),
  ...source.machines.map((item) => ({type: 'machine', item})),
]
for (const {type, item} of planned) {
  assert.match(item.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  console.log(
    `${lookup(type, item.slug) ? 'KEEP' : 'CREATE'} ${type}: ${item.name || item.model} (${item.slug})`,
  )
}

if (write) {
  async function create(type, input) {
    const found = lookup(type, input.slug)
    if (found) return found
    const created = await client.create({_type: type, ...(await transform(input))})
    existing.push(created)
    console.log(`Created ${type} ${input.slug}: ${created._id}`)
    return created
  }
  let vertical
  for (const category of source.categories) {
    const doc = await create('category', category)
    if (category.slug === 'confezionatrici') vertical = doc
  }
  assert(vertical)
  for (const machine of source.machines)
    await create('machine', {
      ...source.machineTemplate,
      ...machine,
      category: {_type: 'reference', _ref: vertical._id},
    })
}

if (write || verify) {
  const documents = await client.fetch(
    '*[_type in ["category", "machine"] && slug.current in $slugs]',
    {
      slugs: planned.map(({item}) => item.slug),
    },
  )
  assert.equal(documents.length, 6)
  const vertical = documents.find(
    (doc) => doc._type === 'category' && doc.slug.current === 'confezionatrici',
  )
  assert.equal(vertical.name[0].value, 'Confezionatrice verticale')
  assert.equal(vertical.introduction[0].value, source.categories[0].introduction)
  const machines = documents.filter((doc) => doc._type === 'machine')
  assert.equal(machines.length, 3)
  const contentOnly = ({_id, _rev, _createdAt, _updatedAt, model, slug, ...content}) => content
  const assetIds = new Set()
  function inspect(value) {
    if (!value || typeof value !== 'object') return
    if (value._type === 'catalogImage') assetIds.add(value.asset._ref)
    for (const child of Object.values(value)) inspect(child)
  }
  for (const machine of machines) {
    assert.equal(machine.category._ref, vertical._id)
    assert.equal(machine.specifications.length, 6)
    assert.equal(machine.gallery.length, 3)
    assert.deepEqual(contentOnly(machine), contentOnly(machines[0]))
    assert.equal(machine.body[0].value.length, source.machineTemplate.body.length)
  }
  for (const doc of documents) inspect(doc)
  const count = await client.fetch('count(*[_type == "sanity.imageAsset" && _id in $ids])', {
    ids: [...assetIds],
  })
  assert.equal(count, assetIds.size)
  console.log(
    `Verified: 3 categories, 3 identical machine bodies, valid vertical references, ${count} image assets.`,
  )
} else
  console.log(
    'Dry run only. Add --write to upload assets and create published CMS documents; existing documents are never overwritten.',
  )
