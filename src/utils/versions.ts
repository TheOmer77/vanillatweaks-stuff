import { INVALID_VERSION_MSG } from '@/constants/general';
import { MC_VERSIONS } from '@/constants/versions';
import { MinecraftVersion } from '@/types/versions';

export const checkValidVersion = (version: MinecraftVersion) => {
  if (!MC_VERSIONS.includes(version))
    throw new Error(INVALID_VERSION_MSG.replace('%version', version));
};
