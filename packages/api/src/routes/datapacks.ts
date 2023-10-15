import { Elysia, NotFoundError } from 'elysia';
import AdmZip from 'adm-zip';

import {
  DATAPACKS_RESOURCE_NAME,
  NONEXISTENT_SINGLE_MSG,
  downloadFile,
  formatPacksList,
  getDatapacksCategories,
  getDatapacksZipLink,
  getPacksByCategory,
  getZipEntryData,
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
      zipBuffer = await downloadFile(zipFilename);

    const zip = new AdmZip(zipBuffer),
      zipEntries = zip
        .getEntries()
        .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));

    const packFile = (
      (
        await Promise.allSettled(
          zipEntries.map(async (entry) => await getZipEntryData(entry))
        )
      ).filter(
        ({ status }) => status === 'fulfilled'
      ) as PromiseFulfilledResult<Buffer>[]
    )?.[0]?.value;

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
