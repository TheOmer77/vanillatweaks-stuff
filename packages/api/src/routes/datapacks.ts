import { Elysia } from 'elysia';

import {
  formatPacksList,
  getDatapacksCategories,
  packListFromCategories,
} from 'core';
import { getPacksHook } from '../hooks/packs';

const datapacksRouter = new Elysia();

datapacksRouter.get(
  '/',
  async ({ query: { version } }) =>
    formatPacksList(
      packListFromCategories(await getDatapacksCategories(version))
    ),
  getPacksHook
);

datapacksRouter.get('/:packId', () => {});

export default datapacksRouter;
