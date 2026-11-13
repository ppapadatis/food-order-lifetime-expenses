import { describe, test, expect, vi } from 'vitest';
import { format } from 'date-fns';
import type { HttpClient } from '../../../src/http/client.ts';
import { wolt } from '../../../src/providers/wolt.ts';
import { PaginationLimitError } from '../../../src/providers/types.ts';

const URL_PREFIX = 'https://restaurant-api.wolt.com/v2/order_details/?limit=100&skip=';
const HEADERS = { 'Content-Type': 'application/json', Authorization: 'Bearer tok' };

describe('wolt.fetchRaw', () => {
  test('follows pages until an empty page', async () => {
    const get = vi
      .fn()
      .mockResolvedValueOnce([{ status: 'a' }, { status: 'b' }])
      .mockResolvedValueOnce([{ status: 'c' }])
      .mockResolvedValueOnce([]);
    const orders = await wolt.fetchRaw({ get } as unknown as HttpClient, 'tok');
    expect(orders).toEqual([{ status: 'a' }, { status: 'b' }, { status: 'c' }]);
    expect(get.mock.calls).toEqual([
      [`${URL_PREFIX}0`, HEADERS],
      [`${URL_PREFIX}2`, HEADERS],
      [`${URL_PREFIX}3`, HEADERS],
    ]);
  });

  test('stops on a non-array page', async () => {
    const get = vi.fn().mockResolvedValueOnce({ a: 1 });
    expect(await wolt.fetchRaw({ get } as unknown as HttpClient, 'tok')).toEqual([]);
    expect(get).toHaveBeenCalledTimes(1);
  });

  test('throws PaginationLimitError after 1000 non-empty pages', async () => {
    const get = vi.fn().mockResolvedValue([{}]);
    await expect(wolt.fetchRaw({ get } as unknown as HttpClient, 'tok')).rejects.toThrow(
      PaginationLimitError,
    );
    expect(get).toHaveBeenCalledTimes(1000);
  });
});

describe('wolt.normalize', () => {
  test('counts delivered status in any case', () => {
    expect(wolt.normalize({ status: 'Delivered' }).counted).toBe(true);
    expect(wolt.normalize({ status: 'rejected' }).counted).toBe(false);
  });

  test('keeps total_price as cents', () => {
    expect(wolt.normalize({ total_price: 1550 }).amountCents).toBe(1550);
  });

  test('formats a numeric or string delivery date', () => {
    const ms = Date.UTC(2022, 4, 6, 12);
    const expected = format(new Date(ms), 'yyyy-MM-dd');
    expect(wolt.normalize({ delivery_time: { $date: ms } }).date).toBe(expected);
    expect(wolt.normalize({ delivery_time: { $date: new Date(ms).toISOString() } }).date).toBe(
      expected,
    );
  });

  test('gives a null date for an unusable delivery date', () => {
    expect(wolt.normalize({ delivery_time: { $date: { $numberLong: '1' } } }).date).toBeNull();
    expect(wolt.normalize({ delivery_time: { $date: null } }).date).toBeNull();
    expect(wolt.normalize({}).date).toBeNull();
  });

  test('ignores a numeric status', () => {
    expect(wolt.normalize({ status: 1 } as never).counted).toBe(false);
  });

  test('gives a default order for a null raw', () => {
    expect(wolt.normalize(null as never)).toEqual({
      shopId: '',
      shopName: '',
      amountCents: 0,
      counted: false,
      date: null,
    });
  });

  test('gives 0 cents for a non-finite or non-number price', () => {
    expect(wolt.normalize({ total_price: Number.NaN }).amountCents).toBe(0);
    expect(wolt.normalize({ total_price: '12' } as never).amountCents).toBe(0);
  });

  test('reads the shop from venue fields', () => {
    expect(wolt.normalize({ venue_id: 'v1', venue_name: 'Gyros' })).toMatchObject({
      shopId: 'v1',
      shopName: 'Gyros',
    });
  });
});
