import path from 'path';
import fs from 'fs/promises';

import {
  CRAFTINGTWEAKS_RESOURCE_NAME,
  CRAFTINGTWEAKS_ZIP_DEFAULT_NAME,
  DEFAULT_MC_VERSION,
  checkValidVersion,
  downloadMultiplePacks,
  downloadZippedPacks,
  getCraftingTweaksCategories,
  packListFromCategories,
  stringSubst,
  type MinecraftVersion,
} from 'core';

import { args } from './utils/args';
import { printPackList } from './utils/cli';
import {
  DOWNLOAD_SUCCESS_MULTIPLE_MSG,
  DOWNLOAD_SUCCESS_SINGLE_MSG,
  DOWNLOADING_MULTIPLE_MSG,
  DOWNLOADING_SINGLE_MSG,
  INCORRECT_USAGE_MSG,
  INVALID_SUBCOMMAND_MSG,
} from './constants/general';
import {
  CRAFTINGTWEAKS_COMMAND,
  CRAFTINGTWEAKS_DOWNLOAD_HELP_MSG,
  CRAFTINGTWEAKS_HELP_MSG,
  CRAFTINGTWEAKS_LIST_HELP_MSG,
} from './constants/craftingTweaks';
import type { CraftingTweaksSubcommand } from './types/subcommands';

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

  const resolvedOutDir = path.resolve(outDir);
  const outDirExists = await fs.exists(resolvedOutDir);

  if (args.noUnzip) {
    const outPath = path.join(resolvedOutDir, CRAFTINGTWEAKS_ZIP_DEFAULT_NAME);
    const zipBuffer = await downloadZippedPacks(
      'craftingTweak',
      packIds,
      version
    );

    if (!outDirExists) await fs.mkdir(resolvedOutDir, { recursive: true });
    await Bun.write(outPath, zipBuffer);

    return console.log(
      stringSubst(
        packIds.length === 1
          ? DOWNLOAD_SUCCESS_SINGLE_MSG
          : DOWNLOAD_SUCCESS_MULTIPLE_MSG,
        {
          count: packIds.length.toString(),
          resource: CRAFTINGTWEAKS_RESOURCE_NAME,
          path: outPath,
        }
      )
    );
  }

  const packBuffers = await downloadMultiplePacks(
    'craftingTweak',
    packIds,
    version,
    {
      onDownloading: (packs) =>
        console.log(
          stringSubst(
            packs.length === 1
              ? DOWNLOADING_SINGLE_MSG
              : DOWNLOADING_MULTIPLE_MSG,
            {
              count: packs.length.toString(),
              resource: CRAFTINGTWEAKS_RESOURCE_NAME,
              packs: packs.map(({ display }) => display).join(', '),
            }
          )
        ),
    }
  );

  if (!outDirExists) await fs.mkdir(resolvedOutDir, { recursive: true });

  const successfulWrites = (
    await Promise.allSettled(
      packBuffers.map(async (buffer, index) => {
        if (buffer)
          await Bun.write(
            path.join(resolvedOutDir, `${packIds[index]}.zip`),
            buffer
          );
      })
    )
  ).filter(({ status }) => status === 'fulfilled');

  return console.log(
    stringSubst(
      successfulWrites.length === 1
        ? DOWNLOAD_SUCCESS_SINGLE_MSG
        : DOWNLOAD_SUCCESS_MULTIPLE_MSG,
      {
        count: successfulWrites.length.toString(),
        resource: CRAFTINGTWEAKS_RESOURCE_NAME,
        path: path.resolve(outDir),
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
