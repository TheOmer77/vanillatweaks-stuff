import { isAxiosError } from 'axios';

import { api } from './instance';
import { INVALID_RESOURCE_VERSION_MSG } from '@/constants/general';
import { DEFAULT_MC_VERSION } from '@/constants/versions';
import { CRAFTINGTWEAKS_CATEGORIES_URL } from '@/constants/api';
import type { CategoriesResponse } from '@/types/api';
import type { MinecraftVersion } from '@/types/versions';

export const getCraftingTweaksCategories = async (
  version: MinecraftVersion = DEFAULT_MC_VERSION
) => {
  try {
    return (
      await api.get<CategoriesResponse>(
        CRAFTINGTWEAKS_CATEGORIES_URL.replace('%version', version)
      )
    ).data.categories;
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 404)
      throw new Error(
        INVALID_RESOURCE_VERSION_MSG.replace(
          '%resources',
          'Crafting tweaks'
        ).replace('%version', version)
      );
    throw err;
  }
};
