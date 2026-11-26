import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },

  css: ['~/style/index.css'],

  modules: ['@nuxt/eslint'],

  // 只保留 H5 客户端渲染：页面强依赖 localStorage / window.matchMedia，SSR 会在服务端炸
  ssr: false,

  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      title: '造间',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' },
        { name: 'description', content: '造间 · 空间灵感生成' },
      ],
      link: [{ rel: 'shortcut icon', href: '/favicon.ico', type: 'image/x-icon' }],
    },
  },

  devServer: {
    host: '0.0.0.0',
    port: 9000,
  },

  nitro: {
    // sharp 是原生模块，保持外部化由 nitro 追踪复制，不要 inline
    externals: {
      external: ['sharp'],
      // @edgeone/pages-blob 必须 inline：EdgeOne 构建期会替换 SDK 里的
      // {{PAGES_BLOB_DEPLOY_CREDENTIAL}} 占位符，但替换逻辑会跳过 node_modules 目录。
      // inline 后 SDK 代码进入 chunks/ 顶层文件，凭证才能被正确注入。
      inline: ['@edgeone/pages-blob'],
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
})
