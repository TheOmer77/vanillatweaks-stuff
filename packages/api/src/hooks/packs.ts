import { t } from 'elysia';

export const getPacksHook = {
  query: t.Object({ version: t.Optional(t.String()) }),
};
