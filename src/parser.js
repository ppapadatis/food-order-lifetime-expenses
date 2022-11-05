const { isEmpty } = require('lodash');
const { resolve, LITERALS_MAPPER } = require('./literals');
const { getOrdersFromEfoodAsync } = require('./service');
const { orderByHigherCost, getTotalExpenses } = require('./transformer');
const { printStats } = require('./printer');

/**
 * Prints various information on e-food stats.
 * @returns {Promise<void>}
 */
const parseEfoodAsync = async () => {
  try {
    const orders = await getOrdersFromEfoodAsync();

    if (isEmpty(orders)) {
      console.log(resolve(LITERALS_MAPPER.GENERIC_NO_ORDERS));
      process.exit(0);
      return;
    }

    const costs = orderByHigherCost(orders);
    const sum = getTotalExpenses(orders);
    printStats({ orders, costs, sum });
  } catch (error) {
    console.error(resolve(LITERALS_MAPPER.MESSAGES_ERRORS_GENERIC));
    console.error(error);
    process.exit(1);
  }

  process.exit(0);
};

module.exports = {
  parseEfoodAsync,
};
