// @ts-check
const { expect } = require('@playwright/test');

class RegistrationPage {
    /**
     * @param {import('@playwright/test').Page} page 
     */
    constructor(page) {
        this.page = page;

        // Locators using role-based and test-id selectors based on actual DOM
        this.registerButton = page.getByRole('button', { name: 'Register for free' });
        this.nameInput = page.getByPlaceholder('Enter your first and last name');
        this.emailInput = page.getByPlaceholder('Enter your email');
        this.passwordInput = page.locator('input[type="password"]');
        this.submitButton = page.getByRole('button', { name: 'Create account', exact: true });
        this.errorMessage = page.locator('text="Field is required"').first();
        this.validationErrors = page.locator('text="Field is required"');
        this.emailValidationTooltip = page.locator('[role="tooltip"], .tooltip');
        this.passwordStrengthText = page.locator('text=/password should include.*character/i');
        this.privacyPolicyLink = page.getByRole('link', { name: 'privacy policy' });
        this.registrationForm = page.locator('form');
        this.loginLink = page.getByRole('link', { name: 'Log in' });
        this.googleSignUpButton = page.getByRole('button', { name: 'Create account with Google' });
    }

    async goto() {
        await this.page.goto('https://app-test.ideoz.ai/');
    }

    async clickRegisterButton() {
        await this.registerButton.click();
    }

    async fillRegistrationForm({
        name,
        email,
        password
    }) {
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
    }

    async submitForm() {
        await this.submitButton.click();
    }

    async getErrorMessage() {
        return this.errorMessage.textContent();
    }

    async navigateToLogin() {
        await this.loginLink.click();
    }

    async clickGoogleSignUp() {
        await this.googleSignUpButton.click();
    }

    async isFormVisible() {
        return this.registrationForm.isVisible();
    }

    async clearAllFields() {
        await this.nameInput.clear();
        await this.emailInput.clear();
        await this.passwordInput.clear();
    }

    async getFieldValue(field) {
        return field.inputValue();
    }

    async isFieldEmpty(field) {
        const value = await field.inputValue();
        return value === '';
    }

    async waitForFormToDisappear(timeout = 5000) {
        try {
            await this.registrationForm.waitFor({ state: 'hidden', timeout });
            return true;
        } catch {
            return false;
        }
    }

    async checkFormSubmissionState() {
        await this.page.waitForTimeout(2000);
        const isFormVisible = await this.registrationForm.isVisible();
        const currentUrl = this.page.url();
        return {
            formVisible: isFormVisible,
            url: currentUrl,
            redirected: !currentUrl.includes('app-test.ideoz.ai') || currentUrl.includes('dashboard')
        };
    }
}

module.exports = { RegistrationPage };