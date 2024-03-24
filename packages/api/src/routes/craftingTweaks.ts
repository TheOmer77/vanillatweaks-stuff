import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import {
  CRAFTINGTWEAKS_ZIP_DEFAULT_NAME,
  downloadSinglePack,
  downloadZippedPacks,
  getCraftingTweaksCategories,
  packListFromCategories,
  packListWithIds,
} from 'core';
import { downloadPacksZipSchema, getPacksSchema } from '../schemas/packs';

const craftingTweaksRouter = new Hono();

craftingTweaksRouter.get(
  '/',
  zValidator('query', getPacksSchema),
  async (ctx) =>
    ctx.json(
      packListWithIds(
        packListFromCategories(
          await getCraftingTweaksCategories(ctx.req.valid('query').version)
        )
      )
    )
);

craftingTweaksRouter.get(
  '/zip',
  zValidator('query', downloadPacksZipSchema),
  async (ctx) => {
    const { version, packs } = ctx.req.valid('query'),
      packIds = packs.split(',');
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
  zValidator('query', getPacksSchema),
  async (ctx) => {
    const { version } = ctx.req.valid('query'),
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
