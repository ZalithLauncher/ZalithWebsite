import { DefaultTheme } from 'vitepress';

export default <DefaultTheme.Config> {
    search: {
        provider: 'local',
        options: {
            translations: {
                button: {
                buttonText: '搜索',
                buttonAriaLabel: '搜索',
                },
                modal: {
                    displayDetails: '显示详细列表',
                    resetButtonTitle: '重制搜索',
                    backButtonTitle: '关闭搜索',
                    noResultsText: '没有找到相关结果',
                    footer: {
                        selectText: '选择',
                        selectKeyAriaLabel: 'enter',
                        navigateText: '切换',
                        navigateUpKeyAriaLabel: '上方向键',
                        navigateDownKeyAriaLabel: '下方向键',
                        closeText: '关闭',
                        closeKeyAriaLabel: 'esc',
                    },
                },
            },
        },
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
        formatOptions: { dateStyle: 'long', timeStyle: 'short' }
    },
    nav: [
        { text: '首页', link: '/' },
        { text: '下载',
            items: [
                { text: 'Zalith Launcher 1', link: '/download' },
                { text: 'Zalith Launcher 2', link: '/zl2-download' }
            ]
         },
        { text: '博客', link: '/blog/' },
        { text: '更多', 
            items: [
                { text: '关于ZL1', link: '/docs/projects/zl1' },
                { text: '关于ZL2', link: '/docs/projects/zl2' },
                { text: '关于本站', link: '/docs/about/about' }
            ]
         },
         { text: '切换网络节点', 
            items: [
                { text: '[CF]Cloudflare节点', link: 'https://zalithlauncher.cn' },
                { text: '[EO]edgeone节点', link: 'https://www.zalithlauncher.cn' }
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
            text: 'ZL2 使用指南',
            items: [
                { text: '下载安装游戏', link: '/docs/help/download_game' },
                { text: '模组加载器', link: '/docs/help/modloader' },
                { text: '账号', link: '/docs/help/account' },
                { text: '认证服务器', link: '/docs/help/auth_server' },
                { text: '版本隔离', link: '/docs/help/version_isolation' },
                { text: '更换微软账户皮肤与披风的窍门', link: '/docs/help/choose_online_skin_or_capes'}
            ]
        },
        {
            text: 'ZL2 控制布局帮助手册',
            collapsed: true,
            items: [
                { text: '概览', link: '/docs/control2_help/overview' },
                { text: '编辑器基本操作', link: '/docs/control2_help/basic_operation' },
                { text: '控制层', link: '/docs/control2_help/control_layer' }
            ]
        },
        {
            text: '关于本站',
            items: [
                { text: '关于本站', link: '/docs/about/about' }
            ]
        }
    ],

    outlineTitle: '当前页大纲',

    footer: {
        message: '<a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">新ICP备2024015133号-4</a>',
        copyright: '版权所有 © 2025 Zalith Launcher | GPL-3.0 许可证'
    }

}

