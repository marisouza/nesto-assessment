import { test, expect } from "@playwright/test";
import { ConsentPage } from "../pages/consentPage";
import * as helper from "./helper/helper";

type Language = "en" | "fr";
const selectedLanguage =
  (process.env.LANGUAGE?.toLowerCase() as Language) || "en";

const runSignupTests = (lang: Language) => {
  test.describe(`Consent Page - ${lang.toUpperCase()}`, () => {
    let consentPage: ConsentPage;

    test.beforeEach(async ({ page }) => {
      consentPage = new ConsentPage(page, lang);
      await consentPage.goto();
      await consentPage.consentModal.waitFor({ state: 'visible' });
    });

    test("should show consent on first visit", async () => {
      const expectedAcceptText = await helper.getLocaleText(
        "consentAcceptButton",
      );
      const expectedLearnMoreText = await helper.getLocaleText(
        "consentLearnMoreButton",
      );
      const expectedPartnersText = await helper.getLocaleText(
        "consentPartnersButton",
      );

      await expect(consentPage.consentModal).toBeVisible();
      await expect(consentPage.agreeButton).toContainText(expectedAcceptText);
      await expect(consentPage.learnMoreButton).toContainText(
        expectedLearnMoreText,
      );
      await expect(consentPage.partners).toContainText(expectedPartnersText);
    });

    test("should not show consent after accepting it", async () => {
      await expect(consentPage.consentModal).toBeVisible();
      await consentPage.acceptConsent();

      const isHidden = await consentPage.isConsentNotVisible();
      await expect(isHidden).toBe(true);

      consentPage.page.reload();
       await consentPage.consentModal.waitFor({ state: 'hidden' });
      const isHiddenAfterReload = await consentPage.isConsentNotVisible();
      await expect(isHiddenAfterReload).toBe(true);
    });
  });
};

runSignupTests(selectedLanguage);
