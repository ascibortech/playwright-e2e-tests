# Playwright E2E Testing Project

This repository contains end-to-end tests for an e-commerce application using Playwright. The tests are designed to validate critical user journeys including login, product browsing, and shopping cart functionality.

## Tech Stack

- **Testing Framework**: [Playwright](https://playwright.dev/) - A browser automation library for E2E testing
- **Language**: TypeScript
- **Pattern**: Page Object Model (POM)
- **Code Quality**: ESLint, SonarQube
- **CI/CD**: GitHub Actions

## Project Structure

The project follows the Page Object Model (POM) pattern for better test organization and maintenance:

```
playwright-e2e-tests/
├── fixtures/           # Custom Playwright test fixtures
├── pages/              # Page Object Models
├── testData/           # Test data in JSON format
├── tests/              # Test specifications
├── playwright.config.ts # Playwright configuration
└── ...
```

### Key Components

- **Page Objects**: Encapsulates page-specific elements and actions
- **Fixtures**: Provides reusable setup for tests (cookie handling, authentication)
- **Test Data**: Externalizes test data for better maintainability

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/playwright-e2e-tests.git
   cd playwright-e2e-tests
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Running Tests

### Environment Variables

For tests that require authentication:

```bash
# Create a local.env file with credentials (not committed to git)
USER_EMAIL=your-test-email@example.com
USER_PASSWORD=your-test-password
```

### Running All Tests

```bash
# Run all tests in chromium browser
npm test

# Or run with specific browser
npx playwright test --project=chromium
```

### Running Specific Tests

```bash
# Run login tests
npx playwright test login.spec.ts

# Run shopping cart tests
npx playwright test addToCart.spec.ts
```

### Running in UI Mode

```bash
npx playwright test --ui
```

## CI/CD Integration

The project uses GitHub Actions for continuous integration:

- **PR Validation**: Automatically runs tests on pull requests
- **Main Branch Protection**: Ensures quality through required status checks
- **SonarQube Analysis**: Performs code quality scanning on every PR

### GitHub Workflows

- `.github/workflows/pr-validation.yml`: Validates PRs with test execution and code quality checks
- `.github/workflows/main.yml`: Runs on merge to main branch

## Code Quality

### ESLint Integration

ESLint is configured to enforce code style and catch potential issues:

```bash
# Run ESLint check
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

The project follows modern TypeScript and Playwright best practices with rules configured in `eslint.config.mjs`.

### SonarQube Integration

SonarQube analyzes the codebase for:

- Code smells
- Bugs
- Vulnerabilities
- Test coverage
- Duplication

Configuration is in `sonar-project.properties` file. The SonarQube dashboard provides detailed reports on each scan.

## Test Coverage

### Login Functionality
- User login with valid credentials
- Login attempts with invalid credentials
- Account lockout after multiple failed attempts
- User logout

### Shopping Cart Functionality
- Adding products to cart
- Verifying cart counts and totals
- Mini cart interactions

### Session Management
- Cookie consent handling
- Authentication state persistence

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests locally
4. Push changes and create a pull request
5. Ensure all CI checks pass

## License

[MIT License](LICENSE)
