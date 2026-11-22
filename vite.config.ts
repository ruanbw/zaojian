import path from 'node:path'
import process from 'node:process'
import Uni from '@uni-helper/plugin-uni'
import UniComponents from '@uni-helper/vite-plugin-uni-components'
import UniLayouts from '@uni-helper/vite-plugin-uni-layouts'
import UniManifest from '@uni-helper/vite-plugin-uni-manifest'
import UniPages from '@uni-helper/vite-plugin-uni-pages'
import dayjs from 'dayjs'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'

const APP_TITLE = '造间'

export default defineConfig({
  base: '/',
  plugins: [
    UniLayouts({ dts: 'src/types/uni-layouts.d.ts' }),
    UniManifest(),
    UniComponents({
      extensions: ['vue'],
      deep: true,
      dts: 'src/types/components.d.ts',
    }),
    UniPages({
      exclude: ['**/components/**/**.*', '**/sections/**/**.*'],
      dts: 'src/types/uni-pages.d.ts',
    }),
    Uni(),
    {
      name: 'fix-vite-plugin-vue',
      configResolved(config) {
        const plugin = config.plugins.find(p => p.name === 'vite:vue')
        if (plugin?.api?.options)
          plugin.api.options.devToolsEnabled = false
      },
    },
    UnoCSS(),
    AutoImport({
      imports: ['vue', 'uni-app'],
      dts: 'src/types/auto-import.d.ts',
      dirs: ['src/hooks'],
      vueTemplate: true,
    }),
    {
      name: 'html-transform',
      transformIndexHtml(html: string) {
        return html
          .replace('%BUILD_TIME%', dayjs().format('YYYY-MM-DD HH:mm:ss'))
          .replace('%VITE_APP_TITLE%', APP_TITLE)
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.join(process.cwd(), './src'),
      '@img': path.join(process.cwd(), './src/static/images'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 9000,
  },
  build: {
    target: 'es6',
    sourcemap: false,
  },
})
