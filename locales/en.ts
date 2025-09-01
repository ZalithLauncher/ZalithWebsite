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
        pattern: 'https://github.com/zalithlauncher/zalithwebsite/edit/main/:path',
        text: 'Edit this page on GitHub'
    },
    lastUpdated: {
        text: 'Last Updated at: September 1st, 2025,
    },
    nav: [
        { text: 'Home', link: '/en/' },
        { text: 'Download',
            items: [
                { text: 'Zalith Launcher', link: '/en/download' },
                { text: 'Zalith Launcher 2', link: '/en/zl2-download' }
            ]
         },
        { 
            text: 'More',
            items: [
                { text: 'About', link: '/en/docs/projects/zl1' },
                { text: 'About ZL2', link: '/en/docs/projects/zl2' },
                { text: 'Online Account', link: '/en/docs/account/authentic' },
                { text: 'Install Mods', link: '/en/docs/plugins/index' },
                { text: 'Install Version', link: '/en/docs/game/install'}
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
            text: 'Account',
            items: [
                { text: 'Add Account', link: '/en/docs/account/add' }
                { text: 'Online Account', link: '/en/docs/account/authentic' },
                { text: 'Offline Account', link: '/en/docs/account/offline' },
            ]
        },
        {
            text: 'Versions',
            items: [
                { text: 'Install Version', link: '/en/docs/game/install' }
            ]
        },
        {
            text: 'Mods',
            items: [
                { text: 'Install Mods', link: '/en/docs/plugins/index' }
            ]
        },
        {
            text: 'About this site',
            items: [
                { text: 'Info', link: '/en/docs/about/about' }
                { text: 'APNG Animation', link: '/en/docs/about/apng'},
            ]
        }
    ],
    footer: {
        message: 'Licensed under GPL-3.0',
        copyright: 'Copyright © 2025 Zalith Launcher, All rights reserved.'
    }

};

