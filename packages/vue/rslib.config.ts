import { defineConfig } from '@rslib/core'

export default defineConfig({
  source: {
    tsconfigPath: './tsconfig.json',
    entry: {
      index: './src/index.ts',
    },
  },
  lib: [
    {
      bundle: true,
      dts: true,
      format: 'esm',
    },
  ],
  output: {
    target: 'web',
  },

})
