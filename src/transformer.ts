import _ from 'lodash';
import { format } from 'date-fns';
import { resolve, LITERALS_MAPPER } from './literals.ts';
import { FOOD_SERVICE } from './constants.ts';
import type { BoxOrder, EfoodOrder, FoodOrder, FoodService, ShopCost, WoltOrder } from './types.ts';

const ORDER_STATUS = Object.freeze({
  ACCEPTED: 'accepted',
  COMPLETED: 'completed',
  DELIVERED: 'delivered',
});

// Callers pass `filter`, but only `filterFunc` is read, so no order is filtered out.
type GroupOptions<T> = {
  filter?: (order: T) => boolean;
  filterFunc?: (order: T) => boolean;
  groupBy: string;
  idAlias: string;
  restaurantAlias: string;
  priceAlias: string;
  shouldDividePrice?: boolean;
};

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
const transformToGroupedOrders = <T extends FoodOrder>(
  data: T[],
  {
    filterFunc,
    groupBy,
    idAlias,
    restaurantAlias,
    priceAlias,
    shouldDividePrice = false,
  }: GroupOptions<T>,
): ShopCost[] =>
  _.chain(data)
    .filter(filterFunc)
    .groupBy(groupBy)
    .map((group) => ({
      id: _.get(group, idAlias, 0),
      restaurant: _.get(group, restaurantAlias, ''),
      orders: group.length,
      price: _.sumBy(group, priceAlias),
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
const orderByHigherCost = (service: FoodService, data: FoodOrder[]): ShopCost[] => {
  switch (service) {
    case FOOD_SERVICE.EFOOD:
      return transformToGroupedOrders(data as EfoodOrder[], {
        filter: (order) => order?.status?.toLowerCase() === ORDER_STATUS.ACCEPTED,
        groupBy: 'restaurant.id',
        idAlias: '0.restaurant.id',
        restaurantAlias: '0.restaurant.name',
        priceAlias: 'price',
      });
    case FOOD_SERVICE.BOX:
      return transformToGroupedOrders(data as BoxOrder[], {
        filter: (order) =>
          Object.values<string | undefined>(ORDER_STATUS).includes(
            order?.shopResponse?.status?.toLowerCase(),
          ),
        groupBy: 'shop._id',
        idAlias: '0.shop._id',
        restaurantAlias: '0.shop.name',
        priceAlias: 'totalPrice',
        shouldDividePrice: true,
      });
    case FOOD_SERVICE.WOLT:
      return transformToGroupedOrders(data as WoltOrder[], {
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
const getTotalExpenses = (service: FoodService, data: FoodOrder[]): string => {
  switch (service) {
    case FOOD_SERVICE.EFOOD:
      return _.sumBy(
        _.filter(data as EfoodOrder[], (order) => order?.status === ORDER_STATUS.ACCEPTED),
        'price',
      ).toFixed(2);
    case FOOD_SERVICE.BOX:
      return (
        _.sumBy(
          _.filter(data as BoxOrder[], (order) =>
            Object.values<string | undefined>(ORDER_STATUS).includes(
              order?.shopResponse?.status?.toLowerCase(),
            ),
          ),
          'totalPrice',
        ) / 100
      ).toFixed(2);
    case FOOD_SERVICE.WOLT:
      return (
        _.sumBy(
          _.filter(
            data as WoltOrder[],
            (order) => order?.status?.toLowerCase() === ORDER_STATUS.DELIVERED,
          ),
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
const getOderDateByIndex = (
  service: FoodService,
  data: FoodOrder[],
  index: number,
): string | undefined => {
  switch (service) {
    case FOOD_SERVICE.EFOOD:
      return _.get(data, `${index}.submission_date`)?.split(' ')[0];
    case FOOD_SERVICE.BOX:
      return _.get(data, `${index}.createdAt`)?.split('T')[0];
    case FOOD_SERVICE.WOLT:
      return format(new Date(_.get(data, `${index}.delivery_time.$date`) as number), 'yyyy-MM-dd');
    default:
      throw new Error(resolve(LITERALS_MAPPER.MESSAGES_ERRORS_INVALID_SERVICE));
  }
};

export { orderByHigherCost, getTotalExpenses, getOderDateByIndex };
