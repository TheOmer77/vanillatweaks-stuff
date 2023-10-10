export interface CliOption {
  args: string[];
  description: string;
}
export interface ReadonlyCliOption extends Omit<Readonly<CliOption>, 'args'> {
  args: Readonly<CliOption['args']>;
}

export interface CliCommand {
  id: string;
  description: string;
}

export interface CliSubcommand {
  id: string;
  description: string;
  usage: string;
  options?: CliOption[];
}
export interface ReadonlyCliSubcommand
  extends Omit<Readonly<CliSubcommand>, 'options'> {
  options?: readonly ReadonlyCliOption[];
}
