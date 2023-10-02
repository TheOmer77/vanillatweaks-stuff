import { api } from './instance';
import {
  DATAPACKS_CATEGORIES_URL,
  DATAPACKS_DEFAULT_MC_VERSION,
  DATAPACKS_ZIP_URL,
} from '@/constants';
import type {
  DatapacksCategoriesResponse,
  DatapacksMCVersion,
  DatapacksZipSuccessResponse,
} from '@/types/datapacks';

export const fetchDatapacksCategories = async (
  version: DatapacksMCVersion = DATAPACKS_DEFAULT_MC_VERSION
) =>
  (
    await api.get<DatapacksCategoriesResponse>(
      DATAPACKS_CATEGORIES_URL.replace('%version', version)
    )
  ).data.categories;

export const getDatapacksZipLink = async (
  version: DatapacksMCVersion = DATAPACKS_DEFAULT_MC_VERSION,
  packs: Record<string, string[]>
) => {
  const formData = new FormData();
  formData.append('version', version);
  formData.append('packs', JSON.stringify(packs));

  return (
    await api.post<DatapacksZipSuccessResponse>(DATAPACKS_ZIP_URL, formData)
  ).data.link;
};
