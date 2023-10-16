import { api } from './instance';

export const downloadFile = async (url: string) =>
  (await api.get<Buffer>(url, { responseType: 'arraybuffer' })).data;
