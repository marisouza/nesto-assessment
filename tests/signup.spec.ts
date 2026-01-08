import { test as baseTest, expect } from "../fixtures";
import { SignupPage } from "../pages/signupPage";
import { faker } from "@faker-js/faker";
import * as helper from "./helper/helper";

const test = baseTest.extend<{ signupPage: SignupPage }>({
  signupPage: async ({ page }, use) => {
    const language = selectedLanguage;
    const signupPage = new SignupPage(page, language);
    await helper.applyConsent(page);
    await signupPage.navigateToSignupPage();
    await expect(signupPage.page).toHaveURL(await signupPage.getSignupUrl());
    await use(signupPage);
  },
});

type Language = "en" | "fr";
const selectedLanguage =
  (process.env.LANGUAGE?.toLowerCase() as Language) || "en";

const runSignupTests = (lang: Language) => {
  test.describe(`Signup Page - ${lang.toUpperCase()}`, () => {
    test.describe("Form Validation", () => {
      test("should not submit form and show inline errors when mandatory fields are empty", async ({
        signupPage,
      }) => {
        // Monitor network requests to ensure no account creation is attempted
        let accountRequestTriggered = false;
        signupPage.page.on("request", (req) => {
          console.log("inside request listener", req.url());
          if (req.url().includes("/api/accounts") && req.method() === "POST") {
            accountRequestTriggered = true;
          }
        });
        await signupPage.submitSignupForm();
        const errors = await signupPage.getErrorMessages();

        // 5 inline errors for 5 mandatory fields
        expect(errors.length).toBe(5);
        expect(errors).toEqual([
          await helper.getLocaleText("mandatoryField"),
          await helper.getLocaleText("mandatoryField"),
          await helper.getLocaleText("invalidPhoneNumber"),
          await helper.getLocaleText("invalidEmail"),
          await helper.getLocaleText("passwordsMinimumRequirement"),
        ]);

        const expectedUrl = await signupPage.getSignupUrl();
        await expect(signupPage.page).toHaveURL(expectedUrl);
        expect(accountRequestTriggered).toBe(false);
      });

      // SU-003: Validate phone number based on country code selected
      test.skip("should show line error when phone number and country selection are different", async ({
        signupPage,
      }) => {
        // country code should be BR (55)
        const invalidPhone = "558132456789";
        await signupPage.fillInputField(signupPage.phoneInput, invalidPhone);
        await signupPage.submitSignupForm();

        expect(signupPage.phoneInput).toHaveValue(invalidPhone);
        const locator = signupPage.page.getByText(
          await helper.getLocaleText("invalidPhoneNumber"),
        );
        await expect(locator).toBeVisible();
        await expect(locator).toHaveText(
          await helper.getLocaleText("invalidPhoneNumber"),
        );
      });

      test("should show invalid phone number inline error ", async ({
        signupPage,
      }) => {
        const invalidPhone = faker.phone
          .number({ style: "national" })
          .slice(0, 7);
        await signupPage.fillInputField(signupPage.phoneInput, invalidPhone);
        await signupPage.submitSignupForm();
        await signupPage.phoneInput.waitFor({ state: "visible" });

        expect(signupPage.phoneInput).toHaveValue(invalidPhone);
        const locator = signupPage.page.getByText(
          await helper.getLocaleText("invalidPhoneNumber"),
        );
        await expect(locator).toBeVisible();
        await expect(locator).toHaveText(
          await helper.getLocaleText("invalidPhoneNumber"),
        );
      });

      test("should show invalid email address inline error", async ({
        signupPage,
      }) => {
        const invalidEmail = "invalid-email@test";
        await signupPage.fillInputField(signupPage.emailInput, invalidEmail);
        await signupPage.submitSignupForm();
        await signupPage.emailInput.waitFor({ state: "visible" });

        expect(signupPage.emailInput).toHaveValue(invalidEmail);
        const error = await signupPage.getErrorMessageByTestId(
          "email-error-message-typography",
        );
        const expectedText = await helper.getLocaleText("invalidEmail");
        expect(error).toContain(expectedText);
      });

      test("should show password mismatch inline error", async ({
        signupPage,
      }) => {
        await signupPage.fillInputField(
          signupPage.passwordInput,
          "Password1234",
        );
        await signupPage.fillInputField(
          signupPage.confirmPasswordInput,
          "Different123",
        );
        await signupPage.submitSignupForm();
        await signupPage.confirmPasswordInput.waitFor({ state: "visible" });

        const error = await signupPage.getErrorMessageByTestId(
          "passwordConfirmation-error-message-typography",
        );
        const expectedText =
          await helper.getLocaleText("passwordsMismatch");
        expect(error).toEqual(expectedText);
      });

      test("should show password below minimum length inline error", async ({
        signupPage,
      }) => {
        await signupPage.fillInputField(signupPage.passwordInput, "Pass1");
        await signupPage.submitSignupForm();
        await signupPage.passwordInput.waitFor({ state: "visible" });

        const error = await signupPage.getErrorMessageByTestId(
          "password-error-message-typography",
        );
        const expectedText = await helper.getLocaleText(
          "passwordsMinimumRequirement",
        );
        expect(error).toEqual(expectedText);
      });

      test("should show password above maximum length inline error", async ({
        signupPage,
      }) => {
        const tooLongPassword = "A".repeat(31) + "1a";
        await signupPage.fillInputField(
          signupPage.passwordInput,
          tooLongPassword,
        );
        await signupPage.submitSignupForm();
        await signupPage.passwordInput.waitFor({ state: "visible" });

        const expectedText = await helper.getLocaleText(
          "passwordMaximumRequirement",
        );
        expect(
          await signupPage.getErrorMessageByTestId(
            "password-error-message-typography",
          ),
        ).toEqual(expectedText);
      });

      test("should not show password minimum chars length inline error", async ({
        signupPage,
      }) => {
        await signupPage.fillInputField(
          signupPage.passwordInput,
          "Password1234",
        );
        await signupPage.submitSignupForm();
        await signupPage.passwordInput.waitFor({ state: "visible" });
        await expect(
          await signupPage.getLocatorByTestId(
            "password-error-message-typography",
          ),
        ).toBeHidden();
      });

      test("should not show password maximum chars length inline error", async ({
        signupPage,
      }) => {
        const longPassword = "A".repeat(30) + "1a";
        await signupPage.fillInputField(signupPage.passwordInput, longPassword);
        await signupPage.submitSignupForm();
        await signupPage.passwordInput.waitFor({ state: "visible" });
        await expect(
          await signupPage.getLocatorByTestId(
            "password-error-message-typography",
          ),
        ).toBeHidden();
      });

      // password requirements: one uppercase letter, one lowercase letter and one number
      test("should show password does not match requirements inline error", async ({
        signupPage,
      }) => {
        await signupPage.fillInputField(
          signupPage.passwordInput,
          "password1234",
        );
        await signupPage.submitSignupForm();

        const expectedText = await helper.getLocaleText(
          "passwordRequirements",
        );
        const error = await signupPage.getErrorMessageByText(expectedText);
        expect(error).toEqual(expectedText);
      });

      test("should not show error when password contains special chars(?!#_- ) but meets all requirements", async ({
        signupPage,
      }) => {
        await signupPage.fillInputField(
          signupPage.passwordInput,
          "Password123?!#_",
        );
        await signupPage.submitSignupForm();
        await expect(
          await signupPage.getLocatorByTestId(
            "password-error-message-typography",
          ),
        ).toBeHidden();
      });
    });

    test.describe("Links and Navigation", () => {
      test("should switch language when clicking the language toggle", async ({
        signupPage,
      }) => {
        const targetLanguage = lang === "en" ? "fr" : "en";
        const expectedUrlPart =
          targetLanguage === "fr" ? "/fr/signup" : "/signup";
        const headerText =
          targetLanguage === "fr"
            ? "Créez un compte nesto"
            : "Create a nesto account";

        await signupPage.languageSelector.click();
        await signupPage.page.waitForResponse(
          (resp) =>
            resp.url().includes(`/${targetLanguage}/signup.json`) &&
            resp.request().method() === "GET" &&
            resp.status() === 200,
        );
        await expect(signupPage.page).toHaveURL(new RegExp(expectedUrlPart));
        expect(
          signupPage.page.getByText(headerText, { exact: true }),
        ).toBeTruthy();
      });

      test("should redirect to login page when clicking the login link", async ({
        signupPage,
      }) => {
        await signupPage.clickLoginHref();
        expect(signupPage.page.url()).toContain("/login");

        const expectedText = await helper.getLocaleText("logIn");
        await signupPage.page.waitForSelector("button", { state: "visible" });
        await expect(
          signupPage.page.getByRole("button", { name: expectedText }),
        ).toBeVisible();
      });

      test("should have correct link for terms of service", async ({
        signupPage,
      }) => {
        await expect(signupPage.signUpButton).toBeVisible();
        const href = await signupPage.getTermsOfServiceHref();
        const expectedText =
          await helper.getLocaleText("termsOfServiceLink");
        expect(href).toContain(expectedText);
      });

      //SU-006: Test is skipped until the privacy policy link is for EN users is fixed
      test.skip("should have correct link for privacy policy", async ({
        signupPage,
      }) => {
        const href = await signupPage.getPrivacyPolicyHref();
        const expectedText =
          await helper.getLocaleText("privacyPolicyLink");
        expect(href).toContain(expectedText);
      });

      // Assumption:
      // "valid.user123@test.com" user was pre-created in the system before
      // use /accounts endpoint to create the user in pre-test setup is not an option
      // or have user present in DB as part of env setup
      test("should display toast error when signup using email from existing user", async ({
        signupPage,
      }) => {
        await signupPage.fillSignupForm({
          firstName: "John",
          lastName: "Doe",
          phoneNumber: "5149087654",
          email: "valid.user123@test.com",
          password: "Password1234",
          region: "AB",
        });
        await signupPage.submitSignupForm();

        const expectedText = await helper.getLocaleText("toastError");
        const locator = signupPage.page.getByText(expectedText, {
          exact: true,
        });

        await signupPage.page.waitForSelector(".Toastify", {
          state: "attached",
        });
        await expect(locator).toHaveText(expectedText);
      });

      test("should not allow signup with malicious strings in email/password", async ({
        signupPage,
      }) => {
        const malicious = "<script>alert('XSS')</script>";
        await signupPage.fillSignupForm({
          firstName: malicious,
          lastName: malicious,
          phoneNumber: "3332342345",
          email: malicious,
          password: "Password1234",
          region: "AB",
        });

        // Monitor network requests to ensure no account creation is attempted
        let accountRequestTriggered = false;
        signupPage.page.on("request", (req) => {
          console.log("inside request listener", req.url());
          if (req.url().includes("/api/accounts") && req.method() === "POST") {
            accountRequestTriggered = true;
          }
        });
        await signupPage.submitSignupForm();

        const errors = await signupPage.getErrorMessages();
        // 3 inline errors for first name, last name and invalid email
        expect(errors.length).toBe(3);
        expect(errors).toEqual([
          await helper.getLocaleText("mandatoryField"),
          await helper.getLocaleText("mandatoryField"),
          await helper.getLocaleText("invalidEmail"),
        ]);

        // Check that no alert popup is triggered
        let alertTriggered = false;
        signupPage.page.on("dialog", (dialog) => {
          console.log("inside request listener", dialog.message());
          if (dialog.type() === "alert") {
            alertTriggered = true;
          }
        });

        // Check that the account creation endpoint was NOT triggered and no alert was shown
        expect(accountRequestTriggered).toBe(false);
        expect(alertTriggered).toBe(false);
      });
    });

    test.describe("Account Creation", () => {
      test("should create account when valid inputs are provided", async ({ signupPage }) => {
        const randomUserFirstName = faker.person.firstName();
        const randomUserLastName = faker.person.lastName();
        const randomEmail = faker.internet.email({
          firstName: randomUserFirstName,
          lastName: `${randomUserLastName}${Date.now().toFixed()}`,
        });
        const phoneNumber = "+15141234567";
        const pwd = "PPassword1234";
        const region = "AB";

        // Submit the form and wait for the response
        await signupPage.fillSignupForm({
          firstName: randomUserFirstName,
          lastName: randomUserLastName,
          phoneNumber: phoneNumber,
          email: randomEmail,
          password: pwd,
          region: region,
        });

        await signupPage.submitSignupForm();
        const accountResponse = await signupPage.page.waitForResponse(
          (resp) =>
            resp.url().includes("/api/accounts") &&
            resp.request().method() === "POST" &&
            resp.status() === 201,
        );

        
        const accountResponseBody = await accountResponse.json();
        expect(accountResponseBody.account.firstName).toEqual(
          randomUserFirstName,
        );
        expect(accountResponseBody.account.lastName).toEqual(randomUserLastName);
        expect(accountResponseBody.account.email).toEqual(randomEmail);
        expect(accountResponseBody.account.phone).toEqual(phoneNumber);
        expect(accountResponseBody.account.region).toEqual(region);

        const url =
          selectedLanguage === "fr"
            ? "https://app.qa.nesto.ca/getaquote/fr"
            : "https://app.qa.nesto.ca/getaquote";
        // ensure redirection to next step after signup
        await signupPage.page.waitForResponse(
          (resp) =>
            resp.url().includes("https://auth.nesto.ca/oauth/token") &&
            resp.request().method() === "POST" &&
            resp.status() === 200,
        );
        await expect(signupPage.page).toHaveURL(url);
        await expect(signupPage.page.getByTestId("new-mortgage")).toBeVisible();
      });

      // SU-001: Signup allows non-Canadian phone numbers
      test.skip("should not create account for non-Canadian phone numbers", async ({ signupPage }) => {
        const randomUserFirstName = faker.person.firstName();
        const randomUserLastName = faker.person.lastName();
        const randomEmail = faker.internet.email({
          firstName: randomUserFirstName,
          lastName: `${randomUserLastName}${Date.now().toFixed()}`,
        });
        const phoneNumber = faker.phone.number({ style: "international" });
        const pwd = "PPassword1234";
        const region = "AB";

        // Submit the form and wait for the response
        await signupPage.fillSignupForm({
          firstName: randomUserFirstName,
          lastName: randomUserLastName,
          phoneNumber: phoneNumber,
          email: randomEmail,
          password: pwd,
          region: region,
        });

        await signupPage.submitSignupForm();
        const accountResponse = await signupPage.page.waitForResponse(
          (resp) =>
            resp.url().includes("/api/accounts") &&
            resp.request().method() === "POST" &&
            resp.status() === 401,
        );

        const accountResponseBody = await accountResponse.json();
        expect(accountResponseBody.account.firstName).toEqual(
          randomUserFirstName,
        );
        expect(accountResponseBody.account.lastName).toEqual(randomUserLastName);
        expect(accountResponseBody.account.email).toEqual(randomEmail);
        expect(accountResponseBody.account.phone).toEqual(phoneNumber);
        expect(accountResponseBody.account.region).toEqual(region);

        const url =
          selectedLanguage === "fr"
            ? "https://app.qa.nesto.ca/getaquote/fr"
            : "https://app.qa.nesto.ca/getaquote";

        // ensure redirection to next step after signup
        await signupPage.page.waitForResponse(
          (resp) =>
            resp.url().includes("https://auth.nesto.ca/oauth/token") &&
            resp.request().method() === "POST" &&
            resp.status() === 200,
        );
        await expect(signupPage.page).toHaveURL(url);
        await expect(signupPage.page.getByTestId("new-mortgage")).toBeVisible();
      });
    });
  });
};

runSignupTests(selectedLanguage);
