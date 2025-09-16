const { chromium } = require('playwright');

async function exploreFinal() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('Navigating to https://app-test.ideoz.ai/');
    await page.goto('https://app-test.ideoz.ai/');
    await page.waitForLoadState('networkidle');

    // Find the correct textarea with more flexible approach
    const chatTextarea = page.locator('textarea').first();
    console.log('Found textarea, clicking it...');
    await chatTextarea.click();

    // Wait a moment for any UI changes
    await page.waitForTimeout(2000);

    // Take screenshot after clicking
    await page.screenshot({ path: 'textarea-clicked.png' });

    // Look for all buttons near the textarea
    const allButtons = page.locator('button');
    const buttonCount = await allButtons.count();
    console.log(`Found ${buttonCount} buttons on page`);

    // Check each button for file upload functionality
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = allButtons.nth(i);
      try {
        const buttonText = await button.textContent();
        const ariaLabel = await button.getAttribute('aria-label');
        const title = await button.getAttribute('title');

        console.log(`Button ${i}: text="${buttonText}", aria-label="${ariaLabel}", title="${title}"`);

        // Check if button has file-related attributes
        if (buttonText?.includes('attach') ||
            ariaLabel?.includes('attach') ||
            ariaLabel?.includes('file') ||
            title?.includes('file')) {
          console.log(`Button ${i} seems to be file-related!`);

          await button.click();
          await page.waitForTimeout(2000);
          await page.screenshot({ path: `button-${i}-clicked.png` });

          // Check for file input after clicking
          const fileInput = page.locator('input[type="file"]');
          if (await fileInput.isVisible()) {
            console.log('File input appeared!');
          }
        }
      } catch (e) {
        // Skip buttons that cause errors
      }
    }

    // Look for any existing file input
    const fileInputs = page.locator('input[type="file"]');
    const fileInputCount = await fileInputs.count();
    console.log(`Found ${fileInputCount} file inputs`);

    if (fileInputCount > 0) {
      for (let i = 0; i < fileInputCount; i++) {
        const fileInput = fileInputs.nth(i);
        const accept = await fileInput.getAttribute('accept');
        const multiple = await fileInput.getAttribute('multiple');
        const style = await fileInput.getAttribute('style');

        console.log(`File input ${i}:`);
        console.log(`  - accept: ${accept}`);
        console.log(`  - multiple: ${multiple}`);
        console.log(`  - style: ${style}`);
      }
    }

    // Test drag and drop on the textarea
    console.log('Testing drag and drop on textarea...');

    // Simulate drag events
    await chatTextarea.dispatchEvent('dragenter');
    await page.waitForTimeout(500);

    await chatTextarea.dispatchEvent('dragover');
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'drag-events-simulated.png' });

    // Look for drop zone messages
    const dropMessages = page.getByText(/drop.*file/i);
    const dropMessageCount = await dropMessages.count();
    console.log(`Found ${dropMessageCount} potential drop messages`);

    if (dropMessageCount > 0) {
      for (let i = 0; i < dropMessageCount; i++) {
        const message = await dropMessages.nth(i).textContent();
        console.log(`Drop message ${i}: "${message}"`);
      }
    }

    console.log('Final exploration complete. Keeping browser open...');
    await page.waitForTimeout(15000);

  } catch (error) {
    console.error('Error during exploration:', error);
  } finally {
    await browser.close();
  }
}

exploreFinal();