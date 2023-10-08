import { args } from '@/utils/args';
import { checkValidVersion } from '@/utils/versions';
import { DEFAULT_MC_VERSION } from '@/constants/versions';
import { INCORRECT_USAGE_MSG } from '@/constants/general';
import {
  CRAFTINGTWEAKS_HELP_MSG,
  CRAFTINGTWEAKS_INVALID_SUBCOMMAND_MSG,
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
  throw new Error('TBD');
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
  throw new Error('TBD');
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
          ? CRAFTINGTWEAKS_INVALID_SUBCOMMAND_MSG.replace(
              '%subcommand',
              subcommand
            )
          : INCORRECT_USAGE_MSG
      );
  }
};

export default craftingTweaks;
