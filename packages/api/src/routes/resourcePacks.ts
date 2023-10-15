import { Elysia } from 'elysia';
import {
  formatPacksList,
  getResourcePacksCategories,
  packListFromCategories,
  type MinecraftVersion,
} from 'core';
import { getPacksHook } from '../hooks/packs';

const resourcePacksRouter = new Elysia();

resourcePacksRouter.get(
  '/',
  async ({ query: { version } }) =>
    formatPacksList(
      packListFromCategories(
        await getResourcePacksCategories(version as MinecraftVersion)
      )
    ),
  getPacksHook
);

export default resourcePacksRouter;
