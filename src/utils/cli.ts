import chalk from 'chalk';

import { args } from './args';
import {
  equalLengthStrings,
  removeHtmlTags,
  stringSubst,
  toKebabCase,
} from './string';
import {
  USAGE_COMMANDS_PREFIX_MSG,
  USAGE_COMMAND_MSG,
  USAGE_OPTIONS_PREFIX_MSG,
  USAGE_PREFIX_MSG,
  USAGE_SUBCOMMAND_MSG,
} from '@/constants/general';
import type { Pack } from '@/types/api';
import type { CliSubcommand, ReadonlyCliSubcommand } from '@/types/cli';

export const getSubcommandHelpMsg = (
  command: string,
  { id, description, usage, options }: CliSubcommand | ReadonlyCliSubcommand
) => {
  const formattedOptionsArgs = options
    ? equalLengthStrings(
        options.map(({ args }) =>
          args.map((arg) => `-${arg.length === 1 ? '' : '-'}${arg}`).join(', ')
        )
      )
    : [];
  return `${description}

${chalk.bold(USAGE_PREFIX_MSG)}${stringSubst(USAGE_SUBCOMMAND_MSG, {
    command,
    subcommand: id,
    usage,
  })}
  
${
  options
    ? `${chalk.bold(USAGE_OPTIONS_PREFIX_MSG)}
${options
  .map(({ description }, index) =>
    [`  ${formattedOptionsArgs[index]}`, description].join('    ')
  )
  .join('\n')}`
    : ''
}`;
};

export const getCommandHelpMsg = (
  command: string,
  subcommands: CliSubcommand[] | readonly ReadonlyCliSubcommand[]
) => {
  const formattedSubcommandIds = equalLengthStrings(
    subcommands.map(({ id }) => id)
  );
  return `${chalk.bold(USAGE_PREFIX_MSG)}${stringSubst(USAGE_COMMAND_MSG, {
    command,
  })}

${chalk.bold(USAGE_COMMANDS_PREFIX_MSG)}
${subcommands
  .map(({ description }, index) =>
    [`  ${formattedSubcommandIds[index]}`, description].join('    ')
  )
  .join('\n')}`;
};

export const printPackList = (packs: Pack[]) =>
  console.log(
    args.detailed
      ? packs
          .map(
            ({ name, display, version, description, incompatible }) =>
              `${chalk.bold(
                `${chalk.yellow(toKebabCase(name))}: ${display}${
                  typeof version === 'string' ? ` v${version}` : ''
                }`
              )}\n${removeHtmlTags(description.replaceAll('<br>', '\n'))}${
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
