const { getConfig, CONFIG_MAPPER } = require('../src/config');

describe('config.js', () => {
  describe('CONFIG_MAPPER', () => {
    test('should return an object with configuration keys', () => {
      expect(Object.keys(CONFIG_MAPPER).length).toEqual(3);
    });
  });

  describe('getConfig', () => {
    test('should return the value of an existing configuration key', () => {
      expect(getConfig(CONFIG_MAPPER.EFOOD_ACCESS_TOKEN)).toBeTruthy();
    });

    test('should return undefined if key does not exist', () => {
      expect(getConfig('invalid')).toBeUndefined();
    });
  });
});
