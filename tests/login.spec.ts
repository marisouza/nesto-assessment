import { test, expect } from "../fixtures";
import { LoginPage } from "../pages/loginPage";
import { getLocaleText } from "./helper/helper";

type Language = "en" | "fr";
const selectedLanguage =
  (process.env.LANGUAGE?.toLowerCase() as Language) || "en";

const runSignupTests = (lang: Language) => {
  test.describe(`Login Page - ${lang.toUpperCase()}`, () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
      loginPage = new LoginPage(page, lang);
      await loginPage.goto();
      await expect(loginPage.page).toHaveURL(/login/);
      await expect(loginPage.emailInput).toBeVisible();
    });

    test("should not login when username provided is incorrect for an existing user", async () => {
      const wrongEmail = "wrong@example.com";
      const correctPassword = "Test1234567890";

      await loginPage.loginInputs(wrongEmail, correctPassword);
      await expect(loginPage.emailInput).toHaveValue(wrongEmail);
      await expect(loginPage.passwordInput).toHaveValue(correctPassword);
      await loginPage.submitLogin();

      // waits for login request to return 401
      await loginPage.page.waitForResponse(resp =>
                resp.url().includes('https://auth.nesto.ca/usernamepassword/login') && resp.request().method() === 'POST' && resp.status() === 401);

      const expectedError = await getLocaleText("userPasswordError");
      const error = await loginPage.userPasswordError.textContent();
      expect(error).toContain(expectedError);
    });

    // LOG-002: FR text for empty fields is not matchin EN verion
    // This test will fail in FR until the text is fixed
    test("should show inline errors when empty fields are submitted", async () => {
      await loginPage.submitLogin();

      const emailError = await loginPage.getEmailError();
      const passwordError = await loginPage.getPasswordError();
      const emailExpectedError = await getLocaleText(
        "loginBlankEmailError",
      );
      const passwordExpectedError = await getLocaleText(
        "loginBlankPasswordError",
      );

      expect(emailError).toContain(emailExpectedError);
      expect(passwordError).toContain(passwordExpectedError);
    });

    test("should show to reset password button", async () => {
      const expectedError = await getLocaleText("forgotPasswordLink");

      await expect(loginPage.forgotPasswordLink).toBeVisible();
      await expect(loginPage.forgotPasswordLink).toHaveText(expectedError);
      await loginPage.forgotPasswordLink.click();

      const buttonText = await getLocaleText("sendEmailButton");
      await expect(loginPage.page.getByLabel(buttonText)).toBeVisible();
    });

    test("should signup link have correct href", async () => {
      const linkText = await getLocaleText("signupLink");
      console.log("linkText", linkText);
      await expect(loginPage.signupLink).toHaveText(linkText);
      const urlPart = lang === "fr" ? "/fr/signup" : "/signup";
      expect(loginPage.signupLink).toHaveAttribute("href", new RegExp(urlPart));
    });

    // Other scenarios to be implemented
    // test('should trigger reset password flow', async () => {
    // });

    // test('should show validation error for invalid email format', async () => {
    // });

    // test('should not login when password provided is incorrect for an existing user', async () => {
    // });
  });
};

runSignupTests(selectedLanguage);
