import chalk from 'chalk';

import {
  USAGE_COMMAND_MSG,
  USAGE_COMMANDS_PREFIX_MSG,
  USAGE_MAIN_MSG,
  USAGE_OPTIONS_PREFIX_MSG,
  USAGE_PREFIX_MSG,
  USAGE_SUBCOMMAND_MSG,
  equalLengthStrings,
  removeHtmlTags,
  stringSubst,
  toKebabCase,
  type Pack,
} from 'core';

import { args } from './args';
import { GENERAL_OPTIONS, MAIN_COMMANDS } from '@/constants/general';
import type { CliSubcommand, ReadonlyCliSubcommand } from '@/types/cli';

export const getMainHelpMsg = () => {
  const formattedCommandIds = equalLengthStrings(
      MAIN_COMMANDS.map(({ id }) => id)
    ),
    formattedOptionsArgs = equalLengthStrings(
      GENERAL_OPTIONS.map(({ args }) =>
        args.map((arg) => `-${arg.length === 1 ? '' : '-'}${arg}`).join(', ')
      )
    );
  return `${chalk.bold(USAGE_PREFIX_MSG)}${USAGE_MAIN_MSG}

${chalk.bold(USAGE_COMMANDS_PREFIX_MSG)}
${MAIN_COMMANDS.map(({ description }, index) =>
  [`  ${formattedCommandIds[index]}`, description].join('    ')
).join('\n')}
  
${chalk.bold(USAGE_OPTIONS_PREFIX_MSG)}
${GENERAL_OPTIONS.map(({ description }, index) =>
  [`  ${formattedOptionsArgs[index]}`, description].join('    ')
).join('\n')}`;
};

export const getCommandHelpMsg = (
  command: string,
  subcommands: CliSubcommand[] | readonly ReadonlyCliSubcommand[]
) => {
  const formattedSubcommandIds = equalLengthStrings(
      subcommands.map(({ id }) => id)
    ),
    formattedOptionsArgs = equalLengthStrings(
      GENERAL_OPTIONS.map(({ args }) =>
        args.map((arg) => `-${arg.length === 1 ? '' : '-'}${arg}`).join(', ')
      )
    );
  return `${chalk.bold(USAGE_PREFIX_MSG)}${stringSubst(USAGE_COMMAND_MSG, {
    command,
  })}

${chalk.bold(USAGE_COMMANDS_PREFIX_MSG)}
${subcommands
  .map(({ description }, index) =>
    [`  ${formattedSubcommandIds[index]}`, description].join('    ')
  )
  .join('\n')}
  
${chalk.bold(USAGE_OPTIONS_PREFIX_MSG)}
${GENERAL_OPTIONS.map(({ description }, index) =>
  [`  ${formattedOptionsArgs[index]}`, description].join('    ')
).join('\n')}`;
};

export const getSubcommandHelpMsg = (
  command: string,
  { id, description, usage, options }: CliSubcommand | ReadonlyCliSubcommand
) => {
  const allOptions = [...(options || []), ...GENERAL_OPTIONS];
  const formattedOptionsArgs = equalLengthStrings(
    allOptions.map(({ args }) =>
      args.map((arg) => `-${arg.length === 1 ? '' : '-'}${arg}`).join(', ')
    )
  );
  return `${description}

${chalk.bold(USAGE_PREFIX_MSG)}${stringSubst(USAGE_SUBCOMMAND_MSG, {
    command,
    subcommand: id,
    usage,
  })}
  
${chalk.bold(USAGE_OPTIONS_PREFIX_MSG)}
${allOptions
  .map(({ description }, index) =>
    [`  ${formattedOptionsArgs[index]}`, description].join('    ')
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
