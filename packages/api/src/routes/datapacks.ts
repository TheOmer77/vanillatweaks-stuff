import { Elysia } from 'elysia';
import {
  MinecraftVersion,
  checkValidVersion,
  formatPacksList,
  getDatapacksCategories,
  packListFromCategories,
} from 'core';
import { getResourceHook } from '../hooks';

const datapacksRouter = new Elysia();

datapacksRouter.get(
  '/',
  async ({ query: { version } }) => {
    version && checkValidVersion(version as MinecraftVersion);
    return formatPacksList(
      packListFromCategories(
        await getDatapacksCategories(version as MinecraftVersion)
      )
    );
  },
  getResourceHook
);

export default datapacksRouter;
