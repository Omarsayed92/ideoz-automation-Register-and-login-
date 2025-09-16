// Global setup for Playwright tests
const { chromium } = require('@playwright/test');

async function globalSetup(config) {
  console.log('🚀 Starting global setup...');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Warm up the application
    console.log('🌡️ Warming up application...');
    const baseURL = config.use?.baseURL || 'https://app-test.ideoz.ai/';
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');

    // Check if application is accessible
    const title = await page.title();
    console.log(`📄 Application title: ${title}`);

    // Create test data directories
    const fs = require('fs');
    const directories = [
      'test-results',
      'playwright-report',
      'screenshots',
      'videos',
      'traces'
    ];

    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      }
    });

    // Log environment information
    console.log('🌍 Environment Information:');
    console.log(`  - Base URL: ${baseURL}`);
    console.log(`  - CI: ${process.env.CI || 'false'}`);
    console.log(`  - Node version: ${process.version}`);
    console.log(`  - Workers: ${config.workers || 'undefined'}`);
    console.log(`  - Retries: ${config.retries || 0}`);

    console.log('✅ Global setup completed successfully');

  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

module.exports = globalSetup;