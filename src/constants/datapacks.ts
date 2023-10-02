import { resolve } from 'path';
import chalk from 'chalk';

import { EXEC_NAME, INVALID_SUBCOMMAND_MSG } from './general';
import { getCommandHelpMsg } from '@/utils/cli';
import type { ReadonlyCliSubcommand } from '@/types/cli';

//#region Defaults

export const DATAPACKS_ZIP_DEFAULT_NAME = 'datapacks.zip';

//#endregion

//#region Minecraft version
// TODO: Move to its own file, not specific to datapacks

export const DATAPACKS_MC_VERSIONS = [
  '1.13',
  '1.14',
  '1.15',
  '1.16',
  '1.17',
  '1.18',
  '1.19',
  '1.20',
] as const;
export const DATAPACKS_DEFAULT_MC_VERSION =
  '1.20' as const satisfies (typeof DATAPACKS_MC_VERSIONS)[number];

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
        description: `Minecraft version for downloaded files. (Default: ${DATAPACKS_DEFAULT_MC_VERSION})`,
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
        description: `Minecraft version for downloaded files. (Default: ${DATAPACKS_DEFAULT_MC_VERSION})`,
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

const getSubcommandHelpMsg = ({
  id,
  description,
  usage,
  options,
}: (typeof DATAPACKS_SUBCOMMANDS)[number]) => `${chalk.bold.yellow(
  id
)} - ${description}
Usage: ${usage}
Options:
${options
  .map(({ args, description }) =>
    [
      `  ${args
        .map((arg) => `-${arg.length === 1 ? '' : '-'}${arg}`)
        .join(', ')}`,
      description,
    ].join('\t\t')
  )
  .join('\n')}`;

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
