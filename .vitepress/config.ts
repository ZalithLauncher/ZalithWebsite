import { DefaultTheme } from 'vitepress';

export default {
  extends: DefaultTheme,
  nav: {
    logo: '/zl_title.png',
    title: '',
    items: [
      { text: '首页', link: '/' },
      { text: '关于', link: '/docs/projects/zl1' },
      { text: '下载', link: '/download' }
    ]
  }
} satisfies DefaultTheme.Config;