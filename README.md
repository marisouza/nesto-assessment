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
   git clone https://github.com/marisouza/nesto-assessment
   cd nesto-assessment
   ```

2. **Install dependencies**

   ```bash
   npm ci
   ```

3. **Install Playwright browsers** (if not automatically installed)

   ```bash
   npx playwright install --with-deps
   ```

_Note: This step may not be necessary if browsers were installed during `npm ci`. Run this if you encounter browser-related errors._

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

Note: To run tests in french just add LANGUAGE=fr before the npm command

```bash
LANGUAGE=fr npm run test:headed
```

Run all tests with Playwright UI:

```bash
npm run test:ui
```

Run specific test suites:

```bash
npm run test:consent      # Consent tests
npm run test:login        # Login tests
npm run test:signup       # Signup tests
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

CI Reports available at [github-pages](https://github.com/marisouza/nesto-assessment/deployments/github-pages)

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

## CI/CD

The project uses GitHub Actions for continuous integration. Workflows are defined in [`.github/workflows/docker-playwright.yml`](.github/workflows/docker-playwright.yml).

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

1. **Consent** - Consent functionality tests
2. **Login** - Authentication and login tests
3. **Signup** - User registration tests

Each suite runs independently and can be executed in parallel.
The project includes three main test suites with comprehensive coverage:

### 1. Login Tests (@login tag)

**Location**: [tests/login.spec.ts](tests/login.spec.ts)

**Coverage**:

- Invalid username/password validation
- Email format validation
- Empty field validation
- Password reset functionality
- Signup link navigation
- Account lockout after multiple failed attempts

**Multi-language support**: English & French

### 2. Signup Tests (@signup tag)

**Location**: [tests/signup.spec.ts](tests/signup.spec.ts)

**Coverage**:

- Form validation (email, password, phone, postal code)
- Password strength requirements
- Phone number country validation
- Account creation flow
- Terms of service and privacy policy links
- Login link navigation

**Multi-language support**: English & French

### 3. Consent Tests (@consent tag)

**Location**: [tests/consent.spec.ts](tests/consent.spec.ts)

**Coverage**:

- Cookie consent banner functionality
- First visit behavior
- Returning user preferences
- Consent acceptance flow

**Multi-language support**: English & French

### Test Execution

Each suite:

- Runs independently and can be executed in parallel
- Includes both positive and negative test scenarios
- Uses Page Object Model for maintainability
- Provides detailed assertions with custom error messages
- Supports multi-language testing

## Technologies & Tools

### Core Technologies

- **[Playwright](https://playwright.dev/)**: Modern end-to-end testing framework
- **[TypeScript](https://www.typescriptlang.org/)**: Type-safe JavaScript
- **[Node.js](https://nodejs.org/)**: JavaScript runtime

### Testing Tools

- **[@playwright/test](https://playwright.dev/docs/test-components)**: Playwright test runner
- **[@faker-js/faker](https://fakerjs.dev/)**: Generate fake data for testing
- **Allure**: Advanced test reporting

### Development Tools

- **[dotenv](https://github.com/motdotla/dotenv)**: Environment variable management
- **TypeScript ESLint**: TypeScript-specific linting rules

### Quality Tools

The project uses several tools to maintain code quality:

- **ESLint**: Enforces coding standards
- **Prettier**: Maintains consistent formatting
- **Husky**: Manages git hooks
- **lint-staged**: Runs checks on staged files

## Future Enhancements

- Add API testing capabilities
- Implement visual regression testing
- Add performance testing
- Expand test coverage for edge cases
- Improve consent for CI

### Commit Convention

Follow conventional commits format:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Test-related changes
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks

## Docker Support

Pre-requisit have [docker](https://www.docker.com/) installed and running locally

Build docker image based on Dockerfile

```bash
   docker build -t pw-test .
```

List docker images:

```bash
   docker images
```

Run docker image:

```bash
   docker run -it pw-test
   npm run test:consent
```

### Docker-compose

Another option to use docker-compose which will save reports into local test results folders.

To build a new docker image and run docker-compose:

```bash
   docker-compose up --build
```

To run docker-compose out of existing built image:

```bash
   docker-compose up
```
