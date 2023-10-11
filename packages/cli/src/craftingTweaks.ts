import path from 'path';
import fs from 'fs/promises';
import chalk from 'chalk';

import {
  CRAFTINGTWEAKS_RESOURCE_NAME,
  CRAFTINGTWEAKS_ZIP_DEFAULT_NAME,
  DEFAULT_MC_VERSION,
  DOWNLOAD_SUCCESS_MULTIPLE_MSG,
  DOWNLOAD_SUCCESS_SINGLE_MSG,
  DOWNLOADING_MULTIPLE_MSG,
  DOWNLOADING_SINGLE_MSG,
  INCOMPATIBLE_PACKS_MSG,
  INVALID_PACK_IDS_MSG,
  NONEXISTENT_MULTIPLE_MSG,
  NONEXISTENT_SINGLE_MSG,
  checkValidVersion,
  getPacksByCategory,
  packListFromCategories,
  stringSubst,
  toKebabCase,
  type MinecraftVersion,
} from 'core';

import { downloadFile } from '@/api/general';
import {
  getCraftingTweaksCategories,
  getCraftingTweaksZipLink,
} from '@/api/craftingTweaks';
import { args } from '@/utils/args';
import { printPackList } from '@/utils/cli';
import {
  INCORRECT_USAGE_MSG,
  INVALID_SUBCOMMAND_MSG,
} from '@/constants/general';
import {
  CRAFTINGTWEAKS_COMMAND,
  CRAFTINGTWEAKS_DOWNLOAD_HELP_MSG,
  CRAFTINGTWEAKS_HELP_MSG,
  CRAFTINGTWEAKS_LIST_HELP_MSG,
} from '@/constants/craftingTweaks';
import type { CraftingTweaksSubcommand } from '@/types/subcommands';

/**
 * Fetch all available crafting tweaks and list them.
 *
 * @param version Minecraft version.
 */
const listCraftingTweaks = async (
  version: MinecraftVersion = DEFAULT_MC_VERSION
) => {
  const showHelp = args.help || args.h;
  const incorrectUsage = typeof version !== 'string';
  if (showHelp || incorrectUsage) {
    console.log(CRAFTINGTWEAKS_LIST_HELP_MSG);

    if (showHelp) return;
    console.log();
    throw new Error(INCORRECT_USAGE_MSG);
  }

  const packs = packListFromCategories(
    await getCraftingTweaksCategories(version)
  );

  printPackList(packs);
};

/**
 * Download crafting tweaks zip file.
 *
 * @param version Minecraft version.
 * @param packIds IDs of datapacks to download.
 */
const downloadCraftingTweaks = async (
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
    console.log(CRAFTINGTWEAKS_DOWNLOAD_HELP_MSG);

    if (showHelp) return;
    console.log();
    throw new Error(INCORRECT_USAGE_MSG);
  }

  const categories = await getCraftingTweaksCategories(version),
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
              resource: CRAFTINGTWEAKS_RESOURCE_NAME,
              packs: invalidPackIds.join(', '),
            })
          )
        : stringSubst(
            `${chalk.yellow.bold(
              NONEXISTENT_MULTIPLE_MSG
            )}${invalidPackIds.join(', ')}`,
            { resource: CRAFTINGTWEAKS_RESOURCE_NAME }
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
        resource: CRAFTINGTWEAKS_RESOURCE_NAME,
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
        resource: CRAFTINGTWEAKS_RESOURCE_NAME,
        packs: packList
          .filter(({ name }) => validPackIds.includes(toKebabCase(name)))
          .map(({ display }) => display)
          .join(', '),
      }
    )
  );

  const zipFilename = (await getCraftingTweaksZipLink(version, packsByCategory))
      .split('/')
      .at(-1) as string,
    zipBuffer = await downloadFile(zipFilename);

  const outDirExists = await fs.exists(outDir);
  if (!outDirExists) await fs.mkdir(outDir, { recursive: true });

  await Bun.write(
    path.join(outDir, CRAFTINGTWEAKS_ZIP_DEFAULT_NAME),
    zipBuffer
  );
  return console.log(
    stringSubst(
      validPackIds.length === 1
        ? DOWNLOAD_SUCCESS_SINGLE_MSG
        : DOWNLOAD_SUCCESS_MULTIPLE_MSG,
      {
        count: validPackIds.length.toString(),
        resource: CRAFTINGTWEAKS_RESOURCE_NAME,
        path: path.join(path.resolve(outDir), CRAFTINGTWEAKS_ZIP_DEFAULT_NAME),
      }
    )
  );
};

/**
 * Main function.
 */
const craftingTweaks = async () => {
  const subcommand = args._[1] as CraftingTweaksSubcommand | undefined,
    version = args.version || args.v,
    packIds = args._.slice(2);

  version && checkValidVersion(version);

  switch (subcommand) {
    case 'list':
      await listCraftingTweaks(version);
      break;
    case 'download':
      await downloadCraftingTweaks(version, packIds);
      break;
    default:
      console.log(CRAFTINGTWEAKS_HELP_MSG);
      if ((args.help || args.h) && !subcommand) return;
      console.log();
      throw new Error(
        subcommand
          ? stringSubst(INVALID_SUBCOMMAND_MSG, {
              command: CRAFTINGTWEAKS_COMMAND,
              subcommand,
            })
          : INCORRECT_USAGE_MSG
      );
  }
};

export default craftingTweaks;
