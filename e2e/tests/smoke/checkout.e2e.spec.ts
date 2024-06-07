import { test, expect } from "@playwright/test";
import { oloTestCreditCard } from "../../data/common/creditCard";
import { guestUser, registeredUser } from "../../data/common/user";
import { test as testWithFixture } from "../../fixtures/base";

test.describe("Checkout as sign In user", () => {
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
    `Should show all the handsoff details when user navigate to checkout and default selection is In store`,
    async ({ checkoutPage }) => {
      await checkoutPage.verifyHandsoffDetails();
      await expect(checkoutPage.inStoreRadioButton).toBeChecked();
    }
  );

  testWithFixture(
    `Should display valid curbside info when user select the curbside pickup and input curbside details`,
    async ({ checkoutPage }) => {
      await checkoutPage.selectAndInputCurbsideDetails(
        "Toyota",
        "Premio 2018",
        "Cherry red wine"
      );
    }
  );

  testWithFixture(
    `Should update order delivery date and time when user selets future date and time`,
    async ({ checkoutPage }) => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const year = tomorrow.getFullYear();
      const month = (tomorrow.getMonth() + 1).toString().padStart(2, "0");
      const day = tomorrow.getDate().toString().padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      const formattedTimeIndex = 3;
      await checkoutPage.changeOrderDateAndTime(
        formattedDate,
        formattedTimeIndex
      );
    }
  );

  testWithFixture(
    `Should add tip on the total & subtotal amount on checkout when user selects 10% tip`,
    async ({ checkoutPage }) => {
      await checkoutPage.addTip("10");
      const tipAmount = await checkoutPage.getSelectedTipAmount();
      await checkoutPage.tipAmountInfo.waitFor();
      await expect(checkoutPage.tipAmountInfo).toContainText(tipAmount);
    }
  );

  testWithFixture(
    `Should add tip on the total & subtotal amount on checkout when user selects and input custom tip amount`,
    async ({ checkoutPage }) => {
      await checkoutPage.addCustomTip("Custom", "10");
      const tipAmount = await checkoutPage.getSelectedTipAmount();
      await checkoutPage.tipAmountInfo.waitFor();
      await expect(checkoutPage.tipAmountInfo).toContainText(tipAmount);
    }
  );

  testWithFixture(
    `Should add discount on the total & subtotal amount on checkout after applying valid coupon`,
    async ({ checkoutPage }) => {
      const visible = await checkoutPage.couponInputField.isVisible();
      if (visible) {
        await checkoutPage.addCoupon("test");
        await expect(checkoutPage.discount).toBeVisible();
        await expect(checkoutPage.removeDiscount).toBeVisible();
      } else console.error("coupon input field is not present");
    }
  );

  testWithFixture(
    `Should remove discount on the total & subtotal amount on checkout after removing applied coupon`,
    async ({ checkoutPage }) => {
      const visible = await checkoutPage.couponInputField.isVisible();
      if (visible) {
        await checkoutPage.addCoupon("test");
        await checkoutPage.removeCoupon();
        await expect(checkoutPage.removeDiscount).toBeHidden();
      } else console.error("coupon input field is not present");
    }
  );

  testWithFixture(
    `Gift card should be added when user apply valid gift card on checkout`,
    async ({ checkoutPage }) => {
      await checkoutPage.addGiftCard("5000000000000000", "");
      await expect(checkoutPage.giftCardNumber).toBeHidden();
      await expect(checkoutPage.removeGiftCardButton).toBeVisible();
    }
  );

  testWithFixture(
    `Gift card should be removed when user removed applied gift card on checkout`,
    async ({ checkoutPage }) => {
      await checkoutPage.addGiftCard("5000000000000000", "");
      await checkoutPage.removeGiftCard();
      await expect(checkoutPage.giftCardNumber).toBeVisible();
      await expect(checkoutPage.removeGiftCardButton).toBeHidden();
    }
  );

  testWithFixture(
    `Should submit an order when user select payment method Pay In Store(Cash)`,
    async ({ checkoutPage, page, orderConfirmationPage }) => {
      await checkoutPage.clickOnPayInStore();
      await checkoutPage.clickOnPlaceOrderButton();
      const url = page.url();
      expect(url).not.toContain("/checkout/");
      expect(url).toMatch(/order-confirmation/);
      await orderConfirmationPage.verifyPaymentInfo("Cash");
    }
  );

  testWithFixture(
    `Should submit an order when user pay with a newly added credit card`,
    async ({ page, checkoutPage, orderConfirmationPage }) => {
      await checkoutPage.applyNewPCICreditCardPayment(oloTestCreditCard);
      await checkoutPage.clickOnPlaceOrderButton();
      const url = page.url();
      expect(url).not.toContain("/checkout/");
      expect(url).toMatch(/order-confirmation/);
      await orderConfirmationPage.verifyPaymentInfo(
        oloTestCreditCard.cardNumber.slice(-4)
      );
    }
  );

  testWithFixture(
    `Should submit an order when user selects saved credit card as payment method`,
    async ({ checkoutPage, page, orderConfirmationPage }) => {
      await checkoutPage.selectSavedCreditCard();
      await checkoutPage.clickOnPlaceOrderButton();
      const url = page.url();
      expect(url).not.toContain("/checkout/");
      expect(url).toMatch(/order-confirmation/);
      await orderConfirmationPage.verifyPaymentInfo("Account");
    }
  );

  testWithFixture(
    `Should submit an order when user place order with a valid gift card`,
    async ({ page, checkoutPage, orderConfirmationPage }) => {
      await checkoutPage.addGiftCard("5000000000000000", "");
      await checkoutPage.clickOnPlaceOrderButton();
      const url = page.url();
      expect(url).not.toContain("/checkout/");
      expect(url).toMatch(/order-confirmation/);
      await orderConfirmationPage.verifyPaymentInfo("Gift card");
    }
  );

  testWithFixture(
    `Should submit an order when user pay with partial gift card and saved credit card`,
    async ({ page, checkoutPage, orderConfirmationPage }) => {
      await checkoutPage.addCustomTip("Custom", "100");
      await checkoutPage.addGiftCard("5000000000000000", "");
      await checkoutPage.selectSavedCreditCard();
      await checkoutPage.clickOnPlaceOrderButton();
      const url = page.url();
      expect(url).not.toContain("/checkout/");
      expect(url).toMatch(/order-confirmation/);
      await orderConfirmationPage.verifyPaymentInfo("Gift card,");
      await orderConfirmationPage.verifyPaymentInfo("Account");
    }
  );

  testWithFixture(
    `Should delete a saved credit card when user remove credit card from payment method`,
    async ({ checkoutPage }) => {
      await checkoutPage.removeCreditCard();
    }
  );
});

test.describe("Checkout as guest user", () => {
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
      await checkoutPage.signInGuestUser(guestUser);
    }
  );

  testWithFixture(
    `Should show all the handsoff details when user navigate to checkout and default selection is In store`,
    async ({ checkoutPage }) => {
      await checkoutPage.verifyHandsoffDetails();
      await expect(checkoutPage.inStoreRadioButton).toBeChecked();
    }
  );
});
