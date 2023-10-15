import { Elysia } from 'elysia';
import {
  formatPacksList,
  getCraftingTweaksCategories,
  packListFromCategories,
} from 'core';

const craftingTweaksRouter = new Elysia();

craftingTweaksRouter.get('/', async () =>
  formatPacksList(packListFromCategories(await getCraftingTweaksCategories()))
);

export default craftingTweaksRouter;
