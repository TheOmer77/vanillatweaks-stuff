//#region General constants

export const EXEC_NAME = 'vanillatweaks';

//#endregion

//#region Help messages

export const USAGE_PREFIX_MSG = `Usage: `;
export const USAGE_MAIN_MSG = `${EXEC_NAME} <COMMAND>`;
export const USAGE_COMMAND_MSG = `${EXEC_NAME} %command <SUBCOMMAND> [OPTIONS]`;
export const USAGE_SUBCOMMAND_MSG = `${EXEC_NAME} %command %subcommand %usage`;
export const USAGE_COMMANDS_PREFIX_MSG = `Commands: `;
export const USAGE_OPTIONS_PREFIX_MSG = `Options: `;

//#endregion

//#region Packs error messages

export const INVALID_VERSION_MSG =
  "'%version' is not a valid version for Vanilla Tweaks packs.";
export const INVALID_RESOURCE_VERSION_MSG =
  '%resources are not available for Minecraft %version.';
export const NONEXISTENT_SINGLE_MSG = "The %resource '%packs' does not exist.",
  NONEXISTENT_MULTIPLE_MSG = 'The following %resources do not exist: ';
export const INVALID_PACK_IDS_MSG = 'All pack IDs given are invalid.';
export const INCOMPATIBLE_PACKS_MSG =
  'The following %resources are incompatible with each other: %packs';

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