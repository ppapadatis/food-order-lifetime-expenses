import { describe, test, expect } from 'vitest';
import type { Order } from '../../../src/core/order.ts';
import { buildReport } from '../../../src/core/stats.ts';

const order = (overrides: Partial<Order>): Order => ({
  shopId: 1,
  shopName: 'Shop',
  amountCents: 0,
  counted: true,
  date: null,
  ...overrides,
});

describe('buildReport', () => {
  test('groups counted orders per shop, sorted by price descending', () => {
    const report = buildReport([
      order({ shopId: 1, shopName: 'One', amountCents: 500 }),
      order({ shopId: 2, shopName: 'Two', amountCents: 1000 }),
      order({ shopId: 1, shopName: 'One', amountCents: 250 }),
    ]);
    expect(report.shops).toEqual([
      { id: 2, restaurant: 'Two', orders: 1, price: 10 },
      { id: 1, restaurant: 'One', orders: 2, price: 7.5 },
    ]);
    expect(report.orderCount).toBe(3);
    expect(report.totalCents).toBe(1750);
  });

  test('ignores uncounted orders', () => {
    const report = buildReport([
      order({ shopId: 1, amountCents: 500 }),
      order({ shopId: 3, amountCents: 900, counted: false, date: '2019-01-01' }),
    ]);
    expect(report.shops.map((shop) => shop.id)).toEqual([1]);
    expect(report.orderCount).toBe(1);
    expect(report.totalCents).toBe(500);
    expect(report.period).toBeNull();
  });

  test('period spans the min and max counted dates regardless of input order', () => {
    const report = buildReport([
      order({ date: '2021-05-02' }),
      order({ date: '2020-01-01' }),
      order({ date: '2022-12-31' }),
    ]);
    expect(report.period).toEqual({ from: '2020-01-01', to: '2022-12-31' });
  });

  test('period skips null dates', () => {
    const report = buildReport([order({ date: null }), order({ date: '2021-05-02' })]);
    expect(report.period).toEqual({ from: '2021-05-02', to: '2021-05-02' });
  });

  test('period is null when all counted dates are null', () => {
    expect(buildReport([order({ date: null })]).period).toBeNull();
  });

  test('empty report when no order is counted', () => {
    expect(buildReport([order({ counted: false, amountCents: 100 })])).toEqual({
      shops: [],
      orderCount: 0,
      period: null,
      totalCents: 0,
    });
  });

  test('keeps the first-seen shop name', () => {
    const report = buildReport([order({ shopName: 'Old' }), order({ shopName: 'New' })]);
    expect(report.shops[0]?.restaurant).toBe('Old');
  });

  test('price is euros rounded to two decimals', () => {
    const report = buildReport([order({ amountCents: 10 }), order({ amountCents: 20 })]);
    expect(report.shops[0]?.price).toBe(0.3);
  });

  test('equal prices keep first-seen order', () => {
    const report = buildReport([
      order({ shopId: 'b', amountCents: 100 }),
      order({ shopId: 'c', amountCents: 100 }),
      order({ shopId: 'a', amountCents: 100 }),
    ]);
    expect(report.shops.map((shop) => shop.id)).toEqual(['b', 'c', 'a']);
  });
});
