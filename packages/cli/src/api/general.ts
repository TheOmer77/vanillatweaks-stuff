import { stringSubst } from 'core';

import { api } from './instance';
import { DOWNLOAD_URL } from '@/constants/api';

export const downloadFile = async (filename: string) =>
  (
    await api.get<Buffer>(stringSubst(DOWNLOAD_URL, { filename }), {
      responseType: 'arraybuffer',
    })
  ).data;
