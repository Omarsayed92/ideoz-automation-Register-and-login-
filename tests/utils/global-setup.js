// Global setup for Playwright tests
const { chromium } = require('@playwright/test');

async function globalSetup(config) {
  console.log('🚀 Starting global setup...');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Warm up the application
    console.log('🌡️ Warming up application...');
    await page.goto(config.use.baseURL || 'https://app-test.ideoz.ai/');
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
    console.log(`  - Base URL: ${config.use.baseURL}`);
    console.log(`  - CI: ${process.env.CI || 'false'}`);
    console.log(`  - Node version: ${process.version}`);
    console.log(`  - Workers: ${config.workers}`);
    console.log(`  - Retries: ${config.retries}`);

    console.log('✅ Global setup completed successfully');

  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

module.exports = globalSetup;