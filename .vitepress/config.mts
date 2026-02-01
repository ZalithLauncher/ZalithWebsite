import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Zalith Launcher",
  description: '在 Android 设备上游玩 Minecraft: Java Edition',
  lastUpdated: true,
  locales: {
    root: {label: '简体中文'},
    en: {label: 'English'},
  },
  sitemap: {
    hostname: 'https://zalithlauncher.cn'
  },
  head: [
    ['link', { rel: 'icon', href: '/zl_icon.webp' }],
    ['meta', { name: 'keywords', content: "zl,zl2,zalith,zalithlauncher,minecraft,mc,zl官网,zl下载,zl启动器"}]
  ],
  themeConfig: {
    notFound: {
        title: '404',
        quote: 'Page Not Found',
        linkText: 'Go Home'
    },
    socialLinks: [
        { icon: 'github', link: 'https://github.com/ZalithLauncher' },
        { icon: 'discord', link: 'https://discord.gg/e7C4kytRgK' }
    ],
    logo: '/zl_icon.webp',
     search: {
      provider: 'local',
    }
  },
  vite: {
    server: {
      fs: {
        allow: ['..']
      }
    },
    build: {
      rollupOptions: {
        external: [/^server\/.*/]
      }
    }
  }
})