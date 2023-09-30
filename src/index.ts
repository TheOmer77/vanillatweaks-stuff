import chalk from 'chalk';

import { args } from '@/utils';

const debug: boolean = args.debug;

try {
  switch (args._[0]) {
    case 'datapacks':
      // TODO: Datapacks
      console.error('Datapacks TBD');
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
        debug && errStack ? chalk.reset(`\n${errStack}`) : ''
      }`
    )
  );
  process.exit(1);
}
