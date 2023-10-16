import { Elysia, NotFoundError } from 'elysia';
import AdmZip from 'adm-zip';

import {
  DOWNLOAD_PACKS_URL,
  NONEXISTENT_SINGLE_MSG,
  RESOURCEPACKS_RESOURCE_NAME,
  downloadFile,
  formatPacksList,
  getPacksByCategory,
  getResourcePacksCategories,
  getResourcePacksZipLink,
  packListFromCategories,
  stringSubst,
} from 'core';
import { getPacksHook } from '../hooks/packs';
import { DOWNLOAD_FAIL_SINGLE_MSG } from '../constants/general';

const resourcePacksRouter = new Elysia();

resourcePacksRouter.get(
  '/',
  async ({ query: { version } }) =>
    formatPacksList(
      packListFromCategories(await getResourcePacksCategories(version))
    ),
  getPacksHook
);

resourcePacksRouter.get(
  '/:packId',
  async ({ params: { packId }, query: { version } }) => {
    const categories = await getResourcePacksCategories(version),
      packList = formatPacksList(packListFromCategories(categories)),
      selectedPack = packList.find(({ id }) => id === packId);

    if (!selectedPack)
      throw new NotFoundError(
        stringSubst(NONEXISTENT_SINGLE_MSG, {
          resource: RESOURCEPACKS_RESOURCE_NAME,
          packs: packId,
        })
      );

    const packsByCategory = getPacksByCategory([packId], categories);

    const zipFilename = (
        await getResourcePacksZipLink(version, packsByCategory)
      )
        .split('/')
        .at(-1) as string,
      zipBuffer = await downloadFile(
        stringSubst(DOWNLOAD_PACKS_URL, { filename: zipFilename })
      );

    if (!zipBuffer)
      throw new Error(
        stringSubst(DOWNLOAD_FAIL_SINGLE_MSG, {
          resource: RESOURCEPACKS_RESOURCE_NAME,
          packId,
        })
      );

    // TODO: Modify ZIP so it includes the specific pack's pack.png

    const zip = new AdmZip(zipBuffer);
    zip.deleteFile('Selected Packs.txt');
    const modifiedZipBuffer = await zip.toBufferPromise();

    return new Response(modifiedZipBuffer, {
      headers: { 'Content-Type': `attachment; filename=${packId}.zip` },
    });
  },
  getPacksHook
);

export default resourcePacksRouter;
