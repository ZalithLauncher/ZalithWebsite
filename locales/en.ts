import type { DefaultTheme } from 'vitepress';

export default <DefaultTheme.Config> {
    search: {
        provider: 'local',
        options: {
            translations: {
                button: {
                    buttonText: 'Search',
                    buttonAriaLabel: 'Search',
                },
                modal: {
                    displayDetails: 'Show detailed list',
                    resetButtonTitle: 'Reset search',
                    backButtonTitle: 'Close search',
                    noResultsText: 'No results found',
                    footer: {
                        selectText: 'Select',
                        selectKeyAriaLabel: 'enter',
                        navigateText: 'Navigate',
                        navigateUpKeyAriaLabel: 'Arrow Up',
                        navigateDownKeyAriaLabel: 'Arrow Down',
                        closeText: 'Close',
                        closeKeyAriaLabel: 'esc',
                    },
                },
            },
        },
    },
    docFooter: {
        prev: 'Previous',
        next: 'Next'
    },
    darkModeSwitchLabel: 'Appearance',
    returnToTopLabel: 'Back to top',
    sidebarMenuLabel: 'Menu',
    editLink: {
        pattern: 'https://github.com/zalithlauncher/zalithwebsite/edit/main/:path',
        text: 'Edit this page on GitHub'
    },
    lastUpdated: {
        text: 'Updated at',
        formatOptions: {
            dateStyle: 'medium',
            timeStyle: 'short'
        }
    },
    nav: [
        { text: 'Home', link: '/en/' },
        { text: 'Download',
            items: [
                { text: 'Zalith Launcher 1', link: '/en/download' },
                { text: 'Zalith Launcher 2', link: '/en/zl2-download' }
            ]
        },
        { 
            text: 'More',
            items: [
                { text: 'Launcher Documentation', link: '/docs/projects/zl2' },
                { text: 'About this site', link: '/en/docs/about/about' }
            ]
        },
        { text: 'Switch Network Node', 
            items: [
                { text: '[AL]Aliyun Node', link: 'https://zalithlauncher.cn' },
                { text: '[CF]Cloudflare Node', link: 'https://cf.zalithlauncher.cn' },  
                { text: '[EO]edgeone Node-Recommended', link: 'https://www.zalithlauncher.cn' }
            ]
        }
    ],
    sidebar: [
        {
            text: 'Projects',
            items: [
                { text: 'Zalith Launcher 1', link: '/en/docs/projects/zl1' },
                { text: 'Zalith Launcher 2', link: '/en/docs/projects/zl2' }
            ]
        },
        {
            text: 'ZL2 Launcher Help',
            items: [
                { text: 'Download and Install Game', link: '/en/docs/help/download_game' },
                { text: 'ModLoader', link: '/en/docs/help/modloader' },
                { text: 'Account', link: '/en/docs/help/account' },
                { text: '3rd Authentication Servers', link: '/en/docs/help/auth_server' },
                { text: 'Changing Skin or Capes', link: '/en/docs/help/changing_skin_capes'},
                { text: 'Version Isolation', link: '/en/docs/help/version_isolation' }
            ]
        },
        {
            text: 'ZL2 Control Layout Help',
            collapsed: true,
            items: [
                { text: 'Overview', link: '/en/docs/control2_help/overview' },
                { text: 'Basic Editor Operations', link: '/en/docs/control2_help/basic_operation' },
                { text: "Control Layout Operations", link: "/en/docs/control2_help/control_layout_operations" },
                { text: 'Control Layer', link: '/en/docs/control2_help/control_layer' },
                { text: 'Controls', link: '/en/docs/control2_help/controls' }
            ]
        },
        {
            text: 'About this site',
            items: [
                { text: 'About', link: '/en/docs/about/about' }
            ]
        }
    ],
    outlineTitle: 'On this page',
    domainWarning: {
        title: 'Access Notice',
        content: 'We detected that you are accessing from <strong>{{ currentHostname }}</strong>. For faster website access speed and better stability, we strongly recommend you visit our EdgeOne CDN node:',
        button: 'I understand',
        officialDomain: 'www.zalithlauncher.cn'
    },
    footer: {
        message: '<a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">新ICP备2024015133号-4</a>',
        copyright: 'Copyright © 2025 Zalith Launcher, All rights reserved. | GPL-3.0 License'
    }

};