import { args } from '@/utils/args';

const resourcePacks = async () => {
  const subcommand = args._[1],
    version = args.version || args.v,
    packIds = args._.slice(2);

  throw new Error('Not implemented yet.');
};

export default resourcePacks;
