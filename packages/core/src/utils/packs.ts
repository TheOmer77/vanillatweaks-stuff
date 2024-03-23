import { removeHtmlTags, toKebabCase } from './string';
import { HttpError } from './httpError';
import {
  getResourcePacksCategories,
  getResourcePacksZipLink,
} from '../api/resourcePacks';
import { getDatapacksCategories, getDatapacksZipLink } from '../api/datapacks';
import {
  getCraftingTweaksCategories,
  getCraftingTweaksZipLink,
} from '../api/craftingTweaks';
import {
  CRAFTINGTWEAKS_ICON_URL,
  DATAPACKS_ICON_URL,
  RESOURCEPACKS_ICON_URL,
} from '../constants/api';
import { INVALID_PACK_TYPE_MSG, PACK_TYPES } from '../constants/general';
import { RESOURCEPACKS_RESOURCE_NAME } from '../constants/resourcePacks';
import { DATAPACKS_RESOURCE_NAME } from '../constants/datapacks';
import { CRAFTINGTWEAKS_RESOURCE_NAME } from '../constants/craftingTweaks';
import type { Pack, PackWithId, PacksCategory } from '../types/api';
import type { PackType } from '../types/packType';

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
    .sort((a, b) =>
      a.name.toLowerCase() > b.name.toLowerCase()
        ? 1
        : a.name.toLowerCase() < b.name.toLowerCase()
          ? -1
          : 0
    );

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

export const validatePackType = (packType: PackType) => {
  if (!PACK_TYPES.includes(packType))
    throw new HttpError(INVALID_PACK_TYPE_MSG, 400);
};

export const getResourceName = (packType: PackType) =>
  packType === 'resourcePack'
    ? RESOURCEPACKS_RESOURCE_NAME
    : packType === 'datapack'
      ? DATAPACKS_RESOURCE_NAME
      : CRAFTINGTWEAKS_RESOURCE_NAME;
export const getIconUrl = (packType: PackType) =>
  packType === 'resourcePack'
    ? RESOURCEPACKS_ICON_URL
    : packType === 'datapack'
      ? DATAPACKS_ICON_URL
      : CRAFTINGTWEAKS_ICON_URL;
export const getCategoriesFn = (packType: PackType) =>
  packType === 'resourcePack'
    ? getResourcePacksCategories
    : packType === 'datapack'
      ? getDatapacksCategories
      : getCraftingTweaksCategories;
export const getZipLinkFn = (packType: PackType) =>
  packType === 'resourcePack'
    ? getResourcePacksZipLink
    : packType === 'datapack'
      ? getDatapacksZipLink
      : getCraftingTweaksZipLink;
