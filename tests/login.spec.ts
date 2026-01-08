import { test, expect } from "../fixtures";
import { LoginPage } from "../pages/loginPage";

type Language = "en" | "fr";
const selectedLanguage =
  (process.env.LANGUAGE?.toLowerCase() as Language) || "en";

// login page does not seem to respeact locale
const runSignupTests = (lang: Language) => {
  test.describe(`Login Page - ${lang.toUpperCase()}`, () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
      loginPage = new LoginPage(page);
      // await loginPage.setLanguage(language);
      await loginPage.goto();
      await expect(loginPage.page).toHaveURL(/login/);
      await expect(loginPage.emailInput).toBeVisible();
    });

    test.skip("should not login when username provided is incorrect for an existing user", async () => {
      const wrongEmail = "wrong@example.com";
      const correctPassword = "Test1234567890";

      await loginPage.loginInputs(wrongEmail, correctPassword);
      await expect(loginPage.emailInput).toHaveValue(wrongEmail);
      await expect(loginPage.passwordInput).toHaveValue(correctPassword);
      await loginPage.submitLogin();

      // await loginPage.page.waitForResponse(resp =>
      //           resp.url().includes('/usernamepassword/challenge') && resp.request().method() === 'POST' && resp.status() === 200);

      const expectedError = await loginPage.getLocaleText("userPasswordError");
      const error = await loginPage.userPasswordError.textContent();
      await expect(
        loginPage.page.getByText("We're sorry, something went"),
      ).toBeAttached();
      expect(error).toContain(expectedError);
    });

    test("should show inline errors when empty fields are submitted", async () => {
      await loginPage.submitLogin();

      const emailError = await loginPage.getEmailError();
      const passwordError = await loginPage.getPasswordError();
      const emailExpectedError = await loginPage.getLocaleText(
        "loginBlankEmailError",
      );
      const passwordExpectedError = await loginPage.getLocaleText(
        "loginBlankPasswordError",
      );

      expect(emailError).toContain(emailExpectedError);
      expect(passwordError).toContain(passwordExpectedError);
    });

    // This will not validate the reset full flow
    test("should show to reset password", async () => {
      await expect(loginPage.forgotPasswordLink).toBeVisible();
      const expectedError = await loginPage.getLocaleText("forgotPasswordLink");

      await expect(loginPage.forgotPasswordLink).toHaveText(expectedError);
      await loginPage.forgotPasswordLink.click();
      await expect(loginPage.emailInput).toBeVisible();

      const buttonText = await loginPage.getLocaleText("sendEmailButton");
      await expect(loginPage.page.getByLabel(buttonText)).toBeVisible();
    });

    test("should signup link have correct href", async () => {
      const linkText = await loginPage.getLocaleText("signupLink");
      console.log("linkText", linkText);
      await expect(loginPage.signupLink).toHaveText(linkText);
      const urlPart = lang === "fr" ? "/fr/signup" : "/signup";
      expect(loginPage.signupLink).toHaveAttribute("href", new RegExp(urlPart));
    });

    // Other scenarios to be implemented
    // test('should show validation error for invalid email format', async () => {
    // });

    // test('should not login when password provided is incorrect for an existing user', async () => {
    // });
  });
};

runSignupTests(selectedLanguage);
