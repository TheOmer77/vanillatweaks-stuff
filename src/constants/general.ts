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

export const NONEXISTENT_PACKS_SINGLE_MSG = chalk.bold.yellow(
  "The %resource '%packs' does not exist."
);
export const NONEXISTENT_PACKS_MULTIPLE_MSG = `${chalk.bold.yellow(
  'The following %resources do not exist: '
)}%packs`;
export const INVALID_PACK_IDS_MSG = 'All pack IDs given are invalid.';
export const INCOMPATIBLE_PACKS_MSG =
  'The following crafting tweaks are incompatible with each other: %packs';
export const DOWNLOADING_PACKS_SINGLE_MSG = 'Downloading %resource: %packs';
export const DOWNLOADING_PACKS_MULTIPLE_MSG =
  'Downloading %count %resources: %packs';
