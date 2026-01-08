import { Page } from "@playwright/test";
import * as path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const consentFile = path.join(__dirname, "./consent.json");
type Language = "en" | "fr";

export async function applyConsent2(page: Page) {
  // Fake consent values
  // const didomi = 'eyJ1c2VyX2lkIjoiMTliOTBmOGItYTU1OC02YjY2LWJkMGEtNTVkODFkNzIzYjNmIiwiY3JlYXRlZCI6IjIwMjYtMDEtMDZUMDE6NDI6NTguMzg5WiIsInVwZGF0ZWQiOiIyMDI2LTAxLTA2VDAxOjQ5OjQ5LjI3M1oiLCJ2ZW5kb3JzIjp7ImVuYWJsZWQiOlsiZ29vZ2xlIiwiYzpnb29nbGVhbmEtNFRYbkppZ1IiLCJjOnN3aXRjaGdyby1lZ0FUSmh4SiIsImM6dW5ib3VuY2UiLCJjOmxpbmtlZGluIiwiYzptaWNyb3NvZnQiLCJjOmxhcHJlc3NlLXFiaFVxUW1mIiwiYzpjb252ZXJ0ZXgtekE4cldyVUQiXX0sInB1cnBvc2VzIjp7ImVuYWJsZWQiOlsiYWR2ZXJ0aXNpbi03V2QyNFJLaiIsInBlcmZvcm1hbmMtRVJQWGZyRmIiXX0sInZlbmRvcnNfbGkiOnsiZW5hYmxlZCI6WyJnb29nbGUiXX0sInZlcnNpb24iOjIsImFjIjoiQUZtQUNBRmsuQUZtQUNBRmsifQ==';
  // const eu = 'CQdmyUAQdmyUAAHABBENCMFgAP_AAELAAAAAGMwAgF5gMZAvOACAvMAA.f_gACFgAAAAA';

  const data = fs.readFileSync(consentFile, "utf-8");
  const didomi = process.env.DIDOMI
    ? process.env.DIDOMI
    : JSON.parse(data).didomi_token;
  const eu = process.env.EUCONSENT
    ? process.env.EUCONSENT
    : JSON.parse(data)["euconsent-v2"];

  console.log("Applying consent with didomi:", didomi);
  console.log("Applying consent with euconsent-v2:", eu);

  // Set localStorage via addInitScript
  await page.addInitScript(
    ([didomi, eu]) => {
      try {
        localStorage.setItem("didomi_token", didomi);
        localStorage.setItem("euconsent-v2", eu);
      } catch (e) {
        // Ignore in environments where access is restricted
        console.error(
          "Could not set localStorage didomi and euconsent-v2 items for consent:",
          e,
        );
      }
    },
    [didomi, eu],
  );

  // Set cookies
  await page.context().addCookies([
    {
      name: "didomi_token",
      value: didomi,
      domain: "app.qa.nesto.ca",
      path: "/",
      secure: true,
      httpOnly: false,
      sameSite: "Lax",
    },
    {
      name: "euconsent-v2",
      value: eu,
      domain: "app.qa.nesto.ca",
      path: "/",
      secure: true,
      httpOnly: false,
      sameSite: "Lax",
    },
  ]);
}

async function getLocaleData() {
  const selectedLanguage =
    (process.env.LANGUAGE?.toLowerCase() as Language) || "en";
  const localeMap = {
    en: "en-EN.json",
    fr: "fr-FR.json",
  };

  const localeFile = localeMap[selectedLanguage];
  const localePath = path.join(
    path.dirname(new URL(import.meta.url).pathname),
    "../..",
    "resources",
    "locales",
    localeFile,
  );
  const data = fs.readFileSync(localePath, "utf-8");
  return JSON.parse(data);
}

export async function getLocaleText(key: string) {
  const localeData = await getLocaleData();
  return localeData[key];
}
