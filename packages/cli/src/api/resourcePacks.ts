import { isAxiosError } from 'axios';

import { stringSubst } from 'core';

import { api } from './instance';
import {
  RESOURCEPACKS_CATEGORIES_URL,
  RESOURCEPACKS_ZIP_URL,
} from '@/constants/api';
import { INVALID_RESOURCE_VERSION_MSG } from '@/constants/general';
import { DEFAULT_MC_VERSION } from '@/constants/versions';
import { RESOURCEPACKS_RESOURCE_NAME } from '@/constants/resourcePacks';
import type { CategoriesResponse, ZipSuccessResponse } from '@/types/api';
import type { MinecraftVersion } from '@/types/versions';

export const getResourcePacksCategories = async (
  version: MinecraftVersion = DEFAULT_MC_VERSION
) => {
  try {
    return (
      await api.get<CategoriesResponse>(
        stringSubst(RESOURCEPACKS_CATEGORIES_URL, { version })
      )
    ).data.categories;
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 404)
      throw new Error(
        stringSubst(INVALID_RESOURCE_VERSION_MSG, {
          resource: RESOURCEPACKS_RESOURCE_NAME,
          version,
        })
      );
    throw err;
  }
};

export const getResourcePacksZipLink = async (
  version: MinecraftVersion = DEFAULT_MC_VERSION,
  packs: Record<string, string[]>
) => {
  const formData = new FormData();
  formData.append('version', version);
  formData.append('packs', JSON.stringify(packs));

  return (await api.post<ZipSuccessResponse>(RESOURCEPACKS_ZIP_URL, formData))
    .data.link;
};
