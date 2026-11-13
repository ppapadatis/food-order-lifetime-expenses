export class MissingTokenError extends Error {
  readonly variable: string;

  constructor(variable: string) {
    super(`Missing ${variable}. Add it to your .env file.`);
    this.name = 'MissingTokenError';
    this.variable = variable;
  }
}

export const getToken = (variable: string, env: Record<string, string | undefined>): string => {
  const token = env[variable]?.trim();
  if (!token) {
    throw new MissingTokenError(variable);
  }
  return token;
};
