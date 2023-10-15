import { Elysia } from 'elysia';
import {
  formatPacksList,
  getDatapacksCategories,
  packListFromCategories,
} from 'core';

const datapacksRouter = new Elysia();

datapacksRouter.get('/', async () =>
  formatPacksList(packListFromCategories(await getDatapacksCategories()))
);

export default datapacksRouter;
