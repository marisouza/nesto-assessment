import { type Locator, type Page } from "@playwright/test";
import { getLocaleData, getSignupUrl } from "../helpers/helper.js";

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
    const localeData = getLocaleData().signupPage;
    this.consentModal = page.getByTestId("notice");
    this.partners = page.getByText(localeData.consentPartnersButton, {
      exact: true,
    });
    this.agreeButton = page.getByText(localeData.consentAcceptButton);
    this.learnMoreButton = page.getByText(localeData.consentLearnMoreButton, {
      exact: true,
    });
  }

  async goTo() {
    const url = getSignupUrl(this.language);
    await this.page.goto(url);
  }

  async isConsentVisible() {
    return await this.consentModal.isVisible();
  }

  async acceptConsent() {
    await this.agreeButton.click();
  }

  async learnMore() {
    await this.learnMoreButton.click();
  }
}
