import { CRAFTINGTWEAKS_SUBCOMMANDS } from '@/constants/craftingTweaks';

export type CraftingTweaksSubcommand =
  (typeof CRAFTINGTWEAKS_SUBCOMMANDS)[number]['id'];
