const { ENDPOINTS } = require('../src/constants');

describe('constants.js', () => {
  describe('ENDPOINTS', () => {
    test('should return an object with constants', () => {
      expect(Object.keys(ENDPOINTS).length).toEqual(3);
    });
  });
});
