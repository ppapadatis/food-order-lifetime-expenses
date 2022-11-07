const { chain, get, sumBy, filter } = require('lodash');
const { format } = require('date-fns');
const { resolve, LITERALS_MAPPER } = require('./literals');
const { FOOD_SERVICE } = require('./constants');

const ORDER_STATUS = Object.freeze({
  ACCEPTED: 'accepted',
  COMPLETED: 'completed',
  DELIVERED: 'delivered',
});

/**
 * Transforms an array of orders, to a group of orders, by their shop.
 * @param {Array<*>} data
 * @param {Function} filterFunc
 * @param {string} groupBy
 * @param {string} idAlias
 * @param {string} restaurantAlias
 * @param {string} priceAlias
 * @param {boolean} shouldDividePrice - If true, will divice price with 100
 * @returns {Array<*>}
 */
const transformToGroupedOrders = (
  data,
  { filterFunc, groupBy, idAlias, restaurantAlias, priceAlias, shouldDividePrice = false },
) =>
  chain(data)
    .filter(filterFunc)
    .groupBy(groupBy)
    .map((group) => ({
      id: get(group, idAlias, 0),
      restaurant: get(group, restaurantAlias, ''),
      orders: group.length,
      price: sumBy(group, priceAlias),
    }))
    .map((shop) => ({
      ...shop,
      price: parseFloat((shop.price / (shouldDividePrice ? 100 : 1)).toFixed(2)),
    }))
    .orderBy('price', 'desc')
    .value();

/**
 * Returns an array of the total amount of money spent per unique shop.
 * @param {string} service
 * @param {Array<*>} data
 * @returns {Array<{id, name, price}>}
 */
const orderByHigherCost = (service, data) => {
  switch (service) {
    case FOOD_SERVICE.EFOOD:
      return transformToGroupedOrders(data, {
        filter: (order) => order?.status?.toLowerCase() === ORDER_STATUS.ACCEPTED,
        groupBy: 'restaurant.id',
        idAlias: '0.restaurant.id',
        restaurantAlias: '0.restaurant.name',
        priceAlias: 'price',
      });
    case FOOD_SERVICE.BOX:
      return transformToGroupedOrders(data, {
        filter: (order) =>
          Object.values(ORDER_STATUS).includes(order?.shopResponse?.status?.toLowerCase()),
        groupBy: 'shop._id',
        idAlias: '0.shop._id',
        restaurantAlias: '0.shop.name',
        priceAlias: 'totalPrice',
        shouldDividePrice: true,
      });
    case FOOD_SERVICE.WOLT:
      return transformToGroupedOrders(data, {
        filter: (order) => order?.status?.toLowerCase() === ORDER_STATUS.DELIVERED,
        groupBy: 'venue_id',
        idAlias: '0.venue_id',
        restaurantAlias: '0.venue_name',
        priceAlias: 'total_price',
        shouldDividePrice: true,
      });
    default:
      throw new Error(resolve(LITERALS_MAPPER.MESSAGES_ERRORS_INVALID_SERVICE));
  }
};

/**
 * Returns the total sum spent on a given service.
 * @param {string} service
 * @param {Array<*>} data
 * @returns {string}
 */
const getTotalExpenses = (service, data) => {
  switch (service) {
    case FOOD_SERVICE.EFOOD:
      return sumBy(
        filter(data, (order) => order?.status === ORDER_STATUS.ACCEPTED),
        'price',
      ).toFixed(2);
    case FOOD_SERVICE.BOX:
      return (
        sumBy(
          filter(data, (order) =>
            Object.values(ORDER_STATUS).includes(order?.shopResponse?.status?.toLowerCase()),
          ),
          'totalPrice',
        ) / 100
      ).toFixed(2);
    case FOOD_SERVICE.WOLT:
      return (
        sumBy(
          filter(data, (order) => order?.status?.toLowerCase() === ORDER_STATUS.DELIVERED),
          'total_price',
        ) / 100
      ).toFixed(2);
    default:
      throw new Error(resolve(LITERALS_MAPPER.MESSAGES_ERRORS_INVALID_SERVICE));
  }
};

/**
 * Returns the order date based on the index given.
 * @param {string} service
 * @param {Array<*>} data
 * @param {number} index
 * @returns {string}
 */
const getOderDateByIndex = (service, data, index) => {
  switch (service) {
    case FOOD_SERVICE.EFOOD:
      return get(data, `${index}.submission_date`)?.split(' ')[0];
    case FOOD_SERVICE.BOX:
      return get(data, `${index}.createdAt`)?.split('T')[0];
    case FOOD_SERVICE.WOLT:
      return format(new Date(get(data, `${index}.delivery_time.$date`)), 'yyyy-MM-dd');
    default:
      throw new Error(resolve(LITERALS_MAPPER.MESSAGES_ERRORS_INVALID_SERVICE));
  }
};

module.exports = {
  orderByHigherCost,
  getTotalExpenses,
  getOderDateByIndex,
};
