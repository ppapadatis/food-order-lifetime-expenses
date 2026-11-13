import { efood } from './efood.ts';
import { box } from './box.ts';
import { wolt } from './wolt.ts';
import type { ProviderId } from './types.ts';

export type { ProviderId };

export const PROVIDERS = Object.freeze({ efood, box, wolt });

export const isProviderId = (value: unknown): value is ProviderId =>
  typeof value === 'string' && Object.hasOwn(PROVIDERS, value);
