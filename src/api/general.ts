import { api } from './instance';
import { DOWNLOAD_URL } from '@/constants/api';

export const downloadFile = async (filename: string) =>
  (
    await api.get<Buffer>(DOWNLOAD_URL.replace('%filename', filename), {
      responseType: 'arraybuffer',
    })
  ).data;
