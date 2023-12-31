import chalk from 'chalk';

import craftingTweaks from './craftingTweaks';
import datapacks from './datapacks';
import resourcePacks from './resourcePacks';

import { args } from './utils/args';
import { getMainHelpMsg } from './utils/cli';
import { INCORRECT_USAGE_MSG } from './constants/general';
import { RESOURCEPACKS_COMMAND } from './constants/resourcePacks';
import { DATAPACKS_COMMAND } from './constants/datapacks';
import { CRAFTINGTWEAKS_COMMAND } from './constants/craftingTweaks';

const main = async () => {
  try {
    switch (args._[0]) {
      case RESOURCEPACKS_COMMAND:
        await resourcePacks();
        break;
      case DATAPACKS_COMMAND:
        await datapacks();
        break;
      case CRAFTINGTWEAKS_COMMAND:
        await craftingTweaks();
        break;
      default:
        console.log(getMainHelpMsg());
        if (!(args.help || args.h)) {
          console.log();
          throw new Error(INCORRECT_USAGE_MSG);
        }
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Unknown error!',
      errStack =
        err instanceof Error && err.stack
          ? err.stack.split('\n').slice(1).join('\n')
          : undefined;
    console.error(
      chalk.red(
        `${chalk.bold('Error: ')}${chalk.reset(errMsg)}${
          args.debug && errStack ? chalk.reset(`\n${errStack}`) : ''
        }`
      )
    );
    process.exit(1);
  }
};

main();
