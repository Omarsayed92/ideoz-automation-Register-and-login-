const { chromium } = require('playwright');

async function exploreLogin() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('Navigating to https://app-test.ideoz.ai/');
    await page.goto('https://app-test.ideoz.ai/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Take a screenshot
    await page.screenshot({ path: 'homepage.png' });
    console.log('Homepage screenshot saved');

    // Look for login button/link
    const loginButton = page.getByRole('button', { name: /login/i });
    const loginLink = page.getByRole('link', { name: /login/i });

    let loginElement = null;

    if (await loginButton.isVisible()) {
      console.log('Found login button');
      loginElement = loginButton;
    } else if (await loginLink.isVisible()) {
      console.log('Found login link');
      loginElement = loginLink;
    } else {
      console.log('Searching for login text...');
      loginElement = page.getByText('Login').first();
    }

    if (loginElement) {
      console.log('Clicking login element');
      await loginElement.click();

      // Wait for login form/modal
      await page.waitForTimeout(2000);

      // Take screenshot of login form
      await page.screenshot({ path: 'login-form.png' });
      console.log('Login form screenshot saved');

      // Analyze login form elements
      const emailInput = page.getByRole('textbox', { name: /email/i });
      const passwordInput = page.getByRole('textbox', { name: /password/i });
      const submitButton = page.getByRole('button', { name: /log in|login|sign in/i });

      console.log('Email input visible:', await emailInput.isVisible());
      console.log('Password input visible:', await passwordInput.isVisible());
      console.log('Submit button visible:', await submitButton.isVisible());

      // Check for social login options
      const googleLogin = page.getByText(/google/i);
      const facebookLogin = page.getByText(/facebook/i);

      console.log('Google login option:', await googleLogin.isVisible());
      console.log('Facebook login option:', await facebookLogin.isVisible());

    } else {
      console.log('No login element found');
    }

    // Keep browser open for 10 seconds to observe
    await page.waitForTimeout(10000);

  } catch (error) {
    console.error('Error during exploration:', error);
  } finally {
    await browser.close();
  }
}

exploreLogin();