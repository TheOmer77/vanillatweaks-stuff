import { stringSubst } from './string';
import { HttpError } from './httpError';
import { INVALID_VERSION_MSG } from '../constants/general';
import { MC_VERSIONS } from '../constants/versions';
import type { MinecraftVersion } from '../types/versions';

export const checkValidVersion = (version: MinecraftVersion) => {
  if (!MC_VERSIONS.includes(version))
    throw new HttpError(stringSubst(INVALID_VERSION_MSG, { version }), 400);
};
