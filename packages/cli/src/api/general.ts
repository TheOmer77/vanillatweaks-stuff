import { DOWNLOAD_URL, stringSubst } from 'core';

import { api } from './instance';

export const downloadFile = async (filename: string) =>
  (
    await api.get<Buffer>(stringSubst(DOWNLOAD_URL, { filename }), {
      responseType: 'arraybuffer',
    })
  ).data;
