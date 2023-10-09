import { EXEC_NAME } from './general';
import { DEFAULT_MC_VERSION } from './versions';
import { getCommandHelpMsg, getSubcommandHelpMsg } from '@/utils/cli';
import type { ReadonlyCliSubcommand } from '@/types/cli';

//#region Defaults

export const CRAFTINGTWEAKS_ZIP_DEFAULT_NAME =
  'vanillatweaks-craftingtweaks.zip';

//#endregion

//#region Subcommands & usage

export const CRAFTINGTWEAKS_COMMAND = 'craftingtweaks';
export const CRAFTINGTWEAKS_SUBCOMMANDS = [
  {
    id: 'list',
    description: `List all available crafting tweaks.`,
    usage: `${EXEC_NAME} ${CRAFTINGTWEAKS_COMMAND} list [OPTIONS]`,
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
    description: `Download crafting tweaks.`,
    usage: `${EXEC_NAME} ${CRAFTINGTWEAKS_COMMAND} download [OPTIONS] PACK_IDS...`,
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

export const CRAFTINGTWEAKS_RESOURCE_NAME = 'crafing tweak';
export const CRAFTINGTWEAKS_HELP_MSG = getCommandHelpMsg(
  CRAFTINGTWEAKS_COMMAND,
  CRAFTINGTWEAKS_SUBCOMMANDS
);
export const CRAFTINGTWEAKS_LIST_HELP_MSG = getSubcommandHelpMsg(
    CRAFTINGTWEAKS_SUBCOMMANDS[0]
  ),
  CRAFTINGTWEAKS_DOWNLOAD_HELP_MSG = getSubcommandHelpMsg(
    CRAFTINGTWEAKS_SUBCOMMANDS[1]
  );

//#endregion
