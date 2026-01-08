# Nesto Test Automation Project

## Overview

This is an end-to-end test automation project for Nesto using Playwright and TypeScript. The project includes comprehensive test suites for portfolio, login, and signup functionalities with parallel test execution and detailed reporting.

## Prerequisites

- **Node.js**: LTS version (v18 or higher recommended)
- **npm**: v10 or higher
- **Git**: For version control

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd nesto
   ```

2. **Install dependencies**

   ```bash
   npm ci
   ```

3. **Install Playwright browsers** (if not automatically installed)

   ```bash
   npx playwright install --with-deps
   ```

*Note: This step may not be necessary if browsers were installed during `npm ci`. Run this if you encounter browser-related errors.*

## Project Structure

```bash
nesto/
├── tests/                  # Test files
├── pages/                  # Page Object Models
├── playwright/             # Playwright configuration files
├── fixtures.ts             # Custom test fixtures
├── playwright.config.ts    # Playwright configuration
├── allure-results/         # Test execution results
├── playwright-report/      # HTML test reports
├── .github/workflows/      # CI/CD workflows
└── docs/                   # Documentation
```

## Running Tests

### Interactive Mode (UI)

Note: To run tests in french just add LANGUAGE=fr before the npm commad

```bash
LANGUAGE=fr npm run test:all
```

Run all tests with Playwright UI:

```bash
npm run test:all
```

Run specific test suites:

```bash
npm run test:portfolio    # Portfolio tests
npm run test:login        # Login tests
npm run test:signup       # Signup tests
```

### Headless Mode (CI)

Run tests in headless mode:

```bash
npm run test-ci:portfolio
npm run test-ci:login
npm run test-ci:signup
```

## Test Reports

### HTML Report

View Playwright HTML report:

```bash
npm run report:show
```

### Allure Report

Generate and view Allure report:

```bash
npm run report:allure
```

Reports are generated in:

- `playwright-report/` - HTML reports
- `allure-results/` - Allure test results
- `allure-report/` - Generated Allure reports

## Code Quality

### Linting

Check for linting errors:

```bash
npm run lint
```

Run linter in CI mode:

```bash
npm run lint:ci
```

### Code Formatting

Check code formatting:

```bash
npm run format:check
```

Auto-fix formatting issues:

```bash
npm run format:fix
```

## Configuration

### Playwright Configuration

Test configuration is managed in [`playwright.config.ts`](playwright.config.ts):
Configuration was kept the same for the assement purpose.

- Test directory: `./tests`
- Reporters: HTML and Allure

### Project-Specific Settings

**Important:** The `consent.json` file requires manual configuration with appropriate cookie consent values. This will be automated in a future update.

### Environment Variables

The project uses environment variables for CI/CD. Key variables:

- `CI` - Indicates CI environment
- `DIDOMI` - Cookie consent configuration
- `EUCONSENT` - EU consent configuration

## CI/CD

The project uses GitHub Actions for continuous integration. Workflows are defined in [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml).

### Workflow Steps:

1. **Lint** - Code quality checks
2. **Test** - Parallel test execution across multiple suites
3. **Report** - Artifact upload for test reports

Tests run on:

- Push to `main` branch
- Pull requests

## Development

### TypeScript Configuration

TypeScript settings are in [`tsconfig.json`](tsconfig.json). Type checking is performed during linting.

### ESLint Configuration

Linting rules are defined in [`eslint.config.js`](eslint.config.js).

## Test Suites

The project includes three main test suites:

1. **Portfolio** - Portfolio functionality tests
2. **Login** - Authentication and login tests
3. **Signup** - User registration tests

Each suite runs independently and can be executed in parallel.

## Docker Support

A [`Dockerfile`](Dockerfile) is available for containerized test execution.
