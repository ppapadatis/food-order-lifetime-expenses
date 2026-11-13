import type { Provider } from './types.ts';

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
    return body?.payload?.orders ?? [];
  },
  normalize: (raw) => ({
    shopId: raw.shop?._id ?? '',
    shopName: raw.shop?.name ?? '',
    amountCents: raw.totalPrice ?? 0,
    counted: COUNTED_STATUSES.has(raw.shopResponse?.status?.toLowerCase() ?? ''),
    date: raw.createdAt?.split('T')[0] || null,
  }),
};
