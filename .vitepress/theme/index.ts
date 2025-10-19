// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Download from './components/Download.vue'
import DownloadZL2 from './components/DownloadZL2.vue'
import ApngPlayer from './components/ApngPlayer.vue'
import BlogPost from './layouts/BlogPost.vue'
import './style.css'
import './style/blur.css'

// 作者信息配置
const authors = {
  'zh-CN': [
    { id: 'zalith_team', name: 'Zalith团队', link: 'https://github.com/ZalithLauncher', avatar: '/zl_icon.webp' },
    { id: 'lemwood', name: '柠枺', link: 'https://lemwood.cn', avatar: '/author/lemwood.webp' }
  ],
  'en': [
    { id: 'zalith_team', name: 'Zalith Team', link: 'https://github.com/ZalithLauncher', avatar: '/zl_icon.webp' },
    { id: 'lemwood', name: 'lemwood', link: 'https://lemwood.cn', avatar: '/author/lemwood.webp' }
  ]
}

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('Download', Download)
    app.component('DownloadZL2', DownloadZL2)
    app.component('ApngPlayer', ApngPlayer)
    app.component('BlogPost', BlogPost)
    
    // 提供作者信息给主题
    app.provide('authors', authors)
  }
} satisfies Theme