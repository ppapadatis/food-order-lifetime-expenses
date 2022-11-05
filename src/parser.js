const { translate, TRANSLATION_MAPPER } = require('./translations');
const { getOrdersFromEfoodAsync } = require('./service');
const { orderByHigherCost, getTotalExpenses, getOderDateByIndex } = require('./transformer');

/**
 * Prints various information on e-food stats.
 * @returns {Promise<void>}
 */
const parseEfoodAsync = async () => {
  try {
    const accountOrders = await getOrdersFromEfoodAsync();

    if (!accountOrders.length) {
      console.log(translate(TRANSLATION_MAPPER.GENERIC_NO_ORDERS));
      process.exit(0);
    }

    const costArrayOrdered = orderByHigherCost(accountOrders);
    const totalSum = getTotalExpenses(accountOrders);

    console.log(costArrayOrdered);
    console.log(translate(TRANSLATION_MAPPER.MESSAGES_TOTAL_SHOPS, costArrayOrdered.length));
    console.log(translate(TRANSLATION_MAPPER.MESSAGES_TOTAL_ORDERS, accountOrders.length));
    console.log(
      translate(
        TRANSLATION_MAPPER.MESSAGES_SPREE_PERIOD,
        getOderDateByIndex(accountOrders, accountOrders.length - 1),
        getOderDateByIndex(accountOrders, 0),
      ),
    );
    console.log(translate(TRANSLATION_MAPPER.MESSAGES_AMOUNT_SPENT, totalSum));
  } catch (error) {
    console.error(translate(TRANSLATION_MAPPER.MESSAGES_ERRORS_GENERIC));
    console.error(error);
    process.exit(1);
  }

  process.exit(0);
};

module.exports = {
  parseEfoodAsync,
};
