import { Elysia, NotFoundError } from 'elysia';
import JSZip from 'jszip';

import {
  DEFAULT_MC_VERSION,
  DOWNLOAD_PACKS_URL,
  NONEXISTENT_SINGLE_MSG,
  RESOURCEPACKS_ICON_URL,
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
  async ({ params: { packId }, query: { version = DEFAULT_MC_VERSION } }) => {
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
      throw new Error(
        stringSubst(DOWNLOAD_FAIL_SINGLE_MSG, {
          resource: RESOURCEPACKS_RESOURCE_NAME,
          packId,
        })
      );

    // TODO: Move into function in core, do not use JSZip directly
    const zip = await JSZip.loadAsync(zipBuffer);
    zip.remove('Selected Packs.txt');
    if (iconBuffer) zip.file('pack.png', iconBuffer);
    const modifiedZipBuffer = Buffer.from(
      await zip.generateAsync({ type: 'arraybuffer' })
    );

    return new Response(modifiedZipBuffer, {
      headers: { 'Content-Type': `attachment; filename=${packId}.zip` },
    });
  },
  getPacksHook
);

export default resourcePacksRouter;
