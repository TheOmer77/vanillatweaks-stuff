export const DATAPACKS_MC_VERSIONS = [
  '1.13',
  '1.14',
  '1.15',
  '1.16',
  '1.17',
  '1.18',
  '1.19',
  '1.20',
] as const;
export const DATAPACKS_DEFAULT_MC_VERSION =
  '1.20' as const satisfies (typeof DATAPACKS_MC_VERSIONS)[number];

export const DATAPACKS_ACTIONS = [
  {
    id: 'list',
    description: `List all available datapacks for the selected Minecraft version. (Default version: ${DATAPACKS_DEFAULT_MC_VERSION})`,
  },
  {
    id: 'download',
    description: `Download datapacks for the selected Minecraft version. (Default version: ${DATAPACKS_DEFAULT_MC_VERSION})`,
  },
] as const;
