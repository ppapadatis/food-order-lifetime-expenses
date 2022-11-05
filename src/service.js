const axios = require('axios');
const { getConfig, CONFIG_MAPPER } = require('./config');
const { ENDPOINTS } = require('./constants');

const DEFAULT_HEADERS = Object.freeze({
  headers: {
    'Content-Type': 'application/json',
    'x-core-session-id': getConfig(CONFIG_MAPPER.ACCESS_TOKEN),
  },
});

/**
 * Will iterate e-food's order API until no more items left
 * and will add them to accountOrders.
 * @returns {Array<*>}
 */
const getOrdersFromEfoodAsync = async () => {
  const accountOrders = [];
  const populateAccountOrdersAsync = async (offset = 0) => {
    const requestEndpoint = `${ENDPOINTS.BASE}/${ENDPOINTS.ORDERS}`.replace('{{OFST}}', offset);

    const {
      data: {
        data: { hasNext, orders },
      },
    } = await axios.get(requestEndpoint, DEFAULT_HEADERS);

    accountOrders.push(...orders);
    if (hasNext) {
      await populateAccountOrdersAsync(offset + orders.length);
    }
  };

  await populateAccountOrdersAsync();
  return accountOrders;
};

module.exports = {
  getOrdersFromEfoodAsync,
};
