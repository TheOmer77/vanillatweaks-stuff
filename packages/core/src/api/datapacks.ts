import { isAxiosError } from 'axios';

import { api } from './instance';
import { stringSubst } from '../utils/string';
import { DATAPACKS_CATEGORIES_URL, DATAPACKS_ZIP_URL } from '../constants/api';
import { INVALID_RESOURCE_VERSION_MSG } from '../constants/general';
import { DEFAULT_MC_VERSION } from '../constants/versions';
import { DATAPACKS_RESOURCE_NAME } from '../constants/datapacks';
import type { CategoriesResponse, ZipSuccessResponse } from '../types/api';
import type { MinecraftVersion } from '../types/versions';

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
