import { describe, test, expect } from 'vitest';
import { PROVIDERS, isProviderId } from '../../../src/providers/index.ts';

describe('PROVIDERS', () => {
  test('maps each service to its token variable', () => {
    expect(Object.keys(PROVIDERS)).toEqual(['efood', 'box', 'wolt']);
    expect(Object.values(PROVIDERS).map((p) => p.tokenEnv)).toEqual([
      'EFOOD_ACCESS_TOKEN',
      'BOX_ACCESS_TOKEN',
      'WOLT_ACCESS_TOKEN',
    ]);
  });
});

describe('isProviderId', () => {
  test('accepts only known provider ids', () => {
    expect(isProviderId('box')).toBe(true);
    expect(isProviderId('nope')).toBe(false);
    expect(isProviderId(true)).toBe(false);
    expect(isProviderId(undefined)).toBe(false);
  });
});
