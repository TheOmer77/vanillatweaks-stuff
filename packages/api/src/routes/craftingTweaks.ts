import { Elysia } from 'elysia';
import {
  formatPacksList,
  getCraftingTweaksCategories,
  packListFromCategories,
  type MinecraftVersion,
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
