import { Elysia } from 'elysia';
import {
  MinecraftVersion,
  checkValidVersion,
  formatPacksList,
  getCraftingTweaksCategories,
  packListFromCategories,
} from 'core';
import { getResourceHook } from '../hooks';

const craftingTweaksRouter = new Elysia();

craftingTweaksRouter.get(
  '/',
  async ({ query: { version } }) => {
    version && checkValidVersion(version as MinecraftVersion);
    return formatPacksList(
      packListFromCategories(
        await getCraftingTweaksCategories(version as MinecraftVersion)
      )
    );
  },
  getResourceHook
);

export default craftingTweaksRouter;
