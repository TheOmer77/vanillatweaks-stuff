import { isAxiosError } from 'axios';

import {
  CRAFTINGTWEAKS_CATEGORIES_URL,
  CRAFTINGTWEAKS_RESOURCE_NAME,
  CRAFTINGTWEAKS_ZIP_URL,
  DEFAULT_MC_VERSION,
  INVALID_RESOURCE_VERSION_MSG,
  stringSubst,
} from 'core';

import { api } from './instance';
import type { CategoriesResponse, ZipSuccessResponse } from '@/types/api';
import type { MinecraftVersion } from '@/types/versions';

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
          resource: CRAFTINGTWEAKS_RESOURCE_NAME,
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
