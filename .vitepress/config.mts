import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Zalith Launcher",
  description: '在 Android 设备上游玩minecraft JAVA Edition',
  locales: {
    root: {label: '简体中文'},
    en: {label: 'English'},
  },
  sitemap: {
    hostname: 'https://zalithlauncher.cn'
  },
  head: [
    ['link', { rel: 'icon', href: '/zl_icon.png' }],
    ['meta', { name: 'keywords', content: "zl,zl2,zalith,zalithlauncher,minecraft,mc,zl官网,zl下载,zl启动器"}]
  ],
  themeConfig: {
    socialLinks: [
        { icon: 'github', link: 'https://github.com/ZalithLauncher' },
        { icon: 'discord', link: 'https://discord.gg/sm6jJ7dy' }
    ],
    logo: '/zl_icon.png',
     search: {
      provider: 'local',
    }
  }
})
