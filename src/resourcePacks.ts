import { getResourcePacksCategories } from '@/api/resourcePacks';
import { args } from '@/utils/args';
import { printPackList } from '@/utils/cli';
import { packListFromCategories } from '@/utils/packs';
import { stringSubst } from '@/utils/string';
import { checkValidVersion } from '@/utils/versions';
import {
  INCORRECT_USAGE_MSG,
  INVALID_SUBCOMMAND_MSG,
} from '@/constants/general';
import { DEFAULT_MC_VERSION } from '@/constants/versions';
import { RESOURCEPACKS_COMMAND } from '@/constants/resourcePacks';
import type { MinecraftVersion } from '@/types/versions';
import type { CraftingTweaksSubcommand } from '@/types/craftingTweaks';

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
    // TODO: Replace with actual message
    console.log('TBD: RESOURCEPACKS_LIST_HELP_MSG');

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
  // TODO: Implement download
  throw new Error('Not implemented yet');
};

/**
 * Main function.
 */
const resourcePacks = async () => {
  const subcommand = args._[1] as CraftingTweaksSubcommand | undefined,
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
      // TODO: Replace with actual message
      console.log('TBD: RESOURCEPACKS_HELP_MSG');
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
