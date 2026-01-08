import { Page, Locator } from "@playwright/test";

export class PortfolioPage {
  readonly page: Page;
  readonly menuButton: Locator;
  readonly settingsButton: Locator;
  readonly commPreferencesButton: Locator;
  readonly signOutButton: Locator;
  readonly deleteAccountButton: Locator;
  readonly languageSwitchButton: Locator;
  readonly privacyPolicyLink: Locator;
  readonly logoutButton: Locator;
  readonly newMortgageLink: Locator;
  readonly mortgageRenewalLink: Locator;
  readonly refinanceMortgageLink: Locator;
  readonly commOptionsEmailInput: Locator;
  readonly portfolioButton: Locator;
  private language: "en" | "fr";

  constructor(page: Page, language: "en" | "fr" = "en") {
    this.page = page;
    this.language = language;
    this.menuButton = page.getByTestId("button");
    this.settingsButton = page.getByTestId("userSettings-menu-item");
    this.commPreferencesButton = page.getByTestId(
      "communication-preferences-tab-button",
    );
    this.signOutButton = page.getByTestId("sign-logout-menu-item");
    this.deleteAccountButton = page.getByTestId("delete-account-button");
    this.languageSwitchButton = page.getByTestId("language-menu-item");
    this.privacyPolicyLink = page.getByTestId("privacyPolicy-menu-item");
    this.logoutButton = page.getByTestId("logout-menu-item");
    this.newMortgageLink = page.getByTestId("new-mortgage");
    this.mortgageRenewalLink = page.getByTestId("renewal");
    this.refinanceMortgageLink = page.getByTestId("refinance");
    this.commOptionsEmailInput = page.getByTestId("newsletters-email-input");
    this.portfolioButton = page.getByTestId("my-portfolio-button");
  }

  async goto() {
    await this.page.goto(await this.getUrl());
  }

  async openMenu() {
    await this.menuButton.click();
  }

  async openSettings() {
    await this.settingsButton.click();
  }

  async changeMenuCommPreferences() {
    await this.commPreferencesButton.click();
  }

  async changeCommPreferences() {
    await this.commOptionsEmailInput.focus();
    await this.commOptionsEmailInput.check();
  }

  async switchLanguage() {
    await this.languageSwitchButton.click();
  }

  async deleteAccount() {
    await this.deleteAccountButton.click();
  }

  async validatePrivacyPolicyHref(expectedHref: string) {
    await this.page.waitForSelector('a[href*="privacy-policy"]');
    const href = await this.privacyPolicyLink.getAttribute("href");
    return href === expectedHref;
  }

  async logout() {
    await this.logoutButton.click();
  }

  async getUrl() {
    const url =
      this.language === "fr"
        ? "https://app.qa.nesto.ca/fr"
        : "https://app.qa.nesto.ca";
    return url;
  }
}