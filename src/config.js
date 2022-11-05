const { get } = require('lodash');

const CONFIG = Object.freeze({
  ACCESS_TOKEN: process.env.ACCESS_TOKEN,
});

const CONFIG_MAPPER = Object.freeze({
  ACCESS_TOKEN: 'ACCESS_TOKEN',
});

/**
 * Returns the value that corresponds to the given key.
 * @param {string} key
 * @returns {*}
 */
const getConfig = (key) => {
  if (!key) return CONFIG;
  return get(CONFIG, key);
};

module.exports = {
  getConfig,
  CONFIG_MAPPER,
};
