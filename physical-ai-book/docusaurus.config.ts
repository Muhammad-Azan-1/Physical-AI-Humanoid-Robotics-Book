
import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'From Simulation to Embodied Intelligence',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://physical-ai-robotics.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'humanoid-robotics-book', // Usually your GitHub org/user name.
  projectName: 'physical-ai-book', // Usually your repo name.

  onBrokenLinks: 'throw',

  markdown: {
    format: 'mdx',
    mermaid: true,
    preprocessor: ({ filePath, fileContent }) => {
      return fileContent;
    },
    mdx1Compat: {
      comments: true,
      admonitions: true,
      headingIds: true,
    },
  },

  // Useful for SEO
  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'description',
        content: 'A comprehensive guide to Physical AI and Humanoid Robotics, covering simulation, ROS 2, and real-world deployment.',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'keywords',
        content: 'humanoid robotics, physical ai, ros 2, simulation, reinforcement learning, isaac sim',
      },
    },
  ],

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.ts'),
          // Specify the sidebar ID if you have multiple sidebars
          // sidebar: 'mainSidebar',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.

        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.

          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Physical AI & Humanoid Robotics',
      logo: {
        alt: 'Physical AI & Humanoid Robotics Logo',
        src: 'img/logo.png',
      },
      hideOnScroll: false,
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'mainSidebar',
          position: 'left',
          label: 'Book',
        },
        { type: 'search', position: 'right' },
        {
          to: '/signin',
          label: 'Sign In',
          position: 'right',
          className: 'button button--secondary button--sm margin-right--sm',
        },
        {
          to: '/signup',
          label: 'Sign Up',
          position: 'right',
          className: 'button button--primary button--sm',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'LEARN',
          items: [
            {
              label: 'Start Your Journey',
              to: '/docs/intro',
            },
            {
              label: 'Full Curriculum',
              to: '/docs/module1/week1-2',
            },
            {
              label: 'Learning Path',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'COMMUNITY',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/',
            },
          ],
        },
        {
          title: 'RESOURCES',
          items: [
            {
              label: 'GitHub Repository',
              href: 'https://github.com/',
            },
            {
              label: 'Physical AI Specification',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'ABOUT',
          items: [
            {
              label: 'About This Course',
              to: '/docs/intro',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Physical AI & Humanoid Robotics • Free & Open Source`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
