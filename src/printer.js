import { resolve, LITERALS_MAPPER } from './literals.js';
import { getOderDateByIndex } from './transformer.js';

/**
 * Prints a variaty of stats in console.
 * @param {string} service
 * @param {Array<*>} orders
 * @param {Array<*>} costs
 * @param {string|number} sum
 */
const printStats = (service, { orders, costs, sum }) => {
  console.log(costs);
  console.log(resolve(LITERALS_MAPPER.MESSAGES_TOTAL_SHOPS, costs.length));
  console.log(resolve(LITERALS_MAPPER.MESSAGES_TOTAL_ORDERS, orders.length));
  console.log(
    resolve(
      LITERALS_MAPPER.MESSAGES_SPREE_PERIOD,
      getOderDateByIndex(service, orders, orders.length - 1),
      getOderDateByIndex(service, orders, 0),
    ),
  );
  console.log(resolve(LITERALS_MAPPER.MESSAGES_AMOUNT_SPENT, service, sum));
};

export { printStats };
