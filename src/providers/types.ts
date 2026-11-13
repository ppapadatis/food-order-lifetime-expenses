import type { HttpClient } from '../http/client.ts';
import type { Order } from '../core/order.ts';

export type ProviderId = 'efood' | 'box' | 'wolt';

export interface Provider<Raw> {
  id: ProviderId;
  tokenEnv: string;
  fetchRaw(http: HttpClient, token: string): Promise<Raw[]>;
  normalize(raw: Raw): Order;
}

export const MAX_PAGES = 1000;

export class PaginationLimitError extends Error {
  constructor() {
    super('Pagination limit reached');
    this.name = 'PaginationLimitError';
  }
}
