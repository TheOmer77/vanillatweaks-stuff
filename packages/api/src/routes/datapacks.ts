import { Elysia } from 'elysia';
import {
  formatPacksList,
  getDatapacksCategories,
  packListFromCategories,
  type MinecraftVersion,
} from 'core';
import { getResourceHook } from '../hooks';

const datapacksRouter = new Elysia();

datapacksRouter.get(
  '/',
  async ({ query: { version } }) =>
    formatPacksList(
      packListFromCategories(
        await getDatapacksCategories(version as MinecraftVersion)
      )
    ),
  getResourceHook
);

datapacksRouter.get('/:packId', () => {});

export default datapacksRouter;
