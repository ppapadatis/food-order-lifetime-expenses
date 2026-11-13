import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import type { MockInstance } from 'vitest';
import { parseFoodOrdersAsync } from '../src/parser.ts';
import { getOrdersFromServiceAsync } from '../src/service.ts';
import { printStats } from '../src/printer.ts';

vi.mock('../src/service.ts');
vi.mock('../src/printer.ts');

describe('parser.js', () => {
  describe('parseFoodOrdersAsync', () => {
    let exitSpy: MockInstance<typeof process.exit>;
    let logSpy: MockInstance<typeof console.log>;
    let errorSpy: MockInstance<typeof console.error>;

    beforeEach(() => {
      exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
      logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    test.skip('it should display stats if orders is valid', async () => {});

    test('it should exit with 0 if orders is empty', async () => {
      vi.mocked(getOrdersFromServiceAsync).mockResolvedValue([]);
      await parseFoodOrdersAsync('efood');
      expect(printStats).not.toHaveBeenCalled();
      expect(exitSpy).toHaveBeenCalledWith(0);
      expect(exitSpy).not.toHaveBeenCalledWith(1);
      expect(logSpy).toHaveBeenCalledWith('Your order history is empty!');
    });

    test('it should exit with 1 if the service fails', async () => {
      vi.mocked(getOrdersFromServiceAsync).mockRejectedValue(new Error('401'));
      await parseFoodOrdersAsync('efood');
      expect(errorSpy).toHaveBeenCalledWith('Oops! Something went wrong!');
      expect(exitSpy).toHaveBeenNthCalledWith(1, 1);
    });
  });
});
