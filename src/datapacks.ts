import path from 'path';
import fs from 'fs/promises';
import { isAxiosError } from 'axios';
import chalk from 'chalk';
import AdmZip from 'adm-zip';

import { downloadFile } from '@/api/general';
import { getDatapacksCategories, getDatapacksZipLink } from '@/api/datapacks';
import { args } from '@/utils/args';
import { printPackList } from '@/utils/cli';
import { toKebabCase } from '@/utils/string';
import { getZipEntryData } from '@/utils/zip';
import { INCORRECT_USAGE_MSG, INVALID_VERSION_MSG } from '@/constants/general';
import { DEFAULT_MC_VERSION } from '@/constants/versions';
import {
  DATAPACKS_DOWNLOAD_HELP_MSG,
  DATAPACKS_FAILURE_MSG,
  DATAPACKS_HELP_MSG,
  DATAPACKS_INVALID_SUBCOMMAND_MSG,
  DATAPACKS_LIST_HELP_MSG,
  DATAPACKS_SUCCESS_MSG,
  DATAPACKS_ZIP_DEFAULT_NAME,
} from '@/constants/datapacks';
import type { Pack, PacksCategory } from '@/types/api';
import type { MinecraftVersion } from '@/types/versions';
import type { DatapacksSubcommand } from '@/types/datapacks';

const datapacksListFromCategories = (categories: PacksCategory[]) =>
  categories
    .reduce((arr, { packs }) => [...arr, ...packs], [] as Pack[])
    .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));

/**
 * Fetch all available datapacks and list them.
 * @param version Minecraft version.
 */
const listDatapacks = async (
  version: MinecraftVersion = DEFAULT_MC_VERSION
) => {
  const showHelp = args.help || args.h;
  const incorrectUsage = typeof version !== 'string';
  if (showHelp || incorrectUsage) {
    console.log(DATAPACKS_LIST_HELP_MSG);

    if (showHelp) return;
    console.log();
    throw new Error(INCORRECT_USAGE_MSG);
  }

  try {
    const packs = datapacksListFromCategories(
      await getDatapacksCategories(version)
    );

    printPackList(packs);
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 404)
      throw new Error(
        INVALID_VERSION_MSG.replace('%resources', 'Datapacks').replace(
          '%version',
          version
        )
      );
    throw err;
  }
};

/**
 * Download datapack zip files.
 *
 * Datapacks will be saved as individual files unless the `--noUnzip` flag is
 * used, in which case a single zip file will be saved.
 *
 * @param version Minecraft version.
 * @param packIds IDs of datapacks to download.
 */
const downloadDatapacks = async (
  version: MinecraftVersion = DEFAULT_MC_VERSION,
  packIds: string[]
) => {
  const showHelp = args.help || args.h,
    outDir = args.outDir || args.o || process.cwd();
  const incorrectUsage =
    typeof version !== 'string' ||
    typeof outDir !== 'string' ||
    packIds.length < 1;
  if (showHelp || incorrectUsage) {
    console.log(DATAPACKS_DOWNLOAD_HELP_MSG);

    if (showHelp) return;
    console.log();
    throw new Error(INCORRECT_USAGE_MSG);
  }

  const categories = await getDatapacksCategories(version),
    packList = datapacksListFromCategories(categories);

  const validPackIds = packIds.filter((id) =>
      packList.some(({ name }) => id === toKebabCase(name))
    ),
    invalidPackIds = packIds.filter((id) => !validPackIds.includes(id));

  if (invalidPackIds.length > 0)
    console.warn(
      `${chalk.bold.yellow(
        `The following datapack${
          invalidPackIds.length === 1 ? ' does' : 's do'
        } not exist: `
      )}${invalidPackIds.join(', ')}`
    );
  if (validPackIds.length < 1)
    throw new Error('All datapack IDs given are invalid.');

  const incompatiblePackIds = validPackIds.filter((id) => {
    const pack = packList.find(({ name }) => id === toKebabCase(name));
    if (!pack) return false;
    return packIds.some((dpId) =>
      pack.incompatible.map(toKebabCase).includes(dpId)
    );
  });
  if (incompatiblePackIds.length > 0)
    throw new Error(
      `The following datapacks are incompatible with each other: ${incompatiblePackIds.join(
        ', '
      )}`
    );

  const packsByCategory: Record<string, string[]> = categories.reduce(
    (obj, { category, packs }) =>
      packs.some(({ name }) => validPackIds.includes(toKebabCase(name)))
        ? {
            ...obj,
            [category.toLowerCase()]: packs
              .filter(({ name }) => validPackIds.includes(toKebabCase(name)))
              .map(({ name }) => name),
          }
        : obj,
    {}
  );

  const formData = new FormData();
  formData.append('version', version);
  formData.append('packs', JSON.stringify(packsByCategory));

  console.log(
    `Downloading ${validPackIds.length} datapack${
      validPackIds.length === 1 ? '' : 's'
    }: ${packList
      .filter(({ name }) => validPackIds.includes(toKebabCase(name)))
      .map(({ display }) => display)
      .join(', ')}`
  );

  const zipFilename = (await getDatapacksZipLink(version, packsByCategory))
      .split('/')
      .at(-1) as string,
    zipBuffer = await downloadFile(zipFilename);

  const outDirExists = await fs.exists(outDir);
  if (!outDirExists) await fs.mkdir(outDir, { recursive: true });

  if (args.noUnzip) {
    await Bun.write(path.join(outDir, DATAPACKS_ZIP_DEFAULT_NAME), zipBuffer);
    return console.log(
      DATAPACKS_SUCCESS_MSG(
        validPackIds.length,
        path.join(path.resolve(outDir), DATAPACKS_ZIP_DEFAULT_NAME)
      )
    );
  }

  const zip = new AdmZip(zipBuffer),
    zipEntries = zip
      .getEntries()
      .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));

  const files = await Promise.allSettled(
      zipEntries.map(async (entry) => {
        const pack = packList.find((pack) => entry.name.includes(pack.name)),
          fileName = pack ? `${toKebabCase(pack.name)}.zip` : entry.name;
        return Bun.write(
          path.join(outDir, fileName),
          await getZipEntryData(entry)
        );
      })
    ),
    successfulFiles = files.filter(
      ({ status }) => status === 'fulfilled'
    ) as PromiseFulfilledResult<number>[],
    failedFiles = files.filter(
      ({ status }) => status === 'rejected'
    ) as PromiseRejectedResult[];

  if (successfulFiles.length > 0)
    console.log(DATAPACKS_SUCCESS_MSG(successfulFiles.length, outDir));
  if (failedFiles.length > 0)
    console.log(DATAPACKS_FAILURE_MSG(failedFiles.length, outDir));
};

/**
 * Main function.
 */
const datapacks = async () => {
  const subcommand = args._[1] as DatapacksSubcommand | undefined,
    version = args.version || args.v,
    packIds = args._.slice(2);

  switch (subcommand) {
    case 'list':
      await listDatapacks(version);
      break;
    case 'download':
      await downloadDatapacks(version, packIds);
      break;
    default:
      console.log(DATAPACKS_HELP_MSG);
      if ((args.help || args.h) && !subcommand) return;
      console.log();
      throw new Error(
        subcommand
          ? DATAPACKS_INVALID_SUBCOMMAND_MSG.replace('%subcommand', subcommand)
          : INCORRECT_USAGE_MSG
      );
  }
};

export default datapacks;
