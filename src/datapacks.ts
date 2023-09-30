import path from 'path';
import chalk from 'chalk';

import {
  BASE_URL,
  DATAPACKS_ACTIONS,
  DATAPACKS_CATEGORIES_URL,
  DATAPACKS_DEFAULT_MC_VERSION,
  DATAPACKS_ZIP_URL,
} from '@/constants';
import { args } from '@/utils';
import type {
  Datapack,
  DatapacksAction,
  DatapacksCategoriesResponse,
  DatapacksCategory,
  DatapacksMCVersion,
  DatapacksZipResponse,
} from '@/types';

const POSSIBLE_ACTIONS_MSG = `${chalk.bold('Possible actions for datapacks:')}
${DATAPACKS_ACTIONS.map(
  ({ id, description }) => `${chalk.bold(chalk.yellow(id))} - ${description}`
).join('\n')}`;

const datapackNameToId = (name: string) => name.replaceAll(' ', '-');

const fetchDatapacksCategories = async (
  version: DatapacksMCVersion = DATAPACKS_DEFAULT_MC_VERSION
) => {
  const res = await fetch(DATAPACKS_CATEGORIES_URL(version));
  const resBody: DatapacksCategoriesResponse = await res.json().catch(() => {
    throw new Error("Couldn't parse response from server.");
  });
  if (!res.ok)
    throw new Error(`Datapack categories request failed with status ${
      res.status
    }:
${JSON.stringify(resBody, undefined, 2)}`);

  return resBody.categories;
};

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

  const res = await fetch(DATAPACKS_ZIP_URL, {
    method: 'POST',
    body: formData,
  });
  const resBody: DatapacksZipResponse = await res.json().catch(() => {
    throw new Error("Couldn't parse response from server.");
  });
  if (!res.ok)
    throw new Error(`Download link request failed with status ${res.status}:
${JSON.stringify(resBody, undefined, 2)}`);

  const blob = await (await fetch(`${BASE_URL}${resBody.link}`)).blob();
  const outDir: string = args.outDir || process.cwd();

  if (args.noUnzip) {
    await Bun.write(path.join(outDir, 'datapacks.zip'), blob);
    return console.log(
      `Successfully downloaded ${datapackIds.length} datapacks to ${outDir}.`
    );
  }

  // TODO: Unzip downloaded file
  throw new Error(
    'Unzipping not implemented yet. Use the --noUnzip option to download without unzipping.'
  );
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
