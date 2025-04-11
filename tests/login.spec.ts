import { test, expect } from '@playwright/test';

test.describe('Login functionality', () => {
  // Increase the test timeout significantly for CI environments
  test.setTimeout(process.env.CI ? 180000 : 120000);
  
  test('should show error message with invalid credentials', async ({ page }) => {
    // Given user navigates to the login page with retry mechanism
    let retryCount = 3;
    let success = false;
    
    while (retryCount > 0 && !success) {
      try {
        await page.goto('https://4f.com.pl/customer/account/login', { 
          waitUntil: 'domcontentloaded',
          timeout: 60000 
        });
        success = true;
      } catch (error) {
        console.log(`Navigation attempt failed. Retries left: ${retryCount-1}`);
        retryCount--;
        if (retryCount === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
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
    
    // When user enters invalid credentials
    await page.locator('input[name="email"]').fill('testtesttestttest@niepodam.pl');
    await page.locator('input[name="password"]').fill('21e12e12e12e12');
    
    // And clicks the login button
    await page.locator('button[type="submit"]:has-text("Zaloguj")').click();
    
    // Then an error message should be displayed
    const errorMessage = page.locator('.errorMessage-errorMessage-4tj');
    await expect(errorMessage).toBeVisible({ timeout: 15000 });
    
    // And the error message should contain expected text
    await expect(errorMessage).toHaveText(new RegExp('Podany e-mail lub hasło są niepoprawne|Konto zostało czasowo zablokowane z powodu wielokrotnego nieprawidłowego logowania'));
    
    // And a screenshot is taken for verification
    await page.screenshot({ path: `test-results/login-error.png` });
  });
});
