import path from 'path';
import fs from 'fs/promises';

import {
  DEFAULT_MC_VERSION,
  RESOURCEPACKS_RESOURCE_NAME,
  RESOURCEPACKS_ZIP_DEFAULT_NAME,
  checkValidVersion,
  downloadMultiplePacks,
  downloadZippedPacks,
  getResourcePacksCategories,
  packListFromCategories,
  stringSubst,
  type MinecraftVersion,
} from 'core';

import { args } from './utils/args';
import { printPackList } from './utils/cli';
import { exists } from './utils/fs';
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
    zipped = args.zipped || args.z,
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

  const resolvedOutDir = path.resolve(outDir);
  const outDirExists = await exists(resolvedOutDir);

  if (zipped) {
    const outPath = path.join(resolvedOutDir, RESOURCEPACKS_ZIP_DEFAULT_NAME);
    const zipBuffer = await downloadZippedPacks(
      'resourcePack',
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
                resource: RESOURCEPACKS_RESOURCE_NAME,
                packs: packs.map(({ display }) => display).join(', '),
              }
            )
          ),
      }
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
          resource: RESOURCEPACKS_RESOURCE_NAME,
          path: outPath,
        }
      )
    );
  }

  const packBuffers = await downloadMultiplePacks(
    'resourcePack',
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
              resource: RESOURCEPACKS_RESOURCE_NAME,
              packs: packs.map(({ display }) => display).join(', '),
            }
          )
        ),
    }
  );

  if (!outDirExists) await fs.mkdir(resolvedOutDir, { recursive: true });

  const fileWrites = await Promise.allSettled(
      packBuffers.map(async (buffer, index) => {
        // Error message doesn't matter here, just reject this promise
        if (!buffer) throw new Error();
        await Bun.write(
          path.join(resolvedOutDir, `${packIds[index]}.zip`),
          buffer
        );
      })
    ),
    successfulWrites = fileWrites.filter(
      ({ status }) => status === 'fulfilled'
    ),
    failedWrites = fileWrites.filter(({ status }) => status === 'rejected');

  if (successfulWrites.length > 0)
    console.log(
      stringSubst(
        successfulWrites.length === 1
          ? DOWNLOAD_SUCCESS_SINGLE_MSG
          : DOWNLOAD_SUCCESS_MULTIPLE_MSG,
        {
          count: successfulWrites.length.toString(),
          resource: RESOURCEPACKS_RESOURCE_NAME,
          path: outDir,
        }
      )
    );

  if (failedWrites.length > 0)
    console.log(
      stringSubst(
        failedWrites.length === 1
          ? DOWNLOAD_FAIL_SINGLE_MSG
          : DOWNLOAD_FAIL_MULTIPLE_MSG,
        {
          count: failedWrites.length.toString(),
          resource: RESOURCEPACKS_RESOURCE_NAME,
          path: outDir,
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
