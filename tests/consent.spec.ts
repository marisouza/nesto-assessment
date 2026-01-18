import { test as baseTest, expect } from "@playwright/test";
import { ConsentPage } from "../pages/consentPage";
import * as helper from "../helpers/helper";

const test = baseTest.extend<{ consentPage: ConsentPage }>({
  consentPage: async ({ page }, use) => {
    const language = selectedLanguage;
    const consentPage = new ConsentPage(page, language);
    await consentPage.goTo();
    await use(consentPage);
  },
});

type Language = "en" | "fr";
const selectedLanguage =
  (process.env.LANGUAGE?.toLowerCase() as Language) || "en";

const runSignupTests = (lang: Language) => {
  test.describe(`Consent Page - ${lang.toUpperCase()}`, { tag: '@consent' }, () => {
    test.describe("First Visit", () => {
      test.use({ storageState: { cookies: [], origins: [] } });

      test("should show consent on first visit", async ({ consentPage }) => {
        const expectedAcceptText = helper.getLocaleText(
          "consentAcceptButton",
        );
        const expectedLearnMoreText = helper.getLocaleText(
          "consentLearnMoreButton",
        );
        const expectedPartnersText = helper.getLocaleText(
          "consentPartnersButton",
        );

        await expect(consentPage.consentModal, 'Consent modal should be visible on first visit').toBeVisible();
        await expect(consentPage.agreeButton, 'Agree button should have correct text').toContainText(expectedAcceptText);
        await expect(consentPage.learnMoreButton, 'Learn More button should have correct text').toContainText(
          expectedLearnMoreText,
        );
        await expect(consentPage.partners, 'Partners link should have correct text').toContainText(expectedPartnersText);
      });
    });

    test.describe("Returning User", () => {
      test("should not show consent to a user that already accepted it", async ({ consentPage }) => {
        await consentPage.consentModal.waitFor({ state: 'hidden' });
        const isHiddenAfterReload = await consentPage.isConsentVisible();
        await expect(isHiddenAfterReload, 'Consent modal should not be visible for returning users').toBe(false);
      });
    });
  });
};

runSignupTests(selectedLanguage);
