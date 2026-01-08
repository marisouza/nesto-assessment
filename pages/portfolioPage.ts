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

  // async navigateToNewMortgage() {
  //   await this.newMortgageLink.click();
  // }

  // async navigateToMortgageRenewal() {
  //   await this.mortgageRenewalLink.click();
  // }

  // async navigateToRefinanceMortgage() {
  //   await this.refinanceMortgageLink.click();
  // }

  // uplicated from signupPage.ts - consider refactoring to utils
  async setLanguage(lang: "en" | "fr") {
    await this.page.addInitScript(
      `localStorage.setItem('language', '${lang}');`,
    );
    await this.page.reload();
  }

  async getUrl() {
    const url =
      this.language === "fr"
        ? "https://app.qa.nesto.ca/fr"
        : "https://app.qa.nesto.ca";
    return url;
  }

  // duplocated from signupPage.ts - consider refactoring to utils
  // async applyConsent() {
  //     // Fake consent values
  //     const didomi = 'eyJ1c2VyX2lkIjoiMTliOTBmOGItYTU1OC02YjY2LWJkMGEtNTVkODFkNzIzYjNmIiwiY3JlYXRlZCI6IjIwMjYtMDEtMDZUMDE6NDI6NTguMzg5WiIsInVwZGF0ZWQiOiIyMDI2LTAxLTA2VDAxOjQ5OjQ5LjI3M1oiLCJ2ZW5kb3JzIjp7ImVuYWJsZWQiOlsiZ29vZ2xlIiwiYzpnb29nbGVhbmEtNFRYbkppZ1IiLCJjOnN3aXRjaGdyby1lZ0FUSmh4SiIsImM6dW5ib3VuY2UiLCJjOmxpbmtlZGluIiwiYzptaWNyb3NvZnQiLCJjOmxhcHJlc3NlLXFiaFVxUW1mIiwiYzpjb252ZXJ0ZXgtekE4cldyVUQiXX0sInB1cnBvc2VzIjp7ImVuYWJsZWQiOlsiYWR2ZXJ0aXNpbi03V2QyNFJLaiIsInBlcmZvcm1hbmMtRVJQWGZyRmIiXX0sInZlbmRvcnNfbGkiOnsiZW5hYmxlZCI6WyJnb29nbGUiXX0sInZlcnNpb24iOjIsImFjIjoiQUZtQUNBRmsuQUZtQUNBRmsifQ==';
  //     const eu = 'CQdmyUAQdmyUAAHABBENCMFgAP_AAELAAAAAGMwAgF5gMZAvOACAvMAA.f_gACFgAAAAA';

  //     // Set localStorage via addInitScript
  //     await this.page.addInitScript(
  //         ([didomi, eu]) => {
  //             try {
  //                 localStorage.setItem('didomi_token', didomi);
  //                 localStorage.setItem('euconsent-v2', eu);
  //             } catch (e) {
  //                 // Ignore in environments where access is restricted
  //                 console.error('Could not set localStorage items for consent:', e);
  //             }
  //         },
  //         [didomi, eu]
  //     );

  //     // Set cookies
  //     await this.page.context().addCookies([
  //         {
  //             name: 'didomi_token',
  //             value: didomi,
  //             domain: 'app.qa.nesto.ca',
  //             path: '/',
  //             secure: true,
  //             httpOnly: false,
  //             sameSite: 'Lax'
  //         },
  //         {
  //             name: 'euconsent-v2',
  //             value: eu,
  //             domain: 'app.qa.nesto.ca',
  //             path: '/',
  //             secure: true,
  //             httpOnly: false,
  //             sameSite: 'Lax'
  //         }
  //     ]);
  // }
}
