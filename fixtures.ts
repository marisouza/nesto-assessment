import { test as baseTest } from "@playwright/test";

export const test = baseTest.extend<{
  language: "en" | "fr";
}>({
  language: ["en", { option: true }], // Default to 'en', can be overridden
});

export { expect } from "@playwright/test";
