import { Elysia } from 'elysia';
import {
  MinecraftVersion,
  formatPacksList,
  getDatapacksCategories,
  packListFromCategories,
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

export default datapacksRouter;
