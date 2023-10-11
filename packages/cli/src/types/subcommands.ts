import { RESOURCEPACKS_SUBCOMMANDS } from '../constants/resourcePacks';
import { DATAPACKS_SUBCOMMANDS } from '../constants/datapacks';
import { CRAFTINGTWEAKS_SUBCOMMANDS } from '../constants/craftingTweaks';

export type ResourcePacksSubcommand =
  (typeof RESOURCEPACKS_SUBCOMMANDS)[number]['id'];
export type DatapacksSubcommand = (typeof DATAPACKS_SUBCOMMANDS)[number]['id'];
export type CraftingTweaksSubcommand =
  (typeof CRAFTINGTWEAKS_SUBCOMMANDS)[number]['id'];
