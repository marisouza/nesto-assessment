import { type Locator, type Page, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

export class ConsentPage {
  readonly page: Page;
  readonly consentModal: Locator;
  readonly partners: Locator;
  readonly agreeButton: Locator;
  readonly learnMoreButton: Locator;
  private language: "en" | "fr";

  constructor(page: Page, language: "en" | "fr" = "en") {
    this.page = page;
    this.language = language;
    const localeData = this.getLocaleData();
    this.consentModal = page.getByTestId("notice");
    this.partners = page.getByText(localeData.consentPartnersButton, {
      exact: true,
    });
    this.agreeButton = page.getByText(localeData.consentAcceptButton);
    this.learnMoreButton = page.getByText(localeData.consentLearnMoreButton, {
      exact: true,
    });
  }

  // TODO: Refactor duplicate of LoginPage and PortfolioPage
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

  async goto() {
    const url =
      this.language === "fr"
        ? "https://app.qa.nesto.ca/fr/signup"
        : "https://app.qa.nesto.ca/signup";
    await this.page.goto(url);
  }

  async isConsentVisible() {
    await expect(this.consentModal).toBeAttached();
    return await this.consentModal.isVisible();
  }

  async isConsentNotVisible() {
    return await this.consentModal.isHidden();
  }

  async acceptConsent() {
    await this.agreeButton.click();
  }

  async learnMore() {
    await this.learnMoreButton.click();
  }
}
