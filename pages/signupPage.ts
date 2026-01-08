import { type Locator, type Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

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
  readonly termsOfServiceLink: Locator;
  readonly privacyPolicyLink: Locator;
  readonly errorMessages: Locator;
  readonly languageSelector: Locator;
  readonly regionInput: Locator;
  readonly countrycodeSelector: Locator;
  private language: "en" | "fr";

  constructor(page: Page, language: "en" | "fr" = "en") {
    this.page = page;
    this.language = language;
    const localeData = this.getLocaleData();
    this.consent = page.getByRole("button", {
      name: localeData.consentAccept,
      exact: true,
    });
    this.firstNameInput = page.getByRole("textbox", {
      name: localeData.firstName,
      exact: true,
    });
    this.lastNameInput = page.getByRole("textbox", {
      name: localeData.lastName,
      exact: true,
    });
    this.emailInput = page.getByRole("textbox", {
      name: localeData.email,
      exact: true,
    });
    this.phoneInput = page.getByRole("textbox", {
      name: localeData.phoneNumber,
      exact: true,
    });
    this.passwordInput = page.getByRole("textbox", {
      name: localeData.password,
      exact: true,
    });
    this.confirmPasswordInput = page.getByRole("textbox", {
      name: localeData.passwordConfirmation,
      exact: true,
    });
    this.signUpButton = page.getByRole("button", {
      name: localeData.signUp,
      exact: true,
    });
    this.loginLink = page.getByRole("link", {
      name: localeData.logIn,
      exact: true,
    });
    this.termsOfServiceLink = page.getByText(localeData.termsOfService, {
      exact: true,
    });
    this.privacyPolicyLink = page.getByText(localeData.privacyPolicy, {
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

  async getSignupUrl() {
    const signUpUrl =
      this.language === "fr"
        ? "https://app.qa.nesto.ca/fr/signup"
        : "https://app.qa.nesto.ca/signup";
    return signUpUrl;
  }

  // TODO: make part of helper
  private getLocaleData() {
    const localeMap = {
      en: "en-EN.json",
      fr: "fr-FR.json",
    };
    const localeFile = localeMap[this.language];
    const localePath = path.join(
      path.dirname(new URL(import.meta.url).pathname),
      "..",
      "resources",
      "locales",
      localeFile,
    );
    const data = fs.readFileSync(localePath, "utf-8");
    return JSON.parse(data);
  }

async navigateToSignupPage() {
  const url = await this.getSignupUrl();
  console.log(`Navigating to signup page: ${url}`);
  
  try {
    const reponse = this.page.waitForResponse(
      (resp) => {
        const matchesUrl = resp.url().includes("/api/geolocation/all");
        const matchesMethod = resp.request().method() === "GET";
        const matchesStatus = resp.status() === 200;
        
        if (matchesUrl) {
          console.log(`Geolocation API response - Status: ${resp.status()}, Method: ${resp.request().method()}`);
        }
        
        return matchesUrl && matchesMethod && matchesStatus;
      },
    );
    await this.page.goto(url);
    await reponse;
    console.log('Page loaded successfully');
  
    console.log('Geolocation API response received successfully');
  } catch (error) {
    console.error('Error navigating to signup page:', error);
    console.error(`Failed URL: ${url}`);
    throw error;
  }
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
    region: string;
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

  async getTermsOfServiceHref() {
    return await this.termsOfServiceLink.getAttribute("href");
  }

  async getPrivacyPolicyHref() {
    return await this.privacyPolicyLink.getAttribute("href");
  }

  // Returns all error messages as an array of strings
  async getErrorMessages() {
    return await this.errorMessages.allTextContents();
  }

  // Returns specific error message text by test ID
  async getErrorMessageByTestId(testId: string) {
    const locator = this.page.getByTestId(testId);
    await locator.waitFor({ state: 'visible'});
    return await locator.textContent();
  }

  // Returns specific error message text by test ID
  async getErrorMessageByText(text: string) {
    const locator = this.page.getByText(text);
    return await locator.textContent();
  }
}
