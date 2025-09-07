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
                { text: 'Zalith Launcher', link: '/download' },
                { text: 'Zalith Launcher 2', link: '/zl2-download' }
            ]
         },
        { text: '更多', 
            items: [
                { text: '关于', link: '/docs/projects/zl1' },
                { text: '关于zl2', link: '/docs/projects/zl2' },
                { text: '账号', link: '/docs/account/authentici'},
                { text: '插件', link: '/docs/plugins/index'},
                { text: '安装游戏', link: '/docs/game/install'},
                { text: '问题解答', link: '/docs/issues/index' },
                { text: '关于本站', link: '/docs/about/about' }
            ]
         }
    ],

    sidebar: [
        {
            text: '项目',
            items: [
                { text: 'Zalith Launcher', link: '/docs/projects/zl1' },
                { text: 'Zalith Launcher 2', link: '/docs/projects/zl2' }
            ]
        },
        {
            text: '账号',
            items: [
                { text: '正版账号', link: '/docs/account/authentic' },
                { text: '离线账号', link: '/docs/account/offline' },
                { text: '添加/登录账号', link: '/docs/account/add' }
            ]
        },
        {
            text: '游戏',
            items: [
                { text: '安装游戏', link: '/docs/game/install' }
            ]
        },
        {
            text: '插件',
            items: [
                { text: '关于插件', link: '/docs/plugins/index' }
            ]
        },
        {
            text: '问题解答',
            items: [
                { text: '常见问题', link: '/docs/issues/index' }
            ]
        },
        {
            text: '关于本站',
            items: [
                { text: 'apng动画', link: '/docs/about/apng' },
                { text: '关于本站', link: '/docs/about/about' },
                { text: 'github readme', link: '/README'}
            ]
        }
    ],

    footer: {
        message: '在 GPL-3.0 许可证下发布',
        copyright: '版权所有 © 2025 Zalith Launcher'
    }

}

