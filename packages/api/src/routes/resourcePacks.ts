import { Elysia } from 'elysia';
import {
  formatPacksList,
  getResourcePacksCategories,
  packListFromCategories,
} from 'core';

const resourcePacksRouter = new Elysia();

resourcePacksRouter.get('/', async () =>
  formatPacksList(packListFromCategories(await getResourcePacksCategories()))
);

export default resourcePacksRouter;
