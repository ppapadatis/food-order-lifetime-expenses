import { describe, test, expect, vi } from 'vitest';
import type { HttpClient } from '../../../src/http/client.ts';
import { efood } from '../../../src/providers/efood.ts';
import { PaginationLimitError } from '../../../src/providers/types.ts';

const URL_PREFIX = 'https://api.e-food.gr/api/v1/user/orders/history?limit=100&offset=';
const HEADERS = { 'Content-Type': 'application/json', 'x-core-session-id': 'tok' };

const fakeHttp = (...pages: unknown[]) => {
  const get = vi.fn();
  for (const page of pages) get.mockResolvedValueOnce(page);
  return { http: { get } as unknown as HttpClient, get };
};

describe('efood.fetchRaw', () => {
  test('follows pages until hasNext is false', async () => {
    const { http, get } = fakeHttp(
      { data: { hasNext: true, orders: [{ id: 'a' }, { id: 'b' }] } },
      { data: { hasNext: false, orders: [{ id: 'c' }] } },
    );
    const orders = await efood.fetchRaw(http, 'tok');
    expect(orders).toEqual([{ id: 'a' }, { id: 'b' }, { id: 'c' }]);
    expect(get.mock.calls).toEqual([
      [`${URL_PREFIX}0&mode=extended`, HEADERS],
      [`${URL_PREFIX}2&mode=extended`, HEADERS],
    ]);
  });

  test('stops after an empty page even when hasNext is true', async () => {
    const { http, get } = fakeHttp({ data: { hasNext: true, orders: [] } });
    expect(await efood.fetchRaw(http, 'tok')).toEqual([]);
    expect(get).toHaveBeenCalledTimes(1);
  });

  test('throws PaginationLimitError after 1000 pages', async () => {
    const get = vi.fn().mockResolvedValue({ data: { hasNext: true, orders: [{}] } });
    await expect(efood.fetchRaw({ get } as unknown as HttpClient, 'tok')).rejects.toThrow(
      PaginationLimitError,
    );
    expect(get).toHaveBeenCalledTimes(1000);
  });
});

describe('efood.normalize', () => {
  test('counts accepted status in any case', () => {
    expect(efood.normalize({ status: 'ACCEPTED' }).counted).toBe(true);
    expect(efood.normalize({ status: 'accepted' }).counted).toBe(true);
    expect(efood.normalize({ status: 'rejected' }).counted).toBe(false);
  });

  test('converts price to rounded cents', () => {
    expect(efood.normalize({ price: 9.99 }).amountCents).toBe(999);
    expect(efood.normalize({ price: 0.1 }).amountCents).toBe(10);
  });

  test('takes the date part of submission_date', () => {
    expect(efood.normalize({ submission_date: '2020-01-02 10:00:00' }).date).toBe('2020-01-02');
    expect(efood.normalize({}).date).toBeNull();
  });

  test('reads the shop from restaurant', () => {
    expect(efood.normalize({ restaurant: { id: 7, name: 'Pizza' } })).toMatchObject({
      shopId: 7,
      shopName: 'Pizza',
    });
    expect(efood.normalize({ restaurant: { id: 7 } }).shopName).toBe('');
  });
});

describe('efood malformed input', () => {
  test.each([[{ a: 1 }], ['abc']])('stops on non-array orders %j', async (bad) => {
    const { http, get } = fakeHttp(
      { data: { hasNext: true, orders: [{ id: 'a' }] } },
      { data: { hasNext: true, orders: bad } },
    );
    expect(await efood.fetchRaw(http, 'tok')).toEqual([{ id: 'a' }]);
    expect(get).toHaveBeenCalledTimes(2);
  });

  test('stops on a null body', async () => {
    const { http, get } = fakeHttp(null);
    expect(await efood.fetchRaw(http, 'tok')).toEqual([]);
    expect(get).toHaveBeenCalledTimes(1);
  });

  test('ignores numeric status and date', () => {
    expect(efood.normalize({ status: 1, submission_date: 2 } as never)).toMatchObject({
      counted: false,
      date: null,
    });
  });

  test('gives a default order for a null raw', () => {
    expect(efood.normalize(null as never)).toEqual({
      shopId: '',
      shopName: '',
      amountCents: 0,
      counted: false,
      date: null,
    });
  });

  test('gives 0 cents for a non-finite or non-number price', () => {
    expect(efood.normalize({ price: Number.NaN }).amountCents).toBe(0);
    expect(efood.normalize({ price: '12' } as never).amountCents).toBe(0);
  });

  test('gives 0 cents when the price in cents overflows', () => {
    expect(efood.normalize({ price: 1e308 }).amountCents).toBe(0);
  });
});
