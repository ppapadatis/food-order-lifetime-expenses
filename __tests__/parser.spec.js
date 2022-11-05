const { parseEfoodAsync } = require('../src/parser');
const { getOrdersFromEfoodAsync } = require('../src/service');

jest.mock('../src/service.js', () => ({
  getOrdersFromEfoodAsync: jest.fn(),
}));

describe('parser.js', () => {
  describe('parseEfoodAsync', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    test.skip('it should display stats if orders is valid', async () => {});

    test('it should exit if orders is empty', async () => {
      getOrdersFromEfoodAsync.mockReturnValue([]);
      const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
      await parseEfoodAsync();
      expect(exitSpy).toHaveBeenCalledWith(0);
    });
  });
});
