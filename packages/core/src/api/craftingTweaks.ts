import { isAxiosError } from 'axios';

import { api } from './instance';
import { capitalize, stringSubst } from '../utils';
import {
  CRAFTINGTWEAKS_CATEGORIES_URL,
  CRAFTINGTWEAKS_ZIP_URL,
} from '../constants/api';
import { INVALID_RESOURCE_VERSION_MSG } from '../constants/general';
import { DEFAULT_MC_VERSION } from '../constants/versions';
import { CRAFTINGTWEAKS_RESOURCE_NAME } from '../constants/craftingTweaks';
import type {
  CategoriesResponse,
  MinecraftVersion,
  ZipSuccessResponse,
} from '../types';

export const getCraftingTweaksCategories = async (
  version: MinecraftVersion = DEFAULT_MC_VERSION
) => {
  try {
    return (
      await api.get<CategoriesResponse>(
        stringSubst(CRAFTINGTWEAKS_CATEGORIES_URL, { version })
      )
    ).data.categories;
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 404)
      throw new Error(
        stringSubst(INVALID_RESOURCE_VERSION_MSG, {
          resource: capitalize(CRAFTINGTWEAKS_RESOURCE_NAME),
          version,
        })
      );
    throw err;
  }
};

export const getCraftingTweaksZipLink = async (
  version: MinecraftVersion = DEFAULT_MC_VERSION,
  packs: Record<string, string[]>
) => {
  const formData = new FormData();
  formData.append('version', version);
  formData.append('packs', JSON.stringify(packs));

  return (await api.post<ZipSuccessResponse>(CRAFTINGTWEAKS_ZIP_URL, formData))
    .data.link;
};
