// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Download from './components/Download.vue'
import DownloadZL2 from './components/DownloadZL2.vue'
import ApngPlayer from './components/ApngPlayer.vue'
import Twikoo from './components/Twikoo.vue'
import './style.css'
import './style/blur.css'

import DomainWarningPopup from './components/DomainWarningPopup.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'layout-bottom': () => [
        h(DomainWarningPopup)
      ],
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('Download', Download)
    app.component('DownloadZL2', DownloadZL2)
    app.component('ApngPlayer', ApngPlayer)
    app.component('Twikoo', Twikoo)
  }
} satisfies Theme