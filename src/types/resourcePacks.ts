import { RESOURCEPACKS_SUBCOMMANDS } from '@/constants/resourcePacks';

export type ResourcePacksSubcommand =
  (typeof RESOURCEPACKS_SUBCOMMANDS)[number]['id'];
