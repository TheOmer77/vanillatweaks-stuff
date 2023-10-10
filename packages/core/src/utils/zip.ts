import type { IZipEntry } from 'adm-zip';

export const getZipEntryData = async (entry: IZipEntry) =>
  await new Promise<Buffer>((resolve, reject) => {
    entry.getDataAsync((data, err) => (err ? reject(err) : resolve(data)));
  });
