import { describe, test, expect } from 'vitest';
import { LITERALS_MAPPER, resolve } from '../../../src/cli/literals.ts';

describe('resolve', () => {
  test('fills the placeholders', () => {
    expect(resolve(LITERALS_MAPPER.MESSAGES_SPREE_PERIOD, 'a', 2)).toBe('Period from a to 2.');
  });

  test('returns an unknown key', () => {
    expect(resolve('NOPE.KEY')).toBe('NOPE.KEY');
  });

  test.each(Object.values(LITERALS_MAPPER))('resolves %s', (key) => {
    expect(resolve(key)).not.toBe(key);
  });
});
