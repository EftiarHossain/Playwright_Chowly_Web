import { test, expect } from "@playwright/test";
import { test as testWithFixture } from "../../fixtures/base";

test.describe("Product Details", () => {
  testWithFixture.beforeEach(async ({ page, storeLocatorsPage }) => {
    await page.goto(`/locations`);
    await page.evaluate(() => window.localStorage.clear());
    await storeLocatorsPage.searchLocationsByGivenAddress("10004");
    await storeLocatorsPage.clickOnLocationCardOrderNowCTA({
      cardPosition: 1,
    });
  });

  testWithFixture(
    `should increase the product quantity`,
    async ({ storePage, productDetailsPage }) => {
      await storePage.clickOnMenuProductCard({ cardPosition: 2 });
      await productDetailsPage.selectEveryFirstOptions();
      await productDetailsPage.increaseProductQuantity();
      const productsInBasket =
        await storePage.getNumberOfItemsDisplayedOnBasket();
      expect(productsInBasket).toEqual(2);
    }
  );

  testWithFixture(
    `should decrease the product quantity`,
    async ({ productDetailsPage, storePage }) => {
      await storePage.clickOnMenuProductCard({ cardPosition: 2 });
      await productDetailsPage.selectEveryFirstOptions();
      await productDetailsPage.increaseProductQuantity();
      await storePage.openProductFromBasket();
      await productDetailsPage.decreaseproductQuantity();
      const productsInBasket =
        await storePage.getNumberOfItemsDisplayedOnBasket();
      expect(productsInBasket).toEqual(1);
    }
  );

  testWithFixture(
    `should select required options of a product`,
    async ({ storePage, productDetailsPage }) => {
      await storePage.clickOnMenuProductCard({ cardPosition: 7 });
      await productDetailsPage.selectProductWithRequiredOption();
    }
  );

  testWithFixture(
    `should validate product details page components`,
    async ({ productDetailsPage, storePage }) => {
      await storePage.clickOnMenuProductCard({ cardPosition: 1 });
      expect(productDetailsPage.productDetailHeader).toBeVisible;
      await expect(productDetailsPage.productDetailHeader).toContainText(
        "Hamburger"
      );
      expect(productDetailsPage.productDetailParagraph).toBeVisible;
      await expect(productDetailsPage.productDetailParagraph).toContainText(
        "Grass Fed 8 oz. Beef Patty, Lettuce, Tomato, and Onion."
      );
      expect(productDetailsPage.productCalories).toBeVisible;
      expect(productDetailsPage.addToBagButton).toBeVisible;
    }
  );

  testWithFixture(
    `should add guest amount `,
    async ({ productDetailsPage, storePage, basketPage }) => {
      await storePage.clickOnMenuProductCard({ cardPosition: 2 });
      await productDetailsPage.selectEveryFirstOptions();
      await productDetailsPage.guestAmountAdd("4");
      await storePage.clickBasketButton();
      await expect(basketPage.guestAmountInBasket).toContainText('"4"');
    }
  );
  testWithFixture(
    `should add receipt name `,
    async ({ productDetailsPage, storePage, basketPage }) => {
      await storePage.clickOnMenuProductCard({ cardPosition: 2 });
      await productDetailsPage.selectEveryFirstOptions();
      await productDetailsPage.receiptNameAdd("Tamrin");
      await storePage.clickBasketButton();
      await expect(basketPage.receiptName).toContainText("Tamrin");
    }
  );

  testWithFixture(
    `should update product from basket `,
    async ({ productDetailsPage, storePage }) => {
      await storePage.clickOnMenuProductCard({ cardPosition: 2 });
      await productDetailsPage.selectEveryFirstOptions();
      await productDetailsPage.clickAddProductToBasket();
      await storePage.openProductFromBasket();
      await productDetailsPage.selectEveryFirstOptions();
      const textFromElement2 =
        await productDetailsPage.selectEverySecondOptions();
      await productDetailsPage.clickAddProductToBasket();
      const textFromElement1 =
        await storePage.productOptionNamesInBasket.innerText();
      const cleanedExpectedSubstring = textFromElement1
        .replace(/, /g, ",")
        .replace(/,/, ", ");

      expect(cleanedExpectedSubstring).toContain(textFromElement2[0]);
    }
  );

  testWithFixture(
    `Verify user can close the product details page`,
    async ({ productDetailsPage, storePage }) => {
      await storePage.clickOnMenuProductCard({ cardPosition: 2 });
      await productDetailsPage.productDetailsPageClose();
      expect(storePage.menuCategories).toBeFocused;
    }
  );
});
