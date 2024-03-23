import { Hono } from 'hono';

import {
  CRAFTINGTWEAKS_ZIP_DEFAULT_NAME,
  downloadSinglePack,
  downloadZippedPacks,
  getCraftingTweaksCategories,
  packListFromCategories,
  packListWithIds,
  type MinecraftVersion,
} from 'core';
// TODO: Replace with Zod schemas
// import { downloadPacksZipHook, getPacksHook } from '../hooks/packs';

const craftingTweaksRouter = new Hono();

craftingTweaksRouter.get(
  '/',
  // TODO: Zod validation - getPacks
  async (ctx) =>
    ctx.json(
      packListWithIds(
        packListFromCategories(
          await getCraftingTweaksCategories(
            ctx.req.query('version') as MinecraftVersion
          )
        )
      )
    )
);

craftingTweaksRouter.get(
  '/zip',
  // TODO: Zod validation - downloadPacksZip
  async (ctx) => {
    const version = ctx.req.query('version') as MinecraftVersion,
      packIds = ctx.req.query('packs')?.split(',') || [];
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
  }
);

craftingTweaksRouter.get(
  '/packs/:packId',
  // TODO: Zod validation - getPacks
  async (ctx) => {
    const version = ctx.req.query('version') as MinecraftVersion,
      packId = ctx.req.param('packId');
    const zipBuffer = await downloadSinglePack(
      'craftingTweak',
      packId,
      version
    );

    return new Response(zipBuffer, {
      headers: { 'Content-Disposition': `attachment; filename=${packId}.zip` },
    });
  }
);

export default craftingTweaksRouter;
