import { type Page } from "@playwright/test";

export const getNumberFromString = (str: string): number | null => {
  const numbers = /\d+/i.exec(str);

  if (!numbers) {
    return null;
  }

  const result = parseInt(numbers.join());

  return isNaN(result) ? null : result;
};

/**
 * Critical Helper function that waits for the page to fully load.
 *
 * Most of the e2e actions performed too quickly resulting in app not handling loading state correctly.
 * We need to wait till app finishes loading before performing some of the actions.
 *
 * Sometimes - we don't want to wait for network idle - as it is ok to let network requests to finish after page is loaded.
 *
 * Examples:
 * - Filling up signin form and clicking on signin button too quickly will result in app not authenticating the user correctly.
 * - PCI proxy credit card from takes time to load on checkout page - we need to wait for it.
 */
export const waitForPageToLoad = async (
  page: Page,
  options: { waitForNetworkIdle: boolean } = { waitForNetworkIdle: true }
) => {
  await page.waitForLoadState("domcontentloaded");

  if (options.waitForNetworkIdle) {
    await page.waitForLoadState("networkidle");
  }

  await page.getByTestId("loading-indicator").waitFor({ state: "detached" });
};

export const generateRandomString = (length: number): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
};

export const generateRandomUSPhoneNumber = (): string => {
  const areaCode = Math.floor(Math.random() * (999 - 200 + 1)) + 200; // Random 3-digit area code between 200 and 999
  const centralOfficeCode = Math.floor(Math.random() * 899) + 100; // Random 3-digit central office code between 100 and 999
  const lineNumber = Math.floor(Math.random() * 8999) + 1000; // Random 4-digit line number between 1000 and 9999

  return `${areaCode}${centralOfficeCode}${lineNumber}`;
};
