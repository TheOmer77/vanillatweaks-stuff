import { Elysia } from 'elysia';
import {
  formatPacksList,
  getCraftingTweaksCategories,
  packListFromCategories,
} from 'core';
import { getPacksHook } from '../hooks/packs';

const craftingTweaksRouter = new Elysia();

craftingTweaksRouter.get(
  '/',
  async ({ query: { version } }) =>
    formatPacksList(
      packListFromCategories(await getCraftingTweaksCategories(version))
    ),
  getPacksHook
);

export default craftingTweaksRouter;
