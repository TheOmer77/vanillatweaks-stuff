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
import { getZipFile, modifiedZipFromBuffer, zipFromBuffer } from '../utils/zip';

/**
 * General function to download any file from Vanilla Tweaks.
 * @param url URL within Vanilla Tweaks of the file to download
 */
export const downloadFile = async (url: string) =>
  (await api.get<Buffer>(url, { responseType: 'arraybuffer' })).data;

/**
 * Download multiple packs in a zip, as provided by Vanilla Tweaks.
 * @param packType Pack type.
 * @param packIds Pack IDs of packs to include in the resulting zip.
 * @param version Minecraft version.
 */
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

/**
 * Download a single pack file in the correct format for resource
 * packs/datapacks.
 * @param packType Pack type.
 * @param packId Pack ID of the pack to download.
 * @param version Minecraft version.
 */
export const downloadSinglePack = async (
  packType: PackType,
  packId: string,
  version: MinecraftVersion = DEFAULT_MC_VERSION
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

  // Must extract zip if packType = datapack
  if (packType !== 'datapack')
    return await modifiedZipFromBuffer(zipBuffer, (zip) => {
      zip.remove('Selected Packs.txt');
      if (iconBuffer) zip.file('pack.png', iconBuffer);
    });

  const zip = await zipFromBuffer(zipBuffer);
  const packZipBuffer = Object.values(zip.files)[0]
    ? await getZipFile(Object.values(zip.files)[0])
    : null;

  if (!packZipBuffer)
    throw new HttpError(
      stringSubst(DOWNLOAD_FAIL_SINGLE_MSG, { resource: resourceName, packId }),
      500
    );
  return packZipBuffer;
};
