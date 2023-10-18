import {
  getCommandHelpMsg,
  getSubcommandHelpMsg,
  getSubcommands,
} from '../utils/cli';

//#region Subcommands & usage

export const RESOURCEPACKS_COMMAND = 'resourcepacks';
export const RESOURCEPACKS_SUBCOMMANDS = getSubcommands('resourcePack');

//#endregion

//#region Messages

export const RESOURCEPACKS_HELP_MSG = getCommandHelpMsg(
  RESOURCEPACKS_COMMAND,
  RESOURCEPACKS_SUBCOMMANDS
);
export const RESOURCEPACKS_LIST_HELP_MSG = getSubcommandHelpMsg(
    RESOURCEPACKS_COMMAND,
    RESOURCEPACKS_SUBCOMMANDS[0]
  ),
  RESOURCEPACKS_DOWNLOAD_HELP_MSG = getSubcommandHelpMsg(
    RESOURCEPACKS_COMMAND,
    RESOURCEPACKS_SUBCOMMANDS[1]
  );

//#endregion
