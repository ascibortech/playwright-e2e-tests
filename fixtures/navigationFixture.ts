import { Page } from '@playwright/test';

/**
 * Navigates to a specific path with proper error handling
 */
export async function navigateTo(page: Page, path: string): Promise<void> {
  try {
    await page.goto(path, {
      waitUntil: 'domcontentloaded', 
      timeout: 60000
    });
  } catch (error) {
    console.log(`Navigation to ${path} failed:`, error);
    throw error;
  }
} 