import chalk from 'chalk';

import craftingTweaks from '@/craftingTweaks';
import datapacks from '@/datapacks';
import resourcePacks from '@/resourcePacks';
import { args } from '@/utils/args';

try {
  switch (args._[0]) {
    case 'resourcepacks':
      await resourcePacks();
      break;
    case 'datapacks':
      await datapacks();
      break;
    case 'craftingtweaks':
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
