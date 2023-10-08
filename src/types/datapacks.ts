import { DATAPACKS_SUBCOMMANDS } from '@/constants/datapacks';

export type DatapacksSubcommand = (typeof DATAPACKS_SUBCOMMANDS)[number]['id'];
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
