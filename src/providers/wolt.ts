import { format } from 'date-fns';
import type { HttpClient } from '../http/client.ts';
import { MAX_PAGES, PaginationLimitError } from './types.ts';
import type { Provider } from './types.ts';
import { asFiniteNumber, asString } from './parse.ts';

export type WoltRawOrder = {
  status?: string;
  total_price?: number;
  venue_id?: string;
  venue_name?: string;
  delivery_time?: { $date?: unknown };
};

const fetchRaw = async (http: HttpClient, token: string): Promise<WoltRawOrder[]> => {
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  const all: WoltRawOrder[] = [];
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const url = `https://restaurant-api.wolt.com/v2/order_details/?limit=100&skip=${all.length}`;
    // Each skip depends on the previous page, so pages load in sequence.
    // eslint-disable-next-line no-await-in-loop
    const orders = await http.get<WoltRawOrder[]>(url, headers);
    if (!Array.isArray(orders) || orders.length === 0) return all;
    all.push(...orders);
  }
  throw new PaginationLimitError();
};

const toDate = (value: unknown): string | null => {
  if (typeof value !== 'number' && typeof value !== 'string') return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : format(date, 'yyyy-MM-dd');
};

export const wolt: Provider<WoltRawOrder> = {
  id: 'wolt',
  tokenEnv: 'WOLT_ACCESS_TOKEN',
  fetchRaw,
  normalize: (input) => {
    // Spreading turns a null raw order into an empty one.
    const raw: WoltRawOrder = { ...input };
    return {
      shopId: raw.venue_id ?? '',
      shopName: asString(raw.venue_name) ?? '',
      amountCents: Math.round(asFiniteNumber(raw.total_price)),
      counted: asString(raw.status)?.toLowerCase() === 'delivered',
      date: toDate(raw.delivery_time?.$date),
    };
  },
};
