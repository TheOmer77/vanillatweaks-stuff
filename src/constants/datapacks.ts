import { EXEC_NAME } from './general';
import { DEFAULT_MC_VERSION } from './versions';
import { getCommandHelpMsg, getSubcommandHelpMsg } from '@/utils/cli';
import type { ReadonlyCliSubcommand } from '@/types/cli';

//#region Defaults

export const DATAPACKS_ZIP_DEFAULT_NAME = 'vanillatweaks-datapacks.zip';

//#endregion

//#region Subcommands & usage

export const DATAPACKS_COMMAND = 'datapacks';
export const DATAPACKS_SUBCOMMANDS = [
  {
    id: 'list',
    description: `List all available datapacks.`,
    usage: `${EXEC_NAME} ${DATAPACKS_COMMAND} list [OPTIONS]`,
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
    description: `Download datapacks.`,
    usage: `${EXEC_NAME} ${DATAPACKS_COMMAND} download [OPTIONS] PACK_IDS...`,
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
      {
        args: ['noUnzip'],
        description:
          'Save a single zip file containing all datapacks, instead of multiple files.',
      },
    ],
  },
] as const satisfies readonly ReadonlyCliSubcommand[];

//#endregion

//#region Messages

export const DATAPACKS_RESOURCE_NAME = 'datapack';
export const DATAPACKS_HELP_MSG = getCommandHelpMsg(
  DATAPACKS_COMMAND,
  DATAPACKS_SUBCOMMANDS
);
export const DATAPACKS_LIST_HELP_MSG = getSubcommandHelpMsg(
    DATAPACKS_SUBCOMMANDS[0]
  ),
  DATAPACKS_DOWNLOAD_HELP_MSG = getSubcommandHelpMsg(DATAPACKS_SUBCOMMANDS[1]);

//#endregion
