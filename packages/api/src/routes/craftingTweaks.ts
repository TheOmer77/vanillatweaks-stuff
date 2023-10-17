import { Elysia } from 'elysia';

import {
  CRAFTINGTWEAKS_ZIP_DEFAULT_NAME,
  DEFAULT_MC_VERSION,
  downloadSinglePack,
  downloadZippedPacks,
  getCraftingTweaksCategories,
  packListFromCategories,
  packListWithIds,
} from 'core';
import { downloadPacksZipHook, getPacksHook } from '../hooks/packs';

const craftingTweaksRouter = new Elysia();

craftingTweaksRouter.get(
  '/',
  async ({ query: { version } }) =>
    packListWithIds(
      packListFromCategories(await getCraftingTweaksCategories(version))
    ),
  getPacksHook
);

craftingTweaksRouter.get(
  '/zip',
  async ({ query: { packs, version } }) => {
    const packIds = packs.split(',');
    const zipBuffer = await downloadZippedPacks(
      'craftingTweak',
      packIds,
      version
    );

    return new Response(zipBuffer, {
      headers: {
        'Content-Disposition': `attachment; filename=${CRAFTINGTWEAKS_ZIP_DEFAULT_NAME}`,
      },
    });
  },
  downloadPacksZipHook
);

craftingTweaksRouter.get(
  '/:packId',
  async ({ params: { packId }, query: { version = DEFAULT_MC_VERSION } }) => {
    const zipBuffer = await downloadSinglePack(
      'craftingTweak',
      packId,
      version
    );

    return new Response(zipBuffer, {
      headers: { 'Content-Disposition': `attachment; filename=${packId}.zip` },
    });
  },
  getPacksHook
);

export default craftingTweaksRouter;
