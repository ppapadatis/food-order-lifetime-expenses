const get = require('lodash/get');

const DICTIONARY = Object.freeze({
  GENERIC: {
    NO_ORDERS: 'Your order history is empty!',
  },
  MESSAGES: {
    TOTAL_SHOPS: 'Number of shops: {0}.',
    TOTAL_ORDERS: 'Total amount of orders: {0}.',
    SPREE_PERIOD: 'Period from {0} to {1}.',
    AMOUNT_SPENT: 'Total amount spent in {0} is €{1}.',
    ERRORS: {
      GENERIC: 'Oops! Something went wrong!',
      INVALID_SERVICE: 'Wrong food service entered! Check again your input.',
    },
  },
});

const LITERALS_MAPPER = Object.freeze({
  GENERIC_NO_ORDERS: 'GENERIC.NO_ORDERS',
  MESSAGES_TOTAL_SHOPS: 'MESSAGES.TOTAL_SHOPS',
  MESSAGES_TOTAL_ORDERS: 'MESSAGES.TOTAL_ORDERS',
  MESSAGES_SPREE_PERIOD: 'MESSAGES.SPREE_PERIOD',
  MESSAGES_AMOUNT_SPENT: 'MESSAGES.AMOUNT_SPENT',
  MESSAGES_ERRORS_GENERIC: 'MESSAGES.ERRORS.GENERIC',
  MESSAGES_ERRORS_INVALID_SERVICE: 'MESSAGES.ERRORS.INVALID_SERVICE',
});

/**
 * Returns the translation value for a given key.
 * If no value is found, it returns the key.
 * @param {string} key
 * @param {string|string[]} args
 * @returns {*}
 */
const resolve = (key, ...args) => {
  const literal = get(DICTIONARY, key);
  if (!literal) return key;
  if (!args.length) return literal;

  return args.reduce((accum, value, index) => accum.replace(`{${index}}`, value), literal);
};

module.exports = {
  LITERALS_MAPPER,
  resolve,
};
