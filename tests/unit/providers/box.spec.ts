import { describe, test, expect, vi } from 'vitest';
import type { HttpClient } from '../../../src/http/client.ts';
import { box } from '../../../src/providers/box.ts';

const fakeHttp = (body: unknown) => {
  const get = vi.fn().mockResolvedValueOnce(body);
  return { http: { get } as unknown as HttpClient, get };
};

describe('box.fetchRaw', () => {
  test('sends one request and returns payload.orders', async () => {
    const { http, get } = fakeHttp({ payload: { orders: [{ totalPrice: 1 }] } });
    expect(await box.fetchRaw(http, 'tok')).toEqual([{ totalPrice: 1 }]);
    expect(get.mock.calls).toEqual([
      [
        'https://box-client.wavecxm.com/api/orders/get/userlist',
        { 'Content-Type': 'application/json', Authorization: 'Bearer tok', appId: 'box-web' },
      ],
    ]);
  });

  test('returns an empty list when payload is absent', async () => {
    expect(await box.fetchRaw(fakeHttp({}).http, 'tok')).toEqual([]);
  });

  test('returns an empty list for a null body or non-array orders', async () => {
    expect(await box.fetchRaw(fakeHttp(null).http, 'tok')).toEqual([]);
    expect(await box.fetchRaw(fakeHttp({ payload: { orders: { a: 1 } } }).http, 'tok')).toEqual([]);
  });
});

describe('box.normalize', () => {
  test('counts accepted, completed and delivered in any case', () => {
    for (const status of ['accepted', 'Completed', 'DELIVERED']) {
      expect(box.normalize({ shopResponse: { status } }).counted).toBe(true);
    }
    expect(box.normalize({ shopResponse: { status: 'cancelled' } }).counted).toBe(false);
    expect(box.normalize({}).counted).toBe(false);
  });

  test('keeps totalPrice as cents', () => {
    expect(box.normalize({ totalPrice: 1234 }).amountCents).toBe(1234);
  });

  test('takes the date part of createdAt', () => {
    expect(box.normalize({ createdAt: '2021-03-04T05:06:07Z' }).date).toBe('2021-03-04');
  });

  test('ignores numeric status and date', () => {
    expect(box.normalize({ shopResponse: { status: 1 }, createdAt: 2 } as never)).toMatchObject({
      counted: false,
      date: null,
    });
  });

  test('gives a default order for a null raw', () => {
    expect(box.normalize(null as never)).toEqual({
      shopId: '',
      shopName: '',
      amountCents: 0,
      counted: false,
      date: null,
    });
  });

  test('gives 0 cents for a non-finite or non-number price', () => {
    expect(box.normalize({ totalPrice: Number.NaN }).amountCents).toBe(0);
    expect(box.normalize({ totalPrice: '12' } as never).amountCents).toBe(0);
  });

  test('reads the shop from shop', () => {
    expect(box.normalize({ shop: { _id: 's1', name: 'Souvlaki' } })).toMatchObject({
      shopId: 's1',
      shopName: 'Souvlaki',
    });
  });
});
