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
        { text: 'Home', link: '/en/' },
        { text: 'About', link: '/en/docs/projects/zl1' },
        { text: 'Download', link: '/en/download' }
    ],
    sidebar: [
        {
            text: 'Projects',
            items: [
                { text: 'Zalith Launcher', link: '/en/docs/projects/zl1' },
                { text: 'Zalith Launcher 2', link: '/en/docs/projects/zl2' }
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