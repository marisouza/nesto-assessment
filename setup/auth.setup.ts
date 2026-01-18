import { test as setup, expect } from "@playwright/test";
import * as path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authFile = path.join(__dirname, "../playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
  await page.goto(`${process.env.LOGIN_URL!}/login`);
  await page.reload();

  await page
    .getByRole("textbox", { name: "email" })
    .fill(process.env.EMAIL ? process.env.EMAIL : "valid.user123@test.com");
  await page
    .getByRole("textbox", { name: "password" })
    .fill(process.env.PASSWORD ? process.env.PASSWORD : "Test1234567890");
  await page.getByText("Log in").click();

  // Wait until the page receives the cookies.
  await page.waitForResponse(
    (resp) =>
      resp.url().includes("/oauth/token") &&
      resp.request().method() === "POST" &&
      resp.status() === 200,
  );
  await expect(page).toHaveURL("/");
  await expect(page.getByTestId("new-mortgage")).toBeVisible();

  const authDir = path.dirname(authFile);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // End of authentication steps.
  await page.context().storageState({ path: authFile });
});
