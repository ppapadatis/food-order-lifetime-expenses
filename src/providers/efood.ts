import type { HttpClient } from '../http/client.ts';
import { MAX_PAGES, PaginationLimitError } from './types.ts';
import type { Provider } from './types.ts';
import { asFiniteNumber, asString } from './parse.ts';

export type EfoodRawOrder = {
  status?: string;
  price?: number;
  submission_date?: string;
  restaurant?: { id?: string | number; name?: string };
};

type EfoodPage = { data?: { hasNext?: boolean; orders?: EfoodRawOrder[] } };

const fetchRaw = async (http: HttpClient, token: string): Promise<EfoodRawOrder[]> => {
  const headers = { 'Content-Type': 'application/json', 'x-core-session-id': token };
  const all: EfoodRawOrder[] = [];
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const url = `https://api.e-food.gr/api/v1/user/orders/history?limit=100&offset=${all.length}&mode=extended`;
    // Each offset depends on the previous page, so pages load in sequence.
    // eslint-disable-next-line no-await-in-loop
    const body = await http.get<EfoodPage>(url, headers);
    const orders = body?.data?.orders;
    if (!Array.isArray(orders)) return all;
    all.push(...orders);
    if (body?.data?.hasNext !== true || orders.length === 0) return all;
  }
  throw new PaginationLimitError();
};

export const efood: Provider<EfoodRawOrder> = {
  id: 'efood',
  tokenEnv: 'EFOOD_ACCESS_TOKEN',
  fetchRaw,
  normalize: (input) => {
    // Spreading turns a null raw order into an empty one.
    const raw: EfoodRawOrder = { ...input };
    return {
      shopId: raw.restaurant?.id ?? '',
      shopName: asString(raw.restaurant?.name) ?? '',
      amountCents: Math.round(asFiniteNumber(asFiniteNumber(raw.price) * 100)),
      counted: asString(raw.status)?.toLowerCase() === 'accepted',
      date: asString(raw.submission_date)?.split(' ')[0] || null,
    };
  },
};
