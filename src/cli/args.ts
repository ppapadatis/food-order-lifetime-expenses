import minimist from 'minimist';
import { isProviderId } from '../providers/index.ts';
import type { ProviderId } from '../providers/index.ts';

export const parseArgs = (argv: string[]): ProviderId | null => {
  const { service } = minimist(argv);
  return isProviderId(service) ? service : null;
};
