import { Elysia } from 'elysia';
import {
  formatPacksList,
  getCraftingTweaksCategories,
  packListFromCategories,
  type MinecraftVersion,
} from 'core';
import { getPacksHook } from '../hooks/packs';

const craftingTweaksRouter = new Elysia();

craftingTweaksRouter.get(
  '/',
  async ({ query: { version } }) =>
    formatPacksList(
      packListFromCategories(
        await getCraftingTweaksCategories(version as MinecraftVersion)
      )
    ),
  getPacksHook
);

export default craftingTweaksRouter;
