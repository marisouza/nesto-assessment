import { type Locator, type Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly signupLink: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly userPasswordError: Locator;
  private language: "en" | "fr";

  constructor(page: Page, language: "en" | "fr" = "en") {
    this.page = page;
    this.language = language;
    const localeData = this.getLocaleData();
    this.emailInput = page.getByRole("textbox", { name: "email" });
    this.passwordInput = page.getByRole("textbox", { name: "password" });
    this.loginButton = page.getByLabel(localeData.logIn);
    this.forgotPasswordLink = page.getByText(localeData.forgotPasswordLink, {
      exact: true,
    });
    this.signupLink = page.getByText(localeData.signupLink, { exact: true });
    this.emailError = page.getByText(localeData.loginBlankEmailError, {
      exact: true,
    });
    this.passwordError = page.getByText(localeData.loginBlankPasswordError, {
      exact: true,
    });
    this.userPasswordError = page.getByText(localeData.userPasswordError);
  }

  async goto() {
    await this.page.goto("https://app.qa.nesto.ca/");
  }

  async loginInputs(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async submitLogin() {
    await this.loginButton.click();
  }

  async getSignupHref() {
    return await this.signupLink.getAttribute("href");
  }

  async getEmailError() {
    return await this.emailError.textContent();
  }

  async getPasswordError() {
    return await this.passwordError.textContent();
  }

  // TODO: refactor duplicate of ConsentPage
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
}
