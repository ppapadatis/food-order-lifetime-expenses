import { isAxiosError } from 'axios';
import type { Provider } from './types.ts';
import { asFiniteNumber, asString } from './parse.ts';

export type BoxRawOrder = {
  totalPrice?: number;
  createdAt?: string;
  shop?: { _id?: string; name?: string };
  shopResponse?: { status?: string };
};

const COUNTED_STATUSES = new Set(['accepted', 'completed', 'delivered']);

// box rejects older app versions with HTTP 418.
export const BOX_APP_VERSION = '8.6.4';

const STATUS_MESSAGES: Record<number, string> = {
  418: 'box rejected the app version. Update BOX_APP_VERSION in src/providers/box.ts.',
  401: 'The box token expired or is invalid. Box tokens last 15 minutes. Copy a fresh token.',
};

export const box: Provider<BoxRawOrder> = {
  id: 'box',
  tokenEnv: 'BOX_ACCESS_TOKEN',
  fetchRaw: async (http, token) => {
    const body = await http
      .get<{ payload?: { orders?: BoxRawOrder[] } }>(
        'https://consumer.box.gr/api/orders/get/userlist',
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          appId: 'box-web',
          'app-version': BOX_APP_VERSION,
        },
      )
      .catch((error: unknown) => {
        const message = isAxiosError(error) ? STATUS_MESSAGES[error.response?.status ?? 0] : '';
        throw message ? new Error(message) : error;
      });
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
