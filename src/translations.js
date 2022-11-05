const get = require('lodash/get');

const TRANSLATION_DICTIONARY = Object.freeze({
  GENERIC: {
    NO_ORDERS: 'Your order history is empty!',
  },
  MESSAGES: {
    TOTAL_SHOPS: 'Number of shops: {0}.',
    TOTAL_ORDERS: 'Total amount of orders: {0}.',
    SPREE_PERIOD: 'Period from {0} to {1}.',
    AMOUNT_SPENT: 'Total amount spent in e-food is €{0}.',
    ERRORS: {
      GENERIC: 'Oops! Something went wrong!',
    },
  },
});

const TRANSLATION_MAPPER = Object.freeze({
  GENERIC_NO_ORDERS: 'GENERIC.NO_ORDERS',
  MESSAGES_TOTAL_SHOPS: 'MESSAGES.TOTAL_SHOPS',
  MESSAGES_TOTAL_ORDERS: 'MESSAGES.TOTAL_ORDERS',
  MESSAGES_SPREE_PERIOD: 'MESSAGES.SPREE_PERIOD',
  MESSAGES_AMOUNT_SPENT: 'MESSAGES.AMOUNT_SPENT',
  MESSAGES_ERRORS_GENERIC: 'MESSAGES.ERRORS.GENERIC',
});

/**
 * Returns the translation value for a given key.
 * If no value is found, it returns the key.
 * @param {string} key
 * @param {string|string[]} args
 * @returns {*}
 */
const translate = (key, ...args) => {
  const literal = get(TRANSLATION_DICTIONARY, key);
  if (!literal) return key;
  if (!args.length) return literal;

  return args.reduce((accum, value, index) => accum.replace(`{${index}}`, value), literal);
};

module.exports = {
  TRANSLATION_MAPPER,
  translate,
};
