import { create } from 'axios';

export interface HttpClient {
  get<T>(url: string, headers: Record<string, string>): Promise<T>;
}

export const createHttpClient = (): HttpClient => {
  // No redirects: a cross-host redirect would carry the Authorization header along.
  const instance = create({ timeout: 15000, maxRedirects: 0 });

  return {
    get: async <T>(url: string, headers: Record<string, string>): Promise<T> => {
      const response = await instance.get<T>(url, { headers });
      return response.data;
    },
  };
};
