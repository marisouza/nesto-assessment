import { test as baseTest, expect } from "../fixtures";
import { PortfolioPage } from "../pages/portfolioPage";
import * as helper from "./helper/helper";

type Language = "en" | "fr";
const selectedLanguage =
  (process.env.LANGUAGE?.toLowerCase() as Language) || "en";

const test = baseTest.extend<{ portfolioPage: PortfolioPage }>({
  portfolioPage: async ({ page }, use) => {
    const language = selectedLanguage;
    const portfolioPage = new PortfolioPage(page, language);
    await helper.applyConsent(page);
    await portfolioPage.goto();
    await expect(portfolioPage.page).toHaveURL(await portfolioPage.getUrl());
    await use(portfolioPage);
  },
});

const runSignupTests = (lang: Language) => {
  test.describe(`Portfolio Page - ${lang.toUpperCase()}`, () => {
    test("should be able to change comm preferences", async ({
      portfolioPage,
    }) => {
      // navigate to comm preferences
      await portfolioPage.openMenu();
      await portfolioPage.openSettings();
      await portfolioPage.changeMenuCommPreferences();

      await portfolioPage.page.waitForResponse(
        (resp) =>
          resp.url().includes("/api/account/communications/preferences") &&
          resp.request().method() === "GET" &&
          resp.status() === 200,
      );

      await expect(portfolioPage.commPreferencesButton).toBeVisible();
      await expect(portfolioPage.commOptionsEmailInput).toBeVisible();
      await portfolioPage.changeCommPreferences();
      await expect(portfolioPage.commOptionsEmailInput).toBeChecked();
    });

    test("should be able to sign out", async ({ portfolioPage }) => {
      await portfolioPage.openMenu();
      expect(portfolioPage.logoutButton).toBeVisible();
      await portfolioPage.logout();
      await expect(portfolioPage.page).toHaveURL(/login/);
    });

    test("should be able to switch language", async ({ portfolioPage }) => {
      const targetLanguage = lang === "en" ? "fr" : "en";
      const expectedUrlPart = targetLanguage === "fr" ? "/fr" : "/";
      const portfolioText =
        targetLanguage === "fr" ? "Mon portfolio" : "My Portfolio";

      await portfolioPage.openMenu();
      await expect(portfolioPage.languageSwitchButton).toContainText(
        targetLanguage.toUpperCase(),
      );

      await portfolioPage.switchLanguage();
      await portfolioPage.page.waitForResponse(
        (resp) =>
          resp.url().includes(`/${targetLanguage}.json`) &&
          resp.request().method() === "GET" &&
          resp.status() === 200,
      );
      await expect(portfolioPage.page).toHaveURL(new RegExp(expectedUrlPart));
      await expect(portfolioPage.portfolioButton).toHaveText(portfolioText);
    });

    // TODO: Question: should banner login page be visible ?
    test("should see warning when logged in user access signup page", async ({
      portfolioPage,
    }) => {
      const url =
        selectedLanguage === "fr"
          ? "https://app.qa.nesto.ca/fr/signup"
          : "https://app.qa.nesto.ca/signup";
      await portfolioPage.page.goto(url);
      await expect(portfolioPage.page.getByTestId("banner")).toBeVisible();

      const redirectLink = selectedLanguage === "fr" ? "/fr" : "/";
      await expect(
        portfolioPage.page.getByText(
          await helper.getLocaleText("alreadyloggedInWarning"),
        ),
      ).toBeVisible();
      await expect(
        portfolioPage.page.getByText(
          await helper.getLocaleText("alreadyloggedInLink"),
        ),
      ).toHaveAttribute("href", redirectLink);
    });

    // List of other scenarios to be implemented
    // test.skip('should be able to delete account', async ({ portfolioPage }) => {;
    // });

    // test('should validate privacy policy href', async () => {
    // });

    // test('should be able to logout', async () => {
    // });

    // test('should be able to navigate to new mortgage page', async () => {
    // });

    // test('hould be able to navigate to mortgage renewal page', async () => {
    // });

    // test('Pshould be able to navigate to refinance mortgage page', async () => {
    // });
  });
};

runSignupTests(selectedLanguage);
