import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/src/**/*.test.ts'],
    coverage: {
      provider: 'v8', // or 'v8'
      reporter: [
        'text',
        'json',
        'html',
      ],
    },
    browser: {
      provider: 'playwright', // or 'webdriverio'
      enabled: true,
      // at least one instance is required
      instances: [
        { browser: 'chromium' },
      ],
    },
  },
  resolve: {
    alias: {
      '@yy-web/use-provide': resolve(import.meta.dirname, 'packages/provide/src/index.ts'),
    },
  },
})
