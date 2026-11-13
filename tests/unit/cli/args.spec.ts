import { describe, test, expect } from 'vitest';
import { parseArgs } from '../../../src/cli/args.ts';

describe('parseArgs', () => {
  test('returns a known service', () => {
    expect(parseArgs(['--service=box'])).toBe('box');
  });

  test.each([[['--service=nope']], [['--service']], [[]]])('returns null for %j', (argv) => {
    expect(parseArgs(argv)).toBeNull();
  });
});
