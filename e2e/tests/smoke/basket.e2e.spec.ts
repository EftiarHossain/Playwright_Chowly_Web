import { test, expect } from "@playwright/test";
import { test as testWithFixture } from "../../fixtures/base";

test.describe("Basket", () => {
  testWithFixture.beforeEach(async ({ page, storeLocatorsPage, storePage }) => {
    await page.goto(`/locations`);

    await page.evaluate(() => window.localStorage.clear());

    await storeLocatorsPage.searchLocationsByGivenAddress("10004");

    await storeLocatorsPage.clickOnLocationCardOrderNowCTA({
      cardPosition: 1,
    });

    await storePage.addMenuProductToBasket({ productPosition: 1 });

    await storePage.clickBasketButton();
  });

  testWithFixture(
    `should navigate to locators page when clicking on Change Location link`,
    async ({ storeLocatorsPage, basketPage, page }) => {
      await basketPage.clickChangeLocationLink();

      await storeLocatorsPage.searchLocationsInput.waitFor();
      const url = page.url();

      expect(url).not.toContain("store");
      expect(url).toMatch(/\/$/);
    }
  );

  testWithFixture(
    `should remove item from basket when clicking on Remove link`,
    async ({ basketPage }) => {
      await basketPage.removeItem({ position: 1 });
    }
  );

  testWithFixture(
    `should add cross-sell item to basket when clicking on Add cross-sell item`,
    async ({ basketPage }) => {
      await basketPage.addCrossSellItem();
    }
  );

  testWithFixture(
    "should display PDP modal when clicking on product",
    async ({ basketPage }) => {
      await basketPage.clickOnProductItem({ position: 1 });
    }
  );

  testWithFixture(
    "should navigate to checkout page when clicking on Checkout button",
    async ({ basketPage, page }) => {
      await basketPage.clickCheckoutButton();

      const url = page.url();

      expect(url).not.toContain("store");
      expect(url).toMatch(/checkout/);
    }
  );

  testWithFixture(
    'hitting on the "back to menu" button, should close the basket',
    async ({ storePage, basketPage }) => {
      await basketPage.clickOnBackToMenuButton();
      await expect(storePage.basketItemHeader).not.toBeVisible;
    }
  );
});
