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
    usage: `[OPTIONS]`,
    options: [
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
    usage: `[OPTIONS] PACK_IDS...`,
    options: [
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
    CRAFTINGTWEAKS_COMMAND,
    CRAFTINGTWEAKS_SUBCOMMANDS[0]
  ),
  CRAFTINGTWEAKS_DOWNLOAD_HELP_MSG = getSubcommandHelpMsg(
    CRAFTINGTWEAKS_COMMAND,
    CRAFTINGTWEAKS_SUBCOMMANDS[1]
  );

//#endregion
