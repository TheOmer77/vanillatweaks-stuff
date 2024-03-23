import { Hono } from 'hono';

import {
  RESOURCEPACKS_ZIP_DEFAULT_NAME,
  downloadSinglePack,
  downloadZippedPacks,
  getResourcePacksCategories,
  packListFromCategories,
  packListWithIds,
  type MinecraftVersion,
} from 'core';
// TODO: Replace with Zod schemas
// import { downloadPacksZipHook, getPacksHook } from '../hooks/packs';

const resourcePacksRouter = new Hono();

resourcePacksRouter.get(
  '/',
  // TODO: Zod validation - getPacks
  async (ctx) =>
    ctx.json(
      packListWithIds(
        packListFromCategories(
          await getResourcePacksCategories(
            ctx.req.query('version') as MinecraftVersion
          )
        )
      )
    )
);

resourcePacksRouter.get(
  '/zip',
  // TODO: Zod validation - downloadPacksZip
  async (ctx) => {
    const version = ctx.req.query('version') as MinecraftVersion,
      packIds = ctx.req.query('packs')?.split(',') || [];
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
  }
);

resourcePacksRouter.get(
  '/packs/:packId',
  // TODO: Zod validation - getPacks
  async (ctx) => {
    const version = ctx.req.query('version') as MinecraftVersion,
      packId = ctx.req.param('packId');
    const zipBuffer = await downloadSinglePack('resourcePack', packId, version);

    return new Response(zipBuffer, {
      headers: { 'Content-Disposition': `attachment; filename=${packId}.zip` },
    });
  }
);

export default resourcePacksRouter;
