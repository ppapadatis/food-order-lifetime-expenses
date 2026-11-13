import _ from 'lodash';

const CONFIG = Object.freeze({
  EFOOD_ACCESS_TOKEN: process.env.EFOOD_ACCESS_TOKEN,
  BOX_ACCESS_TOKEN: process.env.BOX_ACCESS_TOKEN,
  WOLT_ACCESS_TOKEN: process.env.WOLT_ACCESS_TOKEN,
});

const CONFIG_MAPPER = Object.freeze({
  EFOOD_ACCESS_TOKEN: 'EFOOD_ACCESS_TOKEN',
  BOX_ACCESS_TOKEN: 'BOX_ACCESS_TOKEN',
  WOLT_ACCESS_TOKEN: 'WOLT_ACCESS_TOKEN',
});

/**
 * Returns the value that corresponds to the given key.
 * @param {string} key
 * @returns {*}
 */
const getConfig = (key) => {
  if (!key) return CONFIG;
  return _.get(CONFIG, key);
};

export { getConfig, CONFIG_MAPPER };
