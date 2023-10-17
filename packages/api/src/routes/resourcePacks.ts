import { Elysia } from 'elysia';

import {
  DEFAULT_MC_VERSION,
  RESOURCEPACKS_ZIP_DEFAULT_NAME,
  downloadZippedPacks,
  getResourcePacksCategories,
  packListFromCategories,
  packListWithIds,
  downloadSinglePack,
} from 'core';
import { downloadPacksZipHook, getPacksHook } from '../hooks/packs';

const resourcePacksRouter = new Elysia();

resourcePacksRouter.get(
  '/',
  async ({ query: { version } }) =>
    packListWithIds(
      packListFromCategories(await getResourcePacksCategories(version))
    ),
  getPacksHook
);

resourcePacksRouter.get(
  '/zip',
  async ({ query: { packs, version } }) => {
    const packIds = packs.split(',');
    const zipBuffer = await downloadZippedPacks(
      'resourcePack',
      packIds,
      version
    );

    return new Response(zipBuffer, {
      headers: {
        'Content-Disposition': `attachment; filename=${RESOURCEPACKS_ZIP_DEFAULT_NAME}`,
      },
    });
  },
  downloadPacksZipHook
);

resourcePacksRouter.get(
  '/packs/:packId',
  async ({ params: { packId }, query: { version = DEFAULT_MC_VERSION } }) => {
    const zipBuffer = await downloadSinglePack('resourcePack', packId, version);

    return new Response(zipBuffer, {
      headers: { 'Content-Disposition': `attachment; filename=${packId}.zip` },
    });
  },
  getPacksHook
);

export default resourcePacksRouter;
