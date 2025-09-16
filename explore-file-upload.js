const { chromium } = require('playwright');

async function exploreFileUpload() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('Navigating to https://app-test.ideoz.ai/');
    await page.goto('https://app-test.ideoz.ai/');
    await page.waitForLoadState('networkidle');

    // Take initial screenshot
    await page.screenshot({ path: 'home-page.png' });
    console.log('Home page screenshot saved');

    // Look for chat elements or file upload areas
    const chatInput = page.locator('textarea, input[type="text"]').first();
    const fileInputs = page.locator('input[type="file"]');
    const dropZones = page.locator('[data-testid*="drop"], [class*="drop"], [class*="upload"]');

    console.log('Checking for chat input...');
    if (await chatInput.isVisible()) {
      console.log('Chat input found');
      await chatInput.screenshot({ path: 'chat-input.png' });
    }

    console.log('Checking for file inputs...');
    const fileInputCount = await fileInputs.count();
    console.log(`Found ${fileInputCount} file inputs`);

    console.log('Checking for drop zones...');
    const dropZoneCount = await dropZones.count();
    console.log(`Found ${dropZoneCount} potential drop zones`);

    // Look for file upload buttons or icons
    const uploadButtons = page.getByRole('button', { name: /upload|attach|file/i });
    const uploadIcons = page.locator('svg, i, span').filter({ hasText: /upload|attach|file|clip/i });

    console.log('Checking for upload buttons...');
    const uploadButtonCount = await uploadButtons.count();
    console.log(`Found ${uploadButtonCount} upload buttons`);

    console.log('Checking for upload icons...');
    const uploadIconCount = await uploadIcons.count();
    console.log(`Found ${uploadIconCount} upload icons`);

    // Try to interact with chat area
    if (await chatInput.isVisible()) {
      console.log('Clicking on chat input...');
      await chatInput.click();
      await page.waitForTimeout(1000);

      // Take screenshot after clicking
      await page.screenshot({ path: 'chat-active.png' });
      console.log('Chat active screenshot saved');
    }

    // Look for any file upload elements that appear after interaction
    await page.waitForTimeout(2000);

    // Check for drag and drop functionality
    const allElements = page.locator('*');

    // Look for elements with drag/drop attributes
    const dragDropElements = page.locator('[ondrop], [ondragover], [ondragleave], [data-drop]');
    const dragDropCount = await dragDropElements.count();
    console.log(`Found ${dragDropCount} elements with drag/drop attributes`);

    // Final screenshot
    await page.screenshot({ path: 'final-exploration.png' });
    console.log('Final exploration screenshot saved');

    // Keep browser open for manual observation
    console.log('Keeping browser open for 15 seconds for manual observation...');
    await page.waitForTimeout(15000);

  } catch (error) {
    console.error('Error during exploration:', error);
  } finally {
    await browser.close();
  }
}

exploreFileUpload();