import { t } from 'elysia';
import { MinecraftVersion } from 'core';

export const getPacksHook = {
  query: t.Object({
    version: t.Optional(t.Unsafe<MinecraftVersion>(t.String())),
  }),
};
