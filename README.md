# playwright-e2e-tests
End-to-end testing framework for 4F.com.pl using Playwright and TypeScript

## Setup

### Prerequisites
- Node.js 18 or higher
- npm

### Installation
```bash
npm install
npx playwright install firefox webkit --with-deps
```

### Environment Configuration
For tests that require user credentials (such as login/logout tests), you need to set up environment variables:

1. Create a `local.env` file in the project root by copying the sample.env file:
   ```bash
   cp sample.env local.env
   ```

2. Edit the `local.env` file with your actual credentials:
   ```
   USER_EMAIL=your-actual-email@example.com
   USER_PASSWORD=your-actual-password
   ```

When running in CI/CD, these credentials are automatically provided via GitHub secrets.

## Running Tests
```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/login.spec.ts

# Run tests with specific tag
npx playwright test -g "logout"
```

## Reporting
After running the tests, you can view the HTML report:
```bash
npx playwright show-report
```
