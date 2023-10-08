import chalk from 'chalk';

import craftingTweaks from '@/craftingTweaks';
import datapacks from '@/datapacks';
import resourcePacks from '@/resourcePacks';

import { args } from '@/utils/args';
import { RESOURCEPACKS_COMMAND } from '@/constants/resourcePacks';
import { DATAPACKS_COMMAND } from '@/constants/datapacks';
import { CRAFTINGTWEAKS_COMMAND } from '@/constants/craftingTweaks';

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
      throw new Error('Invalid usage! Usage TBD');
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
