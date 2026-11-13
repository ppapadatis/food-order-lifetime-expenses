import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    clearMocks: true,
    include: ['tests/**/*.spec.ts'],
    coverage: { provider: 'v8', include: ['src/**'], thresholds: { lines: 90 } },
  },
});
