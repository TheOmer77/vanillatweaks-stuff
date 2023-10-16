import { Elysia, NotFoundError } from 'elysia';
import {
  CRAFTINGTWEAKS_ICON_URL,
  CRAFTINGTWEAKS_RESOURCE_NAME,
  DEFAULT_MC_VERSION,
  DOWNLOAD_PACKS_URL,
  NONEXISTENT_SINGLE_MSG,
  downloadFile,
  getCraftingTweaksCategories,
  getCraftingTweaksZipLink,
  getPacksByCategory,
  modifiedZipFromBuffer,
  packListFromCategories,
  packListWithIds,
  stringSubst,
} from 'core';
import { getPacksHook } from '../hooks/packs';
import { DOWNLOAD_FAIL_SINGLE_MSG } from '../constants/general';

const craftingTweaksRouter = new Elysia();

craftingTweaksRouter.get(
  '/',
  async ({ query: { version } }) =>
    packListWithIds(
      packListFromCategories(await getCraftingTweaksCategories(version))
    ),
  getPacksHook
);

craftingTweaksRouter.get(
  '/:packId',
  async ({ params: { packId }, query: { version = DEFAULT_MC_VERSION } }) => {
    const categories = await getCraftingTweaksCategories(version),
      packList = packListWithIds(packListFromCategories(categories)),
      selectedPack = packList.find(({ id }) => id === packId);

    if (!selectedPack)
      throw new NotFoundError(
        stringSubst(NONEXISTENT_SINGLE_MSG, {
          resource: CRAFTINGTWEAKS_RESOURCE_NAME,
          packs: packId,
        })
      );

    const packsByCategory = getPacksByCategory([packId], categories);

    const zipFilename = (
      await getCraftingTweaksZipLink(version, packsByCategory)
    )
      .split('/')
      .at(-1) as string;
    const [zipBuffer, iconBuffer] = (
      (await Promise.allSettled([
        downloadFile(
          stringSubst(DOWNLOAD_PACKS_URL, { filename: zipFilename })
        ),
        downloadFile(
          stringSubst(CRAFTINGTWEAKS_ICON_URL, {
            version,
            pack: selectedPack.name,
          })
        ),
      ])) as PromiseFulfilledResult<Buffer>[]
    ).map((promise) => promise?.value);

    if (!zipBuffer)
      throw new Error(
        stringSubst(DOWNLOAD_FAIL_SINGLE_MSG, {
          resource: CRAFTINGTWEAKS_RESOURCE_NAME,
          packId,
        })
      );

    const modifiedZipBuffer = await modifiedZipFromBuffer(zipBuffer, (zip) => {
      zip.remove('Selected Packs.txt');
      if (iconBuffer) zip.file('pack.png', iconBuffer);
    });

    return new Response(modifiedZipBuffer, {
      headers: { 'Content-Type': `attachment; filename=${packId}.zip` },
    });
  },
  getPacksHook
);

export default craftingTweaksRouter;
