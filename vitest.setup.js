import { fileURLToPath } from 'node:url';

process.loadEnvFile(fileURLToPath(new URL('.test.env', import.meta.url)));
