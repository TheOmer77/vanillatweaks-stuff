import { t } from 'elysia';

export const getResourceHook = {
  query: t.Object({ version: t.Optional(t.String()) }),
};
