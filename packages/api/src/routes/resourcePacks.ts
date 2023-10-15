import { Elysia } from 'elysia';
import {
  formatPacksList,
  getResourcePacksCategories,
  packListFromCategories,
} from 'core';
import { getPacksHook } from '../hooks/packs';

const resourcePacksRouter = new Elysia();

resourcePacksRouter.get(
  '/',
  async ({ query: { version } }) =>
    formatPacksList(
      packListFromCategories(await getResourcePacksCategories(version))
    ),
  getPacksHook
);

export default resourcePacksRouter;
