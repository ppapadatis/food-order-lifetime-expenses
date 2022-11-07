const { isEmpty } = require('lodash');
const { resolve, LITERALS_MAPPER } = require('./literals');
const { getOrdersFromServiceAsync } = require('./service');
const { orderByHigherCost, getTotalExpenses } = require('./transformer');
const { printStats } = require('./printer');

/**
 * Prints various information on e-food stats.
 * @param {string} service
 * @returns {Promise<void>}
 */
const parseFoodOrdersAsync = async (service) => {
  try {
    const orders = await getOrdersFromServiceAsync(service);

    if (isEmpty(orders)) {
      console.log(resolve(LITERALS_MAPPER.GENERIC_NO_ORDERS));
      process.exit(0);
      return;
    }

    const costs = orderByHigherCost(service, orders);
    const sum = getTotalExpenses(service, orders);
    printStats(service, { orders, costs, sum });
  } catch (error) {
    console.error(resolve(LITERALS_MAPPER.MESSAGES_ERRORS_GENERIC));
    console.error(error);
    process.exit(1);
  }

  process.exit(0);
};

module.exports = {
  parseFoodOrdersAsync,
};
