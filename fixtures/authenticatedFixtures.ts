import { test as cookieTest, expect } from './cookieFixtures';
import { Page } from '@playwright/test';

// Get credentials from environment variables
const USER_EMAIL = process.env.USER_EMAIL || 'missing-email-env-variable';
const USER_PASSWORD = process.env.USER_PASSWORD || 'missing-password-env-variable';

// Storage state for authenticated session (worker-scoped)
let authStorageState: any | undefined;

// Check if credentials are available
const hasCredentials = !!process.env.USER_EMAIL && !!process.env.USER_PASSWORD;

// Define our fixture types
type AuthFixtures = {
  loggedInState: any;
  loggedInPage: Page;
};

// Extend the cookieTest with authenticated page
export const test = cookieTest.extend<AuthFixtures>({
  // Create a worker-scoped fixture for authentication
  // This will only run once per worker process
  loggedInState: [async ({ browser }, use) => {
    if (!hasCredentials) {
      console.log('Skipping authentication setup - credentials not found');
      await use(undefined);
      return;
    }

    // Re-use auth state if already exists
    if (authStorageState) {
      await use(authStorageState);
      return;
    }

    console.log('Setting up authentication state - logging in');
    
    // Create a new context with a clean session
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      // Handle cookie consent
      await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
      try {
        await page.waitForSelector('#CybotCookiebotDialog[style*="display: flex"]', { timeout: 10000 });
        const cookieAccept = page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll');
        if (await cookieAccept.isVisible({ timeout: 5000 })) {
          await cookieAccept.click();
          await page.waitForSelector('#CybotCookiebotDialog[style*="display: none"]', { timeout: 5000 }).catch(() => {});
        }
      } catch (error) {
        console.log('Cookie dialog not found or could not be interacted with:', error);
      }
      
      // Navigate to login page
      await page.goto('/customer/account/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
      
      // Fill login form
      await page.locator('input[name="email"]').fill(USER_EMAIL);
      await page.locator('input[name="password"]').fill(USER_PASSWORD);
      
      // Submit form
      await page.locator('button[type="submit"]:has-text("Zaloguj")').click();
      
      // Wait for successful login
      await page.waitForURL('https://4f.com.pl/customer/account', { timeout: 15000 });
      
      // Store authentication state 
      authStorageState = await context.storageState();
      
      console.log('Authentication state successfully created');
    } catch (error) {
      console.error('Failed to set up authentication:', error);
    } finally {
      await page.close();
      await context.close();
    }
    
    await use(authStorageState);
  }, { scope: 'worker' }],
  
  // Fixture that provides a logged in page for each test
  loggedInPage: async ({ cookiesAccepted, browser, loggedInState }, use) => {
    if (!hasCredentials || !loggedInState) {
      console.log('No credentials or auth state available - using non-authenticated page');
      await use(cookiesAccepted);
      return;
    }
    
    // Create a new context with the saved storage state
    const context = await browser.newContext({ storageState: loggedInState });
    const loggedInPage = await context.newPage();
    
    // Navigate to account page to verify login state
    await loggedInPage.goto('/customer/account', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Verify we're still on the account page (not redirected to login)
    if (!loggedInPage.url().includes('/customer/account')) {
      console.warn('Login state might have expired - user appears to not be logged in');
    } else {
      console.log('User is authenticated and ready for testing');
    }
    
    // Use the logged in page in the test
    await use(loggedInPage);
    
    // Clean up
    await loggedInPage.close();
    await context.close();
  }
});

export { expect }; 