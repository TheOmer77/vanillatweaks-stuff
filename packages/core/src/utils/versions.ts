import { INVALID_VERSION_MSG } from '@/constants/general';
import { MC_VERSIONS } from '@/constants/versions';
// import { MinecraftVersion } from '@/types/versions';
import { stringSubst } from './string';

// TODO: Use MinecraftVersion type once it's been moved into core
export const checkValidVersion = (
  version: /* MinecraftVersion */ (typeof MC_VERSIONS)[number]
) => {
  if (!MC_VERSIONS.includes(version))
    throw new Error(stringSubst(INVALID_VERSION_MSG, { version }));
};
