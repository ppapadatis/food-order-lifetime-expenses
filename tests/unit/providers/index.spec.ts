import { describe, test, expect } from 'vitest';
import { PROVIDERS, isProviderId } from '../../../src/providers/index.ts';
import { PaginationLimitError } from '../../../src/providers/types.ts';

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
    expect(isProviderId('toString')).toBe(false);
  });
});

test('PROVIDERS is frozen', () => {
  expect(Object.isFrozen(PROVIDERS)).toBe(true);
});

test('PaginationLimitError has its name and message', () => {
  const error = new PaginationLimitError();
  expect(error.name).toBe('PaginationLimitError');
  expect(error.message).toBe('Pagination limit reached');
});
