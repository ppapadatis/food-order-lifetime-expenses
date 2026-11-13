import { describe, test, expect, vi, afterEach } from 'vitest';
import { parseFoodOrdersAsync } from '../src/parser.js';
import { getOrdersFromEfoodAsync } from '../src/service.js';

vi.mock('../src/service.js', () => ({
  getOrdersFromEfoodAsync: vi.fn(),
}));

describe('parser.js', () => {
  describe('parseEfoodAsync', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    test.skip('it should display stats if orders is valid', async () => {});

    test('it should exit if orders is empty', async () => {
      getOrdersFromEfoodAsync.mockReturnValue([]);
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {});
      await parseFoodOrdersAsync('efood');
      expect(exitSpy).toHaveBeenCalledWith(0);
    });
  });
});
