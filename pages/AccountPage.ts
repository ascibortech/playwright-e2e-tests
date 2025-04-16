import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model for the Account page
 */
export class AccountPage extends BasePage {
  //locators
  private readonly logoutConfirmationMessage;
  private readonly ordersLink;
  private readonly accountTitle;
  private readonly accountChip;

  /**
   * Create a new AccountPage instance
   * @param page Playwright page instance
   */
  constructor(page: Page) {
    super(page);

    //locators
    this.logoutConfirmationMessage = page.getByText('Wylogowałeś się i zostaniesz');
    this.ordersLink = page.locator('a[href*="/customer/account/orders"]');
    this.accountTitle = page.locator('.accountPage-accountTitle-FKy'); 
    this.accountChip = page.locator('.accountChip-buttonDescription-CfD');
  }

  //methods
  /**
   * Navigate to the account page
   */
  async navigateToAccountPage(): Promise<void> {
    await this.goto('/customer/account');
  }

  /**
   * Navigate to orders history page
   */
  async navigateToOrdersPage(): Promise<void> {
    await this.goto('/customer/account/orders');
  }

  /**
   * Logout from the account
   */
  async logout(): Promise<void> {
    await this.openAccountMenu();
    await this.clickLogout();
    
    // Verify logout confirmation is visible
    await expect(this.logoutConfirmationMessage).toBeVisible();
  }

  /**
   * Verify logout confirmation message is visible
   */
  async verifyLogoutConfirmation(): Promise<void> {
    await expect(this.logoutConfirmationMessage).toBeVisible();
  }

  /**
   * Check if user is logged in
   * @returns True if the user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    return !this.page.url().includes('/customer/account/login');
  }

  /**
   * Assert that the user is on the account page
   */
  async expectToBeOnAccountPage(): Promise<void> {
    await expect(this.page).toHaveURL(/^https?:\/\/[^\/]+\/customer\/account(\/)?$/);
  }

  /**
   * Assert that the user is on the orders page
   */
  async expectToBeOnOrdersPage(): Promise<void> {
    await expect(this.page).toHaveURL(/^https?:\/\/[^\/]+\/customer\/account\/orders(\/)?$/);
  }

  /**
   * Take a screenshot of the account page
   * @param name Screenshot name
   */
  async takeAccountScreenshot(name: string): Promise<void> {
    await this.takeScreenshot(`account-${name}`);
  }
} 