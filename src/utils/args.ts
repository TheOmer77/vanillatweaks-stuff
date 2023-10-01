import minimist from 'minimist';

import type { DatapacksMCVersion } from '@/types';

export interface ArgsOptions {
  /**
   * Print help message for command/subcommand.
   */
  help?: boolean;

  /**
   * Minecraft version for downloaded files.
   * If not given, the latest version will be used.
   */
  version?: DatapacksMCVersion;
  /**
   * Directory where files will be downloaded.
   * If not given, the current working directory will be used.
   */
  outDir?: string;

  /**
   * Print error stack traces & additional debug logging.
   */
  debug?: boolean;
}

export const args = minimist<ArgsOptions>(process.argv.slice(2));
