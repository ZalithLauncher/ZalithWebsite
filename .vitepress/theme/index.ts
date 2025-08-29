import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ApngPlayer from './components/ApngPlayer.vue'
import './style.css'
import './style/blur.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {})
    },
  enhanceApp({ app, router, siteData }) {
    app.component('ApngPlayer', ApngPlayer)
    app.component('Download', Download)
    app.component('DownloadZL2', DownloadZL2)
  }
} satisfies Theme
