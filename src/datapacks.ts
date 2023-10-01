import path from 'path';
import fs from 'fs/promises';
import chalk from 'chalk';
import AdmZip from 'adm-zip';

import {
  downloadFile,
  fetchDatapacksCategories,
  getDatapacksZipLink,
} from '@/api';
import { args, getZipEntryData } from '@/utils';
import {
  DATAPACKS_ACTIONS,
  DATAPACKS_DEFAULT_MC_VERSION,
  DATAPACKS_FAILURE_MSG,
  DATAPACKS_SUCCESS_MSG,
  DATAPACKS_ZIP_DEFAULT_NAME,
} from '@/constants';
import type {
  Datapack,
  DatapacksAction,
  DatapacksCategory,
  DatapacksMCVersion,
} from '@/types';

const POSSIBLE_ACTIONS_MSG = `${chalk.bold('Possible actions for datapacks:')}
${DATAPACKS_ACTIONS.map(
  ({ id, description }) => `${chalk.bold(chalk.yellow(id))} - ${description}`
).join('\n')}`;

const datapackNameToId = (name: string) => name.replaceAll(' ', '-');

const datapacksListFromCategories = (categories: DatapacksCategory[]) =>
  categories
    .reduce((arr, { packs }) => [...arr, ...packs], [] as Datapack[])
    .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));

const logDatapacksList = async (
  version: DatapacksMCVersion = DATAPACKS_DEFAULT_MC_VERSION
) => {
  const packs = datapacksListFromCategories(
    await fetchDatapacksCategories(version)
  );
  console.log(
    packs
      .map(
        ({ name, display, version, description, incompatible }) =>
          `${chalk.bold(
            `${chalk.yellow(datapackNameToId(name))}: ${display} v${version}`
          )}\n${description}${
            incompatible.length > 0
              ? `\n${chalk.red('Incompatible with:')} ${incompatible
                  .map((incompatibleName) => datapackNameToId(incompatibleName))
                  .join(', ')}`
              : ''
          }`
      )
      .join('\n\n')
  );
};

const downloadDatapacks = async (
  version: DatapacksMCVersion = DATAPACKS_DEFAULT_MC_VERSION,
  datapackIds: string[]
) => {
  if (datapackIds.length < 1) throw new Error('No datapack IDs were given.');

  const categories = await fetchDatapacksCategories(version),
    packList = datapacksListFromCategories(categories);

  const incompatiblePackIds = datapackIds.filter((id) => {
    const pack = packList.find(({ name }) => id === datapackNameToId(name));
    if (!pack) return false;
    return datapackIds.some((dpId) =>
      pack.incompatible.map(datapackNameToId).includes(dpId)
    );
  });
  if (incompatiblePackIds.length > 0)
    throw new Error(
      `The following datapacks are incompatible with each other: ${incompatiblePackIds.join(
        ', '
      )}`
    );

  const packsByCategory: Record<string, string[]> = categories.reduce(
    (obj, { category, packs }) =>
      packs.some(({ name }) => datapackIds.includes(datapackNameToId(name)))
        ? {
            ...obj,
            [category.toLowerCase()]: packs
              .filter(({ name }) =>
                datapackIds.includes(datapackNameToId(name))
              )
              .map(({ name }) => name),
          }
        : obj,
    {}
  );

  const formData = new FormData();
  formData.append('version', version);
  formData.append('packs', JSON.stringify(packsByCategory));

  console.log(
    `Downloading ${datapackIds.length} datapacks: ${packList
      .filter(({ name }) => datapackIds.includes(datapackNameToId(name)))
      .map(({ display }) => display)
      .join(', ')}`
  );

  const zipFilename = (await getDatapacksZipLink(version, packsByCategory))
      .split('/')
      .at(-1) as string,
    zipBuffer = await downloadFile(zipFilename);

  const outDir = args.outDir || process.cwd(),
    outDirExists = await fs.exists(outDir);
  if (!outDirExists) await fs.mkdir(outDir, { recursive: true });

  if (args.noUnzip) {
    await Bun.write(path.join(outDir, DATAPACKS_ZIP_DEFAULT_NAME), zipBuffer);
    return console.log(
      DATAPACKS_SUCCESS_MSG(
        datapackIds.length,
        path.join(path.resolve(outDir), DATAPACKS_ZIP_DEFAULT_NAME)
      )
    );
  }

  const zip = new AdmZip(zipBuffer),
    zipEntries = zip
      .getEntries()
      .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));

  const files = await Promise.allSettled(
      zipEntries.map(async (entry) => {
        const pack = packList.find((pack) => entry.name.includes(pack.name)),
          fileName = pack ? `${datapackNameToId(pack.name)}.zip` : entry.name;
        return Bun.write(
          path.join(outDir, fileName),
          await getZipEntryData(entry)
        );
      })
    ),
    successfulFiles = files.filter(
      ({ status }) => status === 'fulfilled'
    ) as PromiseFulfilledResult<number>[],
    failedFiles = files.filter(
      ({ status }) => status === 'rejected'
    ) as PromiseRejectedResult[];

  if (successfulFiles.length > 1)
    console.log(DATAPACKS_SUCCESS_MSG(successfulFiles.length, outDir));
  if (failedFiles.length > 1)
    console.log(DATAPACKS_FAILURE_MSG(failedFiles.length, outDir));
};

const datapacks = async () => {
  const action = args._[1] as DatapacksAction | undefined,
    datapackIds = args._.slice(2);

  if (!action) {
    console.log(POSSIBLE_ACTIONS_MSG);
    throw new Error('Action missing!');
  }

  switch (action) {
    case 'list':
      await logDatapacksList(args.version);
      break;
    case 'download':
      await downloadDatapacks(args.version, datapackIds);
      break;
    default:
      console.log(POSSIBLE_ACTIONS_MSG);
      throw new Error(
        `Action '${action}' is not a valid action for datapacks.`
      );
  }
};

export default datapacks;
