const axios = require('axios');
const { isEmpty } = require('lodash');
const { getConfig, CONFIG_MAPPER } = require('./config');
const { ENDPOINTS, FOOD_SERVICE } = require('./constants');

const DEFAULT_HEADERS = Object.freeze({
  [FOOD_SERVICE.EFOOD]: {
    headers: {
      'Content-Type': 'application/json',
      'x-core-session-id': getConfig(CONFIG_MAPPER.EFOOD_ACCESS_TOKEN),
    },
  },
  [FOOD_SERVICE.BOX]: {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getConfig(CONFIG_MAPPER.BOX_ACCESS_TOKEN)}`,
      appId: 'box-web',
    },
  },
  [FOOD_SERVICE.WOLT]: {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getConfig(CONFIG_MAPPER.WOLT_ACCESS_TOKEN)}`,
    },
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
    const requestEndpoint = `${ENDPOINTS[FOOD_SERVICE.EFOOD].BASE}/${
      ENDPOINTS[FOOD_SERVICE.EFOOD].ORDERS
    }`.replace('{{OFST}}', offset);

    const {
      data: {
        data: { hasNext, orders },
      },
    } = await axios.get(requestEndpoint, DEFAULT_HEADERS[FOOD_SERVICE.EFOOD]);

    accountOrders.push(...orders);
    if (hasNext) {
      await populateAccountOrdersAsync(offset + orders.length);
    }
  };

  await populateAccountOrdersAsync();
  return accountOrders;
};

/**
 * Returns all orders for the given user from Box service.
 * @returns {Array<*>}
 */
const getOrdersFromBoxAsync = async () => {
  const {
    data: {
      payload: { orders },
    },
  } = await axios.get(
    `${ENDPOINTS[FOOD_SERVICE.BOX].BASE}/${ENDPOINTS[FOOD_SERVICE.BOX].ORDERS}`,
    DEFAULT_HEADERS[FOOD_SERVICE.BOX],
  );
  return orders;
};

/**
 * Returns all orders for the given user from Wolt service.
 * @returns {Array<*>}
 */
const getOrdersFromWoltAsync = async () => {
  const accountOrders = [];
  const populateAccountOrdersAsync = async (offset = 0) => {
    const requestEndpoint = `${ENDPOINTS[FOOD_SERVICE.WOLT].BASE}/${
      ENDPOINTS[FOOD_SERVICE.WOLT].ORDERS
    }`.replace('{{OFST}}', offset);

    const { data } = await axios.get(requestEndpoint, DEFAULT_HEADERS[FOOD_SERVICE.WOLT]);

    accountOrders.push(...data);
    if (!isEmpty(data)) {
      await populateAccountOrdersAsync(offset + data.length);
    }
  };

  await populateAccountOrdersAsync();
  return accountOrders;
};

/**
 * Returns orders specified for a given service.
 * @param {string} service
 * @returns {Promise<*>}
 */
const getOrdersFromServiceAsync = async (service) => {
  const resolveService = {
    [FOOD_SERVICE.EFOOD]: getOrdersFromEfoodAsync,
    [FOOD_SERVICE.BOX]: getOrdersFromBoxAsync,
    [FOOD_SERVICE.WOLT]: getOrdersFromWoltAsync,
    default: () => {},
  };
  return (resolveService[service] || resolveService.default)();
};

module.exports = {
  getOrdersFromServiceAsync,
};
