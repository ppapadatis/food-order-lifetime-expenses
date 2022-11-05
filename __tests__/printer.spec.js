const { printStats } = require('../src/printer');

describe('printer.js', () => {
  describe('printStats', () => {
    test('should print stats for given data', () => {
      const data = {
        orders: [{ submission_date: 'date time' }, { submission_date: 'date time' }],
        costs: [{}],
        sum: 1,
      };
      const log = jest.spyOn(console, 'log');
      printStats(data);
      expect(log).toHaveBeenCalledTimes(5);
    });
  });
});
