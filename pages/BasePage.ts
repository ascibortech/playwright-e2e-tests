import { Page, expect } from '@playwright/test';

/**
 * Base class for all Page Object Models
 * Provides common functionality and enforces structure
 */
export class BasePage {
  /**
   * The Playwright page instance
   */
  readonly page: Page;
  
  // Cart related locators
  protected readonly cartIconCounter;
  protected readonly miniCartButton;
  protected readonly miniCartIcon;
  protected readonly miniCartCounter;
  protected readonly miniCartProductList;
  protected readonly miniCartProductName;
  protected readonly miniCartCloseButton;
  
  // Account related locators in top navigation
  protected readonly accountMenuButton;
  protected readonly logoutButton;

  /**
   * Creates a new BasePage instance
   * @param page Playwright page instance
   */
  constructor(page: Page) {
    this.page = page;
    
    // Initialize cart related locators
    this.cartIconCounter = page.locator('button[aria-label="Mini Cart"] .itemsCount-root-b6q span, .counter-number');
    this.miniCartButton = page.getByRole('button', { name: 'Mini Cart' });
    this.miniCartIcon = page.locator('.action.showcart');
    this.miniCartCounter = page.locator('.counter-number');
    this.miniCartProductList = page.locator('.minicart-items');
    this.miniCartProductName = page.locator('.product-item-name');
    this.miniCartCloseButton = page.locator('.miniCart-closeButton-D17');
    
    // Initialize account related locators
    this.accountMenuButton = page.getByRole('button', { name: 'Moje Konto' });
    this.logoutButton = page.getByRole('button', { name: 'Wyloguj się' });
  }

  /**
   * Navigate to a specific URL
   * @param path URL path to navigate to
   */
  async goto(path: string): Promise<void> {
    await this.page.goto(path, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
  }

  /**
   * Wait for navigation to complete
   * @param url URL to wait for
   * @param options Navigation options
   */
  async waitForUrl(url: string | RegExp, options = { timeout: 15000 }): Promise<void> {
    await this.page.waitForURL(url, options);
  }

  /**
   * Take a screenshot
   * @param name Screenshot name
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/${name}.png` });
  }
  
  /**
   * Open the account menu
   */
  async openAccountMenu(): Promise<void> {
    await this.accountMenuButton.click();
  }

  /**
   * Click the logout button
   */
  async clickLogout(): Promise<void> {
    await this.logoutButton.click();
  }
  
  /**
   * Wait for the cart counter to be visible after adding an item
   */
  async waitForCartUpdate(): Promise<void> {
    await this.cartIconCounter.waitFor({ state: 'visible' });
  }

  /**
   * Get the count displayed on the cart icon
   */
  async getCartIconCount(): Promise<number> {
    try {
      await this.cartIconCounter.waitFor({ state: 'visible', timeout: 3000 });
      const countText = await this.cartIconCounter.textContent();
      return countText ? parseInt(countText.trim(), 10) : 0;
    } catch {
      await this.miniCartButton.waitFor({ state: 'visible', timeout: 3000 });
      const buttonText = await this.miniCartButton.textContent();
      
      const match = buttonText?.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    }
  }

  /**
   * Verify the cart icon count is greater than zero or has increased
   * @param previousCount The previous count to compare with (optional)
   */
  async verifyCartIconCountIncreased(previousCount?: number): Promise<number> {
    await this.cartIconCounter.waitFor({ state: 'visible', timeout: 5000 });
    
    const currentCount = await this.getCartIconCount();
    
    if (previousCount !== undefined) {
      expect(currentCount).toBeGreaterThan(previousCount);
    } else {
      expect(currentCount).toBeGreaterThan(0);
    }
    
    return currentCount;
  }
  
  /**
   * Get the cart icon counter locator for assertions
   */
  getCartIconCounterLocator() {
    return this.cartIconCounter;
  }
  
  /**
   * Open the mini cart
   */
  async openMiniCart(): Promise<void> {
    await this.miniCartButton.click();
    
    try {
      await this.miniCartProductList.waitFor({ state: 'visible', timeout: 5000 });
    } catch {
      await this.page.waitForSelector('.minicart-items-wrapper, .miniCart-body-Aqj', { state: 'visible', timeout: 5000 })
        .catch(() => {});
    }
  }

  /**
   * Close the mini cart
   */
  async closeMiniCart(): Promise<void> {
    if (await this.miniCartCloseButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.miniCartCloseButton.click();
    }
  }

  /**
   * Get the number of items in the mini cart
   */
  async getMiniCartCount(): Promise<string | null> {
    return await this.miniCartCounter.textContent();
  }

  /**
   * Check if the mini cart is visible
   */
  async isMiniCartVisible(): Promise<boolean> {
    return await this.page.locator('.block-minicart').isVisible();
  }

  /**
   * Get the product name from the mini cart
   */
  async getMiniCartProductName(): Promise<string | null> {
    return await this.miniCartProductName.textContent();
  }
  
  /**
   * Verify the cart has items (counter is not zero)
   */
  async verifyCartHasItems(): Promise<void> {
    const cartCount = await this.getMiniCartCount();
    expect(cartCount).not.toBeNull();
    
    if (cartCount) {
      const count = parseInt(cartCount);
      expect(count).toBeGreaterThan(0);
    }
  }
} 