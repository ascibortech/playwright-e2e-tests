import { test } from '../fixtures/cookieFixtures';
import { faker } from '@faker-js/faker';
import { LoginPage } from '../pages/LoginPage';
import { AccountPage } from '../pages/AccountPage';

// Get credentials from environment variables or use placeholder values for CI error messages
const USER_EMAIL = process.env.USER_EMAIL || 'missing-email-env-variable';
const USER_PASSWORD = process.env.USER_PASSWORD || 'missing-password-env-variable';

test.describe('Login functionality', () => {
  test.setTimeout(process.env.CI ? 180000 : 120000);
  
  // Skip tests that require valid credentials if they're not available
  const skipCredentialTests = !process.env.USER_EMAIL || !process.env.USER_PASSWORD;
  
  test('Given user with invalid credentials, when they attempt to login, then error message is displayed', async ({ cookiesAccepted: page }) => {
    //Given
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    
    //When
    const randomEmail = faker.internet.email();
    await loginPage.fillLoginForm(randomEmail, '21e12e12e12e12');
    
    //And
    await loginPage.submitLoginForm();
    
    //Then
    await loginPage.expectFailedLogin('Podany e-mail lub hasło są niepoprawne');
    
    //And
    const safeEmail = randomEmail.replace(/[@.]/g, '_');
    await loginPage.takeScreenshot(`login-error-${safeEmail}`);
  });

  test('Given user repeatedly using same invalid credentials, when login attempts exceed limit (20), then account should be temporarily locked', async ({ cookiesAccepted: page }) => {
    //Given
    const loginPage = new LoginPage(page);
    const sameEmail = faker.internet.email();
    const samePassword = 'incorrect-password123';
    
    //When
    const maxAttempts = 20;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`Attempt ${attempt} of ${maxAttempts}`);
      
      //And
      await loginPage.navigateToLoginPage();
      
      //And
      await loginPage.fillLoginForm(sameEmail, samePassword);
      
      //And
      await loginPage.submitLoginForm();
      
      //And
      try {
        await loginPage.hasErrorMessage();
      } catch (error) {
        console.log(`Error waiting for error message on attempt ${attempt}:`, error);
      }
    }
    
    //Then
    await loginPage.expectFailedLogin('Konto zostało czasowo zablokowane z powodu wielokrotnego nieprawidłowego logowania');
    
    //And
    const messageText = await loginPage.getErrorMessage();
    console.log('Final error message:', messageText);
    
    //And
    await loginPage.takeScreenshot('login-account-lockout');
  });

  test('Given user with valid credentials, when they login, then they should be redirected to account page', async ({ cookiesAccepted: page }) => {
    /* eslint-disable-next-line playwright/no-skipped-test */
    test.skip(skipCredentialTests, 'Test skipped because USER_EMAIL or USER_PASSWORD environment variables are not set');
    
    //Given
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    
    //When
    await loginPage.login(USER_EMAIL, USER_PASSWORD);
    
    //Then
    await loginPage.expectSuccessfulLogin();
    
    //And
    await loginPage.takeScreenshot('login-successful');
  });

  test('Given user is logged in, when using direct selector logout sequence, then logout confirmation should be displayed', async ({ cookiesAccepted: page }) => {
    /* eslint-disable-next-line playwright/no-skipped-test */
    test.skip(skipCredentialTests, 'Test skipped because USER_EMAIL or USER_PASSWORD environment variables are not set');
    
    //Given
    const loginPage = new LoginPage(page);
    const accountPage = new AccountPage(page);
    
    //And
    await loginPage.login(USER_EMAIL, USER_PASSWORD);
    
    //When
    await accountPage.openAccountMenu();
    
    //And
    await accountPage.clickLogout();
    
    //Then
    await accountPage.verifyLogoutConfirmation();
    
    //And
    await accountPage.takeAccountScreenshot('logout-direct-selectors');
  });
});
