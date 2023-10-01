import { DOWNLOAD_URL } from '@/constants';
import { api } from './instance';

export const downloadFile = async (filename: string) =>
  (
    await api.get<Buffer>(DOWNLOAD_URL.replace('%filename', filename), {
      responseType: 'arraybuffer',
    })
  ).data;
