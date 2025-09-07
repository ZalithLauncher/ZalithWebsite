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
        text: 'Last Updated at: ',
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
                { text: 'Account', link: '/en/docs/account/authentic' },
                { text: 'Plugins', link: '/en/docs/plugins/index' },
                { text: 'Install Game', link: '/en/docs/game/install'},
                { text: 'FAQ', link: '/en/docs/issues/index' },
                { text: 'About this site', link: '/en/docs/about/about' }
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
                { text: 'Online', link: '/en/docs/account/authentic' },
                { text: 'Offline', link: '/en/docs/account/offline' },
                { text: 'Add Account', link: '/en/docs/account/add' }
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
        },
        {
            text: 'FAQ',
            items: [
                { text: 'Frequently Asked Questions', link: '/en/docs/issues/index' }
            ]
        },
        {
            text: 'About this site',
            items: [
                { text: 'APNG Animation', link: '/en/docs/about/apng'},
                { text: 'About', link: '/en/docs/about/about' },
                { text: 'github readme', link: '/README'}
            ]
        }
    ],
    footer: {
        message: 'Licensed under GPL-3.0',
        copyright: 'Copyright © 2025 Zalith Launcher, All rights reserved.'
    }

};
