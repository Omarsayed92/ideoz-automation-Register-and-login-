// @ts-check
const { expect } = require('@playwright/test');

class LoginPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        // Main login elements
        this.loginButton = page.getByRole('button', { name: 'Login' }).first();
        this.emailInput = page.getByPlaceholder('Enter your email');
        this.passwordInput = page.getByPlaceholder('Enter your password');
        this.submitButton = page.getByRole('button', { name: 'Login', exact: true });
        this.googleLoginButton = page.getByRole('button', { name: 'Login with Google' });
        this.signUpLink = page.getByText('Sign up');

        // Form and modal elements
        this.loginModal = page.locator('[role="dialog"]');
        this.loginForm = page.locator('form');
        this.passwordToggle = page.locator('button').filter({ has: page.locator('svg') }).last();

        // Error and validation elements
        this.errorMessage = page.locator('[role="alert"], .error-message, .alert-error');
        this.validationErrors = page.locator('text="Field is required"');
        this.emailValidationError = page.locator('text=/invalid email|enter a valid email/i');

        // Navigation elements
        this.homeLink = page.getByRole('link', { name: 'ideoz.' });
        this.registerButton = page.getByRole('button', { name: 'Register for free' });
    }

    async goto() {
        await this.page.goto('https://app-test.ideoz.ai/');
    }

    async clickLoginButton() {
        await this.loginButton.click();
    }

    async fillLoginForm({ email, password }) {
        if (email !== undefined) {
            await this.emailInput.fill(email);
        }
        if (password !== undefined) {
            await this.passwordInput.fill(password);
        }
    }

    async submitLogin() {
        await this.submitButton.click();
    }

    async login({ email, password }) {
        await this.fillLoginForm({ email, password });
        await this.submitLogin();
    }

    async clickGoogleLogin() {
        await this.googleLoginButton.click();
    }

    async clickSignUp() {
        await this.signUpLink.click();
    }

    async togglePasswordVisibility() {
        await this.passwordToggle.click();
    }

    async clearFields() {
        await this.emailInput.clear();
        await this.passwordInput.clear();
    }

    async isLoginModalVisible() {
        return this.loginModal.isVisible();
    }

    async isLoginFormVisible() {
        return this.loginForm.isVisible();
    }

    async getEmailValue() {
        return this.emailInput.inputValue();
    }

    async getPasswordValue() {
        return this.passwordInput.inputValue();
    }

    async isPasswordVisible() {
        const type = await this.passwordInput.getAttribute('type');
        return type === 'text';
    }

    async waitForLoginSuccess() {
        // Wait for navigation or URL change indicating successful login
        await this.page.waitForURL(/dashboard|app|home/, { timeout: 10000 });
    }

    async getErrorMessage() {
        return this.errorMessage.textContent();
    }

    async hasValidationErrors() {
        return this.validationErrors.isVisible();
    }

    async getEmailValidationMessage() {
        const emailField = this.emailInput;
        return emailField.evaluate(el => el.validationMessage);
    }

    async checkLoginState() {
        await this.page.waitForTimeout(2000);
        const isModalVisible = await this.isLoginModalVisible();
        const currentUrl = this.page.url();
        return {
            modalVisible: isModalVisible,
            url: currentUrl,
            loggedIn: currentUrl.includes('dashboard') || currentUrl.includes('app') || !isModalVisible
        };
    }

    // Accessibility helpers

    async testKeyboardSubmission() {
        // Test that form can be submitted via Enter key
        await this.emailInput.focus();
        await this.page.keyboard.press('Enter');
    }

    // Security helpers
    async checkPasswordFieldSecurity() {
        // Ensure password field is properly secured
        const type = await this.passwordInput.getAttribute('type');
        const autocomplete = await this.passwordInput.getAttribute('autocomplete');
        return {
            isPasswordType: type === 'password',
            hasAutocomplete: autocomplete !== null
        };
    }

    // Performance helpers
    async measureLoginSpeed() {
        const startTime = Date.now();
        await this.submitButton.click();
        await this.page.waitForLoadState('networkidle');
        return Date.now() - startTime;
    }
}

module.exports = { LoginPage };