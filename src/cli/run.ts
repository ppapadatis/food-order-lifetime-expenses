import { getToken, MissingTokenError } from '../config/env.ts';
import { buildReport } from '../core/stats.ts';
import { createHttpClient } from '../http/client.ts';
import type { HttpClient } from '../http/client.ts';
import { describeError } from '../http/redact.ts';
import { PROVIDERS } from '../providers/index.ts';
import type { Provider } from '../providers/types.ts';
import { parseArgs } from './args.ts';
import { LITERALS_MAPPER, resolve } from './literals.ts';
import { printReport } from './output.ts';

type Deps = { http?: HttpClient; env?: Record<string, string | undefined> };

export const run = async (argv: string[], deps?: Deps): Promise<number> => {
  const id = parseArgs(argv);
  if (id === null) return 1;
  // Each provider has its own raw type; run only passes raw orders back to normalize.
  const provider: Provider<unknown> = PROVIDERS[id] as Provider<unknown>;

  try {
    const token = getToken(provider.tokenEnv, deps?.env ?? process.env);
    const raw = await provider.fetchRaw(deps?.http ?? createHttpClient(), token);
    if (raw.length === 0) {
      console.log(resolve(LITERALS_MAPPER.GENERIC_NO_ORDERS));
      return 0;
    }
    printReport(id, buildReport(raw.map((order) => provider.normalize(order))));
    return 0;
  } catch (error) {
    if (error instanceof MissingTokenError) {
      console.error(error.message);
      return 1;
    }
    console.error(resolve(LITERALS_MAPPER.MESSAGES_ERRORS_GENERIC));
    console.error(describeError(error));
    return 1;
  }
};
