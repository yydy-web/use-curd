import path from 'node:path'
import { defineConfig } from '@rsbuild/core'
import { pluginVue } from '@rsbuild/plugin-vue'

export default defineConfig({
  source: {
    entry: {
      index: './src/main.ts',
    },
  },
  resolve: {
    alias: {
      '@yy-web/use-curd-vue': path.resolve(__dirname, '../packages/vue/src/index.ts'),
    },
  },
  plugins: [pluginVue()],
})
