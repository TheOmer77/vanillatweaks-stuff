import { t } from 'elysia';

import { MinecraftVersion } from 'core';
import { PACKS_QUERY_MISSING_MSG } from '../constants/general';

export const getPacksHook = {
  query: t.Object({
    version: t.Optional(t.Unsafe<MinecraftVersion>(t.String())),
  }),
};

export const downloadPacksZipHook = {
  query: t.Object({
    packs: t.String({ error: PACKS_QUERY_MISSING_MSG }),
    version: t.Optional(t.Unsafe<MinecraftVersion>(t.String())),
  }),
};
