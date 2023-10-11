import path from 'path';
import fs from 'fs/promises';
import chalk from 'chalk';

import {
  DEFAULT_MC_VERSION,
  DOWNLOAD_SUCCESS_MULTIPLE_MSG,
  DOWNLOAD_SUCCESS_SINGLE_MSG,
  DOWNLOADING_MULTIPLE_MSG,
  DOWNLOADING_SINGLE_MSG,
  INCOMPATIBLE_PACKS_MSG,
  INVALID_PACK_IDS_MSG,
  NONEXISTENT_MULTIPLE_MSG,
  NONEXISTENT_SINGLE_MSG,
  RESOURCEPACKS_RESOURCE_NAME,
  RESOURCEPACKS_ZIP_DEFAULT_NAME,
  checkValidVersion,
  downloadFile,
  getPacksByCategory,
  getResourcePacksCategories,
  getResourcePacksZipLink,
  packListFromCategories,
  stringSubst,
  toKebabCase,
  type MinecraftVersion,
} from 'core';

import { args } from './utils/args';
import { printPackList } from './utils/cli';
import {
  INCORRECT_USAGE_MSG,
  INVALID_SUBCOMMAND_MSG,
} from './constants/general';
import {
  RESOURCEPACKS_COMMAND,
  RESOURCEPACKS_DOWNLOAD_HELP_MSG,
  RESOURCEPACKS_HELP_MSG,
  RESOURCEPACKS_LIST_HELP_MSG,
} from './constants/resourcePacks';
import type { ResourcePacksSubcommand } from './types/subcommands';

/**
 * Fetch all available resource packs and list them.
 *
 * @param version Minecraft version.
 */
const listResourcePacks = async (
  version: MinecraftVersion = DEFAULT_MC_VERSION
) => {
  const showHelp = args.help || args.h;
  const incorrectUsage = typeof version !== 'string';
  if (showHelp || incorrectUsage) {
    console.log(RESOURCEPACKS_LIST_HELP_MSG);

    if (showHelp) return;
    console.log();
    throw new Error(INCORRECT_USAGE_MSG);
  }

  const packs = packListFromCategories(
    await getResourcePacksCategories(version)
  );

  printPackList(packs);
};

/**
 * Download resource packs zip file.
 *
 * @param version Minecraft version.
 * @param packIds IDs of resource packs to download.
 */
const downloadResourcePacks = async (
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
    console.log(RESOURCEPACKS_DOWNLOAD_HELP_MSG);

    if (showHelp) return;
    console.log();
    throw new Error(INCORRECT_USAGE_MSG);
  }

  const categories = await getResourcePacksCategories(version),
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
              resource: RESOURCEPACKS_RESOURCE_NAME,
              packs: invalidPackIds.join(', '),
            })
          )
        : stringSubst(
            `${chalk.yellow.bold(
              NONEXISTENT_MULTIPLE_MSG
            )}${invalidPackIds.join(', ')}`,
            { resource: RESOURCEPACKS_RESOURCE_NAME }
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
        resource: RESOURCEPACKS_RESOURCE_NAME,
        packs: incompatiblePackIds.join(', '),
      })
    );

  const packsByCategory = getPacksByCategory(validPackIds, categories);

  const formData = new FormData();
  formData.append('version', version);
  formData.append('packs', JSON.stringify(packsByCategory));

  console.log(
    stringSubst(
      validPackIds.length === 1
        ? DOWNLOADING_SINGLE_MSG
        : DOWNLOADING_MULTIPLE_MSG,
      {
        count: validPackIds.length.toString(),
        resource: RESOURCEPACKS_RESOURCE_NAME,
        packs: packList
          .filter(({ name }) => validPackIds.includes(toKebabCase(name)))
          .map(({ display }) => display)
          .join(', '),
      }
    )
  );

  const zipFilename = (await getResourcePacksZipLink(version, packsByCategory))
      .split('/')
      .at(-1) as string,
    zipBuffer = await downloadFile(zipFilename);

  const outDirExists = await fs.exists(outDir);
  if (!outDirExists) await fs.mkdir(outDir, { recursive: true });

  await Bun.write(path.join(outDir, RESOURCEPACKS_ZIP_DEFAULT_NAME), zipBuffer);
  return console.log(
    stringSubst(
      validPackIds.length === 1
        ? DOWNLOAD_SUCCESS_SINGLE_MSG
        : DOWNLOAD_SUCCESS_MULTIPLE_MSG,
      {
        count: validPackIds.length.toString(),
        resource: RESOURCEPACKS_RESOURCE_NAME,
        path: path.join(path.resolve(outDir), RESOURCEPACKS_ZIP_DEFAULT_NAME),
      }
    )
  );
};

/**
 * Main function.
 */
const resourcePacks = async () => {
  const subcommand = args._[1] as ResourcePacksSubcommand | undefined,
    version = args.version || args.v,
    packIds = args._.slice(2);

  version && checkValidVersion(version);

  switch (subcommand) {
    case 'list':
      await listResourcePacks(version);
      break;
    case 'download':
      await downloadResourcePacks(version, packIds);
      break;
    default:
      console.log(RESOURCEPACKS_HELP_MSG);
      if ((args.help || args.h) && !subcommand) return;
      console.log();
      throw new Error(
        subcommand
          ? stringSubst(INVALID_SUBCOMMAND_MSG, {
              command: RESOURCEPACKS_COMMAND,
              subcommand,
            })
          : INCORRECT_USAGE_MSG
      );
  }
};

export default resourcePacks;
