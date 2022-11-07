const FOOD_SERVICE = Object.freeze({
  EFOOD: 'efood',
  BOX: 'box',
  WOLT: 'wolt',
});

const ENDPOINTS = Object.freeze({
  [FOOD_SERVICE.EFOOD]: {
    BASE: 'https://api.e-food.gr/api/v1',
    ORDERS: 'user/orders/history?limit=100&offset={{OFST}}&mode=extended',
  },
  [FOOD_SERVICE.BOX]: {
    BASE: 'https://box-client.wavecxm.com/api',
    ORDERS: 'orders/get/userlist',
  },
  [FOOD_SERVICE.WOLT]: {
    BASE: 'https://restaurant-api.wolt.com/v2',
    ORDERS: 'order_details/?limit=100&skip={{OFST}}',
  },
});

module.exports = {
  FOOD_SERVICE,
  ENDPOINTS,
};
