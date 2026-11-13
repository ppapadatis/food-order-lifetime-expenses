import type { Provider } from './types.ts';
import { asFiniteNumber, asString } from './parse.ts';

export type BoxRawOrder = {
  totalPrice?: number;
  createdAt?: string;
  shop?: { _id?: string; name?: string };
  shopResponse?: { status?: string };
};

const COUNTED_STATUSES = new Set(['accepted', 'completed', 'delivered']);

export const box: Provider<BoxRawOrder> = {
  id: 'box',
  tokenEnv: 'BOX_ACCESS_TOKEN',
  fetchRaw: async (http, token) => {
    const body = await http.get<{ payload?: { orders?: BoxRawOrder[] } }>(
      'https://box-client.wavecxm.com/api/orders/get/userlist',
      { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, appId: 'box-web' },
    );
    const orders = body?.payload?.orders;
    return Array.isArray(orders) ? orders : [];
  },
  normalize: (input) => {
    // Spreading turns a null raw order into an empty one.
    const raw: BoxRawOrder = { ...input };
    return {
      shopId: raw.shop?._id ?? '',
      shopName: asString(raw.shop?.name) ?? '',
      amountCents: Math.round(asFiniteNumber(raw.totalPrice)),
      counted: COUNTED_STATUSES.has(asString(raw.shopResponse?.status)?.toLowerCase() ?? ''),
      date: asString(raw.createdAt)?.split('T')[0] || null,
    };
  },
};
