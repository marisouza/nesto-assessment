import { type Locator, type Page } from "@playwright/test";
import { getLocaleData, getSignupUrl } from "../helpers/helper.js";

export class SignupPage {
  readonly page: Page;
  readonly consent: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly signUpButton: Locator;
  readonly loginLink: Locator;
  readonly errorMessages: Locator;
  readonly languageSelector: Locator;
  readonly regionInput: Locator;
  readonly countrycodeSelector: Locator;
  private language: "en" | "fr";

  constructor(page: Page, language: "en" | "fr" = "en") {
    this.page = page;
    this.language = language;
    const localeData = getLocaleData().signupPage;
    this.consent = page.getByRole("button", {
      name: localeData.consentAccept,
      exact: true,
    });
    this.firstNameInput = page.getByRole("textbox", {
      name: localeData.firstNameInput,
      exact: true,
    });
    this.lastNameInput = page.getByRole("textbox", {
      name: localeData.lastNameInput,
      exact: true,
    });
    this.emailInput = page.getByRole("textbox", {
      name: localeData.emailInput,
      exact: true,
    });
    this.phoneInput = page.getByRole("textbox", {
      name: localeData.phoneNumberInput,
      exact: true,
    });
    this.passwordInput = page.getByRole("textbox", {
      name: localeData.passwordInput,
      exact: true,
    });
    this.confirmPasswordInput = page.getByRole("textbox", {
      name: localeData.passwordConfirmationInput,
      exact: true,
    });
    this.signUpButton = page.getByRole("button", {
      name: localeData.signUpButton,
      exact: true,
    });
    this.loginLink = page.getByRole("link", {
      name: localeData.logInButton,
      exact: true,
    });
    this.errorMessages = page.locator(
      '[data-testid*="error-message-typography"]',
    );
    this.countrycodeSelector = page.getByRole("combobox", {
      name: "phoneCountry",
    });
    this.regionInput = page.getByTestId("region-select");
    this.languageSelector = page.getByTestId("header-language-switch");
  }

async goTo() {
  const url = getSignupUrl(this.language);
  const reponse = this.page.waitForResponse(resp =>
                resp.url().includes('/api/geolocation/all') && resp.request().method() === 'GET' && resp.status() === 200);

  await this.page.goto(url);
  await reponse;
}

  async submitSignupForm() {
    await this.signUpButton.click();
  }

  async fillInputField(locator: Locator, value: string) {
    await locator.fill(value);
  }

  async getLocatorByTestId(loc: string) {
    const locator = this.page.getByTestId(loc);
    return locator;
  }

  async getErrorMessages() {
    return await this.errorMessages.allTextContents();
  }

  async getErrorMessageByTestId(testId: string) {
    const locator = this.page.getByTestId(testId);
    return await locator.textContent();
  }

  async fillSignupForm({
    firstName,
    lastName,
    phoneNumber,
    email,
    password,
    region,
    confirmPassword,
  }: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    region?: string;
    confirmPassword?: string;
  }) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.phoneInput.fill(phoneNumber);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    if (confirmPassword) {
      await this.confirmPasswordInput.fill(confirmPassword);
    } else {
      await this.confirmPasswordInput.fill(password);
    }
    if (region) {
      await this.regionInput.selectOption(region);
    }
  }

  async clickLoginHref() {
    await this.loginLink.click();
    await this.page.waitForURL("https://auth.nesto.ca/login**");
  }

  // Monitor network requests to ensure no account creation is attempted
  async isAccountCreationRequestSent() {
    let accountRequestTriggered = false;
    this.page.on("request", (req) => {
      if (req.url().includes("/api/accounts") && req.method() === "POST") {
        accountRequestTriggered = true;
      }
    });
    return accountRequestTriggered;
  }

  checkAccountRequest(selectedLanguage: string, statusCode: number = 201) {
    const loggedInUrl =
        selectedLanguage === "fr"
          ? "/getaquote/fr"
          : "/getaquote";

    const accountResponse = this.page.waitForResponse(
        (resp) =>
          resp.url().includes("/api/accounts") &&
          resp.request().method() === "POST" &&
          resp.status() === statusCode,
      );

      return { loggedInUrl, accountResponse };
  };

  async waitForLoginPageRedirect(){
    await this.page.waitForResponse(
        (resp) =>
          resp.url().includes("/oauth/token") &&
          resp.request().method() === "POST" &&
          resp.status() === 200,
      );
  }
}
