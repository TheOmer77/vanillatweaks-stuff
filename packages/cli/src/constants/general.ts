import { DEFAULT_MC_VERSION } from 'core';

import type { CliCommand, ReadonlyCliOption } from '../types/cli';

//#region Commands & options

export const MAIN_COMMANDS = [
  {
    id: 'resourcepacks',
    description: `Resource packs tools.`,
  },
  {
    id: 'datapacks',
    description: `Datapacks tools.`,
  },
  {
    id: 'craftingtweaks',
    description: `Crafting tweaks tools.`,
  },
] as const satisfies readonly CliCommand[];
export const GENERAL_OPTIONS = [
  {
    args: ['version', 'v'],
    description: `Specify a Minecraft version. (Default: ${DEFAULT_MC_VERSION})`,
  },
  {
    args: ['help', 'h'],
    description: 'Print this help message.',
  },
] as const satisfies readonly ReadonlyCliOption[];

//#endregion

//#region Usage error messages

export const INCORRECT_USAGE_MSG = 'Incorrect usage.';
export const INVALID_SUBCOMMAND_MSG =
  "'%subcommand' is not a valid subcommand for %command.";

//#endregion

//#region Download messages

export const DOWNLOADING_SINGLE_MSG = 'Downloading %resource: %packs',
  DOWNLOADING_MULTIPLE_MSG = 'Downloading %count %resources: %packs';
export const DOWNLOAD_SUCCESS_SINGLE_MSG =
    'Successfully downloaded %count %resource to %path.',
  DOWNLOAD_SUCCESS_MULTIPLE_MSG =
    'Successfully downloaded %count %resources to %path.';
export const DOWNLOAD_FAIL_SINGLE_MSG =
    'Failed to download %count %resource to %path.',
  DOWNLOAD_FAIL_MULTIPLE_MSG = 'Failed to download %count %resources to %path.';

//#endregion
