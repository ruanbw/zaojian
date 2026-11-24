import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'no-console': 'off',
    'vue/no-unused-refs': 'off',
    // Vue 3 允许多根节点模板，此规则是 Vue 2 遗留
    'vue/no-multiple-template-root': 'off',
  },
})
