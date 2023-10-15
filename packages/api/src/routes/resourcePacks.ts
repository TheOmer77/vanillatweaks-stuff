import { Elysia } from 'elysia';
import {
  MinecraftVersion,
  checkValidVersion,
  formatPacksList,
  getResourcePacksCategories,
  packListFromCategories,
} from 'core';
import { getResourceHook } from '../hooks';

const resourcePacksRouter = new Elysia();

resourcePacksRouter.get(
  '/',
  async ({ query: { version } }) => {
    version && checkValidVersion(version as MinecraftVersion);
    return formatPacksList(
      packListFromCategories(
        await getResourcePacksCategories(version as MinecraftVersion)
      )
    );
  },
  getResourceHook
);

export default resourcePacksRouter;
