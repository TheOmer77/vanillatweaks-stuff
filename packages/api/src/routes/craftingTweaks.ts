import { Elysia } from 'elysia';
import {
  MinecraftVersion,
  formatPacksList,
  getCraftingTweaksCategories,
  packListFromCategories,
} from 'core';
import { getResourceHook } from '../hooks';

const craftingTweaksRouter = new Elysia();

craftingTweaksRouter.get(
  '/',
  async ({ query: { version } }) =>
    formatPacksList(
      packListFromCategories(
        await getCraftingTweaksCategories(version as MinecraftVersion)
      )
    ),
  getResourceHook
);

export default craftingTweaksRouter;
