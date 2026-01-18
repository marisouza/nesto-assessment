import { test as setup, expect } from "@playwright/test";
import { fileURLToPath } from "url";
import * as path from "path";
import * as fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const consentFile = path.join(__dirname, "../playwright/.auth/consent.json");

setup("consent", async ({ page }) => {
  const response = page.waitForResponse(resp =>
    resp.url().includes('/api/geolocation/all') &&
    resp.request().method() === 'GET' && resp.status() === 200
  );
  await page.goto("/signup");
  await response;

  await expect(page.getByTestId('notice')).toBeVisible();
  const agreeButton = page.locator("#didomi-notice-agree-button");
  await expect(agreeButton, 'Consent agree button should be visible').toBeVisible();
  await agreeButton.click();

  await page.waitForResponse(resp =>
    resp.url().includes('https://api.privacy-center.org/v1/events') &&
    resp.request().method() === 'POST'
  );

  const consentDir = path.dirname(consentFile);
  if (!fs.existsSync(consentDir)) {
    fs.mkdirSync(consentDir, { recursive: true });
  }
  
  await page.context().storageState({ path: consentFile });
});
