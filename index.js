const { parseEfoodAsync } = require('./src/parser');

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
  await parseEfoodAsync();
})();
