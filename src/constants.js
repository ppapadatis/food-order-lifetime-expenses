const ENDPOINTS = Object.freeze({
  BASE: 'https://api.e-food.gr/api/v1',
  ORDERS: 'user/orders/history?limit=100&offset={{OFST}}&mode=extended',
});

module.exports = {
  ENDPOINTS,
};
