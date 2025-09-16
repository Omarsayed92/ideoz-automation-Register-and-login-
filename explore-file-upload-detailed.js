const { chromium } = require('playwright');

async function exploreFileUploadDetailed() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('Navigating to https://app-test.ideoz.ai/');
    await page.goto('https://app-test.ideoz.ai/');
    await page.waitForLoadState('networkidle');

    // Click on the textarea to activate chat
    const chatTextarea = page.getByPlaceholder('Describe your user experience challenge ...');
    await chatTextarea.click();
    console.log('Chat textarea activated');

    // Look for file upload icons/buttons near the chat area
    const plusIcon = page.locator('button').filter({ has: page.locator('svg') }).first();
    const sendIcon = page.locator('button').filter({ has: page.locator('svg') }).last();

    console.log('Looking for file upload functionality...');

    // Try clicking the plus icon if it exists
    if (await plusIcon.isVisible()) {
      console.log('Clicking plus icon...');
      await plusIcon.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'after-plus-click.png' });
    }

    // Look for file input after clicking
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.isVisible()) {
      console.log('File input found!');

      // Get attributes of file input
      const accept = await fileInput.getAttribute('accept');
      const multiple = await fileInput.getAttribute('multiple');

      console.log(`File input accept attribute: ${accept}`);
      console.log(`File input multiple attribute: ${multiple}`);
    }

    // Check for drag and drop zone
    const dragZone = page.locator('[data-testid*="drop"], [data-drop], .drop-zone, [ondrop]');
    if (await dragZone.count() > 0) {
      console.log('Drag and drop zone found!');
    }

    // Test drag and drop simulation
    console.log('Testing drag and drop simulation...');

    // Create a test element to simulate drag from
    await page.evaluate(() => {
      const testDiv = document.createElement('div');
      testDiv.id = 'test-drag-element';
      testDiv.style.position = 'absolute';
      testDiv.style.top = '10px';
      testDiv.style.left = '10px';
      testDiv.style.width = '50px';
      testDiv.style.height = '50px';
      testDiv.style.backgroundColor = 'red';
      testDiv.setAttribute('draggable', 'true');
      document.body.appendChild(testDiv);
    });

    // Try drag and drop on chat area
    const chatArea = page.locator('textarea, .chat-input, [data-testid*="chat"]').first();

    if (await chatArea.isVisible()) {
      console.log('Simulating drag over chat area...');

      // Simulate dragenter event
      await chatArea.dispatchEvent('dragenter', {
        dataTransfer: {
          files: [{ name: 'test.txt', type: 'text/plain' }]
        }
      });

      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'drag-simulation.png' });

      // Check for drop message
      const dropMessage = page.getByText(/drop files here/i);
      if (await dropMessage.isVisible()) {
        console.log('Drop message appeared!');
      }
    }

    // Look for any modal or popup that might contain file upload
    const modal = page.locator('[role="dialog"], .modal, .popup');
    if (await modal.isVisible()) {
      console.log('Modal/popup detected');
      await page.screenshot({ path: 'modal-detected.png' });
    }

    console.log('Keeping browser open for manual observation...');
    await page.waitForTimeout(10000);

  } catch (error) {
    console.error('Error during detailed exploration:', error);
  } finally {
    await browser.close();
  }
}

exploreFileUploadDetailed();