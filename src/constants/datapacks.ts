import { resolve } from 'path';

import { EXEC_NAME, INVALID_SUBCOMMAND_MSG } from './general';
import { getCommandHelpMsg, getSubcommandHelpMsg } from '@/utils/cli';
import type { ReadonlyCliSubcommand } from '@/types/cli';
import { DEFAULT_MC_VERSION } from './versions';

//#region Defaults

export const DATAPACKS_ZIP_DEFAULT_NAME = 'datapacks.zip';

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
    usage: `${EXEC_NAME} ${DATAPACKS_COMMAND} download [OPTIONS] DATAPACK_IDS...`,
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

export const DATAPACKS_HELP_MSG = getCommandHelpMsg(
  DATAPACKS_COMMAND,
  DATAPACKS_SUBCOMMANDS
);
export const DATAPACKS_LIST_HELP_MSG = getSubcommandHelpMsg(
    DATAPACKS_SUBCOMMANDS[0]
  ),
  DATAPACKS_DOWNLOAD_HELP_MSG = getSubcommandHelpMsg(DATAPACKS_SUBCOMMANDS[1]);
export const DATAPACKS_INVALID_SUBCOMMAND_MSG = INVALID_SUBCOMMAND_MSG.replace(
  '%command',
  DATAPACKS_COMMAND
);
export const DATAPACKS_SUCCESS_MSG = (datapacksCount: number, path: string) =>
  `Successfully downloaded ${datapacksCount} datapack${
    datapacksCount === 1 ? '' : 's'
  } to ${resolve(path)}.`;
export const DATAPACKS_FAILURE_MSG = (datapacksCount: number, path: string) =>
  `Failed to downloaded ${datapacksCount} datapack${
    datapacksCount === 1 ? '' : 's'
  } to ${resolve(path)}.`;

//#endregion
