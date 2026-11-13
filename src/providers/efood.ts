import type { HttpClient } from '../http/client.ts';
import { MAX_PAGES, PaginationLimitError } from './types.ts';
import type { Provider } from './types.ts';

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
    const orders = body?.data?.orders ?? [];
    all.push(...orders);
    if (body?.data?.hasNext !== true || orders.length === 0) return all;
  }
  throw new PaginationLimitError();
};

export const efood: Provider<EfoodRawOrder> = {
  id: 'efood',
  tokenEnv: 'EFOOD_ACCESS_TOKEN',
  fetchRaw,
  normalize: (raw) => ({
    shopId: raw.restaurant?.id ?? '',
    shopName: raw.restaurant?.name ?? '',
    amountCents: Math.round((raw.price ?? 0) * 100),
    counted: raw.status?.toLowerCase() === 'accepted',
    date: raw.submission_date?.split(' ')[0] || null,
  }),
};
