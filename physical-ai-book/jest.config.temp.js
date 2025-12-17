/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\.(ts|tsx|js|jsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@theme/(.*)$': '<rootDir>/src/theme/$1',
    '^@docusaurus/(core|preset-classic|utils|module-type-aliases|tsconfig|types)$':
      '<rootDir>/node_modules/@docusaurus/$1',
    '^docusaurus$': '<rootDir>/node_modules/docusaurus',
    '^docusaurus/(.*)$': '<rootDir>/node_modules/docusaurus/$1',
    '\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  testMatch: ['<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}', '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/pages/**', // Docusaurus pages are not typically unit tested
    '!src/theme/**', // Docusaurus theme files are generally not unit tested
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(docusaurus|@docusaurus|remark-admonitions)/)',
  ],
};

module.exports = config;