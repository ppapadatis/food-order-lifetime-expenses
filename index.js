const { parseFoodOrdersAsync } = require('./src/parser');
const { FOOD_SERVICE } = require('./src/constants');

/**
 * Subscribe to unhandledRejection event.
 */
// eslint-disable-next-line no-unused-vars
process.on('unhandledRejection', (reason, promise) => {
  console.error(reason);
});

/**
 * Subscribe to uncaughtException event.
 */
process.on('uncaughtException', (error) => {
  console.error(error.stack);
});

/**
 * Entry point.
 */
(async () => {
  const argv = require('minimist')(process.argv.slice(2));
  const { service } = argv;

  if (!Object.values(FOOD_SERVICE).includes(service)) {
    process.exit(1);
    return;
  }

  await parseFoodOrdersAsync(service);
})();
