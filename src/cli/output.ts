import type { Report } from '../core/stats.ts';
import type { ProviderId } from '../providers/index.ts';
import { LITERALS_MAPPER, resolve } from './literals.ts';

export const printReport = (id: ProviderId, report: Report): void => {
  const unknown = resolve(LITERALS_MAPPER.MESSAGES_PERIOD_UNKNOWN);
  const { from, to } = report.period ?? { from: unknown, to: unknown };

  console.log(report.shops);
  console.log(resolve(LITERALS_MAPPER.MESSAGES_TOTAL_SHOPS, report.shops.length));
  console.log(resolve(LITERALS_MAPPER.MESSAGES_TOTAL_ORDERS, report.orderCount));
  console.log(resolve(LITERALS_MAPPER.MESSAGES_SPREE_PERIOD, from, to));
  console.log(
    resolve(LITERALS_MAPPER.MESSAGES_AMOUNT_SPENT, id, (report.totalCents / 100).toFixed(2)),
  );
};
