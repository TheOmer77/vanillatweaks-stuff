import { Elysia } from 'elysia';

import {
  DEFAULT_MC_VERSION,
  DOWNLOAD_PACKS_URL,
  NONEXISTENT_SINGLE_MSG,
  RESOURCEPACKS_ICON_URL,
  RESOURCEPACKS_RESOURCE_NAME,
  RESOURCEPACKS_ZIP_DEFAULT_NAME,
  downloadFile,
  downloadZippedPacks,
  getPacksByCategory,
  getResourcePacksCategories,
  getResourcePacksZipLink,
  HttpError,
  modifiedZipFromBuffer,
  packListFromCategories,
  packListWithIds,
  stringSubst,
} from 'core';
import { downloadPacksZipHook, getPacksHook } from '../hooks/packs';
import { DOWNLOAD_FAIL_SINGLE_MSG } from '../constants/general';

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
  '/:packId',
  async ({ params: { packId }, query: { version = DEFAULT_MC_VERSION } }) => {
    const categories = await getResourcePacksCategories(version),
      packList = packListWithIds(packListFromCategories(categories)),
      selectedPack = packList.find(({ id }) => id === packId);

    if (!selectedPack)
      throw new HttpError(
        stringSubst(NONEXISTENT_SINGLE_MSG, {
          resource: RESOURCEPACKS_RESOURCE_NAME,
          packs: packId,
        }),
        404
      );

    const packsByCategory = getPacksByCategory([packId], categories);

    const zipFilename = (
      await getResourcePacksZipLink(version, packsByCategory)
    )
      .split('/')
      .at(-1) as string;
    const [zipBuffer, iconBuffer] = (
      (await Promise.allSettled([
        downloadFile(
          stringSubst(DOWNLOAD_PACKS_URL, { filename: zipFilename })
        ),
        downloadFile(
          stringSubst(RESOURCEPACKS_ICON_URL, {
            version,
            pack: selectedPack.name,
          })
        ),
      ])) as PromiseFulfilledResult<Buffer>[]
    ).map((promise) => promise?.value);

    if (!zipBuffer)
      throw new HttpError(
        stringSubst(DOWNLOAD_FAIL_SINGLE_MSG, {
          resource: RESOURCEPACKS_RESOURCE_NAME,
          packId,
        }),
        500
      );

    const modifiedZipBuffer = await modifiedZipFromBuffer(zipBuffer, (zip) => {
      zip.remove('Selected Packs.txt');
      if (iconBuffer) zip.file('pack.png', iconBuffer);
    });

    return new Response(modifiedZipBuffer, {
      headers: { 'Content-Disposition': `attachment; filename=${packId}.zip` },
    });
  },
  getPacksHook
);

export default resourcePacksRouter;
