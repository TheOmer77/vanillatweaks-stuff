import { DOWNLOAD_URL } from '@/constants';
import { api } from './instance';

export const downloadFile = async (filename: string) =>
  Buffer.from(
    (
      await api.get(DOWNLOAD_URL.replace('%filename', filename), {
        responseType: 'arraybuffer',
      })
    ).data
  );
