import { test, expect } from "@playwright/test";
import { test as testWithFixture } from "../../fixtures/base";

test.describe("Store", () => {
  testWithFixture.beforeEach(async ({ page, storeLocatorsPage }) => {
    await page.goto(`/locations`);

    await page.evaluate(() => window.localStorage.clear());

    await storeLocatorsPage.searchLocationsByGivenAddress("10004");

    await storeLocatorsPage.clickOnLocationCardOrderNowCTA({
      cardPosition: 1,
    });
  });

  testWithFixture(
    `should add product to basket from popular products widget`,
    async ({ storePage }) => {
      await storePage.addPopularProductToBasket({ productPosition: 1 });

      const productsInBasket =
        await storePage.getNumberOfItemsDisplayedOnBasket();

      expect(productsInBasket).toEqual(1);
    }
  );

  testWithFixture(
    `should add product to basket main menu`,
    async ({ storePage }) => {
      await storePage.addMenuProductToBasket({ productPosition: 1 });

      const productsInBasket =
        await storePage.getNumberOfItemsDisplayedOnBasket();

      expect(productsInBasket).toEqual(1);
    }
  );

  testWithFixture(
    `should filter products by category after clicking on category`,
    async ({ page, storePage }) => {
      await storePage.clickOnCategory({ categoryPosition: 1 });

      expect(storePage.currentSelectedCategoryName).toBeTruthy();

      await expect(
        page.getByRole("heading", {
          name: storePage.currentSelectedCategoryName!,
        })
      ).toBeInViewport();
    }
  );
  testWithFixture(
    "should search products and add to cart",
    async ({ page, storePage }) => {
      await storePage.clickOnCategory({ categoryPosition: 1 });

      expect(storePage.currentSelectedCategoryName).toBeTruthy();

      await expect(
        page.getByRole("heading", {
          name: storePage.currentSelectedCategoryName!,
        })
      ).toBeInViewport();
    }
  );
  testWithFixture(
    `should search for valid product using search box`,
    async ({ storePage }) => {
      await storePage.searchForProduct();
      await storePage.searchProduct.type("ham");
      await storePage.clickProductFromSearchResult();
      await expect(storePage.pdpHeader).toContainText("Hamburger");
    }
  );
  testWithFixture(
    `should validate search for invalid product name`,
    async ({ storePage }) => {
      await storePage.searchForProduct();
      await storePage.searchProduct.type("dhjdshfjf");
      await expect(storePage.noSearchResult).toContainText("No search results");
    }
  );
});
