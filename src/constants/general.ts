import chalk from 'chalk';

export const EXEC_NAME = 'vanillatweaks';

export const POSSIBLE_SUBCOMMANDS_MSG = `${chalk.bold(
  'Possible subcommands for %command:'
)}
`;
export const INCORRECT_USAGE_MSG = 'Incorrect usage.';
export const INVALID_SUBCOMMAND_MSG =
  "'%subcommand' is not a valid subcommand for %command.";
export const INVALID_VERSION_MSG =
  "'%version' is not a valid version for Vanilla Tweaks packs.";
export const INVALID_RESOURCE_VERSION_MSG =
  '%resources are not available for Minecraft %version.';
