import { describe, test, vi } from 'vitest';

vi.mock('../src/service.js', () => ({
  getOrdersFromEfoodAsync: vi.fn(),
}));

describe('service.js', () => {
  describe('getOrdersFromEfoodAsync', () => {
    test.skip('should return data from efood', async () => {});
  });
});
