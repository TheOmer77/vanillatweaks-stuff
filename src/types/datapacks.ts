import { DATAPACKS_SUBCOMMANDS } from '@/constants/datapacks';

export type DatapacksSubcommand = (typeof DATAPACKS_SUBCOMMANDS)[number]['id'];

export interface Datapack {
  name: string;
  display: string;
  version: string;
  description: string;
  incompatible: string[];
  lastupdated: number;
  video?: string;
}

export interface DatapacksCategory {
  category: string;
  packs: Datapack[];
}

export interface DatapacksCategoriesResponse {
  categories: DatapacksCategory[];
}
export interface DatapacksZipSuccessResponse {
  status: 'success';
  link: string;
}
export interface DatapacksZipErrorResponse {
  status: 'error';
  message: string;
}
export type DatapacksZipResponse =
  | DatapacksZipSuccessResponse
  | DatapacksZipErrorResponse;
