jest.mock('../src/service.js', () => ({
  getOrdersFromEfoodAsync: jest.fn(),
}));

describe('service.js', () => {
  describe('getOrdersFromEfoodAsync', () => {
    test.skip('should return data from efood', async () => {});
  });
});
