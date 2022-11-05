const { resolve, LITERALS_MAPPER } = require('./literals');
const { getOderDateByIndex } = require('./transformer');

/**
 * Prints a variaty of stats in console.
 * @param {Array<*>} orders
 * @param {Array<*>} costs
 * @param {string|number} sum
 */
const printStats = ({ orders, costs, sum }) => {
  console.log(costs);
  console.log(resolve(LITERALS_MAPPER.MESSAGES_TOTAL_SHOPS, costs.length));
  console.log(resolve(LITERALS_MAPPER.MESSAGES_TOTAL_ORDERS, orders.length));
  console.log(
    resolve(
      LITERALS_MAPPER.MESSAGES_SPREE_PERIOD,
      getOderDateByIndex(orders, orders.length - 1),
      getOderDateByIndex(orders, 0),
    ),
  );
  console.log(resolve(LITERALS_MAPPER.MESSAGES_AMOUNT_SPENT, sum));
};

module.exports = {
  printStats,
};
