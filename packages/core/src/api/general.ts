import { api } from './instance';
import { stringSubst } from '@/utils';
import { DOWNLOAD_URL } from '@/constants';

export const downloadFile = async (filename: string) =>
  (
    await api.get<Buffer>(stringSubst(DOWNLOAD_URL, { filename }), {
      responseType: 'arraybuffer',
    })
  ).data;
