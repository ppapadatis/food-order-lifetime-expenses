import { describe, test, expect, vi } from 'vitest';
import { printStats } from '../src/printer.ts';

const order = {
  status: 'accepted',
  price: 1,
  restaurant: { id: 1, name: 'name' },
  submission_date: 'date time',
};

describe('printer.js', () => {
  describe('printStats', () => {
    test('should print stats for given data', () => {
      const data = {
        orders: [order, order],
        costs: [{ id: 1, restaurant: 'name', orders: 2, price: 2 }],
        sum: '1',
      };
      const log = vi.spyOn(console, 'log');
      printStats('efood', data);
      expect(log).toHaveBeenCalledTimes(5);
    });
  });
});
