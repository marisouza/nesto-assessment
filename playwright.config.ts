import { defineConfig, devices } from "@playwright/test";
import { fileURLToPath } from "url";
import dotenv from 'dotenv';
import * as path from "path";


/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

/**
 * See https://playwright.dev/docs/test-configuration.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const consentFile = path.join(__dirname, "./playwright/.auth/consent.json");

dotenv.config({ path: path.resolve(__dirname, '.env.demo') });

export default defineConfig({
  // tsconfig: './tsconfig.json',
  testDir: ".",
  testMatch: "tests/**/*.spec.ts",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI
    ? [['blob'], ['allure-playwright', { outputFolder: 'allure-results' }]]
    : [['html', { outputFolder: 'playwright-report' }], ['allure-playwright', { outputFolder: 'allure-results' }]],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: process.env.BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "accept-consent",
      testMatch: "setup/acceptConsent.setup.ts",
      use: {
        ...devices["Desktop Chrome"],
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
        geolocation: { latitude: 45.4215, longitude: -75.6999 },
        permissions: ['geolocation'],
        storageState: undefined,
        // viewport: { width: 1280, height: 720 },
        launchOptions: {
          // headless: process.env.CI ? false : true,
          args: [
            '--disable-blink-features=AutomationControlled',
            '--disable-features=IsolateOrigins,site-per-process',
            '--disable-web-security',
            '--disable-site-isolation-trials',
            '--disable-popup-blocking',
          ],
        },
      },
    },
    {
      name: "signup",
      use: {
        ...devices["Desktop Chrome"],
        locale: process.env.LANGUAGE || "en",
        storageState: consentFile,
      },
      dependencies: ['accept-consent'],
      testMatch: ["tests/**/*.spec.ts"],
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
