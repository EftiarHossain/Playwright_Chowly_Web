import { type Locator, type Page, expect } from "@playwright/test";
import { waitForPageToLoad } from "../utils";
import { type ProductDetails } from "e2e/pages/productDetails";

export class Basket {
  readonly page: Page;

  readonly productDetailsPage: ProductDetails;

  readonly checkoutButton: Locator;
  readonly changeLocationLink: Locator;
  readonly BackToMenuButton: Locator;
  readonly guestAmountInBasket: Locator;
  readonly receiptName: Locator;

  constructor(page: Page, productDetailsPage: ProductDetails) {
    this.page = page;
    this.productDetailsPage = productDetailsPage;

    this.checkoutButton = this.page.getByTestId("go-to-checkout-button");
    this.changeLocationLink = this.page.getByTestId("change-location-button");
    this.BackToMenuButton = this.page.locator(
      "//button[normalize-space()='Back to Menu']"
    );
    this.guestAmountInBasket = this.page.locator(
      "//div[@data-testid='basket-item']//div[1]//div[2]//span[3]"
    );
    this.receiptName = this.page.locator(
      "//div[@data-testid='basket-item']//div[1]//div[2]//p[1]"
    );
  }

  async clickCheckoutButton() {
    await this.checkoutButton.click();

    await this.page.waitForURL(/checkout/);
  }

  async clickChangeLocationLink() {
    await this.changeLocationLink.click();
  }

  async removeItem({ position }: { position: number }) {
    const numberOfItemsBefore = await this.getNumberOfItems();

    let removeItemButton: Locator;

    if (numberOfItemsBefore > 1) {
      removeItemButton = this.page
        .getByTestId("remove-item-button")
        .nth(position);
    } else {
      removeItemButton = this.page.getByTestId("remove-item-button");
    }

    await removeItemButton.waitFor({ state: "visible" });

    await removeItemButton.click();

    const removeItemModal = this.page.getByText("Remove item");

    await removeItemModal.waitFor({ state: "visible" });

    await this.page.getByText("Remove", { exact: true }).click();

    const numberOfItemsAfter = await this.getNumberOfItems();

    expect(numberOfItemsAfter).toBe(numberOfItemsBefore - 1);
  }

  async addCrossSellItem() {
    const numberOfItemsBefore = await this.getNumberOfItems();

    const number = await this.page.getByTestId("add-cross-sell-item").count();
    const crossSellItem = this.page
      .getByTestId("add-cross-sell-item")
      .nth(number - 1);

    await crossSellItem.waitFor({ state: "visible" });

    await crossSellItem.click();

    const numberOfItemsAfter = await this.getNumberOfItems();

    await waitForPageToLoad(this.page);

    expect(numberOfItemsAfter).toBe(numberOfItemsBefore + 1);
  }

  async clickOnProductItem({ position }: { position: number }) {
    const index = position - 1;
    const allItems = this.page.getByTestId("basket-item-label");
    const item = allItems.nth(index);

    await item.waitFor();

    await item.scrollIntoViewIfNeeded();

    await item.click();

    await expect(this.productDetailsPage.productDetailsModal).toBeVisible();
  }

  async getNumberOfItems() {
    return await this.page.getByTestId("basket-item").count();
  }
  async clickOnBackToMenuButton() {
    expect(this.BackToMenuButton).toBeVisible;
    await this.BackToMenuButton.click();
  }
}
