import {
  expect,
  type FrameLocator,
  type Locator,
  type Page,
} from "@playwright/test";
import { type Guest, type CreditCard, type User } from "../types";
import { waitForPageToLoad } from "../utils";

export class Checkout {
  readonly page: Page;
  readonly menuListSection: Locator;

  readonly signInButton: Locator;
  readonly emailInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly phoneInput: Locator;
  readonly passwordInput: Locator;
  readonly checkoutAsGuestButton: Locator;
  readonly continueAsGuestButton: Locator;
  readonly inStoreRadioButton: Locator;
  readonly curbsideRadioButton: Locator;
  readonly dineInRadioButton: Locator;
  readonly drivethruRadioButton: Locator;
  readonly deliveryTimeTitle: Locator;
  readonly deliveryDateSelection: Locator;
  readonly deliveryTimeSelection: Locator;
  readonly tipAmountInfo: Locator;
  readonly couponInputField: Locator;
  readonly couponSubmitButton: Locator;
  readonly giftCardNumber: Locator;
  readonly giftCardPin: Locator;
  readonly giftCardApply: Locator;
  readonly newCardRadioButton: Locator;
  readonly pciCardNumberInput: Locator;
  readonly pciCvvInput: Locator;
  readonly placeOrderButton: Locator;
  readonly pciCardNumberIFrame: FrameLocator;
  readonly pciCvvIFrame: FrameLocator;
  readonly creditCardExpirationDateInput: Locator;
  readonly creditCardZipCodeInput: Locator;
  readonly applyPaymentButton: Locator;
  readonly newCardDetails: Locator;
  readonly userInfo: Locator;
  readonly payInStoreRadioButton: Locator;
  readonly payInSavedCreditCardRadioButton: Locator;
  readonly vehicleInfoTitle: Locator;
  readonly formElementVechileInfo: Locator;
  readonly vehicleMake: Locator;
  readonly vehicleModel: Locator;
  readonly vehicleColor: Locator;
  readonly vehicleInfoBlock: Locator;
  readonly applyButton: Locator;
  readonly discount: Locator;
  readonly removeDiscount: Locator;
  readonly discountBlock: Locator;
  readonly removeGiftCardButton: Locator;
  readonly locationName: Locator;
  readonly orderTotalAmount: Locator;

  constructor(page: Page) {
    this.page = page;

    this.signInButton = page.getByTestId("signin-button");
    this.emailInput = page.getByPlaceholder("Email");
    this.passwordInput = page.getByPlaceholder("Password");
    this.firstNameInput = page.getByPlaceholder("First Name");
    this.lastNameInput = page.getByPlaceholder("Last Name");
    this.phoneInput = page.getByPlaceholder("Phone Number");
    this.continueAsGuestButton = page.getByTestId("continue-as-guest-button");
    this.inStoreRadioButton = page.locator("#handoff-pickup-in-store");
    this.curbsideRadioButton = page.locator("#handoff-pickup-curbside");
    this.dineInRadioButton = page.locator("#handoff-pickup-dinein");
    this.drivethruRadioButton = page.locator("#handoff-pickup-drivethru");
    this.deliveryTimeTitle = page.getByText("Delivery Time");
    this.deliveryDateSelection = page.locator("#day_wanted");
    this.deliveryTimeSelection = page.locator("#time_wanted");
    this.tipAmountInfo = page.locator("//p[contains(text(),'Tip amount')]"); //NEED TO ADD TEST-ID HERE
    this.couponInputField = page.locator("#promo-code-form-input");
    this.couponSubmitButton = page.locator(
      '//*[@id="start-of-content"]/div/div[4]/div[2]/form/div[2]/button'
    ); //NEED TO ADD TEST-ID HERE
    this.giftCardNumber = page.locator("#gift-card-number-form-input");
    this.giftCardPin = page.locator("#gift-card-pin-form-input");
    this.giftCardApply = page.getByTestId(""); //NEED TO ADD TEST-ID HERE
    this.payInStoreRadioButton = page.locator("#pay-in-store");
    this.payInSavedCreditCardRadioButton = page.locator("#saved-card-1111-0");
    this.newCardRadioButton = page.getByTestId("new-card-radio-button");
    this.checkoutAsGuestButton = page.getByTestId("checkout-as-guest-button");
    this.pciCardNumberIFrame = page.frameLocator("#card-number > iframe");
    this.pciCvvIFrame = page.frameLocator("#cvv-number > iframe");
    this.pciCardNumberInput =
      this.pciCardNumberIFrame.getByLabel("Card Number");
    this.pciCvvInput = this.pciCvvIFrame.getByLabel("CVV");
    this.creditCardExpirationDateInput = page.getByPlaceholder("Exp. MM/YY");
    this.creditCardZipCodeInput = page.getByPlaceholder("Zip");
    this.applyPaymentButton = page.getByTestId("apply-payment-button");
    this.newCardDetails = page.getByTestId("applied-credit-card-info");
    this.userInfo = page.getByTestId("user-info-block");
    this.placeOrderButton = page.getByTestId("submit-order-button");
    this.vehicleInfoTitle = this.page.getByText("Your Vehicle Info");
    this.formElementVechileInfo = this.page.locator(
      'form[data-gtm-form-interact-id="2"]'
    );
    this.vehicleMake = this.page.getByPlaceholder("Vehicle Make");
    this.vehicleModel = this.page.getByPlaceholder("Vehicle Model");
    this.vehicleColor = this.page.getByPlaceholder("Vehicle Color");
    this.vehicleInfoBlock = this.page.locator(
      '//*[@id="start-of-content"]/div/div[4]/div[1]/div[2]/div[2]/div[2]'
    ); //need to add testID here for vehicleInfoBlock
    this.applyButton = this.formElementVechileInfo.getByText("Apply"); //need to add testID here for Apply button
    this.discount = this.page.getByText("Discount:"); //need to add testID here for Discount
    this.removeDiscount = this.page.getByText("remove discount"); //need to add testID here for Discount
    this.discountBlock = this.page.locator(
      '//*[@id="start-of-content"]/div/div[4]/div[2]/div/div[4]/div[2]'
    ); //need to add testID here for Discount
    this.removeGiftCardButton = this.page.getByText("Remove"); //need to add testID here for Discount
    this.locationName = this.page.locator(
      '//*[@id="start-of-content"]/div/div[4]/div[2]/div/div[1]/h2'
    );
    this.menuListSection = this.page.getByTestId("basket-item-label");
    this.orderTotalAmount = this.page.locator(
      '//*[@id="start-of-content"]/div/div[4]/div[2]/div/div[3]/div[4]/div[2]'
    );
  }

