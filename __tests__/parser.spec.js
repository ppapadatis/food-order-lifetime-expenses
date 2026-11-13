import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { parseFoodOrdersAsync } from '../src/parser.js';
import { getOrdersFromServiceAsync } from '../src/service.js';
import { printStats } from '../src/printer.js';

vi.mock('../src/service.js');
vi.mock('../src/printer.js');

describe('parser.js', () => {
  describe('parseFoodOrdersAsync', () => {
    let exitSpy;
    let logSpy;
    let errorSpy;

    beforeEach(() => {
      exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {});
      logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    test.skip('it should display stats if orders is valid', async () => {});

    test('it should exit with 0 if orders is empty', async () => {
      getOrdersFromServiceAsync.mockResolvedValue([]);
      await parseFoodOrdersAsync('efood');
      expect(printStats).not.toHaveBeenCalled();
      expect(exitSpy).toHaveBeenCalledWith(0);
      expect(exitSpy).not.toHaveBeenCalledWith(1);
      expect(logSpy).toHaveBeenCalledWith('Your order history is empty!');
    });

    test('it should exit with 1 if the service fails', async () => {
      getOrdersFromServiceAsync.mockRejectedValue(new Error('401'));
      await parseFoodOrdersAsync('efood');
      expect(errorSpy).toHaveBeenCalledWith('Oops! Something went wrong!');
      expect(exitSpy).toHaveBeenNthCalledWith(1, 1);
    });
  });
});
