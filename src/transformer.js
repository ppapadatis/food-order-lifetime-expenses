const { chain, get, sumBy } = require('lodash');

/**
 * Returns an array of the total amount of money spent per unique shop.
 * @param {Array<*>} data
 * @returns {Array<{id, name, price}>}
 */
const orderByHigherCost = (data) =>
  chain(data)
    .groupBy('restaurant.id')
    .map((group) => ({
      id: get(group, '0.restaurant.id', 0),
      restaurant: get(group, '0.restaurant.name', ''),
      orders: group.length,
      price: sumBy(group, 'price'),
    }))
    .map((shop) => ({ ...shop, price: parseFloat(shop.price.toFixed(2)) }))
    .orderBy('price', 'desc')
    .value();

/**
 * Returns the total sum spent on e-food.
 * @param {Array<*>} data
 * @returns {string}
 */
const getTotalExpenses = (data) => sumBy(data, 'price').toFixed(2);

/**
 * Returns the order date based on the index given.
 * @param {Array<*>} data
 * @param {number} index
 * @returns {string}
 */
const getOderDateByIndex = (data, index) => get(data, `${index}.submission_date`)?.split(' ')[0];

module.exports = {
  orderByHigherCost,
  getTotalExpenses,
  getOderDateByIndex,
};
