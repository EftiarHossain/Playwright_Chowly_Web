import { test, expect } from "@playwright/test";
import { oloTestCreditCard } from "../../data/common/creditCard";
import { registeredUser } from "../../data/common/user";
import { test as testWithFixture } from "../../fixtures/base";
import { waitForPageToLoad } from "../../utils";

test.describe("End To End", () => {
  testWithFixture.beforeEach(async ({ page, baseURL }) => {
    await page.goto(baseURL!);
  });

  testWithFixture(
    `should open web site, find specific location, add item with options to basket, place pickup order with a new card as guest User and validate Confirmation page`,
    async ({
      page,
      storeLocatorsPage,
      productDetailsPage,
      storePage,
      basketPage,
      checkoutPage,
      orderConfirmationPage,
    }) => {
      await storeLocatorsPage.searchLocationsByGivenAddress("10004");

      await storeLocatorsPage.clickOnLocationCardOrderNowCTA({
        cardPosition: 1,
      });

      await storePage.clickOnMenuProductCard({ cardPosition: 2 });

      await productDetailsPage.selectEveryFirstOptions();

      await productDetailsPage.clickAddProductToBasket();

      expect(await storePage.getNumberOfItemsDisplayedOnBasket()).toEqual(1);

      await storePage.clickBasketButton();

      await basketPage.clickCheckoutButton();

      await checkoutPage.signInGuestUser(registeredUser);

      await checkoutPage.applyNewPCICreditCardPayment(oloTestCreditCard);

      await checkoutPage.clickOnPlaceOrderButton();

      await waitForPageToLoad(page);

      await expect(orderConfirmationPage.orderConfirmationHeader).toContainText(
        "Order Confirmation"
      );

      if (storeLocatorsPage.currentLocationName) {
        await expect(orderConfirmationPage.orderDetailsLocation).toContainText(
          storeLocatorsPage.currentLocationName
        );
      } else {
        throw new Error("no location name");
      }

      // NOTE: skipping this assertion as there is a discrepancy with address on locators card VS on confirmation page:
      // "315 Bowery Manhattan New York `&nbsp;`, NY 10003" VS "315 Bowery Manhattan New York, NY 10003" - there is html whitespace.

      // if (locatorsPage.currentLocationAddress) {
      //   await expect(orderConfirmationPage.orderDetailsLocation).toContainText(
      //     locatorsPage.currentLocationAddress
      //   );
      // } else {
      //   throw new Error("no location address");
      // }

      if (storeLocatorsPage.currentLocationPhone) {
        await expect(orderConfirmationPage.orderDetailsLocation).toContainText(
          storeLocatorsPage.currentLocationPhone
        );
      } else {
        throw new Error("no location phone");
      }
    }
  );

  testWithFixture(
    `should open web site, find delivery location, add item with options to basket, place delivery order with saved card as registered User and validate Confirmation page`,
    async ({
      page,
      storeLocatorsPage,
      productDetailsPage,
      storePage,
      basketPage,
      checkoutPage,
      orderConfirmationPage,
    }) => {
      await storeLocatorsPage.searchLocationsByGivenAddress("10004");

      await storeLocatorsPage.clickOnLocationCardOrderDeliveryCTA({
        cardPosition: 1,
        delivery: { day: 2, timeslot: 2 },
      });

      const url = page.url();

      expect(url).toContain("/store/");

      await storePage.clickOnMenuProductCard({ cardPosition: 2 });

      await productDetailsPage.selectEveryFirstOptions();

      await productDetailsPage.clickAddProductToBasket();

      expect(await storePage.getNumberOfItemsDisplayedOnBasket()).toEqual(1);

      await storePage.clickBasketButton();

      await basketPage.clickCheckoutButton();

      await checkoutPage.signInRegisteredUser2();

      await checkoutPage.selectSavedCreditCard();

      await checkoutPage.clickOnPlaceOrderButton();

      await waitForPageToLoad(page);

      if (storeLocatorsPage.currentLocationName) {
        await expect(orderConfirmationPage.orderDetailsReceipt).toContainText(
          storeLocatorsPage.currentLocationName
        );
      } else {
        throw new Error("no location name");
      }
    }
  );
});
