import { Elysia } from 'elysia';

import {
  DATAPACKS_RESOURCE_NAME,
  DATAPACKS_ZIP_DEFAULT_NAME,
  DOWNLOAD_FAIL_SINGLE_MSG,
  downloadSinglePack,
  downloadZippedPacks,
  getDatapacksCategories,
  getZipFile,
  HttpError,
  packListFromCategories,
  packListWithIds,
  stringSubst,
  zipFromBuffer,
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

    // TODO: Move extraction into downloadSinglePack
    const zip = await zipFromBuffer(zipBuffer);
    const packFile = Object.values(zip.files)[0]
      ? await getZipFile(Object.values(zip.files)[0])
      : null;

    if (!packFile)
      throw new HttpError(
        stringSubst(DOWNLOAD_FAIL_SINGLE_MSG, {
          resource: DATAPACKS_RESOURCE_NAME,
          packId,
        }),
        500
      );

    return new Response(packFile, {
      headers: { 'Content-Disposition': `attachment; filename=${packId}.zip` },
    });
  },
  getPacksHook
);

export default datapacksRouter;
