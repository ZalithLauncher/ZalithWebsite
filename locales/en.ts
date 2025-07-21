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
        pattern: 'https://github.com/zalithlauncher/zalithwebside/edit/main/:path',
        text: 'Edit this page on GitHub'
    },
    lastUpdated: {
        text: 'Last Updated at: ',
    },
    nav: [
        { text: 'Home', link: '/en/' },
        { text: 'Download', link: '/en/download' },
        { 
            text: 'More',
            items: [
                { text: 'About', link: '/en/docs/projects/zl1' },
                { text: 'Install Game', link: '/en/docs/game/install'}
            ]
        }
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
            text: 'account',
            items: [
                { text: 'authentic', link: '/en/docs/account/authentic' },
                { text: 'offline', link: '/en/docs/account/offline' },
                { text: 'add account', link: '/en/docs/account/add' }
            ]
        },
        {
            text: 'Game',
            items: [
                { text: 'Install Game', link: '/en/docs/game/install' }
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