import { describe, expect, it } from 'vitest';
import { getToken, MissingTokenError } from '../../../src/config/env.ts';

const VARIABLE = 'EFOOD_ACCESS_TOKEN';

describe('getToken', () => {
  it('returns the token', () => {
    expect(getToken(VARIABLE, { EFOOD_ACCESS_TOKEN: 't' })).toBe('t');
  });

  it.each([{}, { EFOOD_ACCESS_TOKEN: '' }, { EFOOD_ACCESS_TOKEN: '   ' }])(
    'throws MissingTokenError for %j',
    (env) => {
      const error = (() => {
        try {
          getToken(VARIABLE, env);
        } catch (caught) {
          return caught;
        }
      })();

      expect(error).toBeInstanceOf(MissingTokenError);
      expect(error).toMatchObject({
        variable: VARIABLE,
        message: 'Missing EFOOD_ACCESS_TOKEN. Add it to your .env file.',
      });
    },
  );
});
