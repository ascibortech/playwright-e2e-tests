import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Login functionality', () => {
  // Increase the test timeout significantly for CI environments
  test.setTimeout(process.env.CI ? 180000 : 120000);
  
  test('Given user with invalid credentials, when they attempt to login, then error message is displayed', async ({ page }) => {
    // Given user navigates to the login page
    try {
      await page.goto('https://4f.com.pl/customer/account/login', { 
        waitUntil: 'domcontentloaded',
        timeout: 60000 
      });
    } catch (error) {
      console.log('Navigation failed after retries:', error);
      throw error;
    }
    
    // And cookie dialog is handled
    try {
      await page.waitForSelector('#CybotCookiebotDialog[style*="display: flex"]', { timeout: 10000 });
      const cookieAccept = page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll');
      if (await cookieAccept.isVisible({ timeout: 5000 }))
        await cookieAccept.click();
    } catch {
      // Silently handle any errors with cookie dialog
      console.log('Cookie dialog not found or could not be interacted with');
    }
    
    // When user enters invalid credentials with random email
    const randomEmail = faker.internet.email();
    await page.locator('input[name="email"]').fill(randomEmail);
    await page.locator('input[name="password"]').fill('21e12e12e12e12');
    
    // And clicks the login button
    await page.locator('button[type="submit"]:has-text("Zaloguj")').click();
    
    // Then an error message should be displayed
    const errorMessage = page.locator('.errorMessage-errorMessage-4tj');
    await expect(errorMessage).toBeVisible({ timeout: 15000 });
    
    // And the error message should specifically indicate incorrect credentials
    await expect(errorMessage).toContainText('Podany e-mail lub hasło są niepoprawne');
    
    // And a screenshot is taken for verification
    const safeEmail = randomEmail.replace(/[@.]/g, '_');
    await page.screenshot({ path: `test-results/login-error-${safeEmail}.png` });
  });
});
