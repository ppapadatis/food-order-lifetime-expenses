import axios from 'axios';
import _ from 'lodash';
import { getConfig, CONFIG_MAPPER } from './config.ts';
import { ENDPOINTS, FOOD_SERVICE } from './constants.ts';
import type { BoxOrder, EfoodOrder, FoodOrder, FoodService, WoltOrder } from './types.ts';

const DEFAULT_HEADERS = Object.freeze({
  [FOOD_SERVICE.EFOOD]: {
    headers: {
      'Content-Type': 'application/json',
      'x-core-session-id': getConfig(CONFIG_MAPPER.EFOOD_ACCESS_TOKEN) as string | undefined,
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
const getOrdersFromEfoodAsync = async (): Promise<EfoodOrder[]> => {
  const accountOrders: EfoodOrder[] = [];
  const populateAccountOrdersAsync = async (offset = 0): Promise<void> => {
    const requestEndpoint = `${ENDPOINTS[FOOD_SERVICE.EFOOD].BASE}/${
      ENDPOINTS[FOOD_SERVICE.EFOOD].ORDERS
    }`.replace('{{OFST}}', String(offset));

    const {
      data: {
        data: { hasNext, orders },
      },
    } = await axios.get<{ data: { hasNext: boolean; orders: EfoodOrder[] } }>(
      requestEndpoint,
      DEFAULT_HEADERS[FOOD_SERVICE.EFOOD],
    );

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
const getOrdersFromBoxAsync = async (): Promise<BoxOrder[]> => {
  const {
    data: {
      payload: { orders },
    },
  } = await axios.get<{ payload: { orders: BoxOrder[] } }>(
    `${ENDPOINTS[FOOD_SERVICE.BOX].BASE}/${ENDPOINTS[FOOD_SERVICE.BOX].ORDERS}`,
    DEFAULT_HEADERS[FOOD_SERVICE.BOX],
  );
  return orders;
};

/**
 * Returns all orders for the given user from Wolt service.
 * @returns {Array<*>}
 */
const getOrdersFromWoltAsync = async (): Promise<WoltOrder[]> => {
  const accountOrders: WoltOrder[] = [];
  const populateAccountOrdersAsync = async (offset = 0): Promise<void> => {
    const requestEndpoint = `${ENDPOINTS[FOOD_SERVICE.WOLT].BASE}/${
      ENDPOINTS[FOOD_SERVICE.WOLT].ORDERS
    }`.replace('{{OFST}}', String(offset));

    const { data } = await axios.get<WoltOrder[]>(
      requestEndpoint,
      DEFAULT_HEADERS[FOOD_SERVICE.WOLT],
    );

    accountOrders.push(...data);
    if (!_.isEmpty(data)) {
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
const getOrdersFromServiceAsync = async (
  service: FoodService,
): Promise<FoodOrder[] | undefined> => {
  const resolveService = {
    [FOOD_SERVICE.EFOOD]: getOrdersFromEfoodAsync,
    [FOOD_SERVICE.BOX]: getOrdersFromBoxAsync,
    [FOOD_SERVICE.WOLT]: getOrdersFromWoltAsync,
    default: () => undefined,
  };
  return (resolveService[service] || resolveService.default)();
};

export { getOrdersFromServiceAsync };