  async signInRegisteredUser(user: User) {
    await this.signInButton.click();
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.signInButton.click();
    await expect(this.userInfo).toBeVisible();
    await expect(this.userInfo).toContainText(user.email);
    await expect(this.userInfo).toContainText(user.firstName);
    await expect(this.userInfo).toContainText(user.lastName);
    await expect(this.userInfo).toContainText(user.phoneNumber);
  }

  async signInRegisteredUser2() {
    await this.signInButton.click();
    await this.emailInput.fill("eftiar@Koala.io");
    await this.passwordInput.fill("12345678");
    await this.signInButton.click();
  }

  async signInGuestUser(user: Guest) {
    await this.checkoutAsGuestButton.click();
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.emailInput.fill(user.email);
    await this.phoneInput.fill(user.phoneNumber);
    await this.continueAsGuestButton.click();
    await expect(this.userInfo).toBeVisible();
    await expect(this.userInfo).toContainText(user.email);
    await expect(this.userInfo).toContainText(user.firstName);
    await expect(this.userInfo).toContainText(user.lastName);
    await expect(this.userInfo).toContainText(user.phoneNumber);
  }

  async verifyHandsoffDetails() {
    await expect(this.inStoreRadioButton).toBeVisible();
    await expect(this.curbsideRadioButton).toBeVisible();
    await expect(this.dineInRadioButton).toBeVisible();
    await expect(this.drivethruRadioButton).toBeVisible();
  }

  async selectAndInputCurbsideDetails(
    vehicleCompany: string,
    vehicleModelNumber: string,
    colorOfVehicle: string
  ) {
    await expect(this.curbsideRadioButton).toBeVisible();
    await this.curbsideRadioButton.click();
    await expect(this.curbsideRadioButton).toBeChecked();
    await expect(this.vehicleInfoTitle).toBeVisible();
    await this.vehicleMake.focus();
    await this.vehicleMake.fill(vehicleCompany);
    await this.vehicleModel.focus();
    await this.vehicleModel.fill(vehicleModelNumber);
    await this.vehicleColor.focus();
    await this.vehicleColor.fill(colorOfVehicle);
    await this.page.waitForTimeout(5000);
    await this.applyButton.click();
    await expect(this.vehicleInfoBlock).toContainText(vehicleCompany);
    await expect(this.vehicleInfoBlock).toContainText(vehicleModelNumber);
    await expect(this.vehicleInfoBlock).toContainText(colorOfVehicle);
  }

  async changeOrderDateAndTime(deliveryDate: string, deliveryTime: number) {
    await this.deliveryTimeTitle.scrollIntoViewIfNeeded();
    await this.deliveryDateSelection.selectOption({
      value: deliveryDate,
    });
    await this.deliveryTimeSelection.selectOption({
      index: deliveryTime,
    });
  }

  async selectSavedCreditCard() {
    await waitForPageToLoad(this.page, {
      waitForNetworkIdle: false,
    });
    if (this.payInSavedCreditCardRadioButton) {
      await this.payInSavedCreditCardRadioButton.scrollIntoViewIfNeeded();
      await this.payInSavedCreditCardRadioButton.click();
      await expect(this.payInSavedCreditCardRadioButton).toBeChecked();
    } else {
      console.error("Saved credit card not found");
    }
  }

