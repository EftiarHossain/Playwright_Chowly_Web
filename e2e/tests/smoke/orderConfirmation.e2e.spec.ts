import { test, expect } from "@playwright/test";
import { registeredUser } from "../../data/common/user";
import { test as testWithFixture } from "../../fixtures/base";

test.describe("Order Confirmation", () => {
  testWithFixture.beforeEach(
    async ({
      page,
      storeLocatorsPage,
      storePage,
      basketPage,
      checkoutPage,
    }) => {
      await page.goto(`/locations`);
      await page.evaluate(() => window.localStorage.clear());
      await storeLocatorsPage.searchLocationsByGivenAddress("60613");
      await storeLocatorsPage.clickOnLocationCardOrderNowCTA({
        cardPosition: 1,
      });
      await storePage.addMenuProductToBasket({ productPosition: 1 });
      await storePage.clickBasketButton();
      await basketPage.clickCheckoutButton();
      const url = page.url();
      expect(url).not.toContain("store");
      expect(url).toMatch(/checkout/);
      await checkoutPage.signInRegisteredUser(registeredUser);
    }
  );
  testWithFixture(
    `Should display the correct Confirmation page, Location info and Payment info when user navigates to the Order Confirmation page`,
    async ({
      page,
      checkoutPage,
      orderConfirmationPage,
      storeLocatorsPage,
    }) => {
      await checkoutPage.addCustomTip("Custom", "100");
      await checkoutPage.addGiftCard("5000000000000000", "");
      await checkoutPage.selectSavedCreditCard();
      await checkoutPage.clickOnPlaceOrderButton();
      const url = page.url();
      expect(url).not.toContain("/checkout/");
      expect(url).toMatch(/order-confirmation/);
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

      if (storeLocatorsPage.currentLocationPhone) {
        await expect(orderConfirmationPage.orderDetailsLocation).toContainText(
          storeLocatorsPage.currentLocationPhone
        );
      } else {
        throw new Error("no location phone");
      }
      await expect(orderConfirmationPage.orderDetailsPayment).toContainText(
        "Gift card,"
      );
      await expect(orderConfirmationPage.orderDetailsPayment).toContainText(
        "Account"
      );
    }
  );
});
