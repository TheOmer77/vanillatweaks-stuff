import { Elysia, NotFoundError } from 'elysia';
import JSZip from 'jszip';

import {
  DATAPACKS_RESOURCE_NAME,
  DOWNLOAD_PACKS_URL,
  NONEXISTENT_SINGLE_MSG,
  downloadFile,
  formatPacksList,
  getDatapacksCategories,
  getDatapacksZipLink,
  getPacksByCategory,
  packListFromCategories,
  stringSubst,
} from 'core';
import { getPacksHook } from '../hooks/packs';
import { DOWNLOAD_FAIL_SINGLE_MSG } from '../constants/general';

const datapacksRouter = new Elysia();

datapacksRouter.get(
  '/',
  async ({ query: { version } }) =>
    formatPacksList(
      packListFromCategories(await getDatapacksCategories(version))
    ),
  getPacksHook
);

datapacksRouter.get(
  '/:packId',
  async ({ params: { packId }, query: { version } }) => {
    const categories = await getDatapacksCategories(version),
      packList = formatPacksList(packListFromCategories(categories)),
      selectedPack = packList.find(({ id }) => id === packId);

    if (!selectedPack)
      throw new NotFoundError(
        stringSubst(NONEXISTENT_SINGLE_MSG, {
          resource: DATAPACKS_RESOURCE_NAME,
          packs: packId,
        })
      );

    const packsByCategory = getPacksByCategory([packId], categories);

    const zipFilename = (await getDatapacksZipLink(version, packsByCategory))
        .split('/')
        .at(-1) as string,
      zipBuffer = await downloadFile(
        stringSubst(DOWNLOAD_PACKS_URL, { filename: zipFilename })
      );

    const zip = await JSZip.loadAsync(zipBuffer);
    // TODO: Move into function in core, do not use JSZip directly
    const packFile = Object.values(zip.files)[0]
      ? Buffer.from(await Object.values(zip.files)[0].async('arraybuffer'))
      : null;

    if (!packFile)
      throw new Error(
        stringSubst(DOWNLOAD_FAIL_SINGLE_MSG, {
          resource: DATAPACKS_RESOURCE_NAME,
          packId,
        })
      );

    return new Response(packFile, {
      headers: { 'Content-Type': `attachment; filename=${packId}.zip` },
    });
  },
  getPacksHook
);

export default datapacksRouter;
