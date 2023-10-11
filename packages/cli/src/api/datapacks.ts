import { isAxiosError } from 'axios';

import {
  DATAPACKS_CATEGORIES_URL,
  DATAPACKS_RESOURCE_NAME,
  DATAPACKS_ZIP_URL,
  DEFAULT_MC_VERSION,
  INVALID_RESOURCE_VERSION_MSG,
  stringSubst,
  type CategoriesResponse,
  type MinecraftVersion,
  type ZipSuccessResponse,
} from 'core';

import { api } from './instance';

export const getDatapacksCategories = async (
  version: MinecraftVersion = DEFAULT_MC_VERSION
) => {
  try {
    return (
      await api.get<CategoriesResponse>(
        stringSubst(DATAPACKS_CATEGORIES_URL, { version })
      )
    ).data.categories;
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 404)
      throw new Error(
        stringSubst(INVALID_RESOURCE_VERSION_MSG, {
          resource: DATAPACKS_RESOURCE_NAME,
          version,
        })
      );
    throw err;
  }
};

export const getDatapacksZipLink = async (
  version: MinecraftVersion = DEFAULT_MC_VERSION,
  packs: Record<string, string[]>
) => {
  const formData = new FormData();
  formData.append('version', version);
  formData.append('packs', JSON.stringify(packs));

  return (await api.post<ZipSuccessResponse>(DATAPACKS_ZIP_URL, formData)).data
    .link;
};
