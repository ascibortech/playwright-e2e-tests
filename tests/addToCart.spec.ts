import { test, expect } from '../fixtures/cookieFixtures';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import productData from '../testData/products.json';

test.describe('Shopping cart functionality', () => {
  test.setTimeout(process.env.CI ? 180000 : 120000);
  
  test('Given user views a product, when adding to cart, then item should appear on mini cart and count should increase', async ({ cookiesAccepted: page }) => {
    //Given
    const productPage = new ProductPage(page);
    const product = productData.trainingShirt;
    
    //When
    await productPage.navigateToProduct(product.url);
    await productPage.waitForPageLoad();
    await page.closePopups();
    
    //And
    let initialCartCount = 0;
    try {
      await page.closePopups();
      initialCartCount = await productPage.getCartIconCount();
    } catch {
      // Assuming 0 if count can't be retrieved
    }
    
    //And
    await productPage.selectSize(product.size);
    
    //And
    await productPage.addToCart();
    
    //Then
    await productPage.waitForCartUpdate();
    
    //And
    await productPage.closeMiniCart();
    
    //And
    await expect(productPage.getCartIconCounterLocator()).toBeVisible();
    await productPage.verifyCartIconCountIncreased(initialCartCount);
    
    //And
    await productPage.takeProductScreenshot('cart-icon-updated');
    
    //And
    await productPage.takeProductScreenshot('product-added-to-cart');
  });
  
  test('Given user adds products to cart, then cart total should be updated correctly', async ({ cookiesAccepted: page }) => {
    //Given
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const product = productData.trainingShirt;
    //When
    await productPage.navigateToProduct(product.url);
    await productPage.waitForPageLoad();
    
    await page.closePopups();
    
    //And
    await productPage.selectSize('L');
    
    //And
    await productPage.addToCart();
    
    //Then
    await expect(page.getByText('Zawartość koszyka (1)')).toBeVisible();
    
    //And
    await expect(page.getByText('Razem149,99 PLN')).toBeVisible();
    
    //When
    await cartPage.clickOnProductWithText('Spodenki treningowe');
    
    //And
    await productPage.selectSize('L');
    
    //And
    await productPage.addToCart();
    await expect(page.getByText('Razem299,98 PLN')).toBeVisible();
    
    //And
    await cartPage.takeMiniCartScreenshot('two-products');
  });
}); 

