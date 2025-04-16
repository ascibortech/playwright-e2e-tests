import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model for the Login page
 */
export class LoginPage extends BasePage {
  //locators
  private readonly emailInput;
  private readonly passwordInput;
  private readonly loginButton;
  private readonly errorMessage;

  /**
   * Create a new LoginPage instance
   * @param page Playwright page instance
   */
  constructor(page: Page) {
    super(page);

    //locators
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]:has-text("Zaloguj")');
    this.errorMessage = page.locator('.errorMessage-errorMessage-4tj');
  }

  //methods
  /**
   * Navigate to the login page
   */
  async navigateToLoginPage(): Promise<void> {
    await this.goto('/customer/account/login');
  }

  /**
   * Fill the login form
   * @param email Email address
   * @param password Password
   */
  async fillLoginForm(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  /**
   * Submit the login form
   */
  async submitLoginForm(): Promise<void> {
    await this.loginButton.click();
  }

  /**
   * Login with the provided credentials
   * @param email Email address
   * @param password Password
   */
  async login(email: string, password: string): Promise<void> {
    await this.navigateToLoginPage();
    await this.fillLoginForm(email, password);
    await this.submitLoginForm();
  }

  /**
   * Check if there is an error message displayed
   * @returns True if an error message is displayed
   */
  async hasErrorMessage(): Promise<boolean> {
    return await this.errorMessage.isVisible().catch(() => false);
  }

  /**
   * Get the error message text
   * @returns The error message text
   */
  async getErrorMessage(): Promise<string | null> {
    if (await this.hasErrorMessage()) {
      return await this.errorMessage.textContent();
    }
    return null;
  }

  /**
   * Assert that the login was successful
   * Verifies redirection to account page
   */
  async expectSuccessfulLogin(): Promise<void> {
    // Verify no error message is displayed
    const hasError = await this.hasErrorMessage();
    expect(hasError).toBeFalsy();

    // Verify we're redirected to the account page
    await this.waitForUrl('https://4f.com.pl/customer/account');
  }

  /**
   * Assert that the login failed with an error
   * @param expectedErrorText Optional expected error text
   */
  async expectFailedLogin(expectedErrorText?: string): Promise<void> {
    // Verify error message is displayed
    await expect(this.errorMessage).toBeVisible({ timeout: 15000 });

    // If an expected error message is provided, verify it
    if (expectedErrorText) {
      await expect(this.errorMessage).toContainText(expectedErrorText);
    }
  }
} 