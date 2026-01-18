import { test as setup, expect, BrowserContext } from "@playwright/test";
import { fileURLToPath } from "url";
import * as path from "path";
import * as fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const consentFile = path.join(__dirname, "../playwright/.auth/consent.json");

async function injectConsentForCI(context: BrowserContext, filePath: string) {
  await context.addCookies([
    {
      name: "didomi_token",
      value: "eyJ1c2VyX2lkIjoiMTliY2ZlZGMtODM0My02ODEwLTllMTktOTA5ZGQ1Y2MzZmRjIiwiY3JlYXRlZCI6IjIwMjYtMDEtMThUMDc6MDc6MDUuNjUyWiIsInVwZGF0ZWQiOiIyMDI2LTAxLTE4VDA3OjA3OjA1Ljc1NloiLCJ2ZW5kb3JzIjp7ImVuYWJsZWQiOlsiZ29vZ2xlIiwiYzpnb29nbGVhbmEtNFRYbkppZ1IiLCJjOnN3aXRjaGdyby1lZ0FUSmh4SiIsImM6dW5ib3VuY2UiLCJjOmxpbmtlZGluIiwiYzptaWNyb3NvZnQiLCJjOmxhcHJlc3NlLXFiaFVxUW1mIiwiYzpjb252ZXJ0ZXgtekE4cldyVUQiXX0sInB1cnBvc2VzIjp7ImVuYWJsZWQiOlsiYWR2ZXJ0aXNpbi03V2QyNFJLaiIsInBlcmZvcm1hbmMtRVJQWGZyRmIiXX0sInZlbmRvcnNfbGkiOnsiZW5hYmxlZCI6WyJnb29nbGUiXX0sInZlcnNpb24iOjIsImFjIjoiQUZtQUNBRmsuQUZtQUNBRmsifQ==",
      domain: ".nesto.ca",
      path: "/",
      expires: Math.floor(Date.now() / 1000) + 31536000,
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
    {
      name: "euconsent-v2",
      value: "CQeOVkAQeOVkAAHABBENCNFgAP_AAAELAAAAGMwAgF5gMZAvOACAvMAA.f_gACFgAAAAA",
      domain: ".nesto.ca",
      path: "/",
      expires: Math.floor(Date.now() / 1000) + 31536000,
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
  ]);

  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  await context.storageState({ path: filePath });
}

setup("consent", async ({ page, context }) => {
  if (process.env.CI) {
    await injectConsentForCI(context, consentFile);
    return;
  }

  const response = page.waitForResponse(resp =>
    resp.url().includes('/api/geolocation/all') &&
    resp.request().method() === 'GET' && resp.status() === 200
  );
  await page.goto("/signup");
  await response;

  await expect(page.getByTestId('notice'), 'Consent notice should be visible').toBeVisible();
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
