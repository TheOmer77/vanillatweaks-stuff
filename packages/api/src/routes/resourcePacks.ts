import { Elysia } from 'elysia';
import {
  MinecraftVersion,
  formatPacksList,
  getResourcePacksCategories,
  packListFromCategories,
} from 'core';
import { getResourceHook } from '../hooks';

const resourcePacksRouter = new Elysia();

resourcePacksRouter.get(
  '/',
  async ({ query: { version } }) =>
    formatPacksList(
      packListFromCategories(
        await getResourcePacksCategories(version as MinecraftVersion)
      )
    ),
  getResourceHook
);

export default resourcePacksRouter;