  async applyNewPCICreditCardPayment(creditCard: CreditCard) {
    await waitForPageToLoad(this.page, {
      waitForNetworkIdle: false,
    });

    await this.newCardRadioButton.click();
    await this.pciCardNumberInput.waitFor();
    await this.pciCvvInput.waitFor();
    await this.pciCardNumberInput.fill(creditCard.cardNumber);
    await this.pciCvvInput.fill(creditCard.cvv);
    await this.creditCardExpirationDateInput.fill(creditCard.expirationDate);
    await this.creditCardZipCodeInput.fill(creditCard.zipCode);
    await this.applyPaymentButton.click();
    await expect(this.newCardDetails).toBeVisible();
    await expect(this.newCardDetails).toContainText(
      creditCard.cardNumber.slice(-4)
    );
  }

  async addTip(tipPercent: string) {
    await waitForPageToLoad(this.page, {
      waitForNetworkIdle: false,
    });
    // The text on the button
    const buttonText = tipPercent;
    // Find the button element with specific text
    const buttonSelector = `button:has-text("${buttonText}")`;
    const buttonElement = await this.page.waitForSelector(buttonSelector);
    await buttonElement.click();
    await this.page.waitForTimeout(3000);
  }

  async addCustomTip(tipType: string, customAmount: string) {
    // The text on the button
    const buttonText = tipType;
    // Find the button element with specific text
    const buttonSelector = `button:has-text("${buttonText}")`;
    const buttonElement = await this.page.waitForSelector(buttonSelector);
    await buttonElement.click();
    const customTipInput = this.page.locator("#tip-amount-form-input");
    await customTipInput.focus();
    await customTipInput.clear();
    await customTipInput.fill(customAmount);
    await this.page.waitForTimeout(3000);
  }

  async getSelectedTipAmount() {
    const tipLabel = "//p[contains(text(),'Tip amount:')]"; // The xpath of the element as test-ID is not present
    const element = await this.page.waitForSelector(tipLabel);

    if (element) {
      const elementText = await element.textContent();
      if (elementText) {
        const amount = elementText.match(/\$([0-9.]+)/);
        const formattedAmount = amount ? amount[1] : "";
        return formattedAmount; // Return the formattedAmount value
      } else {
        console.error("Element with Xpath not found");
        return ""; // Return an empty string if elementText is empty
      }
    } else {
      console.error("Element with XPath not found");
      return ""; // Return an empty string if element is not found
    }
  }

  async addCoupon(couponText: string) {
    await waitForPageToLoad(this.page, {
      waitForNetworkIdle: false,
    });
    await this.couponInputField.focus();
    await this.couponInputField.fill(couponText);
    await this.couponSubmitButton.click();
  }

  async removeCoupon() {
    await this.removeDiscount.click();
  }

  async addGiftCard(giftCardNumber: string, cardPin: string) {
    await this.giftCardNumber.focus();
    await this.giftCardNumber.fill(giftCardNumber);
    await this.giftCardPin.focus();
    await this.giftCardPin.fill(cardPin);
    await this.page.keyboard.press("Enter");
    await this.page.waitForTimeout(3000);
  }

  async removeGiftCard() {
    await this.removeGiftCardButton.click();
  }

  async removeCreditCard() {
    if (this.payInSavedCreditCardRadioButton) {
      this.page.on("dialog", async (dialog) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await dialog.accept(); // Accept the confirm modal
      });

      await this.payInSavedCreditCardRadioButton.scrollIntoViewIfNeeded();
      const buttonSelector =
        'button[aria-label="Remove Visa ending in 1111 from your account"]';
      const removeCreditCardButton = await this.page.$(buttonSelector);

      if (removeCreditCardButton) {
        await removeCreditCardButton.click();
      } else {
        console.error("Remove Credit Card button not found.");
      }
    } else {
      console.error("Saved credit card not found");
    }
  }

  async clickOnPlaceOrderButton() {
    await this.placeOrderButton.click();
    await this.page.waitForURL(/order-confirmation/);
  }

  async clickOnPayInStore() {
    await this.payInStoreRadioButton.click();
    await expect(this.payInStoreRadioButton).toBeChecked();
  }

  async getAllMenus() {
    const menuElements = await this.menuListSection.allTextContents();
    return menuElements;
  }

  async getLocationName() {
    await this.locationName.waitFor();
    return this.locationName.textContent();
  }
  async getOrderTotal() {
    await this.orderTotalAmount.waitFor();
    return this.orderTotalAmount.textContent();
  }
  async getOrderDate() {
    await this.deliveryDateSelection.waitFor();
    return this.deliveryDateSelection.textContent();
  }
  async getOrderTime() {
    await this.deliveryTimeSelection.waitFor();
    return this.deliveryTimeSelection.textContent();
  }
}
