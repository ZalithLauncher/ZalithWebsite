import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Zalith Launcher",
  description: "Zalith Launcher是一款基于PojavLauncher开发的Minecraft启动器，可在Android设备上运行Minecraft: Java Edition",
  lang: 'zh-CN',
  base: '/',
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '关于', link: '/docs/about' },
      { text: '通知', link: '/notices' },
      { text: '下载', link: '/download' }
    ],

    sidebar: [
      {
        text: '关于Zalith Launcher',
        items: [
          { text: '项目介绍', link: '/about' },
          { text: '特性', link: '/features' }
        ]
      },
      {
        text: '通知',
        items: [
          { text: '渲染器插件', link: '/notices/renderer-plugin' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ZalithLauncher/ZalithLauncher' }
    ]
  }
})
