const DICTIONARY = Object.freeze({
  GENERIC: {
    NO_ORDERS: 'Your order history is empty!',
  },
  MESSAGES: {
    TOTAL_SHOPS: 'Number of shops: {0}.',
    TOTAL_ORDERS: 'Total amount of orders: {0}.',
    SPREE_PERIOD: 'Period from {0} to {1}.',
    PERIOD_UNKNOWN: 'n/a',
    AMOUNT_SPENT: 'Total amount spent in {0} is €{1}.',
    ERRORS: {
      GENERIC: 'Oops! Something went wrong!',
      MISSING_TOKEN: 'Missing {0}. Add it to your .env file.',
    },
  },
});

const LITERALS_MAPPER = Object.freeze({
  GENERIC_NO_ORDERS: 'GENERIC.NO_ORDERS',
  MESSAGES_TOTAL_SHOPS: 'MESSAGES.TOTAL_SHOPS',
  MESSAGES_TOTAL_ORDERS: 'MESSAGES.TOTAL_ORDERS',
  MESSAGES_SPREE_PERIOD: 'MESSAGES.SPREE_PERIOD',
  MESSAGES_PERIOD_UNKNOWN: 'MESSAGES.PERIOD_UNKNOWN',
  MESSAGES_AMOUNT_SPENT: 'MESSAGES.AMOUNT_SPENT',
  MESSAGES_ERRORS_GENERIC: 'MESSAGES.ERRORS.GENERIC',
  MESSAGES_ERRORS_MISSING_TOKEN: 'MESSAGES.ERRORS.MISSING_TOKEN',
});

/**
 * Returns the translation value for a given key.
 * If no value is found, it returns the key.
 */
const resolve = (key: string, ...args: Array<string | number>): string => {
  const literal = key
    .split('.')
    .reduce<unknown>(
      (node, part) =>
        node !== null && typeof node === 'object' && Object.hasOwn(node, part)
          ? (node as Record<string, unknown>)[part]
          : undefined,
      DICTIONARY,
    );
  if (typeof literal !== 'string') return key;

  return args.reduce<string>(
    (accum, value, index) => accum.replace(`{${index}}`, String(value)),
    literal,
  );
};

export { LITERALS_MAPPER, resolve };
