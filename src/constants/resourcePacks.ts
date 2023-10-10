import { getCommandHelpMsg, getSubcommandHelpMsg } from '@/utils/cli';
import { DEFAULT_MC_VERSION } from './versions';
import type { ReadonlyCliSubcommand } from '@/types/cli';

//#region Defaults

export const RESOURCEPACKS_ZIP_DEFAULT_NAME = 'vanillatweaks-resourcepacks.zip';

//#endregion

//#region Subcommands & usage

export const RESOURCEPACKS_COMMAND = 'resourcepacks';
export const RESOURCEPACKS_SUBCOMMANDS = [
  {
    id: 'list',
    description: `List all available resource packs.`,
    usage: `[OPTIONS]`,
    options: [
      {
        args: ['version', 'v'],
        description: `Minecraft version for downloaded files. (Default: ${DEFAULT_MC_VERSION})`,
      },
      {
        args: ['detailed'],
        description:
          'Print list with additional details, such as descriptions and incompatible packs.',
      },
    ],
  },
  {
    id: 'download',
    description: `Download resource packs.`,
    usage: `[OPTIONS] PACK_IDS...`,
    options: [
      {
        args: ['version', 'v'],
        description: `Minecraft version for downloaded files. (Default: ${DEFAULT_MC_VERSION})`,
      },
      {
        args: ['outDir', 'o'],
        description:
          'Directory where file(s) will be downloaded. (Default: current directory)',
      },
    ],
  },
] as const satisfies readonly ReadonlyCliSubcommand[];

//#endregion

//#region Messages

export const RESOURCEPACKS_RESOURCE_NAME = 'resource pack';
export const RESOURCEPACKS_HELP_MSG = getCommandHelpMsg(
  RESOURCEPACKS_COMMAND,
  RESOURCEPACKS_SUBCOMMANDS
);
export const RESOURCEPACKS_LIST_HELP_MSG = getSubcommandHelpMsg(
    RESOURCEPACKS_COMMAND,
    RESOURCEPACKS_SUBCOMMANDS[0]
  ),
  RESOURCEPACKS_DOWNLOAD_HELP_MSG = getSubcommandHelpMsg(
    RESOURCEPACKS_COMMAND,
    RESOURCEPACKS_SUBCOMMANDS[1]
  );

//#endregion
