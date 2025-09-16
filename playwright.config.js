// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests/test',
  timeout: 60 * 1000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  // Enhanced reporting for CI/CD
  reporter: [
    ['html', {
      outputFolder: 'playwright-report',
      open: 'never'
    }],
    ['junit', {
      outputFile: 'test-results/junit-report.xml'
    }],
    ['json', {
      outputFile: 'test-results/test-results.json'
    }],
    ['list'],
    process.env.CI ? ['github'] : ['line']
  ],

  use: {
    baseURL: process.env.BASE_URL || 'https://app-test.ideoz.ai/',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Enhanced CI settings
    actionTimeout: 15000,
    navigationTimeout: 30000,

    // Browser context options
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,

    // Performance monitoring
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
    },
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome'
      },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge'
      },
    },
  ],

  outputDir: 'test-results/',

  // Global setup and teardown
  globalSetup: require.resolve('./tests/utils/global-setup.js'),
  globalTeardown: require.resolve('./tests/utils/global-teardown.js'),

  // Test metadata
  metadata: {
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'test',
    build: process.env.GITHUB_SHA || 'local',
  },
});