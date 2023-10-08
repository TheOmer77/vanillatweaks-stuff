export interface Pack {
  name: string;
  display: string;
  version: string;
  description: string;
  incompatible: string[];
  lastupdated: number;
  video?: string;
}

export interface PacksCategory {
  category: string;
  packs: Pack[];
}

export interface CategoriesResponse {
  categories: PacksCategory[];
}

export interface ZipSuccessResponse {
  status: 'success';
  link: string;
}
export interface ZipErrorResponse {
  status: 'error';
  message: string;
}
export type ZipResponse = ZipSuccessResponse | ZipErrorResponse;
