import { isAxiosError } from 'axios';

import { api } from './instance';
import { INVALID_RESOURCE_VERSION_MSG } from '@/constants/general';
import { DEFAULT_MC_VERSION } from '@/constants/versions';
import { DATAPACKS_CATEGORIES_URL, DATAPACKS_ZIP_URL } from '@/constants/api';
import type { CategoriesResponse, ZipSuccessResponse } from '@/types/api';
import type { MinecraftVersion } from '@/types/versions';

export const getDatapacksCategories = async (
  version: MinecraftVersion = DEFAULT_MC_VERSION
) => {
  try {
    return (
      await api.get<CategoriesResponse>(
        DATAPACKS_CATEGORIES_URL.replace('%version', version)
      )
    ).data.categories;
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 404)
      throw new Error(
        INVALID_RESOURCE_VERSION_MSG.replace('%resources', 'Datapacks').replace(
          '%version',
          version
        )
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
