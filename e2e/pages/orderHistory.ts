import { type Locator, type Page } from "@playwright/test";
import { waitForPageToLoad } from "../utils";

export class OrderHistory {
  readonly page: Page;

  readonly orderHistoryFirstCard: Locator;
  readonly orderHistorySecondCard: Locator;
  readonly orderHistoryDate: Locator;
  readonly storeNameOnCard: Locator;
  readonly itemsOrdered: Locator;
  readonly itemsOrderedSecondCard: Locator;
  readonly viewReceipt: Locator;
  readonly reorderBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.orderHistoryFirstCard = page.locator(
      "//body[1]/div[1]/div[1]/div[1]/div[3]/div[1]/div[1]/div[1]/div[1]"
    );
    this.orderHistorySecondCard = page.locator(
      "//body[1]/div[1]/div[1]/div[1]/div[3]/div[1]/div[1]/div[1]/div[2]"
    );
    this.storeNameOnCard = page.locator(
      '//*[@id="start-of-content"]/div/div/div/div[1]/p'
    );
    this.orderHistoryDate = page.locator(
      "//body[1]/div[1]/div[1]/div[1]/div[3]/div[1]/div[1]/div[1]/div[1]/div[1]"
    );
    this.itemsOrdered = page.locator(
      "//body[1]/div[1]/div[1]/div[1]/div[3]/div[1]/div[1]/div[1]/div[1]/div[2]"
    );

    this.itemsOrderedSecondCard = page.locator(
      "//body[1]/div[1]/div[1]/div[1]/div[3]/div[1]/div[1]/div[1]/div[2]/div[2]"
    );

    this.viewReceipt = this.orderHistoryFirstCard.getByText("View Receipt");
    this.reorderBtn = this.orderHistoryFirstCard.getByText("Reorder");
  }

  async reorder() {
    await waitForPageToLoad(this.page);
    await this.orderHistoryFirstCard.isVisible();
    await this.reorderBtn.click();
  }

  async getMenuFromCart() {
    await waitForPageToLoad(this.page);
    await this.orderHistoryFirstCard.isVisible();
    const str = await this.itemsOrdered.allTextContents();
    return str;
  }

  async navigateToReceiptPage() {
    await waitForPageToLoad(this.page);
    await this.orderHistoryFirstCard.isVisible();
    await this.viewReceipt.click();
  }
}
