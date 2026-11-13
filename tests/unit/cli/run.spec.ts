import { describe, test, expect, vi, beforeEach } from 'vitest';
import type { MockInstance } from 'vitest';
import type { HttpClient } from '../../../src/http/client.ts';
import { run } from '../../../src/cli/run.ts';
import { LITERALS_MAPPER, resolve } from '../../../src/cli/literals.ts';

let log: MockInstance<typeof console.log>;
let error: MockInstance<typeof console.error>;

beforeEach(() => {
  log = vi.spyOn(console, 'log').mockImplementation(() => {});
  error = vi.spyOn(console, 'error').mockImplementation(() => {});
});

const ENV = { EFOOD_ACCESS_TOKEN: 'e', BOX_ACCESS_TOKEN: 'b', WOLT_ACCESS_TOKEN: 't' };

const axiosError = (status: number) =>
  Object.assign(new Error(`Request failed with status code ${status}`), {
    isAxiosError: true,
    config: { headers: { Authorization: 'Bearer SECRET' } },
    response: { status, data: 'SECRET' },
  });

describe('run', () => {
  test('returns 1 and prints nothing for an unknown service', async () => {
    expect(await run(['--service=nope'], { env: ENV })).toBe(1);
    expect(log).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
  });

  test('returns 1 without a request when the token is missing', async () => {
    const get = vi.fn();
    expect(await run(['--service=efood'], { http: { get }, env: {} })).toBe(1);
    expect(error).toHaveBeenCalledWith('Missing EFOOD_ACCESS_TOKEN. Add it to your .env file.');
    expect(error).toHaveBeenCalledWith(
      resolve(LITERALS_MAPPER.MESSAGES_ERRORS_MISSING_TOKEN, 'EFOOD_ACCESS_TOKEN'),
    );
    expect(get).not.toHaveBeenCalled();
  });

  test('returns 0 for an empty history', async () => {
    const get = vi.fn().mockResolvedValue([]);
    expect(await run(['--service=wolt'], { http: { get }, env: ENV })).toBe(0);
    expect(log.mock.calls).toEqual([['Your order history is empty!']]);
  });

  test('prints the report for wolt orders', async () => {
    const get = vi
      .fn()
      .mockResolvedValueOnce([
        { status: 'delivered', total_price: 1000, venue_id: 'v', venue_name: 'V' },
        { status: 'delivered', total_price: 750, venue_id: 'v', venue_name: 'V' },
      ])
      .mockResolvedValueOnce([]);
    const http: HttpClient = { get };
    expect(await run(['--service=wolt'], { http, env: ENV })).toBe(0);
    expect(log.mock.calls).toEqual([
      [[{ id: 'v', restaurant: 'V', orders: 2, price: 17.5 }]],
      ['Number of shops: 1.'],
      ['Total amount of orders: 2.'],
      ['Period from n/a to n/a.'],
      ['Total amount spent in wolt is €17.50.'],
    ]);
  });

  test.each([401, 302])('returns 1 and hides the token on HTTP %i', async (status) => {
    const get = vi.fn().mockRejectedValue(axiosError(status));
    expect(await run(['--service=wolt'], { http: { get }, env: ENV })).toBe(1);
    const lines = error.mock.calls.flat().map(String);
    expect(lines[0]).toBe('Oops! Something went wrong!');
    expect(lines.some((line) => line.endsWith(`(HTTP ${status})`))).toBe(true);
    expect(JSON.stringify(error.mock.calls)).not.toContain('SECRET');
  });
});
