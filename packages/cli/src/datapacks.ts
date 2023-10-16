import path from 'path';
import fs from 'fs/promises';
import chalk from 'chalk';
import AdmZip from 'adm-zip';

import {
  DATAPACKS_RESOURCE_NAME,
  DATAPACKS_ZIP_DEFAULT_NAME,
  DEFAULT_MC_VERSION,
  DOWNLOAD_PACKS_URL,
  INCOMPATIBLE_PACKS_MSG,
  INVALID_PACK_IDS_MSG,
  NONEXISTENT_MULTIPLE_MSG,
  NONEXISTENT_SINGLE_MSG,
  checkValidVersion,
  downloadFile,
  getDatapacksCategories,
  getDatapacksZipLink,
  getPacksByCategory,
  getZipEntryData,
  packListFromCategories,
  stringSubst,
  toKebabCase,
  type MinecraftVersion,
} from 'core';

import { args } from './utils/args';
import { printPackList } from './utils/cli';
import {
  DOWNLOAD_FAIL_MULTIPLE_MSG,
  DOWNLOAD_FAIL_SINGLE_MSG,
  DOWNLOAD_SUCCESS_MULTIPLE_MSG,
  DOWNLOAD_SUCCESS_SINGLE_MSG,
  DOWNLOADING_MULTIPLE_MSG,
  DOWNLOADING_SINGLE_MSG,
  INCORRECT_USAGE_MSG,
  INVALID_SUBCOMMAND_MSG,
} from './constants/general';
import {
  DATAPACKS_COMMAND,
  DATAPACKS_DOWNLOAD_HELP_MSG,
  DATAPACKS_HELP_MSG,
  DATAPACKS_LIST_HELP_MSG,
} from './constants/datapacks';
import type { DatapacksSubcommand } from './types/subcommands';

/**
 * Fetch all available datapacks and list them.
 *
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

  const packs = packListFromCategories(await getDatapacksCategories(version));

  printPackList(packs);
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
    packList = packListFromCategories(categories);

  const validPackIds = packIds.filter((id) =>
      packList.some(({ name }) => id === toKebabCase(name))
    ),
    invalidPackIds = packIds.filter((id) => !validPackIds.includes(id));

  if (invalidPackIds.length > 0)
    console.warn(
      invalidPackIds.length === 1
        ? chalk.bold.yellow(
            stringSubst(NONEXISTENT_SINGLE_MSG, {
              resource: DATAPACKS_RESOURCE_NAME,
              packs: invalidPackIds.join(', '),
            })
          )
        : stringSubst(
            `${chalk.yellow.bold(
              NONEXISTENT_MULTIPLE_MSG
            )}${invalidPackIds.join(', ')}`,
            { resource: DATAPACKS_RESOURCE_NAME }
          )
    );
  if (validPackIds.length < 1) throw new Error(INVALID_PACK_IDS_MSG);

  const incompatiblePackIds = validPackIds.filter((id) => {
    const pack = packList.find(({ name }) => id === toKebabCase(name));
    if (!pack) return false;
    return packIds.some((dpId) =>
      pack.incompatible.map(toKebabCase).includes(dpId)
    );
  });
  if (incompatiblePackIds.length > 0)
    throw new Error(
      stringSubst(INCOMPATIBLE_PACKS_MSG, {
        resource: DATAPACKS_RESOURCE_NAME,
        packs: incompatiblePackIds.join(', '),
      })
    );

  const packsByCategory = getPacksByCategory(packIds, categories);

  console.log(
    stringSubst(
      validPackIds.length === 1
        ? DOWNLOADING_SINGLE_MSG
        : DOWNLOADING_MULTIPLE_MSG,
      {
        count: validPackIds.length.toString(),
        resource: DATAPACKS_RESOURCE_NAME,
        packs: packList
          .filter(({ name }) => validPackIds.includes(toKebabCase(name)))
          .map(({ display }) => display)
          .join(', '),
      }
    )
  );

  const zipFilename = (await getDatapacksZipLink(version, packsByCategory))
      .split('/')
      .at(-1) as string,
    zipBuffer = await downloadFile(
      stringSubst(DOWNLOAD_PACKS_URL, { filename: zipFilename })
    );

  const outDirExists = await fs.exists(outDir);
  if (!outDirExists) await fs.mkdir(outDir, { recursive: true });

  if (args.noUnzip) {
    await Bun.write(path.join(outDir, DATAPACKS_ZIP_DEFAULT_NAME), zipBuffer);
    return console.log(
      stringSubst(
        validPackIds.length === 1
          ? DOWNLOAD_SUCCESS_SINGLE_MSG
          : DOWNLOAD_SUCCESS_MULTIPLE_MSG,
        {
          count: validPackIds.length.toString(),
          resource: DATAPACKS_RESOURCE_NAME,
          path: path.join(path.resolve(outDir), DATAPACKS_ZIP_DEFAULT_NAME),
        }
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
    console.log(
      stringSubst(
        successfulFiles.length === 1
          ? DOWNLOAD_SUCCESS_SINGLE_MSG
          : DOWNLOAD_SUCCESS_MULTIPLE_MSG,
        {
          count: successfulFiles.length.toString(),
          resource: DATAPACKS_RESOURCE_NAME,
          path: outDir,
        }
      )
    );

  if (failedFiles.length > 0)
    console.log(
      stringSubst(
        successfulFiles.length === 1
          ? DOWNLOAD_FAIL_SINGLE_MSG
          : DOWNLOAD_FAIL_MULTIPLE_MSG,
        {
          count: failedFiles.length.toString(),
          resource: DATAPACKS_RESOURCE_NAME,
          path: outDir,
        }
      )
    );
};

/**
 * Main function.
 */
const datapacks = async () => {
  const subcommand = args._[1] as DatapacksSubcommand | undefined,
    version = args.version || args.v,
    packIds = args._.slice(2);

  version && checkValidVersion(version);

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
          ? stringSubst(INVALID_SUBCOMMAND_MSG, {
              command: DATAPACKS_COMMAND,
              subcommand,
            })
          : INCORRECT_USAGE_MSG
      );
  }
};

export default datapacks;
