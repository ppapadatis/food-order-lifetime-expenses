import { create } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createHttpClient } from '../../../src/http/client.ts';

vi.mock('axios');

describe('createHttpClient', () => {
  const instanceGet = vi.fn();

  beforeEach(() => {
    instanceGet.mockReset();
    vi.mocked(create).mockReturnValue({ get: instanceGet } as never);
  });

  it('creates an axios instance with a timeout and no redirects', () => {
    createHttpClient();

    expect(create).toHaveBeenCalledWith({ timeout: 15000, maxRedirects: 0 });
  });

  it('passes the headers to the instance and resolves the response body', async () => {
    instanceGet.mockResolvedValue({ data: { ok: true } });

    const body = await createHttpClient().get('u', { a: 'b' });

    expect(instanceGet).toHaveBeenCalledWith('u', { headers: { a: 'b' } });
    expect(body).toEqual({ ok: true });
  });
});
