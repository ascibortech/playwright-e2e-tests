import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model for the Product page
 */
export class ProductPage extends BasePage {
  //locators
  private readonly productNameHeader;
  private readonly productPrice;
  private readonly addToCartButton;
  private readonly sizeOptions;

  /**
   * Create a new ProductPage instance
   * @param page Playwright page instance
   */
  constructor(page: Page) {
    super(page);

    //locators
    this.productNameHeader = page.locator('h1.product-name');
    this.productPrice = page.locator('.price-box .price');
    this.addToCartButton = page.getByRole('button', { name: 'Dodaj do koszyka' });
    this.sizeOptions = page.locator('.swatch-option.text');
  }

  /**
   * Verify the product name in mini cart matches the expected name
   * @param expectedProductName Expected product name
   */
  async verifyMiniCartProductName(expectedProductName: string): Promise<void> {
    const miniCartProductName = await this.getMiniCartProductName();
    expect(miniCartProductName).toContain(expectedProductName);
  }

  /**
   * Navigate to a specific product page
   * @param productUrl The URL of the product page
   */
  async navigateToProduct(productUrl: string): Promise<void> {
    await this.goto(productUrl);
    await this.waitForPageLoad();
  }

  /**
   * Wait for the page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
    
    try {
      const selectors = [
        'h1.product-name',
        '.product-info-main',
        '.product.media',
        '.product-options-wrapper'
      ];
      
      for (const selector of selectors) {
        const isVisible = await this.page.locator(selector).isVisible().catch(() => false);
        if (isVisible) {
          return;
        }
      }
    } catch {
      // Continue if error occurs
    }
  }

  /**
   * Get the product name from the page
   */
  async getProductName(): Promise<string | null> {
    return await this.productNameHeader.textContent();
  }

  /**
   * Get the product price from the page
   */
  async getProductPrice(): Promise<string> {
    const priceText = await this.productPrice.textContent();
    return priceText ? priceText.trim() : '';
  }

  /**
   * Select a product size
   * @param size The size to select (e.g., "M", "L", "XL")
   */
  async selectSize(size: string): Promise<void> {
    await this.page.getByRole('button', { name: size, exact: true }).click();
  }

  /**
   * Add the product to the cart
   */
  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  /**
   * Take a screenshot of the product page
   * @param name Screenshot name
   */
  async takeProductScreenshot(name: string): Promise<void> {
    await this.takeScreenshot(`product-${name}`);
  }

  /**
   * Verify product is in the mini cart
   * @param expectedProductName Expected product name
   */
  async verifyProductInMiniCart(expectedProductName: string): Promise<void> {
    await this.openMiniCart();
    
    const isVisible = await this.page.locator('.miniCart-body-Aqj, .block-minicart').isVisible();
    expect(isVisible).toBeTruthy();
    
    const productNameLocator = this.page.locator('.product-item-name, .miniCart-name-Aqj');
    await productNameLocator.waitFor({ state: 'visible', timeout: 5000 });
    const miniCartProductName = await productNameLocator.textContent();
    expect(miniCartProductName).toContain(expectedProductName);
  }
} 