import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  globalStyle: {
    navigationStyle: 'custom',
    navigationBarTitleText: '造间',
    navigationBarBackgroundColor: '#F4EDE1',
    navigationBarTextStyle: 'black',
    backgroundColor: '#F4EDE1',
  },
  easycom: {
    autoscan: true,
  },
})
