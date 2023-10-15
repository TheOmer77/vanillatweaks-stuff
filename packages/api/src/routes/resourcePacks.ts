import { Elysia } from 'elysia';
import {
  formatPacksList,
  getResourcePacksCategories,
  packListFromCategories,
  type MinecraftVersion,
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
