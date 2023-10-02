export interface CliSubcommandOption {
  args: string[];
  description: string;
}
export interface ReadonlyCliSubcommandOption
  extends Omit<Readonly<CliSubcommandOption>, 'args'> {
  args: Readonly<CliSubcommandOption['args']>;
}

export interface CliSubcommand {
  id: string;
  description: string;
  usage: string;
  options?: CliSubcommandOption[];
}
export interface ReadonlyCliSubcommand
  extends Omit<Readonly<CliSubcommand>, 'options'> {
  options?: readonly ReadonlyCliSubcommandOption[];
}
