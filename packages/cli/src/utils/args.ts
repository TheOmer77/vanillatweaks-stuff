import minimist from 'minimist';

import type { MinecraftVersion } from 'core';

export interface ArgsOptions {
  /**
   * Print help message for command/subcommand.
   */
  help?: boolean;
  /** Shorthand for `--help`. */
  h?: ArgsOptions['help'];

  /**
   * Minecraft version for downloaded files.
   * If not given, the latest version will be used.
   */
  version?: MinecraftVersion;
  /** Shorthand for `--version`. */
  v?: ArgsOptions['version'];

  /**
   * Print list with additional details, such as descriptions and
   * incompatible packs.
   */
  detailed?: boolean;

  /**
   * Directory where file(s) will be downloaded.
   * If not given, the current working directory will be used.
   */
  outDir?: string;
  /** Shorthand for `--outDir`. */
  o?: ArgsOptions['outDir'];
  /**
   * Save a single zip file instead of multiple files.
   */
  noUnzip?: boolean;

  /**
   * Print error stack traces & additional debug logging.
   */
  debug?: boolean;
}

export const args = minimist<ArgsOptions>(process.argv.slice(2), {
  boolean: ['help', 'h', 'detailed', 'noUnzip', 'debug'],
  string: ['version', 'v', 'outDir', 'o'],
});
