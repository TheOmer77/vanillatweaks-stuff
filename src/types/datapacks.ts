import { DATAPACKS_ACTIONS, DATAPACKS_MC_VERSIONS } from '@/constants';

export type DatapacksAction = (typeof DATAPACKS_ACTIONS)[number]['id'];
export type DatapacksMCVersion = (typeof DATAPACKS_MC_VERSIONS)[number];

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

export interface DatapacksListResponse {
  categories: DatapacksCategory[];
}
