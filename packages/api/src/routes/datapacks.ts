import { Elysia, NotFoundError } from 'elysia';

import {
  DATAPACKS_RESOURCE_NAME,
  DOWNLOAD_PACKS_URL,
  NONEXISTENT_SINGLE_MSG,
  downloadFile,
  getDatapacksCategories,
  getDatapacksZipLink,
  getPacksByCategory,
  getZipFile,
  packListFromCategories,
  packListWithIds,
  stringSubst,
  zipFromBuffer,
} from 'core';
import { getPacksHook } from '../hooks/packs';
import { DOWNLOAD_FAIL_SINGLE_MSG } from '../constants/general';

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
  '/:packId',
  async ({ params: { packId }, query: { version } }) => {
    const categories = await getDatapacksCategories(version),
      packList = packListWithIds(packListFromCategories(categories)),
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

    const zip = await zipFromBuffer(zipBuffer);
    const packFile = Object.values(zip.files)[0]
      ? await getZipFile(Object.values(zip.files)[0])
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
