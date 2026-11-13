import _ from 'lodash';
import { resolve, LITERALS_MAPPER } from './literals.ts';
import { getOrdersFromServiceAsync } from './service.ts';
import { orderByHigherCost, getTotalExpenses } from './transformer.ts';
import { printStats } from './printer.ts';
import type { FoodService } from './types.ts';

/**
 * Prints various information on e-food stats.
 * @param {string} service
 * @returns {Promise<void>}
 */
const parseFoodOrdersAsync = async (service: FoodService): Promise<void> => {
  try {
    const orders = await getOrdersFromServiceAsync(service);

    if (!orders || _.isEmpty(orders)) {
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

export { parseFoodOrdersAsync };
