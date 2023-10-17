import { api } from './instance';
import { HttpError } from '../utils/httpError';
import {
  getCategoriesFn,
  getIconUrl,
  getPacksByCategory,
  getResourceName,
  getZipLinkFn,
  packListFromCategories,
  packListWithIds,
  validatePackType,
} from '../utils/packs';
import { stringSubst } from '../utils/string';
import { DEFAULT_MC_VERSION } from '../constants/versions';
import {
  DOWNLOAD_FAIL_SINGLE_MSG,
  NONEXISTENT_MULTIPLE_MSG,
  NONEXISTENT_SINGLE_MSG,
} from '../constants/general';
import { DOWNLOAD_PACKS_URL } from '../constants/api';
import type { PackType } from '../types/packType';
import type { MinecraftVersion } from '../types/versions';
import { modifiedZipFromBuffer } from '../utils/zip';

export const downloadFile = async (url: string) =>
  (await api.get<Buffer>(url, { responseType: 'arraybuffer' })).data;

export const downloadZippedPacks = async (
  packType: PackType,
  packIds: string[],
  version: MinecraftVersion = DEFAULT_MC_VERSION
) => {
  validatePackType(packType);

  const resourceName = getResourceName(packType),
    getCategories = getCategoriesFn(packType),
    getZipLink = getZipLinkFn(packType);

  const categories = await getCategories(version),
    packList = packListWithIds(packListFromCategories(categories));

  const invalidPackIds = packIds.filter(
    (packId) => !packList.some(({ id }) => packId === id)
  );
  if (invalidPackIds.length > 0)
    throw new HttpError(
      stringSubst(
        invalidPackIds.length === 1
          ? NONEXISTENT_SINGLE_MSG
          : `${NONEXISTENT_MULTIPLE_MSG}%packs`,
        {
          resource: resourceName,
          packs: invalidPackIds.join(', '),
        }
      ),
      400
    );

  const packsByCategory = getPacksByCategory(packIds, categories);

  const zipFilename = (await getZipLink(version, packsByCategory))
      .split('/')
      .at(-1) as string,
    zipBuffer = await downloadFile(
      stringSubst(DOWNLOAD_PACKS_URL, { filename: zipFilename })
    );

  return zipBuffer;
};

export const downloadSinglePack = async (
  packType: PackType,
  packId: string,
  version: MinecraftVersion = DEFAULT_MC_VERSION,
  { modifyZip = true } = {}
) => {
  validatePackType(packType);

  const resourceName = getResourceName(packType),
    iconUrl = getIconUrl(packType),
    getCategories = getCategoriesFn(packType),
    getZipLink = getZipLinkFn(packType);

  const categories = await getCategories(version),
    packList = packListWithIds(packListFromCategories(categories)),
    selectedPack = packList.find(({ id }) => id === packId);

  if (!selectedPack)
    throw new HttpError(
      stringSubst(NONEXISTENT_SINGLE_MSG, {
        resource: resourceName,
        packs: packId,
      }),
      404
    );

  const packsByCategory = getPacksByCategory([packId], categories);

  const zipFilename = (await getZipLink(version, packsByCategory))
    .split('/')
    .at(-1) as string;
  const [zipBuffer, iconBuffer] = (
    (await Promise.allSettled([
      downloadFile(stringSubst(DOWNLOAD_PACKS_URL, { filename: zipFilename })),
      modifyZip &&
        downloadFile(
          stringSubst(iconUrl, {
            version,
            pack: selectedPack.name,
          })
        ),
    ])) as PromiseFulfilledResult<Buffer>[]
  ).map((promise) => promise?.value);

  if (!zipBuffer)
    throw new HttpError(
      stringSubst(DOWNLOAD_FAIL_SINGLE_MSG, { resource: resourceName, packId }),
      500
    );

  // TODO: Must extract zip if packType = datapack
  return modifyZip
    ? await modifiedZipFromBuffer(zipBuffer, (zip) => {
        zip.remove('Selected Packs.txt');
        if (iconBuffer) zip.file('pack.png', iconBuffer);
      })
    : zipBuffer;
};
