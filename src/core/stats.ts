import type { Order } from './order.ts';

export type ShopCost = { id: string | number; restaurant: string; orders: number; price: number };

export type Report = {
  shops: ShopCost[];
  orderCount: number;
  period: { from: string; to: string } | null;
  totalCents: number;
};

export function buildReport(orders: Order[]): Report {
  const counted = orders.filter((order) => order.counted);

  const byShop = new Map<string | number, { restaurant: string; orders: number; cents: number }>();
  for (const order of counted) {
    const shop = byShop.get(order.shopId) ?? { restaurant: order.shopName, orders: 0, cents: 0 };
    shop.orders += 1;
    shop.cents += order.amountCents;
    byShop.set(order.shopId, shop);
  }

  const shops = [...byShop]
    .map(([id, shop]) => ({
      id,
      restaurant: shop.restaurant,
      orders: shop.orders,
      price: shop.cents / 100,
    }))
    .sort((a, b) => b.price - a.price);

  // ISO 'YYYY-MM-DD' strings sort chronologically.
  const dates = counted.flatMap((order) => (order.date === null ? [] : [order.date])).sort();
  const from = dates[0];
  const to = dates[dates.length - 1];

  return {
    shops,
    orderCount: counted.length,
    period: from === undefined || to === undefined ? null : { from, to },
    totalCents: counted.reduce((sum, order) => sum + order.amountCents, 0),
  };
}
