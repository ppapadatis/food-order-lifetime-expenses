import { describe, expect, it } from 'vitest';
import { describeError } from '../../../src/http/redact.ts';

const axiosError = (message: string, status?: number) => ({
  isAxiosError: true,
  message,
  config: { headers: { Authorization: 'Bearer SECRET' } },
  response: status === undefined ? undefined : { status, data: { echo: 'SECRET' } },
});

describe('describeError', () => {
  it('gives the message and status of an HTTP error without secrets', () => {
    const result = describeError(axiosError('Request failed with status code 401', 401));

    expect(result).toBe('Request failed with status code 401 (HTTP 401)');
    expect(result).not.toContain('SECRET');
  });

  it('gives the status of a redirect', () => {
    expect(describeError(axiosError('Request failed with status code 302', 302))).toMatch(
      /\(HTTP 302\)$/,
    );
  });

  it('gives only the message when there is no response', () => {
    expect(describeError(axiosError('timeout of 15000ms exceeded'))).toBe(
      'timeout of 15000ms exceeded',
    );
  });

  it('gives the message of a plain error', () => {
    expect(describeError(new Error('boom'))).toBe('boom');
  });

  it.each(['x', undefined])('gives a generic text for %s', (value) => {
    expect(describeError(value)).toBe('Unknown error');
  });
});
