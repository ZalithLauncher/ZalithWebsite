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
        text: 'Last Updated at(BJT)',
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
        { text: 'Blog', link: '/en/blog/' },
        { 
            text: 'More',
            items: [
                { text: 'About ZL1', link: '/en/docs/projects/zl1' },
                { text: 'About ZL2', link: '/en/docs/projects/zl2' },
                { text: 'About this site', link: '/en/docs/about/about' }
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
            text: 'Help V2',
            collapsed: true,
            items: [
                { text: 'Download and Install Game', link: '/en/docs/help/download_game' },
                { text: 'ModLoader', link: '/en/docs/help/modloader' },
                { text: 'Account', link: '/en/docs/help/account' },
                { text: 'Authentication Server', link: '/en/docs/help/auth_server' },
                { text: 'Version Isolation', link: '/en/docs/help/version_isolation' }
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
    footer: {
        message: 'Licensed under GPL-3.0',
        copyright: 'Copyright © 2025 Zalith Launcher, All rights reserved. | <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">新ICP备2024015133号-4</a>'
    }

};
