import { defineManifestConfig } from '@uni-helper/vite-plugin-uni-manifest'

export default defineManifestConfig({
  name: '造间',
  appid: '',
  description: '空间灵感生成',
  versionName: '1.0.0',
  versionCode: '100',
  transformPx: false,
  h5: {
    router: {
      mode: 'history',
      base: '/',
    },
  },
})
