import chalk from 'chalk';

import { args } from './args';
import { toKebabCase } from './string';
import { POSSIBLE_SUBCOMMANDS_MSG } from '@/constants/general';
import type { Pack } from '@/types/api';
import type { CliSubcommand, ReadonlyCliSubcommand } from '@/types/cli';

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

export const printPackList = (packs: Pack[]) =>
  console.log(
    args.detailed
      ? packs
          .map(
            ({ name, display, version, description, incompatible }) =>
              `${chalk.bold(
                `${chalk.yellow(toKebabCase(name))}: ${display} v${version}`
              )}\n${description}${
                incompatible.length > 0
                  ? `\n${chalk.red('Incompatible with:')} ${incompatible
                      .map((incompatibleName) => toKebabCase(incompatibleName))
                      .join(', ')}`
                  : ''
              }`
          )
          .join('\n\n')
      : packs.map(({ name }) => toKebabCase(name)).join('\n')
  );