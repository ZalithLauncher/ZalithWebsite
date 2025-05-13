import { DefaultTheme } from 'vitepress';

export default <DefaultTheme.Config> {
    search: {
        provider: 'local'
    },
    docFooter: {
        prev: '上一篇',
        next: '下一篇'
    },
    darkModeSwitchLabel: '外观',
    returnToTopLabel: '返回顶部',
    sidebarMenuLabel: '菜单',
    editLink: {
        pattern: 'https://github.com/zalithlauncher/zalithwebside/edit/main/docs/:path',
        text: '在 GitHub 上编辑此页'
    },
    lastUpdated: {
        text: '上次更新',
        formatOptions: {
            dateStyle: 'full',
            timeStyle: 'medium'
        }
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
        { text: '首页', link: '/' },
        { text: '关于', link: '/docs/about' },
        { text: '下载', link: '/download' }
    ],

    sidebar: [
        {
            text: '关于Zalith Launcher',
            items: [
                { text: '项目介绍', link: '/docs/about' },
                { text: '特性', link: '/docs/features' },
                { text: '关于zalith launcher 2', link: '/docs/zl2' }
            ]
        },
        {
            text: '插件',
            items: [
                { text: '关于插件', link: '/docs/plugins/index' }
            ]
        }
    ],

    footer: {
        message: '项目遵循GPL-3.0协议',
        copyright: '版权所有 © 2025-zalith launcher'
    }
}