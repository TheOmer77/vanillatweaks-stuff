import { isAxiosError } from 'axios';

import {
  DEFAULT_MC_VERSION,
  INVALID_RESOURCE_VERSION_MSG,
  RESOURCEPACKS_CATEGORIES_URL,
  RESOURCEPACKS_RESOURCE_NAME,
  RESOURCEPACKS_ZIP_URL,
  stringSubst,
  type CategoriesResponse,
  type MinecraftVersion,
  type ZipSuccessResponse,
} from 'core';

import { api } from './instance';

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
