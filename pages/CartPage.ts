import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model for the Cart page
 */
export class CartPage extends BasePage {
  // Cart related locators
  private readonly cartContentsLabel;
  private readonly cartTotalPrice;
  private readonly productItemsInCart;
  private readonly miniCartBody;

  /**
   * Create a new CartPage instance
   * @param page Playwright page instance
   */
  constructor(page: Page) {
    super(page);
    
    // Initialize cart related locators
    this.cartContentsLabel = page.getByText('Zawartość koszyka', { exact: false });
    this.cartTotalPrice = page.getByText('Razem', { exact: false });
    this.productItemsInCart = page.getByRole('listitem');
    this.miniCartBody = page.locator('.miniCart-body-Aqj, .block-minicart');
  }

  /**
   * Get the cart total price 
   */
  async getCartTotalPrice(): Promise<string> {
    const priceText = await this.cartTotalPrice.textContent();
    return priceText ? priceText.trim() : '';
  }

  /**
   * Verify the cart total matches the expected amount
   * @param expectedTotal Expected total price (e.g. "149,99 PLN")
   */
  async verifyCartTotal(expectedTotal: string): Promise<void> {
    const totalPrice = await this.getCartTotalPrice();
    expect(totalPrice).toContain(expectedTotal);
  }

  /**
   * Verify cart contents label shows the correct item count
   * @param expectedCount Expected number of items in cart
   */
  async verifyCartItemCount(expectedCount: number): Promise<void> {
    await expect(this.cartContentsLabel).toContainText(`(${expectedCount})`);
  }

  /**
   * Navigate to a specific product from the mini cart
   * @param productName Partial text of the product name to click
   */
  async navigateToProductFromMiniCart(productName: string): Promise<void> {
    await this.productItemsInCart.filter({ hasText: productName }).getByRole('button').click();
  }
  
  /**
   * Click on product with text in the mini cart
   * @param productText Text to identify the product in the cart
   */
  async clickOnProductWithText(productText: string): Promise<void> {
    await this.page.getByRole('listitem').filter({ hasText: productText }).getByRole('button').click();
  }

  /**
   * Wait for mini cart to be visible
   */
  async waitForMiniCartVisible(): Promise<void> {
    await expect(this.miniCartBody).toBeVisible();
  }

  /**
   * Take a screenshot of the mini cart
   * @param name Screenshot name suffix
   */
  async takeMiniCartScreenshot(name: string): Promise<void> {
    await this.takeScreenshot(`mini-cart-${name}`);
  }
} 