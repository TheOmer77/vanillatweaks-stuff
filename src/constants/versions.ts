export const MC_VERSIONS = [
  '1.11',
  '1.12',
  '1.13',
  '1.14',
  '1.15',
  '1.16',
  '1.17',
  '1.18',
  '1.19',
  '1.20',
] as const;
export const DEFAULT_MC_VERSION =
  '1.20' as const satisfies (typeof MC_VERSIONS)[number];
