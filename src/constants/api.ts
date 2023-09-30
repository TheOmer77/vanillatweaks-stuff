import { DatapacksMCVersion } from '@/types';

export const BASE_URL = 'https://vanillatweaks.net';

export const DATAPACKS_CATEGORIES_URL = (version: DatapacksMCVersion) =>
  `${BASE_URL}/assets/resources/json/${version}/dpcategories.json`;
export const DATAPACKS_ZIP_URL = `${BASE_URL}/assets/server/zipdatapacks.php`;
