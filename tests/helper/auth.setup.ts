import { test as setup, expect } from '@playwright/test';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Navigate to the signup page and perform login
  const agreeButton = await page.locator('#didomi-notice-agree-button');
  await page.goto("https://app.qa.nesto.ca/signup");
  await page.getByTestId('header-login-button').click();
  
  if (await agreeButton.isVisible() ) {
    await agreeButton.click();
  }

  //  // Wait until the page receives the cookies.
  // await page.waitForResponse(resp =>
  //   resp.url().includes('https://auth.nesto.ca/oauth/token') && resp.request().method() === 'POST' && resp.status() === 200
  // );
  // await expect(page).toHaveURL('https://app.qa.nesto.ca/getaquote');
  // await expect(page.getByTestId('new-mortgage')).toBeVisible()

  // Perform authentication steps. Replace these actions with your own.
  // await page.goto('https://auth.nesto.ca/login?state=hKFo2SBQbTRQQm1nT3RlSW92aFEyMndYRC1mbUNiZ2VRdl9lcaFupWxvZ2luo3RpZNkgeFJWaGNsRVd4UGdUUlEyVGtTdWQxX2ZXSzN2d0UwdG-jY2lk2SBGZzRkbmJab0NxN29BMHJXcGxNTFduSTFvRTBIR3kzbA&client=Fg4dnbZoCq7oA0rWplMLWnI1oE0HGy3l&protocol=oauth2&scope=openid%20profile%20email%20offline_access&redirect_uri=https%3A%2F%2Fapp.qa.nesto.ca%2Fcallback&audience=https%3A%2F%2Fqa.nesto.ca%2Fapi&redirectCount=0&ui_locales=en&passwordless=false&activation=false&response_type=code&response_mode=query&nonce=NXJYflFHWmZodEhVZ1ZEREd5cko0ajlrNUtGX0l4aUd2RjJTR2VaMjg1cg%3D%3D&code_challenge=4uPriYPhC0CiXypqUgNZUJE9AK-Lsr0Yjq6aEPZCtCY&code_challenge_method=S256&auth0Client=eyJuYW1lIjoiYXV0aDAtcmVhY3QiLCJ2ZXJzaW9uIjoiMi4yLjQifQ%3D%3D');
  await page.getByRole('textbox', { name: 'email'}).fill( process.env.EMAIL? process.env.EMAIL : 'valid.user123@test.com' );
  await page.getByRole('textbox', { name: 'password' }).fill(process.env.PASSWORD ? process.env.PASSWORD : 'Test1234567890');
  await page.getByText('Log in').click();

  // Wait until the page receives the cookies.
  await page.waitForResponse(resp =>
    resp.url().includes('https://auth.nesto.ca/oauth/token') && resp.request().method() === 'POST' && resp.status() === 200
  );
  await expect(page).toHaveURL('https://app.qa.nesto.ca/');
  await expect(page.getByTestId('new-mortgage')).toBeVisible()

  // End of authentication steps.
  await page.context().storageState({ path: authFile });
});