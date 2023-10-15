import { Elysia } from 'elysia';
import {
  formatPacksList,
  getDatapacksCategories,
  packListFromCategories,
  type MinecraftVersion,
} from 'core';
import { getPacksHook } from '../hooks/packs';

const datapacksRouter = new Elysia();

datapacksRouter.get(
  '/',
  async ({ query: { version } }) =>
    formatPacksList(
      packListFromCategories(
        await getDatapacksCategories(version as MinecraftVersion)
      )
    ),
  getPacksHook
);

datapacksRouter.get('/:packId', () => {});

export default datapacksRouter;
