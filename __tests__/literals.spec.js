const { resolve, LITERALS_MAPPER } = require('../src/literals');

describe('literals.js', () => {
  describe('LITERALS_MAPPER', () => {
    test('should return an object with literals', () => {
      expect(Object.keys(LITERALS_MAPPER).length).toEqual(7);
    });
  });

  describe('getConfig', () => {
    test('should return the value of an existing configuration key', () => {
      expect(resolve(LITERALS_MAPPER.MESSAGES_ERRORS_GENERIC)).toBeTruthy();
    });

    test('should return the exact value if key does not exist', () => {
      expect(resolve('invalid')).toBe('invalid');
    });
  });
});
