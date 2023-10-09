import path from 'path';
import fs from 'fs/promises';

import { downloadFile } from '@/api/general';
import {
  getCraftingTweaksCategories,
  getCraftingTweaksZipLink,
} from '@/api/craftingTweaks';
import { args } from '@/utils/args';
import { printPackList } from '@/utils/cli';
import { packListFromCategories } from '@/utils/packs';
import { stringSubst, toKebabCase } from '@/utils/string';
import { checkValidVersion } from '@/utils/versions';
import {
  DOWNLOADING_PACKS_MULTIPLE_MSG,
  DOWNLOADING_PACKS_SINGLE_MSG,
  INCOMPATIBLE_PACKS_MSG,
  INCORRECT_USAGE_MSG,
  INVALID_PACK_IDS_MSG,
  INVALID_SUBCOMMAND_MSG,
  NONEXISTENT_PACKS_MULTIPLE_MSG,
  NONEXISTENT_PACKS_SINGLE_MSG,
} from '@/constants/general';
import { DEFAULT_MC_VERSION } from '@/constants/versions';
import {
  CRAFTINGTWEAKS_COMMAND,
  CRAFTINGTWEAKS_DOWNLOAD_HELP_MSG,
  CRAFTINGTWEAKS_HELP_MSG,
  CRAFTINGTWEAKS_LIST_HELP_MSG,
  CRAFTINGTWEAKS_RESOURCE_NAME,
  CRAFTINGTWEAKS_SUCCESS_MSG,
  CRAFTINGTWEAKS_ZIP_DEFAULT_NAME,
} from '@/constants/craftingTweaks';
import type { MinecraftVersion } from '@/types/versions';
import type { CraftingTweaksSubcommand } from '@/types/craftingTweaks';

/**
 * Fetch all available datapacks and list them.
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
 * Download crafting tweaks zip files.
 *
 * Datapacks will be saved as individual files unless the `--noUnzip` flag is
 * used, in which case a single zip file will be saved.
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
      stringSubst(
        invalidPackIds.length === 1
          ? NONEXISTENT_PACKS_SINGLE_MSG
          : NONEXISTENT_PACKS_MULTIPLE_MSG,
        {
          resource: CRAFTINGTWEAKS_RESOURCE_NAME,
          packs: invalidPackIds.join(', '),
        }
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
        packs: incompatiblePackIds.join(', '),
      })
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
    stringSubst(
      validPackIds.length === 1
        ? DOWNLOADING_PACKS_SINGLE_MSG
        : DOWNLOADING_PACKS_MULTIPLE_MSG,
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
    CRAFTINGTWEAKS_SUCCESS_MSG(
      validPackIds.length,
      path.join(path.resolve(outDir), CRAFTINGTWEAKS_ZIP_DEFAULT_NAME)
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