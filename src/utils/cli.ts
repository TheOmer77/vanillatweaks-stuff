import chalk from 'chalk';
import { POSSIBLE_SUBCOMMANDS_MSG } from '@/constants';
import type { CliSubcommand, ReadonlyCliSubcommand } from '@/types';

export const getSubcommandHelpMsg = ({
  id,
  description,
  usage,
  options,
}: CliSubcommand | ReadonlyCliSubcommand) => `${chalk.bold.yellow(
  id
)} - ${description}
Usage: ${usage}
${
  options
    ? `Options:
${options
  .map(({ args, description }) =>
    [
      `  ${args
        .map((arg) => `-${arg.length === 1 ? '' : '-'}${arg}`)
        .join(', ')}`,
      description,
    ].join('\t\t')
  )
  .join('\n')}`
    : ''
}`;

export const getCommandHelpMsg = (
  command: string,
  subcommands: CliSubcommand[] | readonly ReadonlyCliSubcommand[]
) =>
  `${POSSIBLE_SUBCOMMANDS_MSG.replace('%command', command)}
${subcommands.map(getSubcommandHelpMsg).join('\n\n')}`;
