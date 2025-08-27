import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Zalith Launcher",
  locales: {
    root: {label: '简体中文'},
    en: {label: 'English'},
  },
  sitemap: {
    hostname: 'https://zalithlauncher.cn'
  },
  head: [
    ['link', { rel: 'icon', href: '/zl_icon.png' }]
  ],
  themeConfig: {
    socialLinks: [
        { icon: 'github', link: 'https://github.com/ZalithLauncher' },
        { icon: 'discord', link: 'https://discord.gg/sm6jJ7dy' }
    ],
    logo: '/zl_icon.png',
  }
})
