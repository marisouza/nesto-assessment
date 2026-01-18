import { test as setup, expect } from "@playwright/test";

type Language = "en" | "fr";
const selectedLanguage =
  (process.env.LANGUAGE?.toLowerCase() as Language) || "en";

setup("login", async ({ page }) => {
  // Navigate to the signup page and perform login
  const agreeButton = await page.locator("#didomi-notice-agree-button");
  const url =
    selectedLanguage === "fr"
      ? "https://app.qa.nesto.ca/fr/signup"
      : "https://app.qa.nesto.ca/signup";

  await page.goto(url);
  if (await agreeButton.isVisible()) {
    await agreeButton.click();
  }
  await page.getByTestId("header-login-button").click();

  const loginButton = page.getByLabel("Log In", { exact: true });
  await expect(page).toHaveURL(/login/);
  await expect(loginButton).toBeVisible();
});
