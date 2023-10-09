import { toKebabCase } from './string';
import type { Pack, PacksCategory } from '@/types/api';

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

export const getPacksByCategory = (
  packIds: string[],
  categories: PacksCategory[]
): Record<string, string[]> =>
  categories.reduce(
    (obj, { category, packs }) =>
      packs.some(({ name }) => packIds.includes(toKebabCase(name)))
        ? {
            ...obj,
            [toKebabCase(category)]: packs
              .filter(({ name }) => packIds.includes(toKebabCase(name)))
              .map(({ name }) => name),
          }
        : obj,
    {}
  );
