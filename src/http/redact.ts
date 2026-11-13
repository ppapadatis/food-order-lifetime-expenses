import { isAxiosError } from 'axios';

// Read only the message and status: the request config and response body can hold the token.
export const describeError = (error: unknown): string => {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    return status === undefined ? error.message : `${error.message} (HTTP ${status})`;
  }
  return error instanceof Error ? error.message : 'Unknown error';
};
