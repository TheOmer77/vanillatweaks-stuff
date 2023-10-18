import {
  getCommandHelpMsg,
  getSubcommandHelpMsg,
  getSubcommands,
} from '../utils/cli';

//#region Subcommands & usage

export const DATAPACKS_COMMAND = 'datapacks';
export const DATAPACKS_SUBCOMMANDS = getSubcommands('datapack');

//#endregion

//#region Messages

export const DATAPACKS_HELP_MSG = getCommandHelpMsg(
  DATAPACKS_COMMAND,
  DATAPACKS_SUBCOMMANDS
);
export const DATAPACKS_LIST_HELP_MSG = getSubcommandHelpMsg(
    DATAPACKS_COMMAND,
    DATAPACKS_SUBCOMMANDS[0]
  ),
  DATAPACKS_DOWNLOAD_HELP_MSG = getSubcommandHelpMsg(
    DATAPACKS_COMMAND,
    DATAPACKS_SUBCOMMANDS[1]
  );

//#endregion
