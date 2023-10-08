import type { Pack, PacksCategory } from '@/types/api';

export const packListFromCategories = (categories: PacksCategory[]) =>
  categories
    .reduce((arr, { packs }) => [...arr, ...packs], [] as Pack[])
    .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
