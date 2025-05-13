import type { DefaultTheme } from 'vitepress';

export default <DefaultTheme.Config> {
    docFooter: {
        prev: 'Previous',
        next: 'Next'
    },
    darkModeSwitchLabel: 'Appearance',
    returnToTopLabel: 'Back to top',
    sidebarMenuLabel: 'Menu',
    editLink: {
        pattern: 'https://github.com/zalithlauncher/zalithwebside/edit/main/docs/:path',
        text: 'Edit this page on GitHub'
    },
    lastUpdated: {
        text: 'Last Updated at: ',
    },
    nav: [
        { text: 'Home', link: '/' },
        { text: 'About', link: '/en/docs/about' },
        { text: 'Download', link: '/en/download' }
    ],
    sidebar: [
        {
            text: 'About Zalith Launcher',
            items: [
                { text: 'Introduction', link: '/en/docs/about' },
                { text: 'Features', link: '/en/docs/features' },
                { text: 'About Zalith Launcher 2', link: '/en/docs/zl2' }
            ]
        },
        {
            text: 'Plugins',
            items: [
                { text: 'About Plugins', link: '/en/docs/plugins/index' }
            ]
        }
    ],
    footer: {
        message: 'Licensed under GPL-3.0',
        copyright: 'Copyright © 2025 Zalith Launcher, All rights reserved.'
    }
};