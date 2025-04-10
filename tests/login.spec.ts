import { test, expect } from '@playwright/test';

test.describe('Login functionality', () => {
  test('should show error message with invalid credentials', async ({ page }) => {
    // Given user navigates to the login page
    await page.goto('https://4f.com.pl/customer/account/login');
    
    // And cookie dialog is handled
    await page.waitForSelector('#CybotCookiebotDialog[style*="display: flex"]');
    try {
      const cookieAccept = page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll');
      if (await cookieAccept.isVisible())
        await cookieAccept.click();
    } catch {
      // Silently handle any errors with cookie dialog
    }
    
    // When user enters invalid credentials
    await page.locator('input[name="email"]').fill('testtesttestttest@niepodam.pl');
    await page.locator('input[name="password"]').fill('21e12e12e12e12');
    
    // And clicks the login button
    await page.locator('button[type="submit"]:has-text("Zaloguj")').click();
    
    // Then an error message should be displayed
    const errorMessage = page.locator('.errorMessage-errorMessage-4tj');
    await expect(errorMessage).toBeVisible();
    
    // And the error message should contain expected text
    await expect(errorMessage).toHaveText(new RegExp('Podany e-mail lub hasło są niepoprawne|Konto zostało czasowo zablokowane z powodu wielokrotnego nieprawidłowego logowania'));
    
    // And a screenshot is taken for verification
    await page.screenshot({ path: 'test-results/login-error.png' });
  });
});
