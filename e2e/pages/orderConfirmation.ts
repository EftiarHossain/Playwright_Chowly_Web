import { expect, type Locator, type Page } from "@playwright/test";

export class OrderConfirmation {
  readonly page: Page;

  readonly orderConfirmationHeader: Locator;
  readonly orderDetailsLocation: Locator;
  readonly checkoutCart: Locator;
  readonly checkoutTotalAmount: Locator;
  readonly orderDetailsPayment: Locator;
  readonly orderDetailsReceipt: Locator;
  readonly orderTotal: Locator;
  readonly menuListSection: Locator;

  constructor(page: Page) {
    this.page = page;

    this.orderConfirmationHeader = page.getByTestId("order-details-header");

    this.orderDetailsLocation = page.getByTestId("order-details-location");

    this.checkoutCart = page.getByTestId("checkout-cart-items");

    this.checkoutTotalAmount = page.getByTestId("checkout-total");

    this.orderDetailsPayment = page.getByTestId("order-payment-details");

    this.orderDetailsReceipt = page.getByTestId("receipt-details-container");

    this.menuListSection = this.page.getByTestId("basket-item-label");

    this.orderTotal = page.locator(
      '//*[@id="start-of-content"]/div/div/div/div[4]/div[2]/div/div[2]'
    );
  }

  async verifyPaymentInfo(text: string) {
    await this.orderDetailsPayment.isVisible();
    await expect(this.orderDetailsPayment).toContainText(text);
  }

  async verifyReceiptDetailsPresent() {
    await this.orderDetailsReceipt.isVisible();
  }

  async getMenuItems() {
    const menuElements = await this.menuListSection.allTextContents();
    return menuElements;
  }
}
