import { Elysia } from 'elysia';

import {
  DATAPACKS_ZIP_DEFAULT_NAME,
  downloadSinglePack,
  downloadZippedPacks,
  getDatapacksCategories,
  packListFromCategories,
  packListWithIds,
} from 'core';
import { downloadPacksZipHook, getPacksHook } from '../hooks/packs';

const datapacksRouter = new Elysia();

datapacksRouter.get(
  '/',
  async ({ query: { version } }) =>
    packListWithIds(
      packListFromCategories(await getDatapacksCategories(version))
    ),
  getPacksHook
);

datapacksRouter.get(
  '/zip',
  async ({ query: { packs, version } }) => {
    const packIds = packs.split(',');
    const zipBuffer = await downloadZippedPacks('datapack', packIds, version);

    return new Response(zipBuffer, {
      headers: {
        'Content-Disposition': `attachment; filename=${DATAPACKS_ZIP_DEFAULT_NAME}`,
      },
    });
  },
  downloadPacksZipHook
);

datapacksRouter.get(
  '/:packId',
  async ({ params: { packId }, query: { version } }) => {
    const zipBuffer = await downloadSinglePack('datapack', packId, version);

    return new Response(zipBuffer, {
      headers: { 'Content-Disposition': `attachment; filename=${packId}.zip` },
    });
  },
  getPacksHook
);

export default datapacksRouter;
