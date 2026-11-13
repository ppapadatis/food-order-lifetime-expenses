export const asString = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined;

export const asFiniteNumber = (value: unknown): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : 0;
