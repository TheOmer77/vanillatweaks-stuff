import {
  getCommandHelpMsg,
  getSubcommandHelpMsg,
  getSubcommands,
} from '../utils/cli';

//#region Subcommands & usage

export const CRAFTINGTWEAKS_COMMAND = 'craftingtweaks';
export const CRAFTINGTWEAKS_SUBCOMMANDS = getSubcommands('craftingTweak');

//#endregion

//#region Messages

export const CRAFTINGTWEAKS_HELP_MSG = getCommandHelpMsg(
  CRAFTINGTWEAKS_COMMAND,
  CRAFTINGTWEAKS_SUBCOMMANDS
);
export const CRAFTINGTWEAKS_LIST_HELP_MSG = getSubcommandHelpMsg(
    CRAFTINGTWEAKS_COMMAND,
    CRAFTINGTWEAKS_SUBCOMMANDS[0]
  ),
  CRAFTINGTWEAKS_DOWNLOAD_HELP_MSG = getSubcommandHelpMsg(
    CRAFTINGTWEAKS_COMMAND,
    CRAFTINGTWEAKS_SUBCOMMANDS[1]
  );

//#endregion
