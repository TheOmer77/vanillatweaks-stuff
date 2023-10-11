import { DEFAULT_MC_VERSION } from 'core';

import type { CliCommand, ReadonlyCliOption } from '@/types/cli';

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
    description: `Minecraft version. (Default: ${DEFAULT_MC_VERSION})`,
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
