import {createImageUrlBuilder} from '@sanity/image-url';
import {localizedText} from '../../../localized.ts';
import {defaultLocale} from '../../../locales.ts';

export {localizedText as text};
const projectId = import.meta.env?.SANITY_PROJECT_ID || '85609dop';
const dataset = import.meta.env?.SANITY_DATASET || 'production';
const images = createImageUrlBuilder({projectId, dataset});
const query = `{
  "categories": *[_type == "category"] | order(order asc, _id asc){
    _id, name, pageTitle, subtitle, heroDescription, introduction, slug, image, cardImage, seo
  },
  "machines": *[_type == "machine"] | order(order asc, model asc){
    _id, model, slug, category, subtitle, introduction, shortDescription, description,
    body, secondaryBody, image, detailImage, gallery, specifications, seo
  }
}`;

export function imageUrl(image, width = 1600, height) {
  if (!image?.asset?._ref) return undefined;
  let url = images.image(image).width(width).auto('format').fit('max');
  if (height) url = url.height(height).fit('crop');
  return url.url();
}

export function richText(values, language) {
  const nonempty = (blocks) => Array.isArray(blocks) && blocks.some(block =>
    block.children?.some(span => span.text?.trim()));
  const requested = values?.find(item => item.language === language)?.value;
  const fallback = values?.find(item => item.language === defaultLocale)?.value;
  return nonempty(requested) ? requested : nonempty(fallback) ? fallback : [];
}

export const categoryPath = (category) => `packaging-solutions/${category.slug.current}/`;
export const machinePath = (machine, category) => `${categoryPath(category)}${machine.slug.current}/`;

export function validateCatalog(catalog) {
  if (!Array.isArray(catalog?.categories) || !Array.isArray(catalog?.machines)) throw new Error('Invalid Sanity catalog response');
  const routes = new Set();
  const slug = (document) => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(document.slug?.current || '')) throw new Error(`Missing or invalid slug: ${document._id}`);
  };
  for (const category of catalog.categories) {
    slug(category);
    if (!localizedText(category.name)) throw new Error(`Missing Italian category name: ${category._id}`);
    const path = categoryPath(category);
    if (routes.has(path)) throw new Error(`Duplicate category URL: ${path}`);
    routes.add(path);
  }
  for (const machine of catalog.machines) {
    slug(machine);
    const category = catalog.categories.find(item => item._id === machine.category?._ref);
    if (!category) throw new Error(`Machine ${machine.model} has no published category`);
    if (!machine.model?.trim()) throw new Error(`Missing machine model: ${machine._id}`);
    const path = machinePath(machine, category);
    if (routes.has(path)) throw new Error(`Duplicate machine URL: ${path}`);
    routes.add(path);
  }
  return catalog;
}

async function fetchCatalog() {
  const url = new URL(`https://${projectId}.api.sanity.io/v2026-09-10/data/query/${dataset}`);
  url.searchParams.set('query', query);
  url.searchParams.set('perspective', 'published');
  const response = await fetch(url, {signal: AbortSignal.timeout(30000)});
  if (!response.ok) throw new Error(`Sanity catalog request failed (${response.status})`);
  return validateCatalog((await response.json()).result);
}

let buildCatalog;
export function getCatalog() {
  // One snapshot per static build; development refreshes read current published data.
  if (import.meta.env?.PROD) return buildCatalog ??= fetchCatalog();
  return fetchCatalog();
}
