import JSZip, { JSZipObject } from 'jszip';

// TODO: REMOVE ADM-ZIP
import type { IZipEntry } from 'adm-zip';

export const zipFromBuffer = async (buffer: Buffer) =>
  await JSZip.loadAsync(buffer);

export const bufferFromZip = async (zip: JSZip) =>
  Buffer.from(await zip.generateAsync({ type: 'arraybuffer' }));

export const modifiedZipFromBuffer = async (
  buffer: Buffer,
  modifyZip: (zip: JSZip) => void
) => {
  const zip = await zipFromBuffer(buffer);
  modifyZip(zip);
  return await bufferFromZip(zip);
};

export const getZipFile = async (zipFile: JSZipObject) =>
  Buffer.from(await zipFile.async('arraybuffer'));

export const getZipEntryData = async (entry: IZipEntry) =>
  await new Promise<Buffer>((resolve, reject) => {
    entry.getDataAsync((data, err) => (err ? reject(err) : resolve(data)));
  });
