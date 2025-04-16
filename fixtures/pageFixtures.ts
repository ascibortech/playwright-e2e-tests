import { test as authTest, expect } from './authenticatedFixtures';
import { LoginPage } from '../pages/LoginPage';
import { AccountPage } from '../pages/AccountPage';

// Define our fixture types
type PageFixtures = {
  loginPage: LoginPage;
  accountPage: AccountPage;
};

// Extend the authenticated test with page object fixtures
export const test = authTest.extend<PageFixtures>({
  // Create a LoginPage fixture
  loginPage: async ({ cookiesAccepted }, use) => {
    // Create a new LoginPage instance using the cookiesAccepted page
    const loginPage = new LoginPage(cookiesAccepted);
    
    // Use the loginPage in the test
    await use(loginPage);
  },

  // Create an AccountPage fixture using loggedInPage from authenticatedFixtures
  accountPage: async ({ loggedInPage }, use) => {
    // Create a new AccountPage instance using the loggedInPage
    const accountPage = new AccountPage(loggedInPage);
    
    // Use the accountPage in the test
    await use(accountPage);
  },
});

export { expect }; 