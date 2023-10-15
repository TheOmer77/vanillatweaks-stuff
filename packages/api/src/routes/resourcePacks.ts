import { Elysia, NotFoundError } from 'elysia';
import {
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
      zipBuffer = await downloadFile(zipFilename);

    // TODO: Modify ZIP so it includes the specific pack's pack.png
    // TODO: Remove "Selected Packs.txt" from zip

    if (!zipBuffer)
      throw new Error(
        stringSubst(DOWNLOAD_FAIL_SINGLE_MSG, {
          resource: RESOURCEPACKS_RESOURCE_NAME,
          packId,
        })
      );

    return new Response(zipBuffer, {
      headers: { 'Content-Type': `attachment; filename=${packId}.zip` },
    });
  },
  getPacksHook
);

export default resourcePacksRouter;
