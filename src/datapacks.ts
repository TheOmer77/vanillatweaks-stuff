import chalk from 'chalk';

import { DATAPACKS_ACTIONS, DATAPACKS_DEFAULT_MC_VERSION } from '@/constants';
import { args } from '@/utils';
import type {
  Datapack,
  DatapacksAction,
  DatapacksListResponse,
  DatapacksMCVersion,
} from '@/types';

const POSSIBLE_ACTIONS_MSG = `${chalk.bold('Possible actions for datapacks:')}
${DATAPACKS_ACTIONS.map(
  ({ id, description }) => `${chalk.bold(chalk.yellow(id))} - ${description}`
).join('\n')}`;

const datapackNameToId = (name: string) => name.replaceAll(' ', '-');

const fetchDatapacksCategories = async (
  version: DatapacksMCVersion = DATAPACKS_DEFAULT_MC_VERSION
) => {
  const res = await fetch(
    `https://vanillatweaks.net/assets/resources/json/${version}/dpcategories.json`
  );
  try {
    const resBody: DatapacksListResponse = await res.json();
    if (!res.ok)
      throw new Error(`Vanilla Tweaks request failed with status ${res.status}:
${JSON.stringify(resBody, undefined, 2)}`);

    return resBody.categories;
  } catch (err) {
    throw new Error("Couldn't parse response from server.");
  }
};

const logDatapacksList = async (
  version: DatapacksMCVersion = DATAPACKS_DEFAULT_MC_VERSION
) => {
  const categories = await fetchDatapacksCategories(version);
  const packs = categories.reduce(
    (arr, { packs }) => [...arr, ...packs],
    [] as Datapack[]
  );
  console.log(
    packs
      .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0))
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

const datapacks = async () => {
  const action = args._[1] as DatapacksAction | undefined,
    // TODO: Use this list as datapacks to download when action = 'download'
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    datapackNames = args._.slice(2).map(datapackNameToId);

  if (!action) {
    console.log(POSSIBLE_ACTIONS_MSG);
    throw new Error('Action missing!');
  }

  switch (action) {
    case 'list':
      await logDatapacksList(args.version);
      break;
    case 'download':
      throw new Error(`Datapacks ${action} not implemented yet.`);
    default:
      console.log(POSSIBLE_ACTIONS_MSG);
      throw new Error(
        `Action '${action}' is not a valid action for datapacks.`
      );
  }
};

export default datapacks;
