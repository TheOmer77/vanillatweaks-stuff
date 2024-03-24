import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import {
  DATAPACKS_ZIP_DEFAULT_NAME,
  downloadSinglePack,
  downloadZippedPacks,
  getDatapacksCategories,
  packListFromCategories,
  packListWithIds,
} from 'core';
import { downloadPacksZipSchema, getPacksSchema } from '../schemas/packs';
import { handleValidationError } from '../middleware';

const datapacksRouter = new Hono();

datapacksRouter.get(
  '/',
  zValidator('query', getPacksSchema, handleValidationError),
  async (ctx) =>
    ctx.json(
      packListWithIds(
        packListFromCategories(
          await getDatapacksCategories(ctx.req.valid('query').version)
        )
      )
    )
);

datapacksRouter.get(
  '/zip',
  zValidator('query', downloadPacksZipSchema, handleValidationError),
  async (ctx) => {
    const { version, packs } = ctx.req.valid('query');
    const zipBuffer = await downloadZippedPacks('datapack', packs, version);

    return new Response(zipBuffer, {
      headers: {
        'Content-Disposition': `attachment; filename=${DATAPACKS_ZIP_DEFAULT_NAME}`,
      },
    });
  }
);

datapacksRouter.get(
  '/packs/:packId',
  zValidator('query', getPacksSchema, handleValidationError),
  async (ctx) => {
    const { version } = ctx.req.valid('query'),
      packId = ctx.req.param('packId');
    const zipBuffer = await downloadSinglePack('datapack', packId, version);

    return new Response(zipBuffer, {
      headers: { 'Content-Disposition': `attachment; filename=${packId}.zip` },
    });
  }
);

export default datapacksRouter;
