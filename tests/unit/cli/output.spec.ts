import { describe, test, expect, vi } from 'vitest';
import { printReport } from '../../../src/cli/output.ts';
import type { Report } from '../../../src/core/stats.ts';

const SHOPS = [
  { id: 'a', restaurant: 'A', orders: 2, price: 10 },
  { id: 'b', restaurant: 'B', orders: 1, price: 7.5 },
];

const report = (overrides: Partial<Report> = {}): Report => ({
  shops: SHOPS,
  orderCount: 3,
  period: { from: '2020-01-01', to: '2022-12-31' },
  totalCents: 1750,
  ...overrides,
});

describe('printReport', () => {
  test('prints the shops and the four summary lines', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    printReport('wolt', report());
    expect(log.mock.calls).toEqual([
      [SHOPS],
      ['Number of shops: 2.'],
      ['Total amount of orders: 3.'],
      ['Period from 2020-01-01 to 2022-12-31.'],
      ['Total amount spent in wolt is €17.50.'],
    ]);
  });

  test('prints n/a for a null period', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    printReport('wolt', report({ period: null }));
    expect(log).toHaveBeenCalledWith('Period from n/a to n/a.');
  });

  test('prints cents with two decimals', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    printReport('box', report({ totalCents: 5 }));
    expect(log).toHaveBeenCalledWith('Total amount spent in box is €0.05.');
  });
});
