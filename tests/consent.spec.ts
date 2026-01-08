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
    });

    // TODO: add scenario that consent is acceptaded and page reload the consent is not shown again
    test("should not show consent after first acceptance", async ({ page }) => {
      await helper.applyConsent(page);
      await consentPage.goto();

      const cookies = await consentPage.page.context().cookies();
      const localStorage = await consentPage.page.evaluate(() =>
        Object.assign({}, window.localStorage),
      );

      const isHidden = await consentPage.isConsentNotVisible();
      await expect(isHidden).toBe(true);
      await expect(
        cookies.find((cookie) => cookie.name === "didomi_token"),
      ).not.toBeNull();
      await expect(
        cookies.find((cookie) => cookie.name === "euconsent-v2"),
      ).not.toBeNull();
      await expect(localStorage["euconsent-v2"]).not.toBeNull();
    });

    test("should show consent on first visit", async () => {
      await consentPage.goto();
      const isVisible = await consentPage.isConsentVisible();

      const expectedAcceptText = await helper.getLocaleText(
        "consentAcceptButton",
      );
      const expectedLearnMoreText = await helper.getLocaleText(
        "consentLearnMoreButton",
      );
      const expectedPartnersText = await helper.getLocaleText(
        "consentPartnersButton",
      );

      await expect(isVisible).toBe(true);
      await expect(consentPage.agreeButton).toContainText(expectedAcceptText);
      await expect(consentPage.learnMoreButton).toContainText(
        expectedLearnMoreText,
      );
      await expect(consentPage.partners).toContainText(expectedPartnersText);
    });
  });
};

runSignupTests(selectedLanguage);
