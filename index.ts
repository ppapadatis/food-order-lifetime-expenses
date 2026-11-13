import minimist from 'minimist';
import { parseFoodOrdersAsync } from './src/parser.ts';
import { FOOD_SERVICE } from './src/constants.ts';

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
  const argv = minimist(process.argv.slice(2));
  const { service } = argv;

  if (!Object.values(FOOD_SERVICE).includes(service)) {
    process.exit(1);
    return;
  }

  await parseFoodOrdersAsync(service);
})();
