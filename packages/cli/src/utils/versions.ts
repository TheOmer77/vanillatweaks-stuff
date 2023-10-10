import { INVALID_VERSION_MSG } from '@/constants/general';
import { MC_VERSIONS } from '@/constants/versions';
import { MinecraftVersion } from '@/types/versions';
import { stringSubst } from './string';

export const checkValidVersion = (version: MinecraftVersion) => {
  if (!MC_VERSIONS.includes(version))
    throw new Error(stringSubst(INVALID_VERSION_MSG, { version }));
};
