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

export const formatPacksList = (packs: Pack[]): PackWithId[] =>
  packs.map(({ name, display, description, ...rest }) => ({
    id: toKebabCase(name),
    name,
    display,
    description: removeHtmlTags(description.replaceAll('<br>', ' ')),
    ...rest,
  }));

export const getPacksByCategory = (
  packIds: string[],
  categories: PacksCategory[],
  parentCategory?: string
): Record<string, string[]> =>
  categories.reduce(
    (obj, { category, packs, categories: subCategories }) =>
      packs.some(({ name }) => packIds.includes(toKebabCase(name)))
        ? {
            ...obj,
            [[
              parentCategory && toKebabCase(parentCategory),
              toKebabCase(category),
            ]
              .filter(Boolean)
              .join('.')]: packs
              .filter(({ name }) => packIds.includes(toKebabCase(name)))
              .map(({ name }) => name),
            ...(subCategories
              ? getPacksByCategory(packIds, subCategories, category)
              : {}),
          }
        : obj,
    {}
  );
