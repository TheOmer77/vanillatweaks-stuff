import { DATAPACKS_SUBCOMMANDS } from '@/constants/datapacks';

export type DatapacksSubcommand = (typeof DATAPACKS_SUBCOMMANDS)[number]['id'];
