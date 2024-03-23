import { Hono } from 'hono';

import {
  DATAPACKS_ZIP_DEFAULT_NAME,
  downloadSinglePack,
  downloadZippedPacks,
  getDatapacksCategories,
  packListFromCategories,
  packListWithIds,
  type MinecraftVersion,
} from 'core';
// TODO: Replace with Zod schemas
// import { downloadPacksZipHook, getPacksHook } from '../hooks/packs';

const datapacksRouter = new Hono();

datapacksRouter.get(
  '/',
  // TODO: Zod validation - getPacks
  async (ctx) =>
    ctx.json(
      packListWithIds(
        packListFromCategories(
          await getDatapacksCategories(
            ctx.req.query('version') as MinecraftVersion
          )
        )
      )
    )
);

datapacksRouter.get(
  '/zip',
  // TODO: Zod validation - downloadPacksZip
  async (ctx) => {
    const version = ctx.req.query('version') as MinecraftVersion,
      packIds = ctx.req.query('packs')?.split(',') || [];
    const zipBuffer = await downloadZippedPacks('datapack', packIds, version);

    return new Response(zipBuffer, {
      headers: {
        'Content-Disposition': `attachment; filename=${DATAPACKS_ZIP_DEFAULT_NAME}`,
      },
    });
  }
);

datapacksRouter.get(
  '/packs/:packId',
  // TODO: Zod validation - getPacks
  async (ctx) => {
    const version = ctx.req.query('version') as MinecraftVersion,
      packId = ctx.req.param('packId');
    const zipBuffer = await downloadSinglePack('datapack', packId, version);

    return new Response(zipBuffer, {
      headers: { 'Content-Disposition': `attachment; filename=${packId}.zip` },
    });
  }
);

export default datapacksRouter;
