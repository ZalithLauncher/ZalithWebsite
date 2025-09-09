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
        pattern: 'https://github.com/zalithlauncher/zalithwebsite/edit/main/:path',
        text: '在 GitHub 上编辑此页'
    },
    lastUpdated: {
        text: '上次更新',
        formatOptions: {
            dateStyle: 'full',
            timeStyle: 'medium'
        }
    },
    nav: [
        { text: '首页', link: '/' },
        { text: '下载',
            items: [
                { text: 'Zalith Launcher 1', link: '/download' },
                { text: 'Zalith Launcher 2', link: '/zl2-download' }
            ]
         },
        { text: '更多', 
            items: [
                { text: '关于ZL1', link: '/docs/projects/zl1' },
                { text: '关于ZL2', link: '/docs/projects/zl2' },
                { text: '关于本站', link: '/docs/about/about' }
            ]
         }
    ],

    sidebar: [
        {
            text: '项目',
            items: [
                { text: 'Zalith Launcher 1', link: '/docs/projects/zl1' },
                { text: 'Zalith Launcher 2', link: '/docs/projects/zl2' }
            ]
        },
        {
            text: '帮助',
            items: [
                { text: '下载安装游戏', link: '/docs/help/download_game' },
                { text: '模组加载器', link: '/docs/help/modloader' },
                { text: '账号', link: 'docs/help/account' }
            ]
        },
        {
            text: '关于本站',
            items: [
                { text: '关于本站', link: '/docs/about/about' }
            ]
        }
    ],

    footer: {
        message: '在 GPL-3.0 许可证下发布',
        copyright: '版权所有 © 2025 Zalith Launcher'
    }

}

