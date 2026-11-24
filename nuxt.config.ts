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
        { name: 'viewport', content: 'width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, viewport-fit=cover' },
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
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
})
