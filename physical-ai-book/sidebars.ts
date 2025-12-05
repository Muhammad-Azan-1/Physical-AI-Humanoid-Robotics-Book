import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  mainSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Module 1: Foundations',
      link: { type: 'generated-index', slug: '/modules/foundations' },
      items: ['module1/module1-week1-chapter1'],
    },
    {
      type: 'category',
      label: 'Module 2: ROS 2 for Humanoids',
      link: { type: 'generated-index', slug: '/modules/ros2' },
      items: ['module2/module2-week1-chapter1'],
    },
    {
      type: 'category',
      label: 'Module 3: Simulation & Reinforcement Learning',
      link: { type: 'generated-index', slug: '/modules/simulation' },
      items: ['module3/module3-week1-chapter1'],
    },
    {
      type: 'category',
      label: 'Module 4: Real-World Deployment & Ethical AI',
      link: { type: 'generated-index', slug: '/modules/isaac-ai' },
      items: ['module4/module4-week1-chapter1'],
    },
  ],



  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

export default sidebars;
