import { removeHtmlTags, toKebabCase } from './string';
import type { Pack, PackWithId, PacksCategory } from '../types/api';

export const packListFromCategories = (categories: PacksCategory[]): Pack[] =>
  categories
    .reduce(
      (arr, { packs, categories }) => [
        ...arr,
        ...packs,
        ...(Array.isArray(categories)
          ? packListFromCategories(categories)
          : []),
      ],
      [] as Pack[]
    )
    .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));

export const packListWithIds = (packs: Pack[]): PackWithId[] =>
  packs.map(
    ({ name, display, description, version, incompatible, ...rest }) => ({
      id: toKebabCase(name),
      name,
      display,
      description: removeHtmlTags(description.replaceAll('<br>', ' ')),
      version,
      incompatible: incompatible.map(toKebabCase),
      ...rest,
    })
  );

export const getPacksByCategory = (
  packIds: string[],
  categories: PacksCategory[],
  parentCategory?: string
): Record<string, string[]> =>
  categories.reduce(
    (obj, { category, packs, categories: subCategories }) =>
      packListWithIds(packs).some(({ id }) => packIds.includes(id))
        ? {
            ...obj,
            [[
              parentCategory && toKebabCase(parentCategory),
              toKebabCase(category),
            ]
              .filter(Boolean)
              .join('.')]: packListWithIds(packs)
              .filter(({ id }) => packIds.includes(id))
              .map(({ name }) => name),
            ...(subCategories
              ? getPacksByCategory(packIds, subCategories, category)
              : {}),
          }
        : obj,
    {}
  );
