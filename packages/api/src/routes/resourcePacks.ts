import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import {
  RESOURCEPACKS_ZIP_DEFAULT_NAME,
  downloadSinglePack,
  downloadZippedPacks,
  getResourcePacksCategories,
  packListFromCategories,
  packListWithIds,
} from 'core';
import { downloadPacksZipSchema, getPacksSchema } from '../schemas/packs';
import { handleValidationError } from '../middleware';

const resourcePacksRouter = new Hono();

resourcePacksRouter.get(
  '/',
  zValidator('query', getPacksSchema, handleValidationError),
  async (ctx) =>
    ctx.json(
      packListWithIds(
        packListFromCategories(
          await getResourcePacksCategories(ctx.req.valid('query').version)
        )
      )
    )
);

resourcePacksRouter.get(
  '/zip',
  zValidator('query', downloadPacksZipSchema, handleValidationError),
  async (ctx) => {
    const { version, packs } = ctx.req.valid('query');
    const zipBuffer = await downloadZippedPacks('resourcePack', packs, version);

    return new Response(zipBuffer, {
      headers: {
        'Content-Disposition': `attachment; filename=${RESOURCEPACKS_ZIP_DEFAULT_NAME}`,
      },
    });
  }
);

resourcePacksRouter.get(
  '/packs/:packId',
  zValidator('query', getPacksSchema, handleValidationError),
  async (ctx) => {
    const { version } = ctx.req.valid('query'),
      packId = ctx.req.param('packId');
    const zipBuffer = await downloadSinglePack('resourcePack', packId, version);

    return new Response(zipBuffer, {
      headers: { 'Content-Disposition': `attachment; filename=${packId}.zip` },
    });
  }
);

export default resourcePacksRouter;
