import { test as base, expect, Page } from '@playwright/test';

// Define our fixture types
type CookieFixtures = {
  cookiesAccepted: Page;
};

// Extend the base test with popup handling
export const test = base.extend<CookieFixtures>({
  cookiesAccepted: async ({ page }, use) => {
    // Block known popup resources to prevent them from loading
    await page.route('**/*popup*', route => route.abort());
    await page.route('**/nl/**', route => route.abort());
    await page.route('**/ftp/popup/**', route => route.abort());
    
    // Set cookies to prevent popups
    await page.context().addCookies([
      {
        name: 'CookieConsent',
        value: 'true',
        domain: '4f.com.pl',
        path: '/',
      },
      {
        name: 'newsletterPopupShown',
        value: 'true',
        domain: '4f.com.pl',
        path: '/',
      },
      {
        name: 'appDownloadPopupShown',
        value: 'true',
        domain: '4f.com.pl',
        path: '/',
      }
    ]);
    
    // Add a mutation observer script to automatically close popups
    await page.addInitScript(() => {
      window.addEventListener('DOMContentLoaded', () => {
        // Create a mutation observer to watch for popup elements
        const observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            if (mutation.type === 'childList') {
              // Check for and close cookie popup
              const cookieButton = document.querySelector('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll');
              if (cookieButton && cookieButton instanceof HTMLElement) {
                cookieButton.click();
              }
              
              // Check for and close app download popup
              const appCloseButton = document.querySelector('.app-mobile-download-close');
              if (appCloseButton && appCloseButton instanceof HTMLElement) {
                appCloseButton.click();
              }
              
              // Check for and close newsletter popup
              const newsletterCloseButton = document.querySelector('.closeWindow');
              if (newsletterCloseButton && newsletterCloseButton instanceof HTMLElement) {
                newsletterCloseButton.click();
              }
              
              // Check for and close any popup dialog
              const popupDialog = document.querySelector('.popup-dialog');
              if (popupDialog) {
                const closeButton = popupDialog.querySelector('button.closeWindow');
                if (closeButton && closeButton instanceof HTMLElement) {
                  closeButton.click();
                }
              }
            }
          }
        });
        
        // Start observing the document with the configured parameters
        observer.observe(document.body, { childList: true, subtree: true });
      });
    });
    
    // Add a helper method to the page to close popups on demand
    page.closePopups = async () => {
      const popupSelectors = [
        '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
        '.app-mobile-download-close',
        '.closeWindow',
        '.popup-dialog button.closeWindow'
      ];
      
      for (const selector of popupSelectors) {
        const element = page.locator(selector);
        if (await element.isVisible({ timeout: 500 }).catch(() => false)) {
          await element.click().catch(() => {});
        }
      }
    };
    
    // Close popups on navigation
    page.on('load', async () => {
      await page.closePopups().catch(() => {});
    });
    
    await use(page);
  },
});

// Add the closePopups method to the Page type
declare module '@playwright/test' {
  interface Page {
    closePopups(): Promise<void>;
  }
}

export { expect }; 