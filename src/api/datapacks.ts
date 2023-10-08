import { api } from './instance';
import { DEFAULT_MC_VERSION } from '@/constants/versions';
import { DATAPACKS_CATEGORIES_URL, DATAPACKS_ZIP_URL } from '@/constants/api';
import type { CategoriesResponse } from '@/types/api';
import type { MinecraftVersion } from '@/types/versions';
import type { DatapacksZipSuccessResponse } from '@/types/datapacks';

export const getDatapacksCategories = async (
  version: MinecraftVersion = DEFAULT_MC_VERSION
) =>
  (
    await api.get<CategoriesResponse>(
      DATAPACKS_CATEGORIES_URL.replace('%version', version)
    )
  ).data.categories;

export const getDatapacksZipLink = async (
  version: MinecraftVersion = DEFAULT_MC_VERSION,
  packs: Record<string, string[]>
) => {
  const formData = new FormData();
  formData.append('version', version);
  formData.append('packs', JSON.stringify(packs));

  return (
    await api.post<DatapacksZipSuccessResponse>(DATAPACKS_ZIP_URL, formData)
  ).data.link;
};
