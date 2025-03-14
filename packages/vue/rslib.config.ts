import { defineConfig } from '@rslib/core'

export default defineConfig({
  source: {
    entry: {
      index: './src/index.ts',
    },
  },
  lib: [
    {
      dts: true,
      format: 'esm',
    },
  ],
  output: {
    target: 'web',
  },
})
