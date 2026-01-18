import * as path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const consentFilePath = path.join(__dirname, "../../playwright/.auth/consent.json");

type Language = "en" | "fr";
const selectedLanguage = (process.env.LANGUAGE?.toLowerCase() as Language) || "en";

export function getLocaleData() {
  const localeMap = {
    en: "en-EN.json",
    fr: "fr-FR.json",
  };

  const localeFile = localeMap[selectedLanguage];
  const localePath = path.join(
    path.dirname(new URL(import.meta.url).pathname),
    "..",
    "locales",
    localeFile,
  );
  const data = fs.readFileSync(localePath, "utf-8");
  return JSON.parse(data);
}

export function getLocaleText(key: string, pageLocale: string = "signupPage") {
  const localeData = getLocaleData()[pageLocale];
  return localeData[key];
}

export function switchSignupLanguage(currentLanguage: string) {
  const targetLanguage = currentLanguage === "en" ? "fr" : "en";
  const expectedUrlPath =
    targetLanguage === "fr" ? "/fr/signup" : "/signup";
  const headerText =
    targetLanguage === "fr"
      ? "Créez un compte nesto"
      : "Create a nesto account";

  return { targetLanguage, expectedUrlPath, headerText };
}

export function switchPortfolioLanguage(currentLanguage: string) {
  const targetLanguage = currentLanguage === "en" ? "fr" : "en";
  const expectedUrlPart = targetLanguage === "fr" ? "/fr" : "/";
  const portfolioText =
        targetLanguage === "fr" ? "Mon portfolio" : "My Portfolio";

  return { targetLanguage, expectedUrlPart, portfolioText };
}

export function getSignupUrl(currentLanguage: string) {
    const signUpUrl =
      currentLanguage === "fr"
        ? "/fr/signup"
        : "/signup";
    return signUpUrl;
  }
