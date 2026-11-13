import { describe, test, expect, vi } from 'vitest';
import { printStats } from '../src/printer.js';

describe('printer.js', () => {
  describe('printStats', () => {
    test('should print stats for given data', () => {
      const data = {
        orders: [{ submission_date: 'date time' }, { submission_date: 'date time' }],
        costs: [{}],
        sum: 1,
      };
      const log = vi.spyOn(console, 'log');
      printStats('efood', data);
      expect(log).toHaveBeenCalledTimes(5);
    });
  });
});
