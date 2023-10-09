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
